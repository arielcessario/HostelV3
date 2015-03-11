(function () {


    'use strict';

    angular.module('hostel.cobros', [
        'ngRoute',
        'ngAnimate',
        'cobros-service',
        'smart-table',
        'cuentas-service',
        'monedas-service',
        'clientes-service',
        'popup-control',
        'toastr',
        'cotizaciones-service'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/cobros/:origen', {
                templateUrl: './views/cobros/cobros.html',
                controller: 'CobrosCtrl'
            });
        }])

        .controller('CobrosCtrl', CobrosCtrl);

    CobrosCtrl.$inject = ['CuentasService',
        '$routeParams',
        'CobrosRepository',
        'MonedasService',
        'CobrosService',
        'toastr',
        '$cookieStore',
        'ClientesService',
        'CotizacionesRepository'];

    function CobrosCtrl(CuentasService,
                        $routeParams,
                        CobrosRepository,
                        MonedasService,
                        CobrosService,
                        toastr,
                        $cookieStore,
                        ClientesService,
                        CotizacionesRepository) {


        var vm = this;
        vm.aCobrar = CobrosRepository.aCobrar;
        vm.origen = $routeParams.origen;
        vm.totalVenta = 0.0;
        vm.cuentas = [];
        vm.cuenta = {};
        vm.monedas = [];
        vm.moneda = {};
        vm.aPagar = 0.0;
        vm.vuelto = 0.0;
        vm.idCliente = -1;
        vm.cliente = {};
        vm.muestraCuentas = false;
        vm.clientes = [];
        vm.filtro = '';

        MonedasService.Get(getMonedas);
        vm.calcACobrar = calcACobrar;
        vm.calcACobrarPorc = calcACobrarPorc;
        vm.buscarCliente = buscarCliente;
        vm.cobrar = cobrar;
        vm.pagaConPesos = pagaConPesos;
        vm.cobroManual = false;
        vm.tipo = '0';


        function buscarCliente() {

            if (vm.filtro.length > 2) {
                var filtro = 'nombre like "%' + vm.filtro + '%" or apellido like "%' + vm.filtro + '%"';

                ClientesService.GetBy(setClientes, filtro);
            } else {
                vm.cliente = {};
            }
            function setClientes(data) {

                vm.cliente = data[0];
                //console.log(vm.cliente);
                vm.clientes = data;
            }
        }

        if (vm.origen === 'almacen') {

            for (var i = 0; i < vm.aCobrar.length; i++) {
                vm.totalVenta = vm.totalVenta + parseFloat(vm.aCobrar[i].precio);

            }
            vm.cobroManual = false;
        } else if (vm.origen === 'menu') {
            vm.cobroManual = true;
            CuentasService.GetBy(function (data) {
                //console.log(data);
                vm.cuentas = data;
            }, '= "4.1.1.01" or nroCuenta="1.1.2.01" or nroCuenta="4.1.1.03"');

        }


        function cobrar() {
            var params = {};

            var cajaEstado = $cookieStore.get('caja');

            if (cajaEstado === 'cerrada') {
                toastr.error('La caja se encuentra cerrada');
                return;
            }


            if (vm.cliente.idCliente === undefined && vm.aCuenta) {
                toastr.error('No puede vender a cuenta si no selecciona un cliente');
                return;
            }

            if (vm.origen === 'almacen') {
                params = {
                    'origen': vm.origen,
                    'items': vm.aCobrar,
                    'totalVenta': vm.totalVenta,
                    'moneda': vm.moneda,
                    'aPagar': vm.aPagar,
                    'aCuenta': vm.aCuenta,
                    'cliente': vm.cliente.idCliente === undefined ? -1 : vm.cliente.idCliente,
                    'descuento': (vm.descuentoCantidad !== undefined) ? vm.descuentoCantidad * vm.moneda.cotizacion : 0,
                    'tipo': vm.tipo,
                    'vuelto': vm.vuelto
                };
            } else if (vm.origen === 'menu') {

                if (isNaN(vm.totalVenta)) {
                    toastr.error('No se ha ingresado el valor de venta', '');
                    return;

                }

                if (vm.cuenta.length === undefined) {
                    toastr.error('Debe seleccionar una cuenta', '');
                    return;

                }

                if (vm.comentarios === undefined) {
                    toastr.error('Debe ingresar un comentario', '');
                    return;

                }

                if (vm.cuenta === '1.1.2.01' && vm.cliente.idCliente === undefined) {
                    toastr.error('Debe seleccionar un cliente', '');
                    return;
                }

                vm.aCobrar = [{'cuenta': vm.cuenta, 'comentarios': vm.comentarios}];

                params = {
                    'origen': vm.origen,
                    'items': vm.aCobrar,
                    'totalVenta': vm.totalVenta,
                    'moneda': vm.moneda,
                    'aPagar': vm.aPagar,
                    'aCuenta': vm.aCuenta,
                    'cliente': vm.cliente.idCliente === undefined ? -1 : vm.cliente.idCliente,
                    'descuento': (vm.descuentoCantidad !== undefined) ? vm.descuentoCantidad * vm.moneda.cotizacion : 0,
                    'tipo': vm.tipo,
                    'vuelto': vm.vuelto
                };
            }


            CobrosService.Save(params);


            // Actualizo cuenta corriente de clientes, en caso de Cobrar a cuenta, se resta el valor que se está pagando
            // En caso de ser un cobro con la cuenta 1.1.2.01 (clientes) se suma para restar a la deuda
            if (vm.aCuenta) {

                var descuento = (vm.descuentoCantidad !== undefined) ? vm.descuentoCantidad * vm.moneda.cotizacion : 0
                actualizaSaldoCliente(vm.cliente.idCliente === undefined ? -1 : vm.cliente.idCliente, (vm.totalVenta - descuento) * -1);


            }

            if (vm.cuenta === '1.1.2.01') {
                var descuento = (vm.descuentoCantidad !== undefined) ? vm.descuentoCantidad * vm.moneda.cotizacion : 0
                actualizaSaldoCliente(vm.cliente.idCliente === undefined ? -1 : vm.cliente.idCliente, (vm.totalVenta - descuento));
            }


        }

        function pagaConPesos() {
            if (vm.pagaCon > 0) {
                vm.vuelto = vm.totalVenta - (vm.descuentoCantidad * vm.moneda.cotizacion) - (vm.pagaCon * vm.moneda.cotizacion);
            } else {
                vm.vuelto = 0;
                vm.pagaCon = 0;
            }

        }


        function calcACobrar() {
            vm.vuelto = 0;
            vm.pagaCon = 0;

            if (vm.descuentoCantidad > 0) {
                vm.aPagar = (vm.totalVenta / vm.moneda.cotizacion) - vm.descuentoCantidad;
                vm.descuentoPorc = (vm.descuentoCantidad * 100) / (vm.totalVenta / vm.moneda.cotizacion);
            } else {
                vm.aPagar = vm.totalVenta / vm.moneda.cotizacion;
                vm.descuentoPorc = 0;
            }


        }

        function calcACobrarPorc() {
            vm.vuelto = 0;
            vm.pagaCon = 0;

            if (vm.descuentoPorc > 0) {
                vm.aPagar = (vm.totalVenta / vm.moneda.cotizacion) - ((vm.totalVenta / vm.moneda.cotizacion) * vm.descuentoPorc) / 100;
                vm.descuentoCantidad = (vm.totalVenta / vm.moneda.cotizacion) - vm.aPagar;
            } else {
                vm.aPagar = vm.totalVenta / vm.moneda.cotizacion;
                vm.descuentoCantidad = 0;
            }

        }

        function getMonedas(data) {

            var cotizacionDolar = 0.0;
            vm.monedas = data;
            //vm.monedas[1].cotizacion = CotizacionesRepository.cotizacionesDolar.InformalCompraValue.replace(',','.') * 0.99;
            cotizacionDolar = CotizacionesRepository.cotizacionesDolar.InformalCompraValue.replace(',','.');
            vm.monedas[1].cotizacion = cotizacionDolar;
            vm.monedas[1].cotic
                vm.moneda = vm.monedas[0];
            vm.aPagar = (vm.totalVenta / vm.moneda.cotizacion);

        }

        function actualizaSaldoCliente(idCliente, valor) {
            ClientesService.UpdateSaldo(idCliente, valor);
        }


    }


})();

