<?php


session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if($decoded->function === 'get'){
    get();
}

function get()
{
    $db = new MysqliDb();

    $results = $db->get("monedas");


    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo 'error';
    }
}


?>