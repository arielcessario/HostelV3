/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    var app = angular.module('clientes-service', ['toastr']);

    app.factory('ClientesService',
        ['$http', 'toastr',
            function ($http, toastr) {
                var vm = this;

                var service = {};

                service.Get = get;
                service.GetBy = getBy;
                service.Save = save;
                service.Update = update;
                service.UpdateSaldo = updateSaldo;


                function get(callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/clientes/api/clientes.php',
                        {"function": "get"},
                        {cache: true})
                        .success(function (data) {
                            callback(data);
                        })
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                function getBy(callback, params) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/clientes/api/clientes.php',
                        {"function": "getby", "params": params},
                        {cache: true})
                        .success(function (data) {
                            callback(data);
                        })
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                function save(callback, cliente) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/clientes/api/clientes.php',
                        {"function": "save", "cliente": JSON.stringify(cliente)})
                        .success(function (data) {
                            results(callback, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                };

                function update(callback, cliente) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/clientes/api/clientes.php',
                        {"function": "update", "cliente": JSON.stringify(cliente)})
                        .success(function (data) {
                            results(callback, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                };

                function updateSaldo(idCliente, valor) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./views/clientes/api/clientes.php',
                        {"function": "updatesaldo", "cliente": idCliente, "valor": valor})
                        .success(function (data) {
                            results(function () {
                            }, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                };


                function error(data) {
                    toastr.error('Error: ' + data.Message, '');
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data) {
                    if (data.Error === undefined) {
                        toastr.success('Operación realizada con éxito.', '');
                        callback(data);
                    } else {
                        toastr.error('Error: ' + data.Error, '');
                    }
                }

                return service;
            }]);


})()
/**
 * Created by desa on 1/2/15.
 */
