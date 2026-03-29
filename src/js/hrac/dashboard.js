// Frontend skript: js/hrac/dashboard.js

document.addEventListener('DOMContentLoaded', () => {


    async function loadProfileData() {
        try {
            // Ověříme, zda je hráč přihlášen – pokud ne, server vrátí 401
            const authRes = await fetch('../api/check_auth.php');
            if (!authRes.ok) {
                // Hráč není přihlášen – přesměrujeme ho na hlavní stránku
                window.location.href = 'index.html';
                return;
            }

            // Načteme profilová data hráče ze serveru
            const res = await fetch('../api/get_my_profile.php');
            if (res.ok) {
                const data = await res.json();

                // Vyplníme formulářová pole aktuálními hodnotami z profilu
                document.getElementById('desc').value = data.description || '';
                document.getElementById('instagram').value = data.instagram || '';
                document.getElementById('twitch').value = data.twitch || '';

                // Pokud má hráč nastavenou profilovku, zobrazíme ji nad formulářem
                if (data.photo_url) {
                    const photoContainer = document.getElementById('photoContainer');
                    photoContainer.innerHTML = `
                        <label style="display: block; margin-bottom: 5px; color: var(--text-muted);">Aktuální fotka:</label>
                        <img src="../${data.photo_url}" class="current-photo" alt="Profilovka">
                    `;
                }
            } else {
                alert("Nepodařilo se načíst data profilu.");
            }
        } catch (error) {
            console.error("Chyba při načítání:", error);
        }
    }

    // Spustíme načítání dat ihned po načtení stránky
    loadProfileData();


    document.getElementById("profileForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Použijeme FormData pro odesílání dat včetně případného souboru s fotkou
        const formData = new FormData();
        formData.append("desc", document.getElementById("desc").value);
        formData.append("instagram", document.getElementById("instagram").value);
        formData.append("twitch", document.getElementById("twitch").value);

        // Pokud hráč vybral novou fotku, přidáme ji do požadavku
        const photoFile = document.getElementById("photo").files[0];
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        try {
            
            const res = await fetch('../api/update_my_profile.php', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                
                alert("Profil byl úspěšně aktualizován!");
                window.location.reload();
            } else {
                alert("Došlo k chybě při ukládání.");
            }
        } catch (err) {
            alert("Chyba komunikace se serverem.");
        }
    });

 
    document.getElementById("logoutBtn").addEventListener("click", async (e) => {
        e.preventDefault();
        // Zavoláme API pro zrušení session na serveru
        await fetch('../api/logout.php');
    
        window.location.href = "index.html";
    });

    
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmNewPassword = document.getElementById('confirm_new_password').value;
        const passwordMsg = document.getElementById('passwordMsg');

        if (newPassword !== confirmNewPassword) {
            passwordMsg.textContent = 'Nová hesla se neshodují.';
            passwordMsg.style.color = '#ff8a8a';
            passwordMsg.style.display = 'block';
            return;
        }

        if (newPassword.length < 8) {
            passwordMsg.textContent = 'Nové heslo musí mít alespoň 8 znaků.';
            passwordMsg.style.color = '#ff8a8a';
            passwordMsg.style.display = 'block';
            return;
        }

        try {
            const res = await fetch('../api/update_my_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                passwordMsg.textContent = 'Heslo bylo úspěšně změněno.';
                passwordMsg.style.color = '#81c784';
                passwordMsg.style.display = 'block';
                document.getElementById('passwordForm').reset();
            } else {
                passwordMsg.textContent = data.error || 'Došlo k chybě při změně hesla.';
                passwordMsg.style.color = '#ff8a8a';
                passwordMsg.style.display = 'block';
            }
        } catch (err) {
            passwordMsg.textContent = 'Chyba komunikace se serverem.';
            passwordMsg.style.color = '#ff8a8a';
            passwordMsg.style.display = 'block';
        }
    });

});
