'use strict';

let baiduMap = angular.module('watchApp.baiduMap', []);
baiduMap.controller("baiduMapCtrl", ["$scope", "$filter", function ($scope, $filter) {
    $scope.map = new BMap.Map("baiduContainer");
    $scope.point = new BMap.Point(114.026033, 22.559138);  // 创建点坐标
    $scope.map.centerAndZoom($scope.point, 14);
    $scope.map.enableScrollWheelZoom(); //启动鼠标滚轮缩放地图
    $scope.map.addControl(new BMap.NavigationControl({ //地图平移缩放控件
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        enableGeolocation: true
    }));
    $scope.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(70, 20),
    }));
    $scope.map.addControl(new BMap.GeolocationControl());// 添加定位控件
    $scope.map.addControl(new BMap.ScaleControl());//比例尺控件
    $scope.map.addControl(new BMap.OverviewMapControl());//缩略地图控件
    $scope.map.addControl(new BMap.MapTypeControl());//地图类型控件
    $scope.map.setCurrentCity("深圳");
    $scope.pointCoordinate = {};
    //点击事件
    $scope.map.addEventListener("click", function (e) {
        let pt = e.point;
        new BMap.Geocoder().getLocation(pt, function (rs) {
            if (rs === undefined && rs === null) {
                return false;
            }
            let addComp = rs.addressComponents;
            let site = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
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
        let src = val.online ? "map/online.png" : "map/offline.png";
        if (val.lat === undefined) {
            return;
        }
        let point = new BMap.Point(val.lng, val.lat);
        let marker = new BMap.Marker(point, {  // 创建标注
            icon: new BMap.Icon(src, new BMap.Size(32, 41))
        });
        let label = new BMap.Label(val.name, {offset: new BMap.Size(37, 6)}); // 创建名字
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
        let infoOpts = {
            enableMessage: true//设置允许信息窗发送短息
        };
        let msg = `
            <p>${$filter('returnEmptyStr')(val.name)}</p>
            <p>IMEI号：${$filter('returnEmptyStr')(val.imei)}</p>
            <p>状态：${val.online ? '在线' : '离线'}</p>
            <p>电量：${$filter('returnEmptyStr')(val.electricity)}%</p>
            <p>定位时间：${$filter('returnEmptyStr')(val.locationTime)}</p>
            <p>停留时间：${$filter('returnEmptyStr')(val.residenceTime)}</p>
        `;
        $scope.map.addOverlay(marker);
        marker.setLabel(label);
        marker.setAnimation(BMAP_ANIMATION_DROP);
        if (val.isActive) {
            $scope.map.openInfoWindow(new BMap.InfoWindow(msg, infoOpts), point); //开启信息窗口
            $scope.pointCoordinate.lng = val.lng;
            $scope.pointCoordinate.lat = val.lat;
        }
        marker.addEventListener("click", function (e) {
            let p = e.target;
            $scope.pointCoordinate.lng = p.getPosition().lng;
            $scope.pointCoordinate.lat = p.getPosition().lat;
            $scope.map.openInfoWindow(new BMap.InfoWindow(msg, infoOpts), point); //开启信息窗口
            if ($scope.isCenterFlag) {
                $scope.map.panTo(new BMap.Point($scope.pointCoordinate.lng, $scope.pointCoordinate.lat));
                $scope.map.disableInertialDragging();
            }
            $scope.$emit('makerClick', val);
        });
    };
    $scope.$on('showNameFlag', function (event, data) {
        angular.element('.BMap_Marker .BMapLabel').css('display', data ? 'block' : 'none')
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
    $scope.$on('currentEquips', function (event, data) {
        if (data.customer === undefined && data.customer === null) {
            return false;
        }
        $scope.map.clearOverlays();
        angular.forEach(data.customer.equips, function (value, key) {
            $scope.createMark(value);
        });
        if (data.currentEquip !== undefined && data.currentEquip !== null) {
            if (data.currentEquip.lng === undefined) {
                $scope.$emit('errorInfo', {msg: '没有坐标信息'});
                return false;
            }
            $scope.map.panTo(new BMap.Point(data.currentEquip.lng, data.currentEquip.lat));
            new BMap.Geocoder().getLocation({lng: data.currentEquip.lng, lat: data.currentEquip.lat}, function (rs) {
                if (rs === undefined || rs === null) {
                    return false;
                }
                let addComp = rs.addressComponents;
                let site = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                $scope.$emit('getAddress', site);
            });
        } else {
            $scope.pointCoordinate = {};
        }
    });
}]);