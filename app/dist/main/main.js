'use strict';
// Declare app level module which depends on views, and components

var app = angular.module('watchApp', ['ngRoute', 'ngCookies', 'watchApp.editUserInfo', 'watchApp.personal', 'watchApp.head', 'watchApp.password', 'watchApp.customer', 'watchApp.position', 'watchApp.version', 'watchApp.api', 'watchApp.service', 'watchApp.login', 'watchApp.updateEquip', 'watchApp.searchEquips', 'watchApp.searchCustomers', 'watchApp.addEquip', 'watchApp.addCustomer', 'watchApp.showCustomer', 'watchApp.transferCustomer', 'watchApp.rightMenu', 'watchApp.baiduMap', 'watchApp.moveEquip', 'watchApp.googleMap', 'watchApp.confirm']);
app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    // $locationProvider.html5Mode(true); //消除路由中的#
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({ redirectTo: '/login' });
}]);
app.directive('loading', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div class="divModal">\n                        <p class="loadingFont">\u52A0\u8F7D\u4E2D,\u8BF7\u7A0D\u7B49\xB7\xB7\xB7</p>\n                    </div>',
        link: function link(scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val) $(element).show();else $(element).hide();
            });
        }
    };
});
"use strict";

var addCustomer = angular.module('watchApp.addCustomer', []);
addCustomer.controller('addCustomerCtrl', ["$scope", "dealer", "errorMsg", "closeWind", "pathLogin", function ($scope, dealer, errorMsg, closeWind, pathLogin) {
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
        var regName = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,10}$/g;
        if (!regName.test($scope.userName)) {
            $scope.warnMessage = errorMsg.registerMsg.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
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
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.phone !== '' && $scope.phone !== undefined && !phoneReg.test($scope.phone)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var param = {
            'userName': $scope.userName,
            'email': $scope.email,
            'psw': $scope.password,
            'superiorId': $scope.superiorId,
            'type': 2,
            'linkman': $scope.linkman,
            'dealerPhone': $scope.phone,
            'dealerAddress': $scope.address
        };
        dealer.addCus(param).success(function (res) {
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
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#addCustomer', $scope);
        });
    };
}]);
"use strict";

var addEquip = angular.module('watchApp.addEquip', []);
addEquip.controller('addEquipCtrl', ["$scope", "$rootScope", "library", "closeWind", "pathLogin", "errorMsg", function ($scope, $rootScope, library, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.$on('superiorInfo', function (event, data) {
        $scope.dealerInfo = data;
    });
    $scope.addEquip = function () {
        var reg = /(^[\d]{10}$)|(^[\d]{15}$)/g;
        if (!reg.test($scope.imei)) {
            $scope.warnMessage = errorMsg.imeiError.imeiFormat;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return false;
        }
        var data = {
            'imei': $scope.imei,
            'dealerId': $scope.dealerInfo.id,
            'superiorId': $scope.dealerInfo.superiorId
        };
        library.put(data).success(function (res) {
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
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#addEquip', $scope);
        });
    };
}]);
'use strict';

var api = angular.module('watchApp.api', []);
var TEST = 'http://127.0.0.1:8080/watch';
var PRODUCT = 'https://so360.org/watch';
var HOST = PRODUCT;
var API_LOGIN = HOST + '/adminSignIn';
var API_LOGOUT = HOST + '/logOut';
var API_INDEX_DATA = HOST + '/admin/adminIndexView';
var API_UPDATE_PASSWORD = HOST + '/admin/password';
var API_UPDATE_USER_INFO = HOST + '/admin/userInfo';
var API__EQUIP = HOST + '/admin/library';
var API__EQUIP_ID = API__EQUIP + '/id/';
var API__EQUIP_IMEI = API__EQUIP + '/imei/';
var API__EQUIP_NAME = HOST + '/admin/equip/name/';
var API_EQUIP_PAGE = HOST + '/admin/libraries';
var API_EQUIP_DETAIL = HOST + '/admin/allEquipInfo/superiorId/';
var API_DELETE_BATCH = API__EQUIP + '/remove/batch';
var API_DEALER = HOST + '/admin/dealer';
var API_DEALER_ID = HOST + '/admin/library/user/dealerId/';
var API_DEALER_EMAIL = HOST + '/admin/library/user/emailOrUserName';
var API_DEALER_UPDATE = HOST + '/admin/dealer/';
var API__EQUIP_TRANSFORM = API__EQUIP + '/move';
var API__EQUIP_BATCH = API__EQUIP_TRANSFORM + '/batch';
var API_POSITION_EMAIL = HOST + '/admin/equipInfo/info';
var API_POSITION_IMEI = HOST + '/admin/equipInfo/imei/';
var API_POSITION_NAME = HOST + '/admin/equipInfo/name/';
var API_RESET_PHONE = HOST + '/admin/reset/userPhone/';
api.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.transformRequest = [function (data) {
        return $httpProvider.defaults.paramSerializer(data);
    }];
}]);
api.factory('authService', ['$http', function ($http) {
    return {
        signIn: function signIn(params) {
            return $http({
                url: API_LOGIN,
                method: 'POST',
                cache: true,
                data: params
            });
        },
        oAuth: function oAuth(params) {
            return $http({
                url: API_LOGIN,
                method: 'POST',
                data: params
            });
        },
        signOut: function signOut() {
            return $http({
                url: API_LOGOUT,
                method: 'POST'
            });
        }
    };
}]);
api.factory('indexService', ['$http', function ($http) {
    return {
        indexData: function indexData() {
            return $http({
                url: API_INDEX_DATA,
                method: 'GET'
            });
        }
    };
}]);
api.factory('password', ['$http', function ($http) {
    return {
        updatePassword: function updatePassword(params) {
            return $http({
                url: API_UPDATE_PASSWORD,
                method: 'POST',
                data: params
            });
        }
    };
}]);
api.factory('userInfo', ['$http', function ($http) {
    return {
        update: function update(params) {
            return $http({
                url: API_UPDATE_USER_INFO,
                method: 'PATCH',
                data: params
            });
        },
        updateSubordinate: function updateSubordinate(params) {
            return $http({
                url: API_UPDATE_USER_INFO,
                method: 'POST',
                data: params
            });
        }
    };
}]);
api.factory('library', ['$http', function ($http) {
    return {
        queryByImei: function queryByImei(imei) {
            return $http({
                url: API__EQUIP_IMEI + imei,
                method: 'GET'
            });
        },
        queryByName: function queryByName(name) {
            return $http({
                url: API__EQUIP_NAME + name,
                method: 'GET'
            });
        },
        queryById: function queryById(id) {
            return $http({
                url: API__EQUIP_ID + id,
                method: 'GET'
            });
        },
        queryPage: function queryPage(params) {
            return $http({
                url: API_EQUIP_PAGE,
                method: 'GET',
                params: params
            });
        },
        put: function put(params) {
            return $http({
                url: API__EQUIP,
                method: 'PUT',
                data: params
            });
        },
        update: function update(params) {
            return $http({
                url: API__EQUIP,
                method: 'PATCH',
                data: params
            });
        },
        delete: function _delete(id) {
            return $http({
                url: API__EQUIP_ID + id,
                method: 'DELETE'
            });
        },
        batchDelete: function batchDelete(params) {
            return $http({
                url: API_DELETE_BATCH,
                method: 'POST',
                data: params
            });
        },
        transform: function transform(params) {
            return $http({
                url: API__EQUIP_TRANSFORM,
                method: 'POST',
                data: params
            });
        },
        batchTransform: function batchTransform(params) {
            return $http({
                url: API__EQUIP_BATCH,
                method: 'POST',
                data: params
            });
        },
        resetPhone: function resetPhone(id) {
            return $http({
                url: API_RESET_PHONE + id,
                method: 'DELETE'
            });
        }
    };
}]);
api.factory('dealer', ['$http', function ($http) {
    return {
        addCus: function addCus(param) {
            return $http({
                url: API_DEALER,
                method: 'POST',
                data: param
            });
        },
        delCus: function delCus(id) {
            return $http({
                url: API_DEALER_UPDATE + id,
                method: 'DELETE'
            });
        },
        resetPwd: function resetPwd(id) {
            return $http({
                url: API_DEALER_UPDATE + id,
                method: 'PATCH'
            });
        },
        queryById: function queryById(id) {
            return $http({
                url: API_DEALER_ID + id,
                method: 'GET'
            });
        },
        queryByEmail: function queryByEmail(param) {
            return $http({
                url: API_DEALER_EMAIL,
                method: 'GET',
                params: param
            });
        }
    };
}]);
api.factory('location', ['$http', function ($http) {
    return {
        queryEquipNum: function queryEquipNum(id) {
            return $http({
                url: API_EQUIP_DETAIL + id,
                method: 'GET'
            });
        },
        queryByEmail: function queryByEmail(param) {
            return $http({
                url: API_POSITION_EMAIL,
                method: 'GET',
                params: param
            });
        },
        queryByImei: function queryByImei(imei) {
            return $http({
                url: API_POSITION_IMEI + imei,
                method: 'GET'
            });
        },
        queryByName: function queryByName(name) {
            return $http({
                url: API_POSITION_NAME + name,
                method: 'GET'
            });
        }
    };
}]);
'use strict';

var service = angular.module('watchApp.service', []);
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
    }
});
service.service('closeWind', ['$timeout', function ($timeout) {
    var closePromise = null;
    var closeTimeout = function closeTimeout(windId, $scope) {
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
    };
}]);
service.service('pathLogin', ['$timeout', '$location', function ($timeout, $location) {
    var loginPromise = null;
    var loginTimeout = function loginTimeout($scope) {
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
    };
}]);
service.service('reloadRoute', ['$timeout', '$window', function ($timeout, $window) {
    var pathReload = null;
    var reloadTimeout = function reloadTimeout($scope) {
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
    };
}]);
service.service('loginGetaway', ['$location', function ($location) {
    this.goLogin = function () {
        $location.path('/login');
    };
}]);
service.factory('confirmService', ['$modal', '$q', function ($modal, $q) {
    return {
        openConfirmWindow: function openConfirmWindow($scope, modalContent) {
            var deferred = $q.defer();
            var modalInstance = $modal.open({
                templateUrl: 'confirm/myModelContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    data: function data() {
                        return { modalContent: modalContent };
                    }
                }
            });
            modalInstance.result.then(function () {
                if (!!modalInstance) {
                    modalInstance.dismiss('cancel');
                }
                deferred.resolve();
            }, function () {});
            return deferred.promise;
        }
    };
}]);
'use strict';

var confirm = angular.module('watchApp.confirm', ['ui.bootstrap']);
confirm.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.modalContent = data.modalContent;
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
'use strict';

