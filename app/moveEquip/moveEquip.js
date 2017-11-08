'use strict';
let transferEquip = angular.module('watchApp.moveEquip', []);
transferEquip.controller('moveEquipCtrl', function ($scope, library, closeWind, pathLogin, errorMsg, dealer) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.dropDown = function ($event) {
        $event.stopPropagation();
        $scope.$emit('modalTransfer', {event: $event});
    };
    $scope.$on('batchTransModal', function (event, data) {
        $scope.aimCustomer = data.userName;
        $scope.aimCusId = data.userId;
    });
    $scope.$on('batchEquipsInfo', function (event, data) {
        data.equips.forEach(function (v, k) {
            if (v.userId !== undefined) {
                dealer.queryById(v.userId)
                    .success(function (res) {
                        if (res.code === 200 && res.result !== undefined) {
                            v.dealerName = res.result.userName;
                        } else if (res.code === 408) {
                            $scope.warnMessage = errorMsg.loginGetaway;
                            closeWind.close('#moveEquip', $scope);
                            pathLogin.path($scope);
                        } else {
                            $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                            $scope.warnMsg = false;
                            closeWind.close('#moveEquip', $scope);
                        }
                    })
                    .error(function () {
                        $scope.warnMessage = errorMsg.serviceException;
                        $scope.warnMsg = false;
                        closeWind.close('#moveEquip', $scope);
                    });
            }
        });
        $scope.equips = data.equips;
        $scope.currentUser = data.userId;
    });
    $scope.del = function (i) {
        $scope.equips.splice(i,1);
    };
    $scope.pushEquip = function () {
        if ($scope.imeiNumber === '' || $scope.imeiNumber === undefined) {
            $scope.warnMessage = errorMsg.imeiError.imeiEmpty;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
        }
        library.queryByImei($scope.imeiNumber)
            .success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    $scope.queryById(res.result);
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#moveEquip', $scope);
            });
    };
    // 通过id查询所属用户
    $scope.queryById = function (equip) {
        if (equip.userId === '' || equip.userId === undefined) {
            $scope.equips.push(equip);
            return false;
        }
        dealer.queryById(equip.userId)
            .success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    equip.dealerName = res.result.userName;
                    $scope.equips.push(equip);
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#moveEquip', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#moveEquip', $scope);
            });
    };
    $scope.transEquip = function () {
        if ($scope.aimCustomer === undefined || $scope.aimCustomer === "") {
            $scope.warnMessage = errorMsg.aimEmpty;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return false;
        }
        if ($scope.equips.length === 0) {
            $scope.warnMessage = errorMsg.equipEmpty;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return false;
        }
        let param = {
            ids: [],
            newDealerId: $scope.aimCusId
        };
        if (parseInt($scope.currentUser) === parseInt($scope.aimCusId)){
            $scope.$emit('transformEquip', {msg: errorMsg.duplication, sign: false});
            return false;
        }
        $scope.equips.forEach(function (v, i) {
            param.ids.push(v.id)
        });
        library
            .batchTransform(param)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.$emit('transformEquip', {msg: res.msg, sign: res.successful, ids: param.ids});
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                }
                closeWind.close('#moveEquip', $scope);
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#moveEquip', $scope);
            })
    }
});