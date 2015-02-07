

/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function(){

    'use strict';
    var app = angular.module('monedas-service', []);

    app.factory('MonedasService',
        ['$http',
            function ($http) {
                var vm = this;

                var service = {};

                service.Get = function (callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/monedas/api/monedas.php',
                        {"function": "get"},
                        {cache: true})
                        .success(callback)
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };
            return service;
            }]);


})()/**
 * Created by desa on 1/2/15.
 */
