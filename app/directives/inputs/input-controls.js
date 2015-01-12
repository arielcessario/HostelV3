(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name 13App.directive:tabs
     * @description
     * # tabs
     */
    var app = angular.module('input-controls', [
        'ngMessages']);

    app.directive('inputControl', function () {
        return {
            restrict: 'E',
            scope: {
                controlForm: '=',
                controlType: '=',
                controlName: '=',
                controlPlaceholder: '@',
                controlValidate: '=',
                controlInline: '=',
                controlModel: '=',
                controlLabel: '@'
            },
            //templateUrl: './views/input-control.html',
            template:'',
            // '<div class="field">' +
            //'<input type="' + $scope.controlName + '"' +
            //'name="{{inputCtrl.name}}"' +
            //'minlength="5"' +
            //'maxlength="100"' +
            //'ng-model="myEmail"' +
            //'required' +
            //'ng-class="{\'ng-invalid\':(controlForm.myEmail.$invalid && controlForm.myEmail.$dirty),' +
            //'\'ng-clear\':(controlForm.myEmail.$pristine)}"' +
            //'placeholder="Email"' +
            //'alt="Email"' +
            //'title="Email" />' +
            //'<div ng-messages="controlForm.myEmail.$error"' +
            //'ng-if="controlForm.myEmail.$dirty && controlForm.myEmail.$invalid"' +
            //'class="messages">' +
            //'<div ng-if="controlForm.myEmail.$error.required">' +
            //'You forgot to enter your email address...' +
            //'</div>' +
            //'<div ng-if="controlForm.myEmail.$error.email">' +
            //'You did not enter your email address correctly...' +
            //'</div>' +
            //'</div>' +
            //'{{controlForm.myEmail.$error}}' +
            //'{{inputCtrl.type}}' +
            //' </div>',
            controller: function ($scope, $compile, $http) {
                this.type = 'email';
                this.name = 'myEmail2';
                this.class = 'ng-invalid';

            },
            compile: function(element, attributes) {

                var model = '';
                var label = '';

                if(attributes.controlModel!== undefined){
                    model = '           ng-model="' + attributes.controlModel + '" ';
                }else{

                    model = '           ng-model="' + attributes.controlName + '" ';
                }

                if(attributes.controlLabel!== undefined){
                    label = attributes.controlLabel;
                }else{

                    label = '';
                }




                //console.log(attributes);
                    element.html(
                        '<div class="field"> ' +
                        '<span for="'+attributes.controlName+'" class="label-input-control">'+label+'</label>' +
                        '   <input type="' + attributes.controlType + '" ' +
                                    'name="' + attributes.controlName + '" ' +
                        '           ng-minlength="1" ' +
                        '           ng-maxlength="100" ' +
                        model +
                        '           required ' +
                        '           ng-class="{\'ng-invalid\':(' + attributes.controlForm + '.' + attributes.controlName + '.$invalid ' +
                        '               && ' + attributes.controlForm + '.' + attributes.controlName + '.$dirty ), ' +
                        '               \'ng-clear\':(' + attributes.controlForm + '.' + attributes.controlName + '.$pristine)}" ' +
                        '           placeholder="' + attributes.controlPlaceholder + '"' +
                        '           alt="' + attributes.controlPlaceholder + '"' +
                        '           title="' + attributes.controlPlaceholder + '" />' +
                        '' +
                        '   <div ng-messages="' + attributes.controlForm + '.' + attributes.controlName + '.$error" ' +
                        '           ng-if="' + attributes.controlValidate + '"' +
                        '           class="messages">' +
                        '               <div ng-message="required"  ' +
                        '                   ng-if="' + attributes.controlForm + '.' + attributes.controlName + '.$dirty ' +
                        '                   && ' + attributes.controlForm + '.' + attributes.controlName + '.$invalid" ' +
                        '           > ' +
                        '                   Este campo es obligatorio...' +
                        '               </div>' +
                        '               <div ng-message="email"> ' +
                        '                   El mail ingresado no es correcto...' +
                        '               </div>' +
                        '               <div ng-message="max"> ' +
                        '                   El valor es muy largo...' +
                        '               </div>' +
                        '               <div ng-message="maxlength"> ' +
                        '                   El texto es demasiado largo...' +
                        '               </div>' +
                        '               <div ng-message="min"> ' +
                        '                   El valor ingresado es muy corto...' +
                        '               </div>' +
                        '               <div ng-message="minlength"> ' +
                        '                   El texto es muy corto...' +
                        '               </div>' +
                        '               <div ng-message="number"> ' +
                        '                   El valor ingresado no es un número...' +
                        '               </div>' +
                        '               <div ng-message="pattern"> ' +
                        '                   El patrón está equivocado' +
                        '               </div>' +
                        '               <div ng-message="url"> ' +
                        '                   La dirección es incorrecta' +
                        '               </div>' +
                        '               <div ng-message="date"> ' +
                        '                   The text is too long...' +
                        '               </div>' +
                        '               <div ng-message="datetimelocal"> ' +
                        '                   The text is too long...' +
                        '               </div>' +
                        '               <div ng-message="time"> ' +
                        '                   The text is too long...' +
                        '               </div>' +
                        '               <div ng-message="week"> ' +
                        '                   The text is too long...' +
                        '               </div>' +
                        '               <div ng-message="month"> ' +
                        '                   The text is too long...' +
                        '               </div>' +
                        '   </div>' +
                        '   ' +
                        //'</br></br></br></br>' +
                        //'{{' + attributes.controlForm + '.' + attributes.controlName + '.$error}} ' +
                        //'</br>{{' + attributes.controlForm + '.' + attributes.controlName + '}}' +
                        //'</br>{{' + attributes.controlForm + '.' + attributes.controlName + '.$error.required}} ' +
                        ' </div>'
                    )
            },
            //link: function postLink(scope, element, attrs) {
            //    //console.log(scope);
            //
            //    //element.html("This is the new content: funciona" + scope);
            //
            //    //scope.rootDirectory = 'images/';
            //    //element.html('<div>renglón sin show</div>').show();
            //    element.html($compile(
            //        '<div class="field">' +
            //        '<input type="' + scope.controlName + '"' +
            //        'name="' + scope.controlName + '"' +
            //        'minlength="5"' +
            //        'maxlength="100"' +
            //        'ng-model="myEmail"' +
            //        'required' +
            //        'ng-class="{\'ng-invalid\':(controlForm.' + scope.controlName + '.$invalid && controlForm.' + scope.controlName + '.$dirty),' +
            //        '\'ng-clear\':(controlForm.' + scope.controlName + '.$pristine)}"' +
            //        'placeholder="Email"' +
            //        'alt="Email"' +
            //        'title="Email" />' +
            //        '<div ng-messages="controlForm.' + scope.controlName + '.$error"' +
            //        'ng-if="controlForm.' + scope.controlName + '.$dirty && controlForm.' + scope.controlName + '.$invalid"' +
            //        'class="messages">' +
            //        '<div ng-if="controlForm.' + scope.controlName + '.$error.required">' +
            //        'You forgot to enter your email address...' +
            //        '</div>' +
            //        '<div ng-if="controlForm.' + scope.controlName + '.$error.email">' +
            //        'You did not enter your email address correctly...' +
            //        '</div>' +
            //        '</div>' +
            //        '{{controlForm.' + scope.controlName + '.$error}}' +
            //        '{{inputCtrl.type}}' +
            //        ' </div>'
            //    ))
            //    //.show();
            //    //
            //    //$compile(element.contents())(scope);
            //  //element.text(
            //  //
            //  //);
            //},
            controllerAs: 'inputCtrl'
        };
    });

})()
