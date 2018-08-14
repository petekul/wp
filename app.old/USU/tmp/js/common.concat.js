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
})();var app = angular.module('SSO.resetpassword',[]);

app.directive('resetPassword', function(){
    return{

        replace:'true',
        scope: {
            passwordTitle:"=",
            passwordSubtitle:"=",
            ngModel:"=",
            ngChange:"&"
//          TODO add ngChange to reset pw && choose new password hope it works
        },
        templateUrl:'/sso/app/common/components/reset-password/templates/resetPassword.tmpl.html',
        link: function(scope, element, attrs) {
            var minFlag, capFlag, numFlag, invalidChars;
            scope.onChange = function(){
                var pass = $('#txtNewPassword').val();
                var confirmPass = $('#txtConfirmPassword').val();
                    //test password length
                if(checkLength(pass)){
                    minFlag=true;
                    showTick($('#tickMin'));
                    $('#criteriaMin').css("color","#919191");
                }
                else{
//                    if($('#tickMin').hasClass('matched')){
                        minFlag=false;
                        hideTick($('#tickMin'));
//                    }
                }
                    //test lower & upper case1
                if(hasLowerCase(pass) & hasUpperCase(pass)){
                    capFlag=true;
                    showTick($('#tickCap'));
                    $('#criteriaCap').css("color","#919191");
                }
                else{
//                    if($('#tickCap').hasClass('matched')){
                        capFlag=false;
                        hideTick($('#tickCap'));
//                    }
                }
                    //test number exists
                if(hasNumber(pass)){
                    numFlag=true;
                    showTick($('#tickNum'));
                    $('#criteriaNum').css("color","#919191");
                }
                else{
//                    if($('#tickNum').hasClass('matched')){
                        numFlag=false;
                        hideTick($('#tickNum'));
//                    }
                }
                    //test symbol exists
                if(hasSymbol(pass)){
                    showTick($('#tickSym'));
                }
                else{
//                    if($('#tickSym').hasClass('matched')){
                        hideTick($('#tickSym'));
//                    }
                }
                    //show validation tick
                if(minFlag && capFlag && numFlag){
                    $('#tickNewPassword').css("display","block");
                    showTick($('#tickNewPassword'));
                }
                else{
                    $('#tickNewPassword').css("display","none");
                    hideTick($('#tickNewPassword'));
                }

                checkInvalidChars();

                if(checkMatching(pass, confirmPass) && minFlag && capFlag && numFlag && validChars && pass != ""){
                    $('#tickConfirmPassword').css("display","block");
                    showTick($('#tickConfirmPassword'));
                    $('#btnContinue').attr("disabled", false);
                    // $('#pwNotMatch').css("display", "none");
                    $('#errorPassword').css("display", "none");
                    // $('#txtConfirmPassword').css("border-color", "rgb(204,204,204)");
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else if(checkMatching(pass, confirmPass)){
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else{
                    $('#tickConfirmPassword').css("display","none");
                    hideTick($('#tickConfirmPassword'));
                    $('#btnContinue').attr("disabled", true);
                    $('#errorPassword').css("display", "none");
                    // if($('#txtConfirmPassword').val().length >= 8){
                        this.pwForm.confirmPass.$setValidity("passwordmatch", false);
                    // }
                }

            }

            function checkInvalidChars(){
            //refine this regex. for invalid password characters
                if($('#txtNewPassword').val() == "" || /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test($('#txtNewPassword').val())){
                    // $('#txtNewPassword').css("border-color", "");
                    $('#invalidCharacters').css("display", "none");
                    validChars = true;
                }
                else{
                    // $('#txtNewPassword').css("border-color", "");
                    $('#invalidCharacters').css("display", "block");
                    $('#tickNewPassword').css("display","none");
                    $('#tickConfirmPassword').css("display","none");
                    validChars = false;
                }
            }

            scope.checkInvalidChars = function(){
            //refine this regex. for invalid password characters
                if($('#txtNewPassword').val() == "" || /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test($('#txtNewPassword').val())){
                    $('#txtNewPassword').css("border-color", "#cccccc");
                    $('#invalidCharacters').css("display", "none");
                    $('#tickConfirmPassword').css("margin-top", "22px");
                    validChars = true;
                }
                else{
                    $('#txtNewPassword').css("border-color", "red");
                    $('#invalidCharacters').css("display", "block");
                    $('#tickNewPassword').css("display","none");
                    $('#tickConfirmPassword').css("display","none");
                    $('#tickConfirmPassword').css("margin-top", "59px");
                    invalidChars = false;
                }
            }

            scope.checkPasswordPolicy = function(pwForm){
                var pass = $('#txtNewPassword').val();
                if(!checkLength(pass))
                    $('#criteriaMin').css("color","red");
                else
                    $('#criteriaMin').css("color","#919191");
                if(!hasLowerCase(pass) || !hasUpperCase(pass))
                    $('#criteriaCap').css("color","red");
                else
                    $('#criteriaCap').css("color","#919191");
                if(!hasNumber(pass))
                    $('#criteriaNum').css("color","red");
                else
                    $('#criteriaNum').css("color","#919191");

                if($('#criteriaMin').css("color") == "rgb(255, 0, 0)" || $('#criteriaCap').css("color") == "rgb(255, 0, 0)" || $('#criteriaNum').css("color") == "rgb(255, 0, 0)"){
                    this.pwForm.newPass.$setValidity("required", false);
                    this.pwForm.confirmPass.$setValidity("required", false);
                }
                else{
                    this.pwForm.newPass.$setValidity("required", true);
                    this.pwForm.confirmPass.$setValidity("required", true);
                    // $('.lblNewPassword').css("color", "");
                    // $('#txtNewPassword').css("border-color", "");
                }
            }

            scope.checkMatching = function(pwForm){
                var pass = $('#txtNewPassword').val();
                var confirmPass = $('#txtConfirmPassword').val();
                if(pass == "" && confirmPass == ""){
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else if(!checkMatching(pass, confirmPass)){
                    // $('#txtConfirmPassword').css("border-color", "");
                    // $('.lblConfirmPassword').css("color", "red");
                    // $('#pwNotMatch').css("display", "block");
                    this.pwForm.confirmPass.$setValidity("passwordmatch", false);
                }
                else{
                    // $('#txtConfirmPassword').css("border-color", "");
                    // $('.lblConfirmPassword').css("color", "");
                    // $('#pwNotMatch').css("display", "none");
                }
            }

            function showTick(el){
                el.removeClass('unmatched');
                el.addClass('matched');
            }
            function hideTick(el){
                el.removeClass('matched');
                el.addClass('unmatched');
            }

            function checkLength(str){
                return str.length >= 8;
            }

            function hasLowerCase(str) {
                return str.toUpperCase() != str;
            }

            function hasUpperCase(str) {
                return str.toLowerCase() != str;
            }
            function hasNumber(str) {
              return /\d/.test(str);
            }
            function hasSymbol(str) {
                return /[!@#$%\^&*(){}[\]<>?/|\-=~`'";:.,]/.test(str);
            }
            function checkMatching(pass1, pass2){
                return (pass1 == pass2);
            }

            //    `~!@#$%^*()_-+={}[]\|/:;"'<>,.?


                //TODO for jasmine tests why must i use this.?
            this.checkLength = checkLength;
            this.hasLowerCase = hasLowerCase;
            this.hasUpperCase = hasUpperCase;
            this.hasNumber = hasNumber;
            this.hasSymbol = hasSymbol;
        }
    }
});

  app.directive("passwordpolicy", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.passwordpolicy = function(modelValue) {
          
          if(!modelValue){
                return true;
          }

          return /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test(modelValue);
        };
      }
    };
  });


  app.directive("passwordmatch", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.passwordmatch = function(modelValue) {
            // if(modelValue){
            //     if(modelValue.length<8){
            //         return true;
            //     }
            // }

            if(!(modelValue == $('#txtNewPassword').val())){
                $('#tickConfirmPassword').css("display","none");
                $('#tickConfirmPassword').removeClass('matched');
                $('#tickConfirmPassword').addClass('unmatched');
            }
            return (modelValue == $('#txtNewPassword').val());
        };
      }
    };
  });
