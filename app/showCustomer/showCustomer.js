'use strict';
let showCustomer = angular.module('watchApp.showCustomer', []);
showCustomer.controller('showCustomerCtrl', ['$scope', 'userInfo', 'closeWind', 'pathLogin', 'errorMsg', 'dealer',
    function ($scope, userInfo, closeWind, pathLogin, errorMsg, dealer) {
        $scope.warnMsg = true;
        $scope.sucMsg = true;
        $scope.$on('customerInfo', function (event, data) {
            $scope.currentCus = data;
            $scope.userInfoForm = {};
        });
        //右键传过来的客户email
        $scope.$on('dealerMsg', function (event, data) {
            let param = {
                'info': data.email
            };
            dealer.queryByEmail(param)
                .success(function (res) {
                    if (res.code === 200 && res.result !== undefined) {
                        $scope.currentCus = res.result;
                    } else if (res.code === 408) {
                        $scope.warnMessage = errorMsg.loginGetaway;
                        closeWind.close('#searchCustomers', $scope);
                        pathLogin.path($scope);
                    } else {
                        $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                        $scope.warnMsg = false;
                        closeWind.close('#searchCustomers', $scope);
                    }
                })
                .error(function () {
                    $scope.warnMessage = errorMsg.serviceException;
                    $scope.warnMsg = false;
                    closeWind.close('#searchCustomers', $scope);
                });
        });
        $scope.updUserInfo = function () {
            let phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
            if ($scope.userInfoForm.dealerPhone !== '' && $scope.userInfoForm.dealerPhone !== undefined && !phoneReg.test($scope.userInfoForm.dealerPhone)) {
                $scope.warnMessage = errorMsg.phoneError;
                $scope.warnMsg = false;
                closeWind.close('.notice', $scope);
                return;
            }
            let data = {
                'id': $scope.currentCus.id,
                'email': $scope.currentCus.email,
                'userName': $scope.userInfoForm.userName ? $scope.userInfoForm.userName : $scope.currentCus.userName,
                'linkman': $scope.userInfoForm.linkman ? $scope.userInfoForm.linkman : $scope.currentCus.linkman,
                'dealerPhone': $scope.userInfoForm.dealerPhone ? $scope.userInfoForm.dealerPhone : $scope.currentCus.dealerPhone,
                'dealerAddress': $scope.userInfoForm.dealerAddress ? $scope.userInfoForm.dealerAddress : $scope.currentCus.dealerAddress
            };
            userInfo.updateSubordinate(data)
                .success(function (res) {
                    if (res.code === 200) {
                        $scope.successMessage = res.msg;
                        $scope.sucMsg = false;
                        closeWind.close('#showCustomer', $scope);
                        $scope.$emit('dealerInfoChange', data);
                    } else if (res.code === 408) {
                        $scope.warnMessage = errorMsg.loginGetaway;
                        closeWind.close('#showCustomer', $scope);
                        pathLogin.path($scope);
                    } else {
                        $scope.warnMessage = res.msg;
                        $scope.warnMsg = false;
                        closeWind.close('#showCustomer', $scope);
                    }
                })
                .error(function () {
                    $scope.warnMessage = errorMsg.serviceException;
                    $scope.warnMsg = false;
                    closeWind.close('#showCustomer', $scope);
                });
        };
        $scope.$on('$destroy', function () {
            closeWind.cancel();
            pathLogin.cancel();
        });
    }]);