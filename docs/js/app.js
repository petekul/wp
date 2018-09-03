var module = angular.module('app', ['ui.router', 'data-table', 'ngMaterial', 'textAngular']);


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

module.controller('manageController', function($scope, $http, $state, $mdToast, jsonService) {

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
            $scope.alerts = transformData(jsondata);

            $scope.alerts.mybusiness = addAppToData($scope.alerts.mybusiness, 'MBD');
            $scope.alerts.yourmarketplace = addAppToData($scope.alerts.yourmarketplace, 'YMP');
            $scope.alerts.iservice = addAppToData($scope.alerts.iservice, 'Generic');
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace).concat($scope.alerts.iservice);
            jsonService.setUpdatedJSON($scope.alerts);

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
            $scope.alerts = transformData(data);

            $scope.alerts.mybusiness = addAppToData($scope.alerts.mybusiness, 'MBD');
            $scope.alerts.yourmarketplace = addAppToData($scope.alerts.yourmarketplace, 'YMP');
            $scope.alerts.iservice = addAppToData($scope.alerts.iservice, 'Generic');
            $scope.allalerts = $scope.alerts.mybusiness.concat($scope.alerts.yourmarketplace).concat($scope.alerts.iservice);
            jsonService.setUpdatedJSON($scope.alerts);

            $scope.data = $scope.allalerts;

            $scope.productSubset = jQuery.extend(true, [], $scope.allalerts);
            $scope.filterSubset = jQuery.extend(true, [], $scope.allalerts);
            Object.keys($scope.data).forEach(key => $scope.data[key] === undefined ? delete $scope.data[key] : '');

        }).error(function(err) {
            $('.manageerror').css("display","block");
            $('.content').css("display","none");

        });
    }
    
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
        var alerts = jsonService.getUpdatedJSON();
        if ($scope.selectedProduct !== undefined) {
            if($scope.selectedProduct == 'MBD'){
                filteredProducts = alerts.mybusiness;
            }
            else if($scope.selectedProduct == 'YMP'){
                filteredProducts = alerts.yourmarketplace;
            }
            else if($scope.selectedProduct == 'Generic'){
                filteredProducts = alerts.iservice;
            }
            $scope.productSubset = filteredProducts;
        } 
    };
    $scope.getSelectedFilter = function () {
        var now = new Date();
        var filteredFilters = [];
        var alerts = jsonService.getUpdatedJSON();
        alerts = alerts.mybusiness.concat(alerts.yourmarketplace).concat(alerts.iservice);
        Object.keys(alerts).forEach(key => alerts[key] === undefined ? delete alerts[key] : '');
        if ($scope.selectedFilter !== undefined) {
            if($scope.selectedFilter == 'Upcoming'){
                for(var row in alerts){
                    if(convertToValidDateObj(alerts[row].start) > now){
                        filteredFilters.push(alerts[row]);
                    }
                }
            }
            else if($scope.selectedFilter == 'Active'){
                for(var row in alerts){
                    if(convertToValidDateObj(alerts[row].start) < now && convertToValidDateObj(alerts[row].end) > now){
                        filteredFilters.push(alerts[row]);
                    }
                }
            }
            else if($scope.selectedFilter == 'Expired'){
                for(var row in alerts){
                    if(convertToValidDateObj(alerts[row].end) < now){
                        filteredFilters.push(alerts[row]);
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
            for(var x=0;x<$scope.productSubset.length;x++){
                for(var y=0;y<$scope.filterSubset.length;y++){
                    if(JSON.stringify($scope.productSubset[x]) === JSON.stringify($scope.filterSubset[y])){
                        $scope.data.push($scope.productSubset[x]);
                    }
                }
            }
        }
        else{
            $scope.data = [];
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
            name: "App",
            prop: "app",
            width: 100
        }, {
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
        }, {
            name: "Status",
            prop: "status"
        }]
    };
    $scope.selected = [];
    $scope.onSelect = function(row) {
        console.log('ROW SELECTED!', row);
    };
    $scope.onRowClick = function(row) {
        console.log('ROW CLICKED', row);
    };

    $scope.edit = function(){
        console.log('yes');  
        $scope.data = $scope.alerts.yourmarketplace;
    };

    $scope.delete = function(){
        var alertjson = jQuery.extend(true, {}, jsonService.getUpdatedJSON());
        var newjson = jQuery.extend(true, {}, alertjson);
        var selected = $scope.selected;
        var product = transformProduct($scope.selectedProduct);
        // if(product != undefined){
            if(false){
            for(var i=0;i<selected.length;i++){
                selected[i].start = transformDateToJSON(selected[i].start);
                selected[i].end = transformDateToJSON(selected[i].end);
            }
            alertjson[product] = diff(alertjson[product], selected);
            jsonService.setUpdatedJSON(alertjson);

            newjson = jsonService.getUpdatedJSON()[product];

            $scope.data = newjson;
            
            showUpdatedFile();
            this.showDeleteToast();
        }
        else{
            var mbdalert = [];
            var ympalert = [];
            var iservicealert = [];

            //sort alerts and remove 'app' attribute
            for(var i=0;i<selected.length;i++){
                // selected[i].start = transformDateToJSON(selected[i].start);
                // selected[i].end = transformDateToJSON(selected[i].end);
                if(selected[i].app === 'MBD'){
                    mbdalert.push(selected[i]);
                }
                else if(selected[i].app === 'YMP'){
                    ympalert.push(selected[i]);
                }
                else if(selected[i].app === 'Generic'){
                    iservicealert.push(selected[i]);
                }
            }
            if(mbdalert.length > 0){
                mbdalert = diff(alertjson.mybusiness, mbdalert);
                newjson.mybusiness = mbdalert;
            }
            if(ympalert.length > 0){
                ympalert = diff(alertjson.yourmarketplace, ympalert);
                newjson.yourmarketplace = ympalert;
            }
            if(iservicealert.length > 0){
                iservicealert = diff(alertjson.iservice, iservicealert);
                newjson.iservice = iservicealert;
            }

            

            jsonService.setUpdatedJSON(newjson);
            $scope.data = newjson.mybusiness.concat(newjson.yourmarketplace).concat(newjson.iservice);

            if(product != undefined){
                if(product == 'mybusiness')
                    $scope.data = newjson.mybusiness;
                if(product == 'yourmarketplace')
                    $scope.data = newjson.yourmarketplace;
                if(product == 'iservice')
                    $scope.data = newjson.iservice;
            }

        }
    };
   
    $scope.showDeleteToast = function() {
        $mdToast.show({
          hideDelay   : 8000,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : 'templates/delete-toast-template.html'
        });
    };
    
    function showUpdatedFile(){
        $('.downloadlink').css("color", "rgba(255,82,82,0.87)");
        $('.downloadlink').css("font-weight", "bold");
        $('.downloadlink').text('Download updated file');
    }

    function diff(a, b) {
        for(var x=0;x<a.length;x++){
            for(var y=0;y<b.length;y++){
                if(JSON.stringify(a[x]) === JSON.stringify(b[y])){
                    a.splice(x, 1);
                    x--;
                }
            }
        }
        return a;
    }
    function addAppToData(appdata, appname){
        for(var row in appdata){
            appdata[row].app = appname;
        }
        return appdata;
    }
    function removeAppFromData(appdata){
        for(var row in appdata){
            delete appdata[row].app;
        }
        return appdata;
    }

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
    function transformProduct(productString){
        if(productString == 'MBD')
            return 'mybusiness';
        else if (productString == 'YMP')
            return 'yourmarketplace';
        else if (productString == 'Generic')
            return 'iservice';
        else if (productString == 'mybusiness')
            return 'MBD';
        else if (productString == 'yourmarketplace')
            return 'YMP';
        else if (productString == 'iservice')
            return 'Generic';
    }
    function transformDateToJSON(dateString){
        var date = dateString.substring(0,2);
        var month = dateString.substring(3,5);
        var year = dateString.substring(6,10);
        var hour = dateString.substring(11,13);
        var minute = dateString.substring(14,16);

        var datetime = year + month + date + hour + minute;
        return datetime;
    }

});


