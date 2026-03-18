<?php
// API endpoint: add_player.php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require_once __DIR__ . '/upload_image.php';

session_start();
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovany pristup.']);
    exit;
}

if (empty($_POST['name']) || empty($_POST['game']) || empty($_POST['email']) || empty($_POST['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Chybi povinna data (jmeno, hra, e-mail nebo heslo).']);
    exit;
}

$email = trim((string)$_POST['email']);
$password = (string)$_POST['password'];
$hash = password_hash($password, PASSWORD_DEFAULT);
$photo_url = null;

if (isset($_FILES['photo']) && ($_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $photo_url = save_uploaded_image($_FILES['photo'], 'player_');
    } catch (RuntimeException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare('INSERT INTO players (name, email, password_hash, role, game, description, photo_url, instagram, twitch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        trim((string)$_POST['name']),
        $email,
        $hash,
        trim((string)($_POST['role'] ?? '')),
        trim((string)$_POST['game']),
        (string)($_POST['desc'] ?? ''),
        $photo_url,
        trim((string)($_POST['instagram'] ?? '')),
        trim((string)($_POST['twitch'] ?? ''))
    ]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    if ($photo_url) {
        delete_uploaded_image($photo_url);
    }

    if ((string)$e->getCode() === '23000') {
        http_response_code(400);
        echo json_encode(['error' => 'Hrac s timto e-mailem jiz existuje.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Chyba pri ukladani do DB.']);
    }
}
?>
