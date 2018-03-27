'use strict';

(function () {

  angular.module('blerter.directives')

      .directive('monitor', function($timeout, $sce, $log, $q, $interval, $constants,  $spinner, $http){
        var logMsgPrefix = "monitor -> ";

        return {
          restrict: 'E',
          templateUrl: 'src/features/monitor/templates/monitor.html',
          scope: {
            url: '=',
            loadInterval: '@',
            didComplete: '=',
            sessionId: '=',
            apiToken: '='
          },
          link: function($scope, element){

            $scope.spinner = $spinner;
            $scope.$$constants = $constants;

            $scope.alerts = [];
             $scope.event = {};

            var _loadContexts = function() {
              $scope.redisClients = [];
              $scope.indexingClients = [];
              $scope.contexts = [];
              $scope.apis = [];

              $scope.apis.push({
                src: "/connector-payment-service/api.html",
                name: 'Payment Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });
              $scope.apis.push({
                src: "/connector-catalogue-service/api.html",
                name: 'Catalogue Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });
              $scope.apis.push({
                src: "/connector-correspondence-service/api.html",
                name: 'Correspondence Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });
              $scope.apis.push({
                src: "/connector-shipping-service/api.html",
                name: 'Shipping Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });
              $scope.apis.push({
                src: "/connector-tax-service/api.html",
                name: 'Tax Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });
              $scope.apis.push({
                src: "/connector-loyalty-service/api.html",
                name: 'Loyalty Service',
                interval: 50,
                id: $constants.uuid(),
                didComplete: false,
                refresh: false,
                show: false,
                trustedUrl: '',
                result: [],
                sessionId: $scope.sessionId
              });

            };

            var _load = function() {
              $timeout(function() {
                _.each($scope.contexts, function(context){
                  $scope.event.reload(context);
                });
              }, $scope.loadInterval);
            };

            $scope.event.closeAlert = function(index) {
              $scope.alerts.splice(index, 1);
            };


            $scope.event.reload = function(context) {
              context.sessionId = $constants.uuid();
            };

            $scope.$watch('sessionId', function() {
               _load();
            });

            $scope.$watch('apiToken', function() {
              _loadContexts();
              _load();

            });

            // initialise
            _loadContexts();
            _load();

          }

        }})
}());



