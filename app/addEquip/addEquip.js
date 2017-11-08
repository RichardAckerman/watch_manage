"use strict";
let addEquip = angular.module('watchApp.addEquip', []);
addEquip.controller('addEquipCtrl', ["$scope", "$rootScope", "library", "closeWind", "pathLogin", "errorMsg", function ($scope, $rootScope, library, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.$on('superiorInfo', function (event, data) {
        $scope.dealerInfo = data;
    });
    $scope.addEquip = function () {
        let reg = /^\d{15}$/g;
        if (!reg.test($scope.imei)) {
            $scope.warnMessage = errorMsg.imeiError.imeiFormat;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return false;
        }
        let data = {
            'imei' : $scope.imei,
            'dealerId':$scope.dealerInfo.id,
            'superiorId':$scope.dealerInfo.superiorId,
        };
        library
            .put(data)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = res.msg;
                    $scope.sucMsg = false;
                    $scope.$emit('addEquip', res.result);
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                }
                closeWind.close('#addEquip', $scope);
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#addEquip', $scope);
            });
    };
}]);