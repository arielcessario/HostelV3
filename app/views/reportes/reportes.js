(function () {


    'use strict';

    angular.module('hostel.clientes', [
        'ngRoute',
        'ngAnimate',
        'clientes-service',
        'nacionalidades-service',
        'smart-table',
        'popup-control',
        'toastr'
    ])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/clientes', {
                templateUrl: './views/clientes/clientes.html',
                controller: 'ClientesCtrl'
            });
        }])
        .controller('ClientesCtrl', ClientesCtrl);

    ClientesCtrl.$inject = ['ClientesService', 'toastr', 'NacionalidadesService','$filter'];

    function ClientesCtrl(ClientesService, toastr, NacionalidadesService, $filter) {


        var vm = this;
        vm.selected = 0;
        vm.selectedCliente = {};
        vm.cliente = {};
        vm.isUpdate = false;
        vm.nacionalidades = [];
        vm.verDeudores = true;




        //ClientesService.Get(get);
        NacionalidadesService.Get(getNacionalidades);
        vm.getDeudores = getDeudores;
        vm.GetIdDescr = getIdDescr;
        vm.GetNacDescr = getNacDescr;


        function getIdDescr(id){
            switch (id){
                case 0:
                    return 'DNI';
                break;
                case 1:
                    return 'PASS';
                break;
                case 2:
                    return 'CI';
                    break;
                default:
                    return 'Otros';
                    break;
            }
        }

        function getNacDescr(id){
            console.log();

            //var pais = {};
            for(var i = 0; i<vm.nacionalidades.length; i++){
                if(vm.nacionalidades[i].id === id){
                    return vm.nacionalidades[i].country_code;
                }
            }


        }



        function getDeudores () {

            if(vm.verDeudores){
                vm.verDeudores = false;
                ClientesService.GetBy(setClientes, "saldo < 0");
            }else{
                ClientesService.Get(get);
                vm.verDeudores = true;
            }


            function setClientes(data){
                vm.clientes = data;
            }


        };

        function getNacionalidades (data){
            vm.nacionalidades = data;
            ClientesService.Get(get);

            function get (data) {
                vm.clientes = data;

            };
        }



        vm.clientesFiltrados = [].concat(vm.clientes)

        vm.selecciona = function (row) {
            //console.log(row);

            if(vm.selected !== 0 &&  vm.selected === row.idCliente){
                vm.selected = 0;
                vm.selectedCliente = {};
                vm.isUpdate= false;
            }else{
                vm.selected = row.idCliente;
                vm.selectedCliente = row;
                vm.isUpdate = true;
            }
        }


        vm.new = function(){
            vm.selected = -1;
            vm.isUpdate = false;
            vm.selectedCliente ={
                idCliente: '',
                nombre: '',
                apellido: '',
                mail: '',
                idNacionalidad: 12,
                tipoDoc: 0,
                nroDoc:'',
                comentarios:'',
                marcado: '',
                telefono: '',
                fechaNacimiento: '',
                profesion: '',
                saldo: ''
            }
        };



        vm.save = function(form){
            //console.log(vm.);

            if(!form.$valid){
                toastr.error(form.$error);
                return;
            }

            console.log(vm.selectedCliente);

            vm.selectedCliente.saldo = vm.selectedCliente.saldo.replace(",",".");

            if(vm.isUpdate){
                ClientesService.Update(function(data){
                    //console.log(data);
                    vm.selected = 0;
                    ClientesService.Get(function (data) {
                        vm.clientes = data;

                    }, '');

                }, vm.selectedCliente);
            }else{
                ClientesService.Save(function(data){
                    //console.log(data);
                    vm.selected = 0;
                    ClientesService.Get(function (data) {
                        vm.clientes = data;

                    }, '');
                }, vm.selectedCliente);
            }


        }


        vm.close = function(){
                vm.selected = 0;
            ClientesService.Get(function (data) {
                vm.clientes = data;

            }, '');

        }


    }


})();

