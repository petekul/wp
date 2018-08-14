var app = angular.module("SSO.securityquestions");

app.controller("SQController",["$scope","$stateParams", "$state", "SQService", "urlService","idleService", function($scope, $stateParams, $state, SQService, urlService, idleService){
    var attempts=0;

    $scope.questions = [];
    $scope.userEmail="someemail";

    //directive placeholders
    var directive = {};
    var SQToken = "sometoken";

    SQService.getSecurityQuestions(directive,urlService.getBackURL()).then(function(response){

        idleService.startTimer();
        //if success
        $scope.userEmail = response.data.userName;
        $scope.questions = response.data.securityQuestions;
        $scope.originalQuestions = jQuery.extend(true, [], $scope.questions);

        //TODO Get email here not from userscheme
//        $scope.userEmail = routingService.getUserEmail();

        //if no questions returned, or directive is NOSQ, then go to next state
        if($scope.questions.length == 0 || $scope.questions.directive === "NOSQ"){
            //TODO server will handle this
//            $state.go(routingService.getNextState());
             window.location.href = response.data.nextLink;
        }
        else{
            showContent();
        }
        
    }, function(e){
        //if error display specific message to SQ so we can collect info from customer through telephone.
        //TODO separate error app and do redirect to error app
        // $state.go("app.error", {"errormsg":"noSQinfo"});
        window.location.href = urlService.getLogoutURL("statuspage") + "noSQinfo";
    });
    SQService.loadSQConfig().then(function(response){
        idleService.startTimer();
        var SQConfig = response.data;
        $scope.midConfig = SQConfig[SQConfig.map(x => x.questionType).indexOf("MID")];
        $scope.postcodeConfig = SQConfig[SQConfig.map(x => x.questionType).indexOf("POSTCODE")];
        $scope.contactConfig = SQConfig[SQConfig.map(x => x.questionType).indexOf("LASTNAME")];
    });

    $scope.onKeyUp = function(i){
        //hides error messages when input fields are full
        txtElem = "#txtAnswer" + i;
        incElem = "#pIncorrect" + i;
        if($(txtElem).attr("class").includes("MID") && $(txtElem).val().length >= $scope.midConfig.minFieldLength){
            hideError(txtElem, incElem);
        }
        else if($(txtElem).attr("class").includes("POSTCODE") && $(txtElem).val().length >= $scope.postcodeConfig.minFieldLength){
            hideError(txtElem, incElem);
        }
        else if($(txtElem).attr("class").includes("LASTNAME") && $(txtElem).val().length > $scope.contactConfig.minFieldLength){
            hideError(txtElem, incElem);
        }

        //Force upper case for post codes
        if(this.questions[i-1].questionType == "POSTCODE" || this.questions[i-1].questionType == "LASTNAME")
            $(txtElem).val($(txtElem).val().toUpperCase());

        checkSubmitDisabled();
    }

    $scope.validateInput = function(qType, event){
        //Reads regex from config about what characters should be allowed in each of the fields.
        //prevents unallowed characters from being entered
        var regex = new RegExp();
        switch(qType){
            case "MID":
                regex = new RegExp($scope.midConfig.validRegex);
                break;
            case "POSTCODE":
                regex = new RegExp($scope.postcodeConfig.validRegex);
                break;
            case "LASTNAME":
                regex = new RegExp($scope.contactConfig.validRegex);
                break;
        }
        var _event = event || window.event;
        var key = _event.keyCode || _event.which;
        if(key == 8) //Needed to allow backspace in Firefox browsers.
            return;
        key = String.fromCharCode(key);
        if(!regex.test(key)) {
            _event.returnValue = false;
            if (_event.preventDefault)
                _event.preventDefault();
        }
    }

    $scope.expand = function(elem){
        elem = "#" + elem;
        $(elem).css("display") == "none" ? $(elem).css("display","block") : $(elem).css("display","none");
    }
    //TODO combine expand methods
    $scope.expandHint = function(hintindex){
        $scope.expand(hintindex);
        iconhintindex = "#icon" + hintindex;
        $(iconhintindex).find("i").toggleClass("glyphicon-question-sign").toggleClass("glyphicon-minus-sign");
    }

    $scope.reloadSQ = function(returnedSQ){
        $scope.questions = returnedSQ;
    }

    $scope.submitForm = function() {
        var answers = {};
        var successFlag = false
        this.questions = jQuery.extend(true, [], this.originalQuestions);
        for(var i = 0; i < this.originalQuestions.length; i++){
            ansElem = "#txtAnswer" + (i+1);
            this.questions[i].answer += $(ansElem).val();
        }
        showAnimation();
        answers.securityQuestions = this.questions;

        SQService.postAnswers(answers, urlService.getBackURL()).then(function(response){
            idleService.startTimer();
            if(response.data.disabled == true){
                window.location.href = urlService.getLogoutURL("statuspage") + "accountdisabled";
                // $state.go("app.accountdisabled");
                return;
            }

            if(response.data.securityQuestions.length > 0 ){
                this.reloadSQ(response.data.securityQuestions);
            	successFlag = false;
                for(var i = 0; i < this.questions.length; i++){
                    switch (this.questions[i].questionType){
                        case "MID":
                            clearUserInputAndDisplayError("MID");
                            break;
                        case "POSTCODE":
                            clearUserInputAndDisplayError("POSTCODE");
                            break;
                        case "LASTNAME":
                            clearUserInputAndDisplayError("LASTNAME");
                            break;
                        default:
                            console.log("no further questions found");
                    }
                }
                checkSubmitDisabled();
            }

            else{
                //if no questions are returned, user has answered SQ correctly. go to next state.
                //TODO redirect and pass SQ token
                //server redirects to next state. app no longer handles states
//                $state.go(routingService.getNextState(), {"SQtoken":response.data.sqtoken});
                successFlag = true;
                window.location.href = response.data.nextLink;
                return;
            }
            showContent();
        }.bind($scope), function(e){
            //if post fails, display error pages
            idleService.startTimer();
            successFlag = false;
            //TODO i2 server will handle this

            window.location.href = urlService.getLogoutURL("statuspage") + e.status;

            // $state.go("app.error", {"errormsg":e.status});
        });
    }

    function clearUserInputAndDisplayError(type){
        for(var i = 1; i <= $scope.originalQuestions.length; i++){
            var ansElem = "#txtAnswer" + i;
            var incElem = "#pIncorrect" + i;
            if($(ansElem).attr("class").includes(type)){
                $(ansElem).val("");
                $(ansElem).css("border-color", "red");
                $(incElem).css("display","block");
                break;
            }
        }
    }

    function hideError(txt, inc){
        $(inc).css("display","none");
        $(txt).css("border-color", "#ccc");
    }

    function checkSubmitDisabled(){
        //Check all question answers to make sure a viable input entered before enabling the submit button.
        var preDisabledFlag = false;
        var disabledFlag = true;
        //TODO config regex && use switch
        for(var i = 1; i <= $scope.questions.length; i++){
            var elem = "#txtAnswer" + i;
            if ($(elem).attr("class").includes("LASTNAME") && $(elem).val().length > $scope.contactConfig.minFieldLength && !preDisabledFlag)
                disabledFlag = false;
            else if ($(elem).attr("class").includes("POSTCODE") && $(elem).val().length >= $scope.postcodeConfig.minFieldLength && !preDisabledFlag)
                disabledFlag = false;
            else if ($(elem).val().length >= $scope.midConfig.minFieldLength && !preDisabledFlag)
                disabledFlag = false;
            else
                disabledFlag = true;
            preDisabledFlag = disabledFlag;
        }
        disabledFlag ? $("#btnSubmitSQ").prop("disabled", true) : $("#btnSubmitSQ").attr("disabled", false);
    }

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
