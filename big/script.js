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

const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", () => {
    updateVisiblePills(); // 👈 call it on every keystroke
});


function renderTiles(data) {
    const container = document.getElementById("tileContainer");
    container.innerHTML = "";

    data.forEach(d => {
        const tile = document.createElement("div");
        tile.className = "task-tile";
        tile.id = `tile@${d.id}`;

        // --- Compute progress percent and label ---
        let progressPercent = 0;
        let progressText = "";
        let statusLine = d.status;

        if (/^completed/i.test(d.status)) {
            progressPercent = 100;
            progressText = "✅ Completed: 100%";
        } else if (/^can start/i.test(d.status)) {
            progressPercent = 20;
            progressText = "🟢 Can start: 20%";
        } else if (/^can't start/i.test(d.status)) {
            progressPercent = 0;
            progressText = "🔴 Can't start: 0%";
        } else if (/started:\s*(\d{4}-\d{2}-\d{2}).*estimated completion:\s*(\d{4}-\d{2}-\d{2})/i.test(d.status)) {
            const match = d.status.match(/started:\s*(\d{4}-\d{2}-\d{2}).*estimated completion:\s*(\d{4}-\d{2}-\d{2})/i);
            if (match) {
                const start = new Date(match[1]);
                const end = new Date(match[2]);
                const now = new Date();
                const total = end - start;
                const elapsed = Math.max(0, now - start);
                let raw = Math.min(1, elapsed / total);
                progressPercent = Math.round(21 + raw * (99 - 21)); // Scale 21-99%
                progressText = `🔄 Processing: ${progressPercent}%`;
            }
        }

        // --- Now set the innerHTML safely --- // <div>${statusLine}</div>
        tile.innerHTML = `
            <div class="tile-content">
                <div>${d.task}</div>
                <div>${d.info}</div>
                
            </div>
            <div class="progress-wrapper">
                <div class="progress-text">${progressText}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
        `;

        // --- Tile selection and preview logic ---
        tile.addEventListener("click", () => {
            showPaneContent(d.id);
            history.pushState(null, "", `?id=${d.id}`);
            document.querySelectorAll('.task-tile').forEach(t => t.classList.remove('selected'));
            tile.classList.add('selected');
        });

        container.appendChild(tile);
    });
}



function generateStatusHTML(statusText) {
    if (statusText.toLowerCase().includes("completed")) return "✅ Completed";
    if (statusText.toLowerCase().includes("can't start")) return "🚫 Can't start";
    if (statusText.toLowerCase().includes("can start")) return "🟢 Can start (20%)";

    // Match pattern like: Started: 2025-07-01 and processing, estimated completion: 2025-08-01
    const match = statusText.match(/Started:\s*(\d{4}-\d{2}-\d{2}).*estimated completion:\s*(\d{4}-\d{2}-\d{2})/);
    if (match) {
        const start = match[1], end = match[2];
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const progress = calculateProgressPercent(start, end, today);
        return `🔄 Processing: ${progress}% <div class="progress-bar"><div class="fill" style="width:${progress}%"></div></div>`;
    }

    return statusText;
}

function calculateProgressPercent(start, end, today) {
    const s = new Date(start), e = new Date(end), t = new Date(today);
    const total = (e - s), done = (t - s);
    return total <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(done / total * 100)));
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



/////////////////////////////// TIME

window.addEventListener("load", () => {
    const titleDiv = document.getElementById("title");
    const now = new Date();

    function formatDateTime(timeZone) {
        const options = {
            timeZone,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            hour12: false
        };
        const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
        const get = type => parts.find(p => p.type === type).value;
        return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
    }

    function getUtcOffset(tz) {
        const localTime = new Date();
        const utcTime = new Date(localTime.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzTime = new Date(localTime.toLocaleString('en-US', { timeZone: tz }));
        const offsetMinutes = (tzTime - utcTime) / 60000;
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const absMin = Math.abs(offsetMinutes);
        const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
        const minutes = String(absMin % 60).padStart(2, '0');
        return `UTC${sign}${hours}:${minutes}`;
    }

    const istTime = formatDateTime("Asia/Kolkata");
    const deTime = formatDateTime("Europe/Berlin");

    const deZone = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        timeZoneName: 'short'
    }).formatToParts(now).find(p => p.type === 'timeZoneName').value;

    const deOffset = getUtcOffset("Europe/Berlin");
    const istOffset = getUtcOffset("Asia/Kolkata");

    const zoneTooltip = (deZone === "CEST")
        ? `CEST (${deOffset}) — last Sunday in March 02:00 CET to the last Sunday in October 03:00 CEST\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`
        : `CET (${deOffset}) — last Sunday in October 03:00 CEST to the last Sunday in March 02:00 CET\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`;

    titleDiv.innerHTML = `Task Dashboard as of ${istTime} IST <span title="${istOffset}"> </span>; <span title="${zoneTooltip}">${deTime} ${deZone}</span>`;
});
