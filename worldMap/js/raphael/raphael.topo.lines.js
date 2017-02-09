!function (global) {
    if(global.RTopo){
        global.RTopo.prototype.lines = function(options){
            var _rTopo = this,
                _paper = _rTopo.paper;

            var _sNode = options.snode,
                _eNode = options.enode,
                _lines = options.lines,
                _span = options.span?options.span:30,
                _click = options.click,
                _dbclick = options.dbclick,
                _lineWidth = options.linewidth,
                _color = options.color,
                _text = options.text;
                _index = options.index;
                _lineAttr = options.lineattr?options.lineattr:{
                    "stroke":"#33cc33",
                    "stroke-width":3,
                    "stroke-opacity":1,
                    "cursor":"pointer"
                };

            if(typeof _sNode == "string"){
                _sNode = _paper.getById(_sNode);
            }
            if(typeof _eNode == "string"){
                _eNode = _paper.getById(_eNode);
            }
            var _sNodeCx = _sNode.attrs.cx;
                _sNodeCy = _sNode.attrs.cy;
                _eNodeCx = _eNode.attrs.cx;
                _eNodeCy = _eNode.attrs.cy;
            if(!_lines) {
                var cx = (_sNodeCx + _eNodeCx)/2,
                    cy = (_sNodeCy + _eNodeCy)/2;
                    cx1 = (_sNodeCx + _eNodeCx*3)/4,
                    cy1 = (_sNodeCx + _eNodeCx*3)/4,
                    p = _span;
                var sin = (_eNodeCy-_sNodeCy)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy)),
                    cos = (_eNodeCx-_sNodeCx)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy));

                var tempPos = {
                    x:cx + p*sin,
                    y:cy - p*cos
                };
                var tempPos1 = {
                    x:cx1 + p*sin,
                    y:cy1 - p*cos
                };
                var line = _paper.path(["M",_sNodeCx.toFixed(3), _sNodeCy.toFixed(3), "C",tempPos.x.toFixed(3),tempPos.y.toFixed(3),tempPos.x.toFixed(3),tempPos.y.toFixed(3),_eNodeCx.toFixed(3),_eNodeCy.toFixed(3)].join(","));
                line.attr(_lineAttr).toBack();
                if(_lineWidth){
                    line.attr("stroke-width",_lineWidth);
                }else{
                    if(_lines&&1<_lines.length){
                        line.attr("stroke-width",3);
                    }
                }
                if(_color&&""!=_color){
                    line.attr("stroke",_color);
                  
                }
                line.param = {
                    lines:_lines,
                    snode:_sNode,
                    enode:_eNode
                };

                line.snode = _sNode;
                line.enode = _eNode;
                var sNodeLines = _sNode.lines;
                if(!sNodeLines){
                    sNodeLines = new Array();
                    _sNode.lines = sNodeLines;
                }
                sNodeLines.push(line);
                var eNodeLines = _eNode.lines;
                if(!eNodeLines){
                    eNodeLines = new Array();
                    _eNode.lines = eNodeLines;
                }
                eNodeLines.push(line);

                if(_dbclick){
                    line.dblclick(function(){
                        _dbclick(this.param);
                    });
                }
                if(_text){
                    _rTopo.tooltip(
                        line,
                        _text
                    );
                }
                line.hover(function(){
                    var _line = this;
                    var lineWidth = _line.attrs["stroke-width"];
                    _line.attr("stroke-width",lineWidth*2);
                },function(){
                    var _line = this;
                    var lineWidth = _line.attrs["stroke-width"];
                    _line.attr("stroke-width",lineWidth/2);
                });
                line.toFront()
                return line;
            }else {
                 for(var i=0,len=_lines.length;i<len;i++){
                    var _line = _lines[i];
                    var p = 0;
                    if(len%2==0){
                        if(i%2==0){
                            p = -_span*(i/2+1);
                        }else{
                            p = _span*(Math.floor(i/2)+1);
                        }
                    }else{
                        if(i==0){
                            p = 0;
                        }else if(i%2==0){
                            p = _span*(i/2);;
                        }else {
                            p = -_span*(Math.ceil(i/2));
                        }
                    }

                    var cx = (_sNodeCx + _eNodeCx)/2,
                        cy = (_sNodeCy + _eNodeCy)/2;

                    var sin = (_eNodeCy-_sNodeCy)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy)),
                        cos = (_eNodeCx-_sNodeCx)/Math.sqrt((_eNodeCx-_sNodeCx)*(_eNodeCx-_sNodeCx)+(_eNodeCy-_sNodeCy)*(_eNodeCy-_sNodeCy));

                    var tempPos = {
                        x:cx + p*sin,
                        y:cy - p*cos
                    };

                    var line = _paper.path(["M",_sNodeCx.toFixed(3), _sNodeCy.toFixed(3), "C",tempPos.x.toFixed(3),tempPos.y.toFixed(3),tempPos.x.toFixed(3),tempPos.y.toFixed(3),_eNodeCx.toFixed(3),_eNodeCy.toFixed(3)].join(","));
                    line.attr(_lineAttr).toBack();
                    if(_line.color&&""!=_line.color){
                        line.attr("stroke",_line.color);
                    }
                    line.param = _line;
                    if(_click){
                        line.click(function(){
                            _click(this.param)
                        });
                    }
                    if(_dbclick){
                        line.dblclick(function(){
                            _dbclick(this.param);
                        });
                    }
                    if(_line.hovertext){
                        _rTopo.tooltip(
                            line,
                            _line.hovertext
                        );
                    }
                    line.hover(function(){
                        var _line = this;
                        var lineWidth = _line.attrs["stroke-width"];
                        _line.attr("stroke-width",lineWidth*2);
                    },function(){
                        var _line = this;
                        var lineWidth = _line.attrs["stroke-width"];
                        _line.attr("stroke-width",lineWidth/2);
                    });
                };
            }

           
        };
    }
}(window);