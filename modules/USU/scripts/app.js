
'use strict';

angular.module('SSO.usersetup',['ui.router', 'ngMaterial', 'ngMessages', 'SSO.url', 'SSO.resetpassword', 'SSO.wpDropdown', 'SSO.sessionIdle'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            //LANDING PAGE
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/user-setup/usersetup.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                },
                params: {
                    'SQToken':'',
                },
                onEnter: function($window){$window.document.title = "Update your account | Worldpay Account"; }
            })

            //ROUTE TO SUCCESSFUL SETUP MESSAGE /W EMAIL
            .state('app.ssemail', {
                views: {
                    'content@': {
                        templateUrl : 'views/user-setup/setup-success/ssEmail.html'
                    }
                },
                params: {
                    'emailContext':true,
                    'useremail':'',
		    'redirectURL':'',
                },
                onEnter: function($window){$window.document.title = "Update your account | Worldpay Account"; }
            })
            //ROUTE TO SUCCESSFUL SETUP MESSAGE w/o EMAIL
            .state('app.ssnonemail', {
                views: {
                    'content@': {
                        templateUrl : 'views/user-setup/setup-success/ssNonEmail.html'
                    }
                },
                params: {
                    'emailContext':false,
                    'useremail':'',
		    'redirectURL':'',
                },
                onEnter: function($window){$window.document.title = "Update your account | Worldpay Account"; }
            })
            
            //ROUTE TO ERROR PAGES
            .state('app.error', {
                views: {
                    'content@': {
                        templateUrl : '../common/error-pages/views/error-pages/errorpage.html'
                    }
                },
                params: {
                    'errormsg':'',
                },
                onEnter: function($window){$window.document.title = "Error | Worldpay Account"; }
            })

//    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function($injector, $location){
      $injector.invoke(['$state', function($state) {
        $state.go('app');
      }]);
    });

    }]);
