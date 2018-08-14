/*jshint sub:true*/
var app = angular.module('SSO.usersetup');

app.controller('usuController',['$scope','$stateParams', '$state', 'usuService', 'urlService', 'idleService', function($scope, $stateParams, $state, usuService,urlService, idleService){

    var nameCompleted, emailCompleted, passCompleted, tcCompleted = false;
    var contactFlag, emailFlag, passwordFlag, tcFlag;
    $scope.titleOptions={
        "items": ["Mr.","Mrs.","Miss.","Ms."]
    };

    usuService.loadUSUConfig().then(function(response){
        $scope.usuConfig = response.data;
        $scope.titleOptions = $scope.usuConfig.titles;
    });
    var SQtoken=getSQtoken();
//    usuService.getUserProfile($stateParams.SQToken, $stateParams.directive).then(function(response){
    usuService.getUserProfile(SQtoken).then(function(response){
        idleService.startTimer();
        $scope.fields = response.data;
        displayFields();
        showContent();
    }.bind($scope), function(e){
        window.location.href = urlService.getLogoutURL('statuspage') + e.status;
    });

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
                        this.ssoForm.confirmEmail.$setValidity("emailmatch", true);
                    }
                    else{
                        hideTick($('#tickConfirmEmail'));
                        this.ssoForm.confirmEmail.$setValidity("emailmatch", false);
                    }
                    showTick(tickElem);
                }
            }
            else{
                if(!checkMatching($('#txtConfirmEmail').val(), $('#txtNewEmail').val())){
                    this.ssoForm.confirmEmail.$setValidity("emailmatch", false);
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
    };

    $scope.validateInput = function(){
        //Reads regex from config about what characters should be allowed in each of the fields.
        //prevents unallowed characters from being entered
        //currently only used for name fields
        var regex = new RegExp("^[A-Za-z_'-]$");
        var _event = event || window.event;
        var key = _event.keyCode || _event.which;
        key = String.fromCharCode(key);
        if(!regex.test(key)) {
            _event.returnValue = false;
            if (_event.preventDefault)
                _event.preventDefault();
        }
    };

    $scope.checkTitleSelected = function(){
        if($('#cmbTitle').hasClass('ng-pristine'))
        // if($('#cmbTitle').hasClass('ng-pristine') && $('.md-select-menu-container').hasClass('md-leave'))
            $('#cmbTitle').css('border-color', 'rgb(221,44,0)');
        else
            $('#cmbTitle').css('border-color', '');
    };

    $scope.submitForm = function(){
        var answers = {};
        if($scope.fields.contactDetailRequired){
            answers.title = $('#cmbTitle').text().trim();
            answers.firstName = $('#txtFirstname').val();
            answers.lastName = $('#txtLastname').val();
        }
        if($scope.fields.emailRequired != 'false')
            answers.email = $('#txtConfirmEmail').val();
        if($scope.fields.passwordRequired)
            answers.password = $('#txtConfirmPassword').val();
        if($scope.fields.tcRequired)
            answers.tc = $('#ckbTerms.md-checked').length ? true : false;
        showAnimation();
        usuService.postUserSetupAnswers(answers, urlService.getBackURL()).then(function(response){
            idleService.startTimer();
            var hasError = false;

            if($scope.fields.emailRequired == "true" && response.data.emailUpdated == false){
                hasError = true;
                displayError("Email");
                showContent();
            }
            if($scope.fields.passwordRequired && response.data.passwordUpdated == false){
                hasError = true;
                displayError("Password");
                showContent();
            }
            checkButtonStatus();
            if(!hasError){
                //this is the final state so go to origin instead of 'nextstate'.

                if($scope.fields.emailRequired){
                //                    window.location.href = response.successLink;
                    if($scope.fields.emailRequired == "false"){
                        //TODO why is this still state.go?
                        // window.location.href = urlService.getLogoutURL('statuspage') + "setupsuccessNonEmail" + "&redirectURL=" + response.data.nextLink;
                        $state.go("app.ssnonemail", {'emailContext': false, 'redirectURL': response.data.nextLink});
                    }
                    else{
                        window.location.href = urlService.getLogoutURL('statuspage') + "setupsuccessEmail" + "&useremail=" + answers.email;
                        // $state.go("app.ssemail", {'emailContext': true, 'useremail': answers.email, 'redirectURL': urlService.getLogoutURL()})
                    }
                }

            }

        }.bind($scope), function(e){
            idleService.startTimer();
            //if post fails, display error pages
            if(e.status == "409"){
            	if($scope.fields.emailRequired == "true" && e.data.emailUpdated == false){
                    hasError = true;
                    displayError("Email");
                    showContent();
                }
                if($scope.fields.passwordRequired && e.data.passwordUpdated == false){
                    hasError = true;
                    displayError("Password");
                    showContent();
                }
                checkButtonStatus();
            }
            else{
                window.location.href = urlService.getLogoutURL('statuspage') + e.status;
                // $state.go("app.error", {'errormsg':e.status});
            }
        });
    };

    function displayFields(){
        if($scope.fields.contactDetailRequired){
            //ES6
            // $('#frmDetails').css("display") == "block" ? $('#frmDetails').css("display","none") : $('#frmDetails').css("display","block");
            
            //ES5
            if($('#frmDetails').css("display") == "block")
                $('#frmDetails').css("display","none");
            else
                $('#frmDetails').css("display","block");
        }
        //TODO add if not boolean

        if($scope.fields.emailRequired){
            if($scope.fields.emailRequired == "true"){
                //ES6
                // $('#frmEmail').css("display") == "block" ? $('#frmEmail').css("display","none") : $('#frmEmail').css("display","block");
            
                //ES5
                if($('#frmEmail').css("display") == "block")
                    $('#frmEmail').css("display","none");
                else
                    $('#frmEmail').css("display","block");
            }
            else if($scope.fields.emailRequired == "false"){
                //Do nothing
            }
            else{
                $scope.emailDisabled=true;
                $('#txtNewEmail').val($scope.fields.emailRequired);
                $('#txtNewEmail').attr('readonly', true);
                $('#txtNewEmail').addClass('input-disabled');
                $('.lblNewEmail').css("transform", "translate3d(1px, 5px, 0) scale(0.75)");
                $('.lblNewEmail').css("left", "10px");
                $('#txtConfirmEmail').val($scope.fields.emailRequired);
                $('#txtConfirmEmail').attr('readonly', true);
                $('#txtConfirmEmail').addClass('input-disabled');
                $('.lblConfirmEmail').css("transform", "translate3d(1px, 5px, 0) scale(0.75)");
                $('.lblConfirmEmail').css("left", "10px");

                //ES6
                // $('#frmEmail').css("display") == "block" ? $('#frmEmail').css("display","none") : $('#frmEmail').css("display","block");

                //ES5
                if($('#frmEmail').css("display") == "block")
                    $('#frmEmail').css("display","none");
                else
                    $('#frmEmail').css("display","block");
            }
        }

        if($scope.fields.passwordRequired){
            //ES6
            // $('#frmPassword').css("display") == "block" ? $('#frmPassword').css("display","none") : $('#frmPassword').css("display","block");
            
            //ES5
            if($('#frmPassword').css("display") == "block")
                $('#frmPassword').css("display","none");
            else
                $('#frmPassword').css("display","block");
        }
        if($scope.fields.tcRequired){
            //ES6
            // $('#frmTerms').css("display") == "block" ? $('#frmTerms').css("display","none") : $('#frmTerms').css("display","block");
        
            //ES5
            if($('#frmTerms').css("display") == "block")
                $('#frmTerms').css("display","none");
            else
                $('#frmTerms').css("display","block");
        }
    }

    function displayError(field){
        var txtNew = $("#txtNew" + field);
        var txtConfirm = $("#txtConfirm" + field);
        var tickNew = $("#tickNew" + field);
        var tickConfirm = $("#tickConfirm" + field);
        var errMsg = $("#error" + field);

        txtNew.css("border-color","#f01e14");
        txtConfirm.css("border-color","#f01e14");
        tickNew.removeClass('matched').addClass('incorrect');
        tickConfirm.removeClass('matched').addClass('incorrect');
        tickNew.css("display","none");
        tickConfirm.css("display","none");
//        tickNew.removeClass('matched').removeClass('glyphicon-ok').addClass('incorrect').addClass('glyphicon-remove');
//        tickConfirm.removeClass('matched').removeClass('glyphicon-ok').addClass('incorrect').addClass('glyphicon-remove');
        errMsg.css("display","block");
        txtNew.val("");
        txtConfirm.val("");
        // txtNew.trigger("change");

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

        // txtNew.css("border-color","#ccc");
        // txtConfirm.css("border-color","#ccc");
        txtNew.css("border-color","");
        txtConfirm.css("border-color","");
        tickNew.removeClass('incorrect').addClass('incomplete');
        tickConfirm.removeClass('incorrect').addClass('incomplete');
//        tickNew.removeClass('incorrect').removeClass('glyphicon-remove').addClass('glyphicon-ok').addClass('incomplete');
//        tickConfirm.removeClass('incorrect').removeClass('glyphicon-remove').addClass('glyphicon-ok').addClass('incomplete');
//        tickNew.css("display","none");
//        tickConfirm.css("display","none");
        errMsg.css("display","none");
    }

    function displayEmailError(el, tickEl){
        // el.css('border-color', 'red');
        tickEl.removeClass('matched');

    }
    function hideEmailError(el, erEl){
        // el.css('border-color', '#ccc');
        erEl.css('display', 'none');
    }

    function showTick(el){
        el.removeClass('incomplete');
        el.addClass('matched');
    }
    function hideTick(el){
        el.removeClass('matched');
        el.addClass('incomplete');
    }

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
                this.ssoForm.confirmEmail.$setValidity("emailmatch", false);
            }
            return;
        }
        if(elem.includes('Email')){
            if(!el.val()){
                this.ssoForm.newEmail.$setValidity("pattern", true);
                if(!$('#txtConfirmEmail').val())
                    this.ssoForm.confirmEmail.$setValidity("emailmatch", true);
            }
            else if(!checkValidEmail(el.val())){
                displayEmailError(el, tickEl);
                this.ssoForm.newEmail.$setValidity("pattern", false);
            }
            else
                this.ssoForm.newEmail.$setValidity("pattern", true);
        }
    };

    $scope.hideOnFocus = function(elem){
        el = $('#txt' + elem);
        erEl = $('#lblErr' + elem);
        hideEmailError(el, erEl);
    };

    function checkValidName(str){
        return /^[A-Za-z_'-]{2,}$/.test(str);
    }

    function checkValidEmail(str) {
        //MBD regex from Ramona
        return /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@([a-zA-Z0-9])[a-zA-Z0-9-_']{1,}((\.)([a-zA-Z0-9])([a-zA-Z0-9-_']{1,}))+/.test(str);

        //original regex
