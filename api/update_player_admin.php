<?php
// API endpoint: update_player_admin.php

session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require_once __DIR__ . '/upload_image.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovany pristup.']);
    exit;
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
} else {
    $data = $_POST;
}

$id = isset($data['id']) ? (int)$data['id'] : 0;
$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$game = trim((string)($data['game'] ?? ''));
$role = trim((string)($data['role'] ?? ''));
$description = trim((string)($data['description'] ?? ''));
$instagram = trim((string)($data['instagram'] ?? ''));
$twitch = trim((string)($data['twitch'] ?? ''));
$password = (string)($data['password'] ?? '');
$removePhoto = !empty($data['remove_photo']) && $data['remove_photo'] !== '0' && $data['remove_photo'] !== 'false';

if ($id <= 0 || $name === '' || $email === '' || $game === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Chybi povinna data.']);
    exit;
}

$photoUrl = null;
if (isset($_FILES['photo']) && ($_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $photoUrl = save_uploaded_image($_FILES['photo'], 'player_');
    } catch (RuntimeException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

try {
    $currentStmt = $pdo->prepare('SELECT photo_url FROM players WHERE id = ?');
    $currentStmt->execute([$id]);
    $currentPlayer = $currentStmt->fetch();

    if (!$currentPlayer) {
        if ($photoUrl) {
            delete_uploaded_image($photoUrl);
        }
        http_response_code(404);
        echo json_encode(['error' => 'Hrac nebyl nalezen.']);
        exit;
    }

    $currentPhotoUrl = $currentPlayer['photo_url'] ?? null;
    $updatedPhotoUrl = $currentPhotoUrl;

    if ($photoUrl !== null) {
        $updatedPhotoUrl = $photoUrl;
    } elseif ($removePhoto) {
        $updatedPhotoUrl = null;
    }

    $fields = [
        'name = ?',
        'email = ?',
        'game = ?',
        'role = ?',
        'description = ?',
        'instagram = ?',
        'twitch = ?'
    ];
    $params = [$name, $email, $game, $role, $description, $instagram, $twitch];

    if ($photoUrl !== null || $removePhoto) {
        $fields[] = 'photo_url = ?';
        $params[] = $updatedPhotoUrl;
    }

    if ($password !== '') {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $fields[] = 'password_hash = ?';
        $params[] = $hash;
    }

    $params[] = $id;
    $sql = 'UPDATE players SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if (($photoUrl !== null || $removePhoto) && !empty($currentPhotoUrl) && $currentPhotoUrl !== $updatedPhotoUrl) {
        delete_uploaded_image($currentPhotoUrl);
    }

    echo json_encode(['success' => true, 'photo_url' => $updatedPhotoUrl]);
} catch (PDOException $e) {
    if ($photoUrl) {
        delete_uploaded_image($photoUrl);
    }

    if ((string)$e->getCode() === '23000') {
        http_response_code(400);
        echo json_encode(['error' => 'Hrac s timto e-mailem jiz existuje.']);
        exit;
    }

    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri ukladani zmen.']);
}
?>
