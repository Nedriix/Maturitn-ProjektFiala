// Frontend skript: js/admin/pridani-hrace.js
document.getElementById("playerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("role", document.getElementById("role").value);
    formData.append("game", document.getElementById("game").value);
    formData.append("desc", document.getElementById("desc").value);
    formData.append("instagram", document.getElementById("instagram").value);
    formData.append("twitch", document.getElementById("twitch").value);

    const photoFile = document.getElementById("photo").files[0];
    if (photoFile) {
        formData.append("photo", photoFile);
    }

    try {
        const response = await fetch('../api/add_player.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("Hráč byl přidán");
            window.location.href = "../hraci.html";
        } else {
            alert("Chyba: " + (result.error || "Neznámá chyba"));
        }
    } catch (error) {
        console.error("Chyba:", error);
        alert("Došlo k chybě při komunikaci se serverem.");
    }
});

async function checkAuth() {
    try {
        const response = await fetch('../api/check_auth.php');
        if (!response.ok) {
            window.location.href = 'index.html';
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
