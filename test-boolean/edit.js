document.addEventListener('DOMContentLoaded', () => {
    const sheetId = '1DKQIKC8OEQD1EogrASe_3AiXDiG7G5-8iwqjQbjBfLI'; // Replace with your Google Sheet ID
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwDa5WR7pg1L7lHNBsEpM_lNPhtHqTh32ngDzxpBeowrqdbqa_4bgROKLREHe1A3Ix2/exec'; // Replace with your Web app URL
    const statusMessage = document.getElementById('status-message');

    // Fetch A1 value
    fetch(webAppUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            document.getElementById('a1-value').checked = result.value === true;
            statusMessage.textContent = '';
        } else {
            statusMessage.textContent = 'Error loading A1 value: ' + result.error;
        }
    })
    .catch(err => {
        console.error('Error fetching A1:', err);
        statusMessage.textContent = 'Error loading A1 value.';
    });

    // Save A1 value
    document.getElementById('save-btn').addEventListener('click', () => {
        const value = document.getElementById('a1-value').checked;
        statusMessage.textContent = 'Saving...';

        fetch(webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheetId, value })
        })
        .then(res => res.json())
        .then(result => {
            statusMessage.textContent = result.success ? 'Saved successfully!' : 'Error: ' + result.error;
        })
        .catch(err => {
            console.error('Error saving A1:', err);
            statusMessage.textContent = 'Error saving value.';
        });
    });
});