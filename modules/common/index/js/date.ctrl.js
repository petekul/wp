(function() {
    'use strict';
    var app = angular.module("SSO.url");
    app.controller('dateController', function($scope) {
      $scope.getCurrentYear = function() {
        var currentYear = new Date();
        return currentYear.getFullYear();
      }
    });
})();