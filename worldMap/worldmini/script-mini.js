$(function(){
    var _webset = getUrlParam("webset") ? getUrlParam("webset"):"163";
    var world = worldmap({
        domid: "map-holder",
        name: "世界",
        webset: _webset
    });

    
    
    loadTopo({
        webset: _webset,
        world : world
    });   //加载拓扑图
    
    
});

/**
 * 加载拓扑方法
 * @param  {world:rapheal画图对象,webset:网络号}
 * @return {void}
 */
function loadTopo(opt) {
    var drawtopo = new DrawTopoAll(opt.world, opt.webset);//画图主方法
    drawtopo.iniCirTable();
    $.ajax({
        url: "/report-service/service.jsp?pageModule=topo_gj_node",
        data: {
            params: opt.webset
        },
        cache: false,
        dataType: 'json',
        success: function(data) {
            if(data.result) {
                
                drawtopo.addPoint(data.result.point);
                drawtopo.addLine(data.result.line);
                drawtopo.tofrontAreaPoint();
            }
            
        }
    });
}




