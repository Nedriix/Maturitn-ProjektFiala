// Frontend skript: js/admin/zpravy.js
async function checkAuth() {
    const res = await fetch('../api/get_messages.php');
    if (!res.ok) window.location.href = 'index.html';
}

async function loadMessages() {
    const container = document.getElementById('messagesList');
    try {
        const res = await fetch('../api/get_messages.php');
        const messages = await res.json();

        if (messages.length === 0) {
            container.innerHTML = "<p>Žádné nové zprávy.</p>";
            return;
        }

        container.innerHTML = messages.map(m => `
            <div class="msg-card">
                <div class="msg-header">
                    <div>
                        <span class="msg-author">${m.name}</span><br>
                        <a href="mailto:${m.email}" class="msg-email">${m.email}</a>
                    </div>
                    <span class="msg-date">${new Date(m.created_at).toLocaleString('cs-CZ')}</span>
                </div>
                <div class="msg-body">${m.message}</div>
                <button class="btn" style="background: var(--danger); font-size: 0.8rem; padding: 5px 15px;"
                        onclick="deleteMsg(${m.id})">Smazat zprávu</button>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function deleteMsg(id) {
    if (!confirm("Opravdu smazat?")) return;
    await fetch('../api/delete_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    loadMessages();
}

loadMessages();
