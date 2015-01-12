(function(){
  'use strict';

  angular.module('hostel.login', ['ngRoute'])

      .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
          templateUrl: '../login/login.html',
          controller: 'LoginCtrl'
        });
      }])

      .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl() {

  }
})();

