$(function() {
    function error(e,msg) {
        if (typeof layer=='undefined'){
            e.focus();
            alert(msg);
        }else{
            e.focus();
            layer.tips(msg,e);
        }
    }
    $.fn.extend({'valid':function() {
        var elements=this[0].elements;
        for (var index=0,size=elements.length;index<size;index++) {
            var item=$(elements[index]);
            var val=item.val();
            if (item.attr('required')){
                if (val==''||(val=='0'&&item[0].type=='select-one')){
                    error(item[0],'请完善信息');
                    return false;
                }
            }
            if (val=='') continue;
            var t;
            if (t=item.data('repeat')){
                if (item.val()!=elements[t].value){
                    error(item[0],'请确认信息一致');
                    return false;
                }
            }
        }
        return true;
    }});
    $('form').on('submit',function() {
        $(this).valid();
    });
})