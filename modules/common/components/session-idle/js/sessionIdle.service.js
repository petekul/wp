"use strict";

angular.module("SSO.sessionIdle").service("idleService", ["$http", "$q", "$state", "urlService", function($http, $q, $state, urlService) {

    var timer = 0;
    var timeoutDuration = 900;
    var deferred = $q.defer();

    var logOut = function(){
        //TODO CHANGE THESE CHANGEME
        window.location.href = urlService.getLogoutURL("statuspage") + "sessiontimeout";
        clearTimer();
    };

    var timeOut = function(){
        var url = urlService.getLogoutURL("statuspage") + "sessiontimeout";
        var separator = (url.indexOf("?")===-1)?"?":"&";
        window.location.href = url + separator + "p_error_code=SSO-1";
        //TODO
    };

    //TODO add timeOut method

    var showModal = function(){
        if($("#idleModal").is(":hidden")){
            $("#idleModal").modal("show");
        }
    };

    var hideModal = function(){
        $(".modal-backdrop").remove();
        $("#idleModal").modal("hide");
    };

    var clearTimer = function(){
        clearInterval(timer);
    };

  return {
    loadConfig: function(){
        $http.get("/sso/modules/common/components/session-idle/idle.conf.json").then(function(response){
            //Set timeout duration in seconds. 15min = "900"
            timeoutDuration = parseFloat(response.data.timeoutDuration);
        });
    },
    startTimer: function(){
        var start = new Date().getTime(),
            elapsed = "0.0";

        clearTimer();
        timer = setInterval(function()
        {
            var time = new Date().getTime() - start;

            elapsed = Math.floor(time / 100) / 10;
            if(Math.round(elapsed) == elapsed) { elapsed += ".0"; }

//            document.title = elapsed;

            if(elapsed > (timeoutDuration - 60)){
                showModal();
                if(elapsed > timeoutDuration){
                    hideModal();
                    window.location.href = urlService.getLogoutURL("statuspage") + "sessiontimeout";
                    clearTimer();
                }
            }

        }, 100);
    },
    logOut: logOut,
    timeOut: timeOut,
    hideModal: hideModal
  };

}]);
