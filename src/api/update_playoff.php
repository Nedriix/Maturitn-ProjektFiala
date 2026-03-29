<?php
// API endpoint: update_playoff.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'] ?? '', ['admin', 'editor'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Neautorizovany pristup.']);
    exit;
}

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Neplatny JSON format playoff dat.']);
    exit;
}

$encodedData = json_encode($data, JSON_UNESCAPED_UNICODE);
if ($encodedData === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Nepodarilo se zpracovat playoff data.']);
    exit;
}

if (strlen($encodedData) > 200000) {
    http_response_code(413);
    echo json_encode(['error' => 'Playoff data jsou prilis velika.']);
    exit;
}

try {
    $stmt = $pdo->prepare('UPDATE playoff SET bracket_data = ? WHERE id = 1');
    $stmt->execute([$encodedData]);

    if ($stmt->rowCount() === 0) {
        $insertStmt = $pdo->prepare('INSERT INTO playoff (id, bracket_data) VALUES (1, ?)');
        $insertStmt->execute([$encodedData]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba databaze']);
}
?>
