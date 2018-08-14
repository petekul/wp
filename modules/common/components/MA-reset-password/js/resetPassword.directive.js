var app = angular.module('SSO.resetpassword',[]);

app.directive('resetPassword', function(){
    return{
        //WORK?
        replace:'true',
        scope: {
            passwordTitle:"=",
            passwordSubtitle:"=",
            ngModel:"=",
            ngChange:"&"
//          TODO add ngChange to reset pw && choose new password hope it works
        },
        templateUrl:'../common/components/MA-reset-password/templates/resetPassword.tmpl.html',
        link: function(scope, element, attrs) {
            var minFlag, capFlag, numFlag, invalidChars;
            scope.onChange = function(){
                var pass = $('#txtNewPassword').val();
                var confirmPass = $('#txtConfirmPassword').val();
                    //test password length
                if(checkLength(pass)){
                    minFlag=true;
                    showTick($('#tickMin'));
                    $('#criteriaMin').css("color","#919191");
                }
                else{
//                    if($('#tickMin').hasClass('matched')){
                        minFlag=false;
                        hideTick($('#tickMin'));
//                    }
                }
                    //test lower & upper case1
                if(hasLowerCase(pass) & hasUpperCase(pass)){
                    capFlag=true;
                    showTick($('#tickCap'));
                    $('#criteriaCap').css("color","#919191");
                }
                else{
//                    if($('#tickCap').hasClass('matched')){
                        capFlag=false;
                        hideTick($('#tickCap'));
//                    }
                }
                    //test number exists
                if(hasNumber(pass)){
                    numFlag=true;
                    showTick($('#tickNum'));
                    $('#criteriaNum').css("color","#919191");
                }
                else{
//                    if($('#tickNum').hasClass('matched')){
                        numFlag=false;
                        hideTick($('#tickNum'));
//                    }
                }
                    //test symbol exists
                if(hasSymbol(pass)){
                    showTick($('#tickSym'));
                }
                else{
//                    if($('#tickSym').hasClass('matched')){
                        hideTick($('#tickSym'));
//                    }
                }
                    //show validation tick
                if(minFlag && capFlag && numFlag){
                    $('#tickNewPassword').css("display","block");
                    showTick($('#tickNewPassword'));
                }
                else{
                    $('#tickNewPassword').css("display","none");
                    hideTick($('#tickNewPassword'));
                }

                checkInvalidChars();

                if(checkMatching(pass, confirmPass) && minFlag && capFlag && numFlag && validChars && pass != ""){
                    $('#tickConfirmPassword').css("display","block");
                    showTick($('#tickConfirmPassword'));
                    $('#btnContinue').attr("disabled", false);
                    // $('#pwNotMatch').css("display", "none");
                    $('#errorPassword').css("display", "none");
                    // $('#txtConfirmPassword').css("border-color", "rgb(204,204,204)");
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else if(checkMatching(pass, confirmPass)){
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else{
                    $('#tickConfirmPassword').css("display","none");
                    hideTick($('#tickConfirmPassword'));
                    $('#btnContinue').attr("disabled", true);
                    $('#errorPassword').css("display", "none");
                    // if($('#txtConfirmPassword').val().length >= 8){
                        this.pwForm.confirmPass.$setValidity("passwordmatch", false);
                    // }
                }
            }

            function checkInvalidChars(){
            //refine this regex. for invalid password characters
                if($('#txtNewPassword').val() == "" || /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test($('#txtNewPassword').val())){
                    // $('#txtNewPassword').css("border-color", "");
                    $('#invalidCharacters').css("display", "none");
                    validChars = true;
                }
                else{
                    // $('#txtNewPassword').css("border-color", "");
                    $('#invalidCharacters').css("display", "block");
                    $('#tickNewPassword').css("display","none");
                    $('#tickConfirmPassword').css("display","none");
                    validChars = false;
                }
            }

            scope.checkInvalidChars = function(){
            //refine this regex. for invalid password characters
                if($('#txtNewPassword').val() == "" || /^[a-zA-Z0-9'!@#$%\\^&*(){}[\]<>?\/|\-_+=~`'";:.,]+$/.test($('#txtNewPassword').val())){
                    $('#txtNewPassword').css("border-color", "#cccccc");  //changedHEREHEHRER
                    $('#invalidCharacters').css("display", "none");
                    $('#tickConfirmPassword').css("margin-top", "22px");
                    validChars = true;
                }
                else{
                    $('#txtNewPassword').css("border-color", "red");
                    $('#invalidCharacters').css("display", "block");
                    $('#tickNewPassword').css("display","none");
                    $('#tickConfirmPassword').css("display","none");
                    $('#tickConfirmPassword').css("margin-top", "59px");
                    invalidChars = false;
                }
            }

            scope.checkPasswordPolicy = function(pwForm){
                var pass = $('#txtNewPassword').val();
                if(!checkLength(pass)){
                    $('#criteriaMin').css("color","red");
                    $('#tickMin').css("color","red");
                    $('#tickMin').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                }
                else{
                    $('#criteriaMin').css("color","#919191");
                    $('#tickMin').css("color","");
                    $('#tickMin').removeClass('glyphicon-remove').addClass('glyphicon-ok');
                }
                if(!hasLowerCase(pass) || !hasUpperCase(pass)){
                    $('#criteriaCap').css("color","red");
                    $('#tickCap').css("color","red");
                    $('#tickCap').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                }
                else{
                    $('#criteriaCap').css("color","#919191");
                    $('#tickCap').removeClass('glyphicon-remove').addClass('glyphicon-ok');
                }
                if(!hasNumber(pass)){
                    $('#criteriaNum').css("color","red");
                    $('#tickNum').css("color","red");
                    $('#tickNum').removeClass('glyphicon-ok').addClass('glyphicon-remove');
                }
                else{
                    $('#criteriaNum').css("color","#919191");
                    $('#tickNum').css("color","");
                    $('#tickNum').removeClass('glyphicon-remove').addClass('glyphicon-ok');
                }

                if($('#criteriaMin').css("color") == "rgb(255, 0, 0)" || $('#criteriaCap').css("color") == "rgb(255, 0, 0)" || $('#criteriaNum').css("color") == "rgb(255, 0, 0)"){
                    this.pwForm.newPass.$setValidity("required", false);
                    this.pwForm.confirmPass.$setValidity("required", false);
                }
                else{
                    this.pwForm.newPass.$setValidity("required", true);
                    this.pwForm.confirmPass.$setValidity("required", true);
                    // $('.lblNewPassword').css("color", "");
                    // $('#txtNewPassword').css("border-color", "");
                }
            }

            scope.checkMatching = function(pwForm){
                var pass = $('#txtNewPassword').val();
                var confirmPass = $('#txtConfirmPassword').val();
                if(pass == "" && confirmPass == ""){
                    this.pwForm.confirmPass.$setValidity("passwordmatch", true);
                }
                else if(!checkMatching(pass, confirmPass)){
                    // $('#txtConfirmPassword').css("border-color", "");
                    // $('.lblConfirmPassword').css("color", "red");
                    // $('#pwNotMatch').css("display", "block");
                    this.pwForm.confirmPass.$setValidity("passwordmatch", false);
                }
                else{
                    // $('#txtConfirmPassword').css("border-color", "");
                    // $('.lblConfirmPassword').css("color", "");
                    // $('#pwNotMatch').css("display", "none");
                }
            }

            function showTick(el){
                el.removeClass('unmatched');
                el.addClass('matched');
                el.removeClass('glyphicon-remove').addClass('glyphicon-ok');   
                el.css("color","");
            }
            function hideTick(el){
                el.removeClass('matched');
                el.addClass('unmatched');
            }

            function checkLength(str){
                return str.length >= 8;
            }

            function hasLowerCase(str) {
                return str.toUpperCase() != str;
            }

            function hasUpperCase(str) {
                return str.toLowerCase() != str;
            }
            function hasNumber(str) {
              return /\d/.test(str);
            }
            function hasSymbol(str) {
                return /[!@#$%\^&*(){}[\]<>?/|\-=~`'";:.,]/.test(str);
            }
            function checkMatching(pass1, pass2){
                return (pass1 == pass2);
            }

            //    `~!@#$%^*()_-+={}[]\|/:;"'<>,.?

                //TODO for jasmine tests why must i use this.?
            this.checkLength = checkLength;
            this.hasLowerCase = hasLowerCase;
            this.hasUpperCase = hasUpperCase;
            this.hasNumber = hasNumber;
            this.hasSymbol = hasSymbol;
        }
    }
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