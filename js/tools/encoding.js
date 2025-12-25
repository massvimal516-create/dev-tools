/* Base64 Guru Logic */

// --- TAB MANAGEMENT ---
function switchEncTab(tabName) {
    // Buttons
    document.querySelectorAll('.enc-tab-btn').forEach(btn => {
        if (btn.innerText.toLowerCase().includes(tabName.substring(0, 3))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Content
    document.querySelectorAll('.enc-tab-content').forEach(div => {
        div.classList.remove('active');
    });

    // Explicit mapping or ID match
    const target = document.getElementById(tabName === 'tools' ? 'toolsTab' : tabName);
    if (target) target.classList.add('active');
}

function toggleEncInput() {
    const type = document.getElementById('encSourceType').value;
    const textArea = document.getElementById('encTextInputArea');
    const fileArea = document.getElementById('encFileInputArea');

    if (type === 'file') {
        textArea.classList.add('hidden');
        fileArea.classList.remove('hidden');
    } else {
        textArea.classList.remove('hidden');
        fileArea.classList.add('hidden');
    }
}

function handleFileSelect(input) {
    const fileName = input.files[0] ? input.files[0].name : '';
    document.getElementById('encFileName').textContent = fileName;
}

// --- CORE ENCODING ---
function performEncoding() {
    const type = document.getElementById('encSourceType').value;
    const output = document.getElementById('encOutput');
    const useDataUri = document.getElementById('encDataUri').checked;
    output.value = 'Processing...';

    try {
        if (type === 'file') {
            const file = document.getElementById('encFileInput').files[0];
            if (!file) {
                output.value = 'Please select a file first.';
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result; // "data:mime;base64,..."
                if (useDataUri) {
                    output.value = dataUrl;
                } else {
                    output.value = dataUrl.split(',')[1];
                }
                showToast(`Encoded ${file.name} (${formatBytes(output.value.length)})`);
            };
            reader.onerror = function () {
                output.value = 'Error reading file.';
            };
            reader.readAsDataURL(file);

        } else {
            let encoded = '';
            let mime = 'text/plain';

            if (type === 'text') {
                const val = document.getElementById('encTextInput').value;
                encoded = btoa(unescape(encodeURIComponent(val)));
            } else if (type === 'hex') {
                const val = document.getElementById('encTextInput').value.replace(/\s/g, '');
                const str = hexToString(val);
                encoded = btoa(str);
                mime = 'application/octet-stream';
            } else if (type === 'url' || type === 'html') {
                const val = document.getElementById('encTextInput').value;
                encoded = btoa(unescape(encodeURIComponent(val))); // Default to text encoding
                if (type === 'html') mime = 'text/html';
            }

            if (useDataUri) {
                output.value = `data:${mime};base64,${encoded}`;
            } else {
                output.value = encoded;
            }
        }

    } catch (e) {
        console.error(e);
        output.value = 'Error: ' + e.message;
    }
}

// --- CORE DECODING ---
function performDecoding() {
    const input = document.getElementById('decInput').value.trim();
    if (!input) return;

    const type = document.getElementById('decTargetType').value;
    const preview = document.getElementById('decPreviewArea');
    const textOut = document.getElementById('decTextOutput');

    // Reset
    preview.innerHTML = '';
    preview.classList.add('hidden');
    textOut.classList.add('hidden');
    textOut.value = '';

    try {
        // Universal clean (remove data URI prefix if present)
        let base64 = input;
        if (base64.includes(',')) {
            base64 = base64.split(',')[1];
        }
        // Remove whitespace
        base64 = base64.replace(/\s/g, '');

        if (type === 'text' || type === 'hex' || type === 'auto') {
            // Try text decode
            try {
                const str = decodeURIComponent(escape(atob(base64)));

                if (type === 'hex') {
                    textOut.value = stringToHex(str);
                    textOut.classList.remove('hidden');
                } else if (type === 'text') {
                    textOut.value = str;
                    textOut.classList.remove('hidden');
                } else {
                    // Auto-detect: if it looks like binary or text?
                    // Simple heuristic: if it has many non-printable chars, assume binary/file
                    // For now, if auto, just show text if possible, else error
                    textOut.value = str;
                    textOut.classList.remove('hidden');
                }
            } catch (e) {
                if (type !== 'auto') throw e;
                // If auto failed text decode, maybe it's an image?
            }
        }

        if (['image', 'audio', 'video', 'pdf', 'auto'].includes(type)) {
            // For auto, we need mime type detection from magic bytes
            // For specific, we force mime
            let mime = '';

            if (type === 'image') mime = 'image/png'; // generic fallback
            if (type === 'audio') mime = 'audio/mp3';
            if (type === 'video') mime = 'video/mp4';
            if (type === 'pdf') mime = 'application/pdf';

            // If auto, try to check first char of base64?
            // /9j/ = jpg, iVBOR = png, JVBER = pdf, etc.
            if (type === 'auto') {
                if (base64.startsWith('/9j/')) mime = 'image/jpeg';
                else if (base64.startsWith('iVBOR')) mime = 'image/png';
                else if (base64.startsWith('R0lGOD')) mime = 'image/gif';
                else if (base64.startsWith('JVBER')) mime = 'application/pdf';
                else if (base64.startsWith('SUQz')) mime = 'audio/mp3';
                else if (base64.startsWith('AAA')) mime = 'audio/mp3'; // inaccurate
            }

            if (mime || (type !== 'auto' && type !== 'text' && type !== 'hex')) {
                const src = `data:${mime};base64,${base64}`;

                if (mime.startsWith('image/') || type === 'image') {
                    const img = document.createElement('img');
                    img.src = src;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '400px';
                    preview.appendChild(img);
                } else if (mime.startsWith('audio/') || type === 'audio') {
                    const audio = document.createElement('audio');
                    audio.src = src;
                    audio.controls = true;
                    preview.appendChild(audio);
                } else if (mime.startsWith('video/') || type === 'video') {
                    const video = document.createElement('video');
                    video.src = src;
                    video.controls = true;
                    video.style.maxWidth = '100%';
                    preview.appendChild(video);
                } else if (mime === 'application/pdf' || type === 'pdf') {
                    const iframe = document.createElement('iframe');
                    iframe.src = src;
                    iframe.style.width = '100%';
                    iframe.style.height = '500px';
                    preview.appendChild(iframe);
                }

                // Add Download Link
                const dwnBtn = document.createElement('a');
                dwnBtn.href = src;
                dwnBtn.download = `decoded_file.${mime.split('/')[1] || 'bin'}`;
                dwnBtn.textContent = 'Download File';
                dwnBtn.className = 'btn-secondary';
                dwnBtn.style.textAlign = 'center';
                dwnBtn.style.marginTop = '10px';
                dwnBtn.style.display = 'block';
                preview.appendChild(dwnBtn);

                preview.classList.remove('hidden');
            }
        }

    } catch (e) {
        showToast('Decoding Error: ' + e.message, 'error');
    }
}

// --- TOOLS ---
function repairBase64() {
    const input = document.getElementById('toolOutput'); // or prompt?
    // Use decInput as source? Or make a new area? 
    // Let's use standard prompt/alert or just re-use enc/dec fields?
    // Let's make it simpler: Check the 'decInput', fix it, put it back.
    const Area = document.getElementById('decInput');
    if (!Area.value) {
        showToast('Paste content into Decoder input first', 'warning');
        return;
    }
    const fixed = Area.value.replace(/\s+/g, '');
    let padded = fixed;
    while (padded.length % 4 !== 0) {
        padded += '=';
    }
    Area.value = padded;
    document.getElementById('toolOutput').value = "Repaired & Padded:\n" + padded;
    showToast('Base64 Repaired');
}

function checkBase64() {
    const val = document.getElementById('decInput').value.replace(/\s+/g, '');
    if (!val) {
        showToast('Paste content into Decoder input first', 'warning');
        return;
    }
    const regex = /^[A-Za-z0-9+/]+={0,2}$/;
    const isValid = regex.test(val) && (val.length % 4 === 0);

    const output = document.getElementById('toolOutput');
    if (isValid) {
        // Double check with atob
        try {
            atob(val);
            output.value = "✅ Valid Base64 String";
        } catch (e) {
            output.value = "❌ Structure valid but decoding failed: " + e.message;
        }
    } else {
        output.value = "❌ Invalid Base64 Characters or Length";
    }
}


// --- UTILS ---
function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function downloadEncOutput() {
    const text = document.getElementById('encOutput').value;
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'base64_output.txt';
    a.click();
}
