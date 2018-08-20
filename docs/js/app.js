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
                        templateUrl: "templates/choose.html"
                    }
                },
                onEnter: ['$window', function($window){
                    $window.document.title = "Choose a file | Alerts Admin Tool";
                }]
            })

            .state("app.manage", {
                views: {
                    "content@": {
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
        return date ? moment(date).format('DD/MM/YYYY') : '';
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

module.controller('chooseController', function($scope, $http, $state, jsonService) {

    // jsonService.getRepo().success(function(data) {
    //     $scope.files = data;
       
    // }).error(function(err) {

    // });

    $scope.files = [{
        name:'ALERTS_ppe.json'
    },{
        name:'ALERTS_td.json'
    },{
        name:'ALERTS_prod.json'
    }];


    $scope.file='td';
    $scope.continue = function(){
        jsonService.setFilename($scope.file);
        hideUpdatedFile();
        $state.go('app.manage');
        $('.chooseheader').removeClass('active');
        $('.manageheader').addClass('active');
    };

    $scope.active = function(elem){
        var headers = ['.chooseheader', '.manageheader', '.createheader'];
        for(var n=0;n<headers.length;n++){
            if(headers[n] != elem){
                $(headers[n]).removeClass('active');
            }
        }
        $('.' +elem).addClass('active');
    };

    function hideUpdatedFile(){
        $('.downloadlink').css("color", "dcdcdc");
        $('.downloadlink').css("font-weight", "unset");
        $('.downloadlink').text('Download file');
    }

});

module.controller('manageController', function($scope, $http, $state, jsonService) {

    // $http.get('https://api.github.com/repos/petekul/wp/contents/alerts.json').success(function(data) {
    // var alerts = JSON.parse(atob(data.content));

    var testmode = true;
    if(!testmode){
        jsonService.getJSON(jsonService.getFilename()).success(function(data) {
            $('.manageerror').css("display","none");
            $('.content').css("display","block");
            var jsondata = JSON.parse(atob(data.content));
            var originaljsondata = jQuery.extend(true, {}, jsondata);

            jsonService.setSha(data.sha);
            jsonService.setOriginalJSON(originaljsondata);
            jsonService.setUpdatedJSON(originaljsondata);
            $scope.alerts = transformData(jsondata);
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace).concat($scope.alerts.iservice);

            $scope.data = $scope.allalerts;
            $scope.productSubset = jQuery.extend(true, [], $scope.allalerts);
            $scope.filterSubset = jQuery.extend(true, [], $scope.allalerts);
            Object.keys($scope.data).forEach(key => $scope.data[key] === undefined ? delete $scope.data[key] : '');
           
        }).error(function(err) {
            // showError();
            $('.manageerror').css("display","block");
            $('.content').css("display","none");
        });
    }
    else{
        $http.get('/wp-notif-admin/files/config/alerts/' + jsonService.getFilename()).success(function(data) {

            $('.manageerror').css("display","none");
            $('.content').css("display","block");
            // $scope.originalQuestions = jQuery.extend(true, [], $scope.questions);

            var originaljsondata = jQuery.extend(true, {}, data);
            jsonService.setOriginalJSON(originaljsondata);
            jsonService.setUpdatedJSON(originaljsondata);
            $scope.alerts = transformData(data);
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace).concat($scope.alerts.iservice);

            $scope.data = $scope.allalerts;
            $scope.productSubset = jQuery.extend(true, [], $scope.allalerts);
            $scope.filterSubset = jQuery.extend(true, [], $scope.allalerts);
            Object.keys($scope.data).forEach(key => $scope.data[key] === undefined ? delete $scope.data[key] : '');

        }).error(function(err) {
            //showError();
            $('.manageerror').css("display","block");
            $('.content').css("display","none");

        });
    }
    
    $scope.edit = function(){
        console.log('yes');  
        $scope.data = $scope.alerts.yourmarketplace;
    };

    $scope.delete = function(){
        var originaljson = jsonService.getOriginalJSON();
        var selected = $scope.selected;
    };

    // $scope.productoptions = [{ name: "All", id: 1 }, { name: "MBD", id: 2 }, { name: "YMP", id: 3 }];
    // $scope.productselectedOption = $scope.productoptions[1];

    $scope.products = ['Generic', 'MBD', 'YMP'];
    $scope.filters = ['All', 'Upcoming', 'Active', 'Expired'];
    $scope.selectedProduct = undefined;
    $scope.selectedFilter = undefined;
    $scope.productSubset = undefined;
    $scope.filterSubset = undefined;

    $scope.displayProduct = function () {
        if ($scope.selectedProduct !== undefined) {
            return $scope.selectedProduct;
        } else {
            return "Please select a product";
        }

    };
    $scope.displayFilter = function () {
        if ($scope.selectedFilter !== undefined) {
            return $scope.selectedFilter;
        } else {
            return "All";
        }
    };

    $scope.getSelectedProduct = function () {
        var filteredProducts = [];
        if ($scope.selectedProduct !== undefined) {
            if($scope.selectedProduct == 'MBD'){
                filteredProducts = $scope.alerts.mybusiness;
            }
            else if($scope.selectedProduct == 'YMP'){
                filteredProducts = $scope.alerts.yourmarketplace;
            }
            else if($scope.selectedProduct == 'Generic'){
                filteredProducts = $scope.alerts.iservice;
            }
            $scope.productSubset = filteredProducts;
        } 
    };
    $scope.getSelectedFilter = function () {
        var now = new Date();
        var filteredFilters = [];
        if ($scope.selectedFilter !== undefined) {
            if($scope.selectedFilter == 'Upcoming'){
                for(var row in $scope.allalerts){
                    if(convertToValidDateObj($scope.allalerts[row].start) > now){
                        filteredFilters.push($scope.allalerts[row]);
                    }
                }
            }
            else if($scope.selectedFilter == 'Active'){
                for(var row in $scope.allalerts){
                    if(convertToValidDateObj($scope.allalerts[row].start) < now && convertToValidDateObj($scope.allalerts[row].end) > now){
                        filteredFilters.push($scope.allalerts[row]);
                    }
                }
            }
            else if($scope.selectedFilter == 'Expired'){
                for(var row in $scope.allalerts){
                    if(convertToValidDateObj($scope.allalerts[row].end) < now){
                        filteredFilters.push($scope.allalerts[row]);
                    }
                }
            }
            else if($scope.selectedFilter == 'All'){
                filteredFilters = $scope.allalerts;
            }

            $scope.filterSubset = filteredFilters;
        }
    };

    $scope.filterTable = function(){
        this.getSelectedProduct();
        this.getSelectedFilter();
        if($scope.productSubset != undefined && $scope.filterSubset != undefined){
            $scope.data = [];
            // for(var x=0;x<$scope.productSubset.length;x++){
            //     if($scope.filterSubset.indexOf($scope.productSubset[x])){
            //         $scope.data.push($scope.productSubset[x]);
            //     }
            // }
            for(var x=0;x<$scope.productSubset.length;x++){
                for(var y=0;y<$scope.filterSubset.length;y++){
                    if(JSON.stringify($scope.productSubset[x]) === JSON.stringify($scope.filterSubset[y])){
                        $scope.data.push($scope.productSubset[x]);
                    }
                }
            }
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
        name: "Title",
        prop: "msgTitle",
        width: 200
    }, {
        name: "Message",
        prop: "msg",
        width: 300
    }, {
        name: "Type",
        prop: "type"
    }, {
        name: "Start date",
        prop: "start"
    }, {
        name: "End date",
        prop: "end"
    }]
  };
  $scope.selected = [];
  $scope.onSelect = function(row) {
    console.log('ROW SELECTED!', row);
  };
  $scope.onRowClick = function(row) {
    console.log('ROW CLICKED', row);
  };
   


    function convertToValidDateObj(datestr){
        var bits = datestr.split(/\D/);
        return new Date(bits[2], --bits[1], bits[0], bits[3], bits[4]);
    }

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


module.controller('createController', function($scope, $http, $state, $log, $mdToast, jsonService) {
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
    $scope.products = ['Generic', 'MBD', 'YMP'];
    $scope.types = ['Success', 'Warning', 'Danger'];
    $scope.updated = false;

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
        var valid = checkFieldsValid();
        if (valid){
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

            // var alertjson = jQuery.extend(true, {}, jsonService.getOriginalJSON());
            var alertjson = jsonService.getUpdatedJSON();
            alertjson[product].push(newalert);
            jsonService.setUpdatedJSON(alertjson);
            var newjson = JSON.stringify(alertjson);
            $scope.updated = true;
            showUpdatedFile();

            this.showSuccessToast();
            //this.saveJSON(jsonService.getFilename(), newjson);
            

            // var postobj = {
            //     message: 'Alerts update on: ' + new Date(),
            //     content: btoa(newjson),
            //     sha: jsonService.getSha()
            // };

            // jsonService.postJSON(jsonService.getFilename(), postobj).success(function(data){
            //     console.log('put success');
            // });
        }
        // this.showSuccessToast();
    };

    $scope.saveJSON = function () {
        var blob = new Blob([JSON.stringify(jsonService.getUpdatedJSON())], { type:"application/json;charset=utf-8;" });			
        var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',window.URL.createObjectURL(blob));
                    downloadLink.attr('download', jsonService.getFilename());
        downloadLink[0].click();
    };

    $scope.showSuccessToast = function() {
        $mdToast.show({
          hideDelay   : 8000,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : 'templates/toast-template.html'
        });
    };

    function checkFieldsValid(){
        var validchecks = {
            productvalid: false,
            typevalid: false,
            startdatevalid: false,
            starttimevalid: false,
            enddatevalid: false,
            endtimevalid: false,
            titlevalid: false,
            msgvalid: false
        };

        if($('.drpProduct md-select-value span').text() != 'Please select a product'){
            validchecks.productvalid = true;
        }
        if($('.drpType md-select-value span').text() != 'Please select a type'){
            validchecks.typevalid = true;
        }
        if($('.dateStart input').val() != ''){
            validchecks.startdatevalid = true;
        }
        if($('.timeStart').val() != ''){
            validchecks.starttimevalid = true;
        }
        if($('.dateEnd input').val() != ''){
            validchecks.enddatevalid = true;
        }
        if($('.timeEnd').val() != ''){
            validchecks.endtimevalid = true;
        }
        if($('.txtTitle input').val() != ''){
            validchecks.titlevalid = true;
        }
        if($('.txtMsg input').val() != ''){
            validchecks.msgvalid = true;
        }
        var passed = true; 
        for(var check in validchecks){
            if (validchecks[check] == false){
                passed = false;
                break;
            }
        }

        if(!passed){
            displayError();
        }
        else{
            hideError();
        }

        return passed;
    }

    function displayError(){
        var elem = '.errorSection';
        $(elem).css("display","block");
    }
    function hideError(){
        var elem = '.errorSection';
        $(elem).css("display","none");
    }

    function transformProduct(productString){
        if(productString == 'MBD')
            return 'mybusiness';
        else if (productString == 'YMP')
            return 'yourmarketplace';
        else if (productString == 'Generic')
            return 'iservice';
        
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
    function showUpdatedFile(){
        $('.downloadlink').css("color", "rgba(255,82,82,0.87)");
        $('.downloadlink').css("font-weight", "bold");
        $('.downloadlink').text('Download updated file');
    }

});

module.controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {

    $scope.closeToast = function() {
      $mdToast
        .hide();
    };
  });