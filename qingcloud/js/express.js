;(function() {
    
    var $items = $('.nav-items'),
        $list = $('.items');

    $items.hover(function(e) {
        var _name = $(this).find('a').html(),
            flag = true,
            _html = [],
            _left;
        
        switch(_name) {
            case '产品':
                _left = '10px';
                _html = [
                            '<li><a href="/products/computing" data-permalink="">计算</a></li>',
                            '<li><a href="/products/network" data-permalink="">网络 1.0</a></li>',
                            '<li><a href="/products/vpc" data-permalink="">网络 2.0</a></li>',
                            '<li><a href="/products/storage" data-permalink="">存储</a></li>',
                            '<li><a href="/products/database_cache" data-permalink="">数据库与缓存</a></li>',
                            '<li><a href="/products/big_data_platform" data-permalink="">大数据平台</a></li>',
                            '<li><a href="/products/security" data-permalink="">安全</a></li>',
                            '<li><a href="/products/management" data-permalink="">部署与管理</a></li>',
                            '<li><a href="/products/api" data-permalink="">开放 API</a></li>',
                            '<li><a href="http://status.qingcloud.com" target="_blank">服务健康状态监控</a></li>'
                        ]
                break;
            
            case '客户案例':
                _left = '165px';
                _html = [
                            '<li><a href="/customers/finance" data-permalink="">互联网金融</a></li>',
                            '<li><a href="/customers/education" data-permalink="">在线教育</a></li>',
                            '<li><a href="/customers/video" data-permalink="">视频</a></li>',
                            '<li><a href="/customers/game" data-permalink="">游戏</a></li>',
                            '<li><a href="/customers/e_commerce" data-permalink="">电商</a></li>',
                            '<li><a href="/customers/platform" data-permalink="">平台</a></li>',
                            '<li><a href="/customers/devops" data-permalink="">DevOps</a></li>',
                            '<li><a href="/customers/big_data" data-permalink="">大数据</a></li>',
                            '<li><a href="/customers/web" data-permalink="">门户</a></li>',
                            '<li><a href="/customers/mobile" data-permalink="">移动 APP</a></li>'
                        ];
                break;
            case '价格':
                _left = '247px';
                _html = [
                            '<li><a href="/pricing/plan" data-permalink="">资源价格</a></li>',
                            '<li><a href="/pricing/billing" data-permalink="">按秒计费</a></li>',
                            '<li><a href="/pricing/reservation" data-permalink="">预留实例</a></li>'
                        ];
                break;
            
            case '文档':
                _left = '482px';
                _html = [
                            '<li><a href="https://docs.qingcloud.com/guide/index.html" target="_blank">用户指南</a></li>',
                            '<li><a href="https://docs.qingcloud.com/faq/index.html" target="_blank">常见问题</a></li>',
                            '<li><a href="https://docs.qingcloud.com/api/index.html" target="_blank">API 文档</a></li>',
                            '<li><a href="https://docs.qingcloud.com/cli/index.html" target="_blank">CLI 文档</a></li>',
                            '<li><a href="https://docs.qingcloud.com/sdk/index.html" target="_blank">SDK 文档</a></li>'
                        ];
                break;
            case '关于':
                _left = '539px';
                _html = [
                            '<li><a href="/about/blog" data-permalink="">青云志</a></li>',
                            '<li><a href="https://www.qingcloud.com/promotion/startups">创业扶持</a></li>',
                            '<li><a href="/about/nonprofits" data-permalink="">公益支持</a></li>',
                            '<li><a href="https://community.qingcloud.com" target="_blank">青云社区</a></li>',
                            '<li><a href="/about/news" data-permalink="">企业动态</a></li>',
                            '<li><a href="/about/media" data-permalink="">媒体报道</a></li>',
                            '<li><a href="/about/join_us" data-permalink="">加入我们</a></li>',
                            '<li><a href="/about/contact_us" data-permalink="">联系我们</a></li>',
                            '<li><a href="/about/tos" data-permalink="">服务条款</a></li>'
                        ];
                break;
            default:
                flag = false;
        }
        if(flag) {
            $list.css('left',_left);
            $list.html('');
            $list.append(_html.join(''));
            $list.show();
        }
       
    }, function() {
        $list.hide();
    });
   
    $list.hover(function() {
        $(this).show();
    })
})();