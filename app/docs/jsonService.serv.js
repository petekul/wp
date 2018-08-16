(function () {
    'use strict';
angular.module("app")
    .factory("jsonService", ["$http", "$q", function($http, $q) {

        var alertjson = {};
        var sha = "";

        return {
            getJSON: function(){
                return $http.get("https://api.github.com/repos/petekul/wp/contents/alerts.json");
            },
            postJSON: function(json){
                return $http.put("https://api.github.com/repos/petekul/wp/contents/alerts.json", json);
            },
            setOriginalJSON: function(json){
                alertjson = json;
            },
            getOriginalJSON: function(){
                return alertjson;
            },
            setSha: function(shastr){
                sha = shastr;
            },
            getSha: function(){
                return sha;
            }
        };
        
    }]);
}());
