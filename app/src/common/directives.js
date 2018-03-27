'use strict';

(function () {

  angular.module('blerter.directives', [])

      .directive('customFrame', function($timeout, $sce, $log){
        var logMsgPrefix = "frame -> ";

        return {
          restrict: 'E',
          template: '<iframe ng-show="show" frame-dimension size-distance="80" ng-src="{{trustedUrl}}"></iframe>',
          scope: {
            id: '@',
            url: '=',
            path: '@',
            loadInterval: '@',
            didComplete: '=',
            sessionId: '=',
            source: '='
          },
          link: function($scope, element){

            var _load = function() {
              $scope.show = false;
              $timeout(function() {

                if ($scope.url === undefined) {
                  return;
                }

                var unsecuredUrl = $scope.url + (($scope.path !== undefined) ? $scope.path : '');

                if ($scope.sessionId !== undefined && $scope.sessionId !== '') {
                  if (unsecuredUrl.indexOf("?") == -1) {
                    unsecuredUrl = unsecuredUrl + "?sessionId=" + $scope.sessionId;
                  } else {
                    unsecuredUrl = unsecuredUrl + "&sessionId=" + $scope.sessionId;
                  }

                }
                $scope.trustedUrl = $sce.trustAsResourceUrl(unsecuredUrl);
                $log.debug(logMsgPrefix + " iframe started:" + $scope.url);

                $timeout(function() {
                  $scope.didComplete = true;
                  $scope.show = true;
                }, $scope.loadInterval * 30);

              }, $scope.loadInterval);
            };

            $scope.$watch('sessionId', function(){
              _load();
            });

          }
        }})

      .directive('frameDimension', function($interval, $timeout){
        return {
          restrict: 'A',
          scope: {
            sizeDistance: '@'
          },
          link: function($scope, element){
            var interval;

            var win = angular.element(window);
            var _resize = function() {
              $timeout(function() {
                var size = parseInt($scope.sizeDistance);
                var height = (window.innerHeight - size) + 'px';
                var width = '100%';
                element.css('width', width);
                element.css('height', height);
              }, 50);
            };

            win.on('resize', function (event) {
              $interval.cancel(interval);
              interval = $interval(function () {
                _resize();
              }, 50);
            });

            _resize();

          }
        }})

      .directive('loader', function(){
        return {
          restrict: 'E',
          template: '<spinner name="{{name}}" img-src="images/spin.gif"></spinner>',
          scope: {
            name: '@',
            didComplete: '=',
            $spinner: '='
          },
          link: function($scope, element){

            $scope.$watch('didComplete', function(){
              if (!$scope.didComplete) {
                $scope.$spinner.show($scope.name);

              } else {
                $scope.$spinner.hide($scope.name);
              }

            });
          }
        }})

      .directive('spinner', function () {
        return {
          restrict: 'EA',
          replace: true,
          transclude: true,
          scope: {
            name: '@?',
            group: '@?',
            show: '=?',
            imgSrc: '@?',
            register: '@?',
            onLoaded: '&?',
            onShow: '&?',
            onHide: '&?'
          },
          template: [
            '<div ng-show="show">',
            '  <img ng-if="imgSrc" ng-src="{{imgSrc}}" />',
            '  <ng-transclude></ng-transclude>',
            '</div>'
          ].join(''),
          controller: function ($scope, $spinner) {

            // register should be true by default if not specified.
            if (!$scope.hasOwnProperty('register')) {
              $scope.register = true;
            } else {
              $scope.register = $scope.register.toLowerCase() === 'false' ? false : true;
            }

            // Declare a mini-API to hand off to our service so the service
            // doesn't have a direct reference to this directive's scope.
            var api = {
              name: $scope.name,
              group: $scope.group,
              show: function () {
                $scope.show = true;
              },
              hide: function () {
                $scope.show = false;
              },
              toggle: function () {
                $scope.show = !$scope.show;
              }
            };

            // Register this spinner with the spinner service.
            if ($scope.register === true) {
              $spinner.register(api);
            }

            // If an onShow or onHide expression was provided, register a watcher
            // that will fire the relevant expression when show's value changes.
            if ($scope.onShow || $scope.onHide) {
              $scope.$watch('show', function (show) {
                if (show && $scope.onShow) {
                  $scope.onShow({ $spinner: $spinner, api: api });
                } else if (!show && $scope.onHide) {
                  $scope.onHide({ $spinner: $spinner, api: api });
                }
              });
            }

            // This spinner is good to go. Fire the onLoaded expression.
            if ($scope.onLoaded) {
              $scope.onLoaded({ spinner: $spinner, api: api });
            }
          }
        };
      })
      .directive('cacheView',
      function($http,   $templateCache,   $state, $anchorScroll, $compile, $controller, $timeout, $window) {

        var viewCache = {};

        return {
          restrict: 'ECA',
          terminal: true,
          link: function(scope, element, attr) {
            var lastScope,
                loadedScopes = [];

            scope.$on('$stateChangeSuccess', update);
            update();

            //listener when logout has been called
            scope.$on('cacheView:clearCachedViews', function() {
              //completely clear the cached views
              clearContent();
            });

            function destroyLastScope() {
              if (lastScope) {
                lastScope.$destroy();
                lastScope = null;
              }
              loadedScopes.forEach(function(scope){
                scope.$destroy();
              });
              loadedScopes = [];
            }

            function clearContent() {
              element.html('');
              destroyLastScope();
            }

            function update() {
              var locals = $state.$current && $state.$current.locals,
                  template = locals && locals['@'] && locals['@'].$template,
                  templateUrl = $state.current && $state.current.name,
                  reloadView = $state.reload || function(){return false;};

              if (template) {

                var templateUrlAttr = "templateUrl='" + templateUrl + "'",
                    newView = element.find("[" + templateUrlAttr + "]"),
                    createNewView = false;

                //get the last scope
                lastScope = newView.children().data('$scope');

                if(newView.length === 1){
                  var previousRouteParams = newView.children().data('$ngRoute_Params');
                  if(reloadView(previousRouteParams, $state.current.params) || (lastScope.reloadView && lastScope.reloadView())){
                    //clean up previous view and load again
                    newView.detach();

                    //clean up previous controller
                    destroyLastScope();

                    createNewView = true;
                  }
                }
                else{
                  createNewView = true;
                }

                if(createNewView){
                  //no previous state of the view found
                  //create a new state for the view into the DOM

                  console.log('mbView - creating a new view for templateUrl: ' + templateUrl);

                  //create the new view
                  element.append("<div class='mb-view-content' " + templateUrlAttr + "></div>");
                  newView = element.find("[" + templateUrlAttr + "]");
                  newView.html(template);

                  //compile the contents of the view
                  var link = $compile(newView.contents()),
                      current = $state.current,
                      controller;

                  //store the ngRoute_Params
                  newView.children().data('$ngRoute_Params', $state.current.params);

                  lastScope = current.scope = scope.$new();
                  if(current.controller) {
                    //create a new controller
                    locals.$scope = lastScope;
                    controller = $controller(current.controller, locals);
                    newView.children().data('$ngControllerController', controller);
                  }

                  link(lastScope);
                  lastScope = current.scope = newView.children().data('$scope');

                  //lastScope.$emit('$viewContentLoaded');
                  loadedScopes.push(lastScope);

                }
                else{

                  console.log('DEBUG: mbView - view already cached in the DOM for templateUrl: ' + templateUrl);
                  if(lastScope){
                    //fire an event on the lastScope
                    //lastScope.$emit('mbView:viewDisplayedFromCache');
                  }

                }

                newView.css('display', "");
                //make sure the new view is visible
                $timeout(function() {

                  newView.addClass('transition-in');

                  //adjust back the scroll
                  var $windowScrollPosition = newView.data('$windowScrollPosition') || {scrollX:0, scrollY:0};
                  $window.scrollTo($windowScrollPosition.scrollX, $windowScrollPosition.scrollY);

                });

                //grab the current view displayed
                var previous = element.find('.mb-view-content.current');
                //store window scroll position for the view
                previous.data('$windowScrollPosition', {scrollX:$window.scrollX || 0, scrollY:$window.scrollY});

                //hide the previous view
                previous.removeClass('transition-in');
                previous.css('display', 'none');

                //mark the scope as off-screen
                var previousScope = previous.children().data('$scope');
                if(previousScope){
                  disableDigestOnScope(previousScope);
                }

                enableDigestOnScope(lastScope);

                //update the class on the views
                previous.removeClass('current');
                newView.addClass('current');

              }
              else {
                clearContent();
              }
            }

            function disableDigestOnScope(target){

              //Traverse logic copied from angular digest function.

              var next = null,
                  current = target;

              //do the same on all children
              do {

                //store the $$asyncQueue and $$watchers to put them back again when the scope is enabled
                current.__onhold__$$asyncQueue = current.$$asyncQueue;
                current.__onhold__$$watchers = current.$$watchers;

                current.$$asyncQueue = [];//set an empty array.. which will avoid any processing on this scope while disabled.
                current.$$watchers   = [];//set an empty array.. which will avoid any processing on this scope while disabled.

                // Insanity Warning: scope depth-first traversal
                // yes, this code is a bit crazy, but it works and we have tests to prove it!
                // this piece should be kept in sync with the traversal in $broadcast
                if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
                  while(current !== target && !(next = current.$$nextSibling)) {
                    current = current.$parent;
                  }
                }
              } while ((current = next));
            }

            function enableDigestOnScope(target){

              //Traverse logic copied from angular digest function.

              if (target == undefined) {
                return;
              }

              var next = null,
                  current = target;

              //do the same on all children
              do {

                //put the $$asyncQueue and $$watchers back so the digest will work properly.
                if(current.__onhold__$$asyncQueue){

                  //check if something was added while the scope was disabled
                  //THAT should not happen, so if it does we need to investigate why
                  if(current.$$asyncQueue.length > 0){
                    current.$$asyncQueue.forEach(function(item){
                      current.__onhold__$$asyncQueue.push(item);
                    });
                  }

                  current.$$asyncQueue = current.__onhold__$$asyncQueue;
                  delete current.__onhold__$$asyncQueue;
                }
                if(current.__onhold__$$watchers){

                  //check if something was added while the scope was disabled
                  //THAT should not happen, so if it does we need to investigate why
                  if(current.$$watchers.length > 0){
                    current.$$watchers.forEach(function(item){
                      current.__onhold__$$watchers.push(item);
                    });
                  }

                  current.$$watchers = current.__onhold__$$watchers;
                  delete current.__onhold__$$watchers;
                }

                // Insanity Warning: scope depth-first traversal
                // yes, this code is a bit crazy, but it works and we have tests to prove it!
                // this piece should be kept in sync with the traversal in $broadcast
                if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
                  while(current !== target && !(next = current.$$nextSibling)) {
                    current = current.$parent;
                  }
                }
              } while ((current = next));
            }

          }
        };
      })
      .directive('numeric', function () {
        return {
          require: 'ngModel',
          restrict: 'A',
          link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
              if (val) {
                var digits = val.replace(/[^0-9]/g, '');

                if (digits !== val) {
                  ctrl.$setViewValue(digits);
                  ctrl.$render();
                }
                return parseInt(digits,10);
              }
              return undefined;
            }
            ctrl.$parsers.push(inputValue);
          }
        };
      })
      .directive('autoExpand', function() {
        return function(scope, element, attr){
          var minHeight = element[0].offsetHeight,
              paddingLeft = element.css('paddingLeft'),
              paddingRight = element.css('paddingRight');

          var $shadow = angular.element('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
            fontSize: element.css('fontSize'),
            fontFamily: element.css('fontFamily'),
            lineHeight: element.css('lineHeight'),
            resize:     'none'
          });
          angular.element(document.body).append($shadow);

          var update = function() {
            var times = function(string, number) {
              for (var i = 0, r = ''; i < number; i++) {
                r += string;
              }
              return r;
            }

            var val = element.val().replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>')
                .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' ' });
            $shadow.html(val);

            element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */, minHeight) + 'px');
          }

          element.bind('keyup keydown keypress change', update);
          update();
        }
      });

}());



