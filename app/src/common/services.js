'use strict';

angular.module('blerter.services', [])

    .factory('$constants',['$log',function($log){

        var logMsgPrefix='$constants -> ';
        $log.debug(logMsgPrefix + ' created');


        var $constants = {
            context: {
                api: 'api',
                server: 'server',
                nodeDaemon: 'nodeDaemon',
                esQuery: 'esQuery',
                esIndexes: 'esIndexes',
                redis: 'redis',
                indexing: 'indexing',
                company: 'company',
                limit: 2000
            }
        };

        $constants.uuid = function uuid() {
            var _s4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' +
                _s4() + '-' + _s4() + _s4() + _s4();
        };

        return $constants;

    }])

    .factory('$spinner', ['$log', function ($log) {
        var logMsgPrefix='$spinner -> ';
        $log.debug(logMsgPrefix + ' created');

        var $spinner = {};

        $spinner.register = function (data) {
            if (!data.hasOwnProperty('name')) {
                throw new Error("Spinner must specify a name when registering with the spinner service.");
            }
            $spinner[data.name] = data;
        };

        $spinner.unregister = function (name) {
            if ($spinner.hasOwnProperty(name)) {
                delete $spinner[name];
            }
        };

        $spinner.unregisterGroup = function (group) {
            for (var name in $spinner) {
                if ($spinner[name].group === group) {
                    delete $spinner[name];
                }
            }
        };

        $spinner.unregisterAll = function () {
            for (var name in $spinner) {
                delete $spinner[name];
            }
        };

        $spinner.show = function (name) {
            var spinner = $spinner[name];
            if (!spinner) {
                throw new Error("No spinner named '" + name + "' is registered.");
            }
            spinner.show();
        };

        $spinner.hide = function (name) {
            var spinner = $spinner[name];
            if (!spinner) {
                throw new Error("No spinner named '" + name + "' is registered.");
            }
            spinner.hide();
        };

        $spinner.showGroup = function (group) {
            var groupExists = false;
            for (var name in $spinner) {
                var spinner = $spinner[name];
                if (spinner.group === group) {
                    spinner.show();
                    groupExists = true;
                }
            }
            if (!groupExists) {
                throw new Error("No $spinner found with group '" + group + "'.")
            }
        };

        $spinner.hideGroup = function (group) {
            var groupExists = false;
            for (var name in $spinner) {
                var spinner = $spinner[name];
                if (spinner.group === group) {
                    spinner.hide();
                    groupExists = true;
                }
            }
            if (!groupExists) {
                throw new Error("No $spinner found with group '" + group + "'.")
            }
        };

        $spinner.showAll = function () {
            for (var name in $spinner) {
                $spinner[name].show();
            }
        };

        $spinner.hideAll = function () {
            for (var name in $spinner) {
                $spinner[name].hide();
            }
        };

        return $spinner;

    }]);









