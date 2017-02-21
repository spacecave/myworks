$(function() {

    'use strict';

    var legend;
    
    var xInterval = 68,
        areaYHeights = [290, 90, 140, 80, 290],
        areaViewPadding = 5,
        deviceWidth = 40,
        deviceHeight = 16,
        bandWidth = 40,
        bandHeight = 15;

    var areaAttr = {
            'stroke-width': 1,
            stroke: '#ccc',
            fill: '#f0f0f0'
        },
        areaTextAttr = {
            fill: '#666',
            'font-size': '18px',
            'font-family': 'Microsoft YaHei'
        },
        deviceAttr = {
            fill: '#f9f9f9',
            'stroke': '#ccc',
            'stroke-width': 1,
            cursor: 'default'
        },
        deviceNameAttr = {
            fill: '#333',
            'font-size': '10px',
            'font-family': 'Microsoft YaHei',
            cursor: 'default'
        },
        bandAttr = {
            fill: '#fff',
            'stroke': '#ccc',
            'stroke-width': 1,
            cursor: 'default'
        },
        bandNameAttr = {
            fill: '#333',
            'font-size': '8px',
            'font-family': 'Microsoft YaHei',
            cursor: 'default'
        },
        emptyDeviceAttr = {
            fill: '#f9f9f9',
            'stroke': '#ccc',
            'stroke-width': 0
        },
        circuitAttr = {
            fill: '#0066CC',
            'stroke-width': 0,
            cursor: 'pointer'
        };

    var $canvas = $('#canvas'),
        canvasWidth = $canvas.width(),
        canvasHeight = $canvas.height(),
        canvas = Raphael($canvas[0], canvasWidth, canvasHeight);

    var hoverTimeout = 0,
        fluxHolderWidth = $('#flux-holder').width(),
        fluxHolderHeight = $('#flux-holder').height();

//    var viewID = $('#viewID').val();
    var viewID = getUrlParam('viewid');
    viewID = '黑龙江移动_test2_admin';
    addUserTree();
    
    $.ajax({
    	url : '/nos/view/flowmonitor/action.jsp?action=loadFlowMonitorView',
    	type: 'post',
    	dataType : 'json',
    	data : {
    		viewid:encodeURI(viewID, 'UTF-8')
    	},
    	success: function(data) {
    		
//    	}
//    })
//    $.getJSON('/nos/view/flowmonitor/action.jsp?action=loadFlowMonitorView&viewid=' + viewID, function(data) {
//    	
	        var topLevel = data.topLevel,
	            centerLevel = data.centerLevel,
	            bottomLevel = data.bottomLevel;
	        legend = data.legend;
	        var maxWidth = 0;
	        var topLevelTotalMax = 0;
	        for (var i = 0, len = topLevel.length; i < len; i++) {
	            // 少于两个的话，中间的互联电路被遮挡，所以最小值改成了4
	            topLevel[i].maxCircuitsLength = getMaxCircuitsLength(topLevel[i]) <= 2 ? 6 : getMaxCircuitsLength(topLevel[i]);
	            topLevelTotalMax += topLevel[i].maxCircuitsLength;
	        }
	        var bottomLevelTotalMax = 0;
	        for (var i = 0, len = bottomLevel.length; i < len; i++) {
	            // 少于两个的话，中间的互联电路被遮挡，所以最小值改成了4
	            bottomLevel[i].maxCircuitsLength = getMaxCircuitsLength(bottomLevel[i]) <= 2 ? 6 : getMaxCircuitsLength(bottomLevel[i]);
	            bottomLevelTotalMax += bottomLevel[i].maxCircuitsLength;
	        }
	        maxWidth = topLevelTotalMax > bottomLevelTotalMax ? topLevelTotalMax * xInterval : bottomLevelTotalMax * xInterval;
	        maxWidth = maxWidth < 1200 ? 1200 : maxWidth;
	        
	       
	        var _viewwidth = (canvasHeight * 0.96 / 800 * maxWidth)<$('#view').width()?$('#view').width():(canvasHeight * 0.96 / 800 * maxWidth),
	        
	        	
	        	
	        	saveView = viewID + '_width_' + $(window).width();
	        
	        _viewwidth = (canvasHeight  * 0.8 / 800 * maxWidth)<$('#view').width()?$('#view').width():( canvasHeight * 0.8 / 800 * maxWidth) ;
	        
	        var savedata = '{"width":' +  _viewwidth + ',"height":' + $canvas.height() + "}";
	        if($('#isframe').val() == 'true') {
	        	
	        }else {
	        	$.ajax({
	            	url:'/nos/view/flowmonitor/action.jsp?action=saveWidth',
	            	data:{
	            		viewid : saveView,
	            		viewData: savedata
	            	},
	            	success:function(data) {
	            		console.log(data);
	            	}
	            	
	            });
	        }
	        
	        
	        
	        $('#view').width(_viewwidth);
	        
	        // centerLevel
	        createArea(0, areaYHeights[0] + areaYHeights[1], maxWidth, areaYHeights[2], centerLevel);
	
	        // topLevel
	        var x = 0,
	            y = 0;
	        for (var i = 0, len = topLevel.length; i < len; i++) {
	            var width = topLevel[i].maxCircuitsLength / topLevelTotalMax * maxWidth;
	            createArea(x, y, width, areaYHeights[0], topLevel[i]);
	            x += width;
	        }
	        // bottomLevel
	        x = 0;
	        y = areaYHeights[0] + areaYHeights[1] + areaYHeights[2] + areaYHeights[3];
	        for (var i = 0, len = bottomLevel.length; i < len; i++) {
	            var width = bottomLevel[i].maxCircuitsLength / bottomLevelTotalMax * maxWidth;
	            createArea(x, y, width, areaYHeights[4], bottomLevel[i]);
	            x += width;
	        }
	
	        canvas.autoFit().wheelable();
	
	        function initLegend(){
	            var legendHtml = new Array();
	            for (var i = 0, len = legend.length; i < len; i++) {
	                if ('#fff' == legend[i].color) {
	                    legendHtml.push('<li><span style="background:' + legend[i].color + ';border:1px solid #ccc;margin-top:7px;"></span><label>' + legend[i].name + '%</label></li>');
	                } else {
	                    legendHtml.push('<li><span style="background:' + legend[i].color + ';"></span><label>' + legend[i].name + '%</label></li>');
	                }
	                if(legend[i].value[0] == 0){
	                    legend[i].value[0] = -1;
	                }
	            }
	            $('#legend-holder ul').html(legendHtml.join(''));
	        }
	        initLegend();
	        
	        function loopLoadFluxRatio() {
	            window.setTimeout(function() {
	                loadFluxRatio(loopLoadFluxRatio);
	            }, 2 * 60 * 1000);
	        }
	        loadFluxRatio(loopLoadFluxRatio);
	        
	        $(window).resize(function() {
	            $('#view').width((canvasHeight * 0.96 / 800 * maxWidth)<$('body').width()?$('body').width():(canvasHeight * 0.96 / 800 * maxWidth));
	            canvas.autoFit();
	        });
    	}
	});

    function getMaxCircuitsLength(areaData) {

        if (!areaData.downCircuits && !areaData.upCircuits) {
            return 2;
        }
        var max = 0;
        if (!areaData.downCircuits) {
            max = areaData.upCircuits.length;
        }
        if (!areaData.upCircuits) {
            max = areaData.downCircuits.length;
        }
        if(areaData.upCircuits && areaData.downCircuits){
            max = areaData.upCircuits.length > areaData.downCircuits.length ? areaData.upCircuits.length : areaData.downCircuits.length;    
        }
        return max > 2 ? max : 2;
    }


    // 绘制区域
    // areaData: name;type;devices;downCircuits;upCircuits;inCircuits;
    function createArea(x, y, width, height, areaData) {

        if(!areaData.devices){
            return;
        }

        var deviceIDs = new Array(),
            deviceNames = new Array();
        for (var i = 0, len = areaData.devices.length; i < len; i++) {
            deviceIDs.push(areaData.devices[i].deviceID);
            deviceNames.push(areaData.devices[i].deviceName);
        }
        deviceNames.sort(); // 后面排序用
        
        // 绘制背景
        var xPadding = 4,
            _width = width - 2 * xPadding;
        var areaRect = canvas.rect(x + xPadding, y, _width, height, 3).attr(areaAttr);
        if(areaData.bgColor){
            areaRect.attr('fill',areaData.bgColor).attr('stroke-width',0);
        }

        function createDevice(pos, device,circuit) {
            if (device) {
                var deviceSet = canvas.set();
                deviceSet.push(canvas.rect(pos.x - deviceWidth / 2, pos.y - deviceHeight / 2, deviceWidth, deviceHeight, 0).attr(deviceAttr));
                var deviceMatchs = device.deviceName.match(/[A-Z\d]+/g);
                deviceSet.push(canvas.text(pos.x, pos.y, deviceMatchs.length >= 4 ? deviceMatchs[3] : deviceMatchs[deviceMatchs.length - 1]).attr(deviceNameAttr));
                deviceSet.tooltip(device.deviceName);
            } else {
                var deviceSet = canvas.set();
                
                var _deviceName,_deviceShortName;
                if(-1==circuit.circuitName.indexOf('【')){
                    var matchs = circuit.circuitName.match(/\[[^\[^\]]*\]/g);
                    var len = matchs.length;
                    _deviceName = matchs[len-1];
                    _deviceName = _deviceName.substring(1,_deviceName.length-1);
                    var shortMatchs = _deviceName.match(/[A-Z\d]+/g);
                    len = shortMatchs.length;
                    _deviceShortName = len>=4?shortMatchs[3]:shortMatchs[len-1];
                }else{
                    var matchs = circuit.circuitName.match(/【.*】.*/g);
                    var len = matchs.length;
                    _deviceName = matchs[len-1];
                    var shortMatchs = _deviceName.match(/【.*】/g);
                    len = shortMatchs.length;
                    _deviceShortName = len>=4?shortMatchs[3]:shortMatchs[len-1];
                    _deviceShortName = _deviceShortName.substring(1,_deviceShortName.length-1);
                }
                deviceSet.push(canvas.rect(pos.x - deviceWidth / 2, pos.y - deviceHeight / 2, deviceWidth, deviceHeight, 0).attr(deviceAttr));
                deviceSet.push(canvas.text(pos.x, pos.y, _deviceShortName).attr(deviceNameAttr));
                deviceSet.tooltip(_deviceName);
            }
            
        }

        function createCircuit(sp, ep, circuit, isExchange) {

            var cp = {
                x: sp.x / 2 + ep.x / 2,
                y: sp.y / 2 + ep.y / 2
            };
            var circuitSet = canvas.set();
            
            circuitSet.push(canvas.lineWithArrow(sp.x, sp.y, cp.x, cp.y, 6, 16, 50).data('circuitType', isExchange ? 'in' : 'out'));
            circuitSet.push(canvas.lineWithArrow(ep.x, ep.y, cp.x, cp.y, 6, 16, 50).data('circuitType', isExchange ? 'out' : 'in'));
            
            var ax = (cp.x - sp.x)/2 + sp.x,
	    		ay = (cp.y - sp.y)/2 + sp.y,
	    		bx = (ep.x - cp.x)/2 + cp.x,
	    		by = (ep.y - cp.y)/2 + cp.y;
            
            var textSet = canvas.set();
            canvas.rect(ax - bandWidth / 2, ay - bandHeight / 2, bandWidth, bandHeight, 0).attr(bandAttr);
            textSet.push(canvas.text(ax, ay, '0.0%').attr(bandNameAttr).data('textType', isExchange ? 'in' : 'out'));
			canvas.rect(bx - bandWidth / 2, by - bandHeight / 2, bandWidth, bandHeight, 0).attr(bandAttr);
			textSet.push(canvas.text(bx, by, '0.0%').attr(bandNameAttr).data('textType', isExchange ? 'in' : 'out'));
            
			textSet.data('circuitID', circuit.circuitID);
//            if(circuit.abandwidth) {
//            	var _ab = circuit.abandwidth;
//            	if(_ab.indexOf('.') == 0) {
//            		_ab = '0' + _ab;
//            	}
//            	canvas.rect(ax - bandWidth / 2, ay - bandHeight / 2, bandWidth, bandHeight, 0).attr(bandAttr);
//            	canvas.text(ax, ay, _ab + '%').attr(bandNameAttr);
//            }
//            if(circuit.bbandwidth) {
//            	var _bb = circuit.bbandwidth;
//            	if(_bb.indexOf('.') == 0) {
//            		_bb = '0' + _bb;
//            	}
//            	canvas.rect(bx - bandWidth / 2, by - bandHeight / 2, bandWidth, bandHeight, 0).attr(bandAttr);
//            	canvas.text(bx, by, _bb + '%').attr(bandNameAttr);
//            }
            
            
            circuitSet.attr(circuitAttr).data('circuitID', circuit.circuitID);

            circuitSet.hover(function(e) {
                var circuitID = this.data('circuitID');
                hoverTimeout = window.setTimeout(function() {
                    
                    var bodyWidth = $('body').width();
                    
                    var left = e.clientX - fluxHolderWidth / 2,
                        top = e.clientY - fluxHolderHeight - 6;
                    if(left<0){
                        left = 0;
                    }
                    if(top<0){
                        top = e.clientY + 6;
                    }
                    if((left+fluxHolderWidth)>bodyWidth){
                        left = e.clientX - fluxHolderWidth;
                    }
                    
                    if($('#isframe').val() == 'true') { 
                    	var _s = window.screen.width - 240 - 390 - fluxHolderWidth > 0 ? window.screen.width - 240 - 390 - fluxHolderWidth : 20;
                    	left = _s/2  + parent.document.getElementById("frame").scrollLeft;
                    	console.log(parent.document.getElementById("frame"));
                    	top = window.screen.height/2 - fluxHolderHeight;
                    }
                    
                    $('#flux-holder').css({
                        left: left,
                        top: top
                    }).show();

                    var chart = echarts.init($('#flux-chart')[0]);
                    chart.showLoading();
                    var option = {
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
                            top: 20,
                            bottom: 60
                        },
                        xAxis: {
                            axisLabel: {
                                formatter: function(value, index) {
                                    return value.substring(8, 10) + ':' + value.substring(10, 12);
                                }
                            }
                        },
                        yAxis: {
                            axisLabel: {
                                formatter: function(value, index) {
                                    return formatFlux(value);
                                }
                            }
                        },
                        series: []
                    };
                    $.getJSON('/nos/view/flowmonitor/action.jsp?action=loadCircuitHoverData&circuitID=' + circuitID, function(data) {
                        chart.hideLoading();

                        $('#flux-info').html('<br>电路名称：' + data.circuitname + '<br>电路带宽：' + formatFlux(data.bandwidth) + '，最近采集时间：' + formatTime(data.fluxtime) + '，流入流速： ' + formatFlux(data.inavgvec) + '，流出流速： ' + formatFlux(data.outavgvec) + '<br>');

                        option.xAxis.data = data.flux.fluxtime;
                        option.series = [{
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
                            data: data.flux.in
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
                            data: data.flux.out
                        }];
                        chart.setOption(option);
                    });
                }, 1500);
            }, function() {
                if (hoverTimeout) {
                    window.clearTimeout(hoverTimeout);
                }
                $('#flux-holder').hide();
            });
            circuitSet.mousemove(function(e) {
            	//接收杨永平参数，如果是调用页面则居中
                var bodyWidth = $('body').width();
                var left = e.clientX - fluxHolderWidth / 2,
                    top = e.clientY - fluxHolderHeight - 6;
                if(left<0){
                    left = 0;
                }
                if(top<0){
                    top = e.clientY + 6;
                }
                if((left+fluxHolderWidth)>bodyWidth){
                    left = e.clientX - fluxHolderWidth;
                }
                
                if($('#isframe').val() == 'true') { 
                	var _s = window.screen.width - 240 - 390 - fluxHolderWidth > 0 ? window.screen.width - 240 - 390 - fluxHolderWidth : 20;
                	left = _s/2  + parent.document.getElementById("frame").scrollLeft;
                	console.log(parent.document.getElementById("frame"));
                	top = window.screen.height/2 - fluxHolderHeight;
                }
                
                
                $('#flux-holder').css({
                    left: left,
                    top: top
                });
            });

            circuitSet.dblclick(function() {
                window.open('FlowDetailView.jsp?circuitID=' + this.data('circuitID'));
            });
        }

        function createInCircuit(_y, inCircuit) {
            var sp = {
                    x: x + 2 * xPadding + areaViewPadding + deviceWidth / 2,
                    y: _y
                },
                ep = {
                    x: x + width - 2 * xPadding - areaViewPadding - deviceWidth / 2,
                    y: _y
                };
            // 根据两端设备名称决定是否将电路两端设备对调，为了后面排序用
            createCircuit(sp, ep, inCircuit,inCircuit.adevice.deviceName>inCircuit.bdevice.deviceName);
            if(inCircuit,inCircuit.adevice.deviceName>inCircuit.bdevice.deviceName){
                createDevice(ep, inCircuit.adevice);
                createDevice(sp, inCircuit.bdevice,inCircuit);
            }else{
                createDevice(sp, inCircuit.adevice);
                createDevice(ep, inCircuit.bdevice,inCircuit);
            }
        }

        // 绘制 inCircuits
        var inCircuits = areaData.inCircuits;
        if (inCircuits) {
            var inCirsLen = inCircuits.length;
            for (var i = 0; i < inCirsLen; i++) {
                if ('center' == areaData.type) {
                    createInCircuit(y + height / 3 + height / 3 / inCirsLen / 2 + height / 3 / inCirsLen * i, inCircuits[i]);
                } else if ('top' == areaData.type) {
                    createInCircuit(y + height / 2 + height / 3 / inCirsLen / 2 + height / 3 / inCirsLen * i, inCircuits[i]);
                } else if ('bottom' == areaData.type) {
                    createInCircuit(y + height / 6 + height / 3 / inCirsLen / 2 + height / 3 / inCirsLen * i, inCircuits[i]);
                }
            }
        }

        // 绘制 upCircuits
        function createUpCircuit(_x, upCircuit) {
            var sp = {
                    x: _x
                },
                ep = {
                    x: _x
                };
            if ('top' == areaData.type) {
                sp.y = y + areaViewPadding + deviceHeight / 2;
                ep.y = y + height / 2 - areaViewPadding - deviceHeight / 2;
            } else if ('bottom' == areaData.type) {
                sp.y = y - areaYHeights[3] - areaYHeights[2] / 6;
                ep.y = y + height / 12;
            }

            if (deviceIDs.contains(upCircuit.adevice.deviceID)) {
                createCircuit(sp, ep, upCircuit, true);
                createDevice(ep, upCircuit.adevice);
                createDevice(sp, upCircuit.bdevice,upCircuit);
            } else {
                createCircuit(sp, ep, upCircuit);
                createDevice(sp, upCircuit.adevice);
                createDevice(ep, upCircuit.bdevice,upCircuit);
            }
        }
        function orderCircuits(circuits){
            if(!circuits){
                return null;
            }
            var ordered = new Array();
            for(var i=0,len=deviceNames.length;i<len;i++){
                for(var j=0,jLen=circuits.length;j<jLen;j++){
                    if(deviceNames[i] == circuits[j].adevice.deviceName || (circuits[j].bdevice && deviceNames[i] == circuits[j].bdevice.deviceName)){
                        ordered.push(circuits[j]);
                    }
                }
            }
            return ordered;
        }
        var upCircuits = orderCircuits(areaData.upCircuits);
        if (upCircuits) {
            var upCirsLen = upCircuits.length;
            for (var i = 0; i < upCirsLen; i++) {
                createUpCircuit(x + xPadding + _width / upCirsLen / 2 + _width / upCirsLen * i, upCircuits[i]);
            }
        }

        // 绘制 downDevices
        function createDownCircuit(_x, downCircuit) {
            var sp = {
                    x: _x
                },
                ep = {
                    x: _x
                };
            if ('top' == areaData.type) {
                sp.y = y + height * 11 / 12;
                ep.y = y + areaYHeights[0] + areaYHeights[1] + areaYHeights[2] / 6;
            } else if ('bottom' == areaData.type) {
                sp.y = y + height / 2 + areaViewPadding + deviceHeight / 2;
                ep.y = y + height - areaViewPadding - deviceHeight / 2;
            }
            createCircuit(sp, ep, downCircuit);
            if (deviceIDs.contains(downCircuit.adevice.deviceID)) {
                createCircuit(sp, ep, downCircuit);
                createDevice(sp, downCircuit.adevice);
                createDevice(ep, downCircuit.bdevice,downCircuit);
            } else {
                createCircuit(sp, ep, downCircuit, true);
                createDevice(ep, downCircuit.adevice);
                createDevice(sp, downCircuit.bdevice,downCircuit);
            }
        }
        var downCircuits = orderCircuits(areaData.downCircuits);
        if (downCircuits) {
            var downCirsLen = downCircuits.length;
            for (var i = 0; i < downCirsLen; i++) {
                createDownCircuit(x + xPadding + _width / downCirsLen / 2 + _width / downCirsLen * i, downCircuits[i]);
            }
        }
        
        // 绘制文字
        var textY = y + height / 2;
        if ('top' == areaData.type) {
            // textY = y + height * 9 / 16;
            textY = y - 16;
        } else if ('bottom' == areaData.type) {
            // textY = y + height * 7 / 16;
            textY = y + height + 16;
        }else if('center' == areaData.type){
            textY = y + height / 2 - 20;
        }
        canvas.text(x + width / 2, textY, areaData.name).attr(areaTextAttr);
    }

    // 加载电路利用率
    function loadFluxRatio(callback) {
        var circuits = new Array();
        canvas.forEach(function(el) {
            if (el.data('circuitID') && !circuits.contains(el.data('circuitID'))) {
                circuits.push(el.data('circuitID'));
            }
        });

        function getCircuitColor(fluxRatio) {
            for (var i = 0, len = legend.length; i < len; i++) {
                if (legend[i].value[0] < fluxRatio && fluxRatio <= legend[i].value[1]) {
                    return legend[i].color;
                }
            }
        }

        $.getJSON('/nos/view/flowmonitor/action.jsp?action=loadFluxRatio', {
            circuits: circuits.join(',')
        }, function(data) {
            canvas.forEach(function(el) {
                if (el.data('circuitID')) {
                    var fluxRatio = 0;
                    if (data[el.data('circuitID')] && data[el.data('circuitID')][el.data('circuitType')]) {
                        fluxRatio = data[el.data('circuitID')][el.data('circuitType')];
                    }
                    if(data[el.data('circuitID')][el.data('textType')]) {
                    	fluxRatio = data[el.data('circuitID')][el.data('textType')] + '';
                    	if(fluxRatio.indexOf('.') != -1) {
                    		fluxRatio = fluxRatio.split('.')[0] + '.' + fluxRatio.split('.')[1].substring(0,1);
                    	}
                    	fluxRatio = fluxRatio + "%";
                    	el.attr('text', fluxRatio);
                    	el.attr(bandNameAttr);
                    }else {
                    	el.attr('fill', getCircuitColor(fluxRatio));
                    }
                    
                }
            });

            if ($.isFunction(callback)) {
                callback();
            }
        });
    }
    
    function addUserTree() {
    	$.fn.combotree.defaults.editable = true;
    	$.extend($.fn.combotree.defaults.keyHandler,{
    		up:function(){
    			       
    		},
    		down:function(){
    			
    		},
    		enter:function(){
    			var t = $(this).combotree('tree');
    			var nodes = t.tree('getChildren');
    			for(var i=0; i<nodes.length; i++){
    				var node = nodes[i];
    				 t.tree('collapse', node.target);
    				$(nodes[i].target).show();
    			}
    		},
    		query:function(q){
    			var t = $(this).combotree('tree');
    			var nodes = t.tree('getChildren');
    			for(var i=0; i<nodes.length; i++){
    				var node = nodes[i];
    				if(q != "") {
     					t.tree('expandTo', node.target);
    				}
    				if (node.text.indexOf(q) >= 0){
    					$(node.target).show();
    				} else {
    					$(node.target).hide();
    				}
    			}
    			var opts = $(this).combotree('options');
    			if (!opts.hasSetEvents){
    				opts.hasSetEvents = true;
    				var onShowPanel = opts.onShowPanel;
    				opts.onShowPanel = function(){
    					var nodes = t.tree('getChildren');
    					for(var i=0; i<nodes.length; i++){
    						 t.tree('collapse', node.target);
    						$(nodes[i].target).show();
    					}
    					onShowPanel.call(this);
    				}
    				$(this).combo('options').onShowPanel = opts.onShowPanel;
    			}
    		}
    	});
    	
    	$("#usertree").combotree({
	    	width:130,
	    	height:25,
	    	editable:true,
	    	url:"/nos/view/flowmonitor/action.jsp?action=loadUserTree",
			onShowPanel:function() {
				var t = $(this).combotree('tree');
				var nodes = t.tree('getChildren');
				for(var i=0; i<nodes.length; i++){
					var node = nodes[i];
//					if(node.id == "NOD999") {
//						continue;
//					}
//					t.tree('collapse', node.target);
					
					$(nodes[i].target).show();
				}
			},
			onSelect:function(data) {
				if(data.id != 'NOD999' && data.id != 'F001') {
					var t = $("#usertree").combotree('tree');
					var nodes = t.tree('getChildren');
					var nodetext = "";
					for(var i=0; i<nodes.length; i++){
						var node = nodes[i];
						if(node.children) {
							var childs = node.children;
							for(var j = 0; j < childs.length; j ++) {
								if(childs[j].id == data.id && childs[j].text == data.text) {
									console.log(node.text);
									nodetext = node.text;
									break;
								}
							}
						}
					}
					var loc = nodetext + "_" + data.text + "_" + data.id;
					window.open('/nos/view/flowmonitor/FlowMonitorView.jsp?viewid='+encodeURI(loc));
				}
			}
	    });
    	
    }
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值
    }

    $('#view-edit-btn').click(function(){
        window.open('/nos/view/flowmonitor/FlowMonitorConfig.jsp?viewid='+viewID);
    });
    
    $('#view-center-btn').click(function() {
    	canvas.autoFit();
    })
});
