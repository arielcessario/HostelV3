/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    var app = angular.module('cajas-service', []);

    app.service('CajasRepository', function () {
        this.saldoInicial = {};
        this.saldoFinal = {};
    });

    app.factory('CajasService',
        ['$http', 'toastr',
            function ($http, toastr) {
                var vm = this;

                var service = {};

                service.GetDetalleCaja = getDetalleCaja;
                service.Save = save;
                service.GetSaldoInicial = getSaldoInicial;
                service.AbrirCaja = abrirCaja;
                service.GetSaldoFinal = getSaldoFinal;
                service.CerrarCaja = cerrarCaja;
                service.CheckEstado = checkEstado;
                service.GetTotalCaja = getTotalCaja;



                // Retorno el total de la caja
                function getTotalCaja(callback){

                    vm.total = 0.0;


                    getDetalleCaja(getTotal);


                    function getTotal(data){
                        var asiento = [];
                        //console.log(data);

                        vm.total += parseFloat(data[0][0].saldoInicial);
                        for (var i = 0; i < data.length; i++) {
                            // solo las entradas a caja
                            asiento = data[i];
                            for (var x = 0; x < asiento.length; x++) {
                                if (asiento[x].idCuenta === '1.1.1.01') {
                                    vm.total += parseFloat(asiento[x].importe);
                                }
                            }


                        }
                        //console.log(vm.total);
                        callback(vm.total);
                    }




                };



                //VERIFICA ESTADO DE LA CAJA
                function checkEstado(callback) {
                    return $http.post('./directives/cajas/api/cajas.php',
                        {'function': 'checkestado'})
                        .success(callback)
                        .error();
                }

                //APERTURA DE CAJA
                function getSaldoInicial(callback) {
                    return $http.post('./directives/cajas/api/cajas.php',
                        {'function': 'getsaldoinicial'})
                        .success(callback)
                        .error();
                }

                function abrirCaja(params, callback) {
                    return $http.post('./directives/cajas/api/cajas.php', {
                        'function': 'abrircaja',
                        'params': JSON.stringify(params)
                    })
                        .success(function (data) {
                            console.log(data);
                            if (data === 'abierta') {

                                error('La caja se encuentra abierta.')

                            } else {
                                results(callback, data);
                            }

                        }
                    )
                        .error(function (data) {
                            error(data)
                        });
                }

                //CIERRE DE CAJA
                function getSaldoFinal(callback){
                    return $http.post('./directives/cajas/api/cajas.php',
                        {'function': 'getsaldofinal'})
                        .success(callback)
                        .error();
                }

                function cerrarCaja(params, callback){
                    console.log(params);
                    return $http.post('./directives/cajas/api/cajas.php',
                        {'function': 'cerrarcaja', 'params': JSON.stringify(params)})
                        .success(function(data){
                            if(data === 'cerrada'){
                                error('La caja se encuentra cerrada');
                            }
                            if(data=== 'usuario'){
                                error('Solo puede cerrar la caja el usuario que la abrió.')
                            }
                            results(callback,data)
                        })
                        .error(function(data){error(data)});

                }


                //DETALLES DE CAJA
                function getDetalleCaja(callback) {
                    return $http.post('./directives/cajas/api/cajas.php',
                        {'function': 'getdetallecaja'})
                        .success(function (data) {

                            var idAsientoActual = data[0].idAsiento;
                            var listaFinal = [];
                            var movimientos = [];

                            for (var i = 0; i < data.length; i++) {
                                //console.log(data[i]);
                                movimientos.push(data[i]);

                                if (i < data.length - 1 && idAsientoActual !== data[i + 1].idAsiento) {
                                    idAsientoActual = data[i + 1].idAsiento;
                                    listaFinal.push(movimientos);
                                    movimientos = [];
                                }


                            }
                            listaFinal.push(movimientos);
                            callback(listaFinal);
                        })
                        .error();
                }


                function save(callback, params) {
                    return $http.post('./directives/movimientos/api/movimientos.php',
                        {"function": "save", "params": JSON.stringify(params)},
                        {cache: true})
                        .success(function (data) {
                            results(callback, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                };


                function error(data) {
                    toastr.error('Error: ' + data, '');
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data) {
                    if (data.Error === undefined) {
                        toastr.success('Guardado con éxito.', '');
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
