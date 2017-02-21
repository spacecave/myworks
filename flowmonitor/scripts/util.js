Array.prototype.contains = function(o) {
    var i = this.length;
    while (i--) {
        if (this[i] === o) {
            return true;
        }
    }
    return false;
}

function formatFlux(value) {
    if (value >= 1000000) {
        return value % 1000000 == 0 ? value / 1000000 + ' G' : (value / 1000000).toFixed(2) + ' G';
    }
    if (value >= 1000) {
        return value % 1000 == 0 ? value / 1000 + ' M' : (value / 1000).toFixed(2) + ' M';
    }
    if (value == 0) {
        return 0;
    }
    return value + ' K';
}

function formatTime(str) {
    if (12 == str.length) {
        return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12);
    } else if (10 == str.length) {
        return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':00';
    } else if (8 == str.length) {
        return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
    }

}

function formatTimeShort(str) {
    if (12 == str.length) {
        return str.substring(8, 10) + ':' + str.substring(10, 12);
    } else if (10 == str.length) {
        return str.substring(8, 10) + ':00';
    } else if (8 == str.length) {
        return str.substring(4, 6) + '-' + str.substring(6, 8);
    }
}

function getFluxOption(config) {
    return {
        title: {
            text: config.title,
            left: 'center',
            top: 6,
            textStyle: {
                fontSize: 16
            }
        },
        backgroundColor: '#fff',
        color: ['#00ff00', '#00008B'],
        tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
                var html = '';
                for (var i = 0, len = params.length; i < len; i++) {
                    if (i == 0) {
                        html += formatTime(params[0].name);
                    }
                    html += '<br>';
                    html += params[i].seriesName + '：' + formatFlux(params[i].data);
                }
                return html;
            }
        },
        legend: {
            bottom: 6,
            data: ['流入流速', '流出流速']
        },
        grid: {
            left: 60,
            right: 20,
            top: 40,
            bottom: 60
        },
        xAxis: {
            axisLabel: {
                formatter: function(value, index) {
                    return formatTimeShort(value);
                }
            },
            data: config.flux.fluxtime
        },
        yAxis: {
            axisLabel: {
                formatter: function(value, index) {
                    return formatFlux(value);
                }
            }
        },
        series: [{
            name: '流入流速',
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#00ff00',
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: '#00ff00'
                }
            },
            showSymbol: false,
            data: config.flux.in
        }, {
            name: '流出流速',
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#00008B',
                    width: 1
                }
            },
            showSymbol: false,
            data: config.flux.out
        }]
    };
}

function MonitorSelectDeviceChange() {
    var _this = this,
        monitorTimeout = 0;

    _this.setOnChange = function(onChange) {
        _this.onChange = onChange;
    };

    // 脏检测不好，但是不想去修改selDeviceView.jsp的代码，只好委曲求全
    function checkDevice() {
        var tempDeviceID = $('#tempDeviceID').val();
        var tempDeviceName = $('#tempDeviceName').val();
        if ('' != tempDeviceID) {
            if ($.isFunction(_this.onChange)) {
                _this.onChange(tempDeviceID, tempDeviceName);
            }
            $('#tempDeviceID,#tempDeviceName').val('');
        }
        monitorTimeout = window.setTimeout(checkDevice, 200);
    }
    _this.start = function() {
        checkDevice();
    };
    _this.stop = function() {
        window.clearTimeout(monitorTimeout);
    };
    return _this;
}

