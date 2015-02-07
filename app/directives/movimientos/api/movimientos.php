<?php

session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if($decoded->function === 'get'){
    get($decoded->params);
}else if($decoded->function === 'save') {


    $idAsiento = json_decode(getMaxAsiento());
    $idAsiento = $idAsiento + 1;

    foreach(json_decode($decoded->params) as $movimiento){
        save($movimiento, $idAsiento);
    }
//    save($decoded->asiento);
}else if($decoded->function === 'getmaxasiento') {
    getMaxAsiento();
}else if($decoded->function === 'deleteasiento'){
    deleteAsiento($decoded->id);
}



function get($params){

}

function getMaxAsiento(){

    $db = new MysqliDb();
    $results = $db->rawQuery("select max(idAsiento) asiento from movimientos");
    if($results[0]['asiento'] === null){
        echo 0;
    }else{
        echo json_encode($results[0]['asiento']);
        return $results[0]['asiento'];
    }



}

function save($movimiento, $idAsiento){


    $db = new MysqliDb();


    $decoded = $movimiento;


    $data = array(
        "idCuenta" => $decoded->idCuenta,
        "idAsiento" => $idAsiento,
        "importe" => $decoded->importe
    );

    $id = $db->insert("movimientos", $data);
    if($id){
        foreach($decoded->detalles as $detalle){
            saveDetalle($id, $detalle);
        }
    }



//    print_r($query["sql"]);
//    $result = $query["status"];
//    echo $db->getLastError();
    if ($id) {
        echo 'Dato guardado con éxito';
    } else {
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }
}

function saveDetalle($idMovimiento, $detalle){
    $db = new MysqliDb();
    $decoded = $detalle;


    $data = array(
        "idTipoDetalle" => $decoded->idTipoDetalle,
        "valor" => $decoded->valor,
        "idMovimiento" => $idMovimiento
    );

    $id = $db->insert("detallesmovimientos", $data);



//    print_r($query["sql"]);
//    $result = $query["status"];
//    echo $db->getLastError();
    if ($id) {
        echo 'Dato guardado con éxito';
    } else {
        echo json_encode(Array("Error"=>$db->getLastError())) ;
    }
}

function deleteAsiento($id){
    $db = new MysqliDb();

    $results = $db->rawQuery('select valor from detallesmovimientos where idMovimiento in (select idMovimiento from movimientos where idAsiento = '.$id.') and idTipoDetalle = 8;');
    foreach($results as $row){
        $db->rawQuery('Update productos set stock = stock +1 where idProducto='.$row["valor"]);
    }

    $db->rawQuery("delete from detallesmovimientos where idMovimiento in (select idMovimiento from movimientos where idAsiento = ".$id.")");
    $db->rawQuery("delete from movimientos where idAsiento = ".$id );

    if($db->getLastError() !== ''){
        echo json_encode($db->getLastError());
    }
}


