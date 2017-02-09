(function(global){
	(!Raphael.fn.lines) && (Raphael.fn.lines=function(sNode,eNode,lines){
		var paper = this,
			sNodeBBox = sNode.getBBox(),
			eNodeBBox = eNode.getBBox(),
			sNodeCx = (sNodeBBox.x+sNodeBBox.x2)/2,
			sNodeCy = (sNodeBBox.y+sNodeBBox.y2)/2,
			eNodeCx = (eNodeBBox.x+eNodeBBox.x2)/2,
			eNodeCy = (eNodeBBox.y+eNodeBBox.y2)/2,
			pLenSpan = 50,
			color = "#06A2A1",
			linePaths = [];

		if(lines == null || lines.length == 0) {
			var temline,temlen,mid1,mid2;
		    	
		    temline = paper.path(["M",sNodeCx,sNodeCy,"L",eNodeCx,eNodeCy]);
		    temlen = temline.getTotalLength();
		    mid1 = temline.getPointAtLength(temlen/4);
		    mid2 = temline.getPointAtLength(temlen*3/4);
		    	
		    temline.remove();
		    var line = paper.path(["M",sNodeCx.toFixed(3), sNodeCy.toFixed(3), "C",mid1.x.toFixed(3),mid1.y.toFixed(3),mid2.x.toFixed(3),mid2.y.toFixed(3),eNodeCx.toFixed(3),eNodeCy.toFixed(3)].join(","));
		    line.attr({stroke:color,"stroke-width":2,"stroke-opacity":0.6,"cursor":"pointer"}).toBack();
			line.glow({width:3,opacity:0.2,color:"#fff"});
			line.cir = lines;
			linePaths.push(line);
		}else {
			for(var i=0,len=lines.length;i<len;i++){
				var p = 0;
				if(len%2==0){
					if(i%2==0){
						p = -pLenSpan*(i/2+1);
					}else{
						p = pLenSpan*(Math.floor(i/2)+1);
					}
				}else{
					if(i==0){
						p = 0;
					}else if(i%2==0){
						p = pLenSpan*(i/2);;
					}else {
						p = -pLenSpan*(Math.ceil(i/2));
					}
				}
				var temline,temlen,mid1,mid2;
		    	if(Math.abs(sNodeCx-eNodeCx)>Math.abs(sNodeCy-eNodeCy)){
		    	   temline = paper.path(["M",sNodeCx,sNodeCy+p,"L",eNodeCx,eNodeCy+p]);
		    	   temlen = temline.getTotalLength();
		    	   mid1 = temline.getPointAtLength(temlen/4);
		    	   mid2 = temline.getPointAtLength(temlen*3/4);
		    	}else{
		    	   temline = paper.path(["M",sNodeCx+p,sNodeCy,"L",eNodeCx+p,eNodeCy]);
		    	   temlen = temline.getTotalLength();
		    	   mid1 = temline.getPointAtLength(temlen/4);
		    	   mid2 = temline.getPointAtLength(temlen*3/4);
		    	}
		    	temline.remove();
		    	var y1 = Number(sNodeCy.toFixed(3))+i*10;
		    	var y2 = Number(eNodeCy.toFixed(3))+i*10;
		    	var line = paper.path(["M",sNodeCx.toFixed(3), y1, "L",eNodeCx.toFixed(3),y2].join(","));
		    	line.attr({stroke:color,"stroke-width":2,"stroke-opacity":0.6,"cursor":"pointer"}).toBack();
				line.glow({width:3,opacity:0.2,color:"#fff"});
				line.cir = lines[i];
				linePaths.push(line);
			}
		}
		
		return linePaths;
    });
})(window);