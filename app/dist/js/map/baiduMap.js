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