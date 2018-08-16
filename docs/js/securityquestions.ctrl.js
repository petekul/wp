var app = angular.module("SSO.securityquestions");

app.controller("SQController",["$scope","$stateParams", "$state", "SQService", "urlService","idleService", function($scope, $stateParams, $state, SQService, urlService, idleService){
    var attempts=0;

    $scope.alerts = [];
    $scope.sha="someemail";

    //directive placeholders
    var directive = {};
    var SQToken = "sometoken";

    $scope.options = {
        rowHeight: 50,
        headerHeight: 50,
        footerHeight: false,
        scrollbarV: false,
        selectable: false,
        columns: [{
          name: "Product",
          width: 300
        }, {
          name: "Gender"
        }, {
          name: "Company"
        }]
      };

    SQService.getSecurityQuestions(directive,urlService.getBackURL()).then(function(response){

        $scope.alerts = atob(response.data.content);
        //if success
        $scope.sha = response.data.sha;
        
    }, function(e){
        //if error display specific message to SQ so we can collect info from customer through telephone.
        //TODO separate error app and do redirect to error app
        // $state.go("app.error", {"errormsg":"noSQinfo"});
        // window.location.href = urlService.getLogoutURL("statuspage") + "noSQinfo";
    });


    function showContent(){
        $(".content").css("display","block");
        $(".loadingAnimation").css("display","none");
    }
    function showAnimation(){
        $(".content").css("display","none");
        $(".loadingAnimation").css("display","block");
    }

    document.addEventListener("invalid", (function(){
        return function(e) {
          //prevent the browser from showing default error popup
          e.preventDefault();
        };
    })(), true);
    

}]);
