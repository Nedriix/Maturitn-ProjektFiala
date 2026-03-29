<?php
// API endpoint: update_my_profile.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require_once __DIR__ . '/upload_image.php';

if (!isset($_SESSION['player_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Neprihlaseny hrac.']);
    exit;
}

$playerId = (int)$_SESSION['player_id'];
$desc = (string)($_POST['desc'] ?? '');
$instagram = trim((string)($_POST['instagram'] ?? ''));
$twitch = trim((string)($_POST['twitch'] ?? ''));

$newPhotoUrl = null;
$hasPhotoUpload = isset($_FILES['photo']) && ($_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
if ($hasPhotoUpload) {
    try {
        $newPhotoUrl = save_uploaded_image($_FILES['photo'], 'player_');
    } catch (RuntimeException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

try {
    $currentStmt = $pdo->prepare('SELECT photo_url FROM players WHERE id = ?');
    $currentStmt->execute([$playerId]);
    $currentPlayer = $currentStmt->fetch();

    if (!$currentPlayer) {
        if ($newPhotoUrl) {
            delete_uploaded_image($newPhotoUrl);
        }
        http_response_code(404);
        echo json_encode(['error' => 'Hrac nebyl nalezen.']);
        exit;
    }

    if ($newPhotoUrl !== null) {
        $stmt = $pdo->prepare('UPDATE players SET description = ?, instagram = ?, twitch = ?, photo_url = ? WHERE id = ?');
        $stmt->execute([$desc, $instagram, $twitch, $newPhotoUrl, $playerId]);

        $previousPhoto = $currentPlayer['photo_url'] ?? null;
        if (!empty($previousPhoto) && $previousPhoto !== $newPhotoUrl) {
            delete_uploaded_image($previousPhoto);
        }
    } else {
        $stmt = $pdo->prepare('UPDATE players SET description = ?, instagram = ?, twitch = ? WHERE id = ?');
        $stmt->execute([$desc, $instagram, $twitch, $playerId]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    if ($newPhotoUrl) {
        delete_uploaded_image($newPhotoUrl);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri ukladani.']);
}
?>
