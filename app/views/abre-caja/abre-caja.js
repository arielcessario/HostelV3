(function () {


    'use strict';

    angular.module('hostel.abrecaja', [
        'ngRoute',
        'ngAnimate',
        'smart-table',
        'popup-control',
        'toastr',
        'cajas-service'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/abre-caja', {
                templateUrl: './views/abre-caja/abre-caja.html',
                controller: 'AbreCajaCtrl'
            });
        }])

        .controller('AbreCajaCtrl', AbreCajaCtrl);

    AbreCajaCtrl.$inject = ['CajasService', '$location', '$cookieStore'];

    function AbreCajaCtrl(CajasService, $location, $cookieStore) {


        var vm = this;
        vm.detalleCaja = [];
        vm.total = 0.0;

        vm.abrirCaja = abrirCaja;

        CajasService.GetSaldoInicial(function (data) {
            vm.total = data;
        });

        function abrirCaja() {

            var globals = $cookieStore.get('globals');

            var params = {
                'idUsuario': globals.currentUser.id,
                'saldoInicial': vm.total
            };

            CajasService.AbrirCaja(params, function () {


                $cookieStore.put('caja', {currentCaja:{
                    'estado': 'abierta',
                    'idUsuario': globals.currentUser.id,
                    'nombreUsuario': globals.currentUser.nombre
                }});
                $location.path('/detalle-caja');

            });
        }


    }


})();

