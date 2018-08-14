(function () {
    'use strict';
angular.module('SSO.toast').service('toastService', ['$http', '$q', '$state', function($http, $q, $state) {

    var timer = 0;
    var timeoutDuration = 900;
    var deferred = $q.defer();

    var showToast = function(type, msg, action){

        // var x = document.getElementById("toast")
        // x.className = "show " + type;
        // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

        var toast = $('#toast');
        var toastmsg = $('#toast #toastmessage');
        var toastact = $('#toast #toastaction');

        if(type){
            toast.addClass(type);
        }

        if(msg)
            toastmsg.text(msg);
        else{
            toastmsg.text("");
            return;
        }

        if(action){
            toastmsg.append("<br/><br/>");
            toastact.html(action);
        }
        else
            toastact.html("");

        toast.addClass("show");

        setTimeout(function(){ 
            toast.removeClass("show");
            toast.removeClass(type);
        }, 3000);

    };


  return {
    loadConfig: function(){
        $http.get('/sso/modules/common/components/toast-msg/idle.conf.json').then(function(response){
            //Set timeout duration in seconds. 15min = "900"
            timeoutDuration = parseFloat(response.data.timeoutDuration);
        });
    },
    startTimer: function(){
        var start = new Date().getTime(),
            elapsed = '0.0';

        clearTimer();
        timer = setInterval(function()
        {
            var time = new Date().getTime() - start;

            elapsed = Math.floor(time / 100) / 10;
            if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }

//            document.title = elapsed;

            if(elapsed > (timeoutDuration - 60)){
                showModal();
                if(elapsed > timeoutDuration){
                    hideModal();
                    window.location.href = urlService.getLogoutURL('statuspage') + "sessiontimeout";
                    clearTimer();
                }
            }

        }, 100);
    },
    showToast: showToast
  };

}]);
}());