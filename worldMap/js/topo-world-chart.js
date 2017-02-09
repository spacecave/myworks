(function(win){

    var getChartOption = function(chartId, chartData) {

        var sizeFlag = 0; //0-大图;1-小图
        var $chartHolder = $("#" + chartId);
        var width = $chartHolder.width();
        var height = $chartHolder.height();
        var yvalue = chartData.y.data;
        var leftmin = Number(yvalue[0]);
        var leftmax = Number(yvalue[1]);
        var rightmin = Number(yvalue[2]);
        var rightmax = Number(yvalue[3]);
        if (650 > width ) {
            sizeFlag = 1;
        } else {
            sizeFlag = 0;
        }
        var title = "";
        if ("connect-chart" == chartId) {
            title = "互联互通带宽利用率变化情况";
        } else if ("international-chart" == chartId) {
            title = "国际出口带宽利用率变化情况";
        }
        if(chartData.series) {
            for(var i = 0; i < chartData.series.length; i ++) {
               chartData.series[i].barWidth = 22;     
            }
        }
        return {
            
            color: ['rgba(165,124,148,0.45)', 'rgba(226,97,117,0.45)','rgba(243,152,0,1)', 'rgba(19,181,177,0.45)', 'rgba(19,181,177,0.79)', 'rgba(188,130,187,1)',  'rgba(8,122,167,1)', 'rgba(255,244,92,1)', 'rgba(34,172,56,1)'],
            backgroundColor: 'rgba(0,0,0,0.15)',
            // backgroundColor: 'rgba(0,153,204,0.4)',
            grid: {
                x: [76, 76][sizeFlag],
                y: [20, 20][sizeFlag],
                x2: [150, 80][sizeFlag],
                y2: [36, 20][sizeFlag],
                // x: [76, 76][sizeFlag],
                // y: [20, 20][sizeFlag],
                // x2: [150, 80][sizeFlag],
                // y2: [36, 20][sizeFlag],
                borderWidth: 0
            },
            
            legend: {
                textStyle: {
                    color: '#fcfcfc',
                    fontWeight: 'normal',
                    fontFamily: "微软雅黑",
                    fontSize: [8, 12][0]
                },
                show: [true,true][sizeFlag],
                x: ['right',2000][sizeFlag],//由于show变为false之后，颜色和放大之后的颜色不统一。只能显示，但是缩小的时候又不能显示图例，所以就把图例放到2000像素外，屏幕外面去了。这个方式，很蠢

                orient:'vertical',
                data:['美洲流出','欧洲流出','亚太流出','美洲流入','欧洲流入','亚太流入','亚太总带宽','欧洲总带宽','美洲总带宽',]
                // data:['带宽','','','','','','','','流速']
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var tooltips = [] ;
                    tooltips.push(params[0][1]);
                    for(var i = 0, ilen = params.length; i < ilen; i ++) {
                        var value = params[i].value;
                        if(value < 0) {
                            value = 0 - value;
                        }

                        tooltips.push(params[i].seriesName + ":&nbsp" + value + "G");
                    }
                    // var tooltips = params[0][1] + "<br>" +
                    //     params[0][0] + "&nbsp;:&nbsp" + params[0][2] + "Gbps<br>" +
                    //     params[1][0] + "&nbsp;:&nbsp" + params[1][2] + "%";
                    return tooltips.join("<br>");
                }
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                show: true,
                type: 'category',
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisTick: {
                    lineStyle: {
                        color: "#fff"
                    }
                },
                axisLabel: {
                    formatter: function(params) {
                        return params.substring(4);
                    },
                    textStyle: {
                        color: '#FFF'
                    }
                },
                axisLine: {
                    onZero:true
                },
                // data: chartData.xAxis.data
                 // data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                 data:chartData.xAxis.data
            }],
            yAxis: [{
                type: 'value',
                name: '非突发峰值流速(GB)',
                min: leftmin,
                max: leftmax,
                // interval: 10,
                splitLine: {
                    show: false
                },
                
                axisLabel: {
                    textStyle: {
                        color: '#FFF'
                    },
                    formatter: function(params) {
                        if(params < 0) {
                            return 0 - params;
                        }
                        return params;
                    }
                }
               
            },
            {
                type: 'value',
                name: '总带宽（GB）',
                min: rightmin,
                max: rightmax,
                barWidth : 15,
                // interval: 25,
                splitLine: {
                    show: false
                },
                
                axisLabel: {
                    textStyle: {
                        color: '#FFF'
                    },
                    formatter: function(params) {
                        if(params < 0) {
                            return "";
                        }
                        return params;
                    }
                }
            }],
            series: chartData.series
        };
    };

    win.worldChart = function(chartId){
        var trendChart = this;
        var echart;
        trendChart.init = function(){
            require([
                'echarts',
                'echarts/chart/bar',
                'echarts/chart/line'
            ], function(echarts){
                echart = echarts.init($('#'+chartId)[0]);
                trendChart.echart = echart;
                echart.showLoading({
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

            });
        };

        trendChart.loadData = function(chartId,data) {
            if(data) {
             
                if(!echart) {
                    var foo = window.setInterval(function() {
                        if(echart) {
                            echart.hideLoading();
                            echart.clear();
                            echart.setOption(getChartOption(chartId, data)); 
                            clearInterval(foo);  
                        }
                    }, 50);
                }else {
                    echart.hideLoading();
                    echart.clear();
                    echart.setOption(getChartOption(chartId, data));   
                }
                  
            }
        }
        

        trendChart.resize = function(){
            var _trendChart = this;

            if(_trendChart.echart){
                $chartHolder = $("#" + chartId);
                var width = $chartHolder.width();
                var height = $chartHolder.height();
                
               
                var chartOption = _trendChart.echart.getOption();
                
                chartOption.grid.x = 76;
                chartOption.grid.x2 = 80;
                chartOption.grid.y = 20;
                chartOption.grid.y2 = 20;
                // chartOption.title.y = 10;
                _trendChart.echart.setOption(chartOption);
                
                _trendChart.echart.resize();
            }
        };
    };
})(window);