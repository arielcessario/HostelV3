<?php


session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if($decoded->function === 'get'){
    get();
}else if($decoded->function === 'getBy'){
    getBy($decoded->params);
}

function get()
{
    $db = new MysqliDb();

    $results = $db->get("cuentas");


    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo 'error';
    }
}

function getBy($params)
{
    $db = new MysqliDb();
    $decoded = json_decode($params);


    $db->where('nroCuenta ' . $params);
    $results = $db->get("cuentas");


    if ($db->count > 0) {
        echo json_encode($results);
    } else {
        echo 'error';
    }
}


//session_start();
//require_once '../MyDB.php';
//$con = new MyDB();
//
//$type = $_POST["type"];
//
//if ($type == 1) {
//    // Inserta
//    $nombre = $_POST["nombre"];
//    $idproveedor = $_POST["proveedor"];
//    $stock = $_POST["stock"];
//    $precio = $_POST["precio"];
//    $ptoreposicion = $_POST["ptoreposicion"];
//    $cuenta = $_POST["cuenta"];
//
//    $precio = ($precio == "" || $precio == null) ? 0 : $precio;
//    $ptoreposicion = ($ptoreposicion == "" || $ptoreposicion == null) ? 0 : $ptoreposicion;
//    $stock = ($stock == "" || $stock == null) ? 0 : $stock;
//
//    $query = $con->insertInto("items", $fields = array("Nombre" => $nombre, "IdProveedor" => $idproveedor, "Stock" => $stock, "Precio" => $precio,
//        "PtoReposicion" => $ptoreposicion, "Cuenta" => $cuenta));
//
////    print_r($query["sql"]);
//
//    $result = $query["status"];
//    if ($result == "success") {
//        echo 'Dato guardado con éxito';
//    } else {
//        echo "El dato no ha sido guardado";
//    }
//} elseif ($type == 0) {
//    // Búsqueda
//
//    $_orderBy = $_POST["orderby"];
//
//    $query = $con->selectFrom("items", $columns = null, $where = null, $like = false, $orderby = null, $direction = "DESC", $limit = null, $offset = null);
//
////    print_r($query);
//
//    if ($query["num"] > 0) {
//        $result = $query["result"];
//        foreach ($result as $row) {
//
//
//            $param = "'" . $row["IdItem"] . "','" . $row["Nombre"] . "','" . $row["IdProveedor"] . "','" . $row["Stock"] . "','"
//                    . $row["Precio"] . "','" . $row["PtoReposicion"] . "','" . $row["Cuenta"] . "'";
//
//            echo "<tr><td>" . $row["IdItem"] . "</td>"
//            . "<td>" . $row["Nombre"] . "</td><td>" . $row["IdProveedor"] . "</td>"
//            . "<td>" . $row["Stock"] . "</td><td>" . $row["Precio"] . "</td>"
//            . "<td>" . $row["PtoReposicion"] . "</td><td>" . $row["Cuenta"] . "</td>"
//            . "<td onClick='deleteItem(" . $row["IdItem"] . ")' "
//            . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/delete.png'></td>"
//            . '<td onClick="selectItem(' . $param . ')" '
//            . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/edit.png'></td></tr>";
//        }
//    }
//} elseif ($type == 2) {
//    // Borra
//    $id = $_POST["id"];
//    $query = $con->deleteFrom("items", $where = array("IdItem" => $id), $like = false, $limit = 1);
//    $result = $query["status"];
//
//    //print_r($query['sql']);
//    if ($result == "success") {
//        echo 'Dato borrado con éxito';
//    } else {
//        echo "El dato no ha sido borrado";
//    }
//} elseif ($type == 3) {
//    // Modificar
//    $id = $_POST["id"];
//    $nombre = $_POST["nombre"];
//    $idproveedor = $_POST["proveedor"];
//    $stock = $_POST["stock"];
//    $precio = $_POST["precio"];
//    $ptoreposicion = $_POST["ptoreposicion"];
//    $cuenta = $_POST["cuenta"];
//
//    $precio = ($precio == "" || $precio == null) ? 0 : $precio;
//    $ptoreposicion = ($ptoreposicion == "" || $ptoreposicion == null) ? 0 : $ptoreposicion;
//    $stock = ($stock == "" || $stock == null) ? 0 : $stock;
//
//
//    $query = $con->updateTable("items", $fields = array("Nombre" => $nombre, "IdProveedor" => $idproveedor, "Stock" => $stock, "Precio" => $precio,
//        "PtoReposicion" => $ptoreposicion, "Cuenta" => $cuenta), $where = array("IdItem" => $id));
//    $result = $query["status"];
//    if ($result == "success") {
//        echo 'Dato guardado con éxito';
//    } else {
//        echo "El dato no ha sido guardado";
//    }
//} elseif ($type == 4) {
//    // Actualiza stock
//    $id = $_POST["id"];
//    $cant = $_POST["cantidad"];
//    $query = $con->customExec("update items set Stock = Stock " . $cant . " where IdItem = " . $id);
//    $result = $query["status"];
//
//
//    if ($result == "success") {
//        echo 'Dato guardado con éxito';
//    } else {
//        echo "El dato no ha sido guardado";
//    }
//} elseif ($type == 5) {
//    // Búsqueda por id
//
//    $id = $_POST["id"];
//
//    $query = $con->selectFrom("items", $columns = null, $where = array("IdItem" => $id), $like = false, $orderby = null, $direction = "DESC", $limit = null, $offset = null);
//
//    $result = $query["result"];
//
//    if ($query["num"] > 0) {
//        foreach ($result as $row) {
//
//
//            echo "" . $row["IdItem"] . " " . $row["Nombre"] . " " . $row["IdProveedor"] . " " . $row["Stock"] . " "
//            . $row["Precio"] . " " . $row["PtoReposicion"] . " " . $row["Cuenta"] . "";
//        }
//    }
//}
?>