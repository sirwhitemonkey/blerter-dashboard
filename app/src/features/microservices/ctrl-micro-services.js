
angular.module('blerter.controllers')

    .controller('CtrlMicroServices',
    function ($scope, $log, $spinner, $constants, $window) {

        var logMsgPrefix = "CtrlMicroServices -> ";
        $log.debug(logMsgPrefix + ' created');

        $scope.event = {};
        $scope.spinner = $spinner;

        var url = $window.location.protocol + "//" +  $window.location.host;

        $scope.microservices = [
            {
                name: 'Grpc',
                url: url + '/swagger/grpc.json'
            },
            {
                name: 'Rest',
                url: url + '/swagger/rest.json'
            }
        ];


        $scope.errorHandler = function(data, status){
            $log.debug(logMsgPrefix + ' failed to load swagger: '+status);
        };
    });

