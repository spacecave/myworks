/**
 * @description 获取图上所有点的坐标
 * @author 张鑫
 */
(function(win){
    /**
     * @param  {string} name 当前节点名字
     * @return {object}
     */
    win.getNodePosition = function(name){
        var x = 0,
            y = 0;
        if(name == "北京市") {
            x = 518;
            y = 224;
        }else if(name == "上海市") {
            x = 532;//530
            y = 276;//320
        }else if(name == "香港") {
            x = 510;//510
            y = 308;//370
        }else if(name == "广州") {
            x = 496;//495
            y = 305;//355
        }else if(name == "新加坡") {
            x = 453;
            y = 425;
        }else if(name == "法兰克福") {
            x = 102;
            y = 197;
        }else if(name == "伦敦") {
            x = 60;
            y = 157;
        }else if(name == "圣何塞") {
            x = 978;
            y = 227;
        }else if(name == "洛杉矶") {
            x = 1001;
            y = 261;
        }else if(name == "约翰内斯堡") {
            x = 160;
            y = 580;
        }else if(name == "内罗毕") {
            x = 210;
            y = 435;
        }else if(name == "开罗") {
            x = 196;
            y = 280;
        }else if(name == "莫斯科") {
            x = 245;
            y = 109;
        }else if(name == "伊斯坦布尔") {
            x = 172;
            y = 217;
        }else if(name == "巴黎") {
            x = 79;
            y = 187;
        }else if(name == "迪拜") {
            x = 279;
            y = 306;
        }else if(name == "斯德哥尔摩") {
            x = 136;
            y = 124;
        }else if(name == "东京") {
            x = 604;
            y = 250;
        }else if(name == "胡志明市") {
            x = 480;
            y = 373;
        }else if(name == "新德里") {
            x = 368;
            y = 295;
        }else if(name == "孟买") {
            x = 344;
            y = 318;
        }else if(name == "河内") {
            x = 470;
            y = 327;
        }else if(name == "首尔") {
            x = 557;
            y = 242;
        }else if(name == "悉尼") {
            x = 650;
            y = 580;
        }else if(name == "珀斯") {
            x = 515;
            y = 580;
        }else if(name == "暖武里") {
            x = 455;
            y = 359;
        }else if(name == "唐格朗") {
            x = 481;
            y = 464;
        }else if(name == "雅加达") {
            x = 488;
            y = 466;
        }else if(name == "曼谷") {
            x = 450;
            y = 356;
        }else if(name == "吉隆坡") {
            x = 457;
            y = 409;
        }else if(name == "华盛顿") {
            x = 1140;
            y = 253;
        }else if(name == "多伦多") {
            x = 1142;
            y = 207;
        }else if(name == "迈阿密") {
            x = 1132;
            y = 295;
        }else if(name == "纽约") {
            x = 1162;
            y = 219;
        }else if(name == "西雅图") {
            x = 979;
            y = 191;
        }else if(name == "帕洛阿尔托") {
            x = 987;
            y = 247;
        }else if(name == "芝加哥") {
            x = 1104;
            y = 215;
        }else if(name == "达拉斯") {
            x = 1074;
            y = 265;
        }else if(name == "圣保罗") {
            x = 1269;
            y = 545;
        }else if(name == "阿姆斯特丹") {
            x = 97;
            y = 164;
        }

        return {
            x : x,
            y : y
        }
    };
})(window);