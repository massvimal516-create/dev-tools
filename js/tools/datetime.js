const dtOut = msg =>
    document.getElementById('datetimeOutput').textContent = msg;

// ---------- UNIX TIMESTAMP ----------
function unixToDate() {
    const unix = Number(document.getElementById('unixInput').value);
    if (!unix) {
        dtOut('Invalid Unix timestamp ❌');
        return;
    }
    dtOut(new Date(unix * 1000).toString());
}

function dateToUnix() {
    dtOut(Math.floor(Date.now() / 1000).toString());
}

// ---------- DATE FORMATTER ----------
function formatDate() {
    const format = document.getElementById('dateFormatInput').value || 'YYYY-MM-DD HH:mm:ss';
    const d = new Date();

    const formatted = format
        .replace('YYYY', d.getFullYear())
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('DD', String(d.getDate()).padStart(2, '0'))
        .replace('HH', String(d.getHours()).padStart(2, '0'))
        .replace('mm', String(d.getMinutes()).padStart(2, '0'))
        .replace('ss', String(d.getSeconds()).padStart(2, '0'));

    dtOut(formatted);
}

// ---------- TIME ZONE CONVERTER ----------
function convertTimeZone() {
    const tz = document.getElementById('tzInput').value || 'UTC';

    try {
        const now = new Date();
        const converted = now.toLocaleString('en-US', { timeZone: tz });
        dtOut(`Time in ${tz}:\n${converted}`);
    } catch {
        dtOut('Invalid Time Zone ❌');
    }
}

// ---------- CRON GENERATOR ----------
function generateCron() {
    const m = document.getElementById('cronMinute').value || '*';
    const h = document.getElementById('cronHour').value || '*';
    const d = document.getElementById('cronDay').value || '*';

    dtOut(`Cron Expression:\n${m} ${h} ${d} * *`);
}

// ---------- COUNTDOWN ----------
let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval);

    let seconds = Number(document.getElementById('countdownInput').value);
    if (!seconds || seconds <= 0) {
        dtOut('Invalid countdown time ❌');
        return;
    }

    countdownInterval = setInterval(() => {
        dtOut(`Remaining: ${seconds}s`);
        seconds--;

        if (seconds < 0) {
            clearInterval(countdownInterval);
            dtOut('Countdown finished ✅');
        }
    }, 1000);
}

// ---------- ISO-8601 ----------
function generateISO() {
    dtOut(new Date().toISOString());
}
