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