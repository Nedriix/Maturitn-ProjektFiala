// Frontend skript: js/admin/sprava-uzivatelu.js
async function checkAuth() {
    try {
        const res = await fetch('../api/check_auth.php');
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        if (data.role !== 'admin') {
            alert("Nemáte oprávnění k této stránce.");
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        window.location.href = 'index.html';
    }
}
checkAuth();

async function loadUsers() {
    try {
        const res = await fetch('../api/get_users.php');
        const users = await res.json();
        const tbody = document.getElementById('usersList');
        tbody.innerHTML = '';

        users.forEach(u => {
            const roleClass = u.role === 'admin' ? 'role-admin' : 'role-editor';
            const dateStr = new Date(u.created_at).toLocaleString('cs-CZ');
            tbody.innerHTML += `
                <tr>
                    <td>#${u.id}</td>
                    <td>${u.email}</td>
                    <td><span class="role-badge ${roleClass}">${u.role.toUpperCase()}</span></td>
                    <td>${dateStr}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Chyba načítání uživatelů:", error);
    }
}
loadUsers();

document.getElementById("userForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    const response = await fetch('../api/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (response.ok) {
        alert("Účet byl úspěšně vytvořen.");
        document.getElementById("userForm").reset();
        loadUsers();
    } else {
        alert("Chyba: " + (result.error || "Neznámá chyba"));
    }
});

document.getElementById("logoutBtn").addEventListener("click", async function(e) {
    e.preventDefault();
    await fetch('../api/logout.php');
    window.location.href = "index.html";
});