var customer = angular.module('watchApp.customer', ['ngRoute']);
customer.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/customer', {
        templateUrl: 'customer/customer.html'
    });
}]);

customer.directive('contextmenu', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        link: function link($scope, element, attrs) {
            var menuElement = angular.element("#rightMenu");
            element.bind('contextmenu', function (event) {
                $scope.$emit('dealerInfoRM', $scope.subordinateDealer);
                $scope.listActive($filter('integer')(attrs.index));
                $scope.$apply(function () {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.$parent.rightMenuHide = false;
                    menuElement.css('top', event.clientY + 'px');
                    menuElement.css('left', event.clientX + 'px');
                });
            });
        }
    };
}]);

customer.controller('customerCtrl', ['$rootScope', '$scope', 'indexService', 'loginGetaway', 'dealer', 'pathLogin', 'confirmService', 'library', 'errorMsg', 'ordinaryMsg', '$window', '$filter', 'closeWind', '$timeout', function ($rootScope, $scope, indexService, loginGetaway, dealer, pathLogin, confirmService, library, errorMsg, ordinaryMsg, $window, $filter, closeWind, $timeout) {
    // 管理显示添加设备功能
    $scope.isAdmin = false;
    // 点击客户加上class
    $scope.isActive = 1;
    $scope.pageIsActive = 1;
    // 默认显示每页10条
    $scope.allPageSize = [10, 20, 30, 40, 50, 100];
    $scope.pageSize = '10';
    $scope.pages = [];
    // 右键菜单
    $scope.rightMenuHide = true;
    $scope.userList = true; // 转移设备客户列表
    // 窗口绑定事件
    angular.element($window).on('click', function () {
        $scope.$apply(function () {
            $scope.userList = true;
            $scope.rightMenuHide = true;
        });
    });
    indexService.indexData().success(function (res) {
        if (res.code === 200) {
            var result = res.result;
            $scope.messageType = ordinaryMsg.customerInfo;
            $rootScope.userAdmin = result.userInfoDTO;
            $scope.userDealer = result.userInfoDTO;
            $rootScope.userEquipNum = 0;
            if (typeof result.dealerInfoVos !== 'undefined') {
                var dealerInfoVos = result.dealerInfoVos;
                $scope.count = dealerInfoVos.count;
                $scope.equips = dealerInfoVos.result;
                angular.forEach($scope.equips, function (value, key) {
                    value.isChecked = false;
                });
                $rootScope.userEquipNum = dealerInfoVos.count;
                $scope.userDealer.equipNum = $rootScope.userEquipNum;
                $scope.allPageNum = dealerInfoVos.pages;
                $scope.pages = new Array(dealerInfoVos.pages);
            }
            if (result.userInfoDTO.id === 1) {
                $scope.isAdmin = true;
            }
            $scope.subordinateDealers = result.subordinateDealers;
            // 向子控制器传递用户信息
            $scope.$broadcast("allUserInfo", $scope.subordinateDealers);
            $scope.$broadcast("superiorInfo", $scope.userDealer);
        }
        if (res.code === 408) {
            $scope.msgModal = errorMsg.serviceException;
            angular.element('.bs-example-modal-sm').modal('toggle');
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                angular.element('.bs-example-modal-sm').modal('hide');
                var go = $timeout(function () {
                    $timeout.cancel(go);
                    loginGetaway.goLogin();
                }, 2000);
            }, 3000);
        }
        if (res.code === 409) {
            $scope.msgModal = res.msg === 'Abnormal permissions!' ? errorMsg.abnormalPermissions : errorMsg.serviceException;
            angular.element('.bs-example-modal-sm').modal('toggle');
            var _timer = $timeout(function () {
                $timeout.cancel(_timer);
                angular.element('.bs-example-modal-sm').modal('hide');
                var go = $timeout(function () {
                    $timeout.cancel(go);
                    loginGetaway.goLogin();
                }, 2000);
            }, 3000);
        }
    }).error(function () {
        loginGetaway.goLogin();
    });
    // 勾选功能
    $scope.singleClick = function () {
        $scope.equipAll = true;
        angular.forEach($scope.equips, function (value, key) {
            $scope.equipAll = value.isChecked && $scope.equipAll;
        });
    };
    //全选功能
    $scope.allChecked = function () {
        angular.forEach($scope.equips, function (value, key) {
            value.isChecked = $scope.equipAll;
        });
    };
    // 点击页码分页
    $scope.pagingQuery = function (pageNum) {
        $scope.getEquipByPage($scope.pageSize, pageNum);
    };
    $scope.getEquipByPage = function (size, num) {
        var pagingParam = {
            "pageSize": size,
            "pageNum": num ? num : 1,
            "dealerId": $scope.userDealer.id
        };
        library.queryPage(pagingParam).success(function (res) {
            if (res.code === 200) {
                $scope.equips = res.result;
                $scope.pageIsActive = pagingParam.pageNum;
                if (pagingParam.dealerId === $rootScope.userAdmin.id) {
                    $scope.pages = new Array($filter('ceil')($rootScope.userEquipNum / $scope.pageSize));
                } else {
                    $scope.subordinateDealers.forEach(function (v, i) {
                        if ($filter('ceil')(v.userId) === $filter('ceil')(pagingParam.dealerId)) {
                            var equipNum = v.equipNum;
                            $scope.pages = new Array($filter('ceil')(equipNum / $scope.pageSize));
                        }
                    });
                }
                $scope.equipAll = false;
            }
            if (res.code === 408) {
                loginGetaway.goLogin();
            }
        }).error(function () {
            $scope.msgModal = errorMsg.serviceException;
            angular.element('.bs-example-modal-sm').modal('toggle');
        });
    };
    // 上一页
    $scope.prevClick = function () {
        if ($scope.pageIsActive > 1) {
            $scope.getEquipByPage($scope.pageSize, $scope.pageIsActive - 1);
        }
    };
    // 下一页
    $scope.nextClick = function () {
        if ($scope.pageIsActive < $scope.pages.length) {
            $scope.getEquipByPage($scope.pageSize, $scope.pageIsActive + 1);
        }
    };
    // 每页显示条数切换
    $scope.pageSizeChg = function () {
        $scope.getEquipByPage($scope.pageSize, 1);
    };
    $scope.$on('dealerData', function (dealerData, data) {
        $scope.subordinateDealers.forEach(function (value, index) {
            if ($filter('integer')(value.userId) === $filter('integer')(data.id)) {
                value.userName = data.userName;
            }
        });
        $scope.userDealer.userName = data.userName;
        $scope.userDealer.linkman = data.linkman;
        $scope.userDealer.dealerPhone = data.dealerPhone;
        $scope.userDealer.dealerAddress = data.dealerAddress;
        if ($filter('integer')(data.id) === $filter('integer')($scope.userAdmin.id)) {
            $rootScope.userAdmin.userName = data.userName;
        }
    });
    $scope.$on('equipData', function (equipData, data) {
        $scope.equips.forEach(function (item, index) {
            if (item.id === data.id) {
                data.createTime = item.createTime;
                data.activationTime = item.activationTime;
                $scope.equips[index] = data;
            }
        });
    });
    $scope.$on('addEquip', function (event, data) {
        data.isChecked = false;
        $scope.equips.unshift(data);
        $rootScope.userEquipNum++;
        if ($scope.isActive === 1) {
            $scope.userDealer.equipNum = $rootScope.userEquipNum;
        }
    });
    $scope.$on('modalTransfer', function (event, data) {
        $scope.userList = false;
        var menu = angular.element('#transferCustomer');
        var width = menu.width();
        menu.css({
            'top': data.event.clientY + 'px',
            'left': data.event.clientX - width + 'px',
            'zIndex': 1100
        });
        $scope.$broadcast('transformInfo', { equipId: data.id, userId: $scope.userDealer.id });
    });
    $scope.$on('delMsg', function (event, data) {
        $scope.msgModal = data.msg;
        $scope.equips.forEach(function (item, index, array) {
            if (item.id === data.id) {
                array.splice(index, 1);
                $scope.equips = array;
            }
        });
    });
    $scope.$on('searchEquip', function (event, data) {
        $scope.equip = data;
    });
    $scope.$on('transformEquip', function (event, data) {
        $scope.msgModal = data.msg;
        if (data.sign) $scope.updateDealer(data);
        closeWind.close('#searchEquips', $scope);
        angular.element('.bs-example-modal-sm').modal('toggle');
    });
    $scope.$on('batchTrans', function (event, data) {
        $scope.$broadcast('batchTransModal', data);
    });
    $scope.$on('showCusInfo', function (event, data) {
        $rootScope.$broadcast('customerInfo', data);
    });
    $scope.$on('dealerInfoRM', function (event, data) {
        $scope.$broadcast('dealerMsg', data);
    });
    $scope.$on('dealerInfoChange', function (event, data) {
        $scope.subordinateDealers.forEach(function (value, index) {
            if ($filter('integer')(value.userId) === $filter('integer')(data.id)) {
                value.userName = data.userName;
            }
        });
        if ($rootScope.userAdmin.email === data.email) {
            $rootScope.userAdmin.userName = data.userName;
        }
        if (data.email === $scope.userDealer.email) {
            $scope.userDealer.userName = data.userName;
            $scope.userDealer.linkman = data.linkman;
            $scope.userDealer.dealerPhone = data.dealerPhone;
            $scope.userDealer.dealerAddress = data.dealerAddress;
        }
    });

    // 新增客户
    $scope.addCustomer = function () {
        angular.element('#addCustomer').modal('toggle');
    };
    // 添加设备
    $scope.addEquip = function () {
        angular.element('#addEquip').modal('toggle');
    };
    // 转移
    $scope.transferCustomer = function ($event, id) {
        $event.stopPropagation();
        $scope.userList = false;
        var menu = angular.element('#transferCustomer');
        var width = menu.width();
        menu.css('top', $event.clientY + 'px');
        menu.css('left', $event.clientX - width + 'px');
        $scope.$broadcast('transformInfo', { equipId: id, userId: $scope.userDealer.id });
    };
    $scope.showTransWindow = function (e) {
        $scope.userList = false;
        var menu = angular.element('#transferCustomer');
        var width = menu.width();
        menu.css({
            'top': e.clientY + 'px',
            'left': e.clientX - width + 'px',
            'zIndex': 1100
        });
    };
    //修改
    $scope.updateEquip = function (equip) {
        angular.element('#updateEquip').modal('toggle');
        $scope.equip = equip;
    };
    //删除
    $scope.removeEquip = function (libraryId) {
        var content = '确认删除吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            library.delete(libraryId).success(function (res) {
                if (res.code === 200) {
                    $scope.msgModal = ordinaryMsg.deleteInfo.success;
                    $scope.updateDealer({ ids: [libraryId] });
                    angular.element('.bs-example-modal-sm').modal('toggle');
                } else if (res.code === 408) {
                    loginGetaway.goLogin();
                } else {
                    $scope.msgModal = ordinaryMsg.deleteInfo.failure;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                }
            }).error(function () {
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        });
    };
    // 批量转移
    $scope.moveEquip = function () {
        var newEquips = [];
        if ($scope.equips === undefined) {
            return false;
        }
        $scope.equips.forEach(function (item, index, array) {
            if (item.isChecked === true) {
                newEquips.push(item);
            }
        });
        $scope.$broadcast('batchEquipsInfo', { equips: newEquips, userId: $scope.userDealer.id });
        angular.element('#moveEquip').modal('toggle');
    };
    // 批量删除
    $scope.delInBatch = function () {
        var data = {
            ids: []
        };
        if ($scope.equips === undefined) {
            return false;
        }
        $scope.equips.forEach(function (item, index, array) {
            if (item.isChecked === true) {
                data.ids.push(item.id);
            }
        });
        if (data.ids.length === 0) {
            $scope.msgModal = errorMsg.noChoose;
            angular.element('.bs-example-modal-sm').modal('toggle');
            return false;
        }
        var content = '确认删除吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            library.batchDelete(data).success(function (res) {
                if (res.code === 200) {
                    $scope.updateDealer(data);
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                }
                $scope.msgModal = res.msg;
                angular.element('.bs-example-modal-sm').modal('toggle');
            }).error(function () {
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        });
    };
    // 搜客户
    $scope.searchCustomers = function () {
        if ($scope.searchParams === undefined || $scope.searchParams === '') {
            $scope.msgModal = ordinaryMsg.emptyInfo;
            angular.element('.bs-example-modal-sm').modal('toggle');
            return;
        }
        var data = {
            'info': $scope.searchParams
        };
        dealer.queryByEmail(data).success(function (res) {
            if (res.code === 200 && res.result !== undefined) {
                res.result.queryType = data.info.indexOf('@') === -1 ? 'name' : 'email';
                $scope.$broadcast('myCustomerInfo', res.result);
                angular.element('#searchCustomers').modal('toggle');
            } else if (res.code === 408) {
                pathLogin.path($scope);
            } else {
                $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                angular.element('.bs-example-modal-sm').modal('toggle');
            }
        }).error(function () {
            $scope.msgModal = errorMsg.serviceException;
            angular.element('.bs-example-modal-sm').modal('toggle');
        });
    };
    // 搜设备
    $scope.searchEquips = function () {
        if ($scope.searchParams === undefined || $scope.searchParams === '') {
            $scope.msgModal = ordinaryMsg.emptyInfo;
            angular.element('.bs-example-modal-sm').modal('toggle');
            return;
        }
        var reg = /(^[\d]{10}$)|(^[\d]{15}$)/g;
        if (reg.test($scope.searchParams)) {
            library.queryByImei($scope.searchParams).success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    res.result.queryType = 'imei';
                    $scope.$broadcast('equipInfo', res.result);
                    angular.element('#searchEquips').modal('toggle');
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                } else {
                    $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                }
            }).error(function () {
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        } else {
            library.queryByName($scope.searchParams).success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    res.result.queryType = 'name';
                    $scope.$broadcast('equipInfo', res.result);
                    angular.element('#searchEquips').modal('toggle');
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                } else {
                    $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                }
            }).error(function () {
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        }
    };
    $scope.superiorSelected = function () {
        $scope.isActive = 1;
        $scope.dealerActive = undefined;
        $scope.userDealer = $rootScope.userAdmin;
        $scope.userDealer.equipNum = $rootScope.userEquipNum;
        $scope.getEquipByPage($scope.pageSize);
    };
    $scope.listActive = function (index) {
        $scope.isActive = 0;
        $scope.dealerActive = index;
        $scope.queryInfoByEmail($scope.subordinateDealers[index].email, $scope.subordinateDealers[index].equipNum);
    };
    $scope.queryInfoByEmail = function (email, num) {
        var param = {
            'info': email
        };
        dealer.queryByEmail(param).success(function (res) {
            if (res.code === 200 && res.result !== undefined) {
                $scope.userDealer = res.result;
                $scope.userDealer.equipNum = num;
                $scope.getEquipByPage($scope.pageSize);
            } else if (res.code === 408) {
                $scope.warnMessage = errorMsg.loginGetaway;
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                $scope.warnMsg = false;
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
        });
    };
    // 更新左侧菜单
    $scope.updateDealer = function (param) {
        indexService.indexData().success(function (res) {
            if (res.code === 200) {
                var result = res.result;
                $rootScope.userEquipNum = result.dealerInfoVos.count;
                $scope.subordinateDealers = result.subordinateDealers;
                $scope.$broadcast("allUserInfo", $scope.subordinateDealers);
                if ($scope.subordinateDealers !== undefined) {
                    $scope.subordinateDealers.forEach(function (v, k) {
                        if ($filter('integer')(v.userId) === $filter('integer')($scope.userDealer.id)) {
                            $scope.userDealer.equipNum = v.equipNum;
                        }
                    });
                }
                if (param.func === 'delCus') {
                    $scope.userDealer = undefined;
                }
                if (param.ids === undefined) return false;
                var newEquips = [],
                    hash = [];
                param.ids.forEach(function (v, i) {
                    hash[v] = true;
                });
                $scope.equips.forEach(function (item, index, array) {
                    if (!hash[item.id]) {
                        newEquips.push(item);
                    }
                });
                $scope.equips = newEquips;
            }
        }).error(function () {
            loginGetaway.goLogin();
        });
    };
}]);

