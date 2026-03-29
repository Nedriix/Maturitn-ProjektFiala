// Frontend skript: js/admin/sprava-zapasu.js
async function checkAuth() {
    const res = await fetch('../api/check_auth.php');
    if (!res.ok) window.location.href = 'index.html';
}
checkAuth();

let matchesCache = [];

async function loadMatches() {
    const res = await fetch('../api/get_matches.php');
    const matches = await res.json();
    matchesCache = Array.isArray(matches) ? matches : [];
    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';

    matchesCache.forEach(m => {
        const dateStr = new Date(m.match_date).toLocaleDateString('cs-CZ');
        const timeStr = m.match_time.substring(0, 5);

        const div = document.createElement('div');
        div.className = 'match-item';

        if (m.status === 'upcoming') {
            div.innerHTML = `
                <h4>SPŠT E-sport vs. ${m.opponent}</h4>
                <p>${m.game} | ${dateStr} v ${timeStr}</p>
                <button class="btn" onclick="toggleReportForm(${m.id})">Zapsat výsledek a report</button>
                <button class="btn" onclick="openEditMatchForm(${m.id})" style="margin-left: 8px; background: #b388ff;">Upravit</button>
                <button class="btn" onclick="deleteMatch(${m.id})" style="margin-left: 8px; background: #ff5252;">Smazat</button>
                <div class="report-form" id="rf_${m.id}">
                    <input type="text" id="score_${m.id}" placeholder="Skóre (např. 2:1)" style="width: 100%; margin-bottom: 10px; padding: 8px;">
                    <textarea id="report_${m.id}" rows="3" placeholder="Report od hráčů k zápasu..." style="width: 100%; margin-bottom: 10px; padding: 8px;"></textarea>
                    <button onclick="saveResult(${m.id})" style="background: #81c784;">Uložit výsledek</button>
                </div>
            `;
        } else {
            div.innerHTML = `
                <h4>SPŠT E-sport vs. ${m.opponent} <span style="color:#81c784;">(Odehráno: ${m.score})</span></h4>
                <p>${m.game} | ${dateStr} v ${timeStr}</p>
                <p><em>Report:</em> ${m.report || 'Bez reportu'}</p>
                <button class="btn" onclick="openEditMatchForm(${m.id})" style="background: #b388ff;">Upravit</button>
                <button class="btn" onclick="deleteMatch(${m.id})" style="margin-left: 8px; background: #ff5252;">Smazat</button>
            `;
        }
        container.appendChild(div);
    });
}
loadMatches();

document.getElementById('matchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        opponent: document.getElementById('opponent').value,
        game: document.getElementById('game').value,
        match_date: document.getElementById('match_date').value,
        match_time: document.getElementById('match_time').value
    };

    const res = await fetch('../api/add_match.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("Zápas naplánován!");
        document.getElementById('matchForm').reset();
        loadMatches();
    } else {
        alert("Chyba při přidávání zápasu.");
    }
});

function toggleReportForm(id) {
    const form = document.getElementById('rf_' + id);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function openEditMatchForm(id) {
    const match = matchesCache.find(item => Number(item.id) === Number(id));
    if (!match) {
        alert('Zápas nebyl nalezen.');
        return;
    }

    document.getElementById('edit_match_id').value = match.id;
    document.getElementById('edit_opponent').value = match.opponent || '';
    document.getElementById('edit_game').value = match.game || '';
    document.getElementById('edit_match_date').value = match.match_date || '';
    document.getElementById('edit_match_time').value = (match.match_time || '').substring(0, 5);
    document.getElementById('edit_status').value = match.status || 'upcoming';
    document.getElementById('edit_score').value = match.score || '';
    document.getElementById('edit_report').value = match.report || '';

    document.getElementById('editMatchContainer').style.display = 'block';
    document.getElementById('editMatchContainer').scrollIntoView({ behavior: 'smooth' });
}

function closeEditMatchForm() {
    document.getElementById('editMatchContainer').style.display = 'none';
}

async function saveResult(id) {
    const score = document.getElementById('score_' + id).value;
    const report = document.getElementById('report_' + id).value;

    const res = await fetch('../api/update_match.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, score, report })
    });

    if (res.ok) {
        alert("Výsledek uložen!");
        loadMatches();
    } else {
        alert("Došlo k chybě.");
    }
}

document.getElementById('editMatchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        id: Number(document.getElementById('edit_match_id').value),
        opponent: document.getElementById('edit_opponent').value,
        game: document.getElementById('edit_game').value,
        match_date: document.getElementById('edit_match_date').value,
        match_time: document.getElementById('edit_match_time').value,
        status: document.getElementById('edit_status').value,
        score: document.getElementById('edit_score').value,
        report: document.getElementById('edit_report').value
    };

    const res = await fetch('../api/update_match.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok) {
        alert('Zápas byl upraven.');
        closeEditMatchForm();
        loadMatches();
    } else {
        alert(`Chyba při úpravě zápasu: ${result.error || 'Neznámá chyba.'}`);
    }
});

async function deleteMatch(id) {
    if (!confirm('Opravdu chcete tento zápas smazat?')) {
        return;
    }

    const res = await fetch('../api/delete_match.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok) {
        alert('Zápas byl smazán.');
        loadMatches();
    } else {
        alert(`Chyba při mazání zápasu: ${result.error || 'Neznámá chyba.'}`);
    }
}
