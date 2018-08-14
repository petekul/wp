/*jshint sub:true*/
(function() {
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
})();