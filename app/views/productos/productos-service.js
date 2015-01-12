

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

                service.Get = function (callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "get"},
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
                        .success(function(data){
                            if(data.Error=== undefined){
                                toastr.success('El producto se ha salvado.', '');
                                callback(data);
                            }else{
                                toastr.error('Error: ' + data.Error, '');
                            }
                        })
                        .error(function (data) {
                            toastr.success('Error: ' + data.Message, '');
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                service.Update = function (callback, item) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "update", "item": JSON.stringify(item)})
                        .success(function(data){

                            if(data.Error === undefined){

                                toastr.success('El producto se ha salvado.', '');
                                callback(data);
                            }else{
                                toastr.error('Error: ' + data.Error, '');
                            }

                        })
                        .error(function (data) {
                            toastr.success('Error: ' + data.Message, '');
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                service.Delete = function (callback, id) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/productos/api/productos.php',
                        {"function": "delete", "id": id})
                        .success(function(data){

                            if(data.Error === undefined){
                                toastr.success('El producto se ha eliminado.', '');
                                callback(data);
                            }else{
                                toastr.error('Error: ' + data.Error, '');
                            }
                        })
                        .error(function (data) {
                            toastr.success('Error: ' + data.Message, '');
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
