/**
 * @description 拓扑图绘制类
 * @author 张鑫
 */
(function(win) { 
    /**
     * 构造方法
     * @param {Raphael} world raphael参数
     * @param {string} webset 网络号
     */
    win.DrawTopoAll = function(world, webset){
        var draw = this,
            _webset = webset,
            pointArr = [],//用户保存点的数组
            textArr = [],//保存名称的数组
            pointMap = new Map(),//缓存点的map
            linesArr = [],
            ccArr = [];

        draw.clearLines = function() {
            for(var i = 0, ilen = linesArr.length; i < ilen; i ++) {
                linesArr[i].remove();
                if(linesArr[i].cc) {
                    linesArr[i].cc.remove();
                }
            }
            for(var i = 0, ilen = ccArr.length; i < ilen; i ++) {
                ccArr[i].remove();
            }
            linesArr.length = 0;
            ccArr.length = 0;
        }

        /**
         * 画点方法，增加一个flag用来判断是否是属于洲视图
         * @param {json} data 点json
         * @param {boolean} flag 是否是点进去洲
         */
        draw.addPoint = function(data, flag) {
            var ellipseAttr = {
                fill: "#42516F",
                "fill-opacity": 1,
                "stroke-width": 0,
                "stroke": "#42516F",
                "stroke-opacity":0.4
            };
            var maxAttr = {
                fill: "#12FF00",
                "fill-opacity": 1,
                "stroke-width": 15,
                "stroke": "#A5FF75",
                "stroke-opacity":0.4,
                "cursor": "pointer"
            }
            var minAttr = {
                fill: "#00FDF5",
                "fill-opacity": 1,
                "stroke-width": 0,
                "stroke": "#00FDF5",
                "stroke-opacity":0.4,
                "cursor":"pointer"
            }
            var outAttr = {
                // fill: "#00FDF5",
                "gradient":"r#00FDF5-#fff",
                "stroke-width":"0"
            };
            
            if(!data) {
                return;
            }
            // world.paper.circle(60, 60, 50).attr(outAttr); 
            for(var i = 0, ilen = data.length; i < ilen; i ++) {
                var _p;
                var _objp = new getNodePosition(data[i].name);
                if(_objp.x == 0 && _objp.y == 0) {
                    continue;
                }
                if(data[i].type == "MAX") {
                    _p =  world.paper.circle(_objp.x, _objp.y, 4).attr(maxAttr); 
                    _p.name = data[i].name;
                    _p.xxtype = data[i].type; 
                    if(data[i].name == "阿姆斯特丹") {
                        var _ptext = world.paper.text(_objp.x,_objp.y - 20, data[i].name).attr({
                          
                            fill:"#FDA740",
                            "stroke-width":"0.5",
                            // "stroke":"#fff",
                            "font-size":"8px"
                        });
                    }else if(data[i].name == "法兰克福") {
                        var _ptext = world.paper.text(_objp.x,_objp.y + 10, data[i].name).attr({
                           
                            fill:"#FDA740",
                            "stroke-width":"0.5",
                            // "stroke":"#fff",
                            "font-size":"8px"
                        });
                    }else {
                        var _ptext = world.paper.text(_objp.x,_objp.y - 10, data[i].name).attr({
                          
                            fill:"#FDA740",
                            "stroke-width":"0.5",
                            // "stroke":"#fff",
                            "font-size":"8px"
                        });
                    }            
                    
                    _p.hover(function(){
                        this.animate({transform:['s',2,2]},200);
                       
                        
                    },function(){
                        this.animate({transform:['s',1,1]},300);
                       
                    });
                    _p.dblclick(function() {
                        $("#prov-detail").show();
                        var protopo = new getProvinceTopo("prov-detail-topo", this.name, webset);
                        
                        // $("#pro-win").window("open");
                        protopo.loadTopo();
                        // protopo.autoSet();
                    });
                    alarmAnim(_p);  
                    alarmAnimwidth(_p);          
                } else if(data[i].type == "MIN"){
                    _p =  world.paper.circle(_objp.x, _objp.y, 2).attr(minAttr); 
                    _p.name = data[i].name;
                    _p.xxtype = data[i].type;    
                    _p.hover(function(){
                        this.animate({transform:['s',2,2]},200);
                       
                        
                    },function(){
                        this.animate({transform:['s',1,1]},300);
                       
                    });
                    _p.dblclick(function() {
                        $("#prov-detail").show();
                        var protopo = new getProvinceTopo("prov-detail-topo", this.name, webset);
                        
                        // $("#pro-win").window("open");
                        protopo.loadTopo();
                        // protopo.autoSet();
                    });

                    if(flag) {
                        world.paper.text(_objp.x,_objp.y + 10, data[i].name).attr({                         
                            fill:"#00fff0",
                            "font-size":"7px"
                        });
                    }
                    // alarmAnimMix(_p);
                    
                    var anim = Raphael.animation({
                    fill: "#00FDF5", stroke: "#00FDF5", "stroke-width": 20, "stroke-opacity": 0.5}, 
                    3000);
                    _p.animate(anim.repeat(9e9));

                    world.tooltip(_p, data[i].name);
                   
                }
                var _alarmC = getAlarmColor("DEV",data[i].alarmlevel);
                if(_alarmC) {
                    _p.attr({
                        fill:_alarmC
                    });
                }
                
                pointMap.put(_p.name, _p);
            }
        }

        /**
         * 加线的方法，这里做一下特殊处理，添加一个flag，用来标注是否是点进中国的线       
         * @param {json} data 线的json数据
         * @param {boolean} flag 判断是否是中国
         */
        draw.addLine = function(data, flag) {
            if(!data) {
                return;
            }
            for(var i = 0, ilen = data.length; i < ilen; i ++) {
                if(pointMap.get(data[i].aname) && pointMap.get(data[i].bname)) {
                    var _span = 10;
                    if(data[i].aname == "北京市" && data[i].bname == "伦敦") {
                        _span = -70;
                    }else if(data[i].aname == "北京市" && data[i].bname == "圣何塞") {
                        _span = 40;
                    }else if(data[i].aname == "北京市" && data[i].bname == "洛杉矶") {
                        _span = -70;
                    }else if(data[i].aname == "北京市" && data[i].bname == "上海市") {
                        _span = 20;
                    }else if(data[i].aname == "北京市" && data[i].bname == "广州") {
                        _span = -10;
                    }else if(data[i].aname == "上海市" && data[i].bname == "伦敦") {
                        _span = -70;
                    }else if(data[i].aname == "上海市" && data[i].bname == "圣何塞") {
                        _span = 40;
                    }else if(data[i].aname == "上海市" && data[i].bname == "洛杉矶") {
                        _span = -70;
                    }else if(data[i].aname == "上海市" && data[i].bname == "新加坡") {
                        _span = 40;
                    }else if(data[i].aname == "上海市" && data[i].bname == "东京") {
                        _span = 10;
                    }else if(data[i].aname == "上海市" && data[i].bname == "首尔") {
                        _span = 1;
                    }else if(data[i].aname == "上海市" && data[i].bname == "香港") {
                        _span = 1;
                    }else if(data[i].aname == "上海市" && data[i].bname == "广州") {
                        _span = 1;
                    }else if(data[i].aname == "香港" && data[i].bname == "伦敦") {
                        _span = -70;
                    }else if(data[i].aname == "香港" && data[i].bname == "洛杉矶") {
                        _span = -70;
                    }else if(data[i].aname == "香港" && data[i].bname == "上海市") {
                        _span = -10;
                    }else if(data[i].aname == "北京市" && data[i].bname == "法兰克福") {
                        _span = 70;
                    }else if(data[i].aname == "上海市" && data[i].bname == "法兰克福") {
                        _span = 70;
                    }else if(data[i].aname == "广州" && data[i].bname == "伦敦") {
                        _span = -70;
                    }else if(data[i].aname == "广州" && data[i].bname == "法兰克福") {
                        _span = 70;
                    }else if(data[i].aname == "广州" && data[i].bname == "新加坡") {
                        _span = -10;
                    }else if(data[i].aname == "广州" && data[i].bname == "圣何塞") {
                        _span = 40;
                    }else if(data[i].aname == "广州" && data[i].bname == "洛杉矶") {
                        _span = -100;
                    }else if(data[i].aname == "广州" && data[i].bname == "河内") {
                        _span = -10;
                    }else if(data[i].aname == "北京市" && data[i].bname == "法兰克福") {
                        _span = 70;
                    }else if(data[i].aname == "北京市" && data[i].bname == "香港") {
                        _span = -10;
                    }else if(data[i].aname == "北京市" && data[i].bname == "莫斯科") {
                        _span = -40;
                    }else if((data[i].aname == "广州" && data[i].bname == "香港") || (data[i].aname == "香港" && data[i].bname == "广州")) {
                        _span = -10;
                    }else if((data[i].aname == "伦敦" && data[i].bname == "华盛顿") || (data[i].aname == "华盛顿" && data[i].bname == "伦敦")) {
                        continue;
                    }
                    if(pointMap.get(data[i].aname).type == "ellipse" || pointMap.get(data[i].bname).type == "ellipse") {
                        _span = 10;
                    }

                    var _tootipArr = data[i].aname + "-" + data[i].bname + "<br>"
                                    + "中断电路比例:" + data[i].alarmpropotion + "<br>"
                                    + "拥塞电路比例:" + data[i].congestpropotion + "<br>"
                                    + "总带宽:" + data[i].dbwinfo;
                    var _alarmC = getAlarmColor("CIR",data[i].alarmlevel) ? getAlarmColor("CIR",data[i].alarmlevel) : "#11FF00";
                    
                    var _line = world.lines({
                        snode:pointMap.get(data[i].aname),
                        enode:pointMap.get(data[i].bname),
                        lines:"",
                        index:0,
                        color: _alarmC,
                        linewidth:1.5,
                        span:_span,
                        text:_tootipArr
                    });
                    // _line.glow("fill:#fefefe");
                    _line.adevname = data[i].aname;
                    _line.bdevname = data[i].bname;
                    var cc = world.paper.circle(0,0,3);
                    cc.attr({stroke:"#fff","stroke-opacity":.5,"stroke-width":0,"fill-opacity":1,fill:"#fff"});
                    cc.attr({opacity:1});
                    _line.cc = cc;
                    ccArr.push(cc);
                    addAnim(_line);
                    _line.dblclick(
                        function() {
                            var pageModule = "topo_alarm_cir";
                            if(flag) {
                                pageModule = "topo_alarm_cir_china";
                            }
                            var param = this;
                            var dataUrl = "/report-service/service.jsp?pageModule=" + pageModule;
                            
                            dataUrl = dataUrl + "&params=" + _webset + "&params=" + param.adevname + "&params=" + param.bdevname;
                            var circuitTable = new CircuitTable("phy-cir-table", _webset);
                            $("#phy-cir-window").window("setTitle", param.adevname + " > " + param.bdevname + "电路列表");
                            $("#phy-cir-window").window("open");
                           
                            circuitTable.init();
                            circuitTable.loadData(dataUrl);
                          
                        }
                    );
                    linesArr.push(_line);
                }
            }

        }

        //画国内的3个pop点
        draw.addAreaPoint = function(_name) {
            var ellipseAttr = {
                fill: "#42516F",
                "fill-opacity": 1,
                "stroke-width": 0,
                "stroke": "#42516F",
                "stroke-opacity":0.4
            };
            var data;
            if(_name == "泛欧区") {
                if(webset == "163") {
                    data = [{"name":"广州", "x":-200, "y":125, "type":"ellipse"},
                        {"name":"上海市", "x":-200, "y":195, "type":"ellipse"},
                        {"name":"北京市", "x":-200, "y":265, "type":"ellipse"}];
                }else if(webset == "CN2") {
                    data = [{"name":"广州", "x":-400, "y":175, "type":"ellipse"},
                        {"name":"上海市", "x":-400, "y":245, "type":"ellipse"},
                        {"name":"北京市", "x":-400, "y":315, "type":"ellipse"}];
                }
                
            }else if(_name == "美洲区") {
                if(webset == "163") {
                    data = [{"name":"广州", "x":650, "y":205, "type":"ellipse"},
                        {"name":"上海市", "x":650, "y":275, "type":"ellipse"},
                        {"name":"北京市", "x":650, "y":345, "type":"ellipse"}];
                }else if(webset == "CN2") {
                    data = [{"name":"广州", "x":650, "y":275, "type":"ellipse"},
                        {"name":"上海市", "x":650, "y":205, "type":"ellipse"},
                        {"name":"北京市", "x":650, "y":345, "type":"ellipse"}];
                       
                }
                
            }
            
            for(var i = 0, ilen = data.length; i < ilen; i ++) { 
                if(_name == "泛欧区") {
                    _p =  world.paper.ellipse(data[i].x+ 140, data[i].y - 50,20, 10).attr(ellipseAttr);               
                    var _ptext = world.paper.text(data[i].x + 140,data[i].y - 50, data[i].name).attr({
                  
                        fill:"#ffffff",
                        "font-size":"8px"
                    });     
                }else if(_name == "美洲区") {
                    _p =  world.paper.ellipse(data[i].x+ 220, data[i].y - 50,20, 10).attr(ellipseAttr);               
                    var _ptext = world.paper.text(data[i].x+ 220,data[i].y - 50, data[i].name).attr({
                  
                        fill:"#ffffff",
                        "font-size":"8px"
                    }); 
                }else {
                    _p =  world.paper.ellipse(data[i].x, data[i].y,20, 10).attr(ellipseAttr);               
                    var _ptext = world.paper.text(data[i].x,data[i].y, data[i].name).attr({
                  
                        fill:"#ffffff",
                        "font-size":"8px"
                    });
                }
                
                 _p.name = data[i].name;
                _p.xxtype = data[i].type;             
                textArr.push(_ptext);
                pointMap.put(_p.name, _p);
            }
        }

        //将省外的几个点前置
        draw.tofrontAreaPoint = function() {
            for(var i = 0, arr = pointMap.keySet(), ilen = arr.length; i < ilen; i ++) {
                pointMap.get(arr[i]).toFront();
            }
            for(var i = 0, ilen = textArr.length; i < ilen; i ++) {
                textArr[i].toFront();
            }
        }

        //初始化电路框
        draw.iniCirTable = function() {
            $("#phy-cir-table").datagrid({
                border: false,
                height: 265,
                fitColumns: true,
                striped: true,
                singleSelect: true,
                remoteSort: false,
                columns: [
                    [ {
                        field: 'cirname',
                        title: '电路名称',
                        width: 200,
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            if(null == value) {
                                return this.htmlText = '<font size="3">'+"无"+'</font>';
                            }else {
                                var _sss = value;
                                return this.htmlText = "<font title='"+_sss+"'>"+_sss+"</font>";
                            }
                        }
                    }, {
                        field: 'adevice',
                        title: 'A端设备名称',
                        width: 140,
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            if(null == value) {
                                return this.htmlText = '<font size="3">'+"无"+'</font>';
                            }else {
                                var _sss = value;
                                return this.htmlText = "<font title='"+_sss+"'>"+_sss+"</font>";
                            }
                        }
                    }, {
                        field: 'aport',
                        title: 'A端端口',
                        width: 100,
                        align: 'center',
                        sortable: true
                    }, {
                        field: 'bdevice',
                        title: 'B端设备名称',
                        width: 140,
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            if(null == value) {
                                return this.htmlText = '<font size="3">'+"无"+'</font>';
                            }else {
                                var _sss = value;
                                return this.htmlText = "<font title='"+_sss+"'>"+_sss+"</font>";
                            }
                        }
                    }, {
                        field: 'bport',
                        title: 'B端端口',
                        width: 100,
                        align: 'center',
                        sortable: true
                    }, {
                        field: 'bandwidth',
                        title: '带宽',
                        width: 100,
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                        
                            return value + "Mbps";
                        }
                    },
                    {
                        field: 'option',
                        title: '操作',
                        width: 80,
                        align: 'center',
                        sortable: false
                    } ]
                ],
                loadMsg: "数据加载中...",
                data: {
                    rows: []
                },
                rowStyler: function(index,row){
                    var alarmLevel = 0;
                    if(row.isinterrupt){
                        alarmLevel = 9;
                    }else if(row.iscongestion){
                        alarmLevel = 8;
                    }else if(row.alarmlevel){
                        alarmLevel = row.alarmlevel;
                    }
                    var bgColor = getAlarmColor("CIR", alarmLevel) ? getAlarmColor("CIR", alarmLevel) : "rgba(0,152,71,0.9)";
                    if(bgColor){
                        if("#FF0033"==bgColor){
                            return "background-color:"+bgColor+";color:#fcfcfc;";
                        }else{
                            return "background-color:"+bgColor;
                        }
                    }
                }
            });
            $("#phy-cir-window").window({
                width: 800,
                height: 300,
                collapsible: false,
                minimizable: false,
                maximizable: false,
                shadow: false,
                resizable: true,
                modal: true,
                closed: true,
                onResize: function(width, height) {
                    $("#phy-cir-table").datagrid("resize", {
                        width: width - 12,
                        height: height - 35
                    });
                }
            });
            $("#pro-echarts-win").window({
                width: 1000,
                height: 300,
                collapsible: false,
                minimizable: false,
                maximizable: false,
                shadow: false,
                resizable: true,
                modal: true,
                closed: true,
               
            });
        }
    };

    /**
     * 截取http地址里的属性
     * @param  {string} name [http地址]
     * @return {string}
     */
    win.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值
    }


    //给线上增加沿线滚动的小球方法
    function addAnim(e) {
        var counter = 0;
        var animation = window.setInterval(animate, 30);
        function animate() {
            if(e.getTotalLength() <= counter){   //break as soon as the total length is reached
                clearInterval(animation);
                addAnim(e);
            }
            var pos = e.getPointAtLength(counter);
            if(!pos) {
                return;
            }
            if(!isNaN(pos.x) && !isNaN(pos.y)){
                e.cc.attr({cx: pos.x, cy: pos.y});  //set the circle position   
            }
               
            
            counter ++; // count the step counter one up
        }

    }

    function alarmAnim(el){
        el.animate({"fill-opacity":0.6},1200,'>',function(){
            el.animate({"fill-opacity":1},2500,'<',function(){
               alarmAnim(el);
            });  
        });
    }

    function alarmAnimwidth(el){
        el.animate({"stroke-width":0},1200,'>',function(){
            el.animate({"stroke-width":15},2500,'<',function(){
               alarmAnimwidth(el);
            });  
        });
    }
    function alarmAnimMix(el){
        el.animate({"stroke-width":0},700,'>',function(){
            el.animate({"stroke-width":2},500,'<',function(){
               alarmAnimwidth(el);
            });  
        });
    }
    function getAlarmColor(type, alarmLevel) {
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
        if ("DEV" == type.toUpperCase()) {
            return ALARMCOLOR["DEVALARMLEVEL" + alarmLevel];
        } else if ("CIR" == type.toUpperCase()) {
            return ALARMCOLOR["CIRALARMLEVEL" + alarmLevel];
        }else {
            return false;
        }
    }

    function Map() {
        this.container = new Object();
    }
    Map.prototype.put = function(key, value) {
        this.container[key] = value;
    }

    Map.prototype.get = function(key) {
        return this.container[key];
    }
    Map.prototype.keySet = function() {
        var keyset = new Array();
        var count = 0;
        for ( var key in this.container) {
            if (key == 'extend') {
                continue;
            }
            keyset[count] = key;
            count++;
        }
        return keyset;
    }
    Map.prototype.size = function() {
        var count = 0;
        for ( var key in this.container) {
            if (key == 'extend') {
                continue;
            }
            count++;
        }
        return count;
    }
    Map.prototype.remove = function(key) {
        delete this.container[key];
    }

    Map.prototype.toString = function() {
        var str = "";
        for ( var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
            str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
        }
        return str;
    }
})(window);