(function() {
    'use strict';

    angular.module('SSO.analytics').service('analyticsConfigService', function($http, $q) {
      var config;

      return {
        loadAnalyticsConfig: function(){
            return $http.get('views/assets/analytics/config/config.json');
        }
      };

    });
})();