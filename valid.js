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
            var val=item.val(),t;
            if (t=item.data('repeat')){
                if (item.val()!=elements[t].value){
                    error(item[0],'请确认信息一致');
                    return false;
                }
            }
            if (item.attr('required')){
                if (val==''||(val=='0'&&item[0].type=='select-one')){
                    error(item[0],'请完善信息');
                    return false;
                }
            }
            if (val=='') continue;
            if (t=item.data('type')){
                switch (t) {
                    case 'phone':
                        if (isNaN(val)||val.length!=11){
                            error(item[0],'请确认手机号码是否正确');
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return true;
    }});
    $('form').on('submit',function() {
        $(this).valid();
    });
})