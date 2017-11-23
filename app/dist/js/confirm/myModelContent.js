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