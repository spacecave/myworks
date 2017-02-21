(function(R) {

    'use strict';

    function getDomOffset(dom) {
        if (!dom) {
            return;
        }
        if (!dom.getClientRects().length) {
            return {
                top: 0,
                left: 0
            };
        }
        var rect = dom.getBoundingClientRect();
        if (rect.width || rect.height) {
            var doc = dom.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + window.pageYOffset - docElem.clientTop,
                left: rect.left + window.pageXOffset - docElem.clientLeft
            };
        }
        return rect;
    }

    function addEventListener(ele, eventname, fn) {
        if (ele.addEventListener) {
            ele.addEventListener(eventname, fn, false);
        } else {
            ele.attachEvent("on" + eventname, fn);
        }
    }

    function deleteEventListener(ele, eventname) {
        if (ele.removeEventListener) {
            ele.removeEventListener(eventname);
        } else {
            ele.detachEvent("on" + eventname);
        }
    }

    function getEvent(e) {
        var evt = window.event ? window.event : e;
        if (!evt.stopPropagation) {
            evt.stopPropagation = function() {
                evt.cancelBubble = false;
            }
        }
        if (!evt.preventDefault) {
            evt.preventDefault = function() {
                evt.returnValue = false;
            }
        }
        if (!evt.target) {
            evt.target = evt.srcElement;
        }
        // if (!evt.which) {
        //     e.which = e.button;
        // }
        return evt;
    }

    function clearSelection() {
        /*if (window.getSelection) {
            if (window.getSelection().empty) {
                // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            // IE?
            document.selection.empty();
        }*/
    }

    function getPolarCoord(paper) {
        var polarCoord = {
            minx: Number.MAX_VALUE,
            miny: Number.MAX_VALUE,
            maxx: Number.MIN_VALUE,
            maxy: Number.MIN_VALUE
        };
        
        var t1 = new Date().getTime();
        var count = 0;
        paper.forEach(function(el) {
        
//        	count ++;
            var bBox = el.getBBox();
            polarCoord.minx = polarCoord.minx < bBox.x ? polarCoord.minx : bBox.x;
            polarCoord.miny = polarCoord.miny < bBox.y ? polarCoord.miny : bBox.y;
            polarCoord.maxx = polarCoord.maxx > bBox.x2 ? polarCoord.maxx : bBox.x2;
            polarCoord.maxy = polarCoord.maxy > bBox.y2 ? polarCoord.maxy : bBox.y2;
        });
        console.log('数目:' +count);
        var t2 = new Date().getTime();
        console.log('运行时间:' + (t2 - t1));
        
        return polarCoord;
    }

    /**
     * 自适应画布
     **/
    R.fn.autoFit = function() {
        var _this = this;

        var width = _this.canvas.parentNode.clientWidth,
            height = _this.canvas.parentNode.clientHeight;
        _this.setSize(width, height);

        var polarCoord = getPolarCoord(_this);
        var xZoom = width / (polarCoord.maxx - polarCoord.minx),
            yZoom = height / (polarCoord.maxy - polarCoord.miny),
            zoom = xZoom < yZoom ? xZoom : yZoom;
        zoom = zoom * 0.96;
        _this.zoom = zoom;
        var cx = polarCoord.minx / 2 + polarCoord.maxx / 2,
            cy = polarCoord.miny / 2 + polarCoord.maxy / 2;
        _this.setViewBox(cx - width  / zoom / 2, cy - height / zoom / 2, width/zoom , height / zoom);
        
//        _this.setViewBox(cx - width / zoom / 2 + 340, cy - height / zoom / 2, width / zoom, height / zoom);
        return _this;
    };

    /**
     * 滚轮放大缩小
     **/
    R.fn.wheelable = function() {
        var _this = this;
        var _domLeft = getDomOffset(_this.canvas.parentNode).left,
            _domTop = getDomOffset(_this.canvas.parentNode).top;

        addEventListener(_this.canvas, 'mousewheel', function(e) {
            var evt = getEvent(e),
                viewbox = _this._viewBox,
                delta = evt.wheelDelta ? (evt.wheelDelta / 120) : (-evt.detail / 3),
                zoom = _this.zoom * (1 + delta * 0.1);

            _this.setViewBox(viewbox[0] + (evt.clientX - _domLeft) * (1 / _this.zoom - 1 / zoom), viewbox[1] + (evt.clientY - _domTop) * (1 / _this.zoom - 1 / zoom), _this.width / zoom, _this.height / zoom);
//            _this.setViewBox(viewbox[0] + _domLeft* (1 / _this.zoom - 1 / zoom), viewbox[1] + _domTop * (1 / _this.zoom - 1 / zoom), _this.width / zoom, _this.height / zoom);
            _this.zoom = zoom;

            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
        return _this;
    };

    /**
     * 画布拖动
     **/
    R.fn.dragable = function() {
        var _this = this;
        var dragging = false,
            timestamp, lx, ly;
        addEventListener(_this.canvas, 'mousedown', function(e) {
            var evt = getEvent(e);
            clearSelection();
            //  && evt.target == _this.canvas
            if (e.which == 1) {
                dragging = true;
                timestamp = new Date().getTime();
                lx = evt.clientX;
                ly = evt.clientY;
            }
        });

        addEventListener(_this.canvas, 'mousemove', function(e) {
            clearSelection();
            var now = new Date().getTime();
            if (dragging && now - timestamp > 10) {
                var evt = getEvent(e),
                    viewbox = _this._viewBox;
                _this.setViewBox(viewbox[0] + (lx - evt.clientX) / _this.zoom, viewbox[1] + (ly - evt.clientY) / _this.zoom, viewbox[2], viewbox[3]);
                lx = evt.clientX;
                ly = evt.clientY;
                timestamp = new Date().getTime();
            }
        });

        addEventListener(_this.canvas, 'mouseup', function(e) {
            var evt = getEvent(e);
            clearSelection();
            dragging = false;
        });

        return _this;
    };

    /**
     * 箭头连线
     **/
    R.fn.lineWithArrow = function(x1, y1, x2, y2, w, aw, aa) {

        var _this = this;
        var sina = (y2 - y1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)),
            cosa = (x2 - x1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)),
            maa = aa / 180 * Math.PI,
            sinb = Math.sin(maa / 2),
            cosb = Math.cos(maa / 2),
            tanb = Math.tan(maa / 2),
            bw = aw / 2 / tanb;
        var p1 = {
                x: x1 - w / 2 * sina,
                y: y1 + w / 2 * cosa
            },
            p2 = {
                x: x1 + w / 2 * sina,
                y: y1 - w / 2 * cosa
            },
            p3 = {
                x: x2 - cosa * bw,
                y: y2 - sina * bw,
            },
            p4 = {
                x: p3.x + w / 2 * sina,
                y: p3.y - w / 2 * cosa
            },
            p5 = {
                x: p3.x + aw / 2 * sina,
                y: p3.y - aw / 2 * cosa
            },
            p6 = {
                x: p3.x - aw / 2 * sina,
                y: p3.y + aw / 2 * cosa
            },
            p7 = {
                x: p3.x - w / 2 * sina,
                y: p3.y + w / 2 * cosa
            };
        return _this.path('M' + p1.x + ',' + p1.y + 'L' + p2.x + ',' + p2.y + 'L' + p4.x + ',' + p4.y + 'L' + p5.x + ',' + p5.y + 'L' + x2 + ',' + y2 + 'L' + p6.x + ',' + p6.y + 'L' + p7.x + ',' + p7.y + 'z');
    };

})(Raphael);
