var app = angular.module('SSO.manageaccount');

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

app.controller('maController',['$scope','$stateParams', '$state', 'toastService', 'maService', 'urlService', 'idleService', function($scope, $stateParams, $state, toastService, maService, urlService, idleService){
    
    $scope.data=["item1", "Item 2", "Item 3"];
    $scope.toggle={};
    $scope.request={};
    showContent();
    // idleService.startTimer();
    // analyticsService.track(document.title, {googleAnalytics: true, f24: true, usage: true})
    
    var SQtoken = getSQtoken()
        $scope.titleOptions={
        "items": ["Mr.","Mrs.","Miss.","Ms."]
    };

    // usuService.loadUSUConfig().then(function(response){
    //     $scope.usuConfig = response.data;
    //     $scope.titleOptions = $scope.usuConfig.titles;
    // });

    // $scope.onChange = function(elem){
    //     el = $('#' + elem);
    //     msgel = $('#' + elem);
    //     if(el.hasClass('ng-touched')){
    //         $('.elem'+'msg.ngactive').css('border-color','green');
    //     }
    // }

    $scope.onChange = function(el){
        var elem = $('#txt' + el);
        var tickElem = $('#tick' + el);

        if(el == "Title"){
            showTick(tickElem);
            $('#cmbTitle').css('border-color', '');
        }
        if(el == "Firstname" || el == "Lastname"){
            if(checkValidName(elem.val())){
                showTick(tickElem);
            }
            else{
                if(tickElem.hasClass('matched')){
                    hideTick(tickElem);
                    if(this.ssoForm.Details.firstName.$touched && !this.ssoForm.Details.firstName.$valid){
                        //$('.ngmsgboxFN').css('margin-bottom','20px');

                        //TODO textbox sizes
                    }
                }
            }
        }
        if(el == "NewEmail" || el == "ConfirmEmail"){
            hideErrors("Email");
            if(checkValidEmail(elem.val())){
                if(el == "ConfirmEmail"){
                    if(checkMatching($('#txtNewEmail').val(), elem.val()))
                        showTick(tickElem);
                    else
                        hideTick(tickElem);
                }
                else{
                    if(checkMatching($('#txtConfirmEmail').val(), elem.val())){
                        showTick($('#tickConfirmEmail'));
                        this.ssoForm.Email.confirmEmail.$setValidity("emailmatch", true);
                    }
                    else{
                        hideTick($('#tickConfirmEmail'));
                        this.ssoForm.Email.confirmEmail.$setValidity("emailmatch", false);
                    }
                    showTick(tickElem);
                }
            }
            else{
                if(!checkMatching($('#txtConfirmEmail').val(), $('#txtNewEmail').val())){
                    this.ssoForm.Email.confirmEmail.$setValidity("emailmatch", false);
                    hideTick($('#tickConfirmEmail'));
                }
                if(tickElem.hasClass('matched')){
                    hideTick(tickElem);
                    // this.ssoForm.confirmEmail.$setValidity("emailmatch", false);
                }
            }
        }
        if(el == "Password"){
            hideErrors("Password");
        }
        checkButtonStatus();
    }

     $scope.saveDetails = function(){
        var details = {};
        details.title = $('#cmbTitle').text().trim();
        details.firstName = $('#txtFirstname').val();
        details.lastName = $('#txtLastname').val();

        toastService.showToast('success','Success! Your name has been changed.');

        btnDisplayLoading('Details');

        maService.postDetails(details).then(function(response){
            //close section
            var target = document.querySelector('#frmDetails');
            var content = target.querySelector('.slideable_content');

            //RE-ENABLE TO CLOSE FORMS
                // if(target.getAttribute('expanded') == 'false') {
                //     content.style.border = '1px solid rgba(0,0,0,0)';
                //     var y = content.clientHeight;
                //     content.style.border = 0;
                //     target.style.height = y + 'px';
                //     target.style.marginBottom = '30px';
                // } else {
                //     target.style.height = '0px';
                //     target.style.marginBottom = '0px';
                // }

                // //ES6
                // target.getAttribute('expanded') == 'true' ? target.setAttribute('expanded', 'false') : target.setAttribute('expanded', 'true');
                    
            setTimeout(function(){
                btnHideLoading('Details');
            }, 3000);
        
            //show saving animation
            this.request.saving = !this.request.saving;

            if(!this.request.saving){
                setTimeout(function () {
                    $('.savedsuccess').addClass("fadeout");
                }, 3000);
            }
            
            //200 ok, show saved successful message

        }.bind($scope), function(e){
            btnHideLoading('Details');

        });

        //DO STUFF

        


    };
     $scope.saveEmail = function(){

        toastService.showToast('danger','New password must not match your current password.', 'Try again');

        btnDisplayLoading('Email');

        maService.postPassword(answers, SQtoken).then(function(response){

        }.bind($scope), function(e){
            btnHideLoading('Email');
        });
    };
    $scope.savePassword = function(){
        showAnimation();
        var answers = {};
        answers.password = $('#txtConfirmPassword').val();

        btnDisplayLoading('Password');

        maService.postPassword(answers, SQtoken).then(function(response){
            // idleService.startTimer();
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
            btnHideLoading('Password');
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

    $scope.validOnBlur = function(elem){
        el = $('#txt' + elem);
        erEl = $('#lblErr' + elem);
        tickEl = $('#tick' + elem);
        if(elem == 'ConfirmEmail'){
            if(!el.val()){
                // this.ssoForm.confirmEmail.$setValidity("emailmatch", true);
            }
            else if(el.val() != $('#txtNewEmail').val()){
                displayEmailError(el, tickEl);
                this.ssoForm.Email.confirmEmail.$setValidity("emailmatch", false);
            }
            return;
        }
        if(elem.includes('Email')){
            if(!el.val()){
                this.ssoForm.Email.newEmail.$setValidity("pattern", true);
                if(!$('#txtConfirmEmail').val())
                    this.ssoForm.Email.confirmEmail.$setValidity("emailmatch", true);
            }
            else if(!checkValidEmail(el.val())){
                // displayEmailError(el, tickEl);
                tickEl.removeClass('glyphicon-ok').addClass('glyphicon-exclamation-sign');
                tickEl.removeClass('matched').addClass('unmatched');
                tickEl.css("display","block");
                this.ssoForm.Email.newEmail.$setValidity("pattern", false);
            }
            else{
                tickEl.removeClass('glyphicon-exclamation-sign').addClass('glyphicon-ok');
                this.ssoForm.Email.newEmail.$setValidity("pattern", true);
            }
        }
    }

    $scope.checkTitleSelected = function(){
        if($('#cmbTitle').hasClass('ng-pristine'))
        // if($('#cmbTitle').hasClass('ng-pristine') && $('.md-select-menu-container').hasClass('md-leave'))
            $('#cmbTitle').css('border-color', 'rgb(221,44,0)');
        else
            $('#cmbTitle').css('border-color', '');
    }

    $scope.toggled = function(el){
        var target = $('.title' + el);
         target.css('font-weight')=='700' ? target.css('font-weight','') : target.css('font-weight','bold');
    }

    $scope.transition = function(){
        this.request.saving = !this.request.saving;
        this.request.savedsuccess = !this.request.saving;
        if(!this.request.saving){
            setTimeout(function () {
                $('.savedsuccess').addClass("fadeout");
            }, 3000);
        }
    }

    function checkValidName(str){
        return /^[A-Za-z_'-]{2,}$/.test(str);
    }
    function checkValidEmail(str) {
        //MBD regex from Ramona
        return /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@([a-zA-Z0-9])[a-zA-Z0-9-_']{1,}((\.)([a-zA-Z0-9])([a-zA-Z0-9-_']{1,}))+/.test(str);
    }

    function btnDisplayLoading(el){
        var btn = $('#btnSave' + el);
        btn.text('');
        btn.addClass('btnLoading');
    }
    function btnHideLoading(el){
        var btn = $('#btnSave' + el);
        btn.text('Save');
        btn.removeClass('btnLoading');
    }
    function displayEmailError(el, tickEl){
        // el.css('border-color', 'red');
        tickEl.removeClass('matched');
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
    function checkMatching(str1, str2){
        return (str1 == str2);
    }
    function showTick(el){
        el.removeClass('incomplete');
        el.addClass('matched');
    }
    function hideTick(el){
        el.removeClass('matched');
        el.addClass('incomplete');
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

app.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing,
                    'margin-bottom':'0px'
                });
            };
        }
    };
})
.directive('slideToggle', function() {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function(scope, element, attrs, ngModel) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function(scope) {

                var content = target.querySelector('.slideable_content');
                if(target.getAttribute('expanded') == 'false') {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                    target.style.marginBottom = '30px';
                } else {
                    target.style.height = '0px';
                    target.style.marginBottom = '0px';
                }

                //ES6
                target.getAttribute('expanded') == 'true' ? target.setAttribute('expanded', 'false') : target.setAttribute('expanded', 'true');
                    
                    //ES5
                    // if(target.getAttribute('expanded') == 'true'){
                    //     target.setAttribute('expanded', 'false');
                    // }else{
                    //     target.setAttribute('expanded', 'true');
                    // }
            });
        }
    }
});

