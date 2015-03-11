(function () {


    'use strict';

    angular.module('hostel.login', ['ngRoute', 'cajas-service', 'usuarios-service'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: './views/login/login.html',
                controller: 'LoginCtrl'
            });
        }])

        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['CajasService', '$cookieStore', 'UsuariosService'];

    function LoginCtrl(CajasService, $cookieStore, UsuariosService) {


        var vm = this;

        vm.setCaja = setCaja;


        function setCaja() {
            CajasService.CheckEstado(setEstadoCaja);

            function setEstadoCaja(data) {


                if (data !== undefined && data.idAsientoCierre === null) {

                    //var globals = $cookieStore.get('globals');


                    UsuariosService.GetById(data.idUsuario, setCookieCaja);




                    //console.log($cookieStore.get('caja'));

                } else {

                    $cookieStore.put("caja", {
                        currentCaja: {
                            'estado': 'cerrada',
                            'idUsuario': '',
                            'nombreUsuario': ''
                        }
                    });
                }

                function setCookieCaja(data){

                    $cookieStore.put("caja", {
                        currentCaja: {
                            'estado': 'abierta',
                            'idUsuario': data[0].idUsuario,
                            'nombreUsuario': data[0].nombre
                        }
                    });

                }
            }

        }




    }
})();

