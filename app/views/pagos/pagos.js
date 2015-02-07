(function () {


    'use strict';

    angular.module('hostel.pagos', [
        'ngRoute',
        'ngAnimate',
        'pagos-service',
        'smart-table',
        'cuentas-service',
        'monedas-service',
        'popup-control',
        'toastr'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/pagos', {
                templateUrl: './views/pagos/pagos.html',
                controller: 'PagosCtrl'
            });
        }])

        .controller('PagosCtrl', PagosCtrl);

    PagosCtrl.$inject = ['CuentasService', '$routeParams', 'MonedasService', 'PagosService', 'toastr', '$cookieStore'];

    function PagosCtrl(CuentasService, $routeParams, MonedasService, PagosService, toastr, $cookieStore) {


        var vm = this;
        var params = {};
        var paramsCuentasOrigen = '= "1.1.1.01" or nroCuenta="1.1.1.10" or nroCuenta="1.1.1.21" or nroCuenta="1.1.1.22"';
        var paramsCuentasDestino = '= "1.1.4.01" ' + //Anticipo sueldos
            'or nroCuenta="1.1.4.02" ' + // Anticipo proveedores
            'or nroCuenta="1.1.1.10" ' + // Caja fuerte
            'or nroCuenta="1.1.5.01" ' + // Material de oficina
            'or nroCuenta="1.1.6.02" ' + // IIBB
            'or (nroCuenta like "5.%" and LENGTH(nroCuenta) > 6)' + // Gastos Varios
            'or nroCuenta="1.1.1.21" ' + // CA
            'or nroCuenta="1.1.1.22"'; // CC
        //vm.importe = 0.0;
        vm.tipo = 0;
        vm.comentarios = '';
        vm.cuentaOrigen = {};
        vm.cuentasOrigen = [];
        vm.cuentaDestino = {};
        vm.cuentasDestino = [];


        setCuentas();
        MonedasService.Get(getMonedas);
        CuentasService.GetBy(getCuentasOrigen, paramsCuentasOrigen);
        CuentasService.GetBy(getCuentasDestino, paramsCuentasDestino);

        vm.pagar = pagar;


        function setCuentas(){
            var globals = $cookieStore.get('globals');
            if(globals.currentUser.rol !== 1){
                paramsCuentasOrigen = '= "1.1.1.01" ';
                paramsCuentasDestino = '= "5.2.9.04" or nroCuenta="1.1.1.10"'
            }
        };


        function getCuentasDestino(data) {
            //console.log(data);
            vm.cuentasDestino = data;
            vm.cuentaDestino = vm.cuentasDestino[0];

        }

        function getCuentasOrigen(data) {
            vm.cuentasOrigen = data;
            vm.cuentaOrigen = vm.cuentasOrigen[0];

        }


        function getMonedas(data) {
            vm.monedas = data;
            vm.moneda = vm.monedas[0];

        }

        function pagar(){
            var cajaEstado = $cookieStore.get('caja');

            if(cajaEstado === 'cerrada'){
                toastr.error('La caja se encuentra cerrada');
                return;
            }

            params = {
                'origen': 'pagos',
                'importe': vm.importe,
                'cuentaOrigen': vm.cuentaOrigen,
                'cuentaDestino': vm.cuentaDestino,
                'comentarios': vm.comentarios
            };

            PagosService.Save(params);
        }


    }


})();