customer.filter('blank', ['ordinaryMsg', function (ordinaryMsg) {
    return function (text) {
        if (typeof text === 'undefined' || text === '') {
            return ordinaryMsg.undefinedInfo;
        }
        return text;
    };
}]);

customer.filter('inactive', ['ordinaryMsg', function (ordinaryMsg) {
    return function (text, param) {
        if (param === 0) {
            return ordinaryMsg.inactive;
        }
        if (typeof text === 'undefined' || text === '') {
            return ordinaryMsg.undefinedInfo;
        }
        return text;
    };
}]);

customer.filter('ceil', function () {
    return function (number) {
        return Math.ceil(number);
    };
});

customer.filter('integer', function () {
    return function (number) {
        return parseInt(number);
    };
});
'use strict';

var editUserInfo = angular.module('watchApp.editUserInfo', []);
editUserInfo.controller('editUserInfoCtrl', ['$scope', '$rootScope', 'userInfo', 'closeWind', 'pathLogin', 'errorMsg', function ($scope, $rootScope, userInfo, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updUserInfo = function () {
        var regName = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,10}$/g;
        if ($scope.userInfoForm.userName !== undefined && $scope.userInfoForm.userName !== "" && !regName.test($scope.userInfoForm.userName)) {
            $scope.warnMessage = errorMsg.registerMsg.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.userInfoForm.dealerPhone !== '' && $scope.userInfoForm.dealerPhone !== undefined && !phoneReg.test($scope.userInfoForm.dealerPhone)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var data = {
            'id': $scope.userDealer.id,
            'email': $scope.userDealer.email,
            'userName': $scope.userInfoForm.userName ? $scope.userInfoForm.userName : $scope.userDealer.userName,
            'linkman': $scope.userInfoForm.linkman ? $scope.userInfoForm.linkman : $scope.userDealer.linkman,
            'dealerPhone': $scope.userInfoForm.dealerPhone ? $scope.userInfoForm.dealerPhone : $scope.userDealer.dealerPhone,
            'dealerAddress': $scope.userInfoForm.dealerAddress ? $scope.userInfoForm.dealerAddress : $scope.userDealer.dealerAddress
        };
        userInfo.updateSubordinate(data).success(function (res) {
            if (res.code === 200) {
                $scope.successMessage = res.msg;
                $scope.sucMsg = false;
                closeWind.close('#editUserInfo', $scope);
                $scope.$emit('dealerData', data);
                if ($scope.messageType === '我的信息') {
                    $rootScope.userDealer.userName = data.userName;
                }
            } else if (res.code === 408) {
                $scope.warnMessage = errorMsg.loginGetaway;
                closeWind.close('#editUserInfo', $scope);
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                closeWind.close('#editUserInfo', $scope);
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#editUserInfo', $scope);
        });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
    });
}]);
'use strict';

var head = angular.module('watchApp.head', []);
head.controller('headCtrl', ['$scope', 'authService', '$location', 'confirmService', '$window', function ($scope, authService, $location, confirmService, $window) {
    $scope.logOut = function () {
        var content = '确认退出吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            $window.sessionStorage.removeItem("equipInfo");
            authService.signOut().success(function (res) {
                if (res.code === 200) {
                    $location.path('/login');
                }
            });
        });
    };
    $scope.isActive = $location.url();
}]);
'use strict';

var login = angular.module('watchApp.login', []);
login.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html'
    });
}]);
login.controller('loginCtrl', ['$scope', 'authService', '$location', 'uuid', '$timeout', 'errorMsg', '$window', function ($scope, authService, $location, uuid, $timeout, errorMsg, $window) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.signInData = {};
    $scope.signInData.email = $window.localStorage['email'];
    if ($scope.signInData.email !== undefined) {
        $scope.remember = true;
    }
    $scope.signIn = function () {
        /** @namespace $scope.signInData */
        $scope.signInData.cid = uuid;
        authService.signIn($scope.signInData).success(function (res) {
            if (res.code === 200) {
                $location.url('/customer');
                var storage = $window.localStorage;
                if ($scope.remember) {
                    storage['email'] = $scope.signInData.email;
                } else {
                    storage.removeItem("email");
                }
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                var closePasswordWind = $timeout(function () {
                    $scope.warnMsg = true;
                    $timeout.cancel(closePasswordWind);
                }, 1500);
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            var closePasswordWind = $timeout(function () {
                $scope.warnMsg = true;
                $timeout.cancel(closePasswordWind);
            }, 1500);
        });
    };
}]);
'use strict';

