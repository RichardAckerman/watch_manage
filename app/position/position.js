'use strict';

let position = angular.module('watchApp.position', ['ngRoute']);

position.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/position', {
            templateUrl: 'position/position.html'
        })
        .when('/position/:email', {
            templateUrl: 'position/position.html'
        })
        .otherwise({redirectTo: 'position/position.html'});
}]);
position.controller('positionCtrl', ["$rootScope", "$scope", "indexService", "loginGetaway", "$routeParams", "$window",
    "errorMsg", "ordinaryMsg", "location", "$timeout", function ($rootScope, $scope, indexService, loginGetaway, $routeParams, $window,
                                                                 errorMsg, ordinaryMsg, location, $timeout) {
        $scope.mapChoose = 'baidu';
        $scope.showName = true;
        $scope.isFold = false;
        $scope.iconActive = {};
        $scope.loading = true;
        $rootScope.userAdmin = null;
        $scope.dealerInfo = null;
        let listBox = angular.element('#listContainer');
        let mapBox = angular.element('#mapContainer');
        listBox.height(document.documentElement.clientHeight - 170);
        mapBox.height(document.documentElement.clientHeight - 170);
        $scope.getEquipInfo = function () {
            indexService
                .indexData()
                .success(function (data) {
                    if (data.code === 200) {
                        $rootScope.userAdmin = data.result.userInfoDTO;
                        location
                            .queryEquipNum($rootScope.userAdmin.id)
                            .success(function (res) {
                                if (res.code === 200) {
                                    $window.sessionStorage.equipInfo = JSON.stringify({
                                        initData: res.result,
                                        time: (new Date().getTime()),
                                        userAdmin: data.result.userInfoDTO
                                    });
                                    $scope.dealerInfo = res.result ? res.result : [];
                                    // 获取customer页面的email，查询数据
                                    if ($routeParams.email !== undefined) {
                                        let timer = $timeout(function () {
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
                            })
                            .error(function () {
                                $scope.loading = false;
                                $scope.msgModal = errorMsg.serviceException;
                                angular.element('.bs-example-modal-sm').modal('toggle');
                            });
                    }
                    if (data.code === 408) {
                        $scope.loading = false;
                        loginGetaway.goLogin();
                    }
                })
                .error(function () {
                    $scope.loading = false;
                    loginGetaway.goLogin();
                });
        };
        if ($window.sessionStorage.equipInfo === undefined) {
            $scope.getEquipInfo();
        } else {
            let nowTime = (new Date()).getTime();
            let info = JSON.parse($window.sessionStorage.equipInfo);
            if (info.time + 10 * 1000 > nowTime) {
                $rootScope.userAdmin = info.userAdmin;
                $scope.dealerInfo = info.initData;
                $scope.loading = false;
                // 获取customer页面的email，查询数据
                if ($routeParams.email !== undefined) {
                    let timer = $timeout(function () {
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
            let data = {
                info: imei ? imei : $scope.searchParams
            };
            let reg = /(^[\d]{10}$)|(^[\d]{15}$)/g;
            if (reg.test(data.info)) {
                location
                    .queryByImei(data.info)
                    .success(function (res) {
                        $scope.searchByInfo(res, data.info);
                    })
                    .error(function () {
                        $scope.loading = false;
                        $scope.msgModal = errorMsg.serviceException;
                        angular.element('.bs-example-modal-sm').modal('toggle');
                    });
            } else {
                location
                    .queryByName(data.info)
                    .success(function (res) {
                        $scope.searchByInfo(res, data.info);
                    })
                    .error(function () {
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
                let result = json.result;  // todo 需要一个email，username为邮箱号
                if (result.equips !== undefined) {
                    result.equips.forEach(function (v, k) {
                        if (v.imei === imei) {
                            v.isActive = true;
                            let arr = [];
                            arr.push(v);
                            result.equips = arr;
                        }
                    });
                }
                $scope.$broadcast('currentEquips', {customer: result, currentEquip: result.equips[0]});
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
            let data = {
                info: name ? name : $scope.searchParams
            };
            $scope.loading = true;
            location
                .queryByEmail(data)
                .success(function (res) {
                    if (res.code === 200) {
                        let result = res.result;
                        $scope.loading = false;
                        $scope.$broadcast('currentEquips', {customer: result});
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
                })
                .error(function () {
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
                angular.element('.customer-list-head').animate({'width': 0}, function () {
                    $scope.$apply(function () {
                        $scope.isFold = true;
                    });
                });
                angular.element('.position-map').animate({'width': "98%"});
            } else {
                angular.element('.customer-list-head').animate({'width': '16.66666667%'}, function () {
                    $scope.$apply(function () {
                        $scope.isFold = false;
                    });
                });
                angular.element('.position-map').animate({'width': "83.33333333%"});
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
        return value === undefined || value === null ? '' : value
    }
});