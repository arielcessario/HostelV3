(function(){


  'use strict';

  angular.module('hostel.logout', ['ngRoute'])

      .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/logout', {
          templateUrl: './views/logout/logout.html',
          controller: 'LogoutCtrl'
        });
      }])

      .controller('LogoutCtrl', LogoutCtrl);

    LogoutCtrl.$inject = ['LoginService', '$location', '$cookieStore']

  function LogoutCtrl(LoginService, $location, $cookieStore) {

      //console.log('entra');
      LoginService.ClearCredentials();
      //var globals = $cookieStore.get('globals');
      //console.log(globals);
      $location.path('#/login');
      $cookieStore.remove("caja");

  }
})();

