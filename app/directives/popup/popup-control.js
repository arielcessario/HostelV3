(function () {
    'use strict';

    angular.module('popup-control', [
    ])
        .directive('popupControl', Popup);


    Popup.$inject = [];

    function Popup() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                showPopup: '=',
                selected: '='
            },
            templateUrl: './directives/popup/popup.html',
            controller: function ($scope, $compile, $http) {
                var vm = this;
                //console.log($scope);
                vm.titulo = $scope.titulo;
                console.log($scope.selected);
                vm.show = $scope.selected;




            },
            controllerAs: 'popupCtrl'
        };
    };




})();
