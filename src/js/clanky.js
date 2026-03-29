// Frontend skript: js/clanky.js
function truncateText(text, maxLength) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) {
        return normalized;
    }
    return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

async function loadArticles() {
    const container = document.getElementById("articles");
    try {
        const response = await fetch('api/get_articles.php');
        const articles = await response.json();

        if (articles.length === 0) {
            container.innerHTML = "<p style='color: var(--text-muted);'>Zatím nebyly publikovány žádné články.</p>";
            return;
        }

        articles.forEach((article) => {
            const div = document.createElement("div");
            div.classList.add("game-block");

            const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('cs-CZ') : '';
            const articleUrl = article.id ? `clanek.html?id=${encodeURIComponent(article.id)}` : 'clanek.html';
            const previewText = truncateText(article.content, 150);
            const imageHtml = article.image_url
                ? '<img src="' + article.image_url + '" alt="Náhled článku: ' + article.title + '" loading="lazy" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">'
                : '';

            div.innerHTML = `
                <h3>${article.title}</h3>
                ${dateStr ? '<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Publikováno: ' + dateStr + '</p>' : ''}
                ${imageHtml}
                <p>${previewText}</p>
                <a href="${articleUrl}" class="btn read-more-link" style="margin-top: 15px; display: inline-block;">Číst více</a>
            `;

            const detailLink = div.querySelector('.read-more-link');
            detailLink.addEventListener('click', () => {
                localStorage.setItem("selectedArticle", JSON.stringify(article));
            });

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Chyba při načítání článků:", error);
        container.innerHTML = "<p style='color: #ff8a8a;'>Nepodařilo se načíst články ze serveru. Zkontrolujte připojení k databázi.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);
