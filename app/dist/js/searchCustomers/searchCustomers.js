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