let currentSheetId = "";
let currentDashboardLabel = "";
let globalData = [];
let globalTimelineData = [];
let blockTexts = {};
let typoThreshold = 0.25;
const CACHE_KEY = 'dashboard_data';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

document.getElementById('rememberMeCheckbox').checked = true;

function getCachedData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    return null;
}

function setCachedData(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

function fetchAndRenderData() {
    const cachedData = getCachedData();
    if (cachedData) {
        globalData = cachedData.tasks;
        globalTimelineData = cachedData.timeline;
        blockTexts = cachedData.briefs;
        renderCurrentView();
        return;
    }

    if (!currentSheetId) {
        console.error("Sheet ID is not set.");
        showError("Please set a valid Google Sheet ID.");
        return;
    }

    const tasksUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
    const timelineUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=Timeline`;

    Promise.all([
        fetch(tasksUrl).then(res => res.text()).catch(err => { console.error("Tasks fetch error:", err); return ""; }),
        fetch(timelineUrl).then(res => res.text()).catch(err => { console.error("Timeline fetch error:", err); return ""; })
    ])
        .then(([tasksCsv, timelineCsv]) => {
            if (!window.Papa) {
                console.error("PapaParse library is missing.");
                showError("Failed to load data: PapaParse library missing.");
                return;
            }

            // Process Tasks tab
            const taskRows = tasksCsv ? Papa.parse(tasksCsv.trim(), { skipEmptyLines: true }).data.slice(2) : [];
            globalData = taskRows.map(row => ({
                task: row[1] || "",
                info: row[2] || "",
                status: row[3] || "",
                id: row[4] || `task${taskRows.indexOf(row) + 1}`,
                block: row[5] || "",
                dueDateUTC: row[6] || null
            })).filter(d => d.task && d.info && d.status && d.id);

            // Process Timeline tab
            const timelineRows = timelineCsv ? Papa.parse(timelineCsv.trim(), { skipEmptyLines: true }).data.slice(1) : [];
            globalTimelineData = timelineRows.map((row, index) => ({
                id: row[0] || `timeline${index + 1}`,
                stage: row[1] || "",
                description: row[2] || "",
                amountSpent: row[3] ? parseFloat(row[3].replace(/[^0-9.]/g, '')).toFixed(2) : "0.00",
                amountRequired: row[4] ? parseFloat(row[4].replace(/[^0-9.]/g, '')).toFixed(2) : "0.00",
                startDate: row[5] || null,
               'endDate': row[6] || null
            })).filter(d => d.stage && d.stage.toLowerCase() !== "total");

            // Map brief texts
            blockTexts = {};
            globalData.forEach(d => blockTexts[d.id] = d.block);
            globalTimelineData.forEach(d => blockTexts[d.id] = d.description);

            // Cache data
            setCachedData({ tasks: globalData, timeline: globalTimelineData, briefs: blockTexts });

            renderCurrentView();
        })
        .catch(err => {
            console.error("Error processing data:", err);
            showError("Failed to load data. Please check your connection or Sheet ID.");
        });
}

function showError(message) {
    document.getElementById("tileContainer").innerHTML = `<div class="stage-bar error"><div>${message}</div></div>`;
    document.getElementById("timeline-container").innerHTML = `<div class="stage-bar error"><div>${message}</div></div>`;
}

function renderCurrentView() {
    const isTimelineActive = localStorage.getItem('activeTab') === 'timeline';
    const pillTimeline = document.getElementById("pill-timeline");
    const pillTasks = document.getElementById("pill-tasks");
    const tileContainer = document.getElementById("tileContainer");
    const timelineContainer = document.getElementById("timeline-container");

    if (isTimelineActive) {
        pillTimeline.classList.add("active-tab");
        pillTasks.classList.remove("active-tab");
        tileContainer.style.display = "none";
        timelineContainer.style.display = "flex";
        renderTimeline(globalTimelineData);
    } else {
        pillTasks.classList.add("active-tab");
        pillTimeline.classList.remove("active-tab");
        tileContainer.style.display = "grid";
        timelineContainer.style.display = "none";
        const excludeCompleted = globalData.filter(d => !d.status.toLowerCase().includes("completed"));
        renderTiles(unifiedSort(excludeCompleted));
    }

    updateTaskSummary(globalData);

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
        document.getElementById("searchBox").value = search;
        handleSearch();
    }
    const sel = params.get("id");
    if (sel && blockTexts[sel]) {
        const tile = document.getElementById(`tile@${sel}`);
        if (tile) {
            tile.scrollIntoView({ behavior: "smooth", block: "center" });
            tile.click();
        }
    }
}

function renderTimeline(data) {
    const container = document.getElementById("timeline-container");
    container.innerHTML = "";
    if (!data || !data.length) {
        container.innerHTML = `<div class="stage-bar error"><div>No timeline data available. Check Google Sheets "Timeline" tab.</div></div>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    const now = new Date("2025-08-07T21:53:00+05:30"); // Current IST time
    const sortedData = data.slice().sort((a, b) => {
        if (!a.endDate || !b.endDate) return 0;
        return new Date(a.endDate) - new Date(b.endDate);
    });
    sortedData.forEach((d, index) => {
        if (!d.stage) return;
        let dateClass = "future";
        let dateText = "No end date";
        let daysRemaining = "";
        if (d.endDate) {
            const end = new Date(d.endDate);
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            const diffTime = endDay - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include end date, exclude today
            daysRemaining = diffDays >= 0 ? ` (${diffDays} days)` : "";
            dateText = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}${daysRemaining}`;
            if (end < now) {
                dateClass = "past-due";
                dateText += " (Past due)";
            } else if (d.startDate && new Date(d.startDate) <= now) {
                dateClass = "current";
                dateText += " (In progress)";
            }
        }
        const stageBar = document.createElement("div");
        stageBar.className = `stage-bar ${dateClass}`;
        stageBar.id = `tile@${d.id}`;
        stageBar.innerHTML = `
            <div class="stage-name">${d.stage}</div>
            <div class="amounts">${d.amountSpent}/${d.amountRequired}</div>
            <div class="dates">${dateText}</div>
            <div class="view-tasks">View Tasks</div>
        `;
        stageBar.addEventListener("click", (e) => {
            if (!e.target.classList.contains("view-tasks")) {
                showPaneContent(d.id);
                const params = new URLSearchParams(window.location.search);
                params.set("id", d.id);
                history.pushState(null, "", `?${params.toString()}`);
                document.querySelectorAll('.stage-bar, .task-tile').forEach(t => t.classList.remove('selected'));
                stageBar.classList.add('selected');
            }
        });
        stageBar.querySelector(".view-tasks").addEventListener("click", () => {
            const searchTerm = d.stage; // Search by exact stage name
            document.getElementById("searchBox").value = searchTerm;
            document.getElementById("pill-tasks").click();
            handleSearch();
        });
        fragment.appendChild(stageBar);
    });
    container.appendChild(fragment);
}

function handleSearch() {
    const input = document.getElementById("searchBox").value.trim().toLowerCase();
    const note = document.getElementById("searchNote");
    let corrected = input;
    let matches = [];
    let fallback = [];

    if (document.getElementById("pill-timeline").classList.contains("active-tab")) {
        globalTimelineData.forEach(d => {
            const combined = `${d.stage}`.toLowerCase();
            if (input === "all") matches.push(d);
            else if (combined.includes(input)) matches.push(d);
            else if (levenshtein(input, combined) <= Math.floor(combined.length * typoThreshold)) {
                corrected = d.stage;
                matches.push(d);
            }
        });
        renderTimeline(matches);
    } else {
        globalData.forEach(d => {
            const combined = `${d.task} ${d.info} ${d.status}`.toLowerCase();
            const block = blockTexts[d.id] ? blockTexts[d.id].toLowerCase() : "";
            if (input === "all") matches.push(d);
            else if (input === "completed" && d.status.toLowerCase().includes("completed")) matches.push(d);
            else if (input === "processing" && d.status.toLowerCase().includes("processing")) matches.push(d);
            else if (input === "can start" && d.status.toLowerCase().includes("can start")) matches.push(d);
            else if (input === "can't start" && d.status.toLowerCase().includes("can't start")) matches.push(d);
            else if (combined.includes(input)) matches.push(d);
            else if (block.includes(input)) matches.push(d); // Search brief text
            else if (levenshtein(input, combined) <= Math.floor(combined.length * typoThreshold)) {
                corrected = d.task;
                matches.push(d);
            } else if (block && levenshtein(input, block) <= Math.floor(block.length * typoThreshold)) {
                corrected = d.task;
                matches.push(d);
            }
        });
        renderTiles(unifiedSort(matches));
    }

    note.innerText = corrected !== input ? `Searched for "${corrected}" instead of "${input}".` : "";
    const url = new URL(window.location);
    url.searchParams.set("search", input);
    history.replaceState(null, "", url.toString());
}

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

const pillTasks = document.getElementById("pill-tasks");
const pillTimeline = document.getElementById("pill-timeline");
const tileContainer = document.getElementById("tileContainer");
const timelineContainer = document.getElementById("timeline-container");

pillTasks.dataset.filter = "tasks";
pillTimeline.dataset.filter = "timeline";

pillTasks.addEventListener("click", () => {
    pillTasks.classList.add("active-tab");
    pillTimeline.classList.remove("active-tab");
    tileContainer.style.display = "grid";
    timelineContainer.style.display = "none";
    localStorage.setItem('activeTab', 'tasks');
    const excludeCompleted = globalData.filter(d => !d.status.toLowerCase().includes("completed"));
    renderTiles(unifiedSort(excludeCompleted));
});

pillTimeline.addEventListener("click", () => {
    pillTimeline.classList.add("active-tab");
    pillTasks.classList.remove("active-tab");
    tileContainer.style.display = "none";
    timelineContainer.style.display = "flex";
    localStorage.setItem('activeTab', 'timeline');
    renderTimeline(globalTimelineData);
});

document.getElementById("syncBtn").addEventListener("click", () => {
    localStorage.removeItem(CACHE_KEY);
    fetchAndRenderData();
    DateAndSync();
});

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("dashboardKeyInput");
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get("key");
    const savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");
    const lastUsedKey = localStorage.getItem("lastUsedDashboardKey");
    populateKeyDropdown(savedKeys);
    if (urlKey && urlKey.length === 15) {
        handleDashboardKey(urlKey, false).then(success => {
            if (success) {
                const newParams = new URLSearchParams(urlParams);
                newParams.delete("key");
                const newQueryString = newParams.toString();
                const newUrl = newQueryString
                    ? `${window.location.pathname}?${newQueryString}`
                    : window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }
        });
        return;
    }
    if (lastUsedKey && savedKeys[lastUsedKey]) {
        const { sheetId, label, subscription } = savedKeys[lastUsedKey];
        currentSheetId = sheetId;
        currentDashboardLabel = label;
        const subscriptionSpan = document.getElementById("subscription-type");
        if (subscriptionSpan) {
            subscriptionSpan.textContent = subscription || "No subscription specified";
        } else {
            console.warn("Element with id='subscription-type' not found in the DOM.");
        }
        input.value = label;
        input.setAttribute("data-key", lastUsedKey);
        input.readOnly = true;
        document.getElementById("rememberMeContainer").style.display = "none";
        document.getElementById("dashboardKeyDropdown").style.display = "none";
        document.getElementById("empty-state")?.remove();
        fetchAndRenderData();
    } else if (Object.keys(savedKeys).length === 0 && !urlKey) {
        document.getElementById("tileContainer").innerHTML = `
            <div id="empty-state">🔑 Please enter a dashboard key to begin.</div>
        `;
    }
    setupEditContentButton();
});

async function handleDashboardKey(rawKey, forceRemember = false) {
    const input = document.getElementById("dashboardKeyInput");
    const key = rawKey || input.getAttribute("data-key") || input.value.trim().toUpperCase();
    if (key.length !== 15) return false;
    const remember = forceRemember || document.getElementById("rememberMeCheckbox")?.checked;
    const keysSheetUrl = "https://docs.google.com/spreadsheets/d/1CiJwmxOffFdaX9ZNxMrw4a8MODt6GsTn8bs7vsSGJ3o/gviz/tq?tqx=out:csv&sheet=Keys";
    try {
        const response = await fetch(keysSheetUrl);
        const csv = await response.text();
        const rows = csv.trim().split("\n").slice(2);
        for (let row of rows) {
            const cells = row.split(",");
            const keyFromSheet = (cells[1] || "").replace(/['"]/g, "").trim().toUpperCase();
            const sheetId = (cells[2] || "").replace(/['"]/g, "").trim();
            const label = (cells[3] || "").replace(/['"]/g, "").trim();
            const subscription = (cells[4] || "").replace(/['"]/g, "").trim();
            if (keyFromSheet === key) {
                currentSheetId = sheetId;
                currentDashboardLabel = label;
                const subscriptionSpan = document.getElementById("subscription-type");
                if (subscriptionSpan) {
                    subscriptionSpan.textContent = subscription || "No subscription specified";
                } else {
                    console.warn("Element with id='subscription-type' not found in the DOM.");
                }
                const savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");
                if (remember) {
                    savedKeys[key] = { sheetId, label, subscription };
                    localStorage.setItem("dashboardKeys", JSON.stringify(savedKeys));
                    localStorage.setItem("lastUsedDashboardKey", key);
                }
                sessionStorage.setItem("lastUsedDashboardKey", key);
                sessionStorage.setItem("lastUsedDashboardLabel", label);
                populateKeyDropdown(savedKeys);
                input.value = label;
                input.setAttribute("data-key", key);
                input.readOnly = true;
                document.getElementById("rememberMeContainer").style.display = "none";
                document.getElementById("empty-state")?.remove();
                fetchAndRenderData();
                return true;
            }
        }
        alert("Invalid dashboard key.");
        return false;
    } catch (err) {
        console.error("Error reading Keys sheet:", err);
        alert("Failed to verify the dashboard key.");
        return false;
    }
}

function populateKeyDropdown(savedKeys) {
    const dropdown = document.getElementById("dashboardKeyDropdown");
    dropdown.innerHTML = "";
    const cleanedKeys = {};
    Object.entries(savedKeys).forEach(([key, value]) => {
        if (!value?.label || !value?.sheetId) return;
        cleanedKeys[key] = value;
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="key-label">${value.label}</span>
            <span class="delete-key" data-key="${key}">🗙</span>
        `;
        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-key")) return;
            const input = document.getElementById("dashboardKeyInput");
            input.value = value.label;
            input.setAttribute("data-key", key);
            handleDashboardKey(key, true);
            dropdown.style.display = "none";
        });
        dropdown.appendChild(li);
    });
    dropdown.style.display = Object.keys(cleanedKeys).length ? "block" : "none";
}

