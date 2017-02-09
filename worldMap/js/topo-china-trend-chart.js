(function(win){

    var getChartOption = function(chartId, chartData) {

        var sizeFlag = 0; //0-大图;1-小图
        var $chartHolder = $("#" + chartId);
        var width = $chartHolder.width();
        var height = $chartHolder.height();
        if (250 > width || 150 > height) {
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
            // title: {
            //     x: 'center',
            //     y: [8, 10][sizeFlag],
            //     text: title,
            //     textStyle: {
            //         color: '#fcfcfc',
            //         fontWeight: 'normal',
            //         fontFamily: "微软雅黑",
            //         fontSize: [14, 12][sizeFlag]
            //     }
            // },

            color: [ 'rgba(23,151,198,1)','rgba(224,6,6,1)'],
            backgroundColor: 'rgba(0,0,0,0.15)',
            // backgroundColor: 'rgba(0,153,204,0.4)',
            grid: {
                x: [86, 10][0],
                y: [20, 30][0],
                x2: [50, 10][0],
                y2: [36, 30][0],
                borderWidth: 0
            },
            legend: {
                show: false,
                x: 'center',
                y: 'bottom',
                data: ['带宽', '峰值利用率']
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var tooltips = params[0][1] + "<br>" +
                        params[0][0] + "&nbsp;:&nbsp" + params[0][2] + "Gbps<br>" +
                        params[1][0] + "&nbsp;:&nbsp" + params[1][2] + "%";
                    return tooltips;
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
                data: chartData.xAxis.data
            }],
            yAxis: [{
                
                show: true,
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} Gbps',
                    textStyle: {
                        color: '#FFF'
                    }
                }
            }, {
                show: true,
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} %',
                    textStyle: {
                        color: '#FFF'
                    }
                }
            }],
            series: chartData.series
            
        };
    };

    win.TrendChart = function(chartId){
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
                
                if (250 > width || 150 > height) {
                    var chartOption = _trendChart.echart.getOption();
                    // for (var i = 0, len = chartOption.yAxis.length; i < len; i++) {
                    //     chartOption.yAxis[i].show = false;
                    // }
                    chartOption.grid.x = 70;
                    chartOption.grid.x2 = 70;
                    chartOption.grid.y = 30;
                    chartOption.grid.y2 = 30;
                    // chartOption.title.y = 10;
                    _trendChart.echart.setOption(chartOption);
                } else {
                    var chartOption = _trendChart.echart.getOption();
                    // for (var i = 0, len = chartOption.yAxis.length; i < len; i++) {
                    //     chartOption.yAxis[i].show = true;
                    // }
                    chartOption.grid.x = 76;
                    chartOption.grid.x2 = 50;
                    chartOption.grid.y = 50;
                    chartOption.grid.y2 = 36;
                    // chartOption.title.y = 14;
                    _trendChart.echart.setOption(chartOption);
                }
                _trendChart.echart.resize();
            }
        };
    };
})(window);