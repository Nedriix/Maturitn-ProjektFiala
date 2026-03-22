// Frontend skript: js/admin/login.js
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('../api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = "dashboard.html";
        } else {
            errorMsg.textContent = result.error;
            errorMsg.style.display = "block";
        }
    } catch (error) {
        errorMsg.textContent = "Chyba připojení k serveru.";
        errorMsg.style.display = "block";
    }
});
