'use strict';

angular.module('SSO.statuspage')
    .service('statusService', ['$http', '$q', function($http, $q) {
        return {
            loadStatusConfig: function(){
                return $http.get('configs/statusconfig.json');
            }
        };

    }]);
