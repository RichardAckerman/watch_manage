'use strict';

let customer = angular.module('watchApp.customer', ['ngRoute']);
customer.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/customer', {
        templateUrl: 'customer/customer.html'
    });
}]);

customer.directive('contextmenu', function ($filter) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            let menuElement = angular.element("#rightMenu");
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
    }
});

customer.controller('customerCtrl', function ($rootScope, $scope, indexService, loginGetaway, dealer, pathLogin, confirmService,
                                              library, errorMsg, ordinaryMsg, $window, $filter, closeWind, $timeout) {
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
    $scope.userList = true;// 转移设备客户列表
    // 窗口绑定事件
    angular.element($window).on('click', function () {
        $scope.$apply(function () {
            $scope.userList = true;
            $scope.rightMenuHide = true;
        });
    });
    indexService
        .indexData()
        .success(function (res) {
            if (res.code === 200) {
                if (res.result === null || res.result === undefined) {
                    loginGetaway.goLogin();
                    return false;
                }
                let result = res.result;
                $scope.messageType = ordinaryMsg.customerInfo;
                $rootScope.userAdmin = result.userInfoDTO;
                $scope.userDealer = result.userInfoDTO;
                $rootScope.userEquipNum = 0;
                if (typeof result.dealerInfoVos !== 'undefined') {
                    let dealerInfoVos = result.dealerInfoVos;
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
                loginGetaway.goLogin();
            }
        })
        .error(function () {
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
        let pagingParam = {
            "pageSize": size,
            "pageNum": num ? num : 1,
            "dealerId": $scope.userDealer.id
        };
        library
            .queryPage(pagingParam)
            .success(function (res) {
                if (res.code === 200) {
                    console.log(res);
                    $scope.equips = res.result;
                    $scope.pageIsActive = pagingParam.pageNum;
                    if (pagingParam.dealerId === $rootScope.userAdmin.id) {
                        $scope.pages = new Array($filter('ceil')($rootScope.userEquipNum / $scope.pageSize));
                    } else {
                        $scope.subordinateDealers.forEach(function (v, i) {
                            if ($filter('ceil')(v.userId) === $filter('ceil')(pagingParam.dealerId)) {
                                let equipNum = v.equipNum;
                                $scope.pages = new Array($filter('ceil')(equipNum / $scope.pageSize));
                            }
                        });
                    }
                    $scope.equipAll = false;
                }
                if (res.code === 408) {
                    loginGetaway.goLogin();
                }
            })
            .error(function () {
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
        let menu = angular.element('#transferCustomer');
        let width = menu.width();
        menu.css({
            'top': data.event.clientY + 'px',
            'left': data.event.clientX - width + 'px',
            'zIndex': 1100
        });
        $scope.$broadcast('transformInfo', {equipId: data.id, userId: $scope.userDealer.id});
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
        if (data.sign)
            $scope.updateDealer(data);
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
        let menu = angular.element('#transferCustomer');
        let width = menu.width();
        menu.css('top', $event.clientY + 'px');
        menu.css('left', $event.clientX - width + 'px');
        $scope.$broadcast('transformInfo', {equipId: id, userId: $scope.userDealer.id});
    };
    $scope.showTransWindow = function (e) {
        $scope.userList = false;
        let menu = angular.element('#transferCustomer');
        let width = menu.width();
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
        let content = '确认删除吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            library
                .delete(libraryId)
                .success(function (res) {
                    if (res.code === 200) {
                        $scope.msgModal = ordinaryMsg.deleteInfo.success;
                        $scope.updateDealer({ids: [libraryId]});
                        angular.element('.bs-example-modal-sm').modal('toggle');
                    } else if (res.code === 408) {
                        loginGetaway.goLogin();
                    } else {
                        $scope.msgModal = ordinaryMsg.deleteInfo.failure;
                        angular.element('.bs-example-modal-sm').modal('toggle');
                    }
                })
                .error(function () {
                    $scope.msgModal = errorMsg.serviceException;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                });
        });
    };
    // 批量转移
    $scope.moveEquip = function () {
        let newEquips = [];
        if ($scope.equips === undefined) {
            return false;
        }
        $scope.equips.forEach(function (item, index, array) {
            if (item.isChecked === true) {
                newEquips.push(item);
            }
        });
        $scope.$broadcast('batchEquipsInfo', {equips: newEquips, userId: $scope.userDealer.id});
        angular.element('#moveEquip').modal('toggle');
    };
    // 批量删除
    $scope.delInBatch = function () {
        let data = {
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
        let content = '确认删除吗？';
        confirmService.openConfirmWindow($scope, content).then(function () {
            library
                .batchDelete(data)
                .success(function (res) {
                    if (res.code === 200) {
                        $scope.updateDealer(data);
                    } else if (res.code === 408) {
                        pathLogin.path($scope);
                    }
                    $scope.msgModal = res.msg;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                })
                .error(function () {
                    $scope.msgModal = errorMsg.serviceException;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                });
        });
    };
    // 导出Excel
    $scope.exportExcel = function () {
        let blob = new Blob(['name:3324', 'age:15', 4, 2, 2, 2, 2, 2, 4], {type: "application/vnd.ms-excel"});
        // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8
        // application/vnd.ms-excel
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', '信息.xls');
        let timer = $timeout(function () {
            a.click();
            URL.revokeObjectURL(objectUrl);
            $timeout.cancel(timer);
        }, 1);
    };
    // 搜客户
    $scope.searchCustomers = function () {
        if ($scope.searchParams === undefined || $scope.searchParams === '') {
            $scope.msgModal = ordinaryMsg.emptyInfo;
            angular.element('.bs-example-modal-sm').modal('toggle');
            return;
        }
        let data = {
            'info': $scope.searchParams
        };
        dealer.queryByEmail(data)
            .success(function (res) {
                if (res.code === 200 && res.result !== undefined) {
                    $scope.$broadcast('myCustomerInfo', res.result);
                    angular.element('#searchCustomers').modal('toggle');
                } else if (res.code === 408) {
                    pathLogin.path($scope);
                } else {
                    $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                }
            })
            .error(function () {
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
        let reg = /^\d{15}$/g;
        if (reg.test($scope.searchParams)) {
            library.queryByImei($scope.searchParams)
                .success(function (res) {
                    if (res.code === 200 && res.result !== undefined) {
                        $scope.$broadcast('equipInfo', res.result);
                        angular.element('#searchEquips').modal('toggle');
                    } else if (res.code === 408) {
                        pathLogin.path($scope);
                    } else {
                        $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                        angular.element('.bs-example-modal-sm').modal('toggle');
                    }
                })
                .error(function () {
                    $scope.msgModal = errorMsg.serviceException;
                    angular.element('.bs-example-modal-sm').modal('toggle');
                });
        } else {
            library
                .queryByName($scope.searchParams)
                .success(function (res) {
                    if (res.code === 200 && res.result !== undefined) {
                        $scope.$broadcast('equipInfo', res.result);
                        angular.element('#searchEquips').modal('toggle');
                    } else if (res.code === 408) {
                        pathLogin.path($scope);
                    } else {
                        $scope.msgModal = res.result ? res.msg : errorMsg.queryEmpty;
                        angular.element('.bs-example-modal-sm').modal('toggle');
                    }
                })
                .error(function () {
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
        let param = {
            'info': email
        };
        dealer.queryByEmail(param)
            .success(function (res) {
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
            })
            .error(function () {
                $scope.warnMessage = errorMsg.serviceException;
                $scope.warnMsg = false;
            });
    };
    // 更新左侧菜单
    $scope.updateDealer = function (param) {
        indexService
            .indexData()
            .success(function (res) {
                if (res.code === 200) {
                    let result = res.result;
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
                    if (param.ids === undefined)
                        return false;
                    let newEquips = [], hash = [];
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
            })
            .error(function () {
                loginGetaway.goLogin();
            });
    }
});


customer.filter('blank', function (ordinaryMsg) {
    return function (text) {
        if (typeof text === 'undefined' || text === '') {
            return ordinaryMsg.undefinedInfo
        }
        return text;
    }
});

customer.filter('inactive', function (ordinaryMsg) {
    return function (text, param) {
        if (param === 0) {
            return ordinaryMsg.inactive
        }
        if (typeof text === 'undefined' || text === '') {
            return ordinaryMsg.undefinedInfo
        }
        return text
    }
});

customer.filter('ceil', function () {
    return function (number) {
        return Math.ceil(number);
    }
});

customer.filter('integer', function () {
    return function (number) {
        return parseInt(number);
    }
});