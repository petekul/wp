var app = angular.module('SSO.choosenewpassword');

app.controller('cnpwController',['$scope','$stateParams', '$state', 'cnpwService', 'urlService', 'idleService', function($scope, $stateParams, $state, cnpwService, urlService, idleService){

    showContent();
    idleService.startTimer();
    // analyticsService.track(document.title, {googleAnalytics: true, f24: true, usage: true})
    var SQtoken = getSQtoken()
    $scope.validatePassword = function(){
        showAnimation();
        var answers = {};
        answers.password = $('#txtConfirmPassword').val();
        cnpwService.postPassword(answers, SQtoken).then(function(response){
            idleService.startTimer();
            var hasError = false;

            if(response.data.password == false){
                hasError = true;
                displayError("Password");
                $('#btnContinue').css('disabled','true');
                showContent();
            }

            if(!hasError){
                window.location.href = urlService.getLogoutURL('statuspage') + "passwordChanged"; 
                // $state.go("app.cnpwstatus", {'statusmsg':'success'});
            }

        }.bind($scope), function(e){
            //if post fails, display error pages
            if(e.status == "409"){
                    displayError("Password");
                    $('#btnContinue').css('disabled','true');
                    showContent();
            }
            else{
                window.location.href = urlService.getLogoutURL('statuspage') + e.status;
                // $state.go("app.error", {'errormsg':e.status});
            }
        });
    };

    $scope.onChange = function(el){
        hideErrors("Password");
        if($('#tickConfirmPassword').hasClass('matched')){
            
        }
    }

    function displayError(field){
        var txtNew = $("#txtNew" + field);
        var txtConfirm = $("#txtConfirm" + field);
        var tickNew = $("#tickNew" + field);
        var tickConfirm = $("#tickConfirm" + field);
        var errMsg = $("#error" + field);

        txtNew.css("border-color","red");
        txtConfirm.css("border-color","red");
        tickNew.removeClass('matched').addClass('incorrect');
        tickConfirm.removeClass('matched').addClass('incorrect');
        tickNew.css("display","none");
        tickConfirm.css("display","none");
        errMsg.css("display","block");
        txtNew.val("");
        txtConfirm.val("");

        if(field == "Password"){
            $("#tickMin").removeClass('matched').addClass('unmatched');
            $("#tickCap").removeClass('matched').addClass('unmatched');
            $("#tickNum").removeClass('matched').addClass('unmatched');
            $("#tickSym").removeClass('matched').addClass('unmatched');
        }
    }
    function hideErrors(field){
        var txtNew = $("#txtNew" + field);
        var txtConfirm = $("#txtConfirm" + field);
        var tickNew = $("#tickNew" + field);
        var tickConfirm = $("#tickConfirm" + field);
        var errMsg = $("#error" + field);

        txtNew.css("border-color","#cccccc");
        txtConfirm.css("border-color","#cccccc");
        tickNew.removeClass('incorrect').addClass('incomplete');
        tickConfirm.removeClass('incorrect').addClass('incomplete');
        errMsg.css("display","none");
    }

    function showContent(){
        $('.content').css('display','block');
        $('.loadingAnimation').css('display','none');
    }
    function showAnimation(){
        $('.content').css('display','none');
        $('.loadingAnimation').css('display','block');
    }
    function getSQtoken(){
        var queryParams = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            queryParams[key] = value;
        });
        return queryParams['SQToken'];
    }

}]);