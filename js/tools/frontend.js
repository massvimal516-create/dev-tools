const feOut = msg =>
    document.getElementById('frontendOutput').textContent = msg;

// ---------- CSS ----------
function beautifyCSS() {
    const css = document.getElementById('cssInput').value;
    feOut(
        css.replace(/}/g, '}\n')
            .replace(/{/g, '{\n  ')
            .replace(/;/g, ';\n  ')
    );
}

function minifyCSS() {
    const css = document.getElementById('cssInput').value;
    feOut(css.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1'));
}

// ---------- COLOR ----------
function pickColor() {
    const hex = document.getElementById('colorPicker').value;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // Update the hex input if user wants to copy from there
    const hexInput = document.getElementById('hexInput');
    if (hexInput) hexInput.value = hex;

    feOut(`HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})`);
}

function hexToRgb() {
    const hex = document.getElementById('hexInput').value.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    feOut(`rgb(${r}, ${g}, ${b})`);
}

function rgbToHex() {
    const rgb = document.getElementById('rgbInput').value.match(/\d+/g);
    if (!rgb) {
        feOut('Invalid RGB ❌');
        return;
    }
    feOut(
        '#' + rgb.map(x => Number(x).toString(16).padStart(2, '0')).join('')
    );
}

// ---------- GRADIENT ----------
function generateGradient() {
    const c1 = document.getElementById('grad1').value;
    const c2 = document.getElementById('grad2').value;
    const css = `linear-gradient(to right, ${c1}, ${c2})`;
    document.getElementById('gradientPreview').style.background = css;
    feOut(css);
}

// ---------- BOX SHADOW ----------
function applyShadow() {
    const shadow = document.getElementById('shadowInput').value;
    document.getElementById('shadowPreview').style.boxShadow = shadow;
    feOut(`box-shadow: ${shadow};`);
}

// ---------- FONT PREVIEW ----------
function previewFont() {
    const font = document.getElementById('fontSelect').value;
    const text = document.getElementById('fontText').value || 'Sample Text';
    const box = document.getElementById('fontPreview');
    box.style.fontFamily = font;
    box.textContent = text;
    feOut(`font-family: ${font}`);
}

// ---------- RESPONSIVE ----------
function setViewport(width) {
    document.querySelector('.content').style.maxWidth = width + 'px';
    feOut(`Viewport set to ${width}px`);
}
