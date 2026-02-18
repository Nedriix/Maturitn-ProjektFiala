<?php
session_start();

$roles = $_SESSION["roles"] ?? [];
$isLoggedIn = isset($_SESSION["user_id"]);
$isAdmin = $isLoggedIn && in_array("admin", $roles, true);

if (!$isLoggedIn) {
  header("Location: /login.php");
  exit;
}

if (!$isAdmin) {
  header("Location: /index.html");
  exit;
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin | SPŠT E-sport</title>
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>

<header>
  <div class="logo">SPŠT E-sport</div>
  <nav>
    <ul>
      <li><a href="/index.html">Domů</a></li>
      <li><a href="/hraci.html">Hráči</a></li>
      <li><a href="/index.html#program">Program</a></li>
      <li><a href="/index.html#kontakt">Kontakt</a></li>
      <li><a href="/logout.php">Odhlásit</a></li>
    </ul>
  </nav>
</header>

<section class="program-section" style="min-height: calc(100vh - 80px);">
  <h2>Admin panel</h2>

  <div class="matches" style="margin-top: 30px;">
    <div class="match-card" style="align-items:flex-start;">
      <div class="match-info">
        <h3>Správa obsahu</h3>
      </div>
      <div class="match-status upcoming">Přístup OK</div>
    </div>

    <div class="match-card" style="align-items:flex-start;">
      <div class="match-info">
        <h3>Autorizace</h3>
        <p>Kontrola probíhá přes <strong>$_SESSION</strong> a tabulky <strong>roles + user_roles</strong> v DB.</p>
      </div>
      <div class="match-status finished">Role: admin</div>
    </div>
  </div>
</section>

</body>
</html>
