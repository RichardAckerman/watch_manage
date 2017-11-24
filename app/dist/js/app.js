'use strict';
// Declare app level module which depends on views, and components

var app = angular.module('watchApp', ['ngRoute', 'ngCookies', 'watchApp.editUserInfo', 'watchApp.personal', 'watchApp.head', 'watchApp.password', 'watchApp.customer', 'watchApp.position', 'watchApp.version', 'watchApp.api', 'watchApp.service', 'watchApp.login', 'watchApp.updateEquip', 'watchApp.searchEquips', 'watchApp.searchCustomers', 'watchApp.addEquip', 'watchApp.addCustomer', 'watchApp.showCustomer', 'watchApp.transferCustomer', 'watchApp.rightMenu', 'watchApp.baiduMap', 'watchApp.moveEquip', 'watchApp.googleMap', 'watchApp.confirm']);
app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    // $locationProvider.html5Mode(true); //消除路由中的#
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({ redirectTo: '/login' });
}]);
app.directive('loading', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div class="divModal">\n                        <p class="loadingFont">\u52A0\u8F7D\u4E2D,\u8BF7\u7A0D\u7B49\xB7\xB7\xB7</p>\n                    </div>',
        link: function link(scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val) $(element).show();else $(element).hide();
            });
        }
    };
});