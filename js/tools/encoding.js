const encOutput = () => document.getElementById('encodingOutput');

function base64Encode() {
    try {
        encOutput().textContent = btoa(unescape(encodeURIComponent(
            document.getElementById('encodingInput').value
        )));
    } catch {
        encOutput().textContent = 'Encoding failed ❌';
    }
}

function base64Decode() {
    try {
        encOutput().textContent = decodeURIComponent(escape(
            atob(document.getElementById('encodingInput').value)
        ));
    } catch {
        encOutput().textContent = 'Invalid Base64 ❌';
    }
}

function urlEncode() {
    encOutput().textContent = encodeURIComponent(
        document.getElementById('encodingInput').value
    );
}

function urlDecode() {
    try {
        encOutput().textContent = decodeURIComponent(
            document.getElementById('encodingInput').value
        );
    } catch {
        encOutput().textContent = 'Invalid URL encoding ❌';
    }
}

function htmlEncode() {
    encOutput().textContent = document
        .getElementById('encodingInput')
        .value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function htmlDecode() {
    encOutput().textContent = document
        .getElementById('encodingInput')
        .value
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
}

function textToUnicode() {
    encOutput().textContent = [...document.getElementById('encodingInput').value]
        .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
        .join('');
}

function unicodeToText() {
    try {
        encOutput().textContent = document
            .getElementById('encodingInput')
            .value
            .replace(/\\u[\dA-Fa-f]{4}/g,
                match => String.fromCharCode(parseInt(match.slice(2), 16))
            );
    } catch {
        encOutput().textContent = 'Invalid Unicode ❌';
    }
}
