let globalData = [];
let blockTexts = {};
let typoThreshold = 0.25;

window.onload = () => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1CiJwmxOffFdaX9ZNxMrw4a8MODt6GsTn8bs7vsSGJ3o/gviz/tq?tqx=out:csv&sheet=Sheet1";

    fetch(csvUrl)
        .then(res => res.text())
        .then(csvText => {
            const rows = Papa.parse(csvText.trim(), { skipEmptyLines: true }).data.slice(2);

            globalData = rows.map(row => ({
                task: row[1],
                info: row[2],
                status: row[3],
                id: row[4],
                block: row[5] || "",
                dueDateUTC: row[6] || null
            })).filter(d => d.task && d.info && d.status && d.id);

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
            // renderTiles(excludeCompleted);


            renderTiles(unifiedSort(excludeCompleted));





            updateTaskSummary(globalData);

            // URL state restore
            const params = new URLSearchParams(window.location.search);
            const search = params.get("search");
            if (search) {
                document.getElementById("searchBox").value = search;
                handleSearch();
            }
            const sel = params.get("id");
            if (sel) {
                const tile = document.getElementById(`tile@${sel}`);
                if (tile) {
                    tile.scrollIntoView({ behavior: "smooth", block: "center" });
                    tile.click();
                }
            }
        });

    document.getElementById("togglePane").addEventListener("click", () => {
        document.getElementById("detailPane").classList.toggle("active");
    });

    const searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("keydown", e => {
        if (e.key === "Enter") handleSearch();
    });

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", isDark);

    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get("search");
    if (initialSearch) {
        const searchBox = document.getElementById("searchBox");
        searchBox.value = initialSearch;
        handleSearch();
    }
};

searchBox.addEventListener("input", () => {
    updateVisiblePills();
});

function renderTiles(data) {
    const container = document.getElementById("tileContainer");
    container.innerHTML = "";

    data.forEach(d => {
        const tile = document.createElement("div");
        // tile.className = "task-tile";


        // Due date logic
        let dueNote = "";
        let dueClass = "";
        if (d.dueDateUTC) {
            const statusLower = d.status.toLowerCase();
            if (!statusLower.includes("completed")) {
                const due = new Date(d.dueDateUTC + "Z");
                const now = new Date();
                const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
                const dayDiff = Math.floor((dueDay - today) / (1000 * 60 * 60 * 24));

                if (dayDiff < 0) {
                    dueNote = "🔴 Past due";
                    dueClass = "due-red";
                } else if (dayDiff === 0) {
                    dueNote = "🟠 Due today";
                    dueClass = "due-red";
                } else if (dayDiff === 1) {
                    dueNote = "🟡 Due tomorrow";
                    dueClass = "due-red";
                } else if (dayDiff <= 5) {
                    dueNote = `🔵 Due in ${dayDiff} days`;
                    dueClass = "due-soon";
                } else {
                    dueNote = `🟢 Due in ${dayDiff} days`;
                    dueClass = "due-normal";
                }
            }
        }


        if (/^completed/i.test(d.status)) {
            dueClass = "due-completed";
        }








        tile.className = `task-tile ${dueClass}`;

        tile.id = `tile@${d.id}`;

        // Progress bar logic
        let progressPercent = 0;
        let progressText = "";

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





        tile.innerHTML = `
            <div class="tile-content">
                <div>${d.task}</div>
                <div style="color: grey; margin-top: 4px;">${d.info}</div>
                
                ${dueNote ? `<div class="due-note">${dueNote}</div>` : ""}
                

            </div>
            <div class="progress-wrapper">
                <div class="progress-text">${progressText}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
        `;

        tile.addEventListener("click", () => {
            showPaneContent(d.id);
            const params = new URLSearchParams(window.location.search);
            params.set("id", d.id);
            history.pushState(null, "", `?${params.toString()}`);
            document.querySelectorAll('.task-tile').forEach(t => t.classList.remove('selected'));
            tile.classList.add('selected');
        });

        container.appendChild(tile);
    });
}


