/**
 * Created by AlfredNoel on 2017.11.20
 * version jq-me1.0
 * Author AlfredNoel
 */
(function () {
    function $(inp) {
        return new jquery(inp);
    }

    function jquery(inp) {
        this.init(inp);
    }

    jquery.prototype = {
        //获取jq数据
        constructor: jquery,
        init: function (inp) {
            var tyStr = typeof inp;
            switch (tyStr) {
                case 'string':

                    if (/^<[^<>]+>/.test(inp)) {
                        var oDiv = document.createElement('div');
                        oDiv.innerHTML = inp;
                        this.length = oDiv.children.length;
                        for (var i = 0; i < this.length; i++) {
                            this[i] = oDiv.children[i];
                        }
                    } else {
                        var arrDom = document.querySelectorAll(inp);
                        this.length = arrDom.length;

                        for (var i = 0; i < arrDom.length; i++) {
                            this[i] = arrDom[i];
                        }
                    }

                    break;
                case 'object': //如果参数是类似节点或者节点数组
                    if (inp.nodeType || inp === window) {
                        this.length = 1;
                        this[0] = inp;

                    } else {

                        this.length = inp.length;
                        for (var i = 0; i < this.length; i++) {
                            this[i] = inp[i];
                        }

                    }
                    break;
                case 'function':
                    window.onload = inp;
                    break;
            }

        },
        each: function (fn) {
            for (var i = 0; i < this.length; i++) {
                fn.call(this[i], this[i], i);
            }
        },
        get: function (inp) {
            return this[inp];
        },
        eq: function (inp) {
            return $(this[inp]);
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(this.length - 1);
        },
        html: function () {
            var args = arguments[0];

            if (args) {
                this.each(function (item, index) {
                    item.innerHTML = args;
                })
            } else {
                this.innerHTML = args;
            }

            return args;
        },
        css: function () { //'width'/'width':110px/{}  三种
            var args = arguments;
            if (args.length === 1) {
                if (typeof args[0] === 'object') {
                    this.each(function () {
                        for (var key in args[0]) {
                            this.style[key] = args[0][key];
                        }
                    })
                } else {
                    var val = '';
                    if (args[0] === 'left') {
                        val = this[0].offsetLeft + 'px';
                    } else if (args[0] === 'top') {
                        val = this[0].offsetTop + 'px';
                    } else {
                        val = this[0].currentStyle ? this[0].currentStyle[args[0]] : getComputedStyle(this[0])[args[0]];
                    }

                    return val;
                }
            } else {
                this.each(function () {
                    this.style[args[0]] = args[1];
                });
            }
            return this;

        },
        addClass: function (str) {
            this.each(function (item, index) {

                if (str) {
                    var arr = str.split(" ");

                    for (var i = 0; i < arr.length; i++) {
                        if (!new RegExp("(^|\\s)" + arr[i] + "(\\s|$)").test(item.className)) {
                            this.className += ' ' + arr[i];
                        }

                    }
                } else {
                    this.className = str;
                }
            })
        },
        removeClass: function () {
            var args = arguments;
            this.each(function (item, index) {
                if (args) {
                    var arrAr = [],
                        arrTest = [];
                    [].forEach.call(args, function (item, index) {
                        arrAr[index] = args[index];
                    })

                    arrTest = this.className.split(" ");

                    for (var i = 0; i < arrAr.length; i++) {
                        for (var j = arrTest.length - 1; j >= 0; j++) {
                            if (arrTest[j] === arrAr[i]) {
                                arrTest.splice(j, 1);
                            }
                        }
                    }

                    this.className = arrTest.join(' ');
                } else {
                    this.className = "";
                }
            })
            return this;
        },
        toggleClass: function (str) {
            this.each(function (item, index) {
                if (item.className) {
                    str = str.split(" ");
                    for (var i = 0; i < str.length; i++) {
                        if (str.indexOf(str[i]) !== str.lastIndexOf(str[i])) {
                            str.splice(str.lastIndexOf(str[i]), 1);
                        }
                    }
                    var currentClass = item.className.split(" ");

                    for (var i = 0; i < str.length; i++) {
                        for (var j = currentClass.length - 1; j >= 0; j--) {
                            if (currentClass.indexOf(str[i]) !== -1) {
                                currentClass.splice(currentClass.indexOf(str[i]), 1);
                            } else {
                                currentClass.push(str[i]);
                            }
                        }
                    }
                    item.className = currentClass.join(" ");
                } else {
                    this.className = str;
                }
            })
            return this;
        },
        attr: function () {
            var args = arguments;
            if (args.length === 1) {

                if (typeof args[0] === 'string') {
                    return this[0].getAttribute(args[0]);
                } else if (typeof args[0] === 'object') {
                    for (var key in args[0]) {
                        this.each(function () {
                            this.setAttribute(key, args[0][key]);
                        });
                    }
                }
            } else {
                this.each(function () {
                    this.setAttribute(args[0], args[1]);
                });
            }
            return this;
        },
        removeAttr: function (str) {
            this.each(function () {
                this.removeAttribute(str);
            })
            return this;
        },
        text: function (str) {

            if (str) {
                this.each(function () {
                    this.value = str;
                });
            } else {
                return this[0].value;
            }
            return this;
        },
        val: function (str) {
            if (str) {
                this.each(function () {
                    this.value = str;
                })
            } else {
                return this[0].value;
            }
        },
        offset: function () {
            var json = {
                top: 0,
                left: 0
            };
            var obj = this[0];

            while (obj !== document.body) {
                json.top += obj.offsetTop;
                json.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            json.left -= scrollLeft;
            json.top -= scrollTop;

            return json;

        },
        position: function () {
            var json = {
                left: this[0].offsetLeft,
                top: this[0].offsetTop
            }
            return json;
        },
        scrollTop: function (str) {
            //判断是否是系统,文档
            if (this[0] === window || this[0] === document || this[0] === document.body) {
                if (typeof str !== 'undefined') {
                    document.documentElement.scrollTop = str;
                } else {
                    return document.documentElement.scrollTop || document.body.scrollTop;
                }
            } else {
                if (typeof str !== 'undefined') {
                    this[0].scrollTop = str;
                } else {
                    return this[0].scrollTop;
                }
            }
            return this;
        },
        scrollLeft: function (str) {
            if (this[0] === window || this[0] === document || this[0] === document.body) {
                if (typeof str !== 'undefined') {
                    document.documentElement.scrollLeft = str;
                } else {
                    return document.documentElement.scrollLeft || document.body.scrollTop;
                }
            } else {
                if (typeof str !== 'undefined') {
                    this[0].scrollTop = str;
                } else {
                    return this[0].scrollTop;
                }
            }
            return this;
        },
        height: function (num) {
            if (num) {
                this[0].css("height", str + 'px');
            } else {
                return this[0].css("height");
            }
            return this;
        },
        width: function (num) {
            if (num) {
                this[0].css("width", str + 'px');
            } else {
                return this[0].css("width");
            }
            return this;
        },
        innerHeight: function () {
            return this[0].clientHeight;
        },

        innerWidth: function () {
            return this[0].clientWidth;
        },

        outerHeight: function () {
            return this[0].offsetHeight;
        },

        outerWidth: function () {
            return this[0].offsetWidth;
        },
        append: function (inp) {
            if (typeof inp === 'string') {

                if (/^<[^<>]+>/.test(inp)) {
                    this.append($(inp));
                } else {
                    var oTxt = document.createTextNode(inp);
                    this[0].appendChild(oTxt);
                }
            } else if (typeof inp === 'object') {
                if (inp.constructor === jquery) {
                    var This = this[0];
                    inp.each(function (item, index) {
                        This.appendChild(item);
                    })
                } else {
                    this[0].append($(inp));
                }
            }
            return this;
        },
        prepend: function (inp) {
            if (typeof inp === "string") {
                if (/^<[^<>]+>/.test(inp)) {
                    this.prepend($(inp));
                } else {
                    var oTxt = document.createTextNode(sloth);
                    this[0].insertBefore(oTxt, this[0].children[0]);
                }
            } else if (typeof inp === "object") {
                if (inp.constructor === jquery) {
                    var This = this[0];
                    inp.each(function (item, index) {
                        This.insertBefore(inp[inp.length - index], This.children[0]);
                    })
                } else {
                    this[0].prepend($(inp));
                }
            }
        },
        wrap: function (inp) {
            if (/^<[^<>]+>/.test(inp) || typeof inp === "string") {
                inp = $(inp);
            } else if (!inp.nodeType && inp.length) { //多个节点,数组
                inp = inp[0]
            } else if (inp.constructor === jquery) {
                inp = inp[0];
            }

            var thisParent = this[0].parentNode;
            thisParent.insertBefore(inp, this[0]);
            this.each(function (item, index) {
                inp.appendChild(this);
            })

            return this;
        },
        unwrap: function () {
            this.each(function () {
                var pNode = this[0].parentNode,
                    pNodeChild = pNode.children,
                    pParent = pNode.parentNode;

                pNodeChild.each(function (item, index) {
                    pParent.insertBefore(pNodeChild[pNodeChild.length - index], pNode);
                })

                pParent.removeChild(pNode);
            })
            return this;
        },
        empty: function () {
            this.each(function () {
                this.innerHTML = "";
            })

            return this;
        },
        remove: function () {

            this.each(function () {
                this.parentNode.removeChild(this);
            })

            return this;
        },
        children: function () {
            var arr = [],
                args = arguments;
            if (args[0]) {
                if (typeof args[0] === 'string') {
                    this.each(function () {
                        var tDom = this.querySelectorAll(args[0]);
                        for (var i = 0; i < tDom.length; i++) {
                            if (tDom[i].parentNode === this) {
                                arr.push(tDom[i]);
                            }
                        }
                    })
                }
            } else {
                this.each(function () {
                    for (var i = 0; i < this.children.length; i++) {
                        if (this.children[i])
                            arr.push(this.children[i]);
                    }
                });
            }
            return $(arr);
        },
        find: function (str) {
            var arr = [];
            if (typeof str === "string") {
                this.each(function () {
                    var oDom = this.querySelectorAll(str);
                    for (var i = 0; i < oDom.length; i++) {
                        arr.push(oDom[i]);
                    }
                })
            }
            return $(arr);
        },
        siblings: function (str) {
            var arr = [];
            if (str) { //字符串的时候
                this.each(function () {
                    var oDom = this.parentNode.querySelectorAll(str);
                    for (var i = 0; i < oDom.length; i++) {
                        if (oDom[i].parentNode && oDom[i].parentNode === this.parentNode && oDom[i] !== this) {
                            arr.push(oDom[i]);
                        }
                    }
                })
            } else {
                var oDom = this.parentNode.children;
                for (var i = 0; i < oDom.length; i++) {
                    if (oDom[i] !== this) {
                        arr.push(oDom[i]);
                    }
                }
            }
            return $(arr);
        },
        hasClass: function (str) {
            var str = str.split(" "),
                rClass = this[0].className;
            for (var i = 0; i < str.length; i++) {
                if ("(^|\\s)" + str[i] + "(^|\\s)".test(rClass)) {
                    return true;
                }
            }
            return false;
        },
        on: function (eName, eFn) {
            if (eName === 'mousewheel') {
                this.each(function () {
                    if (this[eName + "lx"]) {
                        this[eName + "lx"].push(eFn);
                    } else {
                        this[eName + "lx"] = [eFn];
                    }
                    document.onmousewheel === null ? this.onmousewheel = eFn : this.addEventListener('DOMMouseScroll', eFn);
                });
            } else {
                this.each(function () {

                    if (this[eName + "lx"]) {
                        this[eName + "lx"].push(eFn);
                    } else {
                        this[eName + "lx"] = [eFn];
                    }
                    if (document.addEventListener) {
                        this.addEventListener(eName, eFn);
                    } else {
                        this.attachEvent('on' + eName, eFn);
                    }
                });
            }
            return this;
        },
        off: function (eName) {
            if (this[eName]) {
                for (var i = 0; i < this[eName].length; i++) {
                    if (document.removeEventListener) {
                        this.removeEventListener(eName, this[eName][i]);
                    } else {
                        this.detachEvent('on' + eName, this[eName][i]);
                    }
                }
                if (eName === 'mousewheel') {
                    this.onmousewheel = null;
                }
            }
            return this;
        },
        hover: function () {
            var args = arguments; //彩蛋 華魅
            if (args.length) {
                if (args.length === 1) {
                    args[1] = args[0]
                }
                this.on('mouseenter', args[0]);
                this.on('mouseleave', args[1]);
            }
            return this;
        },

        click: function (eFn) { //彩蛋 華魅
            return this.on('click', eFn);
        },

        mouseenter: function (eFn) { //彩蛋 華魅
            this.on('mousenter', eFn);
        },

        mouseleave: function (eFn) { //彩蛋 華魅
            return this.on('mouseleave', eFn);
        },

        mouseover: function (eFn) { //彩蛋 華魅
            return this.on('mouseover', eFn);
        },

        mouseout: function (eFn) { //彩蛋 華魅
            return this.on('mouseout', eFn);
        },

        mousedown: function (eFn) { //彩蛋 華魅
            return this.on('mousedown', eFn);
        },

        mousemove: function (eFn) { //彩蛋 華魅
            return this.on('mousemove', eFn);
        },

        mouseup: function (eFn) { //彩蛋 華魅
            return this.on('mouseup', eFn);
        },

        focus: function (eFn) { //彩蛋 華魅
            return this.on('focus', eFn);
        },

        blur: function (eFn) { //彩蛋 華魅
            return this.on('blur', eFn);
        },

        change: function (eFn) { //彩蛋 華魅
            this.on('change', eFn);
        },

        submit: function (eFn) { //彩蛋 華魅
            return this.on('submit', eFn);
        },

        dblclick: function (eFn) { //彩蛋 華魅
            return this.on('dblclick', eFn);
        },

        keydown: function (eFn) { //彩蛋 華魅
            return this.on('keydown', eFn);
        },

        keyup: function (eFn) { //彩蛋 華魅
            return this.on('keyup', eFn);
        },

        keypress: function (eFn) { //彩蛋 華魅
            return this.on('keypress', eFn);
        },

        scroll: function (eFn) { //彩蛋 華魅
            return this.on('scroll', eFn);
        },

        resize: function (eFn) { //彩蛋 華魅
            return this.on('resize', eFn);
        },

        load: function (eFn) { //彩蛋 華魅
            return this.on('load', eFn);
        },

        mousewheel: function (eFn) { //彩蛋 華魅
            return this.on('mousewheel', eFn);
        },
        animate: function (params, speed, fn) {

            if (typeof params === 'object') {
                var content = params;
                time = typeof speed === 'number' ? speed : 300;
                callBack = typeof speed === 'function' ? speed : fn;

                this.each(function () {
                    var obj = {},
                        nObj = {},
                        sTime = new Date();
                    for (var key in params) {
                        obj[key] = parseFloat($(this).css(key));
                        nObj[key] = parseFloat(params[key]) - obj[key];
                    }

                    (function Fn() {
                        var ntime = new Date();
                        var prop = (ntime - sTime) / time;
                        if (prop >= 1) {
                            prop = 1;
                        } else {
                            for (var key in obj) {
                                var val = '';
                                if (key !== 'opacity' && key !== 'zIndex') {
                                    val = 'px';
                                }
                                this.style[key] = obj[key] + nObj[key] * prop + val;
                            }
                            this.timer = requestAnimationFrame(Fn.bind(this));
                        }
                        if (prop === 1) {
                            callBack && callBack.call(this);
                        }
                    }).call(this);
                })
            }
        },
        show: function () {
            var args = arguments,
                callBack, time = 300;
            if (args[0]) { //如果带参数
                if (typeof args[0] === "function") {
                    callBack = args[0];
                } else if (typeof args[0] === "number") {
                    time = args[0];
                    if (args[1]) {
                        callBack = args[1];
                    }
                }
                this.each(function () {
                    if ($(this).css("display") === "none") {
                        $(this).css("display", "block");

                        var tWidth = $(this).css("width"),
                            tHeight = $(this).css("height"),
                            tOpacity = $(this).css("opacity");

                        this.style.width = 0;
                        this.style.height = 0;
                        this.style.opacity = 0;

                        $(this).animate({
                            height: tHeight,
                            width: tWidth,
                            opacity: tOpacity
                        }, time, callBack)
                    }
                })

            } else {
                this.each(function () {
                    $(this).css("display", "block");
                })
            }
        },
        hide: function () {
            var args = arguments,
                callBack, time = 300;
            if (args[0]) { //如果带参数
                if (typeof args[0] === "function") {
                    callBack = args[0];
                } else if (typeof args[0] === "number") {
                    time = args[0];
                    if (args[1]) {
                        callBack = args[1];
                    }
                }
                this.each(function () {
                    if ($(this).css("display") === "block") {
                        var tWidth = $(this).css("width"),
                            tHeight = $(this).css("height"),
                            tOpacity = $(this).css("opacity");

                        $(this).animate({
                            height: 0,
                            width: 0,
                            opacity: 0
                        }, time, function () {
                            $(this).css("display", "none");
                            this.style.width = tWidth;
                            this.style.height = tHeight;
                            this.style.opacity = tOpacity;
                            callBack && callBack.call(this);
                        })
                    }
                })

            } else {
                this.each(function () {
                    $(this).css("display", "none");
                })
            }
        },
        toggle: function () { //带两个参数，时间，回掉
            var args = arguments;
            this.each(function () {
                if ($(this).css("display") === "none") {
                    $(this).show.apply($(this), args);
                } else {
                    $(this).hide.apply($(this), args);
                }
            })
        },
        fadeIn: function () {
            var args = arguments,
                time = args[0] && (typeof args[0] === "number") ? args[0] : 300,
                callBack = args[0] && (typeof args[0] === "function") ? args[0] : args[1] && (typeof args[1] === "function") && args[1] || null;

            this.each(function () {
                if ($(this).css('display') === 'none') {
                    var tOpacity = $(this).css("opacity");
                    this.style.opacity = 0;
                    this.style.display = 'block';
                    $(this).animate({
                        opacity: tOpacity
                    }, time, callBack);
                }
            })
        },
        fadeOut: function () {
            var args = arguments,
                time = args[0] && (typeof args[0] === "number") ? args[0] : 300,
                callBack = args[0] && (typeof args[0] === "function") ? args[0] : args[1] && (typeof args[1] === "function") && args[1] || null;

            this.each(function () {
                if ($(this).css('display') === 'block') {
                    var tOpacity = $(this).css("opacity");
                    $(this).animate({
                        opacity: 0
                    }, time, function () {
                        this.style.opacity = tOpacity;
                        this.style.display = 'none';
                        callBack && callBack.call(this);
                    });


                }
            })
        },
        fadeToggle: function () {
            var args = arguments;
            this.each(function () {
                if ($(this).css('display') !== 'none') {
                    $(this).fadeOut.apply($(this), args);
                } else {
                    $(this).fadeIn.apply($(this), args);
                }
            });
        },
        slideDown: function () {
            var args = arguments,
                time = args[0] && (typeof args[0] === "number") ? args[0] : 300,
                callBack = args[0] && (typeof args[0] === "function") ? args[0] : args[1] && (typeof args[1] === "function") && args[1] || null;

            this.each(function () {
                if ($(this).css("display") === "none") {

                    var tHeight = $(this).css("height"),
                        tOpacity = $(this).css("opacity");

                    $(this).css("display", "block");
                    this.style.height = 0;
                    this.style.opacity = 0;

                    $(this).animate({
                        height: tHeight,
                        opacity: tOpacity
                    }, time, callBack);
                }
            })
        },
        slideUp: function () {
            var args = arguments,
                time = args[0] && (typeof args[0] === "number") ? args[0] : 300,
                callBack = args[0] && (typeof args[0] === "function") ? args[0] : args[1] && (typeof args[1] === "function") && args[1] || null;

            this.each(function () {
                if ($(this).css("display") === "block") {

                    var tHeight = $(this).css("height"),
                        tOpacity = $(this).css("opacity");

                    $(this).animate({
                        height: 0,
                        opacity: 0
                    }, time, function () {
                        $(this).css("display", "none");
                        this.style.height = tHeight;
                        this.style.opacity = tOpacity;
                        callBack && callBack.call(this);
                    });
                }
            })
        },
        slideToggle: function () {
            var args = arguments;
            this.each(function () {
                if ($(this).css('display') !== 'none') {
                    $(this).slideUp.apply($(this), args);
                } else {
                    $(this).slideDown.apply($(this), args);
                }
            });
        }



    }

    window.$ = $;
})()