var baiduMap = angular.module('watchApp.baiduMap', []);
baiduMap.controller("baiduMapCtrl", ["$scope", "$filter", "$interval", function ($scope, $filter, $interval) {
    $scope.map = new BMap.Map("baiduContainer");
    $scope.point = new BMap.Point(114.026033, 22.559138); // 创建点坐标
    $scope.map.centerAndZoom($scope.point, 14);
    $scope.map.enableScrollWheelZoom(); //启动鼠标滚轮缩放地图
    $scope.map.addControl(new BMap.NavigationControl({ //地图平移缩放控件
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        enableGeolocation: true
    }));
    $scope.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(70, 20)
    }));
    $scope.map.addControl(new BMap.GeolocationControl()); // 添加定位控件
    $scope.map.addControl(new BMap.ScaleControl()); //比例尺控件
    $scope.map.addControl(new BMap.OverviewMapControl()); //缩略地图控件
    $scope.map.addControl(new BMap.MapTypeControl()); //地图类型控件
    $scope.map.setCurrentCity("深圳");
    $scope.pointCoordinate = {};
    $scope.timer = null;
    $scope.setTimer = function (data) {
        // 每隔15秒刷新坐标信息
        var time = 15;
        $interval.cancel($scope.timer);
        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(200, 20) });
        $scope.map.addControl(cr);
        var content = '\n            <p style="background: #fff;padding: 5px"><span style="color: #f00">' + time + ' </span>\u79D2\u540E\u5237\u65B0!</p>\n        ';
        cr.addCopyright({ id: 1, content: content });
        $scope.timer = $interval(function () {
            time--;
            content = '\n                <p style="background: #fff;padding: 5px"><span style="color: #f00">' + time + ' </span>\u79D2\u540E\u5237\u65B0!</p>\n            ';
            cr.addCopyright({ id: 1, content: content });
            if (time < 0) {
                $interval.cancel($scope.timer);
                $scope.map.removeControl(cr);
                $scope.setTimer(data);
                $scope.$emit('freshQuery', data);
            }
        }, 1000);
    };
    //点击事件
    $scope.map.addEventListener("click", function (e) {
        var pt = e.point;
        new BMap.Geocoder().getLocation(pt, function (rs) {
            if (rs === undefined && rs === null) {
                return false;
            }
            var addComp = rs.addressComponents;
            var site = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            $scope.$emit('getAddress', site);
        });
    });
    //拖拽事件
    $scope.map.addEventListener("dragend", function (e) {
        if ($scope.isCenterFlag) {
            if ($scope.pointCoordinate.lng === undefined) {
                return false;
            }
            $scope.map.centerAndZoom(new BMap.Point($scope.pointCoordinate.lng, $scope.pointCoordinate.lat), 14);
            $scope.map.disableInertialDragging();
        }
    });
    //放大事件
    $scope.map.addEventListener("zoomend", function (e) {
        if ($scope.isCenterFlag) {
            if ($scope.pointCoordinate.lng === undefined) {
                return false;
            }
            $scope.map.panTo(new BMap.Point($scope.pointCoordinate.lng, $scope.pointCoordinate.lat));
        }
    });
    //创建点
    $scope.createMark = function (val) {
        var src = val.online ? "../assets/images/online.png" : "../assets/images/offline.png";
        if (val.lat === undefined) {
            return;
        }
        var pointArr = [];
        var ggPoint = new BMap.Point(val.lng, val.lat);
        pointArr.push(ggPoint);
        new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
            if (data.status === 0) {
                val.lng = data.points[0].lng;
                val.lat = data.points[0].lat;
                var point = new BMap.Point(val.lng, val.lat);
                var marker = new BMap.Marker(point, { // 创建标注
                    icon: new BMap.Icon(src, new BMap.Size(32, 41))
                });
                var label = new BMap.Label(val.name, { offset: new BMap.Size(37, 6) }); // 创建名字
                label.setStyle({
                    color: "#666",
                    borderColor: "#ffa423",
                    fontSize: "12px",
                    height: "20px",
                    lineHeight: "0",
                    fontFamily: "微软雅黑",
                    maxWidth: 'none',
                    padding: '10px'
                });
                var infoOpts = {
                    enableMessage: true //设置允许信息窗发送短息
                };
                var msg = '\n                    <p>' + $filter('returnEmptyStr')(val.name) + '</p>\n                    <p>IMEI\u53F7\uFF1A' + $filter('returnEmptyStr')(val.imei) + '</p>\n                    <p>\u72B6\u6001\uFF1A' + (val.online ? '在线' : '离线') + '</p>\n                    <p>\u7535\u91CF\uFF1A' + (val.online ? $filter('returnEmptyStr')(val.electricity) + "%" : "") + '</p>\n                    <p>\u5B9A\u4F4D\u65F6\u95F4\uFF1A' + $filter('returnEmptyStr')(val.locationTime) + '</p>\n                ';
                $scope.map.addOverlay(marker);
                marker.setLabel(label);
                marker.setAnimation(BMAP_ANIMATION_DROP);
                if (val.isActive) {
                    $scope.map.openInfoWindow(new BMap.InfoWindow(msg, infoOpts), point); //开启信息窗口
                    $scope.pointCoordinate.lng = val.lng;
                    $scope.pointCoordinate.lat = val.lat;
                }
                marker.addEventListener("click", function (e) {
                    var p = e.target;
                    $scope.pointCoordinate.lng = p.getPosition().lng;
                    $scope.pointCoordinate.lat = p.getPosition().lat;
                    $scope.map.openInfoWindow(new BMap.InfoWindow(msg, infoOpts), point); //开启信息窗口
                    if ($scope.isCenterFlag) {
                        $scope.map.panTo(new BMap.Point($scope.pointCoordinate.lng, $scope.pointCoordinate.lat));
                        $scope.map.disableInertialDragging();
                    }
                    $scope.$emit('makerClick', val);
                });
            }
        });
    };
    $scope.$on('showNameFlag', function (event, data) {
        angular.element('.BMap_Marker .BMapLabel').css('display', data ? 'block' : 'none');
    });
    $scope.$on('clockCenterFlag', function (event, data) {
        $scope.isCenterFlag = data;
        if (data) {
            if ($scope.pointCoordinate.lng === undefined) {
                return false;
            }
            $scope.map.panTo(new BMap.Point($scope.pointCoordinate.lng, $scope.pointCoordinate.lat));
            $scope.map.disableInertialDragging();
        } else {
            $scope.pointCoordinate = {};
            $scope.map.enableInertialDragging();
        }
    });
    $scope.$on('currentEquips', function (event, info) {
        var data = angular.copy(info);
        $scope.setTimer(data);
        if (data.customer === undefined && data.customer === null) {
            return false;
        }
        $scope.map.clearOverlays();
        angular.forEach(data.customer.equips, function (value, key) {
            $scope.createMark(value);
        });
        if (data.currentEquip !== undefined && data.currentEquip !== null) {
            if (data.currentEquip.lng === undefined) {
                $scope.$emit('errorInfo', { msg: '没有坐标信息' });
                return false;
            }
            var pointArr = [];
            var ggPoint = new BMap.Point(data.currentEquip.lng, data.currentEquip.lat);
            pointArr.push(ggPoint);
            new BMap.Convertor().translate(pointArr, 1, 5, function (res) {
                if (res.status === 0) {
                    $scope.map.panTo(new BMap.Point(res.points[0].lng, res.points[0].lat));
                    new BMap.Geocoder().getLocation({
                        lng: data.currentEquip.lng,
                        lat: data.currentEquip.lat
                    }, function (rs) {
                        if (rs === undefined || rs === null) {
                            return false;
                        }
                        var addComp = rs.addressComponents;
                        var site = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                        $scope.$emit('getAddress', site);
                    });
                }
            });
        } else {
            $scope.pointCoordinate = {};
        }
    });
    $scope.$on("$destroy", function () {
        $interval.cancel($scope.timer);
    });
}]);
"use strict";

/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */

//定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat];
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
        dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
        var _mglat = lat + dlat;
        var _mglng = lng + dlng;
        return [_mglng, _mglat];
    }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat];
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
        dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
}
'use strict';

