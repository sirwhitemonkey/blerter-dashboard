
angular.module('blerter.controllers')

    .controller('CtrlLogin',
    function ($scope, $log, $spinner, $constants, $api, $window, $q, $uibModalInstance) {

        var logMsgPrefix = "CtrlLogin -> ";
        $log.debug(logMsgPrefix + ' created');

        $scope.alerts = [];
        $scope.event = {};
        $scope.data = {
            id: $constants.uuid(),
            didComplete: false,
            didSubmitted: false,
            username: '',
            password: ''
        };
        $scope.spinner = $spinner;
        var url = $window.location.protocol + "//" +  $window.location.host;

        // reset
        $api.resetAuthentication();

        $scope.event.login = function() {

            $scope.alerts = [];

            if ($scope.data.username == undefined || ($scope.data.username != undefined && $scope.data.username.trim() == '')) {
                $scope.alerts.push({msg:'Username is  required'});
            }
            if ($scope.data.password == undefined || ($scope.data.password != undefined && $scope.data.password.trim() == '')) {
                $scope.alerts.push({msg:'Password is  required'});
            }

            if ($scope.alerts.length == 0 ) {

                $scope.data.didSubmitted = true;

                $api.authentication(url, $scope.data.username, $scope.data.password)
                    .then(function(response) {
                        if (response) {
                            $api.setAuthenticationCredentials($scope.data.username, $scope.data.password);
                            $uibModalInstance.close(false);
                        } else {
                            $scope.alerts = [];
                            $scope.alerts.push({msg:'Invalid credentials'});
                        }
                        $scope.data.didSubmitted = false;
                        $scope.data.didComplete = true;
                    });
            }
        };

        $scope.event.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    });