angular.module('SSO.wpDropdown', []).directive('wpDropdown', function(){
    return{

        replace:'true',
        scope: {
            selected:"=",
            options:"=",
            ngChange:"&"
        },
        templateUrl:'/sso/app/common/components/wp-dropdown/templates/wpDropdown.tmpl.html',
        link: function(scope, element, attrs) {

            scope.select = function(name){
                scope.selected = name;
                element.toggleClass('selected');
                $('#cmbTitle').css('color','#393939');
                $('#cmbTitle').find('i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            }
            scope.expand = function(){
                $('#cmbTitle').find('i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            }
        }
    }
});

var app = angular.module('SSO.analytics',[]);(function() {
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
})();var app = angular.module("SSO.sessionIdle", ["SSO.url"]);"use strict"
var app = angular.module("SSO.sessionIdle");

app.directive("sessionIdle", ["idleService", "urlService", function(idleService, urlService){
    return{
        templateUrl:"/sso/modules/common/components/session-idle/templates/sessionIdle.tmpl.html",
        link: function(scope, element, attrs) {

            idleService.loadConfig();

            scope.yes = function(){
                urlService.loadURLs().then(function(response){
                    idleService.startTimer();
                });
            };

            scope.no = function(){
                idleService.logOut();
            };

//            scope.$watch($("#idleModal").is(":hidden"), function () {
//                idleService.startTimer();
//            });

            $("#idleModal").on("hidden.bs.modal", function (e) {
                idleService.startTimer();
                idleService.hideModal();
            });

        }
    };
}]);
"use strict";

angular.module("SSO.sessionIdle").service("idleService", ["$http", "$q", "$state", "urlService", function($http, $q, $state, urlService) {

    var timer = 0;
    var timeoutDuration = 900;
    var deferred = $q.defer();

    var logOut = function(){
        //TODO CHANGE THESE CHANGEME
        window.location.href = urlService.getLogoutURL("statuspage") + "sessiontimeout";
        clearTimer();
    };

    var timeOut = function(){
        var url = urlService.getLogoutURL("statuspage") + "sessiontimeout";
        var separator = (url.indexOf("?")===-1)?"?":"&";
        window.location.href = url + separator + "p_error_code=SSO-1";
        //TODO
    };

    //TODO add timeOut method

    var showModal = function(){
        if($("#idleModal").is(":hidden")){
            $("#idleModal").modal("show");
        }
    };

    var hideModal = function(){
        $(".modal-backdrop").remove();
        $("#idleModal").modal("hide");
    };

    var clearTimer = function(){
        clearInterval(timer);
    };

  return {
    loadConfig: function(){
        $http.get("/sso/modules/common/components/session-idle/idle.conf.json").then(function(response){
            //Set timeout duration in seconds. 15min = "900"
            timeoutDuration = parseFloat(response.data.timeoutDuration);
        });
    },
    startTimer: function(){
        var start = new Date().getTime(),
            elapsed = "0.0";

        clearTimer();
        timer = setInterval(function()
        {
            var time = new Date().getTime() - start;

            elapsed = Math.floor(time / 100) / 10;
            if(Math.round(elapsed) == elapsed) { elapsed += ".0"; }

//            document.title = elapsed;

            if(elapsed > (timeoutDuration - 60)){
                showModal();
                if(elapsed > timeoutDuration){
                    hideModal();
                    window.location.href = urlService.getLogoutURL("statuspage") + "sessiontimeout";
                    clearTimer();
                }
            }

        }, 100);
    },
    logOut: logOut,
    timeOut: timeOut,
    hideModal: hideModal
  };

}]);
