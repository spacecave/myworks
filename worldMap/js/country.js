/**
 * @description 省拓扑绘制方法
 * @author 张鑫
 */
var loc_topoData;
$(function(){
    var _name = getUrlParam("name");
    var _webset = _webset = getUrlParam("webset") ? getUrlParam("webset"):"163";
    var world = worldmap({
        domid: "map-holder",
        name: _name,
        webset: _webset
    });
  
    if(_webset == "163") {
        $(".ctyheader-title").css({
            "background" : "url(css/img/title.png) no-repeat left"
        });
    }else if(_webset == "CN2") {
        $(".ctyheader-title").css({
            "background" : "url(css/img/title_cn2.png) no-repeat left"
        });
    }

    var drawtopo = loadTopo({
        world : world,
        webset : _webset,
        name : _name
    });

    loadTarget({
        webset: _webset,
        name: _name
    });//加载指标


    loadChartsTarget({
        webset:_webset,
        name: _name
    });

    $("#back-prov").click(function() {
        $("#prov-detail").hide();
    });
    $("#back-prov-country").click(function() {
        window.location.href = "worldTopo.html?webset=" + _webset;
    });
    $("#back-prov-cloud").click(function() {
        $("#prov-detail-cloud").hide();
    });
   
    $("#back-prov-cloud-third").click(function() {
        $("#prov-detail-cloud-third").hide();
    });

    if(_name == "中国") {
        loadChina({
            world : world,
            webset: _webset,
            topo : drawtopo
        });
    }

  

});


/**
 * 加载图表的指标
 * @param  {Object} opt {webset:网络号}
 * @return {void} 
 */
