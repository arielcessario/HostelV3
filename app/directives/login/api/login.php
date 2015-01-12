<?php

session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

login($decoded->username,$decoded->password );

function login($username, $password)
{
    $db = new MysqliDb();
    $db->where("usuario", $username);
    $db->where("password", $password);

    $results = $db->get("usuarios");


    if ($db->count > 0) {
        echo json_encode($results[0]);
    } else {
        echo 'error';
    }
}

?>