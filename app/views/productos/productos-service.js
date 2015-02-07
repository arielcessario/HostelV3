

/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function(){

    'use strict';
    var app = angular.module('productos-service', ['toastr']);

    app.factory('ProductosService',
        ['$http', 'toastr',
            function ($http, toastr) {
                var vm = this;

                var service = {};

                service.Get = function (callback, params) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "get", "params": params},
                        {cache: true})
                        .success(function(data){
                            callback(data);
                        })
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                service.Save = function (callback, item) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "save", "item": JSON.stringify(item)})
                        .success(function(data){results(callback, data)})
                        .error(function (data) {error(data)});
                };

                service.Update = function (callback, item) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "update", "item": JSON.stringify(item)})
                        .success(function(data){results(callback, data)})
                        .error(function (data) {error(data)});
                };

                service.UpdateStock = function (item) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "updatestock", "item": JSON.stringify(item)})
                        .success(function(data){results(function(){}, data)})
                        .error(function (data) {error(data)});
                };

                service.Delete = function (callback, id) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "delete", "id": id})
                        .success(function(data){results(callback, data)})
                        .error(function (data) {error(data)});
                };

                function error(data){
                    toastr.error('Error: ' + data.Message, '');
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data){
                    if(data.Error=== undefined){
                        toastr.success('Operación realizada con éxito.', '');
                        callback(data);
                    }else{
                        toastr.error('Error: ' + data.Error, '');
                    }
                }

                return service;
            }]);


})()/**
 * Created by desa on 1/2/15.
 */
