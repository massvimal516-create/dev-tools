const secOut = msg =>
    document.getElementById('securityOutput').textContent = msg;

// ---------- HASH GENERATORS ----------
async function generateHash(algorithm) {
    const text = document.getElementById('securityInput').value;
    const data = new TextEncoder().encode(text);

    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    secOut(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
}

// Legacy MD5 (JS-only)
function generateMD5() {
    secOut(md5(document.getElementById('securityInput').value));
}

// ---------- PASSWORD STRENGTH ----------
function checkPasswordStrength() {
    const pwd = document.getElementById('passwordInput').value;
    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    secOut(`Password Strength: ${levels[score]}`);
}

// ---------- JWT DECODER ----------
function decodeJWT() {
    try {
        const token = document.getElementById('jwtInput').value;
        const payload = JSON.parse(atob(token.split('.')[1]));
        secOut(JSON.stringify(payload, null, 4));
    } catch {
        secOut('Invalid JWT ❌');
    }
}

// ---------- AES ENCRYPT / DECRYPT ----------
async function aesEncrypt() {
    const text = document.getElementById('securityInput').value;
    const keyText = document.getElementById('aesKey').value;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(keyText),
        'AES-GCM',
        false,
        ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(text)
    );

    secOut(
        btoa(String.fromCharCode(...iv)) + ':' +
        btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    );
}

async function aesDecrypt() {
    try {
        const keyText = document.getElementById('aesKey').value;
        const [ivStr, dataStr] = document
            .getElementById('securityInput')
            .value
            .split(':');

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(keyText),
            'AES-GCM',
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: Uint8Array.from(atob(ivStr), c => c.charCodeAt(0))
            },
            key,
            Uint8Array.from(atob(dataStr), c => c.charCodeAt(0))
        );

        secOut(new TextDecoder().decode(decrypted));
    } catch {
        secOut('Decryption failed ❌');
    }
}

// ---------- HMAC ----------
async function generateHMAC() {
    const msg = document.getElementById('securityInput').value;
    const keyText = document.getElementById('hmacKey').value;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(keyText),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(msg)
    );

    const bytes = new Uint8Array(sig);
    secOut([...bytes].map(b => b.toString(16).padStart(2, '0')).join(''));
}

// ---------- RANDOM TOKEN ----------
function generateToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    secOut([...arr].map(b => b.toString(16)).join(''));
}

/* ---------- MD5 IMPLEMENTATION ---------- */
function md5(string) {
    return CryptoJS.MD5(string).toString();
}