var googleMap = angular.module('watchApp.googleMap', []);
googleMap.controller("googleMapCtrl", ["$scope", "$filter", "$timeout", "$interval", function ($scope, $filter, $timeout, $interval) {
    $scope.point = { lat: 22.560118, lng: 114.004252 };
    $scope.map = new google.maps.Map(document.getElementById("googleContainer"), { //创建谷歌地图
        center: $scope.point, //地图的中心点
        zoom: 13, //地图缩放比例
        mapTypeId: google.maps.MapTypeId.ROADMAP, //指定地图展示类型：卫星图像、普通道路
        scrollwheel: true, //是否允许滚轮滑动进行缩放
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        scaleControl: true
    });
    $scope.createRefresh = function (time) {
        var div = document.getElementById('refreshDiv');
        if (div) {
            div.parentNode.removeChild(div);
        }
        var controlDiv = document.createElement('div');
        controlDiv.id = 'refreshDiv';
        var p = document.createElement('p');
        var span = document.createElement('span');
        span.id = 'refreshTime';
        span.style.color = '#f00';
        span.innerHTML = time;
        p.appendChild(span);
        p.style.background = '#fff';
        p.style.padding = '5px';
        p.style.marginTop = '20px';
        p.innerHTML = p.innerHTML + '秒后刷新!';
        controlDiv.appendChild(p);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
    };
    $scope.timer = null;
    $scope.setTimer = function (data) {
        // 每隔15秒刷新坐标信息
        var time = 15;
        $interval.cancel($scope.timer);
        $scope.createRefresh(time);
        $scope.timer = $interval(function () {
            time--;
            var div = document.getElementById('refreshDiv');
            if (div) {
                document.getElementById('refreshTime').innerHTML = time;
            } else {
                $interval.cancel($scope.timer);
            }
            if (time < 0) {
                $interval.cancel($scope.timer);
                if (div) {
                    div.parentNode.removeChild(div);
                }
                $scope.setTimer(data);
                $scope.$emit('freshQuery', data);
            }
        }, 1000);
    };
    $scope.map.addListener('click', function (e) {
        $scope.getAddress(e);
    });
    $scope.getAddress = function (e) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, function geoResults(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                $scope.$emit('getAddress', results[0].formatted_address);
            }
        });
    };
    $scope.map.addListener('idle', function () {
        //地图闲置时触发
        if ($scope.isCenterFlag) {
            if ($scope.pointCoordinate.lng === undefined) return false;
            $scope.map.panTo($scope.pointCoordinate);
        }
    });
    $scope.pointCoordinate = {}; //当前选中点坐标
    $scope.mapMakers = [];
    $scope.createMark = function (val) {
        var src = val.online ? "../assets/images/online.png" : "../assets/images/offline.png";
        if (val.lat === undefined) {
            return;
        }
        val.lat = Number(val.lat);
        val.lng = Number(val.lng);
        var coordinate = wgs84togcj02(val.lng, val.lat);
        val.lng = coordinate[0];
        val.lat = coordinate[1];
        var marker = new google.maps.Marker({
            position: { lat: val.lat, lng: val.lng },
            icon: src,
            animation: google.maps.Animation.DROP,
            map: $scope.map
        });
        var html = '\n             <p>' + $filter('returnEmptyStr')(val.name) + '</p>\n            <p>IMEI\u53F7\uFF1A' + $filter('returnEmptyStr')(val.imei) + '</p>\n            <p>\u72B6\u6001\uFF1A' + (val.online ? '在线' : '离线') + '</p>\n            <p>\u7535\u91CF\uFF1A' + (val.online ? $filter('returnEmptyStr')(val.electricity) + "%" : "") + '</p>\n            <p>\u5B9A\u4F4D\u65F6\u95F4\uFF1A' + $filter('returnEmptyStr')(val.locationTime) + '</p>\n        ';
        var infoWindow = new google.maps.InfoWindow({
            content: html
        });
        $scope.mapMakers.push(marker);
        var myOptions = {
            content: val.name,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(20, -35),
            zIndex: null,
            boxStyle: {
                opacity: 1,
                width: "auto",
                border: '1px solid rgb(255, 164, 35)',
                padding: "5px 10px",
                fontSize: "12px",
                background: "#fff"
            },
            closeBoxMargin: "10px 2px 2px 2px",
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
        };
        var ib = new InfoBox(myOptions);
        ib.open($scope.map, marker); //显示名字
        if (val.isActive) {
            var timer = $timeout(function () {
                infoWindow.open($scope.map, marker); //开启信息窗口
                $timeout.cancel(timer);
            }, 1);
            $scope.pointCoordinate.lng = val.lng;
            $scope.pointCoordinate.lat = val.lat;
        }
        marker.addListener('click', function (e) {
            angular.element('.gm-style-iw').parent().css('display', 'none');
            infoWindow.open($scope.map, marker);
            $scope.pointCoordinate.lng = e.latLng.lng();
            $scope.pointCoordinate.lat = e.latLng.lat();
            if ($scope.isCenterFlag) {
                $scope.map.panTo($scope.pointCoordinate);
            }
            $scope.$emit('makerClick', val);
            $scope.getAddress(e);
        });
    };
    $scope.$on('showNameFlag', function (event, data) {
        angular.element('.infoBox').css('display', data ? 'block' : 'none');
    });
    $scope.$on('clockCenterFlag', function (event, data) {
        $scope.isCenterFlag = data;
        if (data) {
            if ($scope.pointCoordinate.lng === undefined) return false;
            $scope.map.panTo($scope.pointCoordinate);
        } else {
            $scope.pointCoordinate = {};
        }
    });
    $scope.$on('currentEquips', function (event, info) {
        var data = angular.copy(info);
        $scope.setTimer(data);
        if (data.customer === undefined && data.customer === null) {
            return false;
        }
        if ($scope.mapMakers.length > 0) {
            angular.forEach($scope.mapMakers, function (value, key) {
                value.setMap(null);
            });
        }
        $scope.mapMakers.length = 0;
        if (data.customer.equips !== undefined) {
            angular.forEach(data.customer.equips, function (value, key) {
                $scope.createMark(value);
            });
        }
        if (data.currentEquip !== undefined && data.currentEquip !== null) {
            if (data.currentEquip.lng === undefined) {
                $scope.$emit('errorInfo', { msg: '没有坐标信息' });
                return false;
            }
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                location: {
                    lat: data.currentEquip.lat,
                    lng: data.currentEquip.lng
                }
            }, function geoResults(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    $scope.$emit('getAddress', results[0].formatted_address);
                }
            });
        } else {
            $scope.pointCoordinate = {};
        }
    });
    $scope.$on("$destroy", function () {
        $interval.cancel($scope.timer);
    });
}]);
"use strict";

/**
 * @name InfoBox
 * @version 1.1.9 [October 2, 2011]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 *  <p>
 *  Browsers tested:
 *  <p>
 *  Mac -- Safari (4.0.4), Firefox (3.6), Opera (10.10), Chrome (4.0.249.43), OmniWeb (5.10.1)
 *  <br>
 *  Win -- Safari, Firefox, Opera, Chrome (3.0.195.38), Internet Explorer (8.0.6001.18702)
 *  <br>
 *  iPod Touch/iPhone -- Safari (3.1.2)
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global google */

/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} disableAutoPan Disable auto-pan on <tt>open</tt> (default is <tt>false</tt>).
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} boxClass The name of the CSS class defining the styles for the InfoBox container.
 *  The default name is <code>infoBox</code>.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} isHidden Hide the InfoBox on <tt>open</tt> (default is <tt>false</tt>).
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, click, dblclick,
 *  and contextmenu events in the InfoBox (default is <tt>false</tt> to mimic the behavior
 *  of a <tt>google.maps.InfoWindow</tt>). Set this property to <tt>true</tt> if the InfoBox
 *  is being used as a map label. iPhone note: This property setting has no effect; events are
 *  always propagated.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */
function InfoBox(opt_opts) {

    opt_opts = opt_opts || {};

    google.maps.OverlayView.apply(this, arguments);

    // Standard options (in common with google.maps.InfoWindow):
    //
    this.content_ = opt_opts.content || "";
    this.disableAutoPan_ = opt_opts.disableAutoPan || false;
    this.maxWidth_ = opt_opts.maxWidth || 0;
    this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
    this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
    this.zIndex_ = opt_opts.zIndex || null;

    // Additional options (unique to InfoBox):
    //
    this.boxClass_ = opt_opts.boxClass || "infoBox";
    this.boxStyle_ = opt_opts.boxStyle || {};
    this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
    this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
    if (opt_opts.closeBoxURL === "") {
        this.closeBoxURL_ = "";
    }
    this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);
    this.isHidden_ = opt_opts.isHidden || false;
    this.alignBottom_ = opt_opts.alignBottom || false;
    this.pane_ = opt_opts.pane || "floatPane";
    this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;

    this.div_ = null;
    this.closeListener_ = null;
    this.eventListener1_ = null;
    this.eventListener2_ = null;
    this.eventListener3_ = null;
    this.moveListener_ = null;
    this.contextListener_ = null;
    this.fixedWidthSet_ = null;
}

/* InfoBox extends OverlayView in the Google Maps API v3.
 */
InfoBox.prototype = new google.maps.OverlayView();

/**
 * Creates the DIV representing the InfoBox.
 * @private
 */
InfoBox.prototype.createInfoBoxDiv_ = function () {

    var bw;
    var me = this;

    // This handler prevents an event in the InfoBox from being passed on to the map.
    //
    var cancelHandler = function cancelHandler(e) {
        e.cancelBubble = true;

        if (e.stopPropagation) {

            e.stopPropagation();
        }
    };

    // This handler ignores the current event in the InfoBox and conditionally prevents
    // the event from being passed on to the map. It is used for the contextmenu event.
    //
    var ignoreHandler = function ignoreHandler(e) {

        e.returnValue = false;

        if (e.preventDefault) {

            e.preventDefault();
        }

        if (!me.enableEventPropagation_) {

            cancelHandler(e);
        }
    };

    if (!this.div_) {

        this.div_ = document.createElement("div");

        this.setBoxStyle_();

        if (typeof this.content_.nodeType === "undefined") {
            this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
        } else {
            this.div_.innerHTML = this.getCloseBoxImg_();
            this.div_.appendChild(this.content_);
        }

        // Add the InfoBox DIV to the DOM
        this.getPanes()[this.pane_].appendChild(this.div_);

        this.addClickHandler_();

        if (this.div_.style.width) {

            this.fixedWidthSet_ = true;
        } else {

            if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

                this.div_.style.width = this.maxWidth_;
                this.div_.style.overflow = "auto";
                this.fixedWidthSet_ = true;
            } else {
                // The following code is needed to overcome problems with MSIE

                bw = this.getBoxWidths_();

                this.div_.style.width = this.div_.offsetWidth - bw.left - bw.right + "px";
                this.fixedWidthSet_ = false;
            }
        }

        this.panBox_(this.disableAutoPan_);

        if (!this.enableEventPropagation_) {

            // Cancel event propagation.
            //
            this.eventListener1_ = google.maps.event.addDomListener(this.div_, "mousedown", cancelHandler);
            this.eventListener2_ = google.maps.event.addDomListener(this.div_, "click", cancelHandler);
            this.eventListener3_ = google.maps.event.addDomListener(this.div_, "dblclick", cancelHandler);
            this.eventListener4_ = google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
                this.style.cursor = "default";
            });
        }

        this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

        /**
         * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
         * @name InfoBox#domready
         * @event
         */
        google.maps.event.trigger(this, "domready");
    }
};

/**
 * Returns the HTML <IMG> tag for the close box.
 * @private
 */
InfoBox.prototype.getCloseBoxImg_ = function () {

    var img = "";

    if (this.closeBoxURL_ !== "") {

        img = "<img";
        img += " src='" + this.closeBoxURL_ + "'";
        img += " align=right"; // Do this because Opera chokes on style='float: right;'
        img += " style='";
        img += " position: relative;"; // Required by MSIE
        img += " cursor: pointer;";
        img += " margin: " + this.closeBoxMargin_ + ";";
        img += "'>";
    }

    return img;
};

/**
 * Adds the click handler to the InfoBox close box.
 * @private
 */
InfoBox.prototype.addClickHandler_ = function () {

    var closeBox;

    if (this.closeBoxURL_ !== "") {

        closeBox = this.div_.firstChild;
        this.closeListener_ = google.maps.event.addDomListener(closeBox, 'click', this.getCloseClickHandler_());
    } else {

        this.closeListener_ = null;
    }
};

/**
 * Returns the function to call when the user clicks the close box of an InfoBox.
 * @private
 */
InfoBox.prototype.getCloseClickHandler_ = function () {

    var me = this;

    return function (e) {

        // 1.0.3 fix: Always prevent propagation of a close box click to the map:
        e.cancelBubble = true;

        if (e.stopPropagation) {

            e.stopPropagation();
        }

        me.close();

        /**
         * This event is fired when the InfoBox's close box is clicked.
         * @name InfoBox#closeclick
         * @event
         */
        google.maps.event.trigger(me, "closeclick");
    };
};

/**
 * Pans the map so that the InfoBox appears entirely within the map's visible area.
 * @private
 */
