
'use strict';

angular.module('SSO.manageaccount',['ui.router', 'ngMaterial', 'ngMessages', 'SSO.url', 'SSO.resetpassword', 'SSO.sessionIdle'])
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
                        templateUrl : 'views/manage-account/manageaccount.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                },
                onEnter: function($window){$window.document.title = "Manage Account | Worldpay Account"; }
            })

//    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function($injector, $location){
      $injector.invoke(['$state', function($state) {
        $state.go('app');
      }]);
    });

    });
