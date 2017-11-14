'use strict';

let transferCustomer = angular.module('watchApp.transferCustomer', []);
transferCustomer.controller('transferCustomerCtrl', ['$scope', 'library', 'errorMsg', 'pathLogin', 'closeWind',
    function ($scope, library, errorMsg, pathLogin, closeWind) {
        $scope.allUser = null;
        $scope.$on('allUserInfo', function (event, data) {
            $scope.allUser = data;
        });
        $scope.$on('transformInfo', function (event, data) {
            $scope.equipId = data.equipId;
            $scope.userId = data.userId;
        });
        $scope.customerClick = function (user) {
            let params = {
                id: $scope.equipId,
                newDealerId: user.userId
            };
            if ($scope.equipId === undefined) {
                $scope.$emit('batchTrans', user);
            } else {
                if (parseInt(user.userId) === parseInt($scope.userId)) {
                    $scope.$emit('transformEquip', {msg: errorMsg.duplication, sign: false});
                    return false;
                }
                library
                    .transform(params)
                    .success(function (res) {
                        if (res.code === 200) {
                            closeWind.close('#searchEquips', $scope);
                        } else if (res.code === 408) {
                            pathLogin.path($scope);
                        }
                        $scope.$emit('transformEquip', {msg: res.msg, sign: res.successful, ids: [$scope.equipId]});
                    })
                    .error(function () {
                        $scope.$emit('transformEquip', {msg: errorMsg.serviceException, sign: false});
                    });
            }
        }
    }]);