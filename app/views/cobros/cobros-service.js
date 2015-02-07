/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    angular.module('cobros-service', ['toastr', 'movimientos-service', 'productos-service', 'ngRoute'])
        .service('CobrosRepository', CobrosRepository)
        .factory('CobrosService', CobrosService);


    function CobrosRepository() {
        this.aCobrar = [];
    }

    CobrosService.$inject = ['MovimientosService', '$cookieStore', 'ProductosService', '$location'];
    function CobrosService(MovimientosService, $cookieStore, ProductosService, $location) {
        var vm = this;
        var service = {};
        vm.asiento = 0;
        vm.origen = '';
        vm.usuario = 0;
        vm.movimientos = [];

        service.Save = save;

        function save(params) {
            if (params.origen === 'almacen') {
                fromAlmacen(params);
                $location.path('/almacen');
            }else if(params.origen === 'menu'){
                fromMenu(params);
                $location.path('/detalle-caja');
            }


        }

        /* Ventas Varias
         4.1.1.01 - V. Hospedaje
         */
        function fromMenu(data) {
            var items = data.items;
            var totalVenta = data.totalVenta; // Monto original
            var cliente = data.cliente;
            var moneda = data.moneda;
            var aPagar = data.aPagar; // Convertido a la moneda seleccionada
            var descuento = data.descuento; // Descuentos otorgados
            var tipo = data.tipo; // Efectivo, debito, credito
            var vuelto = data.vuelto; // Solo sirve si entrego de la caja por otra moneda que no sea pesos
            var movimiento = {};
            var movimientos = [];
            var detalles = [];
            var detalle = {};
            var cuenta = '';


                // Genera movimientos
                // Genera Asiento de Ventas -> Ventas


                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': items[0].cuenta,
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': items[0].comentarios
                }

                detalles.push(detalle);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);
                detalles=[];
                //console.log(items[i]);


            //limpio detalles
            detalle = {};

            if (data.aCuenta) {
                // Genera Entrada a clientes
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.2.01',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Hospedaje, ingreso a Deudores'
                }

                detalles.push(detalle);

            } else if(tipo === '0'){
                // Genera Entrada a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.01',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Hospedaje, ingreso a Caja'
                }

                detalles.push(detalle);
            } else if(tipo==='1' || tipo==='2'){
                // Genera Entrada a bancos
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.22',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                if(tipo==='1'){
                    detalle = {
                        'idMovimiento': -1,
                        'idTipoDetalle': '2', // Detalle
                        'valor': 'Hospedaje, ingreso a Débito'
                    }

                    detalles.push(detalle);
                }else{
                    detalle = {
                        'idMovimiento': -1,
                        'idTipoDetalle': '2', // Detalle
                        'valor': 'Hospedaje, ingreso a Credito'
                    }

                    detalles.push(detalle);
                }

            }

            // detalle idCliente, se agrega al movimiento de caja o a cuenta que se está generando

            if (cliente !== -1) {
                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '3', // Cliente
                    'valor': cliente
                }

                detalles.push(detalle);
            }

            // detalle idUsuario, se agrega al movimiento de caja o a cuenta que se está generando

            var globals = $cookieStore.get('globals');
            detalle = {
                'idMovimiento': -1,
                'idTipoDetalle': '1', // Usuario
                'valor': globals.currentUser.id
            }

            detalles.push(detalle);


            // detalles de moneda a nivel de caja
            if (moneda.idMoneda !== 1) {
                movimiento.idCuenta = '1.1.1.10';

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '5', // idMoneda
                    'valor': moneda.idMoneda
                }

                detalles.push(detalle);

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '7', // montoMoneda
                    'valor': aPagar
                }

                detalles.push(detalle);

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '6', // Cotización
                    'valor': moneda.cotizacion
                }

                detalles.push(detalle);


            }


            movimiento.detalles = detalles;
            movimientos.push(movimiento);


            // Entrego el cambio de moneda extrangera
            // Esto es un movimiento negativo de caja
            if(moneda.idMoneda !== 1 && vuelto!=0){
                movimiento = {};
                detalles = [];
                // Genera Salida a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.01',
                    'importe': vuelto,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Vuelto de moneda extranjera'
                }

                detalles.push(detalle);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);

                movimiento = {};
                detalles = [];
                // Genera Salida a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.10',
                    'importe': vuelto * -1,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Sobrante moneda extranjera'
                }

                detalles.push(detalle);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);
            }


            // Genera descuento

            if(descuento > 0){
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '4.1.4.01', // Descuentos otorgados
                    'importe': descuento,
                    'detalles': []
                };

                movimientos.push(movimiento);

            }



            //console.log(movimientos);
            saveMovimientos(movimientos);

        }




        /* Ventas de almacen
         4.1.1.02 - V. Kiosko
         4.1.1.04 - V. Beb. sin
         4.1.1.05 - V. Beb. con

         1.1.7.05 - Kiosko
         1.1.7.03 - Beb. sin
         1.1.7.04 - Beb. con
         5.1.1.01 - CMV
         */
        function fromAlmacen(data) {
            var items = data.items;
            var totalVenta = data.totalVenta; // Monto original
            var cliente = data.cliente;
            var moneda = data.moneda;
            var aPagar = data.aPagar; // Convertido a la moneda seleccionada
            var descuento = data.descuento; // Descuentos otorgados
            var tipo = data.tipo; // Efectivo, debito, creditovar
            var vuelto = data.vuelto; // Solo sirve si entrego de la caja por otra moneda que no sea pesos
            var movimiento = {};
            var movimientos = [];
            var detalles = [];
            var detalle = {};
            var cuenta = '';


            for (var i = 0; i < items.length; i++) {
                // Genera movimientos
                // Genera Asiento de Ventas -> Ventas

                switch (items[i].cuenta) {
                    case '1.1.7.05': // Kiosko
                        cuenta = '4.1.1.02'
                        break;
                    case '1.1.7.03': // con alcohol
                        cuenta = '4.1.1.04'
                        break;
                    case '1.1.7.04': // sin alcohol
                        cuenta = '4.1.1.05'
                        break;

                }

                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': cuenta,
                    'importe': items[i].precio,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Venta de almacen'
                }

                detalles.push(detalle);


                // Genera detalles -> idProducto, cantidad,
                // idCliente, : Solo si está presente
                // idMoneda, importeMoneda, cotizacion : Solo si es diferente de pesos


                // producto
                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '8', // Producto
                    'valor': items[i].idProducto
                }
                detalles.push(detalle);

                // precio unitario
                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '9', // Precio Unitario
                    'valor': items[i].precio
                }
                detalles.push(detalle);

                // Actualizo stock

                ProductosService.UpdateStock(items[i].idProducto);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);
                detalles=[];



                // CMV
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '5.1.1.01', // CMV
                    'importe': items[i].costo,
                    'detalles': []
                };

                movimientos.push(movimiento);

                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.7.01', // Mercaderias
                    'importe': items[i].costo,
                    'detalles': []
                };

                movimientos.push(movimiento);

                //console.log(items[i]);
            }

            //limpio detalles
            detalle = {};

            if (data.aCuenta) {
                // Genera Entrada a clientes
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.2.01',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Almacen, ingreso a Deudores'
                }

                detalles.push(detalle);

            } else if(tipo === '0'){
                // Genera Entrada a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.01',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Almacen, ingreso a Caja'
                }

                detalles.push(detalle);
            }else if(tipo==='1' || tipo==='2'){
                // Genera Entrada a bancos
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.21',
                    'importe': totalVenta - descuento,
                    'detalles': []
                };

                if(tipo==='1'){
                    detalle = {
                        'idMovimiento': -1,
                        'idTipoDetalle': '2', // Detalle
                        'valor': 'Hospedaje, ingreso a Débito'
                    }

                    detalles.push(detalle);
                }else{
                    detalle = {
                        'idMovimiento': -1,
                        'idTipoDetalle': '2', // Detalle
                        'valor': 'Hospedaje, ingreso a Credito'
                    }

                    detalles.push(detalle);
                }

            }

            // detalle idCliente, se agrega al movimiento de caja o a cuenta que se está generando

            if (cliente !== -1) {
                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '3', // Cliente
                    'valor': cliente
                }

                detalles.push(detalle);
            }

            // detalle idUsuario, se agrega al movimiento de caja o a cuenta que se está generando

            var globals = $cookieStore.get('globals');
            detalle = {
                'idMovimiento': -1,
                'idTipoDetalle': '1', // Usuario
                'valor': globals.currentUser.id
            }

            detalles.push(detalle);


            // detalles de moneda
            if (moneda.idMoneda !== 1) {

                movimiento.idCuenta = '1.1.1.10';

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '5', // idMoneda
                    'valor': moneda.idMoneda
                }

                detalles.push(detalle);

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '7', // montoMoneda
                    'valor': aPagar
                }

                detalles.push(detalle);

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '6', // Cotización
                    'valor': moneda.cotizacion
                }

                detalles.push(detalle);


            }


            movimiento.detalles = detalles;
            movimientos.push(movimiento);

            // Entrego el cambio de moneda extrangera
            // Esto es un movimiento negativo de caja
            if(moneda.idMoneda !== 1 && vuelto!=0){
                movimiento = {};
                detalles = [];
                // Genera Salida a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.01',
                    'importe': vuelto,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Vuelto de moneda extranjera'
                }

                detalles.push(detalle);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);

                movimiento = {};
                detalles = [];
                // Genera Salida a caja
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '1.1.1.10',
                    'importe': vuelto * -1,
                    'detalles': []
                };

                detalle = {
                    'idMovimiento': -1,
                    'idTipoDetalle': '2', // Detalle
                    'valor': 'Sobrante moneda extranjera'
                }

                detalles.push(detalle);

                movimiento.detalles = detalles;
                movimientos.push(movimiento);
            }


            // Genera descuento

            if(descuento > 0){
                movimiento = {
                    //'idAsiento': vm.asiento,
                    'idCuenta': '4.1.4.01', // Descuentos otorgados
                    'importe': descuento,
                    'detalles': []
                };

                movimientos.push(movimiento);

            }






            //console.log(movimientos);
            saveMovimientos(movimientos);

        }

        function saveMovimientos(movimientos) {

            MovimientosService.Save(function(data){
                //console.log(data);
            }, movimientos);

        }


        return service;
    }




})()
/**
 * Created by desa on 1/2/15.
 */
