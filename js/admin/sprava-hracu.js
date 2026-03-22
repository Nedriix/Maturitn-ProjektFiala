// Frontend skript: js/admin/sprava-hracu.js
async function checkAuth() {
    try {
        const res = await fetch('../api/check_auth.php');
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        if (data.role !== 'admin') {
            alert('Nemáte oprávnění k této stránce.');
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        window.location.href = 'index.html';
    }
}
checkAuth();

let playersCache = [];

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('../api/logout.php');
    window.location.href = 'index.html';
});

async function loadPlayers() {
    try {
        const res = await fetch('../api/get_players.php');
        const players = await res.json();
        playersCache = Array.isArray(players) ? players : [];
        const tbody = document.getElementById('playersList');
        tbody.innerHTML = '';

        playersCache.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.email || 'Nenastaven'}</td>
                <td>${p.game}</td>
                <td>${p.role || '-'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openEditForm(${p.id})">Upravit</button>
                    <button class="action-btn btn-delete" onclick="deletePlayer(${p.id})">Smazat</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Chyba načítání:", err);
    }
}
loadPlayers();

function openEditForm(id) {
    const player = playersCache.find(p => Number(p.id) === Number(id));
    if (!player) {
        alert('Hráč nebyl nalezen.');
        return;
    }

    document.getElementById('editFormContainer').style.display = 'block';
    document.getElementById('edit_id').value = player.id;
    document.getElementById('edit_name').value = player.name || '';
    document.getElementById('edit_email').value = player.email || '';
    document.getElementById('edit_game').value = player.game || '';
    document.getElementById('edit_role').value = player.role || '';
    document.getElementById('edit_description').value = player.description || '';
    document.getElementById('edit_instagram').value = player.instagram || '';
    document.getElementById('edit_twitch').value = player.twitch || '';
    document.getElementById('edit_password').value = '';

    const photoInput = document.getElementById('edit_photo');
    photoInput.value = '';

    const removePhotoCheckbox = document.getElementById('edit_remove_photo');
    const removePhotoWrap = document.getElementById('edit_remove_photo_wrap');
    removePhotoCheckbox.checked = false;

    const currentPhotoInfo = document.getElementById('edit_current_photo');
    if (player.photo_url) {
        currentPhotoInfo.textContent = `Aktuální fotka: ${player.photo_url}`;
        removePhotoCheckbox.disabled = false;
        removePhotoWrap.style.opacity = '1';
    } else {
        currentPhotoInfo.textContent = 'Aktuální fotka: není nastavena';
        removePhotoCheckbox.disabled = true;
        removePhotoWrap.style.opacity = '.6';
    }

    document.getElementById('editFormContainer').scrollIntoView({ behavior: 'smooth' });
}

function closeEditForm() {
    document.getElementById('editFormContainer').style.display = 'none';
}

document.getElementById('editPlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', document.getElementById('edit_id').value);
    formData.append('name', document.getElementById('edit_name').value);
    formData.append('email', document.getElementById('edit_email').value);
    formData.append('game', document.getElementById('edit_game').value);
    formData.append('role', document.getElementById('edit_role').value);
    formData.append('description', document.getElementById('edit_description').value);
    formData.append('instagram', document.getElementById('edit_instagram').value);
    formData.append('twitch', document.getElementById('edit_twitch').value);
    formData.append('password', document.getElementById('edit_password').value);
    formData.append('remove_photo', document.getElementById('edit_remove_photo').checked ? '1' : '0');

    const photoFile = document.getElementById('edit_photo').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }

    const res = await fetch('../api/update_player_admin.php', {
        method: 'POST',
        body: formData
    });

    const result = await res.json().catch(() => ({}));

    if (res.ok) {
        alert('Hráč byl úspěšně upraven.');
        closeEditForm();
        loadPlayers();
    } else {
        alert(`Došlo k chybě při úpravě hráče: ${result.error || 'Neznámá chyba.'}`);
    }
});

async function deletePlayer(id) {
    if (confirm('Opravdu chcete tohoto hráče smazat? Tato akce je nevratná.')) {
        const res = await fetch('../api/delete_player.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        if (res.ok) {
            loadPlayers();
        } else {
            alert('Chyba při mazání hráče.');
        }
    }
}
