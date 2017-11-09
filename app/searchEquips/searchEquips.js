"use strict";
let searchEquips = angular.module('watchApp.searchEquips', []);
searchEquips.controller('searchEquipsCtrl', ["$scope", "library", "closeWind", "pathLogin", "ordinaryMsg", "errorMsg", "loginGetaway", "dealer", "$location", "$timeout",
    function ($scope, library, closeWind, pathLogin, ordinaryMsg, errorMsg, loginGetaway, dealer, $location, $timeout) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.recordNum = 0;
    $scope.$on('equipInfo', function (event, data) {
        $scope.customer = undefined;
        $scope.equip = data;
        $scope.recordNum = data ? 1 : 0;
        if (data.userId !== undefined) {
            $scope.searchDealerSub(data.userId);
        }
    });
    $scope.searchDealerSub = function (id) {
        dealer.queryById(180)
            .success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    $scope.customer = res.result;
                } else if (res.code === 408) {
                    $scope.warnMessage = errorMsg.loginGetaway;
                    closeWind.close('#searchEquips', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                    $scope.warnMsg = false;
                    closeWind.close('#searchEquips', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
                closeWind.close('#searchEquips', $scope);
            });
    };
    $scope.updateEquip = function () {
        angular.element('#searchEquips').modal('hide');
        angular.element('#updateEquip').modal('toggle');
        $scope.$emit('searchEquip', $scope.equip);
    };
    $scope.transferCus = function ($event, equip) {
        $event.stopPropagation();
        let data = {
            event: $event,
            id: equip.id
        };
        $scope.$emit('modalTransfer', data);
    };
    $scope.removeEquip = function (libraryId) {
        library
            .delete(libraryId)
            .success(function (res) {
                let data = {
                    'msg': null,
                    'id': libraryId
                };
                if (res.code === 200) {
                    data.msg = ordinaryMsg.deleteInfo.success;
                    $scope.equip = null;
                } else if (res.code === 408) {
                    loginGetaway.goLogin();
                } else {
                    data.msg = ordinaryMsg.deleteInfo.failure;
                }
                $scope.$emit('delMsg', data);
                angular.element('#searchEquips').modal('hide');
                angular.element('.bs-example-modal-sm').modal('toggle');
            })
            .error(function () {
                $scope.$emit('delMsg', {'msg': errorMsg.serviceException, 'id': null});
                angular.element('#searchEquips').modal('hide');
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
    };
    $scope.showCustomer = function () {
        angular.element('#searchEquips').modal('hide');
        angular.element('#showCustomer').modal('toggle');
        $scope.$emit('showCusInfo', $scope.customer);
    };
    $scope.showPosition = function () {
        angular.element('#searchEquips').modal('hide');
        let timer = $timeout(function () {
            $location.path('/position/' + $scope.customer.email);
            $timeout.cancel(timer);
        }, 500);
    }
}]);