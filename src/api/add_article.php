<?php
// API endpoint: add_article.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require_once __DIR__ . '/upload_image.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovany pristup.']);
    exit;
}

if (empty($_POST['title']) || empty($_POST['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Chybi povinna data (titulek nebo obsah).']);
    exit;
}

$title = trim((string)$_POST['title']);
$content = (string)$_POST['content'];
$image_url = null;

if (isset($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $image_url = save_uploaded_image($_FILES['image'], 'article_');
    } catch (RuntimeException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare('INSERT INTO articles (title, content, image_url) VALUES (?, ?, ?)');
    $stmt->execute([$title, $content, $image_url]);
    echo json_encode(['success' => true, 'message' => 'Clanek byl uspesne pridan.']);
} catch (Exception $e) {
    if ($image_url) {
        delete_uploaded_image($image_url);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri ukladani do databaze.']);
}
?>
