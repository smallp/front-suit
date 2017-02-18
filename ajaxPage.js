/**
 * Created by Small on 2016/9/13.
 */
window.Pager ={
	url:location.href,
	tpl:'',
	target:'',
	param:{},
	_data:null,
	fun:null,
	init:function(param) {
		if (typeof param=='string')
			this.tpl=param;
		else for (var x in param){
			this[x]=param[x];
		}
		this.tpl=this.tpl==''?$('#item').html():this.tpl;
		if (this.tpl==''){
			console.log("init Error");
			return;
		}
		if (this.target=='')
			this.target=$('tbody');
		else this.target=$('#'+this.target);
		this.loadPage();
		$(window).bind('hashchange',function(){
			Pager.loadPage();
		});
	},
	loadPage:function(){
		var page=location.hash;
		if (page.length==0) page=0;
		else if (isNaN(page=parseInt(page.substr(1))))
			page=0;
		this.param.page=page;
		$.get(this.url,this.param, function (d) {
			Pager.showData(d);
		},'json');
	},
	showData:function (d) {
		var reg=/{\w+?}/g,res='',data;
		if (typeof d.total=='undefined'){
			data=d;
			this.total=1;
		}else{
			this.pager.draw(parseInt(location.hash.length==0?1:location.hash.substr(1)),d.total);
			this.total=d.total;
			data=d.data;
		}
		if (typeof this.fun=='function')
			data=this.fun(data);
		self._data=data;
		res='';
		for (var x in data){
			res+= this.tpl.replace(reg, function (word) {
				var key=word.substr(1,word.length-2);
				if (key=='_stripe') return (x%2==0)?'odd':'even';
                else return data[x][key];
			});
		}
		this.target.html(res);
	},
	reload:function(reset){
		if (typeof(reset)=='undefined'||location.hash=='#0'){
			this.loadPage();
		}else location.href='#0';
	},
	getRow:function(key,value){
		for (var x in self._data){
			if (self._data[x][key]==value) return self._data[x];
		}
		return null;
	},
	next:function(){
		var page=parseInt(this.param.page);
		if (typeof this.total!='undefined'&&this.total<=page+1) return;
		window.location.href='#'+(page+1);
	},
	pre:function(){
		var page=this.param.page;
		if (page==0) return;
		window.location.href='#'+(page-1);
	},
	addParam:function(key,value){
		this.param[key]=value;
	},
	delParam:function(key){
		delete this.param[key];
	},
	pager:{
		draw:function(num,total) {
			if (isNaN(num)||total<num){
				num=1;
			}
			var res = '', omi ='<li class="paginate_button"><a>……</a></li>',a=1;
			if (total <= 5) {
				for (a = 1; a <= total; a++)
					if (a == num)
						res += this.here(num);
					else
						res += this.jump(a);
			} else if (num >= 3) {
				res += this.jump(1) + omi;
				res += this.jump(num - 1);
				res += this.here(num);
				if (num < total) {
					res += this.jump(num + 1);
					if (total- num > 2)
						res += omi + this.jump(total);
					else if (total- num == 2)
						res += this.jump(total);
				}
			} else {
				for (a = 1; a <= 3; a++) {
					if (a == num)
						res += this.here(num);
					else
						res += this.jump(a);
				}
				res += omi + this.jump(total);
			}
			$('#paging').html(res);
		},
		jump:function(page){
			return '<li class="paginate_button"><a href="#'+(page-1)+'">'+page+'</a></li>';
		},
		here:function(page){
			return '<li class="paginate_button active"><a href="javascript:;">'+page+'</a></li>';
		}
	}
}
