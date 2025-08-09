const validStatuses = ['Completed', 'Started and processing', 'Can start', "Can't start, pending prerequisites"];
let data = { tasks: [], labels: [] };
let currentTab = 'tasks';
let choicesInstance;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sheetId = localStorage.getItem('currentSheetId');
    if (!sheetId) {
        document.getElementById('status-message').textContent = 'Error: No dashboard key found. Please return to the dashboard and enter a key.';
        return;
    }

    // Fetch data from Google Sheets
    Promise.all([
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Latest%20info`)
            .then(res => res.text())
            .then(csvText => Papa.parse(csvText.trim(), { skipEmptyLines: true }).data)
            .then(rows => {
                data.tasks = rows.slice(1).map((row, index) => ({
                    id: index + 1,
                    taskName: row[1] || '',
                    latestInfo: row[2] || '',
                    status: row[3] || '',
                    startDate: row[4] || '',
                    endDate: row[5] || '',
                    dueDateUTC: row[6] || '',
                    label: row[7] || ''
                }));
            }),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Briefs`)
            .then(res => res.text())
            .then(csvText => Papa.parse(csvText.trim(), { skipEmptyLines: true }).data)
            .then(rows => {
                data.tasks.forEach(task => {
                    const briefRow = rows.slice(1).find(row => row[1] === task.taskName);
                    task.brief = briefRow ? briefRow[2] || '' : '';
                });
            }),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Timeline`)
            .then(res => res.text())
            .then(csvText => Papa.parse(csvText.trim(), { skipEmptyLines: true }).data)
            .then(rows => {
                data.labels = rows.slice(1).map((row, index) => ({
                    id: index + 1,
                    labelTitle: row[1] || '',
                    description: row[2] || '',
                    amountSpent: row[3] || '',
                    amountRequired: row[4] || '',
                    startDate: row[5] || '',
                    endDate: row[6] || ''
                }));
            })
    ])
    .then(() => {
        initializeTabs();
        initializeDropdown();
        renderForm();
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        document.getElementById('status-message').textContent = 'Error loading data. Please try again.';
    });
});

// Initialize tabs
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            document.getElementById('form-container').innerHTML = '';
            initializeDropdown();
            renderForm();
        });
    });
}

// Initialize searchable dropdown with Choices.js
function initializeDropdown() {
    const select = document.getElementById('item-select');
    if (choicesInstance) {
        choicesInstance.destroy();
    }
    const items = currentTab === 'tasks' ? data.tasks.map(task => ({
        value: task.id,
        label: task.taskName
    })) : data.labels.map(label => ({
        value: label.id,
        label: labelTitle
    }));
    choicesInstance = new Choices(select, {
        choices: items,
        searchEnabled: true,
        placeholderValue: `Select a ${currentTab === 'tasks' ? 'task' : 'label'}`,
        searchPlaceholderValue: `Search ${currentTab === 'tasks' ? 'tasks' : 'labels'}`
    });
    select.addEventListener('change', () => {
        document.getElementById('item-id').textContent = select.value ? `ID: ${select.value}` : '';
        renderForm();
    });
    if (items.length > 0) {
        select.value = items[0].value;
        document.getElementById('item-id').textContent = `ID: ${items[0].value}`;
        renderForm();
    }
}

// Render form based on selected item
function renderForm() {
    const formContainer = document.getElementById('form-container');
    const selectedId = parseInt(document.getElementById('item-select').value);
    formContainer.innerHTML = '';

    if (!selectedId) return;

    if (currentTab === 'tasks') {
        const task = data.tasks.find(t => t.id === selectedId) || {};
        formContainer.innerHTML = `
            <div class="form-group">
                <label>Task title *</label>
                <input type="text" id="task-title" value="${task.taskName || ''}">
            </div>
            <div class="form-group">
                <label>Latest info *</label>
                <input type="text" id="latest-info" value="${task.latestInfo || ''}">
            </div>
            <div class="form-group">
                <label>Status *</label>
                <select id="status">
                    ${validStatuses.map(status => `
                        <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Start date (YYYY-MM-DD)</label>
                <input type="text" id="start-date" value="${task.startDate || ''}" placeholder="YYYY-MM-DD">
            </div>
            <div class="form-group">
                <label>End date (YYYY-MM-DD)</label>
                <input type="text" id="end-date" value="${task.endDate || ''}" placeholder="YYYY-MM-DD">
            </div>
            <div class="form-group">
                <label>Next due date (YYYY-MM-DD HH:MM)</label>
                <input type="text" id="due-date" value="${task.dueDateUTC || ''}" placeholder="YYYY-MM-DD HH:MM">
            </div>
            <div class="form-group">
                <label>Label</label>
                <input type="text" id="label" value="${task.label || ''}">
            </div>
            <div class="form-group">
                <label>Brief</label>
                <input type="text" id="brief" value="${task.brief || ''}">
            </div>
        `;
    } else {
        const label = data.labels.find(l => l.id === selectedId) || {};
        formContainer.innerHTML = `
            <div class="form-group">
                <label>Label title *</label>
                <input type="text" id="label-title" value="${label.labelTitle || ''}">
            </div>
            <div class="form-group">
                <label>Description *</label>
                <input type="text" id="description" value="${label.description || ''}">
            </div>
            <div class="form-group">
                <label>Money spent</label>
                <input type="text" id="money-spent" value="${label.amountSpent || ''}">
            </div>
            <div class="form-group">
                <label>Money required (estimate)</label>
                <input type="text" id="money-required" value="${label.amountRequired || ''}">
            </div>
            <div class="form-group">
                <label>Start date</label>
                <input type="text" id="start-date" value="${label.startDate || ''}" placeholder="YYYY-MM-DD">
            </div>
            <div class="form-group">
                <label>End date (estimate)</label>
                <input type="text" id="end-date" value="${label.endDate || ''}" placeholder="YYYY-MM-DD">
            </div>
        `;
    }
}

// Save changes to Google Sheet
document.getElementById('save-btn').addEventListener('click', () => {
    const statusMessage = document.getElementById('status-message');
    const selectedId = parseInt(document.getElementById('item-select').value);
    if (!selectedId) {
        statusMessage.textContent = 'Please select an item to edit.';
        return;
    }

    let error = null;
    let payload;
    if (currentTab === 'tasks') {
        const task = {
            taskName: document.getElementById('task-title').value,
            latestInfo: document.getElementById('latest-info').value,
            status: document.getElementById('status').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            dueDateUTC: document.getElementById('due-date').value,
            label: document.getElementById('label').value,
            brief: document.getElementById('brief').value
        };
        if (!task.taskName) error = 'Task title is required.';
        if (!task.latestInfo) error = 'Latest info is required.';
        if (!task.status || !validStatuses.includes(task.status)) error = 'Valid status is required.';
        if (task.dueDateUTC && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(task.dueDateUTC)) error = 'Next due date must be YYYY-MM-DD HH:MM or empty.';
        if (task.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(task.startDate)) error = 'Start date must be YYYY-MM-DD or empty.';
        if (task.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(task.endDate)) error = 'End date must be YYYY-MM-DD or empty.';
        if (!error) payload = task;
    } else {
        const label = {
            labelTitle: document.getElementById('label-title').value,
            description: document.getElementById('description').value,
            amountSpent: document.getElementById('money-spent').value,
            amountRequired: document.getElementById('money-required').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value
        };
        if (!label.labelTitle) error = 'Label title is required.';
        if (!label.description) error = 'Description is required.';
        if (label.amountSpent && isNaN(label.amountSpent)) error = 'Money spent must be a number or empty.';
        if (label.amountRequired && isNaN(label.amountRequired)) error = 'Money required must be a number or empty.';
        if (label.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(label.startDate)) error = 'Start date must be YYYY-MM-DD or empty.';
        if (label.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(label.endDate)) error = 'End date must be YYYY-MM-DD or empty.';
        if (!error) payload = label;
    }

    if (error) {
        statusMessage.textContent = error;
        return;
    }

    const sheetId = localStorage.getItem('currentSheetId');
    statusMessage.textContent = 'Saving changes...';
    fetch('https://script.google.com/macros/s/AKfycbwYHUEpNKii9rv00QHI2SQ61YcnFjeWCV3SHxik9pmxyBvtU-jGE-HXCsNnEk2o3oMc/exec', { // Replace with your Web app URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sheetId,
            tab: currentTab,
            id: selectedId,
            data: payload
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            statusMessage.textContent = 'Changes saved successfully!';
            // Update local data
            if (currentTab === 'tasks') {
                const index = data.tasks.findIndex(t => t.id === selectedId);
                data.tasks[index] = payload;
            } else {
                const index = data.labels.findIndex(l => l.id === selectedId);
                data.labels[index] = payload;
            }
        } else {
            statusMessage.textContent = 'Error saving changes: ' + result.error;
        }
    })
    .catch(err => {
        console.error('Error saving data:', err);
        statusMessage.textContent = 'Error saving changes. Check console for details.';
    });
});