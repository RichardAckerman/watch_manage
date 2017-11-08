'use strict';
let personalInfo = angular.module('watchApp.personal', []);
personalInfo.controller('personalCtrl', function ($scope, userInfo, closeWind, pathLogin, reloadRoute, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updPersonal = function () {
        let date = {
            'email': $scope.userAdmin.email,
            'userName': $scope.personalForm.userName,
            'linkman': $scope.personalForm.linkman,
            'dealerPhone': $scope.personalForm.dealerPhone,
            'dealerAddress': $scope.personalForm.dealerAddress
        };
        userInfo.update(date)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = res.msg;
                    $scope.sucMsg = false;
                    closeWind.close('#personalInfo', $scope);
                    reloadRoute.path($scope);
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#personalInfo', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#personalInfo', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#personalInfo', $scope);
            });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
        reloadRoute.cancel();
    });
});
