(function () {
    'use strict';
angular.module('SSO.statuspage', ['ui.router', 'SSO.url'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            //LANDING PAGE
            .state('status', {
                url:'/',
                views: {
                    "header": {
                        templateUrl : 'templates/header.html'
                    },
                    "content": {
                        templateUrl : 'templates/status-page.tmpl.html'
                    },
                    "footer": {
                        templateUrl : 'templates/footer.html'
                    }
                },
                onEnter: ['$window', function($window){$window.document.title = " | Worldpay Account"; }]
            })

            //ROUTE TO SUCCESS PAGE AFTER CNPW COMPLETE
            .state('status.setupsuccessEmail', {
                views: {
                    'content@': {
                        templateUrl : 'templates/ssEmail.tmpl.html'
                    }
                },
                params: {
                    'statusmsg':'',
                },
                onEnter: ['$window', function($window){$window.document.title = "Update your account | Worldpay Account";}]
            });

//    $urlRouterProvider.otherwise('/');
        $urlRouterProvider.otherwise(function($injector, $location){
            $injector.invoke(['$state', function($state) {
                $state.go('status');
            }]);
        });

    }]);
}());
