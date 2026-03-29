// Frontend skript: js/hrac/login.js


document.getElementById("playerLoginForm").addEventListener("submit", async (e) => {
    
    e.preventDefault();

    // Získáme přihlašovací údaje z formuláře
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Odešleme POST požadavek na server
    const res = await fetch('../api/login_player.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        
        window.location.href = "dashboard.html";
    } else {
    
        alert("Špatný e-mail nebo heslo!");
    }
});