//
//
//
//if ($type == 1) {
//    // Inserta
//
//} elseif ($type == 0 || $type == 4) {
//    // Búsqueda - 0
//    // Búsqueda con radio - 4
//
//    $_orderBy = $_POST["orderby"];
//
//
//    $nombre = $_POST["nombre"];
//    $apellido = $_POST["apellido"];
//    $mail = $_POST["mail"];
//    $tipodoc = $_POST["tipodoc"];
//    $nrodoc = $_POST["nrodoc"];
//
//
//    // Condiciones de búsqueda
//    $sqlAux = '';
//
//    if (!isset($nombre) || trim($nombre) === '' || $nombre === NULL) {
//        $sqlAux = $sqlAux . " ";
//    } else {
//        $sqlAux = $sqlAux . " and Nombre like '%" . $nombre . "%' ";
//    }
//
//    if (!isset($apellido) || trim($apellido) === '' || $apellido === NULL) {
//        $sqlAux = $sqlAux . " ";
//    } else {
//        $sqlAux = $sqlAux . " and Apellido like '%" . $apellido . "%' ";
//    }
//
//    if (!isset($mail) || trim($mail) === '' || $mail === NULL) {
//        $sqlAux = $sqlAux . " ";
//    } else {
//        $sqlAux = $sqlAux . " and Mail like '%" . $mail . "%' ";
//    }
//
//    if (!isset($nrodoc) || trim($nrodoc) === '' || $nrodoc === NULL) {
//        $sqlAux = $sqlAux . " ";
//    } else {
//        $sqlAux = $sqlAux . " and NroDoc like '%" . $nrodoc . "%' ";
//    }
//
//    //$query = $con->selectFrom("clientes", $columns = null, $where = null, $like = false, $orderby = null, $direction = "DESC", $limit = null, $offset = null);
//
//    $SQL = "SELECT `IdCliente`, `Nombre`, `Apellido`, `Mail`, (SELECT  concat(id, ' - ', country_name) as country "
//            . "FROM  `countries` WHERE id =`IdNacionalidad`) as Nacionalidad, `TipoDoc`, `NroDoc`, `Comentarios`, "
//            . "IF(`Marcado` =0, 'No', 'Si') as Marcado FROM `clientes` WHERE 1" . $sqlAux;
//
//    $results = $db->rawQuery($SQL);
//
//    if ($db->count > 0) {
//        foreach ($results as $row) {
//
//
//            $param = "'" . $row["IdCliente"] . "','" . $row["Nombre"] . "','" . $row["Apellido"] . "','" . $row["Mail"] . "','"
//                    . $row["Nacionalidad"] . "','" . $row["Comentarios"] . "','" . $row["TipoDoc"] . "','" . $row["NroDoc"] . "','"
//                    . $row["Marcado"] . "'";
//
//            $backMarcado = '';
//            if ($row["Marcado"] == 'Si') {
//                $backMarcado = ' style = "color:red;" ';
//            }
//
//            if ($type == 0) {
//                echo "<tr" . $backMarcado . "><td>" . $row["IdCliente"] . "</td>"
//                . "<td>" . $row["Nombre"] . "</td><td>" . $row["Apellido"] . "</td>"
//                . "<td>" . $row["Mail"] . "</td><td>" . $row["Nacionalidad"] . "</td>"
//                . "<td>" . $row["Comentarios"] . "</td><td>" . $row["TipoDoc"] . "</td>"
//                . "<td>" . $row["NroDoc"] . "</td><td>" . $row["Marcado"] . "</td>"
//                . "<td onClick='deleteCliente(" . $row["IdCliente"] . ")' "
//                . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/delete.png'></td>"
//                . '<td onClick="selectCliente(' . $param . ')" '
//                . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/edit.png'></td></tr>";
//            } else {
//                $idRowSelected = "'tmpClient_" . $row["IdCliente"] . "'";
//                $fnc = "";
//                echo '<tr onClick="selectClientePerm(' . $param . ',' . $idRowSelected . ')" id=' . $idRowSelected . ' ' . $backMarcado . '>'
//                . '<td>' . $row["IdCliente"] . '</td>'
//                . "<td>" . $row["Nombre"] . "</td><td>" . $row["Apellido"] . "</td>"
//                . "<td>" . $row["Mail"] . "</td><td>" . $row["Nacionalidad"] . "</td>"
//                . "<td>" . $row["Comentarios"] . "</td><td>" . $row["TipoDoc"] . "</td>"
//                . "<td>" . $row["NroDoc"] . "</td><td>" . $row["Marcado"] . "</td>"
//                . '<td '
//                . "style='cursor:pointer;'></td></tr>";
//            }
//        }
//    } else {
//        echo '<tr >'
//        . '<td></td>'
//        . "<td></td><td></td>"
//        . "<td></td><td></td>"
//        . "<td></td><td></td>"
//        . "<td></td><td></td>"
//        . '<td '
//        . "style='cursor:pointer;'></td></tr>";
//    }
//} elseif ($type == 2) {
//    // Borra
////    $id = $_POST["id"];
////
////    $db->where("IdCliente", $id);
////    $db->delete("clientes");
////
////    //print_r($query['sql']);
////    $db->getLastError();
//} elseif ($type == 3) {
//    // Modificar
////    $id = $_POST["id"];
////    $nombre = $_POST["nombre"];
////    $apellido = $_POST["apellido"];
////    $mail = $_POST["mail"];
////    $nacionalidad = $_POST["nacionalidad"];
////    $comentarios = $_POST["comentarios"];
////    $tipodoc = $_POST["tipodoc"];
////    $nrodoc = $_POST["nrodoc"];
////    $marcado = $_POST["marcado"];
////
////    $query = $con->updateTable("clientes", $fields = array("Nombre" => $nombre, "Apellido" => $apellido, "Mail" => $mail, "IdNacionalidad" => $nacionalidad,
////        "Comentarios" => $comentarios, "TipoDoc" => $tipodoc, "NroDoc" => $nrodoc, "Marcado" => $marcado), $where = array("IdCliente" => $id));
////    $result = $query["status"];
////    if ($result == "success") {
////        echo 'Dato guardado con éxito';
////    } else {
////        echo "El dato no ha sido guardado";
////    }
//} elseif ($type == 5) {
//    // Modifica los movimientos que son de una reserva para que queden relacionados a la registración
//    $idregistracion = $_POST["idregistracion"];
//    $idreserva = $_POST["idreserva"];
//
//    $data = array('IdRegistracion' => $idregistracion);
//    $db->where("IdReserva", $idreserva);
//    if ($db->update("movimientos", $data)) {
//        echo 'Dato guardado con éxito';
//    } else {
//        error_log($db->getLastError());
//        echo 'El dato no ha sido guardado: ' . $db->getLastError();
//    }
//} elseif ($type == 6) {
//    // Obtiene Número de asiento
//
//    $results = $db->query("Select max(IdAsiento + 1) idasiento from movimientos;");
//    if ($db->count > 0) {
//        foreach ($results as $row) {
//            echo $row["idasiento"];
//        }
//    } else {
//
//        error_log($db->getLastError());
//        echo "El dato no ha sido guardado";
//    }
//}
?>