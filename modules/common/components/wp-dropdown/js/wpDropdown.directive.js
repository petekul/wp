
angular.module('SSO.wpDropdown', []).directive('wpDropdown', function(){
    return{

        replace:'true',
        scope: {
            selected:"=",
            options:"=",
            ngChange:"&"
        },
        templateUrl:'/sso/modules/common/components/wp-dropdown/templates/wpDropdown.tmpl.html',
        link: function(scope, element, attrs) {

            scope.select = function(name){
                scope.selected = name;
                element.toggleClass('selected');
                $('#cmbTitle').css('color','#393939');
                $('#cmbTitle').find('i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            }
            scope.expand = function(){
                $('#cmbTitle').find('i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
            }
        }
    }
});