InfoBox.prototype.panBox_ = function (disablePan) {

    var map;
    var bounds;
    var xOffset = 0,
        yOffset = 0;

    if (!disablePan) {

        map = this.getMap();

        if (map instanceof google.maps.Map) {
            // Only pan if attached to map, not panorama

            if (!map.getBounds().contains(this.position_)) {
                // Marker not in visible area of map, so set center
                // of map to the marker position first.
                map.setCenter(this.position_);
            }

            bounds = map.getBounds();

            var mapDiv = map.getDiv();
            var mapWidth = mapDiv.offsetWidth;
            var mapHeight = mapDiv.offsetHeight;
            var iwOffsetX = this.pixelOffset_.width;
            var iwOffsetY = this.pixelOffset_.height;
            var iwWidth = this.div_.offsetWidth;
            var iwHeight = this.div_.offsetHeight;
            var padX = this.infoBoxClearance_.width;
            var padY = this.infoBoxClearance_.height;
            var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

            if (pixPosition.x < -iwOffsetX + padX) {
                xOffset = pixPosition.x + iwOffsetX - padX;
            } else if (pixPosition.x + iwWidth + iwOffsetX + padX > mapWidth) {
                xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
            }
            if (this.alignBottom_) {
                if (pixPosition.y < -iwOffsetY + padY + iwHeight) {
                    yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
                } else if (pixPosition.y + iwOffsetY + padY > mapHeight) {
                    yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
                }
            } else {
                if (pixPosition.y < -iwOffsetY + padY) {
                    yOffset = pixPosition.y + iwOffsetY - padY;
                } else if (pixPosition.y + iwHeight + iwOffsetY + padY > mapHeight) {
                    yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
                }
            }

            if (!(xOffset === 0 && yOffset === 0)) {

                // Move the map to the shifted center.
                //
                var c = map.getCenter();
                map.panBy(xOffset, yOffset);
            }
        }
    }
};

/**
 * Sets the style of the InfoBox by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
InfoBox.prototype.setBoxStyle_ = function () {

    var i, boxStyle;

    if (this.div_) {

        // Apply style values from the style sheet defined in the boxClass parameter:
        this.div_.className = this.boxClass_;

        // Clear existing inline style values:
        this.div_.style.cssText = "";

        // Apply style values defined in the boxStyle parameter:
        boxStyle = this.boxStyle_;
        for (i in boxStyle) {

            if (boxStyle.hasOwnProperty(i)) {

                this.div_.style[i] = boxStyle[i];
            }
        }

        // Fix up opacity style for benefit of MSIE:
        //
        if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {

            this.div_.style.filter = "alpha(opacity=" + this.div_.style.opacity * 100 + ")";
        }

        // Apply required styles:
        //
        this.div_.style.position = "absolute";
        this.div_.style.visibility = 'hidden';
        if (this.zIndex_ !== null) {

            this.div_.style.zIndex = this.zIndex_;
        }
    }
};

/**
 * Get the widths of the borders of the InfoBox.
 * @private
 * @return {Object} widths object (top, bottom left, right)
 */
InfoBox.prototype.getBoxWidths_ = function () {

    var computedStyle;
    var bw = { top: 0, bottom: 0, left: 0, right: 0 };
    var box = this.div_;

    if (document.defaultView && document.defaultView.getComputedStyle) {

        computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

        if (computedStyle) {

            // The computed styles are always in pixel units (good!)
            bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
            bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
            bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
            bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
        }
    } else if (document.documentElement.currentStyle) {
        // MSIE

        if (box.currentStyle) {

            // The current styles may not be in pixel units, but assume they are (bad!)
            bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
            bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
            bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
            bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
        }
    }

    return bw;
};

/**
 * Invoked when <tt>close</tt> is called. Do not call it directly.
 */
InfoBox.prototype.onRemove = function () {

    if (this.div_) {

        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

/**
 * Draws the InfoBox based on the current map projection and zoom level.
 */
InfoBox.prototype.draw = function () {

    this.createInfoBoxDiv_();

    var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

    this.div_.style.left = pixPosition.x + this.pixelOffset_.width + "px";

    if (this.alignBottom_) {
        this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
    } else {
        this.div_.style.top = pixPosition.y + this.pixelOffset_.height + "px";
    }

    if (this.isHidden_) {

        this.div_.style.visibility = 'hidden';
    } else {

        this.div_.style.visibility = "visible";
    }
};

/**
 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
 *  is <tt>open</tt>ed.
 * @param {InfoBoxOptions} opt_opts
 */
InfoBox.prototype.setOptions = function (opt_opts) {
    if (typeof opt_opts.boxClass !== "undefined") {
        // Must be first

        this.boxClass_ = opt_opts.boxClass;
        this.setBoxStyle_();
    }
    if (typeof opt_opts.boxStyle !== "undefined") {
        // Must be second

        this.boxStyle_ = opt_opts.boxStyle;
        this.setBoxStyle_();
    }
    if (typeof opt_opts.content !== "undefined") {

        this.setContent(opt_opts.content);
    }
    if (typeof opt_opts.disableAutoPan !== "undefined") {

        this.disableAutoPan_ = opt_opts.disableAutoPan;
    }
    if (typeof opt_opts.maxWidth !== "undefined") {

        this.maxWidth_ = opt_opts.maxWidth;
    }
    if (typeof opt_opts.pixelOffset !== "undefined") {

        this.pixelOffset_ = opt_opts.pixelOffset;
    }
    if (typeof opt_opts.alignBottom !== "undefined") {

        this.alignBottom_ = opt_opts.alignBottom;
    }
    if (typeof opt_opts.position !== "undefined") {

        this.setPosition(opt_opts.position);
    }
    if (typeof opt_opts.zIndex !== "undefined") {

        this.setZIndex(opt_opts.zIndex);
    }
    if (typeof opt_opts.closeBoxMargin !== "undefined") {

        this.closeBoxMargin_ = opt_opts.closeBoxMargin;
    }
    if (typeof opt_opts.closeBoxURL !== "undefined") {

        this.closeBoxURL_ = opt_opts.closeBoxURL;
    }
    if (typeof opt_opts.infoBoxClearance !== "undefined") {

        this.infoBoxClearance_ = opt_opts.infoBoxClearance;
    }
    if (typeof opt_opts.isHidden !== "undefined") {

        this.isHidden_ = opt_opts.isHidden;
    }
    if (typeof opt_opts.enableEventPropagation !== "undefined") {

        this.enableEventPropagation_ = opt_opts.enableEventPropagation;
    }

    if (this.div_) {

        this.draw();
    }
};

/**
 * Sets the content of the InfoBox.
 *  The content can be plain text or an HTML DOM node.
 * @param {string|Node} content
 */
InfoBox.prototype.setContent = function (content) {
    this.content_ = content;

    if (this.div_) {

        if (this.closeListener_) {

            google.maps.event.removeListener(this.closeListener_);
            this.closeListener_ = null;
        }

        // Odd code required to make things work with MSIE.
        //
        if (!this.fixedWidthSet_) {

            this.div_.style.width = "";
        }

        if (typeof content.nodeType === "undefined") {
            this.div_.innerHTML = this.getCloseBoxImg_() + content;
        } else {
            this.div_.innerHTML = this.getCloseBoxImg_();
            this.div_.appendChild(content);
        }

        // Perverse code required to make things work with MSIE.
        // (Ensures the close box does, in fact, float to the right.)
        //
        if (!this.fixedWidthSet_) {
            this.div_.style.width = this.div_.offsetWidth + "px";
            if (typeof content.nodeType === "undefined") {
                this.div_.innerHTML = this.getCloseBoxImg_() + content;
            } else {
                this.div_.innerHTML = this.getCloseBoxImg_();
                this.div_.appendChild(content);
            }
        }

        this.addClickHandler_();
    }

    /**
     * This event is fired when the content of the InfoBox changes.
     * @name InfoBox#content_changed
     * @event
     */
    google.maps.event.trigger(this, "content_changed");
};

/**
 * Sets the geographic location of the InfoBox.
 * @param {LatLng} latlng
 */
InfoBox.prototype.setPosition = function (latlng) {

    this.position_ = latlng;

    if (this.div_) {

        this.draw();
    }

    /**
     * This event is fired when the position of the InfoBox changes.
     * @name InfoBox#position_changed
     * @event
     */
    google.maps.event.trigger(this, "position_changed");
};

/**
 * Sets the zIndex style for the InfoBox.
 * @param {number} index
 */
InfoBox.prototype.setZIndex = function (index) {

    this.zIndex_ = index;

    if (this.div_) {

        this.div_.style.zIndex = index;
    }

    /**
     * This event is fired when the zIndex of the InfoBox changes.
     * @name InfoBox#zindex_changed
     * @event
     */
    google.maps.event.trigger(this, "zindex_changed");
};

/**
 * Returns the content of the InfoBox.
 * @returns {string}
 */
InfoBox.prototype.getContent = function () {

    return this.content_;
};

/**
 * Returns the geographic location of the InfoBox.
 * @returns {LatLng}
 */
InfoBox.prototype.getPosition = function () {

    return this.position_;
};

/**
 * Returns the zIndex for the InfoBox.
 * @returns {number}
 */
InfoBox.prototype.getZIndex = function () {

    return this.zIndex_;
};

/**
 * Shows the InfoBox.
 */
InfoBox.prototype.show = function () {

    this.isHidden_ = false;
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
};

/**
 * Hides the InfoBox.
 */
InfoBox.prototype.hide = function () {

    this.isHidden_ = true;
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
};

/**
 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
 *  anchor is dragged to a new location, the InfoBox moves as well.
 * @param {Map|StreetViewPanorama} map
 * @param {MVCObject} [anchor]
 */
InfoBox.prototype.open = function (map, anchor) {

    var me = this;

    if (anchor) {

        this.position_ = anchor.getPosition();
        this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
            me.setPosition(this.getPosition());
        });
    }

    this.setMap(map);

    if (this.div_) {

        this.panBox_();
    }
};

/**
 * Removes the InfoBox from the map.
 */
InfoBox.prototype.close = function () {

    if (this.closeListener_) {

        google.maps.event.removeListener(this.closeListener_);
        this.closeListener_ = null;
    }

    if (this.eventListener1_) {

        google.maps.event.removeListener(this.eventListener1_);
        google.maps.event.removeListener(this.eventListener2_);
        google.maps.event.removeListener(this.eventListener3_);
        google.maps.event.removeListener(this.eventListener4_);
        this.eventListener1_ = null;
        this.eventListener2_ = null;
        this.eventListener3_ = null;
        this.eventListener4_ = null;
    }

    if (this.moveListener_) {

        google.maps.event.removeListener(this.moveListener_);
        this.moveListener_ = null;
    }

    if (this.contextListener_) {

        google.maps.event.removeListener(this.contextListener_);
        this.contextListener_ = null;
    }

    this.setMap(null);
};
'use strict';

