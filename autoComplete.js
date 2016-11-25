var autoCompletion = {
	url:'',
	init: function (param) {
		var self=this;
		if (typeof param=='string')
            this.url=param;
        else for (var x in param){
            this[x]=param[x];
        }
		$('.autoComplete').on('keyup', function () {
			var key=this.value;
			if (key.length==0){
				$(this).data('id',0);
				return;
			}
			var group=$(this).data('group');
			$.getJSON(this.url,{key:key},function(data){
				var target=self.getTarget('completeList',group),str='';
				$.each(data,function(i,v){
					str+=self.getTpl(v);
				})
				target.html(str);
			});
		});
		$('.completeList').on('click','li',function(){
			var obj=$(this);
			var parent=obj.parent();
			var target=self.getTarget('autoComplet',parent.data('group'));
			target.data('id',obj.data('id')).val(obj.text());
			parent.html('');
		});
	},
	getTarget:function(cla,group){
		var res=$('.'+cla);
		if (typeof group!='undefined'){
			res=res.filter(function(){
				return $(this).data('group')==group;
			});
		}
		return res;
	},
	getTpl: function (data) {
		return '<li data-id="' + data.id + '">' + data.name + '</li>';
	}
};