'use strict';

angular.module('blerter.services')

  .factory('$localDataStorage', ['$q', '$log',function($q,$log){

    var logMsgPrefix = '$localDataStorage ->';
    $log.debug(logMsgPrefix + ' created');

    var $localDataStorage = {};

    /**
     * save the object
     * @param key the object key
     * @param obj the object
     * @returns {boolean} the true/false
     */
    $localDataStorage.saveObj = function(key, obj){


      var deferred = $q.defer();
      try {
        localStorage.setItem(key, JSON.stringify(obj));
        deferred.resolve(true);
      }
      catch(e) {
        deferred.resolve(false);
      }

      return deferred.promise;
    };


    /**
     * get the object
     * @param key the object key
     * @returns {object} the object
     */
    $localDataStorage.loadObj = function(key){

      var deferred = $q.defer();
      try {
        var value = localStorage.getItem(key);
        deferred.resolve(value !==undefined ? JSON.parse(value) : null);
      }
      catch(e) {
        deferred.resolve(null);
      }
      return deferred.promise;
    };

    /**
     * delete  the object
     * @param key the object key
     * @returns {boolean} the true/false
     */
    $localDataStorage.deleteObj = function(key){
      var deferred = $q.defer();
      try {
        localStorage.removeItem(key);
        deferred.resolve(true);
      }
      catch(e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };

    return $localDataStorage;

  }]);