const keyInput = document.getElementById("dashboardKeyInput");
keyInput.addEventListener("focus", function () {
    const savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");
    populateKeyDropdown(savedKeys);
    this.readOnly = false;
    this.value = "";
    document.getElementById("rememberMeContainer").style.display = "block";
    document.getElementById("dashboardKeyDropdown").style.display = "block";
});

document.addEventListener("click", function (e) {
    const input = document.getElementById("dashboardKeyInput");
    const dropdown = document.getElementById("dashboardKeyDropdown");
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

keyInput.addEventListener("input", function () {
    const value = this.value.trim().toUpperCase();
    const savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");
    if (value.length === 15) {
        handleDashboardKey(value);
        document.getElementById("dashboardKeyDropdown").style.display = "none";
    } else if (value.length >= 3) {
        const matches = {};
        for (let key in savedKeys) {
            const label = savedKeys[key].label.toUpperCase();
            if (key.includes(value) || label.includes(value)) {
                matches[key] = savedKeys[key];
            }
        }
        populateKeyDropdown(matches);
    } else {
        document.getElementById("dashboardKeyDropdown").style.display = "none";
    }
});

document.getElementById("dashboardKeyDropdown").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-key")) {
        const keyToDelete = e.target.getAttribute("data-key");
        let savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");
        delete savedKeys[keyToDelete];
        localStorage.setItem("dashboardKeys", JSON.stringify(savedKeys));
        if (localStorage.getItem("lastUsedDashboardKey") === keyToDelete) {
            localStorage.removeItem("lastUsedDashboardKey");
        }
        populateKeyDropdown(savedKeys);
    }
});