// llllllllllll

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

        // if (input === "all") matches.push(d);
        if (input === "all") matches.push(d); // keep this line


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






    renderTiles(unifiedSort([...matches, ...fallback]));

















    // renderTiles([...matches, ...fallback]);
    note.innerText = corrected !== input ? `Searched for "${corrected}" instead of "${input}".` : "";


    // Update URL with search param
    const url = new URL(window.location);
    url.searchParams.set("search", input);
    history.replaceState(null, "", url.toString());


    // urlParams.set("search", input);


    //     const inputBox = document.getElementById("searchBox");
    // const rawInput = inputBox.value.trim(); // Original case
    // urlParams.set("search", rawInput);
    // history.replaceState(null, '', `${location.pathname}?${urlParams.toString()}`);



}

// const searchBoxValue = document.getElementById("searchBox").value.trim().toLowerCase();
// if (searchBoxValue) {
//     const tiles = Array.from(document.querySelectorAll(".task-tile"));
//     renderTiles(unifiedSort(globalData.filter(d => {
//         const text = `${d.task} ${d.info} ${d.status}`.toLowerCase();
//         return text.includes(searchBoxValue);
//     })));
// }




function unifiedSort(tasks) {
    return tasks.slice().sort((a, b) => {
        const rank = t => {
            const isCompleted = t.status.toLowerCase().includes("completed");
            const isProcessing = t.status.toLowerCase().includes("processing");
            const isCanStart = t.status.toLowerCase().includes("can start");
            const isCantStart = t.status.toLowerCase().includes("can't start") || t.status.toLowerCase().includes("cannot start");

            let dueCategory = 2; // 0 = red due, 1 = other known due, 2 = no due
            if (t.dueDateUTC && !isCompleted) {
                const due = new Date(t.dueDateUTC + "Z");
                const now = new Date();
                const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
                const dayDiff = Math.floor((dueDay - today) / (1000 * 60 * 60 * 24));

                if (dayDiff <= 1) dueCategory = 0; // Red (today, tomorrow, or past)
                else dueCategory = 1;              // Known due but not red
            }

            const statusRank = isProcessing ? 0 : isCanStart ? 1 : isCantStart ? 2 : 3;
            const finalDueRank = isCompleted ? 3 : dueCategory;

            return [finalDueRank, statusRank, t.task.toLowerCase()];
        };

        const aRank = rank(a);
        const bRank = rank(b);

        for (let i = 0; i < aRank.length; i++) {
            if (aRank[i] < bRank[i]) return -1;
            if (aRank[i] > bRank[i]) return 1;
        }

        return 0;
    });
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

// window.addEventListener("load", () => {
//     const titleDiv = document.getElementById("title");
//     const now = new Date();

//     function formatDateTime(timeZone) {
//         const options = {
//             timeZone,
//             year: 'numeric', month: '2-digit', day: '2-digit',
//             hour: '2-digit', minute: '2-digit',
//             hour12: false
//         };
//         const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
//         const get = type => parts.find(p => p.type === type).value;
//         return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
//     }

//     function getUtcOffset(tz) {
//         const localTime = new Date();
//         const utcTime = new Date(localTime.toLocaleString('en-US', { timeZone: 'UTC' }));
//         const tzTime = new Date(localTime.toLocaleString('en-US', { timeZone: tz }));
//         const offsetMinutes = (tzTime - utcTime) / 60000;
//         const sign = offsetMinutes >= 0 ? '+' : '-';
//         const absMin = Math.abs(offsetMinutes);
//         const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
//         const minutes = String(absMin % 60).padStart(2, '0');
//         return `UTC${sign}${hours}:${minutes}`;
//     }

//     const istTime = formatDateTime("Asia/Kolkata");
//     const deTime = formatDateTime("Europe/Berlin");

//     const deZone = new Intl.DateTimeFormat('en-GB', {
//         timeZone: 'Europe/Berlin',
//         timeZoneName: 'short'
//     }).formatToParts(now).find(p => p.type === 'timeZoneName').value;

//     const deOffset = getUtcOffset("Europe/Berlin");
//     const istOffset = getUtcOffset("Asia/Kolkata");

//     const zoneTooltip = (deZone === "CEST")
//         ? `CEST (${deOffset}) — last Sunday in March 02:00 CET to the last Sunday in October 03:00 CEST\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`
//         : `CET (${deOffset}) — last Sunday in October 03:00 CEST to the last Sunday in March 02:00 CET\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`;

//     titleDiv.innerHTML = `Rahul Natha's Task Dashboard as of ${istTime} IST <span title="${istOffset}"> </span>; <span title="${zoneTooltip}">${deTime} ${deZone}</span>. Default date time format is YYYY-MM-DD HH:MM format`;
// });




// SORT BY 


window.addEventListener("load", () => {
    const titleDiv = document.getElementById("title");
    const loadTime = new Date();  // Capture the load time once

    function formatDateTime(timeZone) {
        const options = {
            timeZone,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            hour12: false
        };
        const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(loadTime);
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

    function minutesAgo(date) {
        const diffMs = new Date() - date;
        const mins = Math.floor(diffMs / 60000);
        return mins === 0 ? "just now" : `${mins} min${mins === 1 ? "" : "s"} ago`;
    }

    const istTime = formatDateTime("Asia/Kolkata");
    const deTime = formatDateTime("Europe/Berlin");

    const deZone = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        timeZoneName: 'short'
    }).formatToParts(loadTime).find(p => p.type === 'timeZoneName').value;

    const deOffset = getUtcOffset("Europe/Berlin");
    const istOffset = getUtcOffset("Asia/Kolkata");

    const zoneTooltip = (deZone === "CEST")
        ? `CEST (${deOffset}) — last Sunday in March 02:00 CET to the last Sunday in October 03:00 CEST\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`
        : `CET (${deOffset}) — last Sunday in October 03:00 CEST to the last Sunday in March 02:00 CET\n[expressed in YYYY-MM-DD HH:MM TIMEZONE]`;

    titleDiv.innerHTML = `
        Task Dashboard as of ${istTime} IST ; 
        <span title="${zoneTooltip}">${deTime} ${deZone}</span> 
        
    `;
















    const updatedSpan = document.createElement("span");
    updatedSpan.style.marginLeft = "0px";
    titleDiv.appendChild(updatedSpan);

    const lastUpdated = new Date(); // Timestamp of dashboard load

    function updateStopwatchLabel() {
        const now = new Date();
        const diff = now - lastUpdated;

        let text = "";
        if (diff < 1000) {
            text = `Updated ${diff} ms ago`;
        } else if (diff < 5000) {
            text = `Updated ${Math.floor(diff / 1000)} sec${diff < 2000 ? "" : "s"} ago`;
        } else if (diff < 10000) {
            text = `Updated at least 5 secs ago`;
        } else if (diff < 15000) {
            text = `Updated at least 10 secs ago`;
        } else if (diff < 20000) {
            text = `Updated at least 15 secs ago`;
        } else if (diff < 40000) {
            text = `Updated at least 20 secs ago`;
        } else if (diff < 60000) {
            text = `Updated at least 40 secs ago`;
        } else if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            text = `Updated at least ${mins} min${mins === 1 ? "" : "s"} ago`;
        } else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            text = `Updated at least ${hours} hour${hours === 1 ? "" : "s"} ago`;
        } else {
            const days = Math.floor(diff / 86400000);
            text = `Updated at least ${days} day${days === 1 ? "" : "s"} ago`;
        }

        updatedSpan.textContent = `(${text})`;
    }

    // Start stopwatch updates every 500 ms
    // setInterval(updateStopwatchLabel, 500);






    function startSmartStopwatch() {
    let lastDiff = -1;

    function loop() {
        const now = new Date();
        const diff = now - lastUpdated;

        updateStopwatchLabel();

        let nextDelay;
        if (diff < 1000) {
            nextDelay = 1; // Update every ms
        } else if (diff < 5000) {
            nextDelay = 500;
        } else {
            nextDelay = 1000;
        }

        setTimeout(loop, nextDelay);
    }

    loop(); // Kick off the loop
}

startSmartStopwatch();



});

