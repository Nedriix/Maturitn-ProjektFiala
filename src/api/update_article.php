<?php
// API endpoint: update_article.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require_once __DIR__ . '/upload_image.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovany pristup.']);
    exit;
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$title = trim((string)($_POST['title'] ?? ''));
$content = (string)($_POST['content'] ?? '');

if ($id <= 0 || $title === '' || $content === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Chybi povinna data.']);
    exit;
}

$newImageUrl = null;
$shouldUpdateImage = isset($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
if ($shouldUpdateImage) {
    try {
        $newImageUrl = save_uploaded_image($_FILES['image'], 'article_');
    } catch (RuntimeException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

try {
    $currentStmt = $pdo->prepare('SELECT image_url FROM articles WHERE id = ?');
    $currentStmt->execute([$id]);
    $currentArticle = $currentStmt->fetch();

    if (!$currentArticle) {
        if ($newImageUrl) {
            delete_uploaded_image($newImageUrl);
        }
        http_response_code(404);
        echo json_encode(['error' => 'Clanek nebyl nalezen.']);
        exit;
    }

    if ($newImageUrl !== null) {
        $stmt = $pdo->prepare('UPDATE articles SET title = ?, content = ?, image_url = ? WHERE id = ?');
        $stmt->execute([$title, $content, $newImageUrl, $id]);

        $previousImage = $currentArticle['image_url'] ?? null;
        if (!empty($previousImage) && $previousImage !== $newImageUrl) {
            delete_uploaded_image($previousImage);
        }
    } else {
        $stmt = $pdo->prepare('UPDATE articles SET title = ?, content = ? WHERE id = ?');
        $stmt->execute([$title, $content, $id]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    if ($newImageUrl) {
        delete_uploaded_image($newImageUrl);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri ukladani zmen.']);
}
?>
