<?php
// API endpoint: login.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

try {
    // 1. Zkusíme najít uživatele v tabulce ADMINŮ/EDITORŮ
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role']; // admin nebo editor
        $_SESSION['type'] = 'admin_staff';
        echo json_encode(['success' => true, 'redirect' => 'admin/dashboard.html']);
        exit;
    }

    // 2. Pokud jsme nenašli v první tabulce, zkusíme tabulku HRÁČŮ
    $stmt = $pdo->prepare("SELECT * FROM players WHERE email = ?");
    $stmt->execute([$email]);
    $player = $stmt->fetch();

    if ($player && password_verify($password, $player['password_hash'])) {
        $_SESSION['player_id'] = $player['id'];
        $_SESSION['type'] = 'player';
        echo json_encode(['success' => true, 'redirect' => 'hrac/dashboard.html']);
        exit;
    }

    // 3. Pokud jsme nenašli nikde
    http_response_code(401);
    echo json_encode(['error' => 'Nesprávný e-mail nebo heslo']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba serveru']);
}
