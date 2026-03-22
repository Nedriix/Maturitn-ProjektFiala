// Frontend skript: js/admin/dashboard.js
document.addEventListener('DOMContentLoaded', () => {

    async function checkAuth() {
        try {
            const response = await fetch('../api/check_auth.php');

            if (!response.ok) {
                window.location.href = 'index.html';
            } else {
                const data = await response.json();

                if (data.role === 'admin') {
                    document.getElementById('adminOnlyCard').style.display = 'block';
                    document.getElementById('adminOnlyPlayersCard').style.display = 'block';
                }
            }
        } catch (error) {
            window.location.href = 'index.html';
        }
    }

    checkAuth();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function(e) {
            e.preventDefault();
            await fetch('../api/logout.php');
            window.location.href = "index.html";
        });
    }
});
