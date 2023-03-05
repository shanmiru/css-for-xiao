<?php 
error_reporting(0);
date_default_timezone_set('japan');

$bin = $_POST['ccb'];
$resp = $CurlX::Get("https://bins.ws/search?bins=".$bin);
$xiaodesu = array_slice(preg_split('/(?:<\/td>\s*|)<td[^>]*>/iu', $resp->body), 1);
$json["type"]    = $xiaodesu[35];
$json["level"]   = $xiaodesu[36];
$json["brand"]   = $xiaodesu[37];
$json["bank"]    = $xiaodesu[38];
$json["country"] = substr($xiaodesu[39], 0,2);
echo json_encode($json);
?>