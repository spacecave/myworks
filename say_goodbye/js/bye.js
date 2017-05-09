;(function() {
    if (typeof Object.create !== 'function') {
        Object.create = function(o) {
            function F() {};
            F.prototype = o;
            return new F();
        }
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(s) {
            return this.indexOf(s) == 0;
        }
    }

    if(!Array.prototype.remove) {
        Array.prototype.remove = function(dx) {
            if (isNaN(dx) || dx > this.length) {  
                return false;  
            }  
            for (var i = 0, n = 0; i < this.length; i++) {  
                if (this[i] != this[dx]) {  
                    this[n++] = this[i];  
                }  
            }  
            this.length -= 1;
        }

    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                throw new TypeError(
                    "Function.prototype.bind - what is trying to be bound is not callable"
                );
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(
                        this instanceof fNOP && oThis ? this : oThis || window,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                    );
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    var loc_trees = [
        {'name': '前台组', 'dpt': '这个组叼', 'type': 'dir'},
        {'name': '设计组', 'dpt': '这个组也叼', 'type': 'dir'},
        {'name': '后台组', 'dpt': '我次奥，这个组更叼', 'type': 'dir'},
        {'name': '统计组', 'dpt': '我次奥次奥，这个叼翻了', 'type': 'dir'},
        {'name': '测试组', 'dpt': '......', 'type': 'dir'},
        {'name': '拓扑组', 'dpt': '干啥的???', 
            'child':[
                {'name':'EXPERIENCE', 'type': 'file', 'contents':'拓扑组经历'}
            ]   
        }   
    ];
    loc_trees = [
        {'name': '产品研发部', 'type': 'dir', 
            'child': [
                {'name': '前台组', 'dpt': '这个组叼', 'type': 'dir'},
                {'name': '设计组', 'dpt': '这个组也叼', 'type': 'dir'},
                {'name': '后台组', 'dpt': '我次奥，这个组更叼', 'type': 'dir'},
                {'name': '统计组', 'dpt': '我次奥次奥，这个叼翻了', 'type': 'dir'},
                {'name': '工单组', 'dpt': '阿卡林', 'type': 'dir'},
                {'name': '测试组', 'dpt': '......', 'type': 'dir'},
                {'name': '拓扑组', 'dpt': '干啥的???', 
                    'child':[
                        {'name':'EXPERIENCE', 'type': 'file', 'contents':'拓扑组经历'}
                    ]   
                }   
            ]
        },
        {'name': 'README', 'type': 'file', 'contents': '时间：2014年7月1日<br/>我叫张鑫，2014年应届毕业生，今天是我入职中盈优创的第一天，内心也是有些小激动'}
    ];

    var now_obj = loc_trees,
        fa_obj = now_obj,
        loc_path = [],
        fa_arr = [];

    fa_arr.push(loc_trees);

    var getResult = function(obj) {
        var str = new Array();
        for(var i = 0, ilen = obj.length; i < ilen; i ++) {
            str.push('<a href="#" class="href">'+obj[i].name+'</a>');
            str.push(' - ');
            str.push(obj[i].dpt);
            str.push('<br/>');
        }
        return str.join('');
    }

    var changedpt = function(args) {
        var _second = {
            '前台组': {'name': '前台组', 'dpt': '创造网管的大神组', 'type': 'dir'},
            '设计组': {'name': '设计组', 'dpt': '所有任务的来源', 'type': 'dir'},
            '后台组': {'name': '后台组', 'dpt': '牛人聚集地', 'type': 'dir'},
            '测试组': {'name': '测试组', 'dpt': '。。。', 'type': 'dir'},
            '统计组': {'name': '统计组', 'dpt': '我次奥，他们的拓扑画的比我们拓扑组还叼', 'type': 'dir'},
            '工单组': {'name': '工单组', 'dpt': '阿卡林', 'type': 'dir'}
        };

        if(args === 'rm 拓扑组') {
            for(var i = 0; i < now_obj.length; i ++) {
                now_obj[i] = _second[now_obj[i].name];
            }
        }
    }


    var ttys = {
        showTime: function() {
            var time = document.getElementById('time');
            var t = new Date();
            time.innerHTML = `Last Login: ${t} on ttys000`;
        },
        cursorBlinker: function() {
            var cursor = document.getElementById('cursor');
            cursor.className = cursor.className ? '' : 'blink';
            setTimeout(this.cursorBlinker.bind(this), 500);
        },
        begin: function() {
            window.onkeydown = function(e) {
                var key = (e.which) ? e.which : e.keyCode;
                // console.log(key);
                if (key === 13 || key === 46 || key === 38 || key === 37 || key ===
                    39 ||
                    key === 40 || e.ctrlKey) {
                    e.preventDefault();
                }

                this.specialKeysHandler(key, e);
            }.bind(this);

            window.onkeypress = function(e) {
                this.input((e.which) ? e.which : e.keyCode)
            }.bind(this);

        },
        init: function() {
            this.history = [];
            this.historyIndex = -1;
            this.showTime();
            this.cursorBlinker();
            this.begin();
            this.intro('open README', function() {
                this.intro('help', function() {
                    this.intro('cd 产品研发部', function() {
                        this.intro('ls', function(){
                            this.intro('cd 拓扑组', function(){
                                this.intro('open EXPERIENCE', function() {
                                    this.intro('cd ..', function() {
                                        this.intro('rm 拓扑组');
                                    }.bind(this));
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        },
        intro: function(command, callback) {
            var that = this;
            var i = 0;
            var autoType = setInterval(function() {
                document.getElementById('stdout').innerHTML += command[i];
                i++;
                if (i == command.length) {
                    clearInterval(autoType);
                    that.specialKeysHandler(13);
                    if (callback) callback();
                };
            }, 250)
        },
        input: function(key) {
            var stdout = document.getElementById('stdout');
            if (!stdout || key < 0x20 || key > 0x7E || key === 13 || key === 9) {
                return;
            }
            stdout.innerHTML += String.fromCharCode(key);
        },
        specialKeysHandler: function(key, e) {

            var stdout = document.getElementById('stdout');
            if (!stdout) return;

            if (key === 8 || key === 46) { // Backspace/delete.
                stdout.innerHTML = stdout.innerHTML.replace(/.$/, '');
            } else if (key === 13) { // enter
                this.returnHandler(stdout.innerHTML)
            } else if (key === 38) { // Up arrow.
                if (this.historyIndex < this.history.length - 1) {
                    stdout.innerHTML = this.history[++this.historyIndex];
                }
            } else if (key === 40) { // Down arrow.
                if (this.historyIndex <= 0) {
                    if (this.historyIndex === 0) {
                        this.historyIndex--;
                    }
                    stdout.innerHTML = '';
                } else if (this.history.length) {
                    stdout.innerHTML = this.history[--this.historyIndex];
                }
            } else if (key === 37 || key === 39) { // left and right arrow
                // TODO
            }
        },

        returnHandler: function() {
            var ipt = document.getElementById('stdout').innerHTML;
            var path = document.getElementsByClassName('path')[document.getElementsByClassName(
                'path').length - 1].innerHTML;
            var cmd = ipt.split(' ')[0].toLowerCase();
            var args = ipt.split(' ')[1] ? ipt.split(' ')[1].toLowerCase() : '';
            this.history.push(ipt);
            document.getElementById('cursor').remove();
            document.getElementById('stdout').removeAttribute('id');
            var output = document.createElement('div');
            output.className = 'out'
            if (cmd && cmd.length) {
                if (cmd in this.commands) {
                    output.innerHTML = this.commands[cmd](args);
                    if (cmd === 'cd' && loc_path.length > 0) {
                       path = loc_path[loc_path.length - 1];

                    }else if(loc_path.length === 0) {
                        path = '~';
                    }
                } else {
                    try {
                        output.innerHTML = eval(ipt);
                    } catch (e) {
                        output.innerHTML = `-bash: ${cmd}: command not found`;
                    }
                }
            }
            if (output.innerHTML !== '') document.body.appendChild(output);
            var inputTemplate =
            `<div>
                <span><span class="name">zhangxin</span>@<a href="http://www.zhong-ying.com" target="_blank" class="link">zyuc</a>:<span class="path">${path}</span> $ </span>
                <span class="command" id="stdout"></span><span id="cursor">&nbsp;</span>
            </div>`;
            document.body.innerHTML += inputTemplate;
            this.scroll();

        },
        scroll: function() {
            var scroller = setInterval(function(){
                window.scrollBy(0, 10)
                if (document.body.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight) {
                    clearInterval(scroller);
                }
            })
        },
        commands: {
            open: function(args) {
                var args = args || '';
                if(now_obj){
                    for(var i = 0; i < now_obj.length; i ++) {
                        if(now_obj[i].name.toLowerCase() === args && now_obj[i].type === 'file') {
                            return now_obj[i].contents;
                        }
                    }
                }else {
                    return `-bash: open ${args}: No such file`;
                }
                
            },
            ls: function() {
                var path = document.getElementsByClassName('path')[document.getElementsByClassName(
                    'path').length - 1].innerHTML;

                if (path === '~') {
                    return `<span class="cv">README</span><span class="cv">resume</span><span class="cv">projects</span>`;
                } else if (path === '产品研发部') {
                    return getResult(now_obj);
                }
            },
            cd: function(args) {
                var args = args || '';
              
                if(args === '~') {
                    loc_path.length = 0;
                    loc_path.push(args);
                    return '';
                }else if(args === '..') {
                    
                    if(loc_path.length == 0) {
                        return '';
                    }
                    fa_arr.pop();
                    now_obj = fa_arr[fa_arr.length - 1];
                    loc_path.pop();
                    return '';
                }else {  
                    
                    for(var i = 0, ilen = now_obj.length; i < ilen; i ++) {
                        if(args === now_obj[i].name) {
                            
                            loc_path.push(args);
                            if(now_obj[i].child) {
                                // fa_obj = now_obj;
                                fa_arr.push(now_obj[i].child);
                               
                                now_obj = now_obj[i].child;

                            }
                           
                            return '';
                        }
                    }
                    return '-bash: open ${args}: No such directory';
                }
                // if (args === '产品研发部' || args === '~') {
                //     return '';
                // } else {
                //     return `-bash: open ${args}: No such directory`
                // }
            },
            rm: function(args) {
                var args = args || '';
                if(Array.isArray(now_obj)) {
                    for(var i = 0; i < now_obj.length; i ++) {
                        if(now_obj[i].name === args) {
                            now_obj.remove(i);
                            break;
                        }
                    }
                }
                changedpt('rm ' + args);
                return '';
            },
            help: function() {
                return `You can navigate either by clicking on anything that underlines
when you put your mouse over it, or by typing commands in the terminal.
Type the name of a link to view it. Use "profile" to change the theme and
text color, use "cd" to change into a directory or use "ls" to list the
contents of that directory. The contents of a file can be viewed using "open".

Commands are(case insensitive):
<span class="cv">open  cd  ls  profile  clear  help  tree</span>`;
            },
            profile: function() {
                return `TODO`
            },
            clear: function() {
                document.body.innerHTML = '';
                return '';
            },
            tree: function() {
                return ``;
            },
            mkdir: function(args) {
                var args = args || '';
                var _obj = {};
                _obj.name = args;
                _obj.type = 'dir';
                _obj.dpt = '';
                now_obj.push(_obj);
            }
        }

    }


    var term = Object.create(ttys);
    term.init();
})();