function loadChartsTarget(opt) {
    var url;
    if(opt.webset == "163") {
        url = "/report-service/service.jsp?pageModule=GenContinentGraph_163&params="+opt.name;
    }else if(opt.webset == "CN2") {
        url = "/report-service/service.jsp?pageModule=GenContinentGraph_CN2&params="+opt.name;
    }

    var cichart = new TrendChart("connect-chart");
    cichart.init();

    var connectChart1 = new worldChart("peer-chart");
    connectChart1.init();
   
    var connectChart2 = new worldChart("custom-chart");
    connectChart2.init();
    var resizeTimeStamp = 0;
    $(window).resize(function() {
        var now = new Date().getTime();
        if (now - resizeTimeStamp > 50) {
            resizeTimeStamp = now;
            window.setTimeout(function() {
                cichart.resize();
                connectChart1.resize();
                connectChart2.resize();
            }, 50);
        }
    });
    $.ajax({
        url: url,
        cache: false,
        dataType: 'json',
        success: function(data) {
          //  var data = {"exitvalue":0,"result":{"xAxis":{"data":["201503","201504","201505","201506","201507","201508","201509","201510","201511","201512","201601","201602"]},"series":[{"type":"bar","stack":"A","data":[10, 5, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 2.6, 10.0, 6.4, 3.3],"name":"美洲流出"},{"type":"bar","stack":"A","data":[2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 2.6, 10.0, 6.4, 3.3],"name":"欧洲流出"},{"type":"bar","stack":"A","data":[-20, -4.9, -7.0, -3.2, -5.6, -6.7, -5.6, -2.2, -2.6, -10.0, -6.4, -3.3],"name":"美洲流入"},{"type":"bar","stack":"A","data":[-2.0, -4.9, -7.0, -3.2, -15.6, -6.7, -5.6, -2.2, -2.6, -10.0, -6.4, -3.3],"name":"欧洲流入"},{"type":"bar","stack":"A","data":[-2.0, -4.9, -7.0, -3.2, -5.6, -6.7, -5.6, -2.2, -2.6, -10.0, -6.4, -3.3],"name":"亚太流入"},{"type":"bar","stack":"A","data":[2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 2.6, 10.0, 6.4, 3.3],"name":"亚太流出"},{"yAxisIndex":1,"type":"line","data":[200, 149, 170, 132,256, 167, 156, 229, 260, 200, 164, 330],"name":"欧洲总带宽"},{"yAxisIndex":1,"type":"line","data":[2.0, 4.9, 7.0, 3.2, -25.6, 6.7, 5.6, 2.2, 2.6, 20.0, 6.4, 3.3],"name":"亚太总带宽"},{"yAxisIndex":1,"type":"line","data":[20, 49, 70, 32, -256, 67, 56, 22, 26, 200, 84, 33],"name":"美洲总带宽"}]}};
            if(!data.result) {
                return;
            }
            
            if(data.result.XF) {
                cichart.loadData("connect-chart", data.result.XF);
                var circhartInter = window.setInterval(function() {
                    cichart.loadData("connect-chart", data.result.XF);
                },6000);
                $("#footer-1").hover(function() {
                    window.clearInterval(circhartInter);
                },function() {
                    circhartInter = window.setInterval(function() {
                        cichart.loadData("connect-chart", data.result.XF);
                    },6000);
                });
            }
            
            var _targetObj = {};
            if(opt.webset == "163") {
                _targetObj.peerdata = data.result.Peer163;
                _targetObj.customdata = data.result.Customer163;
                _targetObj.title1 = opt.name + "163出口流量";
                _targetObj.title2 = opt.name + "Peer流速变化情况";
                _targetObj.title3 = opt.name + "Customer流速变化情况";
            }else if(opt.webset == "CN2") {
                _targetObj.peerdata = data.result.TransitCN2;
                _targetObj.customdata = data.result.CustomerCN2;
                _targetObj.title1 = opt.name + "CN2出口流量";
                _targetObj.title2 = opt.name + "Transit流速变化情况";
                _targetObj.title3 = opt.name + "Customer流速变化情况";
            }
            $("#target-title-out").html(_targetObj.title1);
            $("#target-title-peer").html(_targetObj.title2);
            $("#target-title-cust").html(_targetObj.title3);

            connectChart1.loadData("peer-chart", _targetObj.peerdata);

            var conInter1 = window.setInterval(function() {
                connectChart1.loadData("peer-chart", _targetObj.peerdata);
            },8000)
            $("#footer-2").hover(function() {
                window.clearInterval(conInter1);
            },function() {
                conInter1 = window.setInterval(function() {
                    connectChart1.loadData("peer-chart", _targetObj.peerdata);
                },8000)
            });

            connectChart2.loadData("custom-chart", _targetObj.customdata);

            var conInter2 = window.setInterval(function() {
                connectChart2.loadData("custom-chart", _targetObj.customdata);
            },10000)
            $("#footer-3").hover(function() {
                window.clearInterval(conInter2);
            },function() {
                conInter2 = window.setInterval(function() {
                    connectChart2.loadData("custom-chart", _targetObj.customdata);
                },10000)
            });

            $("#viewMaxBtn").click(function() {
                $("#pro-echarts-win").window("setTitle", _targetObj.title2);
                $("#pro-echarts-win").window("open");
                var peerwinChart = new worldChart("pro-echarts-win-div");
                peerwinChart.init();
                peerwinChart.loadData("pro-echarts-win-div", _targetObj.peerdata);
            });
            $("#viewMaxBtn1").click(function() {
                $("#pro-echarts-win").window("setTitle", _targetObj.title3);
                $("#pro-echarts-win").window("open");
                var cuswinChart = new worldChart("pro-echarts-win-div", "");
                cuswinChart.init();
                cuswinChart.loadData("pro-echarts-win-div", _targetObj.customdata);
            });
        },
        error: function(xhr, ts, et) {}
    });

}

/**
 * 加载拓扑方法
 * @param  {world:rapheal画图对象,webset:网络号}
 * @return {void}
 */
function loadTopo(opt) {
    var drawtopo = new DrawTopoAll(opt.world, opt.webset);//画图主方法
    drawtopo.iniCirTable();
    $.ajax({
        url: "/report-service/service.jsp?pageModule=topo_gj_area&params="+opt.webset+"&params="+opt.name,
        cache: false,
        dataType: 'json',
        success: function(data) {
            if(data.result) {
                if(opt.name == "中国") {
                    loc_topoData = data.result;
                    drawtopo.addPoint(data.result.CC.point, "CC");
                    drawtopo.addLine(data.result.CC.line, "CC");
                }else {
                    drawtopo.addPoint(data.result.ALL.point, "CC");
                    if(opt.name != "亚太区") {
                        drawtopo.addAreaPoint(opt.name);

                    }
                    drawtopo.addLine(data.result.ALL.line);
                }
                
                drawtopo.tofrontAreaPoint();
                if(data.result.alarm[0] && data.result.alarm[0].break && data.result.alarm[0].break.count) {
                     $("#AlarmCirNumb").html(data.result.alarm[0].break.count);
                     $("#breakAlarmDiv").dblclick(function(ele) {
                       
                        $("#phy-cir-window").window("setTitle", "中断电路列表");
                        $("#phy-cir-window").window("open");
                        
                        var circuitTable = new CircuitTable("phy-cir-table", opt.webset);
                        circuitTable.init();
                        circuitTable.loadData(data.result.alarm[0].break.detail, "");
                        
                    });
                }
                if(data.result.alarm[0] && data.result.alarm[0].congest && data.result.alarm[0].congest.count) {
                    $("#JamCirNumb").html(data.result.alarm[0].congest.count);
                    $("#congestDiv").dblclick(function(ele) {
                        
                        $("#phy-cir-window").window("setTitle", "拥塞电路列表");
                        $("#phy-cir-window").window("open");
                        
                        var circuitTable = new CircuitTable("phy-cir-table", opt.webset);
                        circuitTable.init();
                        circuitTable.loadData(data.result.alarm[0].congest.detail, "");
                    });
                }
            }
            
        }
    });
    return drawtopo;
}

