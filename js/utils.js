/**
 * Global Utility Functions
 */

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    // Toast Styles
    toast.style.padding = '12px 24px';
    toast.style.marginBottom = '10px';
    toast.style.borderRadius = '8px';
    toast.style.color = 'white';
    toast.style.fontFamily = 'var(--font-main)';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';

    // Icons
    let icon = '';
    if (type === 'success') {
        toast.style.backgroundColor = '#10b981'; // Green
        icon = '<i class="fa-solid fa-check-circle"></i>';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#ef4444'; // Red
        icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else {
        toast.style.backgroundColor = '#3b82f6'; // Blue
        icon = '<i class="fa-solid fa-info-circle"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;

    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Global Copy to Clipboard function
window.copyFormatted = function (elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.textContent) return;

    navigator.clipboard.writeText(el.textContent).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy', 'error');
        console.error('Copy failed', err);
    });
};

/* Auto-add Copy Buttons to all <pre> tags with content */
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to all tool section buttons to trigger formatting feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Very basic heuristic: if it's a "process" button, show some feedback
            // This is just visual feedback, the actual logic runs in the onclick handlers
            // We won't intercept them, but we could add a slight animation or check outputs
        });
    });

    // Add Copy buttons to <pre> elements
    // We observe mutations because contents change dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target.parentElement; // content update usually happens inside
                // If the target is a pre tag or inside one, we might want to ensure a copy btn exists
                // But simpler: just add a static Copy button next to every <pre> in HTML? 
                // Alternatively, let's keep it simple: Double click output to copy?

            }
        });
    });

    // Instead of complex observers, let's just make sure we can copy easily.
    // We will attach a double-click listener to all pre tags globally
    document.body.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'PRE') {
            const text = e.target.textContent;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('Copied to clipboard!');
                });
            }
        }
    });
});

window.clearContent = function (...ids) {
    let cleared = false;
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = '';
                cleared = true;
            } else {
                el.textContent = '';
                el.innerHTML = '';
                cleared = true;
            }
        }
    });
    if (cleared) showToast('Cleared!', 'info');
};

window.copyContent = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? el.value : el.textContent;
    if (!text || text.trim() === '') {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error(err);
        showToast('Failed to copy', 'error');
    });
};
