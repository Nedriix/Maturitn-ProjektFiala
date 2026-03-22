// Frontend skript: js/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'none';

    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = result.redirect;
        } else {
            errorBox.textContent = result.error || 'Přihlášení se nezdařilo.';
            errorBox.style.display = 'block';
        }
    } catch (err) {
        errorBox.textContent = 'Chyba komunikace se serverem.';
        errorBox.style.display = 'block';
    }
});
