// Frontend skript: js/clanek.js
function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function truncateText(text, maxLength) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) {
        return normalized;
    }
    return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function setMetaContent(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.setAttribute("content", value);
    }
}

function setCanonical(value) {
    const element = document.getElementById("canonicalLink");
    if (element) {
        element.setAttribute("href", value);
    }
}

function updateArticleSeo(article, articleId) {
    const pageUrl = `${window.location.origin}${window.location.pathname}`;
    const articleUrl = articleId ? `${pageUrl}?id=${encodeURIComponent(articleId)}` : pageUrl;
    const defaultImage = `${window.location.origin}/img/obrazek.jpg`;
    const imageUrl = article.image_url ? new URL(article.image_url, window.location.origin).href : defaultImage;
    const description = truncateText(article.content, 160) || "Detail článku školního e-sport týmu SPŠT.";
    const title = article.title ? `${article.title} | SPŠT E-sport` : "Článek | SPŠT E-sport";

    document.title = title;
    setMetaContent("metaDescription", description);
    setMetaContent("metaRobots", "index,follow");
    setCanonical(articleUrl);

    setMetaContent("ogTitle", title);
    setMetaContent("ogDescription", description);
    setMetaContent("ogUrl", articleUrl);
    setMetaContent("ogImage", imageUrl);

    setMetaContent("twitterTitle", title);
    setMetaContent("twitterDescription", description);
    setMetaContent("twitterImage", imageUrl);

    const isoDate = article.created_at ? new Date(article.created_at).toISOString() : "";
    setMetaContent("articlePublishedTime", isoDate);

    const jsonLdScript = document.getElementById("articleJsonLd");
    if (jsonLdScript) {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title || "Článek",
            "description": description,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": articleUrl
            },
            "image": [imageUrl],
            "author": {
                "@type": "Organization",
                "name": "SPŠT E-sport"
            },
            "publisher": {
                "@type": "Organization",
                "name": "SPŠT E-sport",
                "logo": {
                    "@type": "ImageObject",
                    "url": defaultImage
                }
            }
        };

        if (isoDate) {
            jsonLd.datePublished = isoDate;
            jsonLd.dateModified = isoDate;
        }

        jsonLdScript.textContent = JSON.stringify(jsonLd);
    }
}

async function fetchArticleById(articleId) {
    const response = await fetch('api/get_articles.php');
    if (!response.ok) {
        throw new Error('Nepodařilo se načíst články.');
    }

    const articles = await response.json();
    return articles.find((item) => String(item.id) === String(articleId)) || null;
}

function renderNotFound(container) {
    setMetaContent("metaRobots", "noindex,follow");
    document.title = "Článek nenalezen | SPŠT E-sport";

    container.innerHTML = `
        <h1 style="margin-bottom:20px; text-align: center;">Článek nebyl nalezen</h1>
        <p style="text-align: center; color: var(--text-muted);">Zkuste se vrátit zpět na přehled článků a vybrat některý znovu.</p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="clanky.html" class="btn">Zpět na články</a>
        </div>
    `;
}

function renderArticle(container, article) {
    const imageHtml = article.image_url
        ? `<img src="${escapeHtml(article.image_url)}" alt="Obrázek k článku: ${escapeHtml(article.title)}" loading="eager" style="width:100%; max-height: 400px; object-fit: cover; border-radius:10px; margin-bottom:30px;">`
        : "";

    container.innerHTML = `
        <h1 style="margin-bottom:20px; color: var(--accent-hover);">${escapeHtml(article.title)}</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
            Publikováno: ${article.created_at ? new Date(article.created_at).toLocaleDateString('cs-CZ') : 'Neznámé datum'}
        </p>
        ${imageHtml}
        <p style="line-height:1.8; white-space: pre-wrap; color: var(--text-main); font-size: 1.05rem;">${escapeHtml(article.content)}</p>
        <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <a href="clanky.html" class="btn">Zpět na všechny články</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById("article");
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("id");
    let article = null;

    if (articleId) {
        try {
            article = await fetchArticleById(articleId);
        } catch (error) {
            console.error('Chyba při načtení článku podle ID:', error);
        }
    }

    if (!article) {
        article = JSON.parse(localStorage.getItem("selectedArticle"));
    }

    if (!article) {
        renderNotFound(container);
        return;
    }

    localStorage.setItem("selectedArticle", JSON.stringify(article));
    renderArticle(container, article);
    updateArticleSeo(article, article.id || articleId);
});
