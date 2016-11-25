CONFIRM=(function(){
    var tpl=null;
    var src=(function(){
        a = {},
		expose = +new Date(),
		rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
		isLtIE8 = ('' + document.querySelector).indexOf('[native code]') === -1;
        // FF,Chrome
        if (document.currentScript){
            return document.currentScript.src;
        }

        var stack;
        try{
            a.b();
        }
        catch(e){
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
        }
        // IE10
        if (stack){
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath){
                return absPath;
            }
        }
        // IE5-9
        for(var scripts = doc.scripts,
            i = scripts.length - 1,
            script; script = scripts[i--];){
            if (script.className !== expose && script.readyState === 'interactive'){
                script.className = expose;
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute('src', 4) : script.src;
            }
        }
    })();
    return {
        show:function(message,fun){
            if (tpl==null){
                src=src.slice(0,-2)+'tpl';
                $.get(src,'',function(data){
                    tpl=$(data);
                    tpl.appendTo(document.body);
                    CONFIRM.show(message,fun);
                });
            }else{
                tpl.find('#confirm-message').html(message);
                tpl.find('#confirm-btn').off('click').on('click',function(){
                    fun();
                    tpl.hide();
                });
                tpl.show();
            }
        }
    }
})();