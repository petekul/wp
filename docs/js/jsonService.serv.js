(function () {
    'use strict';
angular.module("app")
    .factory("jsonService", ["$http", "$q", function($http, $q) {

        var alertjson = {};
        var updatedjson = {};
        var sha = "";
        var filename = "";

        return {
            getJSON: function(filename){
                return $http.get("https://api.github.com/repos/petekul/wp/contents/" + filename);
            },
            postJSON: function(filename, json){
                return $http.put("https://api.github.com/repos/petekul/wp/contents/" + filename, json);
            },
            setOriginalJSON: function(json){
                alertjson = json;
            },
            getOriginalJSON: function(){
                return alertjson;
            },
            setUpdatedJSON: function(json){
                updatedjson = json;
            },
            getUpdatedJSON: function(){
                return updatedjson;
            },
            setFilename: function(filenamestr){
                filename = filenamestr;
            },
            getFilename: function(){
                return filename;
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
