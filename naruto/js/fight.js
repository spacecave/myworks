;(function() {
    'use strict';

    var loc_level = {
        '0':'',//最差的那种，运气好能打掉对面一个忍者,极好能打掉2个，根本不能打掉3个
        '1':'',//一般，运气好能够赢一场，但是第二场基本就是送
        '2':'',//一般，能赢一场，第二场也勉强能打掉对面一个
        '3':'',//偏上，能赢一场，第二场勉强能赢
        '4':'',//普通人眼中的高手，基本能赢2场，第三场差不多
        '5':''//大神，很大几率能赢3场
        'MAX':''//顶尖，稳赢3场，不管对谁
    }

    function Player(opts) {
        this.name = opts.name;//玩家名称
        this.wincounts = opts.wincounts || 2;//玩家可以胜场的次数      
        this.level = opts.level;//玩家等级
        this.ngcounts = 3;//当前忍者数目
        this.status = 0;//玩家当前状态
    }

    Player.prototype.setStatus = function(state) {
        this.status = state;
    }

})();