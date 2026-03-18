<?php
// API endpoint: db.php
$host = 'db'; // Jméno kontejneru z docker-compose
$db   = 'esport_team';
$user = 'user';
$pass = 'password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // V produkci chybu nezobrazovat, jen logovat
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>
