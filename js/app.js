const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tool-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tool).classList.add('active');
    });
});
