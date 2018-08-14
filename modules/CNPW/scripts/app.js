
'use strict';

angular.module('SSO.choosenewpassword',['ui.router', 'ngMaterial', 'ngMessages', 'SSO.url', 'SSO.resetpassword', 'SSO.sessionIdle'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            //LANDING PAGE
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/choose-new-password/choosenewpassword.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                },
                onEnter: function($window){$window.document.title = "Choose new password | Worldpay Account"; }
            })

            //ROUTE TO SUCCESS PAGE AFTER CNPW COMPLETE
            .state('app.cnpwstatus', {
                views: {
                    'content@': {
                        templateUrl : 'views/status-pages/statuspage.html'
                    }
                },
                params: {
                    'statusmsg':'',
                },
                onEnter: function($window){$window.document.title = "Password changed | Worldpay Account";}
            })
            
            //ROUTE TO ERROR PAGES
            .state('app.error', {
                views: {
                    'content@': {
                        templateUrl : 'views/error-pages/errorpage.html'
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

    });
