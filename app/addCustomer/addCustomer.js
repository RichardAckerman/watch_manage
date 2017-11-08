"use strict";
let addCustomer = angular.module('watchApp.addCustomer', []);
addCustomer.controller('addCustomerCtrl',
    ["$scope", "dealer", "errorMsg", "closeWind", "pathLogin",
        function ($scope, dealer, errorMsg, closeWind, pathLogin) {
            $scope.warnMsg = true;
            $scope.sucMsg = true;
            $scope.$on('superiorInfo', function (event, data) {
                $scope.superiorId = data.id;
            });
            $scope.addCustomer = function () {
                if ($scope.userName === undefined || $scope.userName === '') {
                    $scope.warnMessage = errorMsg.emptyUserName;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                    return;
                }
                let regex =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                if (!regex.test($scope.email) || $scope.email === undefined || $scope.email === '') {
                    $scope.warnMessage = errorMsg.email;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                    return;
                }
                if ($scope.password === undefined || $scope.password === '') {
                    $scope.warnMessage = errorMsg.password.required;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                    return;
                }
                if ($scope.password !== $scope.affirm) {
                    $scope.warnMessage = errorMsg.password.diff;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                    return;
                }
                let phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
                if ($scope.phone !== '' && $scope.phone !== undefined && !phoneReg.test($scope.phone)) {
                    $scope.warnMessage = errorMsg.phoneError;
                    $scope.warnMsg = false;
                    closeWind.close('.notice', $scope);
                    return;
                }
                let param = {
                    'userName': $scope.userName,
                    'email': $scope.email,
                    'psw': $scope.password,
                    'superiorId': $scope.superiorId,
                    'type': 2,
                    'linkman': $scope.linkman,
                    'dealerPhone': $scope.phone,
                    'dealerAddress': $scope.address
                };
                dealer.addCus(param)
                    .success(function (res) {
                        if (res.code === 200 && res.result !== undefined) {
                            closeWind.close('#addCustomer', $scope);
                            res.sign = res.successful;
                            $scope.$emit('transformEquip', res);
                        } else if (res.code === 408) {
                            $scope.warnMessage = errorMsg.loginGetaway;
                            closeWind.close('#addCustomer', $scope);
                            pathLogin.path($scope);
                        } else {
                            $scope.warnMessage = res.msg;
                            $scope.warnMsg = false;
                            closeWind.close('#addCustomer', $scope);
                        }
                    })
                    .error(function () {
                        $scope.warnMessage = errorMsg.serviceException;
                        $scope.warnMsg = false;
                        closeWind.close('#addCustomer', $scope);
                    });
            }
        }]);