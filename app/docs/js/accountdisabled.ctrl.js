var app = angular.module("SSO.securityquestions");

app.controller("accDisabledController",["$scope","$stateParams", "$state", "urlService", function($scope, $stateParams, $state, urlService){


    $scope.validateInput = function() {
        //TODO REDIRECT BACK TO WHERE?
        document.location.href = urlService.getLogoutURL();

    };

}]);
