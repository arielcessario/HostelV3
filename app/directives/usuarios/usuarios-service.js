/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    angular.module('usuarios-service', [])
        .factory('UsuariosService',UsuariosService);


    UsuariosService.$inject=['$http', 'toastr'];

    function UsuariosService($http, toastr){

        var service = {};
        service.Get = get;
        service.GetById = getById;
        //service.GetBy = getBy;

        return service;

        function get(callback){

            return $http.post('./directives/usuarios/api/usuarios.php',
                {"function":'get'}, {cache:true})
                .success(success)
                .error();
            function success(data){
                callback(data);
            }
        };
        function getById(id, callback){
            return $http.post('./directives/usuarios/api/usuarios.php',
                {"function":"getbyid", "id":id})
                .success(success)
                .error(function(data){console.log(data);});
            function success(data){
                callback(data);
            }
        };


    }

})()
/**
 * Created by desa on 1/2/15.
 */
