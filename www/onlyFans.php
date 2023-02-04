<?php
clearstatcache();
header('Content-Type: text/plain');
$config = parse_ini_file("../config.ini", TRUE);

$connectionString = "host=".$config["DB"]["servIP"]." port=".$config["DB"]["port"]." dbname=".$config["DB"]["DBname"]." user=".$config["DB"]["DBuser"]." password=".$config["DB"]["DBpass"];
$dbConnection = pg_connect($connectionString);
$res = pg_exec($dbConnection, "UPDATE counter SET value=value+1 WHERE key='rickroll' RETURNING value");
$row=pg_fetch_row($res);
echo $row[0];