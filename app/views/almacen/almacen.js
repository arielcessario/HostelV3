(function () {


    'use strict';

    angular.module('hostel.almacen', [
        'ngRoute',
        'ngAnimate',
        'productos-service',
        'cobros-service',
        'smart-table',
        'cuentas-service',
        'popup-control',
        'toastr'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/almacen', {
                templateUrl: './views/almacen/almacen.html',
                controller: 'AlmacenCtrl'
            });
        }])

        .controller('AlmacenCtrl', AlmacenCtrl);

    AlmacenCtrl.$inject = ['CuentasService', 'ProductosService', '$location', 'CobrosRepository'];

    function AlmacenCtrl(CuentasService, ProductosService, $location, CobrosRepository) {
        var vm = this;
        vm.productosSeleccionados = [];
        vm.productoSeleccionado = {};
        vm.totalACobrar = 0.0;

        ProductosService.Get(getProductos, 'toSell');
        vm.addProducto = addProducto;
        vm.cobrar = cobrar;
        vm.removeProducto = removeProducto;



        function cobrar() {
            if(vm.productosSeleccionados.length === 0){
                return;
            }

            CobrosRepository.aCobrar = vm.productosSeleccionados;
            $location.path('/cobros/almacen');
        };


        function addProducto() {
            vm.productosSeleccionados.push(vm.producto);
            vm.productoSeleccionado = vm.productosSeleccionados[0];
            vm.totalACobrar = vm.totalACobrar + parseFloat(vm.producto.precio);

        }

        function removeProducto() {
            var index = vm.productosSeleccionados.indexOf(vm.productoSeleccionado);
            vm.productosSeleccionados.splice(index, 1);

            vm.totalACobrar = vm.totalACobrar - parseFloat(vm.productoSeleccionado.precio);

            if (index > vm.productosSeleccionados.length - 1) {
                vm.productoSeleccionado = vm.productosSeleccionados[index - 1];
            } else {
                vm.productoSeleccionado = vm.productosSeleccionados[index];
            }
        }


        function getProductos(data) {
            vm.productos = data;
            vm.producto = data[0];
        }


    }


})();

