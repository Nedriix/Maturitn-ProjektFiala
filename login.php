<?php
session_start();
?>
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Přihlášení | SPŠT E-sport</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

<header>
  <div class="logo">SPŠT E-sport</div>
  <nav>
    <ul>
      <li><a href="index.html">Domů</a></li>
      <li><a href="hraci.html">Hráči</a></li>
      <li><a href="index.html#kontakt">Kontakt</a></li>
    </ul>
  </nav>
</header>

<section class="contact-section" style="min-height: calc(100vh - 80px);">
  <h2>Přihlášení</h2>
  <p class="contact-text">Tato část je určená pro administrátory a editory.</p>

  <?php if (!empty($_SESSION["login_error"])): ?>
    <div style="max-width: 500px; margin: 0 auto 16px auto; padding: 12px 14px; border-radius: 12px; background: rgba(255, 80, 80, 0.12); border: 1px solid rgba(255, 80, 80, 0.25); color: #ffd2d2;">
      <?php
        echo htmlspecialchars($_SESSION["login_error"]);
        unset($_SESSION["login_error"]);
      ?>
    </div>
  <?php endif; ?>

  <form action="login_process.php" method="POST" autocomplete="on">
    <input type="email" name="email" placeholder="E-mail" required>
    <input type="password" name="password" placeholder="Heslo" required>
    <button type="submit">Přihlásit</button>
  </form>

  <div class="contact-info" style="max-width: 500px; margin: 20px auto 0 auto;">
    <strong>Tip:</strong> Admin panel je dostupný na adrese <strong>/admin</strong> (bez odkazu v menu).
  </div>
</section>

</body>
</html>
