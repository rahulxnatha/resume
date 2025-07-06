let globalData = [];
let blockTexts = {};
let typoThreshold = 0.25;

window.onload = () => {
    fetch('status.xlsx')
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheet = workbook.Sheets["Sheet1"];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(2);

            globalData = rows.map(row => ({
                task: row[1],     // Column B
                info: row[2],     // Column C
                status: row[3],   // Column D
                id: row[4],       // Column E
                block: row[5] || ""  // Column F
            })).filter(row => row.task && row.info && row.status && row.id);

            blockTexts = {};
            globalData.forEach(d => blockTexts[d.id] = d.block);



            function updateTaskSummary(data) {
                const total = data.length;

                let completed = 0, processing = 0, canStart = 0, cantStart = 0;

                data.forEach(d => {
                    const s = d.status.toLowerCase();
                    if (s.includes("completed")) completed++;
                    else if (s.includes("processing")) processing++;
                    else if (s.includes("can start")) canStart++;
                    else if (s.includes("can't start") || s.includes("cannot start")) cantStart++;
                });

                const percent = count => total === 0 ? 0 : Math.round((count / total) * 100);

                const summary = `Recognised tasks: ${total} (${completed} completed [${percent(completed)}%], ${processing} processing [${percent(processing)}%], ${canStart} can start [${percent(canStart)}%], ${cantStart} can't start [${percent(cantStart)}%])`;

                document.getElementById("totalTasks").innerText = summary;
            }





            const excludeCompleted = globalData.filter(d => !d.status.toLowerCase().includes("completed"));
            renderTiles(excludeCompleted);
            // document.getElementById("totalTasks").innerText = `Recognised tasks: ${globalData.length}`;
            updateTaskSummary(globalData);

        });

    document.getElementById("togglePane").addEventListener("click", () => {
        document.getElementById("detailPane").classList.toggle("active");
    });

    const searchBox = document.getElementById("searchBox");
    //   const dropdown = document.getElementById("customDropdown");

    //   searchBox.addEventListener("focus", () => dropdown.style.display = "block");
    //   document.addEventListener("click", e => {
    // if (!e.target.closest(".dropdown-wrapper")) dropdown.style.display = "none";
    //   });

    //   dropdown.querySelectorAll("div").forEach(item => {
    // item.addEventListener("click", () => {
    //   searchBox.value = item.getAttribute("data-filter");
    //   handleSearch();
    //   dropdown.style.display = "none";
    // });
    //   });

    searchBox.addEventListener("keydown", e => {
        if (e.key === "Enter") handleSearch();
    });

    // Auto apply dark theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle("dark", isDark);
};

function renderTiles(data) {
    const container = document.getElementById("tileContainer");
    container.innerHTML = "";

    data.forEach(d => {
        const tile = document.createElement("div");
        tile.className = "task-tile";
        tile.id = `tile@${d.id}`;
        tile.innerHTML = `
      <div>${d.task}</div>
      <div>${d.info}</div>
      <div>${d.status}</div>
    `;
        tile.addEventListener("click", () => {
            showPaneContent(d.id);
            history.pushState(null, "", `?id=${d.id}`);


            // Remove existing selection
            document.querySelectorAll('.task-tile').forEach(t => t.classList.remove('selected'));

            // Add selection to clicked tile
            tile.classList.add('selected');


        });
        container.appendChild(tile);
    });
}

function showPaneContent(id) {
    const block = blockTexts[id] || "No details available.";
    document.getElementById("paneContent").innerText = block;
}

function handleSearch() {
    const input = document.getElementById("searchBox").value.trim().toLowerCase();
    const note = document.getElementById("searchNote");
    let corrected = input;
    let matches = [];
    let fallback = [];

    globalData.forEach(d => {
        const combined = `${d.task} ${d.info} ${d.status}`.toLowerCase();
        const block = d.block.toLowerCase();

        if (input === "all") matches.push(d);
        else if (input === "completed" && d.status.toLowerCase().includes("completed")) matches.push(d);
        else if (input === "processing" && d.status.toLowerCase().includes("processing")) matches.push(d);
        else if (input === "can start" && d.status.toLowerCase().includes("can start")) matches.push(d);
        else if (input === "can't start" && d.status.toLowerCase().includes("can't start")) matches.push(d);
        else if (combined.includes(input)) matches.push(d);
        else if (block.includes(input)) fallback.push(d);
        else if (levenshtein(input, combined) <= Math.floor(combined.length * typoThreshold)) {
            corrected = d.task;
            matches.push(d);
        } else if (levenshtein(input, block) <= Math.floor(block.length * typoThreshold)) {
            fallback.push(d);
        }
    });

    renderTiles([...matches, ...fallback]);
    note.innerText = corrected !== input ? `Searched for "${corrected}" instead of "${input}".` : "";
}

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;

    const dp = Array(m + 1).fill().map(() => []);
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }

    return dp[m][n];
}







function updateVisiblePills() {
    const current = document.getElementById("searchBox").value.trim().toLowerCase();
    document.querySelectorAll(".pill").forEach(pill => {
        const text = pill.dataset.filter.toLowerCase();
        pill.style.display = (!current || text !== current) ? "inline-block" : "none";
    });
}


document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
        const value = pill.dataset.filter;
        const searchBox = document.getElementById("searchBox");
        searchBox.value = value;
        // searchTasks(); 

        handleSearch();
        updateVisiblePills(); // update pills after setting value
    });
});



