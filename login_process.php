<?php
session_start();

/* ===== DB NASTAVENI ===== */
const DB_HOST = "localhost";
const DB_NAME = "spst_esport";
const DB_USER = "root";
const DB_PASS = "";

/* ===== INPUT ===== */
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($email === "" || $password === "") {
  $_SESSION["login_error"] = "Vyplň e-mail a heslo.";
  header("Location: /login.php");
  exit;
}

try {
  $pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
    DB_USER,
    DB_PASS,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );

  // 1) najdi uzivatele
  $stmt = $pdo->prepare("SELECT id, password_hash, is_active FROM users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if (!$user) {
    $_SESSION["login_error"] = "Špatný e-mail nebo heslo.";
    header("Location: /login.php");
    exit;
  }

  if ((int)$user["is_active"] !== 1) {
    $_SESSION["login_error"] = "Účet je deaktivovaný.";
    header("Location: /login.php");
    exit;
  }

  // 2) over heslo
  if (!password_verify($password, $user["password_hash"])) {
    $_SESSION["login_error"] = "Špatný e-mail nebo heslo.";
    header("Location: /login.php");
    exit;
  }

  // 3) nacti role uzivatele
  $stmt = $pdo->prepare("
    SELECT r.name
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = ?
  ");
  $stmt->execute([$user["id"]]);
  $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

  // 4) session
  session_regenerate_id(true);
  $_SESSION["user_id"] = (int)$user["id"];
  $_SESSION["roles"] = $roles;

  // 5) update last_login
  $pdo->prepare("UPDATE users SET last_login_at = NOW() WHERE id = ?")->execute([$user["id"]]);

  // 6) presmerovani podle role
  if (in_array("admin", $roles, true)) {
    header("Location: /admin/");
    exit;
  }

  // editor -> později udělat /editor/, zatím na home
  header("Location: /index.html");
  exit;

} catch (Throwable $e) {
  $_SESSION["login_error"] = "Chyba připojení k databázi / serveru.";
  header("Location: /login.php");
  exit;
}
