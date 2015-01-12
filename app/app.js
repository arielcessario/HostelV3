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
        'myApp.view2',
        'myApp.version',
        'input-controls',
        'login-control',
        'button-control',
        'nav-control',
        'popup-control'
    ]).
        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/login'});
        }])

        .controller('MainCtrl', ['$cookieStore', function ($cookieStore) {
            var vm = this;
            vm.nav = [
                {name: 'Salir', url: '#/logout'},
                {name: 'Productos', url: '#/productos'}
                ];


            var globals = $cookieStore.get('globals');
            if (globals === undefined) {
                vm.isLogged = false;
            } else {
                vm.isLogged = true;
            }

        }]);

})();
