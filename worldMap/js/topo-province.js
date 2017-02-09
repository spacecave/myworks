(function(win){
    var pp;
    var ALARMCOLOR = {
        DEVALARMLEVEL2: "rgba(255,58,78,0.5)",
        DEVALARMLEVEL10: "rgba(233,97,29,0.65)",
        DEVALARMLEVEL1: "rgba(255,239,0,0.5)",
        CIRALARMLEVEL2: "rgba(255,58,78,0.5)",
        CIRALARMLEVEL8: "rgba(255,239,0,0.5)",
        CIRALARMLEVEL5: "rgba(255,58,78,0.5)",
        CIRALARMLEVEL4: "rgba(233,97,29,0.65)",
        CIRALARMLEVEL1: "rgba(255,239,0,0.5)"
    };

    win.getProvinceTopo = function(divid, name, webset){
        var proTopo = this;
        var _topo = Graph.init(document.getElementById(divid), {
            cx: 0.65,
            saveposflag: "position_" + name
        });
        var drawGraph = function(data) {
             var w = $("#" + divid).width();
            var h = $("#" + divid).height();
           
            var topoDom = document.getElementById(divid);
            
            var topo = Graph.getGraph(topoDom);
            pp = topo.paper;

            var drawBezier = function(data) {
                var drawBezierNodes = function(topoDom, opts) {
                    // var topo = Graph.getGraph(topoDom);

                    var nodeType = opts.nodeType;
                    var cx = opts.cx;
                    var cy = opts.cy;
                    var nodeDatas = opts.nodeDatas;
                    if (!nodeDatas) {
                        return;
                    }

                    
                    var osrc;
                    var width = opts.width;
                    var height = opts.height;
                    var textAttr = opts.textAttr;
                    var getHoverText;
                    var dbclick;
                    var src = "css/img/" + opts.nodeType + ".png";

                    var isCurve = opts.isCurve ? opts.isCurve : "Y";

                    var span = nodeDatas.length > 6 ? 40 : 60;
                    var direct = opts.direct ? opts.direct : -1;
                    var len = nodeDatas.length;
                    function getAuxPath() {
                        if (1 == len) {
                            return [
                                "M",
                                cx,
                                cy,
                                cx,
                                cy
                            ];
                        }

                        if ("Y" == isCurve) {
                            var dist = (len - 1) * span < 100 ? 100 : (len - 1) * span;
                            var sPoint = {
                                x: cx,
                                y: cy - dist
                            };
                            var ePoint = {
                                x: cx,
                                y: cy + dist
                            };
                            var sAuxPoint = {
                                x: cx - dist / 1.6 * direct,
                                y: cy - dist
                            };
                            var eAuxPoint = {
                                x: cx - dist / 1.6 * direct,
                                y: cy + dist
                            };
                            
                            return [
                                "M",
                                sPoint.x,
                                sPoint.y,
                                "C",
                                sAuxPoint.x,
                                sAuxPoint.y,
                                eAuxPoint.x,
                                eAuxPoint.y,
                                ePoint.x,
                                ePoint.y
                            ];
                        } else {
                            span = span < 140? 140 : span;
                            var dist = (len - 1) * span;
                            var sPoint = {
                                x: cx - dist / 2,
                                y: cy 
                            };
                            var ePoint = {
                                x: cx + dist / 2,
                                y: cy 
                            };
                            return [
                                "M",
                                sPoint.x,
                                sPoint.y,
                                ePoint.x,
                                ePoint.y
                            ];
                        }
                    }
                    var sets = topo.paper.set();
                    var auxLine = topo.paper.path(getAuxPath().join(","));
                  
                    var lenSpan = auxLine.getTotalLength() / (len - 1);
                    var getHoverText = function(nodeData) {
                        var textArray = new Array();
                        textArray.push("设备名称：" + nodeData.name);
                        if(nodeData.loopaddress) {
                            textArray.push("设备地址：" + nodeData.loopaddress);
                            textArray.push("<i style='display:block;color:#FFFF00;font-size:11px;line-height:14px;margin-top:6px;'>双击可查看设备视图</i>");
                        }
                        
                        return textArray.join("<br>");
                    } 
                    
                    for (var i = 0; i < len; i++) {
                        var nodeData = nodeDatas[i];
                        var id = nodeData.id ? nodeData.id : nodeData;
                        var name = nodeData.name ? nodeData.name : nodeData;
                        var sPos = false;// getPos(topoDom, id);
                        var pos = sPos ? sPos : auxLine.getPointAtLength(i * lenSpan);
                        var hovert = getHoverText(nodeData);
                        if(nodeType == "cloud") {
                            hovert = "<i style='display:block;color:#FFFF00;font-size:11px;line-height:14px;margin-top:6px;'>双击可查看拓扑</i>"; 
                        }
                        var gNode = topo.addNode(name, {
                            type: "image",
                            x: pos.x - width / 2,
                            y: pos.y - height / 2,
                            width: width,
                            height: height,
                            imageSrc: src,
                            text: name,
                            textAttr: textAttr,
                            hoverText: hovert,
                            alarmColor: getAlarmColor("DEV", nodeData.alarmlevel),
                            data: nodeData,
                            dbclick: opts.dbclick
                        });
                        sets.push(gNode.raphNode);
                    }
                    auxLine.remove();
                    return sets;
                }


                var set;
                var x = 100;
                var span = 50;
                var devI = data.DEVS.I ? data.DEVS.I : null;
                var devC = data.DEVS.C ? data.DEVS.C : null;
                var devX = data.DEVS.X ? data.DEVS.X : null;
                var devF = data.DEVS.F ? data.DEVS.F : null;
                var devCloud = data.NODES? data.NODES : null;
                var orderRelNodes;
                var cbox,
                    ibox,
                    xbox;

                var devdbClick = function(ele) {
                    window.open("/portal/monitor-center/device.jsp?devid=" + ele.deviceid + "&webset=" + webset + "&odevname=" + ele.name +"&oip=" + ele.loopaddress,"_blank");
                }
                var inXdev;
                if(devC) {

                    orderRelNodes = devC;
                    set = drawBezierNodes(topoDom, {
                        nodeType: "C",
                        cx: x,
                        cy: 0,
                        width: 71,
                        height:42,
                        dbclick: devdbClick,
                        textAttr: {
                                "v-align":"bottom",
                                "fill":"#fff"
                            },
                        nodeDatas: orderRelNodes
                    });
                    x = set.getBBox().x2 + 360;
                    cbox = set.getBBox();
                }
                if(devI) {
                    orderRelNodes = orderRelNodes ? orderNodes(devI, orderRelNodes, data.Lines) : devI;
                    set = drawBezierNodes(topoDom, {
                        nodeType: "I",
                        cx: x,
                        cy: 0,
                        width:45,
                        height:35,
                        dbclick: devdbClick,
                        textAttr: {
                                "v-align":"bottom",
                                "fill":"#fff"
                            },
                        nodeDatas: orderRelNodes
                    });
                    x = set.getBBox().x2 + 360;
                    ibox = set.getBBox();
                }

                var inXArr = [];//存放属于本节点的C设备
                var outXArr = [];//存放不属于本节点的X设备
                if(devX) {
                    
                    for(var i = 0, ilen = devX.length; i < ilen; i ++) {
                        if(devX[i].node == name) {
                            inXArr.push(devX[i]);
                        }else {
                            outXArr.push(devX[i]);
                        }
                    }
                    orderRelNodes = orderRelNodes ? orderNodes(outXArr, orderRelNodes, data.Lines) : outXArr;
                    set = drawBezierNodes(topoDom, {
                       
                        nodeType: "X",
                        cx: x,
                        cy: 0,
                        width:45,
                        height:35,
                        dbclick: devdbClick,
                        textAttr: {
                                "v-align":"bottom",
                                "fill":"#fff"
                            },
                        nodeDatas: orderRelNodes
                    });
                    x = set.getBBox().x2 + 360;
                    xbox = set.getBBox();
                    
                }
                if(devF) {
                    if(name != "北京市" && name != "广州" && name != "上海市") {
                        var mainDevArr = [],
                            otherDevArr = [];
                        for(var i = 0; i < devF.length; i ++) {
                            if(devF[i].node == name) {
                                mainDevArr.push(devF[i]);
                            }else {
                                otherDevArr.push(devF[i]);
                            }
                        }
                        orderRelNodes = orderRelNodes ? orderNodes(mainDevArr, orderRelNodes, data.Lines) : mainDevArr;
                        set = drawBezierNodes(topoDom, {
                            
                            nodeType: "F",
                            cx: x,
                            cy: 0,
                            width:32,
                            height:44,
                            dbclick: devdbClick,
                            textAttr: {
                                "v-align":"bottom",
                                "fill":"#fff"
                            },
                            nodeDatas: orderRelNodes
                        });
                        x = set.getBBox().x2 + 360;
                        inXdev = set.getBBox();
                        var rectX = set.getBBox().x;
                        var rectY = set.getBBox().y;
                        var rectW = set.getBBox().width;
                        var rectH = set.getBBox().height;

                        
                        if(inXArr.length != 0) {
                            set = drawBezierNodes(topoDom, {
                                
                                nodeType: "X",
                                cx: x,
                                cy: 0,
                                width:45,
                                height:35,
                                dbclick: devdbClick,
                                textAttr: {
                                        "v-align":"bottom",
                                        "fill":"#fff"
                                    },
                                nodeDatas: inXArr
                            });
                           
                            x = set.getBBox().x2 + 360;
                            xbox = set.getBBox();

                            rectY = Math.min(inXdev.y, set.getBBox().y);
                            rectX = inXdev.x;
                            rectW = set.getBBox().x - inXdev.x + inXdev.width + span;
                            if(rectY == inXdev.y) {
                                rectH = inXdev.height;

                            }else if(rectY == set.getBBox().y) {
                                rectH = set.getBBox().height;
                            }
                        }


                        pp.rect(rectX - span, rectY-span, rectW + span * 2, rectH + span*2, 10).attr({
                            stroke: "#fff",
                            "stroke-width": 1,
                            "stroke-dasharray": ["- "]
                        });
                        pp.text(rectX + rectW  / 2, rectY - span + 20, name).attr({
                            fill: "#fff",
                            "font-size": "20px",
                            "font-family": "微软雅黑"
                        });

                        orderRelNodes = orderRelNodes ? orderNodes(otherDevArr, orderRelNodes, data.Lines) : otherDevArr;
                        if(orderRelNodes.length != 0) {
                            set = drawBezierNodes(topoDom, {
                                
                                nodeType: "F",
                                cx: x,
                                cy: 0,
                                width:32,
                                height:44,
                                dbclick: devdbClick,
                                textAttr: {
                                    "v-align":"bottom",
                                    "fill":"#fff"
                                },
                                nodeDatas: orderRelNodes
                            });
                            x = set.getBBox().x2 + 360;
                        }
                        


                    }else {
                        orderRelNodes = orderRelNodes ? orderNodes(devF, orderRelNodes, data.Lines) : devF;
                        if(orderRelNodes.length != 0) {
                            set = drawBezierNodes(topoDom, {
                                
                                nodeType: "F",
                                cx: x,
                                cy: 0,
                                width:32,
                                height:44,
                                dbclick: devdbClick,
                                textAttr: {
                                    "v-align":"bottom",
                                    "fill":"#fff"
                                },
                                nodeDatas: orderRelNodes
                            });
                            x = set.getBBox().x2 + 360;
                        }
                        
                    }


                    
                }
                if(devCloud) {
                    orderRelNodes =  orderCloudNodes(devCloud);

                    var lineDBClick = function(ele) {
                        // var pageModule = "topo_alarm_cir";
                        
                        // var dataUrl = "/report-service/service.jsp?pageModule=" + pageModule;
                       
                        // dataUrl = dataUrl + "&params=" + webset + "&params=" + name + "&params=" + ele.name;

                        // $("#phy-cir-window").window("setTitle", name + " > " + ele.name + "电路列表");
                        // $("#phy-cir-window").window("open");
                        // var circuitTable = new CircuitTable("phy-cir-table", webset);
                        
                        // circuitTable.init();
                        // circuitTable.loadData(dataUrl);
                        $("#prov-detail-cloud").show();
                        var protopo = new getProvinceCloudTopo("prov-detail-cloud-topo", name, webset, ele.name);
                        
                   
                        protopo.loadTopo();
                        
                    }

                    set = drawBezierNodes(topoDom, {
                        
                        nodeType: "cloud",
                        cx: x,
                        cy: 0,
                        width:145,
                        height:106,
                        textAttr: {
                            "v-align":"center",
                            "fill":"#0086B3",
                            "font-weight":"bold"
                        },
                        dbclick: lineDBClick,
                        // direct:"Y",
                        nodeDatas: orderRelNodes
                    });
                    x = set.getBBox().x2 + 360;
                    // xbox = set.getBBox();
                }

                if(devC) {
                    
                    var areay = Math.min(cbox.y, ibox.y, xbox.y);
                    var areax;
                    var areaheight;
                    if(areay == cbox.y) {
                        // areax = cbox.x;
                        areaheight = cbox.height;
                    }else if(areay == ibox.y) {
                        // areax = ibox.x;
                        areaheight = ibox.height;
                    }else if(areay == xbox.y) {
                        // areax = xbox.x;
                        areaheight = xbox.height;
                    }
                    var areawidth = xbox.x - cbox.x + xbox.width + 2 * span;
                    var areax = cbox.x - span;
                    areay = areay - span;
                    areaheight = areaheight + span * 2;
                   
                    pp.rect(areax, areay, areawidth, areaheight, 10).attr({
                        stroke: "#fff",
                        "stroke-width": 1,
                        "stroke-dasharray": ["- "]
                    });
                    pp.text(areax + areawidth / 2, areay + 20, name).attr({
                        fill: "#fff",
                        "font-size": "23px",
                        "font-family": "微软雅黑"
                    });
                }
               


                
                topo.autoSet(180);

            }

          
            var drawLines = function(data) {
                var cache = new Object();//有a端b端设备既做a端又做b端的情况。做个缓存存放数据
                for(var i = 0; i < data.length; i ++) {
                    var _arr = [];
                    var key = data[i].adev + "#" + data[i].bdev;
                    var key_rev = data[i].bdev + "#" + data[i].adev;
                    if(!data[i].adev || !data[i].bdev) {
                        continue;
                    }
                    var key_incache = null;

                    for(var ca in cache) {
                        if(ca == key || ca == key_rev) {
                            key_incache = ca;
                            _arr = cache[ca];
                            break;
                        }
                    }

                    var _lineindata = data[i].lines;
                    if(_lineindata) {
                        for(var j = 0, jlen = _lineindata.length; j < jlen; j ++) {
                            _arr.push(_lineindata[j].circuitname);
                        }
                    }
                    if(key_incache) {
                        cache[key_incache] = _arr;
                    }else {
                        cache[key] = _arr;
                    }                

                }
                for(var i = 0; i < data.length; i ++) {
                    var line = data[i];
                    if(!line.adev || !line.bdev) {
                        continue;
                    }
                    var hoverText = new Array();
                    // for(var ca in cache) {
                    //     var key_data = line.adev + "#" + line.bdev;
                    //     var key_data_rev = line.bdev + "#" +line.adev;
                    //     if(ca == key_data_rev || ca == key_data) {
                    //         hoverText = cache[ca];
                    //         break;
                    //     }
                    // }
                    hoverText.push(line.adev + "--->" + line.bdev);
                    hoverText.push("中断电路比例:" + line.alarmpropotion);
                    hoverText.push("拥塞电路比例:" + line.congestpropotion);
                    hoverText.push("MAX利用率(入):" + line.maxin  +"%");
                    hoverText.push("MAX利用率(出):" + line.maxout + "%");
                    hoverText.push("总带宽:" + line.bwinfo);
                   
                    // if(line.lines) {
                    //     for (var j = 0, jLen = line.lines.length; j < jLen && j < 10; j++) {
                    //         var _line = line.lines[j];
                    //         hoverText.push(_line.circuitname);
                    //     }
                    // }
                    var linecolor = getAlarmColor("CIR", data[i].alarmlevel)
                    var lineAttr = {
                        "stroke-width": 1.6,
                        "stroke": linecolor ? linecolor :"rgba(0,152,71,0.9)"
                    };
                    var lineDBClick = function(ele) {
                        var pageModule = "topo_alarm_cir";
                        var param = ele;
                        var dataUrl = "/report-service/service.jsp?pageModule=" + pageModule;
                       
                        dataUrl = dataUrl + "&params=" + webset + "&params=" + param.adev + "&params=" + param.bdev;

                        $("#phy-cir-window").window("setTitle", param.adev + " > " + param.bdev + "电路列表");
                        $("#phy-cir-window").window("open");
                        var circuitTable = new CircuitTable("phy-cir-table", webset);
                        
                        circuitTable.init();
                        circuitTable.loadData(dataUrl);
                    }
                    var _cir = topo.addLine(line.adev, line.bdev, {
                        attr: lineAttr,
                        hoverText: hoverText.join("<br/>"),
                        dbclick: lineDBClick,
                        data: line
                    });
                    
                   
                }
                
            }

            
            var drawProvArea = function(count, areaName) {
              
                var span = 50;
                var ylen;
                var width;
                if(data.NODES.C) {
                    ylen = Math.max(data.NODES.C.length, data.NODES.I.length, data.NODES.X.length);
                    width = w/count * 2+ span * 2;
                }else if(data.NODES.I) {
                    ylen = Math.max(data.NODES.I.length, data.NODES.X.length);
                    width = w/count + span * 2;
                }else if(data.NODES.X) {
                    ylen = data.NODES.X.length;
                    width = 30 * 2+ span * 2;
                }else {
                    return;
                }
               
                var x = w/count - span;
                var y = h/(ylen+1) - span;
                // var width = w/count * 2+ span * 2;
                var height = h/(ylen+1) *(ylen-1) + span * 2;
                pp.rect(x, y, width, height, 10).attr({
                    stroke: "#fff",
                    "stroke-width": 1,
                    "stroke-dasharray": ["- "]
                });
                pp.text(x + width / 2, y + 20, areaName).attr({
                    fill: "#fff",
                    "font-size": "20px",
                    "font-family": "微软雅黑"
                });
            }

            var drawText = function(txt) {
                $("#pro-detail-font-1").html(txt);
               
            }
            
            drawBezier(data);
            
            drawLines(data.Lines);
            // drawText("全球--" + name);
            
        }
        proTopo.loadTopo = function() {
            _topo.showLoading();
            $("#pro-detail-font-1").html("全球--" + name);
            var url;
            if(name != "北京市" && name != "广州" && name != "上海市") {
                url= "/report-service/service.jsp?pageModule=topo_gj_area_dev&params="+webset+"&params="+name;
            }else {
                url= "/report-service/service.jsp?pageModule=topo_gj_dev&params="+webset+"&params="+name;
            }
            $.ajax({
                url: url,
                // data: {
                //     params: [_webset,_name]
                // },
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if(data.result) {
                        drawGraph(data.result);
                    }
                    _topo.hideLoading();
                }
            });
        }
        
       
        
        proTopo.init = function(winid) {
            $("#" + winid).window({
                width: 1000,
                height: 700,
                collapsible: false,
                minimizable: false,
                maximizable: false,
                shadow: false,
                resizable: true,
                modal: true,
                closed: true,
                onResize: function(width, height) {
                    
                }
            });
        }
       
    
    }

    function drawCloudTopo() {
        $("#prov-detail-cloud").show();
        $.ajax({
            url: "/report-service/service.jsp?pageModule=topo_gj_node",
           
            cache: false,
            dataType: 'json',
            success: function(data) {
                data = {"NODES": [{"name": "美洲区POP点"},{ "name": "美洲区客户" },{"name": "美洲区运营商"}, {"name": "亚太区POP点"}],
                "DEVS": [{"loopaddress": "202.97.32.62","node": "北京市","name": "BJ-BJ-DS-X-3.163","deviceid": "DEV002a0","alarmlevel": 1},
                {"loopaddress": "202.97.32.63","node": "北京市","name": "BJ-BJ-DS-X-4.163","deviceid": "DEV002a1","alarmlevel": 1},
                {"loopaddress": "202.97.32.28","node": "上海市","name": "SH-SH-HB-X-3.163","deviceid": "DEV02175","alarmlevel": 1},
                {"loopaddress": "202.97.32.29","node": "上海市","name": "SH-SH-HB-X-4.163","deviceid": "DEV02176","alarmlevel": 1},
                {"loopaddress": "202.97.32.55","node": "广州","name": "GD-GZ-TT-X-3.163","deviceid": "DEV02177","alarmlevel": 1},
                {"loopaddress": "202.97.32.51","node": "广州","name": "GD-GZ-TT-X-4.163","deviceid": "DEV02178","alarmlevel": 1}]};


           } 
        });
    }

    function getAlarmColor(type, alarmLevel) {
        if ("DEV" == type.toUpperCase()) {
            return ALARMCOLOR["DEVALARMLEVEL" + alarmLevel];
        } else if ("CIR" == type.toUpperCase()) {
            return ALARMCOLOR["CIRALARMLEVEL" + alarmLevel];
        }
    }

    function orderCloudNodes(nodes) {
        var orderedNodes = [];
        for(var i = 0, ilen = nodes.length; i < ilen; i ++) {
            if(nodes[i].name.indexOf("POP") != -1) {
                orderedNodes.push(nodes[i]);
            }
        }
        for(i = 0; i < ilen; i ++) {
            if(nodes[i].name.indexOf("POP") == -1) {
                orderedNodes.push(nodes[i]);
            }    
        }
        return orderedNodes;
    }


    function orderNodes(oldNodes, relNodes, lines) {
        var orderedNodes = new Array();
        for (var i = 0; i < relNodes.length; i++) {
            var id = relNodes[i].name;
            for (var j = 0, jLen = lines.length; j < jLen; j++) {
                var line = lines[j];
                if (line.adev == id || line.bdev == id) {
                    var otherId = "";
                    if (line.adev == id) {
                        otherId = line.bdev;
                    } else if (line.end == id) {
                        otherId = line.adev;
                    }
                    for (var m = 0, mLen = oldNodes.length; m < mLen; m++) {
                        var node = oldNodes[m];
                        if (node.name == otherId && !orderedNodes.contains(node)) {
                            orderedNodes.push(node);
                        }
                    }
                }
            }
        }
        for (var i = 0, len = oldNodes.length; i < len; i++) {
            var node = oldNodes[i];
            if (!orderedNodes.contains(node)) {
                orderedNodes.push(node);
            }
        }
        return orderedNodes;
    }

     Array.prototype.contains = function(obj) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    };

    
})(window);