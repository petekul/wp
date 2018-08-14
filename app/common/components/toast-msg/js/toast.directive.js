var app = angular.module('SSO.toast');

app.directive('toast', ['toastService', 'urlService', function(toastService, urlService){
    return{
        templateUrl:'/sso/modules/common/components/toast-msg/templates/toast.tmpl.html',
        link: function(scope, element, attrs) {

            // idleService.loadConfig();

            scope.action = function(){
                
            };

            scope.no = function(){
                
            };


        }
    };
}]);
