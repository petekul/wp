var module = angular.module('app', ['ui.router', 'data-table', 'ngMaterial']);


module.config(["$stateProvider", "$urlRouterProvider", "$mdDateLocaleProvider", function($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {
        $stateProvider
            //LANDING PAGE
            .state("app", {
                url:"/",
                views: {
                    "header": {
                        templateUrl: "templates/header.html"
                    },
                    "content": {
                        templateUrl: "templates/manage.html"
                    }
                },
                onEnter: ['$window', function($window){
                    $window.document.title = "Manage | Alerts Admin Tool";
                }]
            })

            .state("app.create", {
                views: {
                    "content@": {
                        templateUrl: "templates/create.html"
                    }
                },
                onEnter: ['$window', function($window){
                    $window.document.title = "Create | Alerts Admin Tool";
                }]
            });


//    $urlRouterProvider.otherwise("/");
        $urlRouterProvider.otherwise(function($injector, $location){
            $injector.invoke(["$state", function($state) {
                $state.go("app");
            }]);
        });

    //     /**
    //    * @param date {Date}
    //    * @returns {string} string representation of the provided date
    //    */
      $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('L') : '';
      };
  
    //   /**
    //    * @param dateString {string} string that can be converted to a Date
    //    * @returns {Date} JavaScript Date object created from the provided dateString
    //    */
      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'L', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };

    }]);

module.controller('manageController', function($scope, $http, $state, jsonService) {

    // $http.get('https://api.github.com/repos/petekul/wp/contents/alerts.json').success(function(data) {
    // var alerts = JSON.parse(atob(data.content));

    var testmode = false;
    if(!testmode){
        jsonService.getJSON().success(function(data) {
            var jsondata = JSON.parse(atob(data.content));
            var originaljsondata = jQuery.extend(true, {}, jsondata);

            jsonService.setSha(data.sha);
            jsonService.setOriginalJSON(originaljsondata);
            $scope.alerts = transformData(jsondata);
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace);

            $scope.data = $scope.allalerts;
        });
    }
    else{
        $http.get('/wp-notif-admin/alerts.json').success(function(data) {

            // $scope.originalQuestions = jQuery.extend(true, [], $scope.questions);
            $scope.alerts = transformData(data);
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace);

            $scope.data = $scope.allalerts;
        });
    }
    $scope.edit = function(){
      console.log('yes');  
        $scope.data = $scope.alerts.yourmarketplace;
    };

    // $scope.productoptions = [{ name: "All", id: 1 }, { name: "MBD", id: 2 }, { name: "YMP", id: 3 }];
    // $scope.productselectedOption = $scope.productoptions[1];

    $scope.products = ['MBD', 'YMP'];
    $scope.selectedProduct = undefined;
    $scope.statuses = ['All', 'Upcoming', 'Active', 'Expired'];
    $scope.selectedStatus = undefined;

    $scope.getSelectedProduct = function () {
        if ($scope.selectedProduct !== undefined) {
            if($scope.selectedProduct == 'MBD'){
                $scope.data = $scope.alerts.mybusiness;
            }
            else if($scope.selectedProduct == 'YMP'){
                $scope.data = $scope.alerts.yourmarketplace;
            }
            return $scope.selectedProduct;
        } else {
            return "Please select a product";
        }

    };
    $scope.getSelectedStatus = function () {
        if ($scope.selectedStatus !== undefined) {
            return $scope.selectedStatus;
        } else {
            return "All";
        }
    };


  $scope.options = {
    rowHeight: 50,
    footerHeight: false,
    scrollbarV: false,
    headerHeight: 50,
    selectable: true,
    multiSelect: true,
    columns: [{
      name: "Status",
      prop: "status",
    }, {
      name: "type",
      prop: "type"
    }, {
      name: "start date",
      prop: "start"
    }, {
      name: "end date",
      prop: "end"
    }, {
      name: "msgTitle",
      prop: "msgTitle"
    }, {
      name: "msg",
      prop: "msg",
      width: 300
    }, {
      name: "dismiss",
      prop: "dismiss"
    }]
  };
  $scope.selected = [];
  $scope.onSelect = function(row) {
    console.log('ROW SELECTED!', row);
  };
  $scope.onRowClick = function(row) {
    console.log('ROW CLICKED', row);
  };
   


    function transformData(json){
        console.log(json);
        for(var product in json){
            for(var n=0; n<json[product].length;n++){
                json[product][n].start = convertDateJSONToText(json[product][n].start);
                json[product][n].end = convertDateJSONToText(json[product][n].end);
            }
        }
        return json;
    }

    function convertDateJSONToText(datestr){
        var year = datestr.slice(0,4);
        var month = datestr.slice(4,6);
        var day = datestr.slice(6,8);
        var hour = datestr.slice(8,10);
        var minute = datestr.slice(10,12);

        return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
    }

});


