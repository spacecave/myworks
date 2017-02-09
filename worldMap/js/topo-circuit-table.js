(function(win) {

    var cirViewUrl = "/portal/monitor-center/circuit.html";
    var _domID = "";

    win.CircuitTable = function(domID,webset){
        var table = this;
        _domID = domID;
        table.init = function(){
            $("#"+_domID).datagrid("loadData",[]);
        };
        table.loadData = function(datas, flag){
            $("#"+_domID).datagrid("loading");
            if(typeof datas == "string"){
                $.ajax({
                    url:datas,
                    // url: "/report-service/service.jsp?pageModule=topo_alarm_cir&params=163&params=广州&params=圣何塞",
                    
                    cache:false,
                    dataType:'json',
                    success:function(data){
                        if(data.result) {
                            $("#"+_domID).datagrid("loaded");
                            var tableData = {
                                rows:new Array()
                            };
                            var _arr;
                            if(flag && flag == "CC") {
                                _arr = data.result.CC.LINES;
                            }else if(flag && flag == "XX") {
                                _arr = data.result.XX.LINES;
                            }else {
                                _arr = data.result.LINES;
                            }
                            for(var i=0,len=_arr.length;i<len;i++){
                                var row = _arr[i];
                                row.option = "<a target='_blank' style='color:#fff' href='"+cirViewUrl+"?webset="+webset+"&circuitid="+row.cirid+"'>电路视图</a>"
                                tableData.rows.push(row);
                            }
                            $("#"+_domID).datagrid("loadData",tableData);
                        }
                        
                    }
                });
            }else if(typeof datas == "object"){
                $("#"+_domID).datagrid("loaded");
                var tableData = {
                    rows:new Array()
                };
                for(var i=0,len=datas.length;i<len;i++){
                    var row = datas[i];
                    row.option = "<a target='_blank' style='color:#fff' href='"+cirViewUrl+"?webset="+webset+"&circuitid="+row.cirid+"'>电路视图</a>"
                    tableData.rows.push(row);
                }
                $("#"+_domID).datagrid("loadData",tableData);
            }
            
        };
        table.resize = function(width,height){
            $("#"+_domID).datagrid("resize",{
                width:width,
                height:height
            });
        };
    };
})(window);