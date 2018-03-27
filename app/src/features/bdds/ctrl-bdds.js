
angular.module('blerter.controllers')

    .controller('CtrlBDDs',
    function ($scope, $log, $spinner, $constants) {

        var logMsgPrefix = "CtrlBDDs -> ";
        $log.debug(logMsgPrefix + ' created');
        $scope.event = {};
        $scope.spinner = $spinner;
        $scope.data = [];
        $scope.data.push({
            src: "TODO",
            name: 'Asset',
            interval: 50,
            id: $constants.uuid(),
            didComplete: false,
            show: false
        });

    });

