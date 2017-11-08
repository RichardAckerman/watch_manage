'use strict';

let head = angular.module('watchApp.head', []);
head.controller('headCtrl', function ($scope, authService, $location, confirmService) {
    $scope.logOut = function () {
        let content = '确认退出吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            authService.signOut().success(function (res) {
                if (res.code === 200) {
                    $location.path('/login');
                }
            });
        });
    };
    $scope.isActive = $location.url();
});