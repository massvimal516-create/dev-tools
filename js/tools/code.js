const codeOut = msg =>
    document.getElementById('codeOutput').textContent = msg;

// ---------- MINIFIER ----------
function minifyCode() {
    const code = document.getElementById('codeInput').value;
    codeOut(
        code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
    );
}

// ---------- OBFUSCATOR ----------
function obfuscateCode() {
    const code = document.getElementById('codeInput').value;
    codeOut(
        btoa(unescape(encodeURIComponent(code)))
    );
}

// ---------- SYNTAX HIGHLIGHTER ----------
// ---------- SYNTAX HIGHLIGHTER ----------
function highlightSyntax() {
    const raw = document.getElementById('codeInput').value;

    // Simple naive highlighting
    let html = raw
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML first
        .replace(/\b(function|return|if|else|var|let|const|class|import|from|async|await)\b/g, '<span class="tok-keyword">$1</span>')
        .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="tok-string">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');

    document.getElementById('codeOutput').innerHTML = html;
}

// ---------- DIFF COMPARATOR ----------
function compareCode() {
    const a = document.getElementById('codeA').value.split('\n');
    const b = document.getElementById('codeB').value.split('\n');

    let result = '';
    const max = Math.max(a.length, b.length);

    for (let i = 0; i < max; i++) {
        if (a[i] !== b[i]) {
            result += `Line ${i + 1}:\n- ${a[i] || ''}\n+ ${b[i] || ''}\n\n`;
        }
    }

    codeOut(result || 'No differences ✅');
}

// ---------- SNIPPET MANAGER ----------
function saveSnippet() {
    const name = document.getElementById('snippetName').value;
    const code = document.getElementById('codeInput').value;

    if (!name || !code) {
        codeOut('Snippet name & code required ❌');
        return;
    }

    localStorage.setItem('snippet_' + name, code);
    codeOut(`Snippet "${name}" saved ✅`);
}

function loadSnippets() {
    let list = 'Saved Snippets:\n';

    Object.keys(localStorage)
        .filter(k => k.startsWith('snippet_'))
        .forEach(k => list += '- ' + k.replace('snippet_', '') + '\n');

    codeOut(list || 'No snippets found');
}

// ---------- PSEUDOCODE ----------
function generatePseudocode() {
    const code = document.getElementById('codeInput').value;

    const pseudo = code
        .replace(/function\s+(\w+)/g, 'DEFINE FUNCTION $1')
        .replace(/if\s*\((.*?)\)/g, 'IF $1 THEN')
        .replace(/else/g, 'ELSE')
        .replace(/for\s*\((.*?)\)/g, 'FOR $1')
        .replace(/while\s*\((.*?)\)/g, 'WHILE $1')
        .replace(/{|}/g, '');

    codeOut(pseudo);
}
