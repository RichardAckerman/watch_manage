'use strict';

var rightMenu = angular.module('watchApp.rightMenu', []);
rightMenu.controller('rightMenuCtrl', ['$scope', 'dealer', 'pathLogin', 'errorMsg', 'confirmService', function ($scope, dealer, pathLogin, errorMsg, confirmService) {
    $scope.rightMenuList = {
        'addCus': '新增客户',
        'resetPwd': '重置密码',
        'delCus': '删除客户',
        'editInfo': '编辑信息'
    };
    $scope.$on('dealerMsg', function (event, data) {
        $scope.dealerInfo = data ? data : {};
    });
    $scope.menuFun = function (param) {
        switch (param) {
            case 'addCus':
                angular.element('#addCustomer').modal('toggle');
                break;
            case 'resetPwd':
                if ($scope.dealerInfo.userId === undefined) {
                    return false;
                }
                var content = '确定重置密码吗？';
                confirmService.openConfirmWindow($scope, content).then(function () {
                    dealer.resetPwd($scope.dealerInfo.userId).success(function (res) {
                        if (res.code === 408) {
                            pathLogin.path($scope);
                        } else {
                            $scope.$emit('transformEquip', { msg: res.msg, sign: false });
                        }
                    }).error(function () {
                        $scope.$emit('transformEquip', { msg: errorMsg.serviceException, sign: false });
                    });
                });
                break;
            case 'delCus':
                if ($scope.dealerInfo.userId === undefined || $scope.dealerInfo.equipNum > 0) {
                    $scope.$emit('transformEquip', { msg: errorMsg.delFail, sign: false });
                    return false;
                }
                var msg = '确定删除客户吗？';
                confirmService.openConfirmWindow($scope, msg).then(function () {
                    dealer.delCus($scope.dealerInfo.userId).success(function (res) {
                        if (res.code === 408) {
                            pathLogin.path($scope);
                        } else {
                            $scope.$emit('transformEquip', { msg: res.msg, sign: true, func: 'delCus' });
                        }
                    }).error(function () {
                        $scope.$emit('transformEquip', { msg: errorMsg.serviceException, sign: false });
                    });
                });
                break;
            case 'editInfo':
                angular.element('#showCustomer').modal('toggle');
                break;
            default:
                break;
        }
    };
}]);