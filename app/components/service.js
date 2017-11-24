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
        imeiFormat: '请输入10位或15位IMEI号',
        name: '设备名不能是纯数字'
    },
    loginGetaway: '登录过期,请再次登录!',
    serviceException: '服务器异常,请联系管理员!',
    abnormalPermissions: '权限不符',
    queryEmpty: '未查询到相应数据!',
    email: '邮箱格式错误',
    noChoose: '请先选择',
    aimEmpty: '目标客户不能为空!',
    equipEmpty: '请选择转移设备!',
    duplication: '不能转移给自己',
    emptyUserName: '请输入客户名称',
    phoneError: '电话号码格式不对',
    delFail: '不能删除该客户!请先转移设备后再试!',
    registerMsg: {
        name: '用户名仅支持中英文、数字和下划线,且不能超过10个字符'
    }
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
service.service('closeWind', ['$timeout', function ($timeout) {
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
}]);
service.service('pathLogin', ['$timeout', '$location', function ($timeout, $location) {
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
}]);
service.service('reloadRoute', ['$timeout', '$window', function ($timeout, $window) {
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
}]);
service.service('loginGetaway', ['$location', function ($location) {
    this.goLogin = function () {
        $location.path('/login');
    }
}]);
service.factory('confirmService', ['$modal', '$q', function ($modal, $q) {
    return {
        openConfirmWindow: function ($scope, modalContent) {
            let deferred = $q.defer();
            let modalInstance = $modal.open({
                templateUrl: 'confirm/myModelContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return {modalContent: modalContent};
                    }
                }
            });
            modalInstance.result.then(function () {
                if (!!modalInstance) {
                    modalInstance.dismiss('cancel');
                }
                deferred.resolve();
            }, function () {

            });
            return deferred.promise;
        }
    }
}]);
