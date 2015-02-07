(function () {


    'use strict';

    angular.module('hostel.cierracaja', [
        'ngRoute',
        'ngAnimate',
        'smart-table',
        'popup-control',
        'toastr',
        'cajas-service'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/cierra-caja', {
                templateUrl: './views/cierra-caja/cierra-caja.html',
                controller: 'CierraCajaCtrl'
            });
        }])

        .controller('CierraCajaCtrl', CierraCajaCtrl);

    CierraCajaCtrl.$inject = ['CajasService', '$location', '$cookieStore', 'CajasRepository'];

    function CierraCajaCtrl(CajasService, $location, $cookieStore, CajasRepository) {


        var vm = this;
        vm.detalleCaja = [];
        vm.total = 0.0;

        vm.cerrarCaja = cerrarCaja;

        CajasService.GetSaldoFinal(getSaldoFinal);


        function getSaldoFinal(data) {
            vm.totalPesos = CajasRepository.saldoFinal;
            vm.totalDolares = data[0][0].total;
            vm.totalEuros = data[1][0].total;
            vm.totalReales = data[2][0].total;

            //console.log(data);
        }

        function cerrarCaja() {

            var globals = $cookieStore.get('globals');

            var params = [];


            params.push({
                'idUsuario': globals.currentUser.id,
                'idMoneda': 1,
                'valor': vm.totalPesos
            });

            params.push({
                'idUsuario': globals.currentUser.id,
                'idMoneda': 2,
                'valor': vm.totalDolares
            });

            params.push({
                'idUsuario': globals.currentUser.id,
                'idMoneda': 4,
                'valor': vm.totalReales
            });

            params.push({
                'idUsuario': globals.currentUser.id,
                'idMoneda': 3,
                'valor': vm.totalEuros
            });

            //console.log(params);

            CajasService.CerrarCaja(params, function () {
                $cookieStore.put("caja", {currentCaja:{
                    'estado': 'cerrada',
                    'idUsuario': '',
                    'nombreUsuario': ''
                }});

                $location.path('/detalle-caja');
            });

        }


    }


})();

