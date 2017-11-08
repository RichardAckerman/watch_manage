'use strict';

let updatePassword = angular.module('watchApp.password', []);
updatePassword.controller('updPswCtrl', function ($scope, errorMsg, $location, $timeout, password, closeWind, pathLogin) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.errorPassword = errorMsg.password;
    $scope.updPsw = function () {
        if ($scope.oldPassword === null || $scope.oldPassword === ''
            || $scope.newPassword === null || $scope.newPassword === '') {
            $scope.warnMessage = $scope.errorPassword.required;
            $scope.warnMsg = false;
            closeWind.close('#updatePassword', $scope);
            return;
        }
        if ($scope.oldPassword === $scope.newPassword) {
            $scope.warnMessage = $scope.errorPassword.same;
            $scope.warnMsg = false;
            closeWind.close('#updatePassword', $scope);
            return;
        }
        /** @namespace $scope.affirm */
        if ($scope.newPassword !== $scope.affirm) {
            $scope.warnMessage = $scope.errorPassword.diff;
            $scope.warnMsg = false;
            closeWind.close('#updatePassword', $scope);
            return;
        }
        let params = {'oldPassword': $scope.oldPassword, 'newPassword': $scope.newPassword};
        password.updatePassword(params)
            .success(function (res) {
                if (res.code === 200) {
                    $scope.successMessage = '修改成功';
                    $scope.sucMsg = false;
                    closeWind.close('#updatePassword', $scope);
                    pathLogin.path($scope);
                } else if (res.code === 408) {
                    $scope.warnMsg = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#updatePassword', $scope);
                    pathLogin.path($scope);
                } else {
                    $scope.warnMessage = res.msg;
                    $scope.warnMsg = false;
                    closeWind.close('#updatePassword', $scope);
                }
            })
            .error(function () {
                $scope.warnMessage = '服务器异常,请联系管理员!';
                $scope.warnMsg = false;
                closeWind.close('#updatePassword', $scope);
            });
    };
    $scope.close = function () {
        angular.element('#updatePassword').modal('hide');
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel()
    });
});