function setupEditContentButton() {
    function attachEventListener() {
        const editContentBtn = document.getElementById("editContentBtn");
        if (editContentBtn) {
            editContentBtn.addEventListener("click", () => {
                if (currentSheetId) {
                    const sheetUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/edit`;
                    console.log(`Attempting to open sheet URL: ${sheetUrl}`);
                    const newWindow = window.open(sheetUrl, "_blank");
                    if (!newWindow) {
                        console.warn("Failed to open new tab. Pop-up blocker may be enabled.");
                        alert("Unable to open the sheet. Please ensure pop-ups are allowed and try again.");
                    }
                } else {
                    console.warn("No sheet ID available for editing. Current sheetId:", currentSheetId);
                    alert("No sheet ID available. Please enter a valid dashboard key.");
                }
            });
            return true;
        }
        console.warn("Element with id='editContentBtn' not found in the DOM.");
        return false;
    }
    if (!attachEventListener()) {
        const observer = new MutationObserver((mutations, obs) => {
            if (attachEventListener()) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function renderTiles(data) {
    const container = document.getElementById("tileContainer");
    container.innerHTML = "";
    if (!data || !data.length) {
        container.innerHTML = `<div class="stage-bar error"><div>No tasks available.</div></div>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    data.forEach(d => {
        const tile = document.createElement("div");
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
                progressPercent = Math.round(21 + raw * (99 - 21));
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
            document.querySelectorAll('.task-tile, .stage-bar').forEach(t => t.classList.remove('selected'));
            tile.classList.add('selected');
        });
        fragment.appendChild(tile);
    });
    container.appendChild(fragment);
}

function generateStatusHTML(statusText) {
    if (statusText.toLowerCase().includes("completed")) return "✅ Completed";
    if (statusText.toLowerCase().includes("can't start")) return "🚫 Can't start";
    if (statusText.toLowerCase().includes("can start")) return "🟢 Can start (20%)";
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
    const raw = blockTexts[id] || "No details available.";
    document.getElementById("paneContent").innerHTML = autoLink(raw);
    if (window.innerWidth <= 1100) {
        document.getElementById("detailPane").classList.add("active");
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[tag]));
}

function autoLink(text) {
    if (!text) return "";
    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    text = text.replace(/\r?\n/g, "<br>");
    text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, email =>
        `<a href="mailto:${email}" target="_blank">${email}</a>`
    );
    text = text.replace(/(?<!\w)(\+\d[\d\s\-().]{7,}\d)(?!\w)/g, match => {
        const clean = match.replace(/[^\d+]/g, "");
        return `<a href="tel:${clean}" target="_blank">${match}</a>`;
    });
    text = text.replace(/\bhttps?:\/\/[^\s<>"',)]+/gi, url =>
        `<a href="${url}" target="_blank">${url}</a>`
    );
    const dummy = document.createElement("div");
    dummy.innerHTML = text;
    function linkifyNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const linked = node.textContent.replace(
                /(^|\s)(?!(https?:\/\/|mailto:|tel:))((?:[a-z0-9-]+\.)+[a-z]{2,})(\/[^\s<>"',)]*)?/gi,
                (_, space, _skip, domain, path) => {
                    const full = `https://${domain}${path || ""}`;
                    return `${space}<a href="${full}" target="_blank">${domain}${path || ""}</a>`;
                }
            );
            const span = document.createElement("span");
            span.innerHTML = linked;
            node.replaceWith(...span.childNodes);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "A") {
            Array.from(node.childNodes).forEach(linkifyNode);
        }
    }
    Array.from(dummy.childNodes).forEach(linkifyNode);
    return dummy.innerHTML;
}

function unifiedSort(tasks) {
    return tasks.slice().sort((a, b) => {
        const rank = t => {
            const isCompleted = t.status.toLowerCase().includes("completed");
            const isProcessing = t.status.toLowerCase().includes("processing");
            const isCanStart = t.status.toLowerCase().includes("can start");
            const isCantStart = t.status.toLowerCase().includes("can't start") || t.status.toLowerCase().includes("cannot start");
            let dueCategory = 2;
            if (t.dueDateUTC && !isCompleted) {
                const due = new Date(t.dueDateUTC + "Z");
                const now = new Date();
                const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
                const dayDiff = Math.floor((dueDay - today) / (1000 * 60 * 60 * 24));
                if (dayDiff <= 1) dueCategory = 0;
                else dueCategory = 1;
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
        const text = pill.dataset.filter?.toLowerCase() || "";
        pill.style.display = (!current || text !== current) ? "inline-block" : "none";
    });
}

function DateAndSync() {
    const titleDiv = document.getElementById("title");
    const loadTime = new Date();
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
    const lastUpdated = new Date();
    function updateStopwatchLabel() {
        const now = new Date();
        const diff = now - lastUpdated;
        let text = "";
        if (diff < 1000) {
            text = `Synced ${diff} ms ago`;
        } else if (diff < 5000) {
            text = `Synced ${Math.floor(diff / 1000)} sec${diff < 2000 ? "" : "s"} ago`;
        } else if (diff < 10000) {
            text = `Synced at least 5 secs ago`;
        } else if (diff < 15000) {
            text = `Synced at least 10 secs ago`;
        } else if (diff < 20000) {
            text = `Synced at least 15 secs ago`;
        } else if (diff < 40000) {
            text = `Synced at least 20 secs ago`;
        } else if (diff < 60000) {
            text = `Synced at least 40 secs ago`;
        } else if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            text = `Synced at least ${mins} min${mins === 1 ? "" : "s"} ago`;
        } else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            text = `Synced at least ${hours} hour${hours === 1 ? "" : "s"} ago`;
        } else {
            const days = Math.floor(diff / 86400000);
            text = `Synced at least ${days} day${days === 1 ? "" : "s"} ago`;
        }
        updatedSpan.textContent = `(${text})`;
    }
    function startSmartStopwatch() {
        let lastDiff = -1;
        function loop() {
            const now = new Date();
            const diff = now - lastUpdated;
            updateStopwatchLabel();
            let nextDelay;
            if (diff < 1000) {
                nextDelay = 1;
            } else if (diff < 5000) {
                nextDelay = 500;
            } else {
                nextDelay = 1000;
            }
            setTimeout(loop, nextDelay);
        }
        loop();
    }
    startSmartStopwatch();
}

window.addEventListener("load", () => {
    const searchBox = document.getElementById("searchBox");
    DateAndSync();
    searchBox.addEventListener("keydown", e => {
        if (e.key === "Enter") handleSearch();
    });
    searchBox.addEventListener("input", () => {
        updateVisiblePills();
    });
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", isDark);
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get("search");
    if (initialSearch) {
        searchBox.value = initialSearch;
        handleSearch();
    }
});

document.getElementById("togglePane").addEventListener("click", () => {
    show_task_info = !show_task_info;
    document.getElementById("togglePane").innerHTML = show_task_info ? "👀 Hide task info" : "👁️ Show task info";
    document.getElementById("detailPane").classList.toggle("active");
});

var show_task_info = false;