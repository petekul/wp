'use strict';

angular.module('SSO.manageaccount')
    .factory('maService', ['$http', '$q', 'urlService', function($http, $q, urlService){

        return {

            postDetails: function(details){
                return $http.post(urlService.getURL('maSaveDetails'), details, {
                // return $http.post(urlService.getURL('cnpwPost'), answers, {
	               headers: {
    			     'X-CSRF-CUSTOM-TOKEN':'SomeRandomValue'
    	           }
                });
            },
            postEmail: function(emails){
                // emails.oldEmail || emails.newEmail
                return $http.post(urlService.getURL('maSaveEmail'), emails, {
                // return $http.post(urlService.getURL('cnpwPost'), answers, {
	               headers: {
    			     'X-CSRF-CUSTOM-TOKEN':'SomeRandomValue'
    	           }
                });
            },
            postPassword: function(passwords){
                // passwords.oldPassword || passwords.newPassword 
                return $http.post(urlService.getURL('maSavePassword'), passwords, {
                // return $http.post(urlService.getURL('cnpwPost'), answers, {
	               headers: {
    			     'X-CSRF-CUSTOM-TOKEN':'SomeRandomValue'
    	           }
                });
            }

        };
    }]);
