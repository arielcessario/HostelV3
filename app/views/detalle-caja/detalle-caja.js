(function () {


    'use strict';

    angular.module('hostel.detallecaja', [
        'ngRoute',
        'ngAnimate',
        'smart-table',
        'popup-control',
        'toastr',
        'cajas-service',
        'movimientos-service'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/detalle-caja', {
                templateUrl: './views/detalle-caja/detalle-caja.html',
                controller: 'DetalleCajaCtrl'
            });
        }])

        .controller('DetalleCajaCtrl', DetalleCajaCtrl);

    DetalleCajaCtrl.$inject = ['CajasService', '$location', 'CajasRepository', '$cookieStore', 'MovimientosService'];

    function DetalleCajaCtrl(CajasService, $location, CajasRepository, $cookieStore, MovimientosService) {


        var vm = this;
        var caja = $cookieStore.get('caja');
        vm.detalleCaja = [];
        vm.total = 0.0;
        vm.abierta = caja.currentCaja.estado !== 'abierta';
        vm.deleteAsiento = deleteAsiento;



        CajasService.GetDetalleCaja(getDetalles);
        vm.abreCaja = abreCaja;
        vm.cierraCaja = cierraCaja;


        function deleteAsiento(id){
            //console.log(id);
            MovimientosService.DeleteAsiento(id);
            CajasService.GetDetalleCaja(getDetalles);
        }

        function abreCaja() {
            $location.path('/abre-caja');
        }

        function cierraCaja() {
            CajasRepository.saldoFinal = vm.total;
            $location.path('/cierra-caja')
        }


        function getDetalles(data) {

            var asiento = [];
            vm.total += parseFloat(data[0][0].saldoInicial);
            for (var i = 0; i < data.length; i++) {
                // solo las entradas a caja
                asiento = data[i];
                for (var x = 0; x < asiento.length; x++) {
                    if (asiento[x].idCuenta === '1.1.1.01') {
                        vm.total += parseFloat(asiento[x].importe);
                    }
                }

                //console.log(data[i].detalles);
            }
            vm.detalleCaja = data;
        };


    }


})();

