(function () {
    'use strict';

    angular.module('footer-control', [
        'ngRoute',
        'cajas-service',
        'cotizaciones-service'
    ])
        .directive('footerControl', FooterControl);


    FooterControl.$inject = ['$cookieStore', '$rootScope', '$location', 'CajasService', 'CotizacionesService', 'CotizacionesRepository'];

    function FooterControl($cookieStore, $rootScope, $location, CajasService, CotizacionesService, CotizacionesRepository) {
        return {
            restrict: 'E',
            scope: {

            },
            templateUrl: './directives/footer/footer.html',
            controller: function ($scope, $compile, $http) {
                var vm = this;
                //console.log($scope);
                vm.buttons =[];
                vm.logged = false;
                vm.totalCaja = 0.0;
                vm.cotizacionDolar = 0.0;

                setInitialValues();



                function setInitialValues (){
                    var globals = $cookieStore.get('globals');
                    if(globals!== undefined){
                        vm.logged =true;

                        vm.usuarioConectado = globals.currentUser.nombre;

                        var caja = $cookieStore.get('caja');
                        vm.cajaEstado = caja.currentCaja.estado;
                        vm.nombreUsuario = caja.currentCaja.nombreUsuario;


                        CajasService.GetTotalCaja(function(data){
                            vm.totalCaja = data;
                        });

                        CotizacionesService.GetCotizacionDolar(function(data){
                            //console.log(data);
                            vm.cotizacionDolar = data.InformalCompraValue.replace(',','.') * 0.99;

                            CotizacionesRepository.cotizacionesDolar = data;
                            //console.log( vm.cotizacionDolar.InformalCompraValue);
                        });


                    }


                }






                $rootScope.$on('$routeChangeStart', function (event, next, current) {
                   setInitialValues();
                });


            },
            controllerAs: 'footerCtrl'
        };
    };




})();
