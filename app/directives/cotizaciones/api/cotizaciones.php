<?php


session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if ($decoded->function === 'getdolar') {
    getDolar();
}

function getDolar()
{

//    $https://contenidos.lanacion.com.ar/json/dolar                                              ?callback=JSON_CALLBACK

    $jsonurl = "http://contenidos.lanacion.com.ar/json/dolar";
    $json = file_get_contents($jsonurl);

    $json = str_replace("dolarjsonpCallback", "", $json);
    $json = str_replace("(", "", $json);
    $json = str_replace(")", "", $json);
    $json = str_replace(";", "", $json);
    $json = str_replace(".", ",", $json);


    echo $json;
}


?>