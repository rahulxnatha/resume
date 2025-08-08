// Service Worker for background task notifications
try {
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js');
} catch (e) {
    console.error('Service Worker: Failed to load PapaParse:', e);
}

self.addEventListener('install', event => {
    console.log('Service Worker: Installing');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activating');
    event.waitUntil(self.clients.claim());
});

// Cache for notifiedTasks (since localStorage is unavailable)
const NOTIFIED_TASKS_CACHE = 'notified-tasks-cache';
async function getNotifiedTasks() {
    const cache = await caches.open(NOTIFIED_TASKS_CACHE);
    const response = await cache.match('notifiedTasks');
    return response ? await response.json() : {};
}

async function setNotifiedTasks(notifiedTasks) {
    const cache = await caches.open(NOTIFIED_TASKS_CACHE);
    await cache.put('notifiedTasks', new Response(JSON.stringify(notifiedTasks)));
}

// Background task check every 3 hours
async function checkTasks() {
    console.log('Service Worker: Checking tasks');
    const now = new Date();
    const currentPeriod = now.getHours() < 12 ? 'AM' : 'PM';
    const currentDate = now.toISOString().split('T')[0];

    // Get notifiedTasks from cache
    let notifiedTasks;
    try {
        notifiedTasks = await getNotifiedTasks();
    } catch (err) {
        console.error('Service Worker: Error reading notifiedTasks:', err);
        return;
    }

    // Get notificationsEnabled and currentSheetId from main thread
    let notificationsEnabled = false, currentSheetId = '';
    await self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: 'GET_CONFIG' });
        });
    });

    // Wait for config response
    const configPromise = new Promise(resolve => {
        self.addEventListener('message', function handler(event) {
            if (event.data.type === 'CONFIG_RESPONSE') {
                notificationsEnabled = event.data.notificationsEnabled;
                currentSheetId = event.data.currentSheetId;
                self.removeEventListener('message', handler);
                resolve();
            }
        });
    });
    await configPromise;

    if (!notificationsEnabled || Notification.permission !== 'granted') {
        console.log('Service Worker: Notifications skipped. Enabled:', notificationsEnabled, 'Permission:', Notification.permission);
        return;
    }

    if (!currentSheetId) {
        console.log('Service Worker: No currentSheetId');
        return;
    }

    // Reset counts daily
    Object.keys(notifiedTasks).forEach(taskId => {
        const { timestamp } = notifiedTasks[taskId];
        if (timestamp && timestamp.split('T')[0] !== currentDate) {
            notifiedTasks[taskId] = { timestamp, count: 0 };
        }
    });

    const csvUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
    try {
        const res = await fetch(csvUrl);
        if (!res.ok) throw new Error('Sheet fetch failed');
        const csvText = await res.text();

        if (!self.Papa) {
            console.error('Service Worker: PapaParse not loaded');
            return;
        }
        const rows = self.Papa.parse(csvText.trim(), { skipEmptyLines: true }).data.slice(2);
        const tasks = rows.map(row => ({
            id: row[4],
            task: row[1],
            dueDateUTC: row[6] || null,
            status: row[3]
        })).filter(d => d.task && d.status && d.id && d.dueDateUTC);

        const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

        console.log('Service Worker: Found', tasks.length, 'tasks');
        for (const task of tasks) {
            if (task.status.toLowerCase().includes('completed') || !task.dueDateUTC) continue;

            const due = new Date(`${task.dueDateUTC}Z`);
            if (isNaN(due)) {
                console.log('Service Worker: Invalid dueDateUTC for task', task.id, ':', task.dueDateUTC);
                continue;
            }
            const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
            const dayDiff = Math.floor((dueDay - today) / (1000 * 60 * 60 * 24));

            if (dayDiff <= 7) {
                const taskInfo = notifiedTasks[task.id] || { timestamp: '', count: 0 };
                const lastPeriod = taskInfo.timestamp ? new Date(taskInfo.timestamp).getHours() < 12 ? 'AM' : 'PM' : null;

                if (taskInfo.count < 2 && (!lastPeriod || lastPeriod !== currentPeriod)) {
                    const dueText = dayDiff < 0 ? 'Past due' : dayDiff === 0 ? 'Due today' : `Due in ${dayDiff} days`;
                    console.log(`Service Worker: Sending notification for ${task.id}: ${task.task}, ${dueText}`);
                    await self.registration.showNotification(task.task, {
                        body: dueText,
                        data: { taskId: task.id, taskName: task.task, key: localStorage.getItem('lastUsedDashboardKey') }
                    });
                    notifiedTasks[task.id] = { timestamp: now.toISOString(), count: taskInfo.count + 1 };
                }
            }
        }

        await setNotifiedTasks(notifiedTasks);
    } catch (err) {
        console.error('Service Worker: Error fetching tasks:', err);
    }
}

// Run every 3 hours (10s for testing)
setInterval(checkTasks, 10000); // Change to 3 * 60 * 60 * 1000 in production
checkTasks(); // Initial check

self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event.notification.data);
    event.notification.close();
    const { taskId, taskName, key } = event.notification.data;
    event.waitUntil(
        clients.openWindow(`/dashboard/?key=${key}&search=${encodeURIComponent(taskName)}&id=${taskId}`)
    );
});