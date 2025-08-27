let currentSheetId = "";
let currentDashboardLabel = "";
let globalData = [];
let blockTexts = {};
let typoThreshold = 0.25;

var total_tasks_variable = 0;


document.getElementById('rememberMeCheckbox').checked = true;

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

        // Update subscription-type span for saved key
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
        document.getElementById("tilesContainer").innerHTML = `
            <div id="empty-state">🔑 Please enter a dashboard key to begin.</div>
        `;
    }

    // Set up Edit Content button dynamically
    setupEditContentButton();




    const savedMode = localStorage.getItem("sortMode") || "default";
    const sortDropdown = document.getElementById("sortMode");
    if (sortDropdown) {
        sortDropdown.value = savedMode;  // set dropdown
    }

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
        const rows = csv.trim().split("\n").slice(2); // Skip first two rows (header and comment)

        for (let row of rows) {
            const cells = row.split(",");
            const keyFromSheet = (cells[1] || "").replace(/['"]/g, "").trim().toUpperCase();
            const sheetId = (cells[2] || "").replace(/['"]/g, "").trim();
            const label = (cells[3] || "").replace(/['"]/g, "").trim();
            const subscription = (cells[4] || "").replace(/['"]/g, "").trim(); // Subscription column (index 4)

            if (keyFromSheet === key) {
                currentSheetId = sheetId;
                currentDashboardLabel = label;

                // Update subscription-type span
                const subscriptionSpan = document.getElementById("subscription-type");
                if (subscriptionSpan) {
                    subscriptionSpan.textContent = subscription || "No subscription specified";
                } else {
                    console.warn("Element with id='subscription-type' not found in the DOM.");
                }

                const savedKeys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");

                if (remember) {
                    savedKeys[key] = { sheetId, label, subscription }; // Store subscription in savedKeys
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



// --- DO NOT CHANGE BELOW THIS LINE ---
function fetchAndRenderData() {
    if (!currentSheetId) {
        console.error("Sheet ID is not set.");
        return;
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
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
                const summary = `al ${total}; ${completed} co [${percent(completed)}%]; ${processing} pr [${percent(processing)}%]; ${canStart} ca [${percent(canStart)}%]; ${cantStart} can't [${percent(cantStart)}%]`;
                document.getElementById("totalTasks").innerText = summary;

                total_tasks_variable = total;


            }



            const excludeCompleted = globalData.filter(
                d => !d.status.toLowerCase().includes("completed")
            );

            // get current mode from dropdown, fallback to "default"
            // const sortMode = document.getElementById("sortMode")?.value || "default";

            // renderTiles(unifiedSort(excludeCompleted, sortMode));





            const sortMode = document.getElementById("sortMode")?.value || "default";
            // const results = unifiedSort(combined, sortMode); // in handleSearch
            renderTiles(unifiedSort(excludeCompleted, sortMode)); // in fetchAndRenderData




            updateTaskSummary(globalData);















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
        show_task_info = !show_task_info;
        document.getElementById("togglePane").innerHTML = show_task_info ? "👀 Hide task info" : "👁️ Show task info";
        document.getElementById("detailPane").classList.toggle("active");
    });
}

// document.getElementById("sortMode").addEventListener("change", () => {
//     handleSearch(); // re-run search so tiles re-render using new mode
// });

document.getElementById("sortMode").addEventListener("change", () => {
    const mode = document.getElementById("sortMode").value;
    localStorage.setItem("sortMode", mode);   // save preference
    handleSearch(); // re-run search with new sort
});



var show_task_info = false;

window.addEventListener("load", () => {
    fetchAndRenderData();
    const searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("keydown", e => {
        if (e.key === "Enter") handleSearch();
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

// safe attachment: only add input listener if element exists
const __searchBox_el = document.getElementById("searchBox");
if (__searchBox_el) {
    __searchBox_el.addEventListener("input", () => {
        updateVisiblePills();
        updateActivePillFromSearch();
    });
}


function renderTiles(data) {
    const container = document.getElementById("tileContainer");
    container.innerHTML = "";
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
            document.querySelectorAll('.task-tile').forEach(t => t.classList.remove('selected'));
            tile.classList.add('selected');
        });
        container.appendChild(tile);
    });

    // update number of tiles being shown


    // document.getElementById("nresults").innerHTML = `all ${total}` ;
    document.getElementById("nresults").innerHTML = data.length === total_tasks_variable ? `All ${total_tasks_variable}` : `${data.length}`;
    pillLabelHighlightEngine();


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

// function showPaneContent(id) {
//     const raw = blockTexts[id] || "No details available.";
//     document.getElementById("paneContent").innerHTML = autoLink(raw);
// }

function showPaneContent(id) {
    const raw = blockTexts[id] || "No details available.";
    let html = autoLink(raw);

    // Step 1: Wrap timestamp sections into posts and timestamp span
    html = html.replace(
        /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):([\s\S]*?)(?=(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:)|$)/g,
        (match, year, month, day, hour, minute, content) => {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const displayDate = `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}, ${hour}:${minute}`;
            return `<span class="post"><span class="timestamp">${displayDate}</span>${content}</span>`;
        }
    );

    // Step 2: Parse HTML to DOM so we can safely process
    const container = document.createElement("div");
    container.innerHTML = html;

    // Convert numbered text into <ol><li>...</li></ol>, supporting multiple lists per post
    container.querySelectorAll(".post").forEach(post => {
        let content = post.innerHTML;

      


        const parts = content.split(/<br\s*\/?>/i);
        let newParts = [];
        let inList = false;

        parts.forEach(line => {
            const clean = line.trim();
            const match = /^(\d+)\.\s*(.+)/.exec(clean);

            if (match) {
                if (!inList) {
                    newParts.push("<ol>");
                    inList = true;
                }
                newParts.push(`<li>${match[2]}</li>`);
            } else {
                if (inList) {
                    newParts.push("</ol>");
                    inList = false;
                }
                if (clean !== "") {
                    // only add <br> between non-empty normal lines
                    // if (newParts.length > 0) newParts.push("<br>");
                    // newParts.push(clean);

                    newParts.push(`<p>${clean}</p>`);

                }
            }
        });

        if (inList) newParts.push("</ol>");

        post.innerHTML = newParts.join("");
    });


    // Step 3: Manage + Labels logic
    let manageNode = null, labelsNode = null;

    [...container.childNodes].forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const txt = node.innerHTML || node.textContent;
            if (/^Manage:/i.test(txt.trim())) manageNode = node;
            if (/^Labels:/i.test(txt.trim())) labelsNode = node;
        } else if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.textContent.trim();
            if (/^Manage:/i.test(txt.trim())) {
                const manageDiv = collectManageBlock(node);
                node.remove();
                manageNode = manageDiv;
            }
            if (/^Labels:/i.test(txt.trim())) {
                const span = document.createElement("div");
                span.className = "labels";
                const labelText = txt.replace(/^Labels:\s*/i, "");
                const labelSpans = splitLabelsRespectingQuotes(labelText)
                    .map(l => `<span class="label">${l}</span>`)
                    .join(" ");
                span.innerHTML = "Labels: " + labelSpans;
                node.replaceWith(span);
                labelsNode = span;
            }
        }
    });

    if (manageNode || labelsNode) {
        const meta = document.createElement("span");
        meta.className = "meta";
        if (manageNode) meta.appendChild(manageNode);
        if (labelsNode) meta.appendChild(labelsNode);
        container.insertBefore(meta, container.firstChild);
    }

    document.getElementById("paneContent").innerHTML = container.innerHTML;

    const pane = document.getElementById("paneContent");
    pane.classList.remove("pane-animate");
    void pane.offsetWidth;
    pane.classList.add("pane-animate");
}


document.getElementById("close-note-to-user").addEventListener("click", function () {
  document.getElementById("note-to-user").style.display = "none";
});

document.getElementById("close-email-redirect").addEventListener("click", function () {
  document.getElementById("email-redirect").style.display = "none";
});


function splitLabelsRespectingQuotes(labelString) {
    const labels = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < labelString.length; i++) {
        const char = labelString[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            labels.push(current.trim().replace(/^"|"$/g, ''));
            current = "";
        } else {
            current += char;
        }
    }
    if (current) {
        labels.push(current.trim().replace(/^"|"$/g, ''));
    }
    return labels.filter(Boolean);
}


function collectManageBlock(startNode) {
    const manageDiv = document.createElement("div");
    manageDiv.className = "manage";
    manageDiv.append("Manage: ");

    let node = startNode.nextSibling;
    while (node && !(node.textContent || "").trim().startsWith("Labels:")) {
        const next = node.nextSibling;
        manageDiv.appendChild(node);
        node = next;
    }

    return manageDiv;
}



(function bindMetaLabelClicks() {
    const pane = document.getElementById("paneContent");
    if (!pane || pane.dataset.labelsBound) return;

    pane.addEventListener("click", (e) => {
        const el = e.target.closest(".label");
        if (!el || !pane.contains(el)) return;

        const labelText = el.textContent.trim();

        // Remove from all labels
        document.querySelectorAll(".label").forEach(l => l.classList.remove("active-tab"));

        // Add active-tab and remove after 2 seconds
        el.classList.add("active-tab");
        setTimeout(() => el.classList.remove("active-tab"), 2000);

        // Put text in search and trigger your existing flow
        const searchBox = document.getElementById("searchBox");
        if (searchBox) {
            searchBox.value = labelText;
            searchBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        }

        document.getElementById("pill-tasks").click();
    });

    pane.dataset.labelsBound = "1";
})();










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
        `<a href="${url}" target="_blank" class="link">${url}</a>`
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

function fuzzyIncludes(text, query, typoThreshold = 0.3) {
    const textWords = text.split(/\s+/);
    const queryWords = query.split(/\s+/);

    return queryWords.every(qw => {
        // direct substring match first
        if (text.includes(qw)) return true;

        // fuzzy check against each word in text
        return textWords.some(tw => {
            const dist = levenshtein(qw, tw);
            const allowed = Math.max(1, Math.floor(tw.length * typoThreshold));
            return dist <= allowed;
        });
    });
}



function handleSearch() {

    document.getElementById("pill-tasks").click();


    updateActivePillFromSearch();



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


        // else if (fuzzyIncludes(combined, input)) {
        //     corrected = d.task;
        //     matches.push(d);
        // } else if (fuzzyIncludes(block, input)) {
        //     fallback.push(d);
        // }






    });


    // Decide whether advanced status-brace tokens are present
    const rawQuery = (document.getElementById("searchBox")?.value || "").trim();
    const hasBraceToken = /-?\{[^}]+\}/.test(rawQuery); // matches {status}, -{status}, -{"status"} etc.

    let combined;
    if (hasBraceToken) {
        // If user used {..} syntax, run advanced parser against full dataset
        combined = applyAdvancedSearch(globalData);
    } else {
        // Otherwise apply advanced parsing only on the already-matched subset
        combined = [...matches, ...fallback];
        if (typeof applyAdvancedSearch === "function") combined = applyAdvancedSearch(combined);
    }

    // const results = unifiedSort(combined);
    // renderTiles(results);



    // const sortMode = document.getElementById("sortMode")?.value || "default";
    // const results = unifiedSort(combined, sortMode);
    // renderTiles(results);


    // const sortMode = document.getElementById("sortMode")?.value || "default";
    // const results = unifiedSort(combined, sortMode); // in handleSearch
    // renderTiles(unifiedSort(excludeCompleted, sortMode)); // in fetchAndRenderData


    const sortMode = document.getElementById("sortMode")?.value || "default";
    const results = unifiedSort(combined, sortMode);
    renderTiles(results);





    note.innerText = corrected !== input ? `Try searching for "${corrected}" instead of "${input}".` : "";
    const url = new URL(window.location);
    url.searchParams.set("search", input);
    history.replaceState(null, "", url.toString());
}

function unifiedSort(tasks, mode = "default") {
    return tasks.slice().sort((a, b) => {
        const rank = t => {
            const isCompleted = t.status.toLowerCase().includes("completed");
            const isProcessing = t.status.toLowerCase().includes("processing");
            const isCanStart = t.status.toLowerCase().includes("can start");
            const isCantStart = t.status.toLowerCase().includes("can't start") || t.status.toLowerCase().includes("cannot start");

            // --- Due date priority ---
            let dueCategory = 2;
            if (t.dueDateUTC && !isCompleted) {
                const due = new Date(t.dueDateUTC + "Z");
                const now = new Date();
                const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
                const dayDiff = Math.floor((dueDay - today) / (1000 * 60 * 60 * 24));
                if (dayDiff <= 1) dueCategory = 0; // urgent
                else dueCategory = 1;              // has a due date
            }

            // --- Status rank ---
            const statusRank = isProcessing ? 0 : isCanStart ? 1 : isCantStart ? 2 : 3;

            // --- Label weightage (count labels if parsed) ---
            let labelCount = 0;
            if (t.block) {
                const labelMatches = t.block.match(/Labels:\s*(.*)/i);
                if (labelMatches && labelMatches[1]) {
                    labelCount = labelMatches[1]
                        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/) // split respecting quotes
                        .filter(x => x.trim()).length;
                }
            }

            // --- Switch based on mode ---
            if (mode === "context") {
                return [isCompleted ? 3 : dueCategory, -labelCount, statusRank, t.task.toLowerCase()];
            } else if (mode === "workflow") {
                return [isCompleted ? 3 : dueCategory, statusRank, -labelCount, t.task.toLowerCase()];
            } else {
                // default
                return [isCompleted ? 3 : dueCategory, statusRank, t.task.toLowerCase()];
            }
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

// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();
//     document.querySelectorAll(".pill").forEach(pill => {
//         const text = pill.dataset.filter.toLowerCase();
//         pill.style.display = (!current || text !== current) ? "inline-block" : "none";
//     });
// }


function updateVisiblePills() {
    const current = document.getElementById("searchBox").value.trim().toLowerCase();
    const pills = Array.from(document.querySelectorAll(".pill"));

    // First hide pills that should disappear with animation
    pills.forEach(pill => {
        const text = pill.dataset.filter.toLowerCase();
        if (current && text === current && pill.style.display !== "none") {
            pill.classList.add("hide");
            setTimeout(() => {
                pill.style.display = "none";
                pill.classList.remove("hide");
            }, 300);
        }
    });

    // After 1 second, show the pills that should appear
    setTimeout(() => {
        pills.forEach(pill => {
            const text = pill.dataset.filter.toLowerCase();
            if (!current || text !== current) {
                if (pill.style.display === "none") {
                    pill.style.display = "inline-block";
                    pill.classList.add("new");
                    void pill.offsetWidth; // trigger reflow
                    pill.classList.add("show");
                    setTimeout(() => {
                        pill.classList.remove("new", "show");
                    }, 300);
                }
            }
        });
    }, 1000);
}





// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();
//     document.querySelectorAll(".pill").forEach(pill => {
//         const text = pill.dataset.filter.toLowerCase();
//         if (!current || text !== current) {
//             pill.classList.remove("hidden");
//         } else {
//             pill.classList.add("hidden");
//         }
//     });
// }


// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();

//     document.querySelectorAll(".pill").forEach(pill => {
//         const text = pill.dataset.filter.toLowerCase();
//         const shouldHide = (current && text === current);

//         if (shouldHide && !pill.classList.contains("hidden")) {
//             // Animate disappearance
//             pill.style.width = pill.offsetWidth + "px"; // lock start width
//             pill.offsetHeight; // force reflow
//             pill.classList.add("hidden");

//             // Remove from flow after animation
//             setTimeout(() => {
//                 pill.style.display = "none";
//             }, 400); // match CSS transition duration
//         } 
//         else if (!shouldHide && pill.classList.contains("hidden")) {
//             // Prepare for appearance
//             pill.style.display = "inline-block"; // put it back in flow
//             const fullWidth = pill.scrollWidth + "px";

//             pill.classList.remove("hidden");
//             pill.style.width = "0px"; // collapsed start
//             pill.offsetHeight; // reflow
//             pill.style.width = fullWidth;

//             // Reset width after animation to auto
//             setTimeout(() => {
//                 pill.style.width = "";
//             }, 400);
//         }
//     });
// }






// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();
//     const duration = 400; // must match CSS transition (in ms)

//     document.querySelectorAll(".pill").forEach(pill => {
//         const text = pill.dataset.filter.toLowerCase();
//         const shouldHide = (current && text === current);

//         // Hide
//         if (shouldHide && !pill.classList.contains("hidden")) {
//             pill.style.width = pill.offsetWidth + "px"; // lock start width
//             pill.offsetHeight; // reflow
//             pill.classList.add("hidden");

//             // Remove from flow exactly after animation
//             setTimeout(() => {
//                 pill.style.display = "none";
//             }, duration);
//         }

//         // Show
//         else if (!shouldHide && pill.classList.contains("hidden")) {
//             pill.style.display = "inline-block";
//             const fullWidth = pill.scrollWidth + "px";

//             // Start from 0 width
//             pill.style.width = "0px";
//             pill.offsetHeight; // reflow

//             pill.classList.remove("hidden");
//             pill.style.width = fullWidth;

//             // Keep fixed px width until after animation ends
//             setTimeout(() => {
//                 pill.style.width = "";
//             }, duration);
//         }
//     });
// }





















// In updateVisiblePills()
// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();
//     document.querySelectorAll(".pill").forEach(pill => {
//         const text = pill.dataset.filter.toLowerCase();
//         pill.classList.toggle('hidden', current && text === current); // Toggle hidden class
//     });
// }



// function updateVisiblePills() {
//     const current = document.getElementById("searchBox").value.trim().toLowerCase();
//     document.querySelectorAll(".pill").forEach((pill, index) => {
//         const text = pill.dataset.filter.toLowerCase();
//         pill.style.animationDelay = `${index * 0.05}s`; // Stagger animations
//         pill.classList.toggle("hidden", current && text === current);
//     });
//     setTimeout(() => {
//         document.querySelectorAll(".pill").forEach(pill => {
//             pill.style.animationDelay = "0s";
//         });
//     }, 600);
// }







document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
        const value = pill.dataset.filter;
        const searchBox = document.getElementById("searchBox");
        searchBox.value = value;
        handleSearch();
        updateVisiblePills();
    });
});

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
    DateAndSync();
});

