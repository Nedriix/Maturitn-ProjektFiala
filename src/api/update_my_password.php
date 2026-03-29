<?php
// API endpoint: update_my_password.php
// Bezpečnost:
// 1) Ověří, že je hráč přihlášený (player_id v session)
// 2) Ověří aktuální heslo přes password_verify
// 3) Nové heslo uloží jako bcrypt hash (password_hash)


session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';


if (!isset($_SESSION['player_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Neprihlaseny hrac.']);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true) ?: [];
$currentPassword = (string)($data['current_password'] ?? '');
$newPassword = (string)($data['new_password'] ?? '');

// Obě pole jsou povinná
if ($currentPassword === '' || $newPassword === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Vypln vsechna povinna pole.']);
    exit;
}

// Základní validace délky nového hesla
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Nove heslo musi mit alespon 8 znaku.']);
    exit;
}


if ($currentPassword === $newPassword) {
    http_response_code(400);
    echo json_encode(['error' => 'Nove heslo musi byt jine nez aktualni heslo.']);
    exit;
}

// ID aktuálně přihlášeného hráče ze session
$playerId = (int)$_SESSION['player_id'];

try {
    // Načteme hash aktuálního hesla hráče z databáze
    $stmt = $pdo->prepare('SELECT password_hash FROM players WHERE id = ?');
    $stmt->execute([$playerId]);
    $player = $stmt->fetch();

    
    if (!$player || empty($player['password_hash'])) {
        http_response_code(404);
        echo json_encode(['error' => 'Hrac nebyl nalezen.']);
        exit;
    }

    
    if (!password_verify($currentPassword, $player['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Aktualni heslo neni spravne.']);
        exit;
    }


    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $pdo->prepare('UPDATE players SET password_hash = ? WHERE id = ?');
    $updateStmt->execute([$newHash, $playerId]);

    // Úspěšná změna hesla
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Neočekávaná chyba databáze/serveru
    http_response_code(500);
    echo json_encode(['error' => 'Chyba serveru pri zmene hesla.']);
}
?>
