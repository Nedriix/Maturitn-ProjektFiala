// Frontend skript: js/index.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("contactForm");
    const jmeno = document.getElementById("jmeno");
    const emailInput = document.getElementById("email");
    const zprava = document.getElementById("zprava");
    const error = document.getElementById("errorMessage");

    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            error.style.display = "none";
            error.textContent = "";
            error.style.color = "#ff8a8a";

            const nameVal = jmeno.value.trim();
            const mailVal = emailInput.value.trim();
            const msgVal = zprava.value.trim();

            if (nameVal.length < 2) {
                error.style.display = "block";
                error.textContent = "Jméno musí mít alespoň 2 znaky.";
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(mailVal)) {
                error.style.display = "block";
                error.textContent = "Zadejte platný e-mail.";
                return;
            }

            if (msgVal.length < 10) {
                error.style.display = "block";
                error.textContent = "Zpráva musí mít alespoň 10 znaků.";
                return;
            }

            try {
                const response = await fetch('api/send_contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameVal, email: mailVal, message: msgVal })
                });

                const result = await response.json();

                if (response.ok) {
                    form.reset();
                    error.style.color = "#81c784";
                    error.textContent = "Děkujeme! Vaše zpráva byla úspěšně odeslána.";
                    error.style.display = "block";
                    setTimeout(() => { error.style.display = "none"; }, 5000);
                } else {
                    error.style.display = "block";
                    error.textContent = result.error || "Neznámá chyba při odesílání.";
                }
            } catch (err) {
                error.style.display = "block";
                error.textContent = "Nepodařilo se spojit se serverem.";
            }
        });
    }

    loadHomeArticles();
    loadPlayoff();
    loadPublicMatches();
});

async function loadHomeArticles() {
    const homeContainer = document.getElementById("homeArticles");
    try {
        const response = await fetch('api/get_articles.php');
        const articles = await response.json();

        if (articles.length === 0) {
            homeContainer.innerHTML = "<p style='color: var(--text-muted);'>Zatím nebyly publikovány žádné články.</p>";
            return;
        }

        homeContainer.innerHTML = "";
        articles.slice(0, 3).forEach((article) => {
            const div = document.createElement("div");
            div.classList.add("game-block");
            div.style.cursor = "pointer";

            const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('cs-CZ') : '';

            div.innerHTML = `
                <h3>${article.title}</h3>
                ${dateStr ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">${dateStr}</p>` : ''}
                ${article.image_url ? `<img src="${article.image_url}" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 10px; margin: 10px 0;">` : ""}
                <p>${article.content.substring(0, 120)}...</p>
                <button class="btn" style="margin-top: 15px;">Číst více</button>
            `;

            div.addEventListener("click", () => {
                localStorage.setItem("selectedArticle", JSON.stringify(article));
                window.location.href = "clanek.html";
            });

            homeContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Chyba při načítání článků:", error);
        homeContainer.innerHTML = "<p style='color: #ff8a8a;'>Nepodařilo se načíst články ze serveru.</p>";
    }
}

async function loadPlayoff() {
    try {
        const response = await fetch('api/get_playoff.php');
        const data = await response.json();

        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el && data[key].trim() !== "") {
                el.textContent = data[key];
            }
        });
    } catch (error) {
        console.error("Chyba při načítání pavouka:", error);
    }
}

async function loadPublicMatches() {
    const container = document.getElementById("publicMatchesContainer");
    try {
        const response = await fetch('api/get_matches.php');
        const matches = await response.json();

        if (matches.length === 0) {
            container.innerHTML = "<p style='color: var(--text-muted);'>Zatím nejsou naplánovány žádné zápasy.</p>";
            return;
        }

        container.innerHTML = "";

        matches.forEach(m => {
            const dateStr = new Date(m.match_date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = m.match_time.substring(0, 5);

            let statusClass;
            let statusText;
            if (m.status === 'upcoming') {
                statusClass = 'upcoming';
                statusText = 'Nadcházející zápas';
            } else {
                const parts = m.score ? m.score.split(':') : [];
                const isLoss = parts.length === 2 && parseInt(parts[0]) < parseInt(parts[1]);
                statusClass = isLoss ? 'lost' : 'finished';
                statusText = `Výsledek: ${m.score}`;
            }

            const matchCard = document.createElement("div");
            matchCard.className = "match-card";

            let htmlContent = `
                <div class="match-info">
                    <h3>SPŠT E-sport vs. ${m.opponent}</h3>
                    <p>Hra: ${m.game}</p>
                    <p>Datum: ${dateStr}</p>
                    <p>Čas: ${timeStr}</p>
            `;

            if (m.report) {
                htmlContent += `<p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); color: #fff;"><em>" ${m.report} "</em></p>`;
            }

            htmlContent += `
                </div>
                <div class="match-status ${statusClass}">${statusText}</div>
            `;

            matchCard.innerHTML = htmlContent;
            container.appendChild(matchCard);
        });
    } catch (error) {
        console.error("Chyba při načítání zápasů:", error);
        container.innerHTML = "<p style='color: #ff8a8a;'>Nepodařilo se načíst program zápasů.</p>";
    }
}
