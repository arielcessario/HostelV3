(function () {
    'use strict';

    angular.module('nav-control', [
        'ngRoute'
    ])
        .directive('navControl', Nav);


    Nav.$inject = ['$cookieStore', '$rootScope', '$location'];

    function Nav($cookieStore, $rootScope, $location) {
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
                vm.buttons =[];


                vm.navFull = $scope.buttons;

                var globals = $cookieStore.get('globals');
                if(globals!== undefined){
                    for (var i = 0; i < vm.navFull.length; i++) {
                        if (globals.currentUser.rol <= vm.navFull[i].rol) {
                            vm.buttons.push(vm.navFull[i]);
                        }
                    }
                }






                if ($scope.isLogged === false) {
                    vm.logged = false
                    $location.path('/login');
                } else {
                    vm.logged = true;
                }


                $rootScope.$on('$routeChangeStart', function (event, next, current) {
                    var globals = $cookieStore.get('globals');
                    if (globals === undefined) {
                        vm.logged = false;
                        $location.path('/login');
                    } else {
                        vm.logged = true;
                        vm.buttons=[];
                        for (var i = 0; i < vm.navFull.length; i++) {
                            if (globals.currentUser.rol <= vm.navFull[i].rol) {
                                vm.buttons.push(vm.navFull[i]);
                            }
                        }
                    }
                });


            },
            controllerAs: 'navCtrl'
        };
    };




})();
