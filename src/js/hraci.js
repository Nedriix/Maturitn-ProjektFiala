// Frontend skript: js/hraci.js
async function loadPlayers() {
    const container = document.getElementById("players-container");
    try {
        const response = await fetch('api/get_players.php');
        const players = await response.json();

        if (players.length === 0) {
            container.innerHTML = "<p>Zatím nebyli přidáni žádní hráči.</p>";
            return;
        }

        const games = {};
        players.forEach(player => {
            if (!games[player.game]) {
                games[player.game] = [];
            }
            games[player.game].push(player);
        });

        for (const [gameName, gamePlayers] of Object.entries(games)) {
            const gameBlock = document.createElement("div");
            gameBlock.classList.add("game-block");

            gameBlock.innerHTML = `
                <div class="game-head">
                    <h3>${gameName}</h3>
                    <span class="game-tag">${gameName}</span>
                </div>
                <div class="players-grid"></div>
            `;

            const grid = gameBlock.querySelector(".players-grid");

            gamePlayers.forEach(player => {
                const card = document.createElement("article");
                card.classList.add("player-card");

                const photoSrc = player.photo_url ? player.photo_url : 'img/players/hrac1.png';

                card.innerHTML = `
                    <img src="${photoSrc}" class="player-photo" alt="${player.name}">
                    <div class="player-body">
                        <div class="player-top">
                            <h4 class="player-name">${player.name}</h4>
                            <span class="player-role">${player.role}</span>
                        </div>
                        <p class="player-desc">${player.description || ''}</p>
                        <div class="player-socials">
                            ${player.instagram ? `<a class="social-link" href="${player.instagram}" target="_blank">Instagram</a>` : ""}
                            ${player.twitch ? `<a class="social-link" href="${player.twitch}" target="_blank">Twitch</a>` : ""}
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });

            container.appendChild(gameBlock);
        }

    } catch (error) {
        console.error("Chyba při načítání hráčů:", error);
        container.innerHTML = "<p style='color: #ff8a8a;'>Nepodařilo se načíst hráče ze serveru. Zkontrolujte připojení k databázi.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadPlayers);
