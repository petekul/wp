(function () {
    'use strict';
angular.module("SSO.securityquestions")
    .factory("SQService", ["$http", "$q", "urlService", function($http, $q, urlService) {

        var scm = $(".scm").attr("class").split(" ")[1];

        return {
            getSecurityQuestions: function(directive, backUrl){
                return $http.get("https://api.github.com/repos/petekul/wp/contents/package.json");
            },

            loadSQConfig: function(){
                return $http.get(urlService.getURL("SQconfig"));
            },

            postAnswers: function(answers, backUrl){
                return $http.post(urlService.getURL(scm + "SQpost"), answers, {
	               headers: {
    			     "X-CSRF-CUSTOM-TOKEN":"SomeRandomValue",
			         "backUrl": backUrl
    	           }
                });
            },

            mockPostAnswers: function(answers){
                //TODO post answers

                return $http.post("views/security-questions/configs/postSQAPIresponse.json");
            }
        };
    }]);
}());