function loadChina(opt) {
    var way = [];
    var pp = opt.world.paper;
    var drawtopo = opt.topo;
    var _data;
    var _selstyle = {
        "stroke":"#0CDF56",
        "fill":"#FCFC55",
         "stroke-width":"4",
         "stroke-opacity":"0.3",
        "cursor":"pointer",
    };
    var _unselstyle = {
        "stroke":"#0CDF56",
        "fill":"#212C42",
        "stroke-opacity":"0.3",
        "stroke-width":"4",
        "cursor":"pointer",
    }
    if(opt.webset == "163") {
        _data = [{"name":"C-C", "x":670, "y":200},{"name":"X-X","x":670, "y":230}];
    }else if(opt.webset == "CN2") {
        _data = [{"name":"C-C", "x":670, "y":200},{"name":"X-X","x":670, "y":230}];
    }

    for(var i = 0, ilen = _data.length; i < ilen; i ++) {
        var _point = _data[i];
        var _sel = pp.circle(_point.x, _point.y, 4);
        pp.text(_point.x + 20, _point.y, _point.name).attr({
            fill:"#ffffff",
            "font-size":"8px"
        });
        _sel.name = _point.name;
        _sel.attr(_unselstyle);
        if(_point.name == "C-C") {
             _sel.attr(_selstyle);
        }
        _sel.mouseover(function(){
            this.attr({
                "stroke-opacity":"0.9",

            })
        }).mouseout(function (){
            this.attr({
                "stroke-opacity":"0.3",

            })
            
        }).click(function() {
            
            for(var j = 0, jlen = way.length; j < jlen; j ++) {
                way[j].attr(_unselstyle);
            }
            this.attr(_selstyle);
            drawtopo.clearLines();
            if(this.name == "C-C") {
                drawtopo.addLine(loc_topoData.CC.line, "CC");
            }else if(this.name == "X-X") {
                drawtopo.addLine(loc_topoData.XX.line, "XX");
            }
        });
        way.push(_sel);
    }
}


/**
 * 加载指标
 * @return {void}
 */
function loadTarget(opt) {  
    var url;
    if(opt.webset == "163") {
        url = "/report-service/service.jsp?pageModule=Continent_TOPO_Item&params=163&params="+opt.name;
    }else if(opt.webset == "CN2") {
        url = "/report-service/service.jsp?pageModule=Continent_TOPO_Item&params=CN2&params="+opt.name;
    }
    $.ajax({
        url: url,
        
        cache: false,
        dataType: 'json',
        success: function(data) {
            if(data.result) {
                var CountryNumb;//覆盖国家数
                var CityNumb;//覆盖城市数
                var _data = data.result;
                for(var i in _data) {
                    var $div = $("#" + i);
                    if($div) {
                        var _text = _data[i] + "";
                        if(i == "CustomerBW") {
                            if(_text.indexOf(".") != -1) {
                                _text = _text.substring(0, _text.indexOf("."));
                            }
                        }else if(i == "PeerBW") {
                            if(_text.indexOf(".") != -1) {
                                _text = _text.substring(0, _text.indexOf("."));
                            }
                        }else if(i == "CountryNumb") {
                            CountryNumb = _text;
                        }else if(i == "CityNumb") {
                            CityNumb = _text;
                        }else if(i == "AlarmCirNumb" || i == "JamCirNumb") {
                            continue;
                        }



                        $div.html(_text);
                    }
                }
                window.setInterval(function() {
                    if($("#cover-title").html() == "覆盖国家数") {
                        $("#cover-title").html("覆盖城市数");
                        $("#CountryNumb").html(CityNumb);
                    }else if($("#cover-title").html() == "覆盖城市数") {
                        $("#cover-title").html("覆盖国家数");
                        $("#CountryNumb").html(CountryNumb);
                    }
                }, 3000);
            }
            
        }
    });
    
}
