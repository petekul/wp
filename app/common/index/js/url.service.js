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

        var thisurl = document.location.href.split('/');
        var getenv; var geturls;

        if (thisurl.includes('status-pages')){
            getenv = $http.get("../index/config/environment.json");
            geturls = $http.get("../index/config/urls.json");
        } 
        else{
            getenv = $http.get("../common/index/config/environment.json");
            geturls = $http.get("../common/index/config/urls.json");
        }

        // var getenv = $http.get("configs/environment.json");
        // var geturls = $http.get("configs/urls.json");

        $q.all([getenv, geturls]).then(function(response){
            env = response[0].data[0].url;
            urls = response[1].data;
            deferred.resolve();
        }, function(){
            // fail condition. logout & go to error
            //ES5
            var thispage;
            for(var i=0;i<thisurl.length;i++){
                if (thisurl[i].includes('index')){
                    thispage = thisurl[i-1];
                }
            }
            var thisenv= document.location.href.split(thispage);
            window.location.href = "/logout?end_url=" + thisenv[0] + 'common/status-pages/index.html?status_code=configfetch';
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