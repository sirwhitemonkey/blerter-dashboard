'use strict';

(function () {

    angular.module('blerter', ['ngSanitize','swaggerUi', 'ui.bootstrap','ui.router','blerter.services', 'blerter.directives',
        'blerter.controllers', 'blerter.filters', 'ngMaterial', 'material.components.expansionPanels', 'ngCookies'])

        .run(function ($log, $window,$q, $api, $rootScope, $urlRouter, $state, $timeout, $http, $cookieStore) {
            var logMsgPrefix = 'app.js -> ';
            $log.debug(logMsgPrefix + ' created');


            // Once the user has logged in, sync the current URL
            // to the router:
            // $urlRouter.sync();

            // Configures $urlRouter's listener *after* your custom listener
            //$urlRouter.listen();

            $timeout(function(){
                $state.go("main",{reload:true});
            }, 500);

            // keep user logged in after page refresh
            // $rootScope.globals = $cookieStore.get('globals') || {};
            // if ($rootScope.globals.currentUser) {
            //    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            //}

            $rootScope.$on('$locationChangeStart',
                function(event, next, prev) {
                    $log.debug(logMsgPrefix + " $locationChangeStart");

                    // redirect to login page if not logged in
                    // if (!$rootScope.globals.currentUser) {
                    //    $rootScope.$broadcast("AUTHENTICATION_REQUIRED");
                    // }

                });

            var windowElement = angular.element($window);
            windowElement.on('beforeunload', function (event) {
                $log.debug(logMsgPrefix + ' beforeUnload');
                //After this will prevent reload or navigating away.
                event.preventDefault();
            });

        })

        .config(function ($stateProvider, $urlRouterProvider, $qProvider) {

            $qProvider.errorOnUnhandledRejections(false);

            // Prevent $urlRouter from automatically intercepting URL changes;
            // this allows you to configure custom behavior in between
            // location changes and route synchronization:
            $urlRouterProvider.deferIntercept();

            $urlRouterProvider.otherwise('/main');
            // use the HTML5 History API
            //$locationProvider.html5Mode(true);

            var logMsgPrefix = "config() ";

            $stateProvider
                .state('main', {
                    url: '/main',
                    templateProvider: function ($templateCache, $http) {
                        var url = 'src/features/main/templates/main.html';
                        return $http.get(url, {cache: $templateCache}).then(function (html) {
                            console.log(logMsgPrefix +  "main.html");
                            return html.data;
                        });
                    },
                    controller: 'CtrlMain',
                    resolve: {

                    }
                })
                .state('microservices', {
                    url: '/microservices/:cache',
                    views: {
                        'microservices': {
                            templateProvider: function ($templateCache, $http) {
                                var url = 'src/features/microservices/templates/microservices.html';
                                return $http.get(url, {cache: $templateCache}).then(function (html) {
                                    console.log(logMsgPrefix +  "microservices.html");
                                    return html.data;
                                });
                            },
                            controller: 'CtrlMicroServices',
                            resolve: {

                            }
                        }
                    }
                })
                .state('bdds', {
                    url: '/bdds/:cache',
                    views: {
                        'bdds': {
                            templateProvider: function ($templateCache, $http) {
                                var url = 'src/features/bdds/templates/bdds.html';
                                return $http.get(url, {cache: $templateCache}).then(function (html) {
                                    console.log(logMsgPrefix +  "bdds.html");
                                    return html.data;
                                });
                            },
                            controller: 'CtrlBDDs',
                            resolve: {

                            }
                        }
                    }

                });

        });

})();

















