var app = angular.module('SSO.manageaccount');

app.controller('maController',['$scope','$stateParams', '$state', 'maService', 'urlService', 'idleService', function($scope, $stateParams, $state, maService, urlService, idleService){
    
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

     $scope.saveDetails = function(){
        var details = {};
        details.title = $('#cmbTitle').text().trim();
        details.firstName = $('#txtFirstname').val();
        details.lastName = $('#txtLastname').val();

        maService.postDetails(details).then(function(response){
            //close section
            var target = document.querySelector('#frmDetails');
            var content = target.querySelector('.slideable_content');
                if(target.getAttribute('expanded') == 'false') {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                    target.style.marginBottom = '24px';
                } else {
                    target.style.height = '0px';
                    target.style.marginBottom = '0px';
                }

                //ES6
                target.getAttribute('expanded') == 'true' ? target.setAttribute('expanded', 'false') : target.setAttribute('expanded', 'true');
                    
        
            //show saving animation
            this.request.saving = !this.request.saving;

            if(!this.request.saving){
                setTimeout(function () {
                    $('.savedsuccess').addClass("fadeout");
                }, 3000);
            }
            
            //200 ok, show saved successful message

        }.bind($scope), function(e){
            
        });

        //DO STUFF

        


    };
     $scope.saveEmail = function(){
        maService.postPassword(answers, SQtoken).then(function(response){

        }.bind($scope), function(e){

        });
    };
    $scope.savePassword = function(){
        showAnimation();
        var answers = {};
        answers.password = $('#txtConfirmPassword').val();
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

    $scope.checkTitleSelected = function(){
        if($('#cmbTitle').hasClass('ng-pristine'))
        // if($('#cmbTitle').hasClass('ng-pristine') && $('.md-select-menu-container').hasClass('md-leave'))
            $('#cmbTitle').css('border-color', 'rgb(221,44,0)');
        else
            $('#cmbTitle').css('border-color', '');
    }

    $scope.onChange = function(el){
        hideErrors("Password");
        if($('#tickConfirmPassword').hasClass('matched')){
            
        }
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
                    target.style.marginBottom = '15px';
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
