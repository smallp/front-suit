Confirm = (function () {
    var tpl = null;
    var path = (function () {
        var a = {},expose = +new Date(),
            rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
            isLtIE8 = ('' + document.querySelector).indexOf('[native code]') === -1;
        // FF,Chrome
        if (document.currentScript) {
            return document.currentScript.src;
        }

        var stack;
        try {
            a.b();
        }
        catch (e) {
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
        }
        // IE10
        if (stack) {
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath) {
                return absPath;
            }
        }
        // IE5-9
        for (var scripts = doc.scripts,
                 i = scripts.length - 1,
                 script; script = scripts[i--];) {
            if (script.className !== expose && script.readyState === 'interactive') {
                script.className = expose;
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute('src', 4) : script.src;
            }
        }
    })();
    path=path.slice(0,-10);
    return {
        show: function (message, fun) {
            var self = this;
            if (tpl == null) {
                $.get(path+'confirm.tpl', '', function (data) {
                    tpl = $(data);
                    tpl.find('.confirm-alert').css('background','url("'+path+'alert.png") no-repeat scroll 0 0');
                    tpl.appendTo(document.body);
                    $('.confirm-mask,.confirm-close,.confirm-dismiss').on('click',function(e){
                        self.closeWindow();
                    });
                    self.fixPosition($('.sys-div-confirm'));
                    self.show(message, fun);
                });
            } else {
                tpl.find('#confirm-message').html(message);
                tpl.find('#confirm-btn').off('click').on('click', function () {
                    fun();
                    self.closeWindow();
                });
                $('.confirm-mask').addClass('confirm-show')
                tpl.fadeIn(300);
            }
        },
        closeWindow:function(){
            $('.confirm-mask').removeClass('confirm-show').fadeOut(300);
            tpl.fadeOut(300);
        },
        fixPosition: function (obj) { //居中显示
            var screenWidth = $(window).width(),
                screenHeight = $(window).height(),
                scrolltop = $(document).scrollTop(); //当前浏览器窗口的宽和高
            var objLeft = (screenWidth - obj.width()) / 2;
            var objTop = (screenHeight - obj.height()) / 2 + scrolltop;
            obj.css({left: objLeft + 'px', top: objTop + 'px'});

            $(window).resize(function () { //窗口缩放时改变位置
                screenWidth = $(window).width();
                screenHeight = $(window).height();
                scrolltop = $(document).scrollTop();
                objLeft = (screenWidth - obj.width()) / 2;
                objTop = (screenHeight - obj.height()) / 2 + scrolltop;
                obj.css({left: objLeft + 'px', top: objTop + 'px'});
            });

            $(window).scroll(function () { //有滚动条时计算位置
                screenWidth = $(window).width();
                screenHeight = $(window).height();
                scrolltop = $(document).scrollTop();
                objLeft = (screenWidth - obj.width()) / 2;
                objTop = (screenHeight - obj.height()) / 2
                obj.css({left: objLeft + 'px', top: objTop + 'px'});
            });
        }
    }
})();