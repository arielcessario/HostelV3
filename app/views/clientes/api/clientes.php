<?php


session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if ($decoded->function === 'get') {
    get();
} else if ($decoded->function === 'getby') {
    getBy($decoded->params);
} else if ($decoded->function === 'save') {
    save($decoded->cliente);
} else if ($decoded->function === 'update') {
    update($decoded->cliente);
} else if ($decoded->function === 'updatesaldo') {
    updateSaldo($decoded->cliente, $decoded->valor);
}

function get()
{
    $db = new MysqliDb();


    $results = $db->get("clientes");


    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }
}

function getBy($params)
{
    $db = new MysqliDb();
//
//    $db->where($params);
//    $results = $db->get("clientes");

    $results = $db->rawQuery('Select * from clientes where ' . $params);
    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }
}


function save($cliente)
{
    $db = new MysqliDb();
    $decoded = json_decode($cliente);

    $data = Array(
        "nombre" => $decoded->nombre,
        "apellido" => $decoded->apellido,
        "mail" => $decoded->mail,
        "idNacionalidad" => $decoded->idNacionalidad,
        "tipoDoc" => $decoded->tipoDoc,
        "nroDoc" => $decoded->nroDoc,
        "comentarios" => $decoded->comentarios,
        "marcado" => $decoded->marcado,
        "telefono" => $decoded->telefono,
        "fechaNacimiento" => $decoded->fechaNacimiento,
        "profesion" => $decoded->profesion,
        "saldo" => $decoded->saldo);


    $id = $db->insert("clientes", $data);
    if ($id) {
        echo $id;
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }
}


function update($item)
{

    $db = new MysqliDb();

    $decoded = json_decode($item);

    $data = Array(
        "nombre" => $decoded->nombre,
        "apellido" => $decoded->apellido,
        "mail" => $decoded->mail,
        "idNacionalidad" => $decoded->idNacionalidad,
        "tipoDoc" => $decoded->tipoDoc,
        "nroDoc" => $decoded->nroDoc,
        "comentarios" => $decoded->comentarios,
        "marcado" => $decoded->marcado,
        "telefono" => $decoded->telefono,
        "fechaNacimiento" => $decoded->fechaNacimiento,
        "profesion" => $decoded->profesion,
        "saldo" => $decoded->saldo);

    $db->where("idCliente", $decoded->idCliente);

    $id = $db->update("clientes", $data);
    if ($id) {
        echo $id;
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }

}

function updateSaldo($cliente, $valor)
{

    $db = new MysqliDb();

//    $decoded = json_decode($cliente);

    $id = $db->rawQuery('Update clientes set saldo = ' . $valor . ' + saldo where idCliente=' . $cliente);

    $db->rawQuery('insert into cuentascorrientes (idCliente, importe) values(' . $cliente . ', ' . $valor . ')');

    if ($id !== false) {
        echo $id;
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }

}


?>