function toggletoast(type) {
    var x = document.getElementById("toast")
    x.className = "show " + type;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


app.directive("emailregex", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.emailmatch = function(modelValue) {
          if(scope.emailDisabled)
              return true;
        //   if(modelValue){
        //       if(modelValue.length<8)
        //         return true;
        //   }
            if(modelValue){
                if(modelValue == $('#txtConfirmEmail').val())
                    scope.ssoForm.Email.confirmEmail.$setValidity("emailmatch", true);
                else   
                    scope.ssoForm.Email.confirmEmail.$setValidity("emailmatch", false);
                if(modelValue.length <8){
                    scope.ssoForm.Email.newEmail.$setValidity("pattern", true);
                    return true;
                }
            }
            else if(modelValue == ""){
                if(!$('#txtConfirmEmail').val()){
                    scope.ssoForm.Email.confirmEmail.$setValidity("emailmatch", true);
                }
                return true;
            }
            // return true;
          return /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@([a-zA-Z0-9])[a-zA-Z0-9-_']{1,}((\.)([a-zA-Z0-9])([a-zA-Z0-9-_']{1,}))+/.test(modelValue);
        };
      }
    };
  });

  app.directive("emailmatch", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.emailmatch = function(modelValue) {
          if(scope.emailDisabled)
              return true;
          return (modelValue == $('#txtNewEmail').val());
        };
      }
    };
  });

  app.directive("passwordpolicy", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.passwordpolicy = function(modelValue) {
          
          if(!modelValue){
                return true;
          }

          return /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test(modelValue);
        };
      }
    };
  });


  app.directive("passwordmatch", function() {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.passwordmatch = function(modelValue) {
            // if(modelValue){
            //     if(modelValue.length<8){
            //         return true;
            //     }
            // }

            if(!(modelValue == $('#txtNewPassword').val())){
                $('#tickConfirmPassword').css("display","none");
                $('#tickConfirmPassword').removeClass('matched');
                $('#tickConfirmPassword').addClass('unmatched');
            }
            return (modelValue == $('#txtNewPassword').val());
        };
      }
    };
  });