"use strict"
var app = angular.module("SSO.url");

app.controller("urlController",["$scope","$stateParams","$state", "urlService", function($scope, $stateParams, $state, urlService){

    var directive;
    $scope.currentYear = new Date().getUTCFullYear();

    urlService.loadURLs().then(function(response){

        $scope.logoutURL = "/logout?end_url=" + urlService.getDefaultURL();
        console.log("urls loaded");
    }, function(e){
        
        if(e.status == undefined){
            window.location.href = urlService.getLogoutURL("statuspage") + "?status_code=" + e.status;
        }
        else{
            window.location.href = urlService.getLogoutURL("statuspage") + "?status_code=" + e.message;
        }
    });

    console.log("should be here twice");
    var origin = document.URL;

    var sample = "http://login.worldpay.com?resource_url=http%3A%2F%2Fmybusiness.worldpay.com";
    var sample2 = "http://ukdc2-tc-g1wxs08.wpds.worldpaytd.local:7777/sso/index.html?backUrl=http%3A%2F%2Fmybusiness.wpds.worldpaytd.local%3A7778%2Fmbd.html";
    //TODO possibly change this to only resourceURL (end_url)
    if(origin == ""){
        origin = sample2;
    }
    urlService.storeOrigin(origin);

}]);