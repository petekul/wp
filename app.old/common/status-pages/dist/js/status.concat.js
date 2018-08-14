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
/*jshint sub:true*/
(function () {
    'use strict';
var app = angular.module('SSO.statuspage');
app.controller('statusController',['$scope', '$sce', '$stateParams', '$state', 'statusService', function($scope, $sce, $stateParams, $state, statusService){

    $scope.queryParams = {};
    $scope.statusTitle = "Oops. Something went wrong";
    $scope.statusInfo = "An error occurred whilst processing your request. Please refresh the page or try again later.";
    $scope.errors = [];

    $scope.status = document.location.href; //$stateParams.errormsg;
    getStatusParams();
    $scope.status = $scope.queryParams['status_code'];
    $scope.useremail = $scope.queryParams['useremail'];
    $scope.defaultURL = "http://www.worldpay.com";



    if($scope.useremail){
        $scope.useremail = decodeURIComponent($scope.useremail);
        if($scope.useremail.includes('#!/')){
            $scope.useremail = $scope.useremail.slice(0, -3);
        }
        $state.go("status.setupsuccessEmail");
    }

    //Loads all error msgs and then matches message with error status sent from error call.
    statusService.loadStatusConfig().then(function(response){
        this.statuses = response.data;
        this.defaultURL = response.data[0].defaultURL;

        //if error is received as undefined/null/empty, set to default error message code "".
        if(!this.status)
            this.status="";
        if(this.status.includes('#!/')){
            this.status = this.status.slice(0, -3);
            window.location.href = $scope.defaultURL;
        }

        //search through error config to find correct message to display
        // this.statusInfo = this.statuses[this.statuses.map(x => x.status).indexOf(this.status.toString())];
        for(var i=0; i<this.statuses.length; i++){
            if(this.statuses[i].status == this.status.toString()){
                this.statusInfo = this.statuses[i];
            }
        }
        

        //if error code not found, assign default error msg
        if(!this.statusInfo)
            this.statusInfo = this.statuses[1]; 

            //$sce is used for html-binding so the message text can recognise html tags such as <b> <i> etc...
        document.title = this.statusInfo.pageTitle;
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
        if(!$scope.queryParams['redirectURL'])
            window.location.href = $scope.defaultURL;
        else
            window.location.href = $scope.queryParams['redirectURL'];

        console.log("ok");
    };

    function getStatusParams(){
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        $scope.queryParams[key] = value;
      });
      return $scope.queryParams;
    }

}]);
}());

(function () {
    'use strict';
    angular.module('SSO.statuspage')
    .service('statusService', ['$http', '$q', function($http, $q) {
        return {
            loadStatusConfig: function(){
                return $http.get('configs/statusconfig.json');
            }
        };

    }]);
}());
