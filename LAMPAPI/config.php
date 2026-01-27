<?php
header("Content-Type: application/json");

$servername  = "localhost";
$db_username = "dbuser";
$db_password = "L@mpL0versRust";
$dbname      = "COP4331";

$dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $db_username, $db_password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed (PDO)"]);
    exit;
}

?>

