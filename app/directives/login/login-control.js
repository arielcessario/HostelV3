(function () {
    'use strict';

    angular.module('login-control', [
        'ngRoute',
        'ngMessages',
        'input-controls',
        'login-service',
        'button-control'
    ])
        .directive('loginControl', Login)
        .run(checkLogin);




    Login.$inject = ['LoginService'];

    function Login(LoginService) {
        return {
            restrict: 'E',
            scope: {
                controlForm: '=',
                controlType: '=',
                controlName: '=',
                controlPlaceholder: '=',
                controlValidate: '='
            },
            templateUrl: './directives/login/login.html',
            controller: function ($scope, $compile, $http) {
                var vm = this;
                vm.login= function(form){
                    if(form.$valid) {
                        LoginService.LoginService(form.myUser.$modelValue, form.myPass.$modelValue);
                    }
                }

                vm.name = 'Entrar';
                vm.classes = 'btn btn-green btn-small';

            },
            controllerAs: 'loginCtrl'
        };}


    checkLogin.$inject = ['$cookieStore', '$location', '$rootScope'];

    function checkLogin($cookieStore, $location, $rootScope) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var globals = $cookieStore.get('globals');
            if (globals === undefined) {
                $location.path('/login');
            }
            //Look at the next parameter value to determine if a redirect is needed
        });

    };



})();
