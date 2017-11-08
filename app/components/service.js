'use strict';
let service = angular.module('watchApp.service', []);
service.factory('uuid', function () {
    return md5(new Date().getTime(), Math.random());
});
service.value('errorMsg', {
    password: {
        required: '密码不能为空',
        diff: '两次数据密码不同',
        same: '新旧密码相同'
    },
    imeiError: {
        imeiEmpty: '请输入IMEI号',
        imeiFormat: '请输入15位IMEI号'
    },
    loginGetaway: '登录过期,请再次登录!',
    serviceException: '服务器异常,请联系管理员!',
    queryEmpty: '未查询到相应数据!',
    email: '邮箱格式错误',
    noChoose: '请先选择',
    aimEmpty: '目标客户不能为空!',
    equipEmpty: '请选择转移设备!',
    duplication: '不能转移给自己',
    emptyUserName: '请输入客户名称',
    phoneError: '电话号码格式不对',
    delFail: '不能删除该客户!请先转移设备后再试!'
});
service.value('ordinaryMsg', {
    myInfo: '我的信息',
    customerInfo: '客户信息',
    undefinedInfo: '未填写',
    emptyInfo: '查询条件不能为空!',
    inactive: '未激活',
    deleteInfo: {
        success: '删除成功',
        failure: '删除失败'
    },
});
service.service('closeWind', function ($timeout) {
    let closePromise = null;
    let closeTimeout = function (windId, $scope) {
        closePromise = $timeout(function () {
            $scope.warnMsg = true;
            $scope.sucMsg = true;
            angular.element(windId).modal('hide');
        }, 1500);
    };
    this.close = function (windId, $scope) {
        closeTimeout(windId, $scope);
    };
    this.cancel = function () {
        $timeout.cancel(closePromise);
    }
});
service.service('pathLogin', function ($timeout, $location) {
    let loginPromise = null;
    let loginTimeout = function ($scope) {
        loginPromise = $timeout(function () {
            $scope.warnMsg = true;
            $scope.sucMsg = true;
            $location.path('/login');
        }, 2000);
    };
    this.path = function ($scope) {
        loginTimeout($scope);
    };
    this.cancel = function () {
        $timeout.cancel(loginPromise);
    }
});
service.service('reloadRoute', function ($timeout, $window) {
    let pathReload = null;
    let reloadTimeout = function ($scope) {
        pathReload = $timeout(function () {
            $scope.warnMsg = true;
            $scope.sucMsg = true;
            $window.location.reload();
        }, 2000);
    };
    this.path = function ($scope) {
        reloadTimeout($scope);
    };
    this.cancel = function () {
        $timeout.cancel(pathReload);
    }
});
service.service('loginGetaway', function ($location) {
    this.goLogin = function () {
        $location.path('/login');
    }
});
service.factory('confirmService', function ($modal, $q) {
    return {
        openConfirmWindow: function ($scope, modalContent) {
            let deferred = $q.defer();
            let modalInstance = $modal.open({
                templateUrl: 'confirm/myModelContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    data : function(){
                        return {modalContent: modalContent};
                    }
                }
            });
            modalInstance.result.then(function () {
                if(!!modalInstance) {
                    modalInstance.dismiss('cancel');
                }
                deferred.resolve();
            }, function () {

            });
            return deferred.promise;
        }
    }
});
