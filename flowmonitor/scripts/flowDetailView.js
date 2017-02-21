$(function() {
    var circuitID = $('#circuitID').val();


    var chartday = echarts.init($('#chart-day')[0]);
    chartday.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=loadCircuitHoverData&circuitID=' + circuitID, function(data) {
        chartday.hideLoading();
        $('#circuitName').html(data.circuitname);
        $('#bandwidth').html(formatFlux(data.bandwidth));
        $('#fluxtime').html(formatTime(data.fluxtime));
       
        chartday.setOption(getFluxOption({
            title: '日流量图（数据5分钟平均）',
            flux: data.flux
        }));
    });

    var chartweek = echarts.init($('#chart-week')[0]);
    chartweek.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly7d&circuitID=' + circuitID, function(data) {
        chartweek.hideLoading();
       
        chartweek.setOption(getFluxOption({
            title: '周流量图（数据5分钟平均）',
            flux: data
        }));
    });

    var chartmonth = echarts.init($('#chart-month')[0]);
    chartmonth.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly1m&circuitID=' + circuitID, function(data) {
        chartmonth.hideLoading();
       
        chartmonth.setOption(getFluxOption({
            title: '月流量图（数据小时平均）',
            flux: data
        }));
    });

    var chartyear = echarts.init($('#chart-year')[0]);
    chartyear.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly1y&circuitID=' + circuitID, function(data) {
        chartyear.hideLoading();
       
        chartyear.setOption(getFluxOption({
            title: '年流量图（数据日平均）',
            flux: data
        }));
    });
});
