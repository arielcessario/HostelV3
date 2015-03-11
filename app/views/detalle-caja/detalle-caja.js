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


        function deleteAsiento(id) {
            //console.log(id);
            var r = confirm('Realmente desea eliminar el movimiento?');

            if(r){
                MovimientosService.DeleteAsiento(id);
                CajasService.GetDetalleCaja(getDetalles);
            }

        }

        function abreCaja() {
            $location.path('/abre-caja');
        }

        function cierraCaja() {
            CajasRepository.saldoFinal = vm.total;
            $location.path('/cierra-caja')
        }


        function getDetalles(data) {

            //console.log(data);

            var results = [];
            var details = [];
            var line = {tipo: '', descr: '', value: ''};
            var asiento = [];
            vm.date = '';
            vm.idAsiento = '';

            vm.total += parseFloat(data[0][0].saldoInicial);


            for (var i = 0; i < data.length; i++) {
                // solo las entradas a caja
                asiento = data[i];
                details = [];
                for (var x = 0; x < asiento.length; x++) {
                    //console.log(asiento[x]);
                    line = {};

                    if (asiento[x].idCuenta === '1.1.1.01') {
                        line.tipo = 1;
                        vm.total += parseFloat(asiento[x].importe);
                        line.value = asiento[x].importe;
                        details.date = asiento[x].fecha;
                        details.idAsiento = asiento[x].idAsiento;
                        details.push(line);
                    } else {
                        line.descr = '';
                        line.tipo = 2;
                        for (var y = 0; y < asiento[x].detalles.length; y++) {
                            if (asiento[x].detalles[y].idTipoDetalle == 2) { // Detalle
                                line.descr += asiento[x].detalles[y].valor + ' ';
                            }

                            if (asiento[x].detalles[y].idTipoDetalle == 8) { // Producto

                                line.descr += asiento[x].detalles[y].producto;
                            }


                            if (asiento[x].detalles[y].idTipoDetalle == 9) { // Precio unitario
                                line.value = asiento[x].detalles[y].valor;
                            }
                        }
                        //console.log(line);
                        details.push(line);
                    }
                }
                //console.log(details);
                results.push(details);

                //console.log(data[i].detalles);
            }
            //vm.detalleCaja = data;
            vm.detalleCaja = results;
        }


    }


})();

