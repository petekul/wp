/*jshint sub:true*/
(function() {
    'use strict';

angular.module('SSO.choosenewpassword',['ui.router', 'ngMaterial', 'ngMessages', 'SSO.url', 'SSO.resetpassword', 'SSO.sessionIdle'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            //LANDING PAGE
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'templates/header.html'
                    },
                    'content': {
                        templateUrl : 'templates/choosenewpassword.html'
                    },
                    'footer': {
                        templateUrl : 'templates/footer.html'
                    }
                },
                onEnter: ['$window', function($window){$window.document.title = "Choose new password | Worldpay Account"; }]
            });

//    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function($injector, $location){
      $injector.invoke(['$state', function($state) {
        $state.go('app');
      }]);
    });

    }]);
}());