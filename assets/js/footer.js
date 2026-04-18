// ========== FOOTER.JS ==========
document.addEventListener('DOMContentLoaded', function () {
    const yearElement = document.getElementById('currentYear');
    if (yearElement && !yearElement.textContent.trim()) {
        yearElement.textContent = new Date().getFullYear();
    }
});
