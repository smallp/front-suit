$(function() {
    $('.js-pic').on('change', function() {
        var self=$(this);
        var tar=self.attr('data-target');
        var pic=self.attr('data-pic');
        $('#picInfo').html('图片上传中，请稍候...');
        $.web('',{},function(item) {
            var token = item.token;
            var formData = new FormData();
            formData.append('file',self[0].files[0]);
            formData.append('token', token);
            $.ajax({
                url: 'http://upload.qiniu.com/',
                type: 'post',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success: function(item) {
                	$('#picInfo').html('');
                    src = '' + item.key;
                    $('#'+pic).attr('src', src).css({
                        'width': '300px'
                    }, {
                        'height': '200px'
                    });
                    $('#'+tar).val(src);
                    alert('图片上传成功！');
                }
            });
        },'get');
    });
});