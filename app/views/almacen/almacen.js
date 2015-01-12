(function () {


    'use strict';

    angular.module('hostel.productos', [
        'ngRoute',
        'ngAnimate',
        'productos-service',
        'smart-table',
        'cuentas-service',
        'popup-control',
        'toastr'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/productos', {
                templateUrl: './views/productos/productos.html',
                controller: 'ProductosCtrl'
            });
        }])

        .controller('ProductosCtrl', ProductosCtrl);

    ProductosCtrl.$inject = ['ProductosService', 'CuentasService'];

    function ProductosCtrl(ProductosService, CuentasService) {


        var vm = this;
        vm.selected = 0;
        vm.selectedItem = {};
        vm.producto = {};
        vm.cuentas = {};
        vm.cuenta = {};
        vm.isUpdate = false;

        CuentasService.GetBy(function(data){
            //console.log(data);
            vm.cuentas = data;
        }, '1.1.7.');

        ProductosService.Get(function (data) {
            vm.productos = data;

        });



        vm.productosFiltrados = [].concat(vm.productos)

        vm.selecciona = function (row) {
            //console.log(row);

            if(vm.selected !== 0 &&  vm.selected === row.idProducto){
                vm.selected = 0;
                vm.selectedItem = {};
                vm.isUpdate= false;
            }else{
                vm.selected = row.idProducto;
                vm.selectedItem = row;
                vm.isUpdate = true;
            }
        }


        vm.new = function(){
            vm.selected = -1;
            vm.isUpdate = false;
            vm.selectedItem ={
                idProducto: '',
                nombre: '',
                idProveedor: '',
                stock: '',
                precio: '',
                ptoReposicion: '',
                cuenta:'',
                sku:'',
                status: 1
            }
        };



        vm.save = function(form){
            //console.log(vm.);

            if(!form.$valid){
                return;
            }


            vm.selectedItem.precio = vm.selectedItem.precio.replace(",",".");

            if(vm.isUpdate){
                ProductosService.Update(function(data){
                    //console.log(data);
                    vm.selected = 0;
                    ProductosService.Get(function (data) {
                        vm.productos = data;

                    });

                }, vm.selectedItem);
            }else{
                ProductosService.Save(function(data){
                    //console.log(data);
                    vm.selected = 0;
                    ProductosService.Get(function (data) {
                        vm.productos = data;

                    });
                }, vm.selectedItem);
            }


        }

        vm.delete = function(){
            ProductosService.Delete(function(data){
                console.log(data);
                vm.selected = 0;
                ProductosService.Get(function (data) {
                    vm.productos = data;

                });
            }, vm.selectedItem.idProducto);
        }

        vm.close = function(){
                vm.selected = 0;
            ProductosService.Get(function (data) {
                vm.productos = data;

            });

        }


    }


})();

