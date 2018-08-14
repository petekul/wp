angular.module('SSO.errorpage', ['SSO.url']);var app = angular.module('SSO.errorpage');

app.controller('errorController',['$scope', '$sce', 'errorService', function($scope, $sce, errorService){

    $scope.queryParams = {};
    $scope.status = document.location.href; //$stateParams.errormsg;
    $scope.statusTitle = "Oops. Something went wrong";
    $scope.statusInfo = "An error occurred whilst processing your request. Please refresh the page or try again later.";
    $scope.errors = [];

    getErrorParams();
    $scope.status = $scope.queryParams['error_code'];

    //Loads all error msgs and then matches message with error status sent from error call.
    errorService.loadErrorConfig().then(function(response){
        this.errors = response.data;

        //if error is received as undefined/null/empty, set to default error message code "".
        if(!this.status)
            this.status="";

        //search through error config to find correct message to display
        this.statusInfo = this.errors[this.errors.map(x => x.status).indexOf(this.status.toString())];

        //if error code not found, assign default error msg
        if(!this.statusInfo)
            this.statusInfo = this.errors[0]; 

            //$sce is used for html-binding so the message text can recognise html tags such as <b> <i> etc...
        this.statusInfo.statusMsg = $sce.trustAsHtml(this.statusInfo.statusMsg);

    }.bind($scope), function(e){
        console.log(e.statusText);
    });

    $scope.ok = function() {
//        if(this.statusInfo.status != "SQnoinfo"){
//            document.location.href = originService.getOrigin();
//        }
//        else{
//            document.location.href = urlService.getDefaultURL();
//        }
//          document.location.href = urlService.getDefaultURL();
        console.log("ok");
    }

    function getErrorParams(){
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        $scope.queryParams[key] = value;
      });
      return $scope.queryParams;
    }

}]);
'use strict';

angular.module('SSO.errorpage')
    .service('errorService', ['$http', '$q', function($http, $q) {
        return {

            loadErrorConfig: function(){
                return $http.get('views/error-pages/configs/errorconfig.json');
            }
        };

    }]);
