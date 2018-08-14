var app = angular.module("SSO.url", ["ui.router"]);


(function() {
'use strict';
var app = angular.module("SSO.url");

app.controller("urlController",["$scope","$stateParams","$state", "urlService", function($scope, $stateParams, $state, urlService){

    var directive;
    $scope.currentYear = new Date().getUTCFullYear();

    urlService.loadURLs().then(function(response){

        $scope.logoutURL = "/logout?end_url=" + urlService.getDefaultURL();
        
    }, function(e){
        
        if(e.status == undefined){
            window.location.href = urlService.getLogoutURL("statuspage") + "?status_code=" + e.status;
        }
        else{
            window.location.href = urlService.getLogoutURL("statuspage") + "?status_code=" + e.message;
        }
    });

    
    var origin = document.URL;

    var sample = "http://login.worldpay.com?resource_url=http%3A%2F%2Fmybusiness.worldpay.com";
    var sample2 = "http://ukdc2-tc-g1wxs08.wpds.worldpaytd.local:7777/sso/index.html?backUrl=http%3A%2F%2Fmybusiness.wpds.worldpaytd.local%3A7778%2Fmbd.html";
    //TODO possibly change this to only resourceURL (end_url)
    if(origin == ""){
        origin = sample2;
    }
    urlService.storeOrigin(origin);

}]);
})();(function() {
'use strict';

angular.module("SSO.url").service("urlService", ["$http", "$q", function($http, $q) {

  var testmode = true;
  var deferred = $q.defer();
  var urls = {};
  var env = "";
  var defaultURL = "http://login.worldpay.com";
  var origin;
  var decodedURL;



  return {
    loadURLs: function(){

        var getenv = $http.get("/sso/app/common/index/config/environment.json");
        var geturls = $http.get("/sso/app/common/index/config/urls.json");
        
        // var getenv = $http.get("configs/environment.json");
        // var geturls = $http.get("configs/urls.json");

        $q.all([getenv, geturls]).then(function(response){
                env = response[0].data[0].url;
                urls = response[1].data;
                deferred.resolve();
        });

        return deferred.promise;
    },

    getURLs: function(){
        return urls;
    },
    getURL: function(urlName){
        if(testmode && !urlName.includes("config")){
            urlName += "test";
        }
        var reqURL = urls.filter(function (x) { return x.urlName === urlName; });
        return reqURL[0].url;
//        return "views/landing-page/urls.json";
    },
    getDefaultURL: function(){
        return urls[0].url;
    },
    getLogoutURL: function(urlName){
        var reqURL = urls.filter(function (x) { return x.urlName === urlName; });
        if(testmode){
            return reqURL[0].url;
        }
        return "/logout?end_url=" + env + reqURL[0].url;
    },
    storeOrigin: function(r){
        origin = r;
        var url = getUrlVars()["backUrl"];
        decodedURL = decodeURIComponent(url);
        // console.log(decodedURL + " has been stored");
    },
    getOrigin: function(){
        return origin;
    },
    getBackURL: function(){
        return decodedURL;
    }
  };

  function getUrlVars() {
      var vars = {};
      var parts = origin.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
      });
      return vars;
  }

}]);
})();(function() {
    'use strict';
    var app = angular.module("SSO.url");
    app.controller('dateController',["$scope", function($scope) {
      $scope.getCurrentYear = function() {
        var currentYear = new Date();
        return currentYear.getFullYear();
      }
    }]);
})();var app = angular.module('SSO.analytics',[]);(function() {
  var initializeGoogleAnalytics = function(gaId){
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', gaId, 'none');
  };

var app = angular.module('SSO.analytics');
  app.factory('analyticsService', ['analyticsConfigService', '$location', '$http', '$timeout', function(analyticsConfigService, $location, $http, $timeout) {
      var track = angular.noop;
      var disabledPaths = [];
      var pageRefresh = true;
      var aConfig = {};
      /**
       * Logs the page change to Force24 tracking system.
       *
       * @param pageName
       */
      analyticsConfigService.loadAnalyticsConfig().then(function(response){
          aConfig = response.data;
          initializeGoogleAnalytics(aConfig.googleAnalyticsID);
      }, function(e){
          //error couldn't get config file
      });



      function f24(pageName) {
          // when page is loaded do not call the f24 tracking because it is automatically called when script is included
          if (pageRefresh) {
              pageRefresh = false;
              // if pageName is populated we do not want to log the state change to f24 (pageName is defined only when
              // the insights / transactions tabs from cardsales page are clicked)
          } else if (!pageName) {
              if (typeof f24_trackPage == 'function') {
                  f24_trackPage(encodeURIComponent(document.location));
              }
          }
      }


      /**
       * Track page/event to google analytics, f24 and usage if needed
       *
       * @param pageName - the page to be tracked
       * @param location - if empty, track to all systems; otherwise track to specific system
       *                 - example: {googleAnalytics: true, f24: false, usage: true}
       *
       */
      track = function (pageName, location) {
          var generateUUID = function(){
              var d = new Date().getTime();
              var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
              });
              return uuid;
          };

          //check for cookie, if not - generate and set one
//          if(angular.isUndefined($cookies.get(gUserCookieId))){
//            //set cookie in this way to force path to be set as /
//            document.cookie=gUserCookieId + '=' + generateUUID() + ';path=/';
//          }

          var path = $location.path();

          if (angular.isDefined(pageName)) {
            // if there is no ending slash and a page name should follow, add it
            if (path.length > 0 && path[path.length - 1] !== '/') {
              path += '/';
            }
            path += pageName;
          }

          if(disabledPaths.indexOf(path) > -1){
            return;
          }

          $timeout(function () {
                  if(allowTracking(location, 'googleAnalytics')) {
                      ga('send', 'pageview', {'page': path});
                  }
                  if(allowTracking(location, 'f24')){
                      f24(pageName);
                  }



          }, 200, false);
        };

        var enableAll = function () {
          disabledPaths = [];
        };
        var disable = function (path) {
          disabledPaths.push(path);
        };

        var allowTracking = function (location, name) {
            return !location || location && location[name];
        };
    return {
        /**
         * Submits a tracking event for the current location path.
         * @param {string} pageName - undefined or the page name that should be added to the location path
         */
        track: track,
        /**
         * Enable all analytics track events to be logged in DB
         */
        enableAll: enableAll,
        /**
         * Disable analytics track event for the path given as parameter for not being logged in DB.
         * @param {string} path - the location path which should be not tracked
         */
        disable: disable
      };
    }]);
})();(function() {
    'use strict';

    angular.module('SSO.analytics').service('analyticsConfigService', function($http, $q) {
      var config;

      return {
        loadAnalyticsConfig: function(){
            return $http.get('views/assets/analytics/config/config.json');
        }
      };

    });
})();