// Frontend skript: js/nav-auth.js
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('api/check_auth.php');
        if (response.ok) {
            const data = await response.json();
            const navUl = document.querySelector('#nav-menu ul');
            if (data.logged_in && navUl) {
                const li = document.createElement('li');
                if (data.type === 'admin') {
                    li.innerHTML = '<a href="admin/dashboard.html" style="color: var(--accent-hover); font-weight: 700;">Admin Panel</a>';
                } else if (data.type === 'player') {
                    li.innerHTML = '<a href="hrac/dashboard.html" style="color: var(--accent-hover); font-weight: 700;">Můj profil</a>';
                }
                navUl.appendChild(li);
            }
        }
    } catch (error) {
        console.error("Chyba při kontrole přihlášení:", error);
    }
});
