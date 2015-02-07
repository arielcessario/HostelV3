(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('hostel', [
        'ngRoute',
        'ngCookies',
        'ngMessages',
        'ngAnimate',
        'ngTouch',
        'smart-table',
        'hostel.login',
        'hostel.logout',
        'hostel.productos',
        'hostel.almacen',
        'hostel.cobros',
        'hostel.detallecaja',
        'hostel.abrecaja',
        'hostel.cierracaja',
        'hostel.pagos',
        'hostel.clientes',
        'input-controls',
        'login-control',
        'button-control',
        'nav-control',
        'footer-control',
        'popup-control'
    ]).
        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/login'});
        }])

        .controller('MainCtrl', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {
            var vm = this;
            vm.nav = [
                {name: 'Salir', url: '#/logout', rol: '2'},
                {name: 'Caja', url: '#/detalle-caja', rol: '2'},
                {name: 'Cobros', url: '#/cobros/menu', rol: '2'},
                {name: 'Pagos', url: '#/pagos', rol: '2'},
                {name: 'Productos', url: '#/productos', rol: '1'},
                {name: 'Clientes', url: '#/clientes', rol: '2'},
                {name: 'Almacen', url: '#/almacen', rol: '2'}
            ];


            var globals = $cookieStore.get('globals');
            if (globals === undefined) {
                vm.isLogged = false;
            } else {
                vm.isLogged = true;

            }


        }]);

})();