//        return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(str);

        //   ^(?("")("".+?""@)|(([0-9a-zA-Z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-zA-Z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,6}))$
    }

    function checkMatching(str1, str2){
        return (str1 == str2);
    }

    function checkButtonStatus(){

    //TODO RETHINK THIS. WHAT IF USER COMPLETES IN DIFFERENT ORDER?
        if($scope.fields.contactDetailRequired){
            if($('#tickTitle').hasClass('matched') &&
            $('#tickFirstname').hasClass('matched') &&
            $('#tickLastname').hasClass('matched'))
                nameCompleted = true;
            else
                nameCompleted = false;
        }
        else{
            nameCompleted = true;
        }

        if($scope.fields.emailRequired && $scope.fields.emailRequired != "false"){
            if(($('#tickNewEmail').hasClass('matched') ||  $('#txtNewEmail').hasClass('input-disabled')) &&
            ($('#tickConfirmEmail').hasClass('matched') || $('#txtConfirmEmail').hasClass('input-disabled')))
                emailCompleted = true;
            else
                emailCompleted = false;
        }
        else{
            emailCompleted = true;
        }

        if($scope.fields.passwordRequired){
            if($('#tickNewPassword').hasClass('matched') &&
            $('#tickConfirmPassword').hasClass('matched'))
                passCompleted = true;
            else
                passCompleted = false;
        }
        else{
            passCompleted = true;
        }

        if($scope.fields.tcRequired){
            setTimeout(function(){
                if($('#ckbTerms.md-checked').length)
                    tcCompleted = true;
                else
                    tcCompleted = false;
            }, 80);
        }
        else{
            tcCompleted = true;
        }
        setTimeout(function(){
            if(nameCompleted && emailCompleted && passCompleted && tcCompleted)
                $('#btnUSUContinue').attr("disabled", false);
            else
                $('#btnUSUContinue').attr("disabled", true);
        }, 100);  
    }

    function getSQtoken(){
        var queryParams = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            queryParams[key] = value;
        });
        return queryParams['SQToken'];
    }

    function showContent(){
        $('.content').css('display','block');
        $('.loadingAnimation').css('display','none');
    }
    function showAnimation(){
        $('.content').css('display','none');
        $('.loadingAnimation').css('display','block');
    }

}]);

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
                    scope.ssoForm.confirmEmail.$setValidity("emailmatch", true);
                else   
                    scope.ssoForm.confirmEmail.$setValidity("emailmatch", false);
                if(modelValue.length <8){
                    scope.ssoForm.newEmail.$setValidity("pattern", true);
                    return true;
                }
            }
            else if(modelValue == ""){
                if(!$('#txtConfirmEmail').val()){
                    scope.ssoForm.confirmEmail.$setValidity("emailmatch", true);
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