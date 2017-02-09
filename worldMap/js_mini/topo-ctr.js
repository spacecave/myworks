$(function() {

    var chinaGeoCoord = {
        "北京": [116.28, 40.04],
        "重庆": [106.32, 29.32],
        "新疆": [87.36, 43.48],
        "广东": [113.15, 23.08],
        "天津": [117.11, 39.09],
        "浙江": [120.09, 30.14],
        "澳门": [113.35, 22.14],
        "广西": [108.2, 22.48],
        "内蒙古": [111.48, 40.49],
        "宁夏": [106.16, 38.2],
        "江西": [115.52, 28.41],
        "台湾": [121.31, 25.03],
        "安徽": [117.18, 31.51],
        "贵州": [106.42, 26.35],
        "陕西": [108.54, 34.16],
        "辽宁": [123.24, 41.5],
        "山西": [112.34, 37.52],
        "青海": [101.45, 36.38],
        "香港": [114.1, 22.18],
        "四川": [104.05, 30.39],
        "江苏": [118.59, 32.02],
        "河北": [114.28, 38.02],
        "西藏": [90.08, 29.39],
        "福建": [119.18, 26.05],
        "吉林": [125.19, 43.52],
        "云南": [102.41, 25],
        "海南": [110.2, 20.02],
        "上海": [121.29, 31.14],
        "湖北": [114.21, 30.37],
        "甘肃": [103.89, 36.03],
        "湖南": [113, 28.11],
        "河南": [113.42, 34.48],
        "山东": [117, 36.38],
        "黑龙江": [126.41, 45.85],
        '亚太区': [132.53, 40.81],
        '美洲区': [132.53, 33.81],
        '泛欧区': [132.53, 25.81],
        '互联互通': [70.08, 23.39]
    };

    var htmlArray = new Array();
    htmlArray.push("<h6>网络拓扑情况</h6>");
    htmlArray.push("<ul id='topo-tab'>");
    htmlArray.push("<li class='selected'>ChinaNet网络</li>");
    htmlArray.push("<li>CN2网络</li>");
    htmlArray.push("<li>163国际网络</li>");
    htmlArray.push("<li>CN2国际网络</li>");
    htmlArray.push("<li>MCE网络</li>");
    htmlArray.push("<li>业务网络</li>");
    htmlArray.push("</ul>");
    htmlArray.push("<div class='clear'></div>");
    htmlArray.push("<div id='topo-main'></div>");
    htmlArray.push("<a id='viewMaxBtn'></a>");
    htmlArray.push("</ul>");
    $("#topo").html(htmlArray.join(""));

    function lineEffect(idx) {
        return {
            show: [true, false, true][idx],
            scaleSize: 1,
            period: [100, 100, 200][idx],
            color: "#fff",
            shadowColor: "rgba(220,220,220,0.2)",
            shadowBlur: [3, 3, 5][idx]
        };
    }
    function pointEffect(idx) {
        return {
            show: [false, true, true][idx],
            type: "scale",
            loop: true,
            period: [100, 2, 20][idx],
            scaleSize: [1, 1.2, 1.2][idx],
            shadowBlur: [1, 1, 1][idx]
        };
    };
    var lineTooltip = {
        formatter: function(params, ticket, callback) {
            var tooltip = params.name.replace(">", "-");
            if (params.data.interruptcircuitpercent) {
                tooltip += "<br>中断电路比例：" + params.data.interruptcircuitpercent;
            }
            if (params.data.congestioncircuitpercent) {
                tooltip += "<br>拥塞电路比例：" + params.data.congestioncircuitpercent;
            }
            return tooltip;
        }
    };
    function lineItemStyle(idx, isHulian) {
        return {
            normal: {
                borderWidth: isHulian ? 1 : 1.4,
                borderColor: isHulian ? ["#01EBD0", "#FF0033", "#FFFF33"][idx] : ["lime", "#FF0033", "#FFFF33"][idx],
                lineStyle: {
                    type: isHulian ? "dashed" : "solid"
                }
            }
        }
    }
    function pointItemStyle(idx) {
        return {
            normal: {
                color: ["lime", "#FF0033", "#FFFF33"][idx],
            }
        };
    }

    function checkProvAlarmType(alarmArray, name, type) {
        if (!alarmArray) {
            return false;
        }
        for (var i = 0, len = alarmArray.length; i < len; i++) {
            if (alarmArray[i].name == name && alarmArray[i].type == type) {
                return true;
            }
        }
        return false;
    }

    function getLineAlarm(alarmArray, start, end) {
        if (!alarmArray) {
            return false;
        }
        for (var i = 0, len = alarmArray.length; i < len; i++) {
            if (alarmArray[i].start == start && alarmArray[i].end == end) {
                return alarmArray[i];
            }
            if (alarmArray[i].end == start && alarmArray[i].start == end) {
                return alarmArray[i];
            }
        }
        return false;
    }

    function getTopoOption (topoData) {
        var normalProvs = new Array();
        var alarmNormalProvs = new Array();
        var offNetNormalProvs = new Array();
        var hulianProvs = new Array();
        var alarmHulianProvs = new Array();
        var offNetHulianProvs = new Array();
        for (var i = 0, len = topoData.provinces.length; i < len; i++) {
            var prov = topoData.provinces[i];
            if ("normal" == prov.type) {
                if (checkProvAlarmType(topoData.alarms.provinces, prov.name, "脱网")) {
                    offNetNormalProvs.push(prov);
                } else if (checkProvAlarmType(topoData.alarms.provinces, prov.name, "告警")) {
                    alarmNormalProvs.push(prov);
                } else {
                    normalProvs.push(prov);
                }
            } else if ("hulian" == prov.type) {
                if ("互联互通" != prov.name) {
                    if (checkProvAlarmType(topoData.alarms.provinces, prov.name, "脱网")) {
                        offNetHulianProvs.push(prov);
                    } else if (checkProvAlarmType(topoData.alarms.provinces, prov.name, "告警")) {
                        alarmHulianProvs.push(prov);
                    } else {
                        hulianProvs.push(prov);
                    }
                }
            }
        }
        var normalLines = new Array();
        var normalCLines = new Array(); //拥塞电路
        var normalILines = new Array(); //中断电路

        var hulianLines = new Array();
        var hulianCLines = new Array(); //拥塞电路
        var hulianILines = new Array(); //中断电路

        for (var i = 0, len = topoData.lines.length; i < len; i++) {
            var line = topoData.lines[i];
            var lineAlarm = getLineAlarm(topoData.alarms.lines, line.start, line.end);
            if ("hulian" == line.type) {
                if ("中断" == lineAlarm.type) {
                    hulianILines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                } else if ("拥塞" == lineAlarm.type) {
                    hulianCLines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                } else {
                    hulianLines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                }
            } else if ("normal" == line.type) {
                if ("中断" == lineAlarm.type) {
                    normalILines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                } else if ("拥塞" == lineAlarm.type) {
                    normalCLines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                } else {
                    normalLines.push([{
                        name: line.start,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }, {
                        name: line.end,
                        "congestioncircuitpercent": lineAlarm.congestioncircuitpercent,
                        "interruptcircuitpercent": lineAlarm.interruptcircuitpercent
                    }]);
                }
            }
        }
        return {
            backgroundColor: null,
            title: {
                show: false,
                x: "center",
                y: 20,
                textStyle: {
                    fontSize: 18,
                    fontFamily: "微软雅黑",
                    fontWeight: "normal",
                    color: "#FFF"
                }
            },
            color:['#33CC33','#FF9900','#FF0033'],
            tooltip: {
                trigger: "item",
                formatter: "{b}",
                showDelay: 600
            },
            legend: {
                show: true,
                orient: "horizontal",
                x: "center",
                y: "bottom",
                data: [{
                        name: "正常电路",
                        icon: "image://css/image/normalline.png"
                    }, {
                        name: "中断电路",
                        icon: "image://css/image/interruptline.png"
                    }, {
                        name: "拥塞电路",
                        icon: "image://css/image/alarmline.png"
                    },
                    "正常",
                    "脱网",
                    "告警"
                ],
                textStyle: {
                    color: "#333",
                    fontSize: 11,
                    fontFamily: "微软雅黑"
                }
            },
            toolbox: {
                show: false
            },
            series: [{
                name: "正常电路",
                type: "map",
                roam: false,
                hoverable: false,
                mapType: "china",
                mapLocation: {
                    x: "center",
                    y: "top",
                    height: "90%"
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#CCC',
                                fontFamily: "微软雅黑"
                            }
                        },
                        borderColor: "rgba(255,255,255,0.3)",
                        borderWidth: 0.5,
                        areaStyle: {
                            color: "#336699"
                        }
                    }
                },
                data: [],
                geoCoord: chinaGeoCoord
            }, {
                name: "正常电路",
                type: "map",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(0),
                    itemStyle: lineItemStyle(0),
                    smooth: true,
                    data: normalLines
                }
            }, {
                name: "正常电路",
                type: "map",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(0),
                    itemStyle: lineItemStyle(0, true),
                    smooth: false,
                    data: hulianLines
                }
            }, {
                name: "中断电路",
                type: "map",
                mapType: "china",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(1),
                    itemStyle: lineItemStyle(1),
                    smooth: true,
                    data: normalILines
                }
            }, {
                name: "中断电路",
                type: "map",
                mapType: "china",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(1),
                    itemStyle: lineItemStyle(1, true),
                    smooth: false,
                    data: hulianILines
                }
            }, {
                name: "拥塞电路",
                type: "map",
                mapType: "china",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(2),
                    itemStyle: lineItemStyle(2),
                    smooth: true,
                    data: normalCLines
                }
            }, {
                name: "拥塞电路",
                type: "map",
                mapType: "china",
                data: [],
                markLine: {
                    tooltip: lineTooltip,
                    symbol: ["circle", "circle"],
                    symbolSize: 1,
                    effect: lineEffect(2),
                    itemStyle: lineItemStyle(2, true),
                    smooth: false,
                    data: hulianCLines
                }
            }, {
                name: "正常",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "image://css/image/hulian_"+getWebSet()+".png",
                    symbolSize: "163"==getWebSet()?30:20,
                    data: [{
                        name: "互联互通"
                    }]
                }
            }, {
                name: "正常",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(0),
                    effect: pointEffect(0),
                    smooth: true,
                    data: normalProvs
                }
            }, {
                name: "告警",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(2),
                    effect: pointEffect(0),
                    smooth: true,
                    data: alarmNormalProvs
                }
            }, {
                name: "脱网",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(1),
                    effect: pointEffect(0),
                    smooth: true,
                    data: offNetNormalProvs
                }
            }, {
                name: "正常",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(0),
                    effect: pointEffect(0),
                    smooth: true,
                    data: hulianProvs
                }
            }, {
                name: "正常",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(0),
                    effect: pointEffect(0),
                    smooth: true,
                    data: hulianProvs
                }
            }, {
                name: "告警",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(2),
                    effect: pointEffect(0),
                    smooth: true,
                    data: alarmHulianProvs
                }
            }, {
                name: "脱网",
                type: "map",
                data: [],
                markPoint: {
                    symbol: "circle",
                    symbolSize: 3,
                    itemStyle: pointItemStyle(1),
                    effect: pointEffect(0),
                    smooth: true,
                    data: offNetHulianProvs
                }
            }]
        }
    };

    function drawOverSeaArea(topo, areaName) {
        var pos = topo.chinaTopo.chart.map.getPosByGeo("china", chinaGeoCoord[areaName]);
        var topoZrender = topo.chinaTopo.getZrender();
        var Ellipse = require('zrender/shape/Ellipse');
        var shape = new Ellipse({
            style: {
                x: pos[0] + 20,
                y: pos[1],
                a: 30,
                b: 15,
                brushType: "fill",
                color: '#336699',
                lineWidth: 0,
                text: areaName,
                textPosition: "inside",
                textColor: "#fcfcfc",
                textFont: "normal 11px 微软雅黑"
            },
            highlightStyle: {
                lineWidth: 0
            }
        });
        if (!topo.extendShapeList) {
            topo.extendShapeList = new Array();
        }
        shape.areaname = areaName;
        topo.extendShapeList.push(shape);
        topoZrender.addShape(shape);
    };

    function getWebSet(){
        var netName = $("#topo-tab li.selected").html();
        if("ChinaNet网络"==netName){
            return "163";
        }else if("CN2网络"==netName){
            return "CN2";
        }
    }

    function ChinaTopo(dom) {
        var _topo = this;
        this.init = function() {
            require([
                "echarts",
                "echarts/chart/map"
            ], function(echarts) {
                //初始化
                var chinaTopo = echarts.init(dom);
                _topo.chinaTopo = chinaTopo;
                //查询数据
                chinaTopo.showLoading({
                    text: "加载数据中......",
                    effect: "spin",
                    effectOption: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                    textStyle: {
                        fontSize: 16,
                        fontFamily: "微软雅黑"
                    }
                });
                var pageModule = "Topo_" + getWebSet();
                $.ajax({
                    url: "/report-service/service.jsp?pageModule=" + pageModule,
                    cache: false,
                    dataType: "json",
                    success: function(data) {
                        chinaTopo.hideLoading();
                        chinaTopo.setOption(getTopoOption(data.result));
                        drawOverSeaArea(_topo, "亚太区");
                        drawOverSeaArea(_topo, "美洲区");
                        drawOverSeaArea(_topo, "泛欧区");
                    },
                    error: function(xhr, ts, et) {}
                });
            });
        };
        this.resize = function() {
            var _topo = this;
            if (_topo.chinaTopo) {
                _topo.chinaTopo.resize();
                if (_topo.extendShapeList) {
                    for (var i = 0, len = _topo.extendShapeList.length; i < len; i++) {
                        var shape = _topo.extendShapeList[i];
                        var areaName = shape.style.text;
                        var pos = _topo.chinaTopo.chart.map.getPosByGeo("china", chinaGeoCoord[areaName]);
                        shape.position = [pos[0] + 20 - shape.style.x, pos[1] - shape.style.y];
                    }
                }
            }
        };
    };

    var topo = new ChinaTopo($("#topo-main")[0]);
    topo.init();

    /**
     * 生成国际小拓扑方法
     * @param  {String} webset 网络号
     * @return {void} 
     */
    function getworldTopo(webset) {
        var world = worldmap({
            domid: "topo-main",
            name: "世界",
            webset: webset
        });

        var drawtopo = new DrawTopoAll(world, webset);//画图主方法
        drawtopo.iniCirTable();
        $.ajax({
            url: "/report-service/service.jsp?pageModule=topo_gj_node",
            data: {
                params: webset
            },
            cache: false,
            dataType: 'json',
            success: function(data) {
                if(data.result) {                   
                    drawtopo.addPoint(data.result.point);
                    drawtopo.addLine(data.result.line);
                    drawtopo.tofrontAreaPoint();
                }
                
            }
        });
    }

    $("#topo-tab li").click(function() {
        var $cli = $(this);
        if ("selected" != $cli.attr("class")) {
            $("#topo-tab li.selected").removeClass("selected");
            $cli.addClass("selected");
            // loadChartData(chinaTopo, $cli.html());
            var netname = $("#topo-tab li.selected").html();
            $("#topo-main").empty();
            if(netname == "163国际网络") {
                getworldTopo("163");
            }else if(netname == "CN2国际网络") {
                getworldTopo("CN2");
            }else {
                topo.init();
            }
            
        }
    });

    $("#viewMaxBtn").click(function() {
        var netFlag = "ChinaNet";
        var netName = $("#topo-tab li.selected").html();
        var topoUrl;
        var winName;
        if ("ChinaNet网络" == netName) {
            topoUrl = "../163topo/index.html";
            winName = "163topo";
        } else if ("CN2网络" == netName) {
            topoUrl = "../cn2topo/index.html";
            winName = "cn2topo";
        } else if("163国际网络" == netName) {
            topoUrl = "../worldMap/worldTopo.html?webset=163";
        } else if("CN2国际网络" == netName) {
            topoUrl = "../worldMap/worldTopo.html?webset=CN2";
        }
        if (topoUrl) {
            window.open(topoUrl, winName);
        }
    });
});