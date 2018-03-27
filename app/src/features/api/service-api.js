'use strict';

angular.module('blerter.services')

    .factory('$api',['$log', '$http', '$q', '$rootScope', '$cookieStore', function($log, $http, $q, $rootScope, $cookieStore){

        var $api = {};
        $api.data = {
            server: {
                _1:[],
                _2:[]
            },
            team:{},
            tools:[],
            loaded: false
        };

        var logMsgPrefix='$api -> ';

        $api.getTools = function() {
            var defer = $q.defer();
            var url = 'doc/tools.json';
            $http.get(url,{})
                .then(function(response) {
                    $log.debug(logMsgPrefix + JSON.stringify(response));
                    if (response.status == 200) {
                        $api.data.tools = response.data;
                        defer.resolve(true);
                    } else {
                        defer.resolve(false);
                    }
                })
            return defer.promise;
        };

        $api.getTeam = function() {
            var defer = $q.defer();
            var url = 'doc/team.json';
            $http.get(url, {})
                .then(function(response) {
                    $log.debug(logMsgPrefix + JSON.stringify(response));
                    if (response.status == 200) {
                        $api.data.team = response.data;
                        defer.resolve(true);
                    } else {
                        defer.resolve(false);
                    }
                })
            return defer.promise;
        };

        $api.authentication = function(url, username, password) {
            var defer = $q.defer();

            username = calcSHA1(calcMD5(username));
            password = calcSHA1(calcMD5(password));

            url = '/TODO/authentication?username=' + username + '&password=' + password;
            $http.get(url, {})
                .then(function(response) {
                    if (response.status == 200) {
                        defer.resolve(true);
                    } else {
                        defer.resolve(false);
                    }

                });
            //defer.resolve(true);
            return defer.promise;
        };


        $api.resetAuthentication = function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        $api.setAuthenticationCredentials = function (username, password) {
            username = calcSHA1(calcMD5(username));
            password = calcSHA1(calcMD5(password));
            var authdata = base64encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $cookieStore.put('globals', $rootScope.globals);
        };
        return $api;

    }]);








