(function() {
    'use strict';
angular.module('SSO.usersetup',['ui.router', 'ngMaterial', 'ngMessages', 'SSO.url', 'SSO.resetpassword', 'SSO.wpDropdown', 'SSO.sessionIdle'])
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
                        templateUrl : 'templates/usersetup.html'
                    },
                    'footer': {
                        templateUrl : 'templates/footer.html'
                    }
                },
                params: {
                    'SQToken':'',
                },
                onEnter: ['$window', function($window){$window.document.title = "Update your account | Worldpay Account"; }]
            })

            //ROUTE TO SUCCESSFUL SETUP MESSAGE w/o EMAIL
            .state('app.ssnonemail', {
                views: {
                    'content@': {
                        templateUrl : 'templates/ssNonEmail.html'
                    }
                },
                params: {
                    'emailContext':false,
                    'useremail':'',
                    'redirectURL':'',
                },
                onEnter: ['$window', function($window){$window.document.title = "Update your account | Worldpay Account"; }]
            });

//    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function($injector, $location){
      $injector.invoke(['$state', function($state) {
        $state.go('app');
      }]);
    });

    }]);
}());