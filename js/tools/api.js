const apiOut = msg =>
    document.getElementById('apiOutput').textContent = msg;

// ---------- REST API TESTER ----------
async function callApi() {
    const url = document.getElementById('apiUrl').value;
    const method = document.getElementById('apiMethod').value;
    const body = document.getElementById('apiBody').value;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method === 'POST' ? body : undefined
        });

        const text = await res.text();

        try {
            apiOut(JSON.stringify(JSON.parse(text), null, 4));
        } catch {
            apiOut(text);
        }
    } catch {
        apiOut('Request failed ❌ (Check URL / CORS / Network)');
    }
}

// ---------- HTTP HEADERS VIEWER ----------
function showHeaders() {
    apiOut(
        JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled
        }, null, 4)
    );
}

// ---------- CURL GENERATOR ----------
function generateCurl() {
    const url = document.getElementById('apiUrl').value;
    const method = document.getElementById('apiMethod').value;
    const body = document.getElementById('apiBody').value;

    let curl = `curl -X ${method} "${url}"`;

    if (method === 'POST' && body) {
        curl += ` \\\n -H "Content-Type: application/json" \\\n -d '${body}'`;
    }

    apiOut(curl);
}

// ---------- JSON RESPONSE VIEWER ----------
function prettyPrintApiJson() {
    try {
        const json = JSON.parse(
            document.getElementById('jsonApiInput').value
        );
        apiOut(JSON.stringify(json, null, 4));
    } catch {
        apiOut('Invalid JSON ❌');
    }
}

// ---------- USER AGENT PARSER ----------
function parseUserAgent() {
    const ua = navigator.userAgent;

    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';

    let os = 'Unknown';
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';

    apiOut(`Browser: ${browser}\nOS: ${os}\n\nFull UA:\n${ua}`);
}

// ---------- IP ANALYZER (OFFLINE SAFE) ----------
function analyzeIP() {
    const ip = document.getElementById('ipInput').value;

    const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

    if (!ipv4Regex.test(ip)) {
        apiOut('Invalid IPv4 address ❌');
        return;
    }

    const parts = ip.split('.').map(Number);
    const isPrivate =
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168);

    apiOut(
        `IP: ${ip}
Type: IPv4
Private: ${isPrivate ? 'Yes' : 'No'}
Class: ${getIpClass(parts[0])}`
    );
}

function getIpClass(firstOctet) {
    if (firstOctet <= 127) return 'Class A';
    if (firstOctet <= 191) return 'Class B';
    if (firstOctet <= 223) return 'Class C';
    return 'Other';
}