module.controller('createController', function($scope, $http, $state, $log, jsonService) {
    $scope.alert={
        product: undefined,
        type: undefined,
        status: 'notification',
        dismiss: 'permanent',
        startdate: '',
        enddate: '',
        starttime: '',
        endtime: '',
        title: '',
        msg: ''
    };
    $scope.products = ['MBD', 'YMP'];
    $scope.types = ['Success', 'Warning', 'Danger'];

    $scope.getSelectedProduct = function () {
        if ($scope.alert.product !== undefined) {
            return $scope.alert.product;
        } else {
            return "Please select a product";
        }
    };
    $scope.getSelectedType = function () {
        if ($scope.alert.type !== undefined) {
            return $scope.alert.type;
        } else {
            return "Please select a type";
        }
    };

    this.myDate = new Date();
  
    this.onDateChanged = function() {
      $log.log('Updated Date: ', this.myDate);
    };

    this.mytime = {};
    this.mytime.timeBegin = moment().second(0).milliseconds(0).toDate();


    $scope.submit = function(){

        var product = transformProduct($scope.alert.product);
        var newalert = {
            status: '',
            type: '',
            start: '',
            end: '',
            msgTitle: '',
            msg: '',
            dismiss: ''
        };

        newalert.type = transformType($scope.alert.type);
        newalert.status = $scope.alert.status;
        newalert.dismiss = transformDismiss($scope.alert.dismiss);
        newalert.start = transformDate($scope.alert.startdate, $scope.alert.starttime);
        newalert.end = transformDate($scope.alert.enddate, $scope.alert.endtime);
        newalert.msgTitle = $scope.alert.title;
        newalert.msg = $scope.alert.msg;

        console.log(newalert);

        // var originaljson = jQuery.extend(true, {}, jsonService.getOriginalJSON());
        var originaljson = jsonService.getOriginalJSON();
        originaljson[product].push(newalert);
        var newjson = JSON.stringify(originaljson);

        var postobj = {
            message: 'Alerts update on: ' + new Date(),
            content: btoa(newjson),
            sha: jsonService.getSha()
        };


        jsonService.postJSON(postobj).success(function(data){
            console.log('put success');
        });

    };

    function transformProduct(productString){
        if(productString == 'MBD')
            return 'mybusiness';
        else if (productString == 'YMP')
            return 'yourmarketplace';
        // else 
        //     create for all apps
        
    }
    function transformType(typeString){
        return typeString.toLowerCase();
    }
    function transformDismiss(dismissString){
        if(dismissString == 'dismissable'){
            return 'y';
        }
        else{
            return 'n';
        }
    }
    function transformDate(dateString, timeString){

        var month = (dateString.getMonth() + 1).toString();
        var date = dateString.getDate().toString();
        var hour = timeString.getHours().toString();
        var minute = timeString.getMinutes().toString();

        if(dateString.getMonth() + 1 < 10){
            month = '0' + (dateString.getMonth() + 1).toString();
        }
        if(dateString.getDate() < 10){
            date = '0' + dateString.getDate().toString();
        }
        if(timeString.getHours() < 10){
            hour = '0' + timeString.getHours().toString();
        }
        if(timeString.getMinutes() < 10){
            minute = '0' + timeString.getMinutes().toString();
        }

        var datetime = dateString.getFullYear().toString() + month + date + hour + minute;

        return datetime;
    }

});