module.controller('createController', function($scope, $http, $state, $log, $mdToast, textAngularManager, jsonService) {
    $scope.alert={
        product: [],
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
            return "Type";
        }
    };

    $scope.checkedProduct = function (item, list) {
        return list.indexOf(item) > -1;
    };
    $scope.toggleProduct = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
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
            var products = transformProduct($scope.alert.product);
            var newalert = {
                status: '',
                type: '',
                start: '',
                end: '',
                msgTitle: '',
                msg: '',
                dismiss: ''
            };
            var alertjson = jsonService.getUpdatedJSON();
            for(var i=0;i<products.length;i++){
                newalert.type = transformType($scope.alert.type);
                newalert.status = $scope.alert.status;
                newalert.dismiss = transformDismiss($scope.alert.dismiss);
                newalert.start = transformDate($scope.alert.startdate, $scope.alert.starttime);
                newalert.end = transformDate($scope.alert.enddate, $scope.alert.endtime);
                newalert.msgTitle = $scope.alert.title;
                newalert.msg = $scope.alert.msg;

                alertjson[products[i]].push(newalert);
            }
            jsonService.setUpdatedJSON(alertjson);
            var newjson = JSON.stringify(alertjson);
            $scope.updated = true;
            showUpdatedFile();

            this.showCreateToast();
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
        var newjson = jQuery.extend(true, {}, jsonService.getUpdatedJSON());
        for(var row in newjson.mybusiness){
            delete newjson.mybusiness[row].app;
        }
        for(var row in newjson.yourmarketplace){
            delete newjson.yourmarketplace[row].app;
        }
        for(var row in newjson.iservice){
            delete newjson.iservice[row].app;
        }
        var blob = new Blob([JSON.stringify(newjson)], { type:"application/json;charset=utf-8;" });			
        var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',window.URL.createObjectURL(blob));
                    downloadLink.attr('download', jsonService.getFilename());
        downloadLink[0].click();
    };

    $scope.showCreateToast = function() {
        $mdToast.show({
          hideDelay   : 8000,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : 'templates/create-toast-template.html'
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

    function transformProduct(productSelection){
        var translatedProducts = [];
        for(var i=0;i<productSelection.length;i++){
            if(productSelection[i] == 'MBD')
                translatedProducts.push('mybusiness');
            else if (productSelection[i] == 'YMP')
                translatedProducts.push('yourmarketplace');
            else if (productSelection[i] == 'Generic')
                translatedProducts.push('iservice');
        }
        return translatedProducts;
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

    
    $scope.disabled = false;

});

module.controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {

    $scope.closeToast = function() {
      $mdToast
        .hide();
    };
  });