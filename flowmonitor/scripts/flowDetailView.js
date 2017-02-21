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
            title: '������ͼ������5����ƽ����',
            flux: data.flux
        }));
    });

    var chartweek = echarts.init($('#chart-week')[0]);
    chartweek.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly7d&circuitID=' + circuitID, function(data) {
        chartweek.hideLoading();
       
        chartweek.setOption(getFluxOption({
            title: '������ͼ������5����ƽ����',
            flux: data
        }));
    });

    var chartmonth = echarts.init($('#chart-month')[0]);
    chartmonth.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly1m&circuitID=' + circuitID, function(data) {
        chartmonth.hideLoading();
       
        chartmonth.setOption(getFluxOption({
            title: '������ͼ������Сʱƽ����',
            flux: data
        }));
    });

    var chartyear = echarts.init($('#chart-year')[0]);
    chartyear.showLoading();
    $.getJSON('/nos/view/flowmonitor/action.jsp?action=queryCircuitFluxNearly1y&circuitID=' + circuitID, function(data) {
        chartyear.hideLoading();
       
        chartyear.setOption(getFluxOption({
            title: '������ͼ��������ƽ����',
            flux: data
        }));
    });
});
