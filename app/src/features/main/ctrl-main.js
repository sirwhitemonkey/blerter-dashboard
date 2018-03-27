
angular.module('blerter.controllers')

    .controller('CtrlMain',
    function ($scope, $log, $uibModal, $state, $q, $constants, $window, $mdExpansionPanel, $timeout, $mdSidenav, $spinner, $api) {

        var logMsgPrefix = "CtrlMain -> ";
        $log.debug(logMsgPrefix + ' created');

        $scope.event = {};
        $scope.spinner = $spinner;
        $scope.data = {
            header: 'Prototype',
            view: '',
            isSideLeftLockWhenOpen: true,
            servers: $api.data.server
        };

        var navigationPanel;

        var _isAlreadyOpenPanel = function(panel) {
            if (!navigationPanel) {
                navigationPanel = panel;
                return false;
            } else {
                if (navigationPanel == panel) {
                          return true;
                } else {
                    navigationPanel = panel;
                    return false;
                }
            }
        };

        var _navigatePanel = function(panel, view) {
            $mdExpansionPanel().waitFor(panel)
                .then(function(instance) {
                    if (instance.isOpen()) {
                        $state.go(view,{cache: $constants.uuid()});
                    }
                });
        };

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        var _debounce = function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        var _buildDelayedToggler = function buildDelayedToggler(navID) {
            return _debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        var _buildToggler = function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }
        /*
        $scope.$on("AUTHENTICATION_REQUIRED", function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'src/features/main/templates/login.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'CtrlLogin',
                windowClass: 'center-modal',
                size: "sm",
                resolve: {}
            });

            modalInstance.result.then(function (option) {
                $log.debug(logMsgPrefix + " modal closed");
            });
        });

        $scope.event.testSecurity = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'src/features/main/templates/test-security.html',
                backdrop: 'static',
                keyboard: false,
                controller: 'CtrlTestSecurity',
                windowClass: 'center-modal',
                size: "sm",
                resolve: {}
            });

            modalInstance.result.then(function (option) {
                $log.debug(logMsgPrefix + " modal closed");
            });
        };
        */


        $scope.event.server = function() {
            var panel = "panel1";
            if (_isAlreadyOpenPanel(panel)) {
                return;
            }
            $scope.data.header  = "MicroServices";
            $scope.data.view  = "microservices";
            _navigatePanel(panel, $scope.data.view);

        };

        $scope.event.bdds = function() {
            var panel = "panel1";
            if (_isAlreadyOpenPanel(panel)) {
                return;
            }

            $scope.data.header  = "BDDs";
            $scope.data.view  = "bdds";
            _navigatePanel(panel, $scope.data.view);

        };

        $scope.event.toggleLeftClose = function() {
            $scope.data.isSideLeftLockWhenOpen = !$scope.data.isSideLeftLockWhenOpen;
         };

        $scope.event.toggleLeft = _buildDelayedToggler('left');
        $scope.event.toggleRight = _buildToggler('right');
        $scope.event.isOpenRight = function(){
            return $mdSidenav('right').isOpen();
        };
        $scope.event.isOpenLeft = function(){
            return $mdSidenav('left').isOpen();
        };


    });




