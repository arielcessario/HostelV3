<?php

session_start();
require_once '../../../api/MyDBi.php';

$data = file_get_contents("php://input");

$decoded = json_decode($data);

if ($decoded->function === 'getdetallecaja') {
    getDetalleCaja();
} else if ($decoded->function === 'getsaldoinicial') {
    getSaldoInicial();
} else if ($decoded->function === 'abrircaja') {
    abrirCaja($decoded->params);
} else if ($decoded->function === 'getsaldofinal') {
    getSaldoFinal();
} else if ($decoded->function === 'cerrarcaja') {
    cerrarCaja($decoded->params);
} else if($decoded->function === 'checkestado'){
    checkEstado();
}

//Obtiene los datos para mostrar en el cierre
function getSaldoFinal()
{
    $db = new MysqliDb();
    $lastCaja = getLastCaja();
    $moneda = 2;
    $totales = Array();


    for ($i = 2; $i < 5; $i++) {
        $moneda = $i;
        $SQL = "Select " . $moneda . " idMoneda,
    ifnull(sum(m.importe),0) total
from
    movimientos m
where
    m.idCuenta = '1.1.1.01'
        and m.idMovimiento in (select distinct
            (idMovimiento)
        from
            detallesmovimientos d
        where
            d.idMovimiento in (select
                    idMovimiento
                from
                    movimientos
                where
                    idAsiento >= " . $lastCaja['idAsientoInicio'] . ")
                and d.idMovimiento in (select
                    dd.idMovimiento
                from
                    detallesmovimientos dd
                where
					valor = " . $moneda . " and
                    idTipoDetalle = 5
                        and dd.idMovimiento in (select
                            idMovimiento
                        from
                            movimientos
                        where
                            idAsiento >= " . $lastCaja['idAsientoInicio'] . " )));";
        $results = $db->rawQuery($SQL);
        array_push($totales, $results);
    }

    echo json_encode($totales);


}

function cerrarCaja($params){
    $db = new MysqliDb();
    $decoded = json_decode($params);
    $lastCaja = getLastCaja();

    if(intval($lastCaja["idUsuario"]) !== $decoded[0]->idUsuario){
        echo 'usuario';
        return;
    }

    if($lastCaja["idAsientoCierre"] !== null){
        echo 'cerrada';
        return;
    }

    $db->rawQuery("update cajas set idAsientoCierre = (Select max(idAsiento) from movimientos) where idCaja =".$lastCaja["idCaja"].";");


    for($i = 0; $i <=3; $i++){
        $data = Array(
            "idMoneda" => $decoded[$i]->idMoneda,
            "valorReal"=> $decoded[$i]->valor,
            "valorEsperado"=> $decoded[$i]->valor,
            "idCaja"=> $lastCaja["idCaja"]);
        $db->insert("detallescajas", $data);

    }

    echo "ok";
}

//Obtiene el saldo inicial de caja
function getSaldoInicial()
{
    $db = new MysqliDb();

    $lastCaja = getLastCaja();


    $SQL = 'Select
    sum(m.importe) total
from
    movimientos m
where
    m.idCuenta = "1.1.1.01"
        and m.idMovimiento in (select distinct
            (idMovimiento)
        from
            detallesmovimientos d
        where
            d.idMovimiento in (select
                    idMovimiento
                from
                    movimientos
                where
                    idAsiento between ' . $lastCaja['idAsientoInicio'] . ' and ' . $lastCaja['idAsientoCierre'] . ')
                and d.idMovimiento not in (select
                    dd.idMovimiento
                from
                    detallesmovimientos dd
                where
                    idTipoDetalle = 5
                        and dd.idMovimiento in (select
                            idMovimiento
                        from
                            movimientos
                        where
                            idAsiento between ' . $lastCaja['idAsientoInicio'] . ' and ' . $lastCaja['idAsientoCierre'] . ')));';

    $results = $db->rawQuery($SQL);

    echo json_encode($results[0]['total'] + $lastCaja['saldoInicial']);


}

function checkEstado(){
    echo json_encode(getLastCaja());
}

function getLastCaja()
{
    $db = new MysqliDb();
    $results = $db->rawQuery("select * from cajas where idCaja = (select max(idCaja) from cajas);");

    return $results[0];
}

//Realiza la apertura de la caja
function abrirCaja($params)
{
    $db = new MysqliDb();

    $decoded = json_decode($params);
    $lastCaja = getLastCaja();


    if ($lastCaja['idAsientoCierre'] === null) {
        echo 'abierta';
//        echo 'La caja se encuentra abierta';
        return;
    }

    $data = Array(
        'idUsuario' => $decoded->idUsuario,
        'idAsientoInicio' => $lastCaja['idAsientoCierre'] + 1,
        'saldoInicial' => $decoded->saldoInicial
    );

    $id = $db->insert('cajas', $data);

    if ($id) {
        echo $id;
    } else {
        echo json_encode($db->getLastError());
    }

}

// Obtiene el detalle de la caja actual
function getDetalleCaja()
{

    $db = new MysqliDb();
    $data = Array(
        "status" => 0);

    $lastCaja = getLastCaja();


    $SQL = "Select
                                    m.idAsiento idAsiento,
                                    m.idMovimiento,
                                    DATE_FORMAT(m.fecha,'%d-%m-%Y %h:%m')                                fecha,
                                    m.idCuenta,
                                    c.nombre,
                                    m.importe,
                                    0 detalles,
                                    " . $lastCaja["saldoInicial"] . " saldoInicial
                                from
                                    movimientos m
                                        inner join
                                    cuentas c ON c.nroCuenta = m.idCuenta
                                where
                                m.idAsiento >= " . $lastCaja['idAsientoInicio'] . "
                                order by m.idAsiento , m.idMovimiento;";
    $results = $db->rawQuery($SQL);


    $resultsDetalles = Array();

    foreach ($results as $row) {

        $SQL = "select
                                        u.nombre usuario, p.nombre producto, d.valor, t.nombre, d.idTipoDetalle
                                    from
                                        movimientos m
                                            inner join
                                        detallesmovimientos d ON m.idMovimiento = d.idMovimiento
                                            inner join
                                        tiposdetalles t ON d.idTipoDetalle = t.idTipoDetalle
                                            left join
                                        usuarios u ON d.valor = u.idUsuario
                                            and d.idTipoDetalle = 1
                                            left join
                                        productos p ON d.valor = p.idProducto
                                            and d.idTipoDetalle = 8
                                    where
                                        m.idMovimiento = " . $row['idMovimiento'] . ";";


        $detalles = $db->rawQuery($SQL);

        $row["detalles"] = $detalles;
        array_push($resultsDetalles, $row);


    }


    if(count($resultsDetalles)===0){
        $lastCaja["saldoInicial"];

        $results = $db->rawQuery(" select 0 idAsiento,
                                    0 idMovimiento,
                                    0 fecha,
                                    0 idCuenta,
                                    0 nombre,
                                    0 importe,
                                    0 detalles,
                                    " . $lastCaja["saldoInicial"] . " saldoInicial from dual ");
        echo json_encode($results);

    }else{
        echo json_encode($resultsDetalles);
    }



//    if ($id) {
//        echo $id;
//    } else {
//        echo json_encode(Array("Error" => $db->getLastError()));
//    }

}

function getDetalleCajaBy($params)
{

}

?>