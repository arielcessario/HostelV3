(function () {
    'use strict';

    angular.module('nav-control', [
        'ngRoute'
    ])
        .directive('navControl', Nav);


    Nav.$inject = ['$cookieStore', '$rootScope'];

    function Nav($cookieStore, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                buttons: '=',
                isLogged: '='
            },
            templateUrl: './directives/nav/nav.html',
            controller: function ($scope, $compile, $http) {
                var vm = this;
                //console.log($scope);
                vm.buttons = $scope.buttons;

                if ($scope.isLogged === false) {
                    vm.logged = false;
                } else {
                    vm.logged = true;
                }


                $rootScope.$on('$routeChangeStart', function (event, next, current) {
                    var globals = $cookieStore.get('globals');
                    if (globals === undefined) {
                        vm.logged = false;
                    } else {
                        vm.logged = true;
                    }
                });


            },
            controllerAs: 'navCtrl'
        };
    };




})();
