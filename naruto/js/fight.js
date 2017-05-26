;(function() {
    'use strict';

    //概率计算方式，50 +（levelA - levelB）* 10 + 10 *Math.random(-1,1) - 15*Math.random(0,1)*击败忍者数目
    //时间计算方式 fight_time + (levelA - levelB) * 10

    var all_star = [
        {'name': '恭祝大家', 'level': 10, 'wincounts': 3, 'loc': 'A'},
        {'name': '阖家安康', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '我是您粉丝啊', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '万事如意', 'level': 5, 'wincounts': 3, 'loc': 'A'},
        {'name': '廉老哥', 'level': 5, 'wincounts': 3, 'loc': 'A'},
        {'name': '武藤花满兰', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '二师兄', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '早乙女露依', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '巴拉拉魔法', 'level': 5, 'wincounts': 3, 'loc': 'A'},
        {'name': '威尔史密斯', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '大师兄', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '三太子', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '伊藤诚', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '库丘林', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '帅的罚款', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '琅琊王', 'level': 1, 'loc': 'A'},
        {'name': '最后的轻语', 'level': 3, 'loc': 'A'},
        {'name': '梦、楠', 'level': 3, 'loc': 'A'},
        {'name': '习大大', 'level': 3, 'loc': 'A'},
        {'name': '七爷', 'level': 3, 'loc': 'A'},
        {'name': '伊佐治胜美', 'level': 4, 'wincounts': 3, 'loc': 'A'},
        {'name': '灵动', 'level': 3, 'loc': 'A'},
        {'name': '最后的微笑', 'level': 2, 'loc': 'A'},
        {'name': '黄家驹', 'level': 1, 'loc': 'A'},
        {'name': '鼬神', 'level': 1, 'loc': 'A'},
        {'name': '明哥', 'level': 2, 'loc': 'A'},
        {'name': '托尼克乔巴', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '就问你怕不怕', 'level': 5, 'wincounts': 3, 'loc': 'A'},
        {'name': '路飞船长', 'level': 3, 'wincounts': 3, 'loc': 'A'},
        {'name': '三师弟', 'level': 2, 'loc': 'A'}
    ],
    aoi_sola = [];

    //出战顺序
    var _acount = 4,
        _bcount = 4;

    //排序order值
    var loc_a_area = 60,
        loc_b_area = 60;



    var loc_level = {
        0:'',//最差的那种，运气好能打掉对面一个忍者,极好能打掉2个，根本不能打掉3个
        1:'',//一般，运气好能够赢一场，但是第二场基本就是送
        2:'',//一般，能赢一场，第二场也勉强能打掉对面一个
        3:'',//偏上，能赢一场，第二场勉强能赢
        4:'',//普通人眼中的高手，基本能赢2场，第三场差不多
        5:'',//大神，很大几率能赢3场
        10:''//顶尖，稳赢3场，不管对谁
    }

    var fight_time = 60;//60秒

    var fight_ms = 10;//换算倍数

    function Player(opts) {
        this.loc = opts.loc;//阵营
        this.name = opts.name;//玩家名称
        this.wincounts = opts.wincounts || 2;//玩家可以胜场的次数      
        this.level = opts.level;//玩家等级
        this.ngcounts = 3;//当前忍者数目
        this.winng = 0;//当前忍者的杀敌数目
        this.status = 0;//玩家当前状态
    }

    var getrandom = function() {
        var _judg = Math.random(),
            _c = -1;
        if(_judg > 0.5) {
            _c = 1;
        }
        return _c * _judg;
    }

    function buildEnemy(arr) {
        var _le = [0, 1, 2, 3, 4, 5, 10];
        for(var i = 0; i < 30; i ++) {
            var _obj = {},
                rd = parseInt(Math.random()*(6));
            _obj.name = '天空' + (i + 1) + '号';
            _obj.level = _le[rd];
            _obj.loc = 'B';
            if(getrandom() > 0) {
                _obj.wincounts = 3;
            }
            arr.push(_obj);
        }

    }

    

    function oppose(A, B) {
        //获取—1到1的随机数
        var levelms = A.level - B.level,
            op_time = 0,
            $a_area = $('#players-' + A.name),
            $b_area = $('#players-' + B.name),
            $a_status = $('#p-status-' + A.name),
            $b_status= $('#p-status-' + B.name);

        $a_status.html('战斗中...');
        $b_status.html('战斗中...');
        
        for(var i = 0; i < 5; i ++) {
            var _special = 100 * Math.random(),
                _prob = 50 + levelms * 10 + 10 * getrandom();
                op_time +=  fight_time - levelms * 2 + 3*getrandom();
            if(A.winng > 0) {//当前A忍者连胜
                _prob -= 15 * Math.random() * A.winng;
            }else if(B.winng > 0) {//当前B忍者连胜状态
                _prob -= 15 * Math.random() * B.winng;
            }else {//刚开始
                _prob = 50 + levelms * 10 + 10 * getrandom();
            }
           
            if(_prob > _special) {//A胜
                B.ngcounts --;
                B.winng = 0;
                A.winng ++;
            }else {//B胜
                A.ngcounts --;
                A.winng = 0;
                B.winng ++;
            }

            if(A.ngcounts === 0) {
                B.status ++;
                B.time = op_time;
                console.log(B.name + '(等级：'+B.level+') 击败了 ' + A.name  + '(等级：' + A.level + ') 剩余忍者数目:' + B.ngcounts + '  耗时:' + op_time);
                $('#fight-log').append('<div>' + A.name + '(等级：'+A.level+') LOSS ' + B.name  + '(等级：' + B.level + ')</div><div>  剩余忍者数目:' + B.ngcounts + '  耗时:' + parseInt(op_time) + '</div>');
               
                $a_area.css({'order': loc_a_area -- + ''});
                if(B.status === B.wincounts) {
                    $b_area.css({'order': loc_b_area -- + ''});
                    $b_status.html(B.status + '胜');
                }
                $a_status.html(A.status + '胜');
                return B;
            }else if(B.ngcounts === 0) {
                A.status ++;
                A.time = op_time;
                console.log(A.name + '(等级：'+A.level+') 击败了 ' + B.name  + '(等级：' + B.level + ') 剩余忍者数目:' + A.ngcounts + '  耗时:' + op_time);
                $('#fight-log').append('<div>' + A.name + '(等级：'+A.level+') WIN ' + B.name  + '(等级：' + B.level + ')</div><div>  剩余忍者数目:' + A.ngcounts + '  耗时:' + parseInt(op_time) + '</div>');
                $b_area.css({'order': loc_b_area -- + ''});
                if(A.status === A.wincounts) {
                    $a_area.css({'order': loc_a_area -- + ''});
                    $a_status.html(A.status + '胜');
                }
                $b_status.html(B.status + '胜');
                return A;
            }
        }
        
    }


    function initUI(arr, id) {
        
        var _html = new Array();
        for(var i = 0; i < arr.length; i ++) {
            
            _html.push('<div id="players-'+arr[i].name+'" class="players" style="order:'+i+'">');
            _html.push('<div class="p-left">');
            _html.push('<input type="text" class="p-left-name" value='+arr[i].name+'>');
            _html.push('<span class="p-left-level">战斗力:level'+arr[i].level+'</span>');
            _html.push('</div>');
            _html.push('<div class="p-right">');
            _html.push('<div id="p-status-'+arr[i].name+'" class="p-status">等待中...</div>');
            _html.push('</div>');
            _html.push('</div>');

        }
        $('#' + id).append(_html.join(''));
    }

    

    
    function firstFighter() {
        var _ap1 = new Player(all_star[0]),
            _ap2 = new Player(all_star[1]),
            _ap3 = new Player(all_star[2]),
            _ap4 = new Player(all_star[3]),
            _bp1 = new Player(aoi_sola[0]),
            _bp2 = new Player(aoi_sola[1]),
            _bp3 = new Player(aoi_sola[2]),
            _bp4 = new Player(aoi_sola[3]);

        var _ab1 = oppose(_ap1, _bp1),
            _ab2 = oppose(_ap2, _bp2),
            _ab3 = oppose(_ap3, _bp3),
            _ab4 = oppose(_ap4, _bp4);


        setTimeout(function() {
            fighting(_ab1);
        }, _ab1.time * fight_ms);

        setTimeout(function() {
            fighting(_ab2);
        }, _ab2.time * fight_ms);

        setTimeout(function() {
            fighting(_ab3);
        }, _ab3.time * fight_ms);

        setTimeout(function() {
            fighting(_ab4);
        }, _ab4.time * fight_ms);
    }

    function fighting(_nowobj) {
        if(_bcount === 30 || _acount === 30) {
            return;
        }
        var playera,
            playerb;
        if(_nowobj.loc && _nowobj.loc === 'A') {
            playera = _nowobj;
            if(_nowobj.status === _nowobj.wincounts) {
                _acount ++;
                $('#p-status-' + _nowobj.name).html(_nowobj.status + '胜');
                if(_acount === 30) {
                    return;
                }
                playera = new Player(all_star[_acount]);
            }
            playerb = new Player(aoi_sola[_bcount]);
        }else if(_nowobj.loc && _nowobj.loc === 'B') {
            playerb = _nowobj;
            if(_nowobj.status === _nowobj.wincounts) {
                _bcount ++;
                $('#p-status-' + _nowobj.name).html(_nowobj.status + '胜');
                if(_bcount === 30) {
                    
                    return;
                }
                playerb = new Player(aoi_sola[_bcount]);
            }
            playera = new Player(all_star[_acount]);
        }else {
            playera = new Player(all_star[_acount]);
            playerb = new Player(aoi_sola[_bcount]);
        }
        
        var _outobj = oppose(playera, playerb);

        setTimeout(function() {
        
            if(_outobj.loc === 'A') {
                _bcount ++
            }else {
                _acount ++;
            }
            fighting(_outobj);
        }, _outobj.time * fight_ms);


    }

    function test() {
        var a = function() {
            setTimeout(function() {
                return 'sss';
            }, 5 * 1000);
        }

        var ss = a();
        alert(ss);
    }
    

    
    buildEnemy(aoi_sola);
    initUI(all_star, 'fight-left');
    initUI(aoi_sola, 'fight-right');

    firstFighter();
    
     //begin();
    
    //test();

})();