// Frontend skript: js/admin/sprava-playoff.js
async function checkAuth() {
    try {
        const response = await fetch('../api/check_auth.php');
        if (!response.ok) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        window.location.href = 'index.html';
    }
}
checkAuth();

const editorColumns = [
    {
        title: 'Levá větev',
        groups: [
            { title: 'Osmifinále', note: 'První čtyři zápasy na levé straně pavouka.', matches: [1, 2, 3, 4] },
            { title: 'Čtvrtfinále', note: 'Postupující z levé části do semifinále.', matches: [5, 6] },
            { title: 'Semifinále', note: 'Vítěz levé větve postupuje do finále.', matches: [7] }
        ]
    },
    {
        title: 'Střed pavouka',
        groups: [
            { title: 'Finále', note: 'Finálový zápas zobrazený uprostřed veřejného pavouka.', matches: [15] }
        ],
        champion: true
    },
    {
        title: 'Pravá větev',
        groups: [
            { title: 'Semifinále', note: 'Vítěz pravé větve postupuje do finále.', matches: [14] },
            { title: 'Čtvrtfinále', note: 'Postupující z pravé části do semifinále.', matches: [12, 13] },
            { title: 'Osmifinále', note: 'První čtyři zápasy na pravé straně pavouka.', matches: [8, 9, 10, 11] }
        ]
    }
];

const container = document.getElementById('form-container');
const saveStatus = document.getElementById('saveStatus');

function createMatchMarkup(matchNumber) {
    return `
        <div class="match-group">
            <div class="match-group-header">
                <strong>Zápas ${matchNumber}</strong>
                <span class="match-order">Pořadí zobrazení: horní / dolní tým</span>
            </div>
            <div class="team-input-grid">
                <div class="field-group">
                    <label for="m${matchNumber}_t1">Horní tým</label>
                    <input type="text" id="m${matchNumber}_t1" placeholder="Název týmu">
                </div>
                <div class="field-group">
                    <label for="m${matchNumber}_t2">Dolní tým</label>
                    <input type="text" id="m${matchNumber}_t2" placeholder="Název týmu">
                </div>
            </div>
        </div>`;
}

function createColumnMarkup(column) {
    const groupsMarkup = column.groups.map(group => `
        <section class="editor-group">
            <h3>${group.title}</h3>
            <p class="editor-group-note">${group.note}</p>
            ${group.matches.map(createMatchMarkup).join('')}
        </section>
    `).join('');

    const championMarkup = column.champion ? `
        <section class="editor-group champion-group">
            <h3>Celkový vítěz</h3>
            <p class="editor-group-note">Tento název se zobrazí pod pohárem na veřejné stránce.</p>
            <div class="field-group">
                <label for="champ_name">Vítězný tým</label>
                <input type="text" id="champ_name" placeholder="Název vítězného týmu">
            </div>
        </section>
    ` : '';

    return `
        <div class="editor-column">
            <h2 class="editor-column-title">${column.title}</h2>
            ${groupsMarkup}
            ${championMarkup}
        </div>
    `;
}

container.innerHTML = editorColumns.map(createColumnMarkup).join('');

function setSaveStatus(message, type = '') {
    if (!saveStatus) {
        return;
    }

    saveStatus.className = 'save-status';
    if (type) {
        saveStatus.classList.add(type);
    }
    saveStatus.textContent = message;
}

document.querySelectorAll('#playoffForm input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
        setSaveStatus('Máš neuložené změny.', 'saving');
    });
});

async function loadCurrentData() {
    const res = await fetch('../api/get_playoff.php');
    const data = await res.json();
    Object.keys(data).forEach(key => {
        const input = document.getElementById(key);
        if (input) input.value = data[key];
    });
    setSaveStatus('Načtená data odpovídají aktuálnímu stavu v databázi.');
}
loadCurrentData();

document.getElementById("playoffForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {};
    document.querySelectorAll("input[type='text']").forEach(input => {
        formData[input.id] = input.value.trim();
    });

    try {
        setSaveStatus('Ukládám změny do pavouka...', 'saving');

        const response = await fetch('../api/update_playoff.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setSaveStatus('Pavouk byl úspěšně uložen.', 'success');
        } else {
            setSaveStatus('Došlo k chybě při ukládání.', 'error');
        }
    } catch (err) {
        setSaveStatus('Chyba komunikace se serverem.', 'error');
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener("click", async function(e) {
        e.preventDefault();
        await fetch('../api/logout.php');
        window.location.href = "index.html";
    });
}
