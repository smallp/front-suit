var autoCompletion = {
	init: function () {
		var self=this;
		$('.autoComplete').on('keyup', function () {
			var obj = $(this);
			var key=this.value;
			if (key.length==0){
				obj.data('id',0);
				self.getTarget('completeList', group).hide();
				return;
			}
			var group=obj.data('group');
			$.getJSON(obj.data('url'),{key:key},function(data){
				var target=self.getTarget('completeList',group),str='';
				target.css('width', obj.css('width'));
				$.each(data,function(i,v){
					var value = obj.data('value');
					var name = obj.data('name');
					str+=self.getTpl(v,value?value:'id',name?name:'name');
				})
				target.html(str).show();
			});
		});
		$('.completeList').on('click','li',function(){
			var obj=$(this);
			var parent=obj.parent();
			var target = self.getTarget('autoComplete',parent.data('group'));
			target.data('data', obj.data('data')).val(obj.text());
			parent.hide();
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
	getTpl: function (data,value,name) {
		return '<li data-data="' + data[value] + '">' + data[name] + '</li>';
	}
};