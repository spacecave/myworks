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

    win.getProvinceCloudTopo = function(divid, name, webset, endname){
        var proTopo = this;
        var _topo = Graph.init(document.getElementById(divid), {
            cx: 0.65,
            saveposflag: "position_cloud_" + name
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

                    var span = nodeDatas.length > 6 ? 70 : 60;
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
                                x: cx - dist,
                                y: cy
                            };
                            var ePoint = {
                                x: cx + dist,
                                y: cy
                            };
                            var sAuxPoint = {
                                x: cx - dist,
                                y: cy + dist / 1.6 * direct
                            };
                            var eAuxPoint = {
                                x: cx + dist,
                                y: cy + dist / 1.6 * direct
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
                            
                        }
                        textArray.push("<i style='display:block;color:#FFFF00;font-size:11px;line-height:14px;margin-top:6px;'>双击可查看设备视图</i>");
                        
                        return textArray.join("<br>");
                    } 
                    
                    for (var i = 0; i < len; i++) {
                        var nodeData = nodeDatas[i];
                        var id = nodeData.id ? nodeData.id : nodeData;
                        var name = nodeData.name ? nodeData.name : nodeData;
                        var sPos = false;// getPos(topoDom, id);
                        var pos = sPos ? sPos : auxLine.getPointAtLength(i * lenSpan);
                        var hovert = getHoverText(nodeData);
                        if(nodeType == "cloud" && endname.indexOf("POP") != -1) {
                            hovert = "<i style='display:block;color:#FFFF00;font-size:11px;line-height:14px;margin-top:6px;'>双击可查看拓扑</i>"; 
                        }else if(nodeType == "cloud") {
                            hovert ="";
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
                var y = 100;
                var span = 50;
                var devI = data.DEVS ? data.DEVS : null;
              
                var devCloud = data.NODES? data.NODES : null;
                var orderRelNodes;
                var cbox,
                    ibox,
                    xbox;

                var devdbClick = function(ele) {
                    window.open("/portal/monitor-center/device.jsp?devid=" + ele.deviceid + "&webset=" + webset + "&odevname=" + ele.name +"&oip=" + ele.loopaddress,"_blank");
                }
                var inXdev;
               
                if(devI) {
                    orderRelNodes = orderRelNodes ? orderNodes(devI, orderRelNodes, data.Lines) : devI;
                    set = drawBezierNodes(topoDom, {
                        nodeType: "I",
                        cx: 0,
                        cy: y,
                        width:45,
                        height:35,
                        dbclick: devdbClick,
                        textAttr: {
                                "v-align":"bottom",
                                "fill":"#fff"
                            },
                        nodeDatas: orderRelNodes
                    });
                    y = set.getBBox().y2 + 360;
                    ibox = set.getBBox();
                }

                
                if(devCloud) {
                    orderRelNodes =  orderCloudNodes(devCloud);

                    var lineDBClick = function(ele) {
                        
                        if(endname.indexOf("POP") == -1) {
                            return;
                        }

                        $("#prov-detail-cloud-third").show();
                        var protopo = new getProvinceCloudTopoThird("prov-detail-cloud-topo-third", name, webset,endname+"--"+ ele.name);
                        
                        for(var i = 0; i < orderRelNodes.length; i ++) {
                            if(ele.name == orderRelNodes[i].name) {
                                protopo.loadTopo(orderRelNodes[i].topo);
                                break;
                            }
                        }
                   
                        
                    }

                    set = drawBezierNodes(topoDom, {
                        direct : 1,
                        nodeType: "cloud",
                        cx: 0,
                        cy: y,
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
                    y = set.getBBox().y2 + 360;
                    // xbox = set.getBBox();
                }

                
               

                


                
                topo.autoSet();

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
                    hoverText.push("MAX利用率(入):" + line.maxin + "%");
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

           
            var drawText = function(txt) {
                $("#pro-detail-font-2").html(txt);
            }
            drawBezier(data);
            
            drawLines(data.Lines);
            
            // drawText("全球--" + name + "--" + endname);
        }
        proTopo.loadTopo = function() {
            _topo.showLoading();
            $("#pro-detail-font-2").html("全球--" + name + "--" + endname);
            var url= "/report-service/service.jsp?pageModule=topo_gj_dev_cloud&params="+webset+"&params="+name+"&params="+endname;
            
            $.ajax({
                url: url,
                // data: {
                //     params: [_webset,_name]
                // },
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if(data.result) {
                        var _result = data.result;
                //         _result = {"NODES": [{"name": "美洲区POP点"},{ "name": "美洲区客户" },{"name": "美洲区运营商"}, {"name": "亚太区POP点"}],
                // "DEVS": [{"loopaddress": "202.97.32.62","node": "北京市","name": "BJ-BJ-DS-X-3.163","deviceid": "DEV002a0","alarmlevel": 1},
                // {"loopaddress": "202.97.32.63","node": "北京市","name": "BJ-BJ-DS-X-4.163","deviceid": "DEV002a1","alarmlevel": 1},
                // {"loopaddress": "202.97.32.28","node": "上海市","name": "SH-SH-HB-X-3.163","deviceid": "DEV02175","alarmlevel": 1},
                // {"loopaddress": "202.97.32.29","node": "上海市","name": "SH-SH-HB-X-4.163","deviceid": "DEV02176","alarmlevel": 1},
                // {"loopaddress": "202.97.32.55","node": "广州","name": "GD-GZ-TT-X-3.163","deviceid": "DEV02177","alarmlevel": 1},
                // {"loopaddress": "202.97.32.51","node": "广州","name": "GD-GZ-TT-X-4.163","deviceid": "DEV02178","alarmlevel": 1}],
                // "Lines" : [{ "adev": "美洲区POP点", "alarmpropotion":"0/64","dbwinfo":"45*10G+2*1G+17*2.5G=494.5","congestpropotion":"37/64","alarmlevel": 0,"bdev": "BJ-BJ-DS-X-3.163"},
                // { "adev": "美洲区客户", "alarmpropotion":"0/64","dbwinfo":"45*10G+2*1G+17*2.5G=494.5","congestpropotion":"37/64","alarmlevel": 0,"bdev": "GD-GZ-TT-X-3.163"}]
                // };
                        drawGraph(_result);
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