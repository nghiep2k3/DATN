<?php
require dirname(__DIR__).'/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__).'/config');
$dotenv->safeLoad();

// Gọi DB như cũ
$db = new db();
$conn = $db->connect();
