
var app = angular.module('SSO.usersetup');

app.controller('ssController',['$scope','$stateParams', '$state', '$sce', 'usuService', 'urlService', function($scope, $stateParams, $state, $sce, usuService, urlService){

    $scope.emailContext = $stateParams.emailContext;
    $scope.useremail = $stateParams.useremail;
    $scope.redirectURL = $stateParams.redirectURL;
    $scope.body = 'Welcome';
    $scope.buttontext = 'Proceed';

    usuService.loadUSUSuccessConfig().then(function(response){
        var ususuccessConfig = response.data;
        var statemessage = ususuccessConfig[ususuccessConfig.map(x => x.emailContext).indexOf($scope.emailContext)]
        $scope.content = $sce.trustAsHtml(statemessage.content);
        $scope.buttontext = statemessage.buttontext;
    });

    if(!$scope.emailContext){
        setTimeout(function() {
            window.location.href = $scope.redirectURL;
        }, 5000);
    }
    
    $scope.login = function() {
        if($scope.redirectURL){
            window.location.href = $scope.redirectURL;
        }
    }

}]);
