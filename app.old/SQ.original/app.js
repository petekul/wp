
"use strict";
console.log("app start?");
angular.module("SSO.securityquestions",["ui.router", "SSO.url", "SSO.sessionIdle"])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            //LANDING PAGE
            .state("app", {
                url:"/",
                views: {
                    "header": {
                        templateUrl: "../common/index/templates/header.html"
                    },
                    "content": {
                        templateUrl: "templates/securityquestions.html"
                    },
                    "footer": {
                        templateUrl: "../common/index/templates/footer.html"
                    }
                },
                onEnter: function($window){
                    $window.document.title = "For your security | Worldpay Account";
                }
            })

            .state("app.accountdisabled", {
                views: {
                    "content@": {
                        templateUrl: "accountdisabled.html"
                    }
                },
                onEnter: function($window){
                    $window.document.title = "Account disabled | Worldpay Account";
                }
            });


//    $urlRouterProvider.otherwise("/");
        $urlRouterProvider.otherwise(function($injector, $location){
            $injector.invoke(["$state", function($state) {
                $state.go("app");
            }]);
        });

    }]);
