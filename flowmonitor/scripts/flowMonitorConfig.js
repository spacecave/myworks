$(function() {
    'use strict';

    var viewID = $('#viewID').val();
    var viewName = '';
    if ("" != viewID) {
        // 加载配置信息
        $.getJSON('action.jsp?action=queryFlowMonitorConfig&viewid=' + viewID, function(data) {
            $('.view-config').show();
            $('.view-tip').hide();
            if (data.name) {
                viewName = data.name;
            }
            if (data.topLevel) {
                for (var i = 0, len = data.topLevel.length; i < len; i++) {
                    var areaViewID = addAreaView('top-level', 'top-config-window');
                    var areaData = unFormatAreaData(data.topLevel[i]);
                    $('#' + areaViewID).css('background', areaData.bgColor);
                    $('#' + areaViewID).data('areaData', areaData);
                    $('#' + areaViewID + ' [name="area-name"]').html('<span title=' + areaData.areaName + '>' + areaData.areaName + '</span>');
                    $('#' + areaViewID + ' [name="devices-name"]').html('<span title=' + areaData.deviceNames.join(',') + '>' + areaData.deviceNames.join(',') + '</span>');
                    $('#' + areaViewID + ' [name="upcirprop-text"]').html('<span title=' + areaData.upCirPropText + '>' + areaData.upCirPropText + '</span>');
                    $('#' + areaViewID + ' [name="incirprop-text"]').html('<span title=' + areaData.inCirPropText + '>' + areaData.inCirPropText + '</span>');
                    $('#' + areaViewID + ' [name="downcirprop-text"]').html('<span title=' + areaData.downCirPropText + '>' + areaData.downCirPropText + '</span>');
                }
            }

            if (data.centerLevel) {
                var areaData = unFormatAreaData(data.centerLevel);
                $('#center-level .view-area').css('background', areaData.bgColor);
                $('#center-level .view-area').data('areaData', areaData);
                $('#center-level .view-area [name="area-name"]').html('<span title=' + areaData.areaName + '>' + areaData.areaName + '</span>');
                $('#center-level .view-area [name="devices-name"]').html('<span title=' + areaData.deviceNames.join(',') + '>' + areaData.deviceNames.join(',') + '</span>');
                $('#center-level .view-area [name="incirprop-text"]').html('<span title=' + areaData.inCirPropText + '>' + areaData.inCirPropText + '</span>');
            }

            if (data.bottomLevel) {
                for (var i = 0, len = data.bottomLevel.length; i < len; i++) {
                    var areaViewID = addAreaView('bottom-level', 'bottom-config-window');
                    var areaData = unFormatAreaData(data.bottomLevel[i]);
                    $('#' + areaViewID).css('background', areaData.bgColor);
                    $('#' + areaViewID).data('areaData', areaData);
                    $('#' + areaViewID + ' [name="area-name"]').html('<span title=' + areaData.areaName + '>' + areaData.areaName + '</span>');
                    $('#' + areaViewID + ' [name="devices-name"]').html('<span title=' + areaData.deviceNames.join(',') + '>' + areaData.deviceNames.join(',') + '</span>');
                    $('#' + areaViewID + ' [name="upcirprop-text"]').html('<span title=' + areaData.upCirPropText + '>' + areaData.upCirPropText + '</span>');
                    $('#' + areaViewID + ' [name="incirprop-text"]').html('<span title=' + areaData.inCirPropText + '>' + areaData.inCirPropText + '</span>');
                    $('#' + areaViewID + ' [name="downcirprop-text"]').html('<span title=' + areaData.downCirPropText + '>' + areaData.downCirPropText + '</span>');
                }
            }

            if (data.legend) {
                $('.legend-holder ul').data('legendData', data.legend);
                addLegendView(data.legend);
                for (var i = 0, len = data.legend.length; i < len; i++) {
                    addLegend(data.legend[i]);
                }
            }
        });
    }

    configWindowInit('top-config-window', '配置');
    configWindowInit('center-config-window', '配置');
    configWindowInit('bottom-config-window', '配置');
    $('input[name="bg-color"]').colorpicker();

    $('.cirprop').combotree({
        multiple : true,
        onlyLeafCheck : true,
        url : 'action.jsp?action=queryCirPropTreeData'
    });

    $('#top-add-btn').click(function() {
        $('#top-config-window .btn-ok').attr('update-flag', '');
        $('#top-config-window').window('open');
    });

    $('#center-edit-btn').click(function() {
        var areaData = $('#center-level .view-area').data('areaData');
        if (areaData) {
            $('#center-config-window [name="bg-color"]').val(areaData.bgColor);
            $('#center-config-window [name="area-name"]').val(areaData.areaName);
            $('.config-window .selected-devices').empty();
            for (var i = 0, len = areaData.deviceIDs.length; i < len; i++) {
                if ('' != areaData.deviceIDs[i]) {
                    addSelectDevice('center-config-window', areaData.deviceIDs[i], areaData.deviceNames[i]);
                }
            }
            $('#center-config-window .incirprop').combotree('setValues', areaData.inCirProp);
        }
        $('#center-config-window').window('open');
    });

    $('#bottom-add-btn').click(function() {
        $('#bottom-config-window .btn-ok').attr('update-flag', '');
        $('#bottom-config-window').window('open');
    });

    $('.btn-cancle').click(function() {
        var configWindowID = $(this).attr('config-window');
        $('#' + configWindowID).window('close');
    });

    $('.config-window .btn-ok').click(function() {
        var configWindowID = $(this).attr('config-window'), relLevel = $(this).attr('rel-level');

        // check
        if ('' == $('#' + configWindowID + ' [name="area-name"]').val()) {
            alert('请填写区域名称！');
            $('#' + configWindowID + ' [name="area-name"]').focus();
            return;
        }

        // 获取区域数据
        var areaData = {
            areaName : $('#' + configWindowID + ' [name="area-name"]').val(),
            bgColor : $('#' + configWindowID + ' [name="bg-color"]').val(),
            deviceIDs : new Array(),
            deviceNames : new Array(),
            upCirProp : 'center-config-window' == configWindowID ? [] : $('#' + configWindowID + ' .upcirprop').combotree('getValues'),
            upCirPropText : 'center-config-window' == configWindowID ? '' : $('#' + configWindowID + ' .upcirprop').combotree('getText'),
            inCirProp : $('#' + configWindowID + ' .incirprop').combotree('getValues'),
            inCirPropText : $('#' + configWindowID + ' .incirprop').combotree('getText'),
            downCirProp : 'center-config-window' == configWindowID ? [] : $('#' + configWindowID + ' .downcirprop').combotree('getValues'),
            downCirPropText : 'center-config-window' == configWindowID ? '' : $('#' + configWindowID + ' .downcirprop').combotree('getText')
        };
        var $deviceIDs = $('#' + configWindowID + ' [name="device-id"]'), $deviceNames = $('#' + configWindowID + ' [name="device-name"]');
        for (var i = 0, len = $deviceIDs.length; i < len; i++) {
            areaData.deviceIDs.push($($deviceIDs[i]).val());
            areaData.deviceNames.push($($deviceNames[i]).val());
        }

        // 呈现&存储
        if ('center-level' == relLevel) {
            $('#' + relLevel + ' .view-area').css('background', areaData.bgColor);
            $('#' + relLevel + ' .view-area').data('areaData', areaData);
            $('#' + relLevel + ' .view-area [name="area-name"]').html('<span title=' + areaData.areaName + '>' + areaData.areaName + '</span>');
            $('#' + relLevel + ' .view-area [name="devices-name"]').html('<span title=' + areaData.deviceNames.join(',') + '>' + areaData.deviceNames.join(',') + '</span>');
            $('#' + relLevel + ' .view-area [name="incirprop-text"]').html('<span title=' + areaData.inCirPropText + '>' + areaData.inCirPropText + '</span>');
        } else {

            // 添加区域
            var areaViewID = $(this).attr('update-flag');
            if (!areaViewID) {
                areaViewID = addAreaView(relLevel, configWindowID);
            }
            $('#' + areaViewID).css('background', areaData.bgColor);
            $('#' + areaViewID).data('areaData', areaData);
            $('#' + areaViewID + ' [name="area-name"]').html('<span title=' + areaData.areaName + '>' + areaData.areaName + '</span>');
            $('#' + areaViewID + ' [name="devices-name"]').html('<span title=' + areaData.deviceNames.join(',') + '>' + areaData.deviceNames.join(',') + '</span>');
            $('#' + areaViewID + ' [name="upcirprop-text"]').html('<span title=' + areaData.upCirPropText + '>' + areaData.upCirPropText + '</span>');
            $('#' + areaViewID + ' [name="incirprop-text"]').html('<span title=' + areaData.inCirPropText + '>' + areaData.inCirPropText + '</span>');
            $('#' + areaViewID + ' [name="downcirprop-text"]').html('<span title=' + areaData.downCirPropText + '>' + areaData.downCirPropText + '</span>');
        }

        $('#' + configWindowID).window('close');
        $('#' + relLevel + ' .view-config').show();
        $('#' + relLevel + ' .view-tip').hide();
    });

    $('.select-device-btn').click(function() {

        var configWindowID = $(this).attr('config-window');
        var selectedDevices = $('#' + configWindowID).find('.selected-devices li');
        if (selectedDevices.length >= 2) {
            alert('中心区域设备最多选择两个！');
            return;
        }
        window.open('/nms/res/selDeviceView.jsp?DeviceIDItem=tempDeviceID&DeviceNameItem=tempDeviceName');
    });

    var msdc = new MonitorSelectDeviceChange();
    // 增加选择设备
    function addSelectDevice(id, deviceID, deviceName) {

        // 检查是否存在&是否大于等于两个
        var selectedDevices = $('#' + id).find('.selected-devices li');
        if (selectedDevices.length >= 2) {
            alert('中心区域设备最多选择两个！');
            return;
        }
        for (var i = 0, len = selectedDevices.length; i < len; i++) {
            if (deviceID == $(selectedDevices[i]).find('[name="device-id"]').val()) {
                alert('已存在相同设备');
                return;
            }
        }

        var deviceHtml = '<li><input type="hidden" name="device-id" value="' + deviceID + '" /><input type="hidden" name="device-name" value="' + deviceName + '" /><span title="点击删除">' + deviceName + '</span></li>';
        $('#' + id).find('.selected-devices').append(deviceHtml);
    }
    $('.config-window .selected-devices').delegate('li', 'click', function() {
        $(this).remove();
    });
    // 初始化 window
    function configWindowInit(id, title) {

        var height = 230;
        if ('center-config-window' != id) {
            height = 300;
        }

        $('#' + id).window({
            title : '&nbsp;' + title,
            width : 800,
            height : height,
            modal : true,
            closed : true,
            collapsible : false,
            minimizable : false,
            maximizable : true,
            onOpen : function() {
                msdc.setOnChange(function(deviceID, deviceName) {
                    addSelectDevice(id, deviceID, deviceName);
                });
                msdc.start();
            },
            onClose : function() {
                msdc.stop();
            }
        });
    }

    function resizeViewConfigWidth(relLevel) {
        var areaViewSize = $('#' + relLevel + ' .view-config .view-area').length;
        var width = 1160;
        if ((areaViewSize * 320) > width) {
            width = areaViewSize * 320;
        }
        $('#' + relLevel + ' .view-config').width(width);
    }

    function addAreaView(relLevel, configWindowID) {
        var id = new Date().getTime() + '-' + parseInt(Math.random() * 1000);
        var html = '<div class="view-area" id=' + id + '><table><tr><td width="40%" align="right">区域名称：</td><td width="60%" name="area-name" align="left"></td></tr>' + '<tr><td width="40%" align="right">中心设备：</td><td width="60%" name="devices-name" align="left"></td></tr>' + '<tr><td width="40%" align="right">上联电路属性：</td><td width="60%" name="upcirprop-text" align="left"></td></tr>' + '<tr><td width="40%" align="right">互联电路属性：</td><td width="60%" name="incirprop-text" align="left"></td></tr>' + '<tr><td width="40%" align="right">下联电路属性：</td><td width="60%" name="downcirprop-text" align="left"></td></tr></table>' + '<span class="glyphicon glyphicon-minus delete-area-btn" rel-level="' + relLevel + '"></span><span class="glyphicon glyphicon-pencil edit-area-btn" config-window="'
                + configWindowID + '"></span></div>';
        $('#' + relLevel + ' .view-config').append(html);
        resizeViewConfigWidth(relLevel);
        return id;
    }
    $('.view-config').delegate('.view-area .delete-area-btn', 'click', function() {
        var relLevel = $(this).attr('rel-level');
        $(this).parent().remove();
        resizeViewConfigWidth(relLevel);
    });
    $('.view-config').delegate('.view-area .edit-area-btn', 'click', function() {
        var configWindowID = $(this).attr('config-window');
        var areaData = $(this).parent().data('areaData');
        var id = $(this).parent().attr('id');
        if (areaData) {
            $('#' + configWindowID + ' [name="bg-color"]').val(areaData.bgColor);
            $('#' + configWindowID + ' [name="area-name"]').val(areaData.areaName);
            $('.config-window .selected-devices').empty();
            for (var i = 0, len = areaData.deviceIDs.length; i < len; i++) {
                if ('' != areaData.deviceIDs[i]) {
                    addSelectDevice(configWindowID, areaData.deviceIDs[i], areaData.deviceNames[i]);
                }
            }
            $('#' + configWindowID + ' .upcirprop').combotree('setValues', areaData.upCirProp);
            $('#' + configWindowID + ' .incirprop').combotree('setValues', areaData.inCirProp);
            $('#' + configWindowID + ' .downcirprop').combotree('setValues', areaData.downCirProp);
        }
        $('#' + configWindowID + ' .btn-ok').attr('update-flag', id)
        $('#' + configWindowID).window('open');
    });

    // 阀值区域配置
    $('#legend-config-window').window({
        title : '&nbsp;图例配置',
        width : 400,
        height : 200,
        modal : true,
        closed : true,
        collapsible : false,
        minimizable : false,
        maximizable : true,
        onOpen : function() {
            if (0 == $('#legend-config-window ul li').length) {
                addLegend();
            }
        }
    });

    $('#legend-edit-btn').click(function() {
        $('#legend-config-window').window('open');
    });

    $('input[name="color"]').colorpicker();

    function addLegend(data) {
        var id = new Date().getTime() + '-' + parseInt(Math.random() * 1000);
        var html;
        if (data) {
            html = '<li id="' + id + '"><input type="text" name="startv" value="'+data.value[0]+'"/><b>~</b><input type="text" name="endv" value="'+data.value[1]+'"/>' + '<input type="text" name="color" data-format="hex" value="'+data.color+'"/>' + '<span class="glyphicon glyphicon-plus" name="legend-add-btn"></span>' + '<span class="glyphicon glyphicon-minus" name="legend-delete-btn"></span></li>';
        } else {
            html = '<li id="' + id + '"><input type="text" name="startv" /><b>~</b><input type="text" name="endv" />' + '<input type="text" name="color" data-format="hex" />' + '<span class="glyphicon glyphicon-plus" name="legend-add-btn"></span>' + '<span class="glyphicon glyphicon-minus" name="legend-delete-btn"></span></li>';
        }
        $('#legend-config-window ul').append(html);
        $('#' + id + ' input[name="color"]').colorpicker();
        return id;
    }
    $('#legend-config-window ul').delegate('li [name="legend-add-btn"]', 'click', function() {
        addLegend();
    });
    $('#legend-config-window ul').delegate('li [name="legend-delete-btn"]', 'click', function() {
        if (1 < $('#legend-config-window ul li').length) {
            $(this).parent().remove();
        }
    });
    $('#legend-config-window .btn-ok').click(function() {
        var legends = new Array();
        var lis = $('#legend-config-window ul li');
        for (var i = 0, len = lis.length; i < len; i++) {
            var startv = $(lis[i]).find('[name="startv"]').val(), endv = $(lis[i]).find('[name="endv"]').val(), color = $(lis[i]).find('[name="color"]').val();
            var legend = {
                name : startv + '~' + endv,
                value : [ parseInt(startv), parseInt(endv) ],
                color : color
            };
            legends.push(legend);
        }
        $('.legend-holder ul').data('legendData', legends);
        addLegendView(legends);
        $('#legend-config-window').window('close');
    });

    function addLegendView(legends) {
        var html = new Array();
        for (var i = 0, len = legends.length; i < len; i++) {
            html.push('<li><span style="background:' + legends[i].color + ';"></span><label>' + legends[i].name + '%</label></li>');
        }
        $('.legend-holder ul').html(html.join(''));
    }
    function formatAreaData(areaData) {
        if (areaData) {
            var data = {};
            data.name = areaData.areaName;
            data.bgColor = areaData.bgColor;
            data.devices = areaData.deviceIDs;
            data.deviceNames = areaData.deviceNames;
            data.upCirProps = areaData.upCirProp;
            data.inCirProps = areaData.inCirProp;
            data.downCirProps = areaData.downCirProp;
            data.upCirPropText = areaData.upCirPropText;
            data.inCirPropText = areaData.inCirPropText;
            data.downCirPropText = areaData.downCirPropText;
            return data;
        }
    }

    function unFormatAreaData(data) {
        if (data) {
            var areaData = {};
            areaData.areaName = data.name;
            areaData.bgColor = data.bgColor;
            areaData.deviceIDs = data.devices;
            areaData.deviceNames = data.deviceNames;
            areaData.upCirProp = data.upCirProps;
            areaData.inCirProp = data.inCirProps;
            areaData.downCirProp = data.downCirProps;
            areaData.upCirPropText = data.upCirPropText;
            areaData.inCirPropText = data.inCirPropText;
            areaData.downCirPropText = data.downCirPropText;
            return areaData;
        }
    }

    $('#wrapper .btn-ok').click(function() {
        var name = window.prompt('请输入视图的名字', viewName);
        if ('' == name) {
            alert('视图的名字不能为空，请重新保存');
            return;
        }else {
        	$.ajax({
            	url:'action.jsp?action=judgeViewName',
            	type:'post',
            	dataType:'json',
            	data:{
            		viewname : encodeURI(name, 'UTF-8'),
            	},
            	success:function(data) {
            		if(!data) {
            			alert("视图校验异常");
            			return;
            		}
            		if(data.result == '1') {
            			alert("视图的名字已经被占用，请更换");
            			return;
            		}else {
            			var viewData = {
    			            name : name,
    			            topLevel : new Array(),
    			            centerLevel : null,
    			            bottomLevel : new Array(),
    			            legend : $('.legend-holder ul').data('legendData')
    			        };
    			        var topLevelAreas = $('#top-level .view-area');
    			        for (var i = 0, len = topLevelAreas.length; i < len; i++) {
    			            viewData.topLevel.push(formatAreaData($(topLevelAreas[i]).data('areaData')));
    			        }
    			        viewData.centerLevel = formatAreaData($('#center-level .view-area').data('areaData'));
    			        var bottomLevelAreas = $('#bottom-level .view-area');
    			        for (var i = 0, len = bottomLevelAreas.length; i < len; i++) {
    			            viewData.bottomLevel.push(formatAreaData($(bottomLevelAreas[i]).data('areaData')));
    			        }
    			        
    			        $.ajax({
    			        	url:'action.jsp?action=saveFlowMonitorConfig',
    			        	type:'post',
    			        	data:{
    			        		viewname : encodeURI(name, 'UTF-8'),
    			        		viewData: encodeURI(JSON.stringify(viewData), 'UTF-8')
    			        	},
    			        	success:function(data) {
    			        		if ('1' == $.trim(data)) {
    			                    alert('保存成功');
    			                }
    			        	}
    			        	
    			        });
            		}
            	},
            	error: function() {
            		alert("http exception");
            	}
            	
            });
        }
        
    });

});
