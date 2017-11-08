'use strict';
let editUserInfo = angular.module('watchApp.editUserInfo', []);
editUserInfo.controller('editUserInfoCtrl', function ($scope, $rootScope, userInfo, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updUserInfo = function () {
        let phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.userInfoForm.dealerPhone !== '' && $scope.userInfoForm.dealerPhone !== undefined && !phoneReg.test($scope.userInfoForm.dealerPhone)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        let data = {
            'id': $scope.userDealer.id,
            'email': $scope.userDealer.email,
            'userName': $scope.userInfoForm.userName ? $scope.userInfoForm.userName : $scope.userDealer.userName,
            'linkman': $scope.userInfoForm.linkman ? $scope.userInfoForm.linkman : $scope.userDealer.linkman,
            'dealerPhone': $scope.userInfoForm.dealerPhone ? $scope.userInfoForm.dealerPhone : $scope.userDealer.dealerPhone,
            'dealerAddress': $scope.userInfoForm.dealerAddress ? $scope.userInfoForm.dealerAddress : $scope.userDealer.dealerAddress
        };
        userInfo.updateSubordinate(data)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = res.msg;
                    $scope.sucMsg = false;
                    closeWind.close('#editUserInfo', $scope);
                    $scope.$emit('dealerData', data);
                    if ($scope.messageType === '我的信息') {
                        $rootScope.userDealer.userName = data.userName;
                    }
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#editUserInfo', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#editUserInfo', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#editUserInfo', $scope);
            });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
    });
});