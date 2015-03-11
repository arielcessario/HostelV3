(function () {
    'use strict';

    angular.module('button-control', [
        'ngRoute'
    ])
        .directive('buttonControl', Button);




    //Button.$inject = ['LoginService'];

    function Button() {
        return {
            restrict: 'E',
            scope: {
                name: '=',
                classes: '='
            },
            templateUrl: './directives/buttons/button.html',
            controller: function ($scope, $compile, $http) {
                var vm = this;
                //console.log($scope);
                vm.name = $scope.name;
                vm.classes = $scope.classes;

            },
            controllerAs: 'buttonCtrl'
        };}



})();
