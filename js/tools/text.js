const textInput = () => document.getElementById('textInput').value;
const textOutput = msg => document.getElementById('textOutput').textContent = msg;

function toUpper() {
    textOutput(textInput().toUpperCase());
}

function toLower() {
    textOutput(textInput().toLowerCase());
}

function removeExtraSpaces() {
    textOutput(textInput().replace(/\s+/g, ' ').trim());
}

function sortLines() {
    textOutput(
        textInput()
            .split('\n')
            .sort()
            .join('\n')
    );
}

function addLineNumbers() {
    textOutput(
        textInput()
            .split('\n')
            .map((line, i) => `${i + 1}: ${line}`)
            .join('\n')
    );
}

function wordCharCount() {
    const text = textInput();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    textOutput(`Words: ${words}\nCharacters: ${chars}`);
}

function findAndReplace() {
    const find = document.getElementById('findText').value;
    const replace = document.getElementById('replaceText').value;

    if (!find) {
        textOutput('Find value cannot be empty ❌');
        return;
    }

    const regex = new RegExp(find, 'g');
    textOutput(textInput().replace(regex, replace));
}

function testRegex() {
    const pattern = document.getElementById('regexPattern').value;

    try {
        const regex = new RegExp(pattern, 'g');
        const matches = textInput().match(regex);

        textOutput(
            matches
                ? `Matches (${matches.length}):\n${matches.join('\n')}`
                : 'No matches found'
        );
    } catch {
        textOutput('Invalid Regex ❌');
    }
}
