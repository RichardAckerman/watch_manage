'use strict';

let api = angular.module('watchApp.api', []);
const TEST = 'http://192.168.1.254:8080/watch';
const PRODUCT = 'https://so360.org/watch';
const HOST = TEST;
const API_LOGIN = HOST + '/adminSignIn';
const API_LOGOUT = HOST + '/logOut';
const API_INDEX_DATA = HOST + '/admin/adminIndexView';
const API_UPDATE_PASSWORD = HOST + '/admin/password';
const API_UPDATE_USER_INFO = HOST + '/admin/userInfo';
const API__EQUIP = HOST + '/admin/library';
const API__EQUIP_ID = API__EQUIP + '/id/';
const API__EQUIP_IMEI = API__EQUIP + '/imei/';
const API__EQUIP_NAME = HOST + '/admin/equip/name/';
const API_EQUIP_PAGE = HOST + '/admin/libraries';
const API_EQUIP_DETAIL = HOST + '/admin/allEquipInfo/superiorId/';
const API_DELETE_BATCH = API__EQUIP + '/remove/batch';
const API_DEALER = HOST + '/admin/dealer';
const API_DEALER_ID = HOST + '/admin/library/user/dealerId/';
const API_DEALER_EMAIL = HOST + '/admin/library/user/emailOrUserName';
const API_DEALER_UPDATE = HOST + '/admin/dealer/';
const API__EQUIP_TRANSFORM = API__EQUIP + '/move';
const API__EQUIP_BATCH = API__EQUIP_TRANSFORM + '/batch';
const API_POSITION_EMAIL = HOST + '/admin/equipInfo/info';
const API_POSITION_IMEI = HOST + '/admin/equipInfo/imei/';
const API_POSITION_NAME = HOST + '/admin/equipInfo/name/';
const API_RESET_PHONE = HOST + '/admin/reset/userPhone/';
api.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.transformRequest = [
        function (data) {
            return $httpProvider.defaults.paramSerializer(data)
        }
    ];
});
api.factory('authService', function ($http) {
    return {
        signIn: function (params) {
            return $http({
                url: API_LOGIN,
                method: 'POST',
                cache: true,
                data: params
            });
        },
        oAuth: function (params) {
            return $http({
                url: API_LOGIN,
                method: 'POST',
                data: params
            })
        },
        signOut: function () {
            return $http({
                url: API_LOGOUT,
                method: 'POST'
            })
        }
    };
});
api.factory('indexService', function ($http) {
    return {
        indexData: function () {
            return $http({
                url: API_INDEX_DATA,
                method: 'GET'
            });
        }
    }
});
api.factory('password', function ($http) {
    return {
        updatePassword: function (params) {
            return $http({
                url: API_UPDATE_PASSWORD,
                method: 'POST',
                data: params
            });
        }
    }
});
api.factory('userInfo', function ($http) {
    return {
        update: function (params) {
            return $http({
                url: API_UPDATE_USER_INFO,
                method: 'PATCH',
                data: params
            });
        },
        updateSubordinate: function (params) {
            return $http({
                url: API_UPDATE_USER_INFO,
                method: 'POST',
                data: params
            });
        }
    }
});
api.factory('library', function ($http) {
    return {
        queryByImei: function (imei) {
            return $http({
                url: API__EQUIP_IMEI + imei,
                method: 'GET'
            });
        },
        queryByName: function (name) {
            return $http({
                url: API__EQUIP_NAME + name,
                method: 'GET'
            });
        },
        queryById: function (id) {
            return $http({
                url: API__EQUIP_ID + id,
                method: 'GET'
            });
        },
        queryPage: function (params) {
            return $http({
                url: API_EQUIP_PAGE,
                method: 'GET',
                params: params
            });
        },
        put: function (params) {
            return $http({
                url: API__EQUIP,
                method: 'PUT',
                data: params
            });
        },
        update: function (params) {
            return $http({
                url: API__EQUIP,
                method: 'PATCH',
                data: params
            });
        },
        delete: function (id) {
            return $http({
                url: API__EQUIP_ID + id,
                method: 'DELETE',
            });
        },
        batchDelete: function (params) {
            return $http({
                url: API_DELETE_BATCH,
                method: 'POST',
                data: params
            });
        },
        transform: function (params) {
            return $http({
                url: API__EQUIP_TRANSFORM,
                method: 'POST',
                data: params
            });
        },
        batchTransform: function (params) {
            return $http({
                url: API__EQUIP_BATCH,
                method: 'POST',
                data: params
            })
        },
        resetPhone: function (id) {
            return $http({
                url: API_RESET_PHONE + id,
                method: 'DELETE',
            })
        }
    }
});
api.factory('dealer', function ($http) {
    return {
        addCus: function (param) {
            return $http({
                url: API_DEALER,
                method: 'POST',
                data: param
            });
        },
        delCus: function (id) {
            return $http({
                url: API_DEALER_UPDATE + id,
                method: 'DELETE'
            });
        },
        resetPwd: function (id) {
            return $http({
                url: API_DEALER_UPDATE + id,
                method: 'PATCH'
            });
        },
        queryById: function (id) {
            return $http({
                url: API_DEALER_ID + id,
                method: 'GET'
            });
        },
        queryByEmail: function (param) {
            return $http({
                url: API_DEALER_EMAIL,
                method: 'GET',
                params: param
            });
        },
    }
});
api.factory('location', function ($http) {
    return {
        queryEquipNum: function (id) {
            return $http({
                url: API_EQUIP_DETAIL + id,
                method: 'GET',
            });
        },
        queryByEmail: function (param) {
            return $http({
                url: API_POSITION_EMAIL,
                method: 'GET',
                params: param
            });
        },
        queryByImei: function (imei) {
            return $http({
                url: API_POSITION_IMEI + imei,
                method: 'GET'
            });
        },
        queryByName: function (name) {
            return $http({
                url: API_POSITION_NAME + name,
                method: 'GET'
            });
        }
    }
});