'use strict';

angular.module('SSO.usersetup')
    .factory('usuService', ['$http', '$q', 'urlService', function($http, $q, urlService) {

        var securityQuestions = null;
        var deferred = $q.defer();

        return {

            loadUSUConfig: function(){
                return $http.get(urlService.getURL('USUconfig'));
//                return $http.get('views/user-setup/configs/usu.config.json');
            },

            loadUSUSuccessConfig: function(){
                return $http.get(urlService.getURL('USUsuccessconfig'));
            },


//            getUserProfile: function(SQToken, directive){
            getUserProfile: function(SQtoken){

                return $http.get(urlService.getURL('USU'), {
                 headers: {
                    'SQtoken': SQtoken
                 }});
            },

            postUserSetupAnswers: function(answers, backURL){

            //    return $http.put(urlService.getURL('USUpost'), answers, {
                return $http.post(urlService.getURL('USUpost'), answers, {
	               headers: {
	                 'X-CSRF-CUSTOM-TOKEN':'SomeRandomValue',
    			     'backUrl': backURL
    	           }
                });

//                return $http.post('views/user-setup/configs/POSTuserSetupRequest', answers);

            }

        };
    }]);
