$(function(){
    'use strict';

    $('#add-view-btn').click(function(){
        window.location.href="FlowMonitorConfig.jsp";
    });

    $('#preview-btn').click(function(){
        var viewID = $('#view').val();
        window.location.href="FlowMonitorView.jsp?viewid="+viewID+'&ispreview=1';
    });
    
    $('#select-view-btn').click(function(){
        
        var viewID = $('#view').val();
        $.getJSON('/nos/view/flowmonitor/action.jsp?action=copyViewConfig&viewid=' + viewID, function(data){
            if("1" == $.trim(data)){
                alert('ѡ���ɹ���');
//                window.location.reload();
                window.location.href="FlowMonitorView.jsp?viewid="+viewID+'&ispreview=1';
            }
        });
    });
});