document.getElementById("syncBtn").addEventListener("click", () => {
    fetchAndRenderData();
    DateAndSync();
});

const pillTasks = document.getElementById("pill-tasks");
const pillTimeline = document.getElementById("pill-timeline");
const timelineContainer = document.getElementById("timeline-container");
const tilesContainer = document.getElementById("tileContainer");

pillTasks.addEventListener("click", () => {
    pillTasks.classList.add("active-tab");
    pillTimeline.classList.remove("active-tab");
    tilesContainer.style.display = "grid";
    timelineContainer.style.display = "none";
});

pillTimeline.addEventListener("click", () => {
    pillTimeline.classList.add("active-tab");
    pillTasks.classList.remove("active-tab");
    tilesContainer.style.display = "none";
    timelineContainer.style.display = "flex";
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
        document.getElementById("tilesContainer").innerHTML = `
            <div id="empty-state">🔑 Please enter a dashboard key to begin.</div>
        `;
    }
});



// --------------------- append 



// Global variable for timeline data (new name to avoid conflict)
let timelineData7 = [];

// Parse date with strict validation
function parseDateString7(dateStr) {
    if (!dateStr) return null;
    // Try standard formats: MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY
    const formats = [
        {
            regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
            parse: ([_, month, day, year]) => ({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
        },
        {
            regex: /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
            parse: ([_, year, month, day]) => ({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
        },
        {
            regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
            parse: ([_, day, month, year]) => ({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
        }
    ];

    for (const { regex, parse } of formats) {
        const match = dateStr.match(regex);
        if (match) {
            const { year, month, day } = parse(match);
            // Validate ranges: month 1-12, day 1-31
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                console.warn("Invalid date range:", dateStr, { year, month, day });
                return null;
            }
            const date = new Date(year, month - 1, day);
            if (!isNaN(date) && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day) {
                return date;
            }
        }
    }
    console.warn("Failed to parse date:", dateStr);
    return null;
}

// Fetch timeline data from Google Sheet
function fetchTimelineData7() {
    if (!currentSheetId) {
        console.error("Sheet ID is not set for timeline data.");
        document.getElementById("timeline-container").innerHTML = `<div class="stage-bar error"><div>No Sheet ID provided.</div></div>`;
        return;
    }

    const timelineUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=Timeline`;



    fetch(timelineUrl)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch timeline data.");
            return res.text();
        })
        .then(csvText => {
            if (!window.Papa) {
                console.error("PapaParse library is missing.");
                document.getElementById("timeline-container").innerHTML = `<div class="stage-bar error"><div>PapaParse library missing.</div></div>`;
                return;
            }
            const rows = Papa.parse(csvText.trim(), { skipEmptyLines: true }).data.slice(1); // Skip header
            timelineData7 = rows.map((row, index) => {
                console.log("Raw endDate:", row[6]); // Debug raw endDate
                const amountSpent = row[3] ? parseFloat(row[3].replace(/[^0-9.]/g, '')) : 0;
                const amountRequired = row[4] ? parseFloat(row[4].replace(/[^0-9.]/g, '')) : 0;
                return {
                    id: row[0] || `timeline${index + 1}`,
                    stage: row[1] || "",
                    netRequired: (amountRequired - amountSpent).toFixed(2),
                    endDate: row[6] || null
                };
            }).filter(d => d.stage && d.stage.toLowerCase() !== "total");
            renderTimeline7();
        })
        .catch(err => {
            console.error("Error fetching timeline data:", err);
            document.getElementById("timeline-container").innerHTML = `<div class="stage-bar error"><div>Failed to load timeline data.</div></div>`;
        });




    createStageBarPills();
    // Refresh stage-bar pills after data load

}

// Render timeline stage bars
function renderTimeline7() {
    const container = document.getElementById("timeline-container");
    container.innerHTML = "";
    if (!timelineData7.length) {
        container.innerHTML = `<div class="stage-bar error"><div>No timeline data available.</div></div>`;
        return;
    }

    const now = new Date("2025-08-07T23:16:00+05:30"); // Current IST time
    timelineData7.forEach(d => {
        if (!d.stage) return;
        let dateText = "No end date";
        let dateClass = "future";
        if (d.endDate) {
            const end = parseDateString7(d.endDate);
            if (end && !isNaN(end)) {
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                const diffDays = Math.ceil((endDay - today) / (1000 * 60 * 60 * 24)) + 0; // Include end date
                dateText = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')} (${diffDays} days)`;
                if (end < now) {
                    dateClass = "past-due";
                    dateText += " (Past due)";
                }
            } else {
                dateText = "Invalid date";
                dateClass = "error";
            }
        }

        const stageBar = document.createElement("div");
        stageBar.className = `stage-bar ${dateClass}`;
        stageBar.id = `stage@${d.id}`;
        stageBar.innerHTML = `
            <div class="stage-name">${d.stage}</div>
            <div class="amounts">${parseFloat(d.netRequired).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="dates">${dateText}</div>
        `;
        stageBar.style.cursor = "pointer"; // Indicate clickability

        stageBar.addEventListener("click", () => {
            const searchBox = document.getElementById("searchBox");
            searchBox.value = d.stage; // Set search to exact stage name
            document.getElementById("pill-tasks").click(); // Switch to tasks tab
            handleSearch(); // Trigger existing search
        });

        container.appendChild(stageBar);
    });


    createStageBarPills();
    // Refresh stage-bar pills after data load


}

// Fetch and render timeline on sync button click
document.getElementById("syncBtn").addEventListener("click", () => {
    fetchTimelineData7();
});

// Fetch and render timeline on page load
window.addEventListener("load", () => {
    fetchTimelineData7();
    if (document.getElementById("pill-timeline").classList.contains("active-tab")) {
        renderTimeline7();
    }
});

// Render timeline when timeline tab is clicked
document.getElementById("pill-timeline").addEventListener("click", () => {
    renderTimeline7();
});










// -------------------------- label pills

//  createStageBarPills();

// function createStageBarPills() {
//     const pillContainer2 = document.getElementById("pillContainer2");
//     if (!pillContainer2) return;

//     pillContainer2.innerHTML = ""; // Clear old pills

//     // Grab all stage-bar elements
//     const stageBars = document.querySelectorAll(".stage-bar");

//     stageBars.forEach(stageBar => {
//         // const labelText = stageBar.querySelector("span")?.textContent?.trim();
//         const labelText = stageBar.querySelector(".stage-name")?.textContent?.trim();

//         if (labelText) {
//             const pill = document.createElement("span");
//             pill.className = "pill-label";
//             pill.textContent = labelText;

//             // Click event triggers a search for this label
//             // pill.addEventListener("click", () => {
//             //     // Switch to Tasks tab
//             //     document.getElementById("pill-tasks").click();

//             //     // Trigger search for this stage
//             //     const searchBox = document.getElementById("searchBox");
//             //     if (searchBox) {
//             //         searchBox.value = `#${labelText}`;
//             //         searchBox.dispatchEvent(new Event("input"));
//             //     }
//             // });





//             pill.addEventListener("click", () => {







//                 document.querySelectorAll('.pill-label').forEach(pill => {
//                     pill.addEventListener('click', function () {
//                         // Remove active-tab from all pills
//                         document.querySelectorAll('.pill-label').forEach(p => p.classList.remove('active-tab'));

//                         // Add active-tab to clicked pill
//                         this.classList.add('active-tab');
//                     });
//                 });


//                 // Put the label text directly into the search box
//                 searchBox.value = labelText;

//                 // // Call the same search function your Enter key uses
//                 // if (typeof filterTasks === "function") {
//                 //     filterTasks(); // adjust this to your actual search function name
//                 // } else {
//                 //     // If you rely on triggering an input event for search:
//                 //     searchBox.dispatchEvent(new Event("input"));
//                 // }

//                 // Switch to the Tasks tab
//                 document.getElementById("pill-tasks").click();

//                 // Simulate Enter key press to trigger search
//                 searchBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));


















//             });

















//             pillContainer2.appendChild(pill);
//         }
//     });
// }







// PILL REFRESH PILL-LABEL CLASS 



function updateActivePillFromSearch() {
    const sb = document.getElementById("searchBox");
    const searchValue = (sb ? sb.value : "").trim().toLowerCase();

    const hasMatch = Array.from(document.querySelectorAll(".pill-label"))
        .some(pill => pill.textContent.trim().toLowerCase() === searchValue);

    if (!hasMatch) {
        document.querySelectorAll(".pill-label").forEach(p => p.classList.remove("active-tab"));
    }
}


// const searchBox = document.getElementById("searchBox");

// Run when user types
searchBox.addEventListener("input", updateActivePillFromSearch);

// Example: run it when search value is changed programmatically
// (just call updateActivePillFromSearch() after setting searchBox.value)






function createStageBarPills() {
    const pillContainer2 = document.getElementById("pillContainer2");
    if (!pillContainer2) return;

    pillContainer2.innerHTML = ""; // Clear old pills

    const stageBars = document.querySelectorAll(".stage-bar");

    stageBars.forEach(stageBar => {
        const labelText = stageBar.querySelector(".stage-name")?.textContent?.trim();
        if (!labelText) return;

        const pill = document.createElement("span");
        pill.className = "pill-label";
        pill.textContent = labelText;

        pill.addEventListener("click", function () {
            // 1. Set active tab styling
            document.querySelectorAll(".pill-label").forEach(p => p.classList.remove("active-tab"));
            this.classList.add("active-tab");

            // 2. Put the label text directly into the search box
            const searchBox = document.getElementById("searchBox");
            if (searchBox) {
                searchBox.value = labelText;
                // Simulate Enter key press
                searchBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            }

            // 3. Switch to the Tasks tab
            document.getElementById("pill-tasks").click();
        });

        pillContainer2.appendChild(pill);
    });
}










function pillLabelHighlightEngine() {
    const searchValue = document.getElementById("searchBox").value.trim().toLowerCase();

    // Remove from all first
    document.querySelectorAll(".pill-label").forEach(p => p.classList.remove("active-tab"));

    if (!searchValue) return; // stop if search is empty

    // Highlight only matching pill-label
    document.querySelectorAll(".pill-label").forEach(p => {
        if (p.textContent.trim().toLowerCase() === searchValue) {
            p.classList.add("active-tab");
        }
    });
}


// applyAdvancedSearch(tasks)
// Supports:
// - {status}  (status filter) and -{status} (exclude status)
// - "keyword" or unquoted tokens => keyword match on task/info/block
// - -"keyword" => exclude keyword
// - -{"completed"} is treated same as -{completed}
// - "-{completed}" (quotes around whole thing) is treated as a literal keyword '-{completed}'
// - multiple tokens separated by commas
// - if NO {..} tokens present, status filters are ignored (keyword-only mode)
function applyAdvancedSearch(tasks) {
    const raw = (document.getElementById("searchBox")?.value || "").trim();
    if (!raw) return tasks;

    const tokens = raw.split(",").map(t => t.trim()).filter(Boolean);
    const posStatus = [], negStatus = [], posKw = [], negKw = [];

    tokens.forEach(tok => {
        if (!tok) return;

        // operator before quoted: e.g. -"can't start" or -"{completed}"
        const opQuoted = tok.match(/^([+-])"([\s\S]*)"$/);
        if (opQuoted) {
            const op = opQuoted[1], content = opQuoted[2].trim();
            if (/^\{[\s\S]*\}$/.test(content)) {
                // -"{...}" => treat as status token (unwrap quotes inside braces)
                const inner = content.replace(/^\{\s*"?|"?\s*\}$/g, "").trim().toLowerCase();
                if (op === "-") negStatus.push(inner); else posStatus.push(inner);
            } else {
                if (op === "-") negKw.push(content.toLowerCase()); else posKw.push(content.toLowerCase());
            }
            return;
        }

        // fully quoted token (literal keyword)
        const fullyQuoted = tok.match(/^"([\s\S]*)"$/);
        if (fullyQuoted) { posKw.push(fullyQuoted[1].trim().toLowerCase()); return; }

        // normal tokens with optional +/- prefix
        let isNeg = false;
        let tkn = tok;
        if (tkn[0] === "+" || tkn[0] === "-") { isNeg = tkn[0] === "-"; tkn = tkn.slice(1).trim(); }

        // status token with braces (allow optional quotes inside)
        const statusMatch = tkn.match(/^\{\s*"?([\s\S]*?)"?\s*\}$/);
        if (statusMatch) {
            const content = statusMatch[1].trim().toLowerCase();
            if (isNeg) negStatus.push(content); else posStatus.push(content);
            return;
        }

        // otherwise keyword
        const c = tkn.trim().toLowerCase();
        if (!c) return;
        if (isNeg) negKw.push(c); else posKw.push(c);
    });

    const hasStatus = posStatus.length > 0 || negStatus.length > 0;

    return tasks.filter(d => {
        const status = (d.status || "").toLowerCase();
        const text = `${d.task || ""} ${d.info || ""} ${d.block || ""}`.toLowerCase();

        // positive checks
        let statusOK = true;
        if (hasStatus && posStatus.length) statusOK = posStatus.some(s => status.includes(s));
        let kwOK = true;
        if (posKw.length) kwOK = posKw.some(k => text.includes(k));

        // negative checks
        const statusBad = hasStatus && negStatus.some(s => status.includes(s));
        const kwBad = negKw.some(k => text.includes(k));

        return statusOK && kwOK && !statusBad && !kwBad;
    });
}







// dashboard key adjustments for css dynamic height

const keyInput2 = document.getElementById("dashboardKeyInput");
const keyContainer = document.getElementById("dashboardKeyContainer");

keyInput2.addEventListener("focus", () => {
    keyContainer.classList.add("dashboard-key-container-adjusted");
});

keyInput2.addEventListener("blur", () => {
    keyContainer.classList.remove("dashboard-key-container-adjusted");
});

































































