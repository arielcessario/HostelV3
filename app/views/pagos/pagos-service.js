/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    angular.module('pagos-service', ['toastr', 'movimientos-service', 'ngRoute'])
        .factory('PagosService', PagosService);


    PagosService.$inject = ['MovimientosService', '$cookieStore', 'ProductosService', '$location'];
    function PagosService(MovimientosService, $cookieStore, $location) {
        var vm = this;
        var service = {};
        vm.asiento = 0;
        vm.origen = '';
        vm.usuario = 0;
        vm.movimientos = [];

        service.Save = save;


        /* Ventas Varias
         4.1.1.01 - V. Hospedaje
         */
        function save(params) {

            var movimiento = {};
            var movimientos = [];
            var detalles = [];
            var detalle = {};


            // Genera movimientos
            // Genera Asiento de Ventas -> Ventas


            movimiento = {
                //'idAsiento': vm.asiento,
                'idCuenta': params.cuentaOrigen.nroCuenta,
                'importe': params.importe * -1,
                'detalles': []
            };

            detalle = {
                'idMovimiento': -1,
                'idTipoDetalle': '2', // Detalle
                'valor': params.comentarios
            }

            detalles.push(detalle);

            movimiento.detalles = detalles;
            movimientos.push(movimiento);
            detalles = [];
            detalle = {};


            movimiento = {
                //'idAsiento': vm.asiento,
                'idCuenta': params.cuentaDestino.nroCuenta,
                'importe': params.importe,
                'detalles': []
            };

            detalle = {
                'idMovimiento': -1,
                'idTipoDetalle': '2', // Detalle
                'valor': params.comentarios
            }

            detalles.push(detalle);

            movimiento.detalles = detalles;
            movimientos.push(movimiento);


            //console.log(movimientos);
            saveMovimientos(movimientos);

        }

        function saveMovimientos(movimientos) {
            //console.log(movimientos);
            MovimientosService.Save(function (data) {
                //console.log(data);
            }, movimientos);

        }


        return service;
    }


})()
/**
 * Created by desa on 1/2/15.
 */
