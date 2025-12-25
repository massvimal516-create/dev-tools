// Navigation Logic
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tool-section');
const sidebar = document.getElementById('appSidebar');
const overlay = document.querySelector('.sidebar-overlay');

// Toggle Sidebar
window.toggleSidebar = function () {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Close sidebar when clicking outside (overlay) is handled by overlay onclick in HTML

// Load state from local storage or default to 'home'
const lastTool = localStorage.getItem('devtools_active_tool') || 'home';

function setActiveTool(toolId) {
    // Update UI
    navButtons.forEach(b => {
        if (b.dataset.tool === toolId) b.classList.add('active');
        else b.classList.remove('active');
    });

    sections.forEach(s => {
        if (s.id === toolId) s.classList.add('active');
        else s.classList.remove('active');
    });

    // Auto-close sidebar on mobile/offcanvas selection
    sidebar.classList.remove('open');
    overlay.classList.remove('active');

    // Save state
    localStorage.setItem('devtools_active_tool', toolId);
}

// Initial Load
// Verify if the toolId actually exists
if (document.getElementById(lastTool)) {
    setActiveTool(lastTool);
} else {
    setActiveTool('home');
}

// Event Listeners
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setActiveTool(btn.dataset.tool);
    });
});

