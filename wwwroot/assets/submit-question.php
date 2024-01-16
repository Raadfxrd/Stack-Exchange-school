<?php
$servername = "127.0.0.1";
$username = "pb2a2324_kaalaaqaapii58";
$password = "KLPUwYEpzHo2WfTR";
$dbname = "pb2a2324_kaalaaqaapii58_live";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST["title"];
    $description = $_POST["description"];
    $tags = $_POST["tags"];

    session_start();
    $userId = $_SESSION['user'];

    $sql = "INSERT INTO questions (title, description, tags, user) VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sssi", $title, $description, $tags, $userId);

        if ($stmt->execute()) {
            echo "Question submitted successfully";
        } else {
            echo "Error executing query: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Error preparing statement: " . $conn->error;
    }
}

$conn->close();
