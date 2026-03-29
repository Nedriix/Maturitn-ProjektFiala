<?php
// API endpoint: update_match.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403); exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Chybí ID zápasu.']);
    exit;
}

try {
    $isFullEdit = isset($data['opponent']) || isset($data['game']) || isset($data['match_date']) || isset($data['match_time']) || isset($data['status']);

    if ($isFullEdit) {
        $opponent = trim($data['opponent'] ?? '');
        $game = trim($data['game'] ?? '');
        $matchDate = trim($data['match_date'] ?? '');
        $matchTime = trim($data['match_time'] ?? '');
        $status = $data['status'] ?? 'upcoming';
        $score = trim($data['score'] ?? '');
        $report = trim($data['report'] ?? '');

        if ($opponent === '' || $game === '' || $matchDate === '' || $matchTime === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Vyplňte všechny povinné údaje zápasu.']);
            exit;
        }

        if ($status !== 'upcoming' && $status !== 'finished') {
            http_response_code(400);
            echo json_encode(['error' => 'Neplatný stav zápasu.']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE matches SET opponent = ?, game = ?, match_date = ?, match_time = ?, status = ?, score = ?, report = ? WHERE id = ?");
        $stmt->execute([$opponent, $game, $matchDate, $matchTime, $status, $score, $report, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE matches SET status = 'finished', score = ?, report = ? WHERE id = ?");
        $stmt->execute([$data['score'] ?? '', $data['report'] ?? '', $id]);
    }

    if ($stmt->rowCount() === 0) {
        $existsStmt = $pdo->prepare("SELECT id FROM matches WHERE id = ?");
        $existsStmt->execute([$id]);
        if (!$existsStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Zápas nebyl nalezen.']);
            exit;
        }
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba při aktualizaci.']);
}
?>
