<?php

session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if ($decoded->function === 'get') {
    get();
} else if ($decoded->function === 'getbyid') {
    getById($decoded->id);
} else if ($decoded->function === 'getBy') {
    getBy($decoded->params);
}


function get()
{
    $db = new MysqliDb();
    $results = $db->get('usuarios');

    echo json_encode($results);
}

function getById($id)
{
    $db = new MysqliDb();
    $db->where('idUsuario', $id);
    $results = $db->get('usuarios');

    echo json_encode($results);
}


?>