# SPŠT E-sport - Maturitní projekt

Webová aplikace školního e-sport týmu SPŠT.

Aktuální verze projektu je full-stack aplikace:
- frontend: HTML/CSS/JavaScript
- backend: PHP (REST-like API + session autentizace)

## Co aplikace umí

- Veřejná část webu: program zápasů, play-off, hráči, články, kontaktní formulář
- Přihlášení přes společný login pro admin/editor i hráče
- Administrace:
    - správa hráčů
    - správa zápasů
    - správa článků
    - správa play-off
    - správa uživatelů (admin/editor)
    - přehled zpráv z kontaktního formuláře
- Hráčská sekce: vlastní dashboard a úprava profilu

## Technologie

- HTML5, CSS3, JavaScript (vanilla)
- PHP 8.3 (PDO, sessions, password_hash/password_verify)


## Struktura projektu (zkráceně)

```
.
├── index.html
├── hraci.html
├── clanky.html
├── clanek.html
├── login.html
├── admin/
│   ├── index.html
│   ├── dashboard.html
│   ├── sprava-clanku.html
│   ├── sprava-hracu.html
│   ├── sprava-zapasu.html
│   ├── sprava-playoff.html
│   ├── sprava-uzivatelu.html
│   ├── pridani-hrace.html
│   └── zpravy.html
├── hrac/
│   ├── index.html
│   └── dashboard.html
├── api/
│   ├── db.php
│   ├── login.php
│   ├── check_auth.php
│   ├── get_*.php / add_*.php / update_*.php / delete_*.php
│   └── ...
├── js/
│   ├── *.js
│   ├── admin/*.js
│   └── hrac/*.js
├── css/
│   └── style.css
├── docker-compose.yml
├── docker/
│   ├── nginx/conf.d/default.conf
│   └── php/{dockerfile,custom.ini}
├── database.sql
└── uploads/
```


## Inicializace databáze

Po prvním spuštění importuj dump `database.sql`.

Možnost A (phpMyAdmin):
1. Otevři http://localhost:8081
2. Přihlas se jako `root` / `rootpassword`
3. Vyber databázi `esport_team`
4. Importuj soubor `database.sql`


## Přihlášení a role

- `login.html`: společné přihlášení (admin/editor i hráč)
- `admin/index.html`: přihlášení do admin sekce
- `hrac/index.html`: přihlášení do hráčské sekce

Autentizace je založená na PHP session (`api/login.php`, `api/check_auth.php`, `api/logout.php`).

Pokud máš prázdnou DB, můžeš vytvořit výchozího admina přes endpoint:
- `http://localhost:8080/api/setup_admin.php`

Endpoint je z bezpečnostních důvodů ve výchozím stavu vypnutý. Pro jednorázové vytvoření účtu nastav před spuštěním PHP kontejneru proměnné:
- `APP_ALLOW_SETUP_ADMIN=1`
- `APP_SETUP_ADMIN_EMAIL=<tvuj-admin-email>`
- `APP_SETUP_ADMIN_PASSWORD=<silne-heslo>`

## Přehled API endpointů

API je umístěné ve složce `api/`.

- Autentizace:
    - `login.php`, `login_player.php`, `logout.php`, `check_auth.php`
- Články:
    - `get_articles.php`, `add_article.php`, `update_article.php`, `delete_article.php`
- Hráči:
    - `get_players.php`, `add_player.php`, `update_player_admin.php`, `update_my_profile.php`, `delete_player.php`
- Zápasy:
    - `get_matches.php`, `add_match.php`, `update_match.php`
- Play-off:
    - `get_playoff.php`, `update_playoff.php`
- Uživatelé admin/editor:
    - `get_users.php`, `add_user.php`
- Zprávy/kontakt:
    - `send_contact.php`, `get_messages.php`, `delete_message.php`


Jakub Fiala - maturitní projekt, SPŠT

