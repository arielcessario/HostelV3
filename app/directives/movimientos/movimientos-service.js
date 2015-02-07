

/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function(){

    'use strict';
    var app = angular.module('movimientos-service', []);

    app.factory('MovimientosService',
        ['$http', 'toastr',
            function ($http, toastr) {
                var vm = this;

                var service = {};

                service.GetBy = getBy;
                service.Get = get;
                service.Save = save;
                service.GetMaxAsiento = getMaxAsiento;
                service.DeleteAsiento = deleteAsiento;


                function getMaxAsiento(callback){
                    return $http.post('./directives/movimientos/api/movimientos.php',
                        {'function': 'getmaxasiento'})
                        .success(function(data){
                            callback(data);
                        })
                        .error();
                }


                function getBy(params, callback){
                    return $http.post('./directives/movimientos/api/movimientos.php',
                        {"function":"getby"})
                        .success(callback)
                        .error(function(data){

                        });

                };

                function get(callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./directives/cuentas/api/cuentas.php',
                        {"function": "get"},
                        {cache: true})
                        .success(callback)
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                };

                function deleteAsiento(id){
                    return $http.post('./directives/movimientos/api/movimientos.php',
                        {"function": "deleteasiento", "id":id})
                        .success(function (data){results(function(){}, data)})
                        .error(error)
                }


                function save(callback, params) {
                    return $http.post('./directives/movimientos/api/movimientos.php',
                        {"function": "save", "params": JSON.stringify(params)},
                        {cache: true})
                        .success(function(data){results(callback,data)})
                        .error(function (data) {error(data)});
                };


                function error(data){
                    toastr.error('Error: ' + data.Message, '');
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data){
                    if(data.Error=== undefined){
                        toastr.success('Guardado con éxito.', '');
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
