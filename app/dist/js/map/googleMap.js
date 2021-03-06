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