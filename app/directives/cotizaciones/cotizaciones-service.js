/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    angular.module('cotizaciones-service', [])
        .factory('CotizacionesService',CotizacionesService)
        .service('CotizacionesRepository', CotizacionesRepository);

    function CotizacionesRepository(){
        this.cotizacionesDolar = {};
    }

    CotizacionesService.$inject=['$http', 'toastr'];

    function CotizacionesService($http, toastr){

        var service = {};
        service.GetCotizacionDolar = getCotizacionDolar;

        return service;

        function getCotizacionDolar(callback){

            return $http.post('./directives/cotizaciones/api/cotizaciones.php',
                {'function':'getdolar'}, {cache:true})
                .success(success)
                .error(function (data, status, headers, config) {
                    //this always gets called
                    console.log(status);
                    //deferred.reject(status);
                });
            function success(data){
                //console.log(data);
                callback(data);
            }
        };

    }

})()
/**
 * Created by desa on 1/2/15.
 */
