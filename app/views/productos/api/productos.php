<?php


session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if($decoded->function === 'get'){
    get();
}else if($decoded->function === 'save') {
    save($decoded->item);

}else if($decoded->function === 'update') {
    update($decoded->item);
}else if($decoded->function === 'delete') {
    delete($decoded->id);
}

function get()
{
    $db = new MysqliDb();

    $results = $db->get("productos");


    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }
}

function save($item)
{
    $db = new MysqliDb();
    $decoded = json_decode($item);

    $data =Array(
        "nombre" => $decoded->nombre,
        "idProveedor" => 1,
        "stock" => $decoded->stock,
        "precio"=> $decoded->precio,
        "ptoReposicion" => $decoded->ptoReposicion,
        "cuenta" => $decoded->cuenta,
        "sku" => $decoded->sku);


    $id = $db->insert("productos", $data);
    if($id>0){
        echo $id;
    }else{
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }
}


function update($item){

    $db = new MysqliDb();

    $decoded = json_decode($item);

    $data =Array(
        "nombre" => $decoded->nombre,
        "idProveedor" => 1,
        "stock" => $decoded->stock,
        "precio"=> $decoded->precio,
        "ptoReposicion" => $decoded->ptoReposicion,
        "cuenta" => $decoded->cuenta,
        "sku" => $decoded->sku);

    $db->where("idProducto", $decoded->idProducto);

    $id = $db->update("productos", $data);
    if($id>0){
        echo $id;
    }else{
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }

}


function delete($id){
    $db = new MysqliDb();
    $data =Array(
        "status" => 0);

    $db->where("idProdcuto", $id);

    $id = $db->update("productos", $data);
    if($id>0){
        echo $id;
    }else{
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }
}

?>