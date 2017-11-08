'use strict';
let updateEquip = angular.module('watchApp.updateEquip', []);
updateEquip.controller('updateEquipCtrl', ["$scope", "library", "closeWind", "pathLogin", "errorMsg", function ($scope, library, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updEquip = function () {
        let data = {
            'imei': $scope.equip.imei,
            'id': $scope.equip.id,
            'equipName': $scope.equipForm.equipName,
            'sim': $scope.equipForm.sim,
            'remark': $scope.equipForm.remark,
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
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
    });
}]);