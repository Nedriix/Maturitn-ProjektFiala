// Frontend skript: js/admin/sprava-clanku.js
async function checkAuth() {
    const res = await fetch('../api/check_auth.php');
    if (!res.ok) window.location.href = 'index.html';
}
checkAuth();

const quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Napište skvělý obsah...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    }
});

async function loadArticles() {
    try {
        const res = await fetch('../api/get_articles.php');
        const articles = await res.json();
        const tbody = document.getElementById('articlesList');
        tbody.innerHTML = '';

        window.articlesData = articles;

        articles.forEach((a, index) => {
            const dateStr = new Date(a.created_at).toLocaleDateString('cs-CZ');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${a.id}</td>
                <td><strong>${a.title}</strong></td>
                <td>${dateStr}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editArticle(${index})">Upravit</button>
                    <button class="action-btn btn-delete" onclick="deleteArticle(${a.id})">Smazat</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error(err); }
}
loadArticles();

function openForm() {
    document.getElementById('articleFormContainer').style.display = 'block';
    document.getElementById('formTitle').textContent = "Nový článek";
    document.getElementById('edit_id').value = "";
    document.getElementById('title').value = "";
    document.getElementById('image').value = "";
    quill.root.innerHTML = "";
    document.getElementById('articleFormContainer').scrollIntoView({ behavior: 'smooth' });
}

function editArticle(index) {
    const a = window.articlesData[index];
    document.getElementById('articleFormContainer').style.display = 'block';
    document.getElementById('formTitle').textContent = "Upravit článek";
    document.getElementById('edit_id').value = a.id;
    document.getElementById('title').value = a.title;
    document.getElementById('image').value = "";
    quill.root.innerHTML = a.content;
    document.getElementById('articleFormContainer').scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
    document.getElementById('articleFormContainer').style.display = 'none';
}

document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit_id').value;

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', quill.root.innerHTML);

    const imageFile = document.getElementById('image').files[0];
    if (imageFile) formData.append('image', imageFile);

    let endpoint = '../api/add_article.php';
    if (id) {
        endpoint = '../api/update_article.php';
        formData.append('id', id);
    }

    const res = await fetch(endpoint, { method: 'POST', body: formData });

    if (res.ok) {
        alert('Článek byl úspěšně uložen!');
        closeForm();
        loadArticles();
    } else {
        alert('Chyba při ukládání.');
    }
});

async function deleteArticle(id) {
    if (confirm('Smazat článek? Tuto akci nelze vrátit.')) {
        const res = await fetch('../api/delete_article.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        if (res.ok) loadArticles();
    }
}
