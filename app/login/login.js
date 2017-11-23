'use strict';

let login = angular.module('watchApp.login', []);
login.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
    });
}]);
login.controller('loginCtrl', ['$scope', 'authService', '$location', 'uuid', '$timeout', 'errorMsg', '$window', function ($scope, authService, $location, uuid, $timeout, errorMsg, $window) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.signInData = {};
    $scope.signInData.email = $window.localStorage['email'];
    if ($scope.signInData.email !== undefined) {
        $scope.remember = true;
    }
    $scope.signIn = function () {
        /** @namespace $scope.signInData */
        $scope.signInData.cid = uuid;
        authService
            .signIn($scope.signInData)
            .success(function (res) {
                if (res.code === 200) {
                    $location.url('/customer');
                    let storage = $window.localStorage;
                    if ($scope.remember) {
                        storage['email'] = $scope.signInData.email;
                    } else {
                        storage.removeItem("email");
                    }
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    let closePasswordWind = $timeout(function () {
                        $scope.warnMsg = true;
                        $timeout.cancel(closePasswordWind);
                    }, 1500);
                }
            })
            .error(
                function () {
                    $scope.warnMessage = errorMsg.serviceException;
                    $scope.warnMsg = false;
                    let closePasswordWind = $timeout(function () {
                        $scope.warnMsg = true;
                        $timeout.cancel(closePasswordWind);
                    }, 1500);
                }
            );
    };
}]);




