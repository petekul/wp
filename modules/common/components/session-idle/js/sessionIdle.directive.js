"use strict"
var app = angular.module("SSO.sessionIdle");

app.directive("sessionIdle", ["idleService", "urlService", function(idleService, urlService){
    return{
        templateUrl:"/sso/modules/common/components/session-idle/templates/sessionIdle.tmpl.html",
        link: function(scope, element, attrs) {

            idleService.loadConfig();

            scope.yes = function(){
                urlService.loadURLs().then(function(response){
                    idleService.startTimer();
                });
            };

            scope.no = function(){
                idleService.logOut();
            };

//            scope.$watch($("#idleModal").is(":hidden"), function () {
//                idleService.startTimer();
//            });

            $("#idleModal").on("hidden.bs.modal", function (e) {
                idleService.startTimer();
                idleService.hideModal();
            });

        }
    };
}]);
