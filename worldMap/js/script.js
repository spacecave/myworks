$(function(){
    var _webset = getUrlParam("webset") ? getUrlParam("webset"):"163";
    var world = worldmap({
        domid: "map-holder",
        name: "世界",
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
    
    
    loadTopo({
        webset: _webset,
        world : world
    });   //加载拓扑图
    

    loadTarget({
        webset: _webset
    });//加载指标

    loadChartsTarget({
        webset: _webset
    });

    $("#back-prov").click(function() {
        $("#prov-detail").hide();
    });

    $("#back-prov-cloud").click(function() {
        $("#prov-detail-cloud").hide();
    });
   
    $("#back-prov-cloud-third").click(function() {
        $("#prov-detail-cloud-third").hide();
    });
    
});

/**
 * 加载拓扑方法
 * @param  {world:rapheal画图对象,webset:网络号}
 * @return {void}
 */
function loadTopo(opt) {
    var drawtopo = new DrawTopoAll(opt.world, opt.webset);//画图主方法
    drawtopo.iniCirTable();
    $.ajax({
        url: "/report-service/service.jsp?pageModule=topo_gj_node",
        data: {
            params: opt.webset
        },
        cache: false,
        dataType: 'json',
        success: function(data) {
            if(data.result) {
                
                drawtopo.addPoint(data.result.point);
                drawtopo.addLine(data.result.line);
                drawtopo.tofrontAreaPoint();

                if(data.result.alarm[0] && data.result.alarm[0].break && data.result.alarm[0].break.count) {
                     $("#AlarmCirNumb").html(data.result.alarm[0].break.count);
                     $("#breakAlarmDiv").dblclick(function(ele) {
                       
                        $("#phy-cir-window").window("setTitle", "中断电路列表");
                        $("#phy-cir-window").window("open");
                        
                        var circuitTable = new CircuitTable("phy-cir-table", opt.webset);
                        circuitTable.init();
                        var _tabArr = data.result.alarm[0].break;
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
}

/**
 * 加载图表的指标
 * @param  {Object} opt {webset:网络号}
 * @return {void} 
 */
function loadChartsTarget(opt) {
    var url;
    if(opt.webset == "163") {
        url = "/report-service/service.jsp?pageModule=GenInterGraph_163";
    }else if(opt.webset == "CN2") {
        url = "/report-service/service.jsp?pageModule=GenInterGraph_CN2";
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
            var circhartInter;
            
            if(data.result.CI.xAxis) {
                var cichartdata = data.result.CI;
                if(opt.webset == "163") {
                    // cichartdata = {"xAxis":{"data":["201504","201505","201506","201507","201508","201509","201510","201511","201512","201601","201602","201603"]},"series":[{"type":"bar","barWidth":18,"data":["830.00","830.00","830.00","830.00","840.00","890.00","890.00","950.00","950.00","950.00","950.00","950.00"],"name":"带宽"},{"yAxisIndex":1,"type":"line","data":["91.49","92.85","94.59","96.07","97.67","96.91","97.21","90.97","92.80","97.01","98.79","99.92"],"name":"峰值利用率"}]};
                }
                cichart.loadData("connect-chart", cichartdata);
                circhartInter = window.setInterval(function() {
                    cichart.loadData("connect-chart", cichartdata);
                },6000);
                $("#footer-1").hover(function() {
                    window.clearInterval(circhartInter);
                },function() {
                    circhartInter = window.setInterval(function() {
                        cichart.loadData("connect-chart", cichartdata);
                    },6000);
                });
            }
            
            var _targetObj = {};
            if(opt.webset == "163") {
                _targetObj.peerdata = data.result.Peer163;
                _targetObj.customdata = data.result.Customer163;
                _targetObj.title1 = "163国际出口流量";
                _targetObj.title2 = "国际Peer流速变化情况";
                _targetObj.title3 = "国际Customer流速变化情况";
            }else if(opt.webset == "CN2") {
                _targetObj.peerdata = data.result.TransitCN2;
                _targetObj.customdata = data.result.CustomerCN2;
                _targetObj.title1 = "CN2国际出口流量";
                _targetObj.title2 = "国际Transit流速变化情况";
                _targetObj.title3 = "国际Customer流速变化情况";
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
 * 加载指标
 * @return {void}
 */
function loadTarget(opt) {  
    var url;
    if(opt.webset == "163") {
        url = "/report-service/service.jsp?pageModule=Get163InterTopoItem";
    }else if(opt.webset == "CN2") {
        url = "/report-service/service.jsp?pageModule=GetCN2InterTopoItem";
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


                        if(opt.webset == "CN2") {
                            if(i == "TransitBW") {
                                _text = _text.substring(0, _text.indexOf("."));
                                $("#PeerBW").html(_text);
                                $("#peer-title").html("国际Transit总带宽");
                            }
                        }else {
                            $("#peer-title").html("国际peer总带宽");
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
                }, 5000);
            }
            
        }
    });
    
}



