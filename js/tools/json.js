function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');

    try {
        const obj = JSON.parse(input);
        output.textContent = JSON.stringify(obj, null, 4);
    } catch (e) {
        output.textContent = 'Invalid JSON ❌';
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');

    try {
        const obj = JSON.parse(input);
        output.textContent = JSON.stringify(obj);
    } catch {
        output.textContent = 'Invalid JSON ❌';
    }
}

function validateJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');

    try {
        JSON.parse(input);
        output.textContent = 'Valid JSON ✅';
    } catch {
        output.textContent = 'Invalid JSON ❌';
    }
}
