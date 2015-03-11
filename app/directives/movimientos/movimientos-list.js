(function () {
    angular.module('movimientos-list', [])
        .service('MovimientoVenta', MovimientoVenta)
        .service('MovimientoVentaKiosko', MovimientoVentaKiosko)
        .service('MovimientoBSinAlcohol', MovimientoBSinAlcohol)
        .service('MovimientoBConAlcohol', MovimientoBConAlcohol)
        .service('MovimientoCMV', MovimientoCMV)
        .service('MovimientoMercaderias', MovimientoMercaderias)
        .service('MovimientoClientes', MovimientoClientes)
        .service('MovimientoCaja', MovimientoCaja)
        .service('MovimientoDebito', MovimientoDebito)
        .service('MovimientoCredito', MovimientoCredito)
        .service('MovimientoMonedas', MovimientoMonedas)
        .service('MovimientoMonedasVuelto', MovimientoMonedasVuelto)
        .service('MovimientoDescuentos', MovimientoDescuentos);

    function MovimientoVenta() {
        this.movimiento = function (cuenta, importe, comentario) {
            return {
                idCuenta: cuenta, // Venta
                importe: importe,
                detalles: [
                    {'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle*/ 'valor': comentario}]
            };

        }
    }

    function MovimientoVentaKiosko() {
        this.movimiento = function (importe, idProducto, precio) {
            return {
                idCuenta: '4.1.1.02', // Venta kiosko
                importe: importe,
                detalles: [
                    {'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle*/ 'valor': 'Venta de Kiosko'},
                    {'idMovimiento': -1, 'idTipoDetalle': '8', /* idProducto */ 'valor': idProducto},
                    {'idMovimiento': -1, 'idTipoDetalle': '9', /* Precio Unitario*/ 'valor': precio}]
            }

        }
    }

    function MovimientoBSinAlcohol() {
        this.movimiento = function(importe, idProducto, precio) {
            return {
                idCuenta: '4.1.1.04', // Venta beb sin alcohol
                importe: importe,
                detalles: [
                    {'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle*/ 'valor': 'Venta de almacen'},
                    {'idMovimiento': -1, 'idTipoDetalle': '8', /* Producto */ 'valor': idProducto},
                    {'idMovimiento': -1, 'idTipoDetalle': '9', /* Precio Unitario*/ 'valor': precio}]
            }
        }
    }

    function MovimientoBConAlcohol() {
        this.movimiento = function(importe, idProducto, precio) {
            return {
                idCuenta: '4.1.1.05', // Venta beb con alcohol
                importe: importe,
                detalles: [
                    {'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle*/ 'valor': 'Venta de almacen'},
                    {'idMovimiento': -1, 'idTipoDetalle': '8', /* Producto */ 'valor': idProducto},
                    {'idMovimiento': -1, 'idTipoDetalle': '9', /* Precio Unitario*/ 'valor': precio}]
            }

        }
    }


    function MovimientoCMV() {

        this.movimiento = function(importe){
            return {
                'idCuenta': '5.1.1.01', // CMV
                //'importe': items[i].costo,
                'importe': importe,
                'detalles': []
            }
        };
    }

    function MovimientoMercaderias() {

        this.movimiento = function(importe){
            return{
                'idCuenta': '1.1.7.01', // Mercaderias
                //'importe': items[i].costo,
                'importe': importe,
                'detalles': []
            }

        };
    }

    function MovimientoClientes() { //A cuenta
        this.movimiento = function(importe, cliente, usuario){

            return {
                'idCuenta': '1.1.2.01',
                'importe': importe,
                //'importe': totalVenta - descuento,
                'detalles': [
                    {'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle */ 'valor': 'Almacen, ingreso a Deudores'},
                    {'idMovimiento': -1, 'idTipoDetalle': '3', /* Cliente */'valor': cliente},
                    {'idMovimiento': -1, 'idTipoDetalle': '1', /* Usuario */'valor': usuario}]
            }

        };
    }

    function MovimientoCaja() {
        this.movimiento = function(importe, usuario, comentario){
            return {
                //'idAsiento': vm.asiento,
                'idCuenta': '1.1.1.01',
                //'importe': totalVenta - descuento,
                'importe': importe,
                'detalles': [{'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle */ 'valor': comentario},
                    {'idMovimiento': -1, 'idTipoDetalle': '1', /* Usuario */'valor': usuario}]
            }

        };
    }

    function MovimientoDebito() {
        this.movimiento = function(importe, cliente, usuario){

            return {
                //'idAsiento': vm.asiento,
                'idCuenta': '1.1.1.21',
                'importe': importe,
                //'importe': totalVenta - descuento,
                'detalles': [
                    {'idMovimiento': -1,'idTipoDetalle': '2', /* Detalle */'valor': 'Hospedaje, ingreso a Débito'},
                    {'idMovimiento': -1, 'idTipoDetalle': '3', /* Cliente */'valor': cliente},
                    {'idMovimiento': -1, 'idTipoDetalle': '1', /* Usuario */'valor': usuario}]
            }

        };
    }

    function MovimientoCredito() {
        this.movimiento = function(importe, cliente, usuario){
            return{
                //'idAsiento': vm.asiento,
                'idCuenta': '1.1.1.21',
                //'importe': totalVenta - descuento,
                'importe': importe,
                'detalles': [
                    {'idMovimiento': -1,'idTipoDetalle': '2', /* Detalle */'valor': 'Hospedaje, ingreso a Crédito'},
                    {'idMovimiento': -1, 'idTipoDetalle': '3', /* Cliente */'valor': cliente},
                    {'idMovimiento': -1, 'idTipoDetalle': '1', /* Usuario */'valor': usuario}]
            }

        };
    }

    function MovimientoMonedas() {
        this.movimiento = function(importe, cliente, usuario, idMoneda, aPagar, cotizacion){
            return {//'idAsiento': vm.asiento,
                'idCuenta': '1.1.1.10',
                'importe': importe,
                //'importe': totalVenta - descuento,
                'detalles': [{'idMovimiento': -1, 'idTipoDetalle': '2', /* Detalle */ 'valor': 'Almacen, ingreso a Caja'},
                    {'idMovimiento': -1, 'idTipoDetalle': '3', /* Cliente */'valor': cliente},
                    {'idMovimiento': -1, 'idTipoDetalle': '1', /* Usuario */'valor': usuario},
                    {'idMovimiento': -1, 'idTipoDetalle': '5', /* idMoneda */'valor': idMoneda},
                    {'idMovimiento': -1, 'idTipoDetalle': '7', /* montoMoneda */'valor': aPagar},
                    {'idMovimiento': -1, 'idTipoDetalle': '6', /* Cotización */'valor': cotizacion}
                ]}

        };
    }

    function MovimientoMonedasVuelto() {
        this.movimiento = function(importe){
           return {
               //'idAsiento': vm.asiento,
               'idCuenta': '1.1.1.01',
               'importe': importe,
               'detalles': [{'idMovimiento': -1,'idTipoDetalle': '2', /* Detalle */'valor': 'Vuelto de moneda extranjera'}]
           }
        };
    }

    function MovimientoDescuentos() {
        this.movimiento = function(importe){
            return{
                //'idAsiento': vm.asiento,
                'idCuenta': '4.1.4.01', // Descuentos otorgados
                'importe': importe,
                'detalles': []
            }
        };
    }
})();
