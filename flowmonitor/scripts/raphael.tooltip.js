(function(R) {

    'use strict';

    function create(hoverText) {
        var tip = document.createElement('div');
        tip.className = 'rgraph-tooltip';
        var styles = ['position:fixed',
            'display:none',
            'padding:10px 6px',
            'top:0',
            'left:0',
            'z-index:9999',
            'color:#fff',
            'border-radius:3px',
            'background:rgba(2,2,2,0.8)',
            'font-size:13px',
            'line-height:20px'
        ];
        tip.setAttribute('style', styles.join(';'));
        tip.innerHTML = hoverText;
        document.body.appendChild(tip);
    }

    function repos(e) {

        var tip = document.querySelector('.rgraph-tooltip');
        if (!tip) {
            return;
        }
        var fx = e.clientX ;
        var fy = e.clientY ;
//        if (e.pageX && e.pageY) {
//            fx = e.pageX;
//            fy = e.pageY;
//        } else {
//            fx = e.clientX + document.body.scrollLeft - document.body.clientLeft;
//            fy = e.clientY + document.body.scrollTop - document.body.clientTop;
//        }
        tip.style.display = 'block';
        if ((fx - tip.clientWidth / 2) < 0) {
            tip.style.left = (fx + 20) + 'px';
            tip.style.top = (fy - tip.clientHeight / 2) + 'px';
        } else {
            tip.style.left = (fx - tip.clientWidth / 2) + 'px';
            tip.style.top = (fy - tip.clientHeight - 6) + 'px';
        }
    }

    function remove() {
        var tip = document.querySelector('.rgraph-tooltip');
        if (tip) {
            document.body.removeChild(tip);
        }
    }

    R.el.tooltip = function(hoverText) {
        var _this = this;
        if (hoverText) {
            _this.mouseover(function() {
                create(hoverText);
            });
            _this.mouseout(function() {
                remove();
            });
            _this.mousemove(function(e) {
                repos(e);
            });
        }
        return _this;
    };
    R.st.tooltip = function(hoverText) {
        var _this = this;
        if (hoverText) {
            _this.forEach(function(el) {
                el.tooltip(hoverText);
            });
        }
        return _this;
    };
})(Raphael);
