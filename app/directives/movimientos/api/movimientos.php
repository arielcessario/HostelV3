<?php

session_start();
require_once '../src/MyDBi.php';
$db = new MysqliDb();

$type = $_POST["type"];

if ($type == 1) {
    // Inserta
    $idcuenta = $_POST["idcuenta"];
    $idasiento = $_POST["idasiento"];
    $iditem = $_POST["iditem"];
    $idregistracion = $_POST["idregistracion"];
    $idreserva = $_POST["idreserva"];
    $idcliente = $_POST["idcliente"];
    $cantidad = $_POST["cantidad"];
    $idusuario = $_POST["idusuario"];
    $importe = $_POST["importe"];
    $idmoneda = $_POST["idmoneda"];
    $importemoneda = $_POST["importemoneda"];
    $cotizacion = $_POST["cotizacion"];
    $detalles = $_POST["detalles"];

    $id = $db->insert("movimientos", $fields = array(
        "IdCuenta" => $idcuenta,
        "IdAsiento" => $idasiento,
        "IdItem" => $iditem,
        "IdRegistracion" => $idregistracion,
        "IdReserva" => $idreserva,
        "IdCliente" => $idcliente,
        "Cantidad" => $cantidad,
        "IdUsuario" => $idusuario,
        "Importe" => $importe,
        "IdMoneda" => $idmoneda,
        "ImporteMoneda" => $importemoneda,
        "Cotizacion" => $cotizacion,
        "Detalles" => $detalles));

//    print_r($query["sql"]);
//    $result = $query["status"];
    echo $db->getLastError();
    if ($id > -1) {
        echo 'Dato guardado con éxito';
    } else {
        echo "El dato no ha sido guardado";
        error_log($db->getLastError());
    }
} elseif ($type == 0 || $type == 4) {
    // Búsqueda - 0
    // Búsqueda con radio - 4

    $_orderBy = $_POST["orderby"];


    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $mail = $_POST["mail"];
    $tipodoc = $_POST["tipodoc"];
    $nrodoc = $_POST["nrodoc"];


    // Condiciones de búsqueda
    $sqlAux = '';

    if (!isset($nombre) || trim($nombre) === '' || $nombre === NULL) {
        $sqlAux = $sqlAux . " ";
    } else {
        $sqlAux = $sqlAux . " and Nombre like '%" . $nombre . "%' ";
    }

    if (!isset($apellido) || trim($apellido) === '' || $apellido === NULL) {
        $sqlAux = $sqlAux . " ";
    } else {
        $sqlAux = $sqlAux . " and Apellido like '%" . $apellido . "%' ";
    }

    if (!isset($mail) || trim($mail) === '' || $mail === NULL) {
        $sqlAux = $sqlAux . " ";
    } else {
        $sqlAux = $sqlAux . " and Mail like '%" . $mail . "%' ";
    }

    if (!isset($nrodoc) || trim($nrodoc) === '' || $nrodoc === NULL) {
        $sqlAux = $sqlAux . " ";
    } else {
        $sqlAux = $sqlAux . " and NroDoc like '%" . $nrodoc . "%' ";
    }

    //$query = $con->selectFrom("clientes", $columns = null, $where = null, $like = false, $orderby = null, $direction = "DESC", $limit = null, $offset = null);

    $SQL = "SELECT `IdCliente`, `Nombre`, `Apellido`, `Mail`, (SELECT  concat(id, ' - ', country_name) as country "
            . "FROM  `countries` WHERE id =`IdNacionalidad`) as Nacionalidad, `TipoDoc`, `NroDoc`, `Comentarios`, "
            . "IF(`Marcado` =0, 'No', 'Si') as Marcado FROM `clientes` WHERE 1" . $sqlAux;

    $results = $db->rawQuery($SQL);

    if ($db->count > 0) {
        foreach ($results as $row) {


            $param = "'" . $row["IdCliente"] . "','" . $row["Nombre"] . "','" . $row["Apellido"] . "','" . $row["Mail"] . "','"
                    . $row["Nacionalidad"] . "','" . $row["Comentarios"] . "','" . $row["TipoDoc"] . "','" . $row["NroDoc"] . "','"
                    . $row["Marcado"] . "'";

            $backMarcado = '';
            if ($row["Marcado"] == 'Si') {
                $backMarcado = ' style = "color:red;" ';
            }

            if ($type == 0) {
                echo "<tr" . $backMarcado . "><td>" . $row["IdCliente"] . "</td>"
                . "<td>" . $row["Nombre"] . "</td><td>" . $row["Apellido"] . "</td>"
                . "<td>" . $row["Mail"] . "</td><td>" . $row["Nacionalidad"] . "</td>"
                . "<td>" . $row["Comentarios"] . "</td><td>" . $row["TipoDoc"] . "</td>"
                . "<td>" . $row["NroDoc"] . "</td><td>" . $row["Marcado"] . "</td>"
                . "<td onClick='deleteCliente(" . $row["IdCliente"] . ")' "
                . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/delete.png'></td>"
                . '<td onClick="selectCliente(' . $param . ')" '
                . "style='cursor:pointer;'><img style='height:20px; width:20px;' src='./img/edit.png'></td></tr>";
            } else {
                $idRowSelected = "'tmpClient_" . $row["IdCliente"] . "'";
                $fnc = "";
                echo '<tr onClick="selectClientePerm(' . $param . ',' . $idRowSelected . ')" id=' . $idRowSelected . ' ' . $backMarcado . '>'
                . '<td>' . $row["IdCliente"] . '</td>'
                . "<td>" . $row["Nombre"] . "</td><td>" . $row["Apellido"] . "</td>"
                . "<td>" . $row["Mail"] . "</td><td>" . $row["Nacionalidad"] . "</td>"
                . "<td>" . $row["Comentarios"] . "</td><td>" . $row["TipoDoc"] . "</td>"
                . "<td>" . $row["NroDoc"] . "</td><td>" . $row["Marcado"] . "</td>"
                . '<td '
                . "style='cursor:pointer;'></td></tr>";
            }
        }
    } else {
        echo '<tr >'
        . '<td></td>'
        . "<td></td><td></td>"
        . "<td></td><td></td>"
        . "<td></td><td></td>"
        . "<td></td><td></td>"
        . '<td '
        . "style='cursor:pointer;'></td></tr>";
    }
} elseif ($type == 2) {
    // Borra
//    $id = $_POST["id"];
//    
//    $db->where("IdCliente", $id);
//    $db->delete("clientes");
//   
//    //print_r($query['sql']);
//    $db->getLastError();
} elseif ($type == 3) {
    // Modificar
//    $id = $_POST["id"];
//    $nombre = $_POST["nombre"];
//    $apellido = $_POST["apellido"];
//    $mail = $_POST["mail"];
//    $nacionalidad = $_POST["nacionalidad"];
//    $comentarios = $_POST["comentarios"];
//    $tipodoc = $_POST["tipodoc"];
//    $nrodoc = $_POST["nrodoc"];
//    $marcado = $_POST["marcado"];
//
//    $query = $con->updateTable("clientes", $fields = array("Nombre" => $nombre, "Apellido" => $apellido, "Mail" => $mail, "IdNacionalidad" => $nacionalidad,
//        "Comentarios" => $comentarios, "TipoDoc" => $tipodoc, "NroDoc" => $nrodoc, "Marcado" => $marcado), $where = array("IdCliente" => $id));
//    $result = $query["status"];
//    if ($result == "success") {
//        echo 'Dato guardado con éxito';
//    } else {
//        echo "El dato no ha sido guardado";
//    }
} elseif ($type == 5) {
    // Modifica los movimientos que son de una reserva para que queden relacionados a la registración
    $idregistracion = $_POST["idregistracion"];
    $idreserva = $_POST["idreserva"];

    $data = array('IdRegistracion' => $idregistracion);
    $db->where("IdReserva", $idreserva);
    if ($db->update("movimientos", $data)) {
        echo 'Dato guardado con éxito';
    } else {
        error_log($db->getLastError());
        echo 'El dato no ha sido guardado: ' . $db->getLastError();
    }
} elseif ($type == 6) {
    // Obtiene Número de asiento

    $results = $db->query("Select max(IdAsiento + 1) idasiento from movimientos;");
    if ($db->count > 0) {
        foreach ($results as $row) {
            echo $row["idasiento"];
        }
    } else {
        
        error_log($db->getLastError());
        echo "El dato no ha sido guardado";
    }
}
?>