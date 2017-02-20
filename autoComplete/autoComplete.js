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
			var obj = $(this);
			var key=this.value;
			if (key.length==0){
				obj.data('id',0);
				self.getTarget('completeList', group).hide();
				return;
			}
			var group=obj.data('group');
			$.getJSON(self.url,{key:key},function(data){
				var target=self.getTarget('completeList',group),str='';
				target.css('width', obj.css('width'));
				$.each(data,function(i,v){
					str+=self.getTpl(v);
				})
				target.html(str).show();
			});
		});
		$('.completeList').on('click','li',function(){
			var obj=$(this);
			var parent=obj.parent();
			var target = self.getTarget('autoComplete',parent.data('group'));
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