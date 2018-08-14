'use strict';

angular.module('SSO.choosenewpassword')
    .factory('cnpwService', ['$http', '$q', 'urlService', function($http, $q, urlService){

        return {

            postPassword: function(answers, SQtoken){
                return $http.put(urlService.getURL('cnpwPost'), answers, {
                // return $http.post(urlService.getURL('cnpwPost'), answers, {
	               headers: {
    			     'X-CSRF-CUSTOM-TOKEN':'SomeRandomValue',
                     'SQtoken': SQtoken
    	           }
                });
            }

        };
    }]);