var transferEquip = angular.module('watchApp.moveEquip', []);
transferEquip.controller('moveEquipCtrl', ['$scope', 'library', 'closeWind', 'pathLogin', 'errorMsg', 'dealer', function ($scope, library, closeWind, pathLogin, errorMsg, dealer) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.dropDown = function ($event) {
        $event.stopPropagation();
        $scope.$emit('modalTransfer', { event: $event });
    };
    $scope.$on('batchTransModal', function (event, data) {
        $scope.aimCustomer = data.userName;
        $scope.aimCusId = data.userId;
    });
    $scope.$on('batchEquipsInfo', function (event, data) {
        data.equips.forEach(function (v, k) {
            if (v.userId !== undefined) {
                dealer.queryById(v.userId).success(function (res) {
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
                }).error(function () {
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
        $scope.equips.splice(i, 1);
    };
    $scope.pushEquip = function () {
        if ($scope.imeiNumber === '' || $scope.imeiNumber === undefined) {
            $scope.warnMessage = errorMsg.imeiError.imeiEmpty;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
        }
        library.queryByImei($scope.imeiNumber).success(function (res) {
            if (res.code === 200 && res.result !== undefined) {
                $scope.queryById(res.result);
            } else if (res.code === 408) {
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.result ? res.msg : errorMsg.queryEmpty;
                $scope.warnMsg = false;
                closeWind.close('.notice', $scope);
            }
        }).error(function () {
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
        dealer.queryById(equip.userId).success(function (res) {
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
        }).error(function () {
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
        var param = {
            ids: [],
            newDealerId: $scope.aimCusId
        };
        if (parseInt($scope.currentUser) === parseInt($scope.aimCusId)) {
            $scope.$emit('transformEquip', { msg: errorMsg.duplication, sign: false });
            return false;
        }
        $scope.equips.forEach(function (v, i) {
            param.ids.push(v.id);
        });
        library.batchTransform(param).success(function (res) {
            if (res.code === 200) {
                $scope.$emit('transformEquip', { msg: res.msg, sign: res.successful, ids: param.ids });
            } else if (res.code === 408) {
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                closeWind.close('.notice', $scope);
            }
            closeWind.close('#moveEquip', $scope);
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#moveEquip', $scope);
        });
    };
}]);
'use strict';

var personalInfo = angular.module('watchApp.personal', []);
personalInfo.controller('personalCtrl', ['$scope', 'userInfo', 'closeWind', 'pathLogin', 'reloadRoute', 'errorMsg', function ($scope, userInfo, closeWind, pathLogin, reloadRoute, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updPersonal = function () {
        var regName = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,10}$/g;
        if ($scope.personalForm.userName !== undefined && $scope.personalForm.userName !== "" && !regName.test($scope.personalForm.userName)) {
            $scope.warnMessage = errorMsg.registerMsg.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.personalForm.dealerPhone !== '' && $scope.personalForm.dealerPhone !== undefined && !phoneReg.test($scope.personalForm.dealerPhone)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var date = {
            'email': $scope.userAdmin.email,
            'userName': $scope.personalForm.userName,
            'linkman': $scope.personalForm.linkman,
            'dealerPhone': $scope.personalForm.dealerPhone,
            'dealerAddress': $scope.personalForm.dealerAddress
        };
        userInfo.update(date).success(function (res) {
            if (res.code === 200) {
                $scope.successMessage = res.msg;
                $scope.sucMsg = false;
                closeWind.close('#personalInfo', $scope);
                reloadRoute.path($scope);
            } else if (res.code === 408) {
                $scope.warnMessage = errorMsg.loginGetaway;
                closeWind.close('#personalInfo', $scope);
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                closeWind.close('#personalInfo', $scope);
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#personalInfo', $scope);
        });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
        reloadRoute.cancel();
    });
}]);
'use strict';

var position = angular.module('watchApp.position', ['ngRoute']);

position.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/position', {
        templateUrl: 'position/position.html'
    }).when('/position/:email', {
        templateUrl: 'position/position.html'
    }).otherwise({ redirectTo: 'position/position.html' });
}]);
position.controller('positionCtrl', ["$rootScope", "$scope", "indexService", "loginGetaway", "$routeParams", "$window", "errorMsg", "ordinaryMsg", "location", "$timeout", function ($rootScope, $scope, indexService, loginGetaway, $routeParams, $window, errorMsg, ordinaryMsg, location, $timeout) {
    $scope.mapChoose = 'baidu';
    $scope.showName = true;
    $scope.isFold = false;
    $scope.iconActive = {};
    $scope.loading = true;
    $rootScope.userAdmin = null;
    $scope.dealerInfo = null;
    var listBox = angular.element('#listContainer');
    var mapBox = angular.element('#mapContainer');
    listBox.height(document.documentElement.clientHeight - 170);
    mapBox.height(document.documentElement.clientHeight - 170);
    $scope.getEquipInfo = function () {
        indexService.indexData().success(function (data) {
            if (data.code === 200) {
                $rootScope.userAdmin = data.result.userInfoDTO;
                location.queryEquipNum($rootScope.userAdmin.id).success(function (res) {
                    if (res.code === 200) {
                        $window.sessionStorage.equipInfo = JSON.stringify({
                            initData: res.result,
                            time: new Date().getTime(),
                            userAdmin: data.result.userInfoDTO
                        });
                        $scope.dealerInfo = res.result ? res.result : [];
                        // 获取customer页面的email，查询数据
                        if ($routeParams.email !== undefined) {
                            var timer = $timeout(function () {
                                $scope.searchCustomers($routeParams.email);
                                $timeout.cancel(timer);
                            }, 1);
                        } else {
                            $scope.loading = false;
                        }
                    }
                    if (res.code === 408) {
                        loginGetaway.goLogin();
                    }
                }).error(function () {
                    $scope.loading = false;
                    $scope.msgModal = errorMsg.serviceException;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                });
            }
            if (data.code === 408) {
                $scope.loading = false;
                loginGetaway.goLogin();
            }
        }).error(function () {
            $scope.loading = false;
            loginGetaway.goLogin();
        });
    };
    if ($window.sessionStorage.equipInfo === undefined) {
        $scope.getEquipInfo();
    } else {
        var nowTime = new Date().getTime();
        var info = JSON.parse($window.sessionStorage.equipInfo);
        if (info.time + 10 * 1000 > nowTime) {
            $rootScope.userAdmin = info.userAdmin;
            $scope.dealerInfo = info.initData;
            $scope.loading = false;
            // 获取customer页面的email，查询数据
            if ($routeParams.email !== undefined) {
                var timer = $timeout(function () {
                    $scope.searchCustomers($routeParams.email);
                    $timeout.cancel(timer);
                }, 1);
            }
        } else {
            $scope.getEquipInfo();
        }
    }
    $scope.mapChooseChg = function () {
        $scope.clockCenter = false;
        $scope.showName = true;
        $scope.detailAddress = "";
        $scope.dealerInfo.forEach(function (value, key) {
            value.isActive = false;
            if (value.equips !== undefined) {
                value.equips.forEach(function (v, k) {
                    v.isActive = false;
                });
            }
        });
    };
    // 搜设备
    $scope.searchEquips = function (imei) {
        $scope.loading = true;
        var data = {
            info: imei ? imei : $scope.searchParams
        };
        var reg = /(^[\d]{10}$)|(^[\d]{15}$)/g;
        if (reg.test(data.info)) {
            location.queryByImei(data.info).success(function (res) {
                $scope.searchByInfo(res, data.info);
            }).error(function () {
                $scope.loading = false;
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        } else {
            location.queryByName(data.info).success(function (res) {
                $scope.searchByInfo(res, data.info);
            }).error(function () {
                $scope.loading = false;
                $scope.msgModal = errorMsg.serviceException;
                angular.element('.bs-example-modal-sm').modal('toggle');
            });
        }
    };
    $scope.searchByInfo = function (json, imei) {
        if (json === null) {
            return false;
        }
        $scope.loading = false;
        if (json.code === 200) {
            var result = json.result; // todo 需要一个email，username为邮箱号
            if (result.equips !== undefined) {
                result.equips.forEach(function (v, k) {
                    if (v.imei === imei) {
                        v.isActive = true;
                        var arr = [];
                        arr.push(v);
                        result.equips = arr;
                    }
                });
            }
            $scope.$broadcast('currentEquips', { customer: result, currentEquip: result.equips[0] });
            $scope.dealerInfo.forEach(function (v, k) {
                v.isActive = v.userName === result.userName;
                if (v.equips !== undefined) {
                    v.equips.forEach(function (val, index) {
                        val.isActive = val.imei === imei;
                    });
                }
            });
        } else if (json.code === 408) {
            loginGetaway.goLogin();
        } else {
            $scope.msgModal = json.msg;
            angular.element('.bs-example-modal-sm').modal('toggle');
        }
    };
    // 搜客户
    $scope.searchCustomers = function (name) {
        var data = {
            info: name ? name : $scope.searchParams
        };
        $scope.loading = true;
        location.queryByEmail(data).success(function (res) {
            if (res.code === 200) {
                var result = res.result;
                $scope.loading = false;
                $scope.$broadcast('currentEquips', { customer: result });
                $scope.dealerInfo.forEach(function (v, k) {
                    v.isActive = v.userName === result.userName;
                    if (v.equips !== undefined) {
                        v.equips.forEach(function (val, index) {
                            val.isActive = false;
                        });
                    }
                });
            } else if (res.code === 408) {
                loginGetaway.goLogin();
            } else {
                $scope.loading = false;
                $scope.msgModal = res.msg;
                angular.element('.bs-example-modal-sm').modal('toggle');
            }
        }).error(function () {
            $scope.loading = false;
            $scope.msgModal = errorMsg.serviceException;
            angular.element('.bs-example-modal-sm').modal('toggle');
        });
    };
    $scope.collapseClick = function (e, name, index) {
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        $scope.searchCustomers(name);

        $scope.dealerInfo.forEach(function (value, key) {
            value.isActive = value.userName === name;
            if (value.equips !== undefined) {
                value.equips.forEach(function (v, k) {
                    v.isActive = false;
                });
            }
        });
        $scope.iconActive[index] = e.target.getAttribute('aria-expanded');
    };
    $scope.equipChoose = function (imei) {
        $scope.searchEquips(imei);
        $scope.detailAddress = "";
    };
    $scope.operatMenu = function (flag) {
        if (flag === 'close') {
            angular.element('.customer-list-head').animate({ 'width': 0 }, function () {
                $scope.$apply(function () {
                    $scope.isFold = true;
                });
            });
            angular.element('.position-map').animate({ 'width': "98%" });
        } else {
            angular.element('.customer-list-head').animate({ 'width': '16.66666667%' }, function () {
                $scope.$apply(function () {
                    $scope.isFold = false;
                });
            });
            angular.element('.position-map').animate({ 'width': "83.33333333%" });
        }
    };
    $scope.isShowName = function (flag) {
        $scope.$broadcast('showNameFlag', flag);
    };
    $scope.isClockCenter = function (flag) {
        $scope.$broadcast('clockCenterFlag', flag);
    };
    $scope.$on('getAddress', function (event, data) {
        $scope.$apply(function () {
            $scope.detailAddress = data;
        });
    });
    $scope.$on('makerClick', function (event, data) {
        $scope.$apply(function () {
            $scope.dealerInfo.forEach(function (value, key) {
                value.isActive = false;
                if (value.equips !== undefined) {
                    value.equips.forEach(function (v, k) {
                        v.isActive = v.name === data.name;
                    });
                }
            });
        });
    });
    $scope.$on('errorInfo', function (event, data) {
        $scope.msgModal = data.msg;
        angular.element('.bs-example-modal-sm').modal('toggle');
    });
    // 刷新查询
    $scope.$on('freshQuery', function (event, data) {
        if (data.currentEquip !== undefined && data.currentEquip !== null) {
            $scope.searchEquips(data.currentEquip.imei);
        } else {
            $scope.searchCustomers(data.customer.userName);
        }
    });
}]);
position.filter('returnEmptyStr', function () {
    return function (value) {
        return value === undefined || value === null ? '' : value;
    };
});
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
"use strict";

var searchEquips = angular.module('watchApp.searchEquips', []);
searchEquips.controller('searchEquipsCtrl', ["$scope", "library", "closeWind", "pathLogin", "ordinaryMsg", "errorMsg", "loginGetaway", "dealer", "$location", "$timeout", function ($scope, library, closeWind, pathLogin, ordinaryMsg, errorMsg, loginGetaway, dealer, $location, $timeout) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.recordNum = 0;
    $scope.$on('equipInfo', function (event, data) {
        $scope.customer = undefined;
        $scope.equip = data;
        $scope.recordNum = data ? 1 : 0;
        if (data.dealerId !== undefined) {
            $scope.searchDealerSub(data.dealerId);
        }
    });
    $scope.searchDealerSub = function (id) {
        dealer.queryById(id).success(function (res) {
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
        }).error(function () {
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
        var data = {
            event: $event,
            id: equip.id
        };
        $scope.$emit('modalTransfer', data);
    };
    $scope.removeEquip = function (libraryId) {
        library.delete(libraryId).success(function (res) {
            var data = {
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
        }).error(function () {
            $scope.$emit('delMsg', { 'msg': errorMsg.serviceException, 'id': null });
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
        var timer = $timeout(function () {
            $location.path('/position/' + $scope.customer.email);
            $timeout.cancel(timer);
        }, 500);
    };
}]);
"use strict";

var searchCustomers = angular.module('watchApp.searchCustomers', []);
searchCustomers.controller('searchCustomersCtrl', ["$scope", "$timeout", "$location", function ($scope, $timeout, $location) {
    $scope.$on('myCustomerInfo', function (event, data) {
        $scope.cusInfo = data;
    });
    $scope.showCustomer = function () {
        angular.element('#searchCustomers').modal('hide');
        angular.element('#showCustomer').modal('toggle');
        $scope.$emit('showCusInfo', $scope.cusInfo);
    };
    $scope.showPosition = function () {
        angular.element('#searchCustomers').modal('hide');
        var timer = $timeout(function () {
            $location.path('/position/' + $scope.cusInfo.email);
            $timeout.cancel(timer);
        }, 500);
    };
}]);
'use strict';

var showCustomer = angular.module('watchApp.showCustomer', []);
showCustomer.controller('showCustomerCtrl', ['$scope', 'userInfo', 'closeWind', 'pathLogin', 'errorMsg', 'dealer', function ($scope, userInfo, closeWind, pathLogin, errorMsg, dealer) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.$on('customerInfo', function (event, data) {
        $scope.currentCus = data;
        $scope.userInfoForm = {};
    });
    //右键传过来的客户email
    $scope.$on('dealerMsg', function (event, data) {
        var param = {
            'info': data.email
        };
        dealer.queryByEmail(param).success(function (res) {
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
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#searchCustomers', $scope);
        });
    });
    $scope.updUserInfo = function () {
        var regName = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,10}$/g;
        if ($scope.userInfoForm.userName !== undefined && $scope.userInfoForm.userName !== "" && !regName.test($scope.userInfoForm.userName)) {
            $scope.warnMessage = errorMsg.registerMsg.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.userInfoForm.dealerPhone !== '' && $scope.userInfoForm.dealerPhone !== undefined && !phoneReg.test($scope.userInfoForm.dealerPhone)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var data = {
            'id': $scope.currentCus.id,
            'email': $scope.currentCus.email,
            'userName': $scope.userInfoForm.userName ? $scope.userInfoForm.userName : $scope.currentCus.userName,
            'linkman': $scope.userInfoForm.linkman ? $scope.userInfoForm.linkman : $scope.currentCus.linkman,
            'dealerPhone': $scope.userInfoForm.dealerPhone ? $scope.userInfoForm.dealerPhone : $scope.currentCus.dealerPhone,
            'dealerAddress': $scope.userInfoForm.dealerAddress ? $scope.userInfoForm.dealerAddress : $scope.currentCus.dealerAddress
        };
        userInfo.updateSubordinate(data).success(function (res) {
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
        }).error(function () {
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
'use strict';

var transferCustomer = angular.module('watchApp.transferCustomer', []);
transferCustomer.controller('transferCustomerCtrl', ['$scope', 'library', 'errorMsg', 'pathLogin', 'closeWind', function ($scope, library, errorMsg, pathLogin, closeWind) {
    $scope.allUser = null;
    $scope.$on('allUserInfo', function (event, data) {
        $scope.allUser = data;
    });
    $scope.$on('transformInfo', function (event, data) {
        $scope.equipId = data.equipId;
        $scope.userId = data.userId;
    });
    $scope.customerClick = function (user) {
        var params = {
            id: $scope.equipId,
            newDealerId: user.userId
        };
        if ($scope.equipId === undefined) {
            $scope.$emit('batchTrans', user);
        } else {
            if (parseInt(user.userId) === parseInt($scope.userId)) {
                $scope.$emit('transformEquip', { msg: errorMsg.duplication, sign: false });
                return false;
            }
            library.transform(params).success(function (res) {
                if (res.code === 200) {
                    closeWind.close('#searchEquips', $scope);
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                }
                $scope.$emit('transformEquip', { msg: res.msg, sign: res.successful, ids: [$scope.equipId] });
            }).error(function () {
                $scope.$emit('transformEquip', { msg: errorMsg.serviceException, sign: false });
            });
        }
    };
}]);
'use strict';

var updateEquip = angular.module('watchApp.updateEquip', []);
updateEquip.controller('updateEquipCtrl', ["$scope", "library", "closeWind", "pathLogin", "errorMsg", function ($scope, library, closeWind, pathLogin, errorMsg) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.updEquip = function () {
        var regName = /^\d+$/;
        if (regName.test($scope.equipForm.equipName)) {
            $scope.warnMessage = errorMsg.imeiError.name;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var phoneReg = /^1[3|4|5|8][0-9]\d{8}$/g;
        if ($scope.equipForm.sim !== '' && $scope.equipForm.sim !== undefined && !phoneReg.test($scope.equipForm.sim)) {
            $scope.warnMessage = errorMsg.phoneError;
            $scope.warnMsg = false;
            closeWind.close('.notice', $scope);
            return;
        }
        var data = {
            'imei': $scope.equip.imei,
            'id': $scope.equip.id,
            'equipName': $scope.equipForm.equipName ? $scope.equipForm.equipName : $scope.equip.equipName,
            'sim': $scope.equip.sim,
            'remark': $scope.equipForm.remark ? $scope.equipForm.remark : $scope.equip.remark,
            'createTime': null,
            'activationTime': null
        };
        library.update(data).success(function (res) {
            if (res.code === 200) {
                $scope.successMessage = res.msg;
                $scope.sucMsg = false;
                $scope.$emit('equipData', data);
                closeWind.close('#updateEquip', $scope);
            } else if (res.code === 408) {
                $scope.warnMessage = errorMsg.loginGetaway;
                closeWind.close('#updateEquip', $scope);
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                closeWind.close('#updateEquip', $scope);
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#updateEquip', $scope);
        });
    };
    $scope.clearPhone = function () {
        if ($scope.equip === undefined) {
            return;
        }
        library.resetPhone($scope.equip.id).success(function (res) {
            if (res.code === 200) {
                $scope.successMessage = res.msg;
                $scope.sucMsg = false;
                $scope.equip.sim = "";
                closeWind.close('#updateEquip', $scope);
            } else if (res.code === 408) {
                $scope.warnMessage = errorMsg.loginGetaway;
                closeWind.close('#updateEquip', $scope);
                pathLogin.path($scope);
            } else {
                $scope.warnMessage = res.msg;
                $scope.warnMsg = false;
                closeWind.close('#updateEquip', $scope);
            }
        }).error(function () {
            $scope.warnMessage = errorMsg.serviceException;
            $scope.warnMsg = false;
            closeWind.close('#updateEquip', $scope);
        });
    };
    $scope.$on('$destroy', function () {
        closeWind.cancel();
        pathLogin.cancel();
    });
}]);
'use strict';

var updatePassword = angular.module('watchApp.password', []);
updatePassword.controller('updPswCtrl', ['$scope', 'errorMsg', '$location', '$timeout', 'password', 'closeWind', 'pathLogin', function ($scope, errorMsg, $location, $timeout, password, closeWind, pathLogin) {
    $scope.warnMsg = true;
    $scope.sucMsg = true;
    $scope.errorPassword = errorMsg.password;
    $scope.updPsw = function () {
        if ($scope.oldPassword === null || $scope.oldPassword === '' || $scope.newPassword === null || $scope.newPassword === '') {
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
        var params = { 'oldPassword': $scope.oldPassword, 'newPassword': $scope.newPassword };
        password.updatePassword(params).success(function (res) {
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
        }).error(function () {
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
        pathLogin.cancel();
    });
}]);
'use strict';

angular.module('watchApp.version.interpolate-filter', []).filter('interpolate', ['version', function (version) {
  return function (text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);
'use strict';

angular.module('watchApp.version.version-directive', []).directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);
'use strict';

angular.module('watchApp.version', ['watchApp.version.interpolate-filter', 'watchApp.version.version-directive']).value('version', '0.1');