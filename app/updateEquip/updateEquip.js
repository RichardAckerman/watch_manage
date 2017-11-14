'use strict';
let updateEquip = angular.module('watchApp.updateEquip', []);
updateEquip.controller('updateEquipCtrl', ["$scope", "library", "closeWind", "pathLogin", "errorMsg", function ($scope, library, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updEquip = function () {
        let regName = /^\d+$/;
        if (regName.test($scope.equipForm.equipName)) {
            $scope.warnMessage = errorMsg.imeiError.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        let phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.equipForm.sim !== '' && $scope.equipForm.sim !== undefined && !phoneReg.test($scope.equipForm.sim)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        let data = {
            'imei': $scope.equip.imei,
            'id': $scope.equip.id,
            'equipName': $scope.equipForm.equipName ? $scope.equipForm.equipName : $scope.equip.equipName,
            'sim': $scope.equip.sim,
            'remark': $scope.equipForm.remark ? $scope.equipForm.remark : $scope.equip.remark,
            'createTime': null,
            'activationTime': null
        };
        library.update(data)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = res.msg;
                    $scope.sucMsg = false;
                    $scope.$emit('equipData', data);
                    closeWind.close('#updateEquip', $scope);
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#updateEquip', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#updateEquip', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#updateEquip', $scope);
            });
    };
    $scope.clearPhone = function () {
        if ($scope.equip === undefined) {
            return;
        }
        library
            .resetPhone($scope.equip.id)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = res.msg;
                    $scope.sucMsg = false;
                    $scope.equip.sim = "";
                    closeWind.close('#updateEquip', $scope);
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#updateEquip', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#updateEquip', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#updateEquip', $scope);
            });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
    });
}]);