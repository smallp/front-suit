/**
 * Created by Small on 2017/4/2.
 * Version 2.0
 */
window.Pager =(function() {
class _Table{
	//obj url tpl page
	constructor(param){
		this.param={};
		this.staticParam={};
		this.size=10;
		this.page=-1;
		this._data=null;
		this.fun=null;
		for (var x in param){
			if (x in _Table.staticKeys){
				this.staticParam[x]=param[x];
			}else this[x]=param[x];
		}
	}

	loadPage(page){
		this.page=parseInt(page);
		this.param.page=page;
		$.get(this.url,$.extend({},this.param,this.staticParam), function (d) {
			this.showData(d);
		}.bind(this),'json');
	}
	showData(d) {
		var reg=/{\w+?}/g,res='',data,count=0;
		if (typeof d.total=='undefined'){
			data=d;
			this.total=1;
			count=data.length;
		}else{
			data=d.data;
			count=d.total;
			this.size=Math.max(this.size,data.length);
			this.total=Math.ceil(count/this.size);
		}
		var pageStr=Pager.pager.draw(this.page+1,this.total,this.index);
		this.foot.find('.pager-page').html(pageStr);
		this.foot.find('.pager-total').html(count);
		if (typeof this.fun=='function')
			data=this.fun(data);
		this._data=data;
		data.map(function(v,index){
			res+= this.tpl.replace(reg, function (word) {
				var key=word.substr(1,word.length-2);
				return v[key];
			});
		}.bind(this));
		this.target.html(res);
	}
	reload(reset){
		if (reset){
			this.page==0?this.loadPage(0):Pager.jump(0,this.index);//page is not 0,so we need to change the hash
		}else{
			this.loadPage(this.page);
		}
	}
	getRow(key,value){
		for (var v of this._data){
			if (v[key]==value) return v;
		}
		return null;
	}
	addParam(key,value){
		this.param[key]=value;
	}
	delParam(key){
		delete this.param[key];
	}
	setSize(size){
		this.size=size;
		this.staticParam.size=size;
	}
}
_Table.staticKeys=['size','sort','sortType'];
	$(window).bind('hashchange',function(){
		Pager.dispatch();
	});
	return {
	instance:[],
	link:{},
	init:function(fun) {
		var t;
		var keys=['url', 'tpl','foot','size','sort','sortType'];
		var self=this;
		$('.pager-table').each(function() {
			let obj=$(this);
			var param={obj:obj,target:obj.find('tbody')};
			for (var key of keys){
				if (t=obj.data(key)) param[key]=t;
			}
			if (!('url' in param)) param['url']=location.pathname;
			if ('tpl' in param) param['tpl']=$('#'+param['tpl']).html();
			else param['tpl']=$('#item').html();
			if ('foot' in param) param['foot']=$('#'+param['foot']);
			else param['foot']=obj.parent().find('.pager-foot');
			let sort='';
			let sortType='';
			if ('sort' in param){
				sort=param['sort'];
				if ('sortType' in param)
					sortType=param['sortType'];
				else{
					sortType='asc';
					param['sortType']='asc';
				}
			}

			let index=self.instance.push(new _Table(param))-1;
			if (t=obj.attr('id')) self.link[t]=self.instance[index];
			self.instance[index].index=index;

			//设置默认排序
			obj.find('.pager-sort').each(function() {
				var th=$(this);
				if (th.data('sort')==sort){
					th.addClass(`pager-sort-${sortType}`);
				}
			});
			//添加绑定事件
			obj.on('click','.pager-sort',function() {
				var th=$(this);
				var ins=self.instance[index];
				if (th.hasClass('pager-sort-asc')){
					ins.staticParam['sortType']='desc';
					th.removeClass('pager-sort-asc').addClass('pager-sort-desc');
				}else if (th.hasClass('pager-sort-desc')){
					ins.staticParam['sortType']='asc';
					th.removeClass('pager-sort-desc').addClass('pager-sort-asc');
				}else{
					obj.find('.pager-sort-asc').removeClass('pager-sort-asc');
					obj.find('.pager-sort-desc').removeClass('pager-sort-desc');
					ins.staticParam['sortType']='asc';
					ins.staticParam['sort']=th.data('sort');
					th.addClass('pager-sort-asc');
				}
				ins.reload(true);
			});
		});
		typeof fun=='function'&&fun();
		this.dispatch();
	},
	jump:function(page,index=0) {
		if (isNaN(index)){
			index=index in this.link?this.link[index].index:0;
		}
		var hash=[];
		for (var o of this.instance){
			hash.push(o.param);
		}
		hash[index].page=page;
		location.href='#'+hash.map((v)=>{return $.param(v);}).join('|');
	},
	getObj:function(id) {
		if (id in this.link) return this.link[id];
		else return null;
	},
	dispatch:function() {
		var hash=location.hash.substr(1);
		var param=[];
		hash!=''&&hash.split('|').map((table)=>{
			var item={page:0};
			table!=''&&table.split('&').map((v)=>{
				var kv=v.split('=');
				item[kv[0]]=kv[1];
			})
			param.push(item);
		});
		for (var index in this.instance) {
			var element = this.instance[index];
			var page=index in param?param[index].page:0;
			if (element.page!=page){
				element.loadPage(page);
			}
		}
	},
	next:function(index=0){
		var obj=isNaN(index)?this.getObj(index):this.instance[index];
		var page=obj.page;
		if (typeof obj.total!='undefined'&&obj.total<=page+1) return;
		this.jump(page+1,obj.index);
	},
	pre:function(index=0){
		var obj=isNaN(index)?this.getObj(index):this.instance[index];
		var page=obj.page;
		if (page==0) return;
		this.jump(page-1,obj.index);
	},
	reload:function(reset=false,index=0){
		var obj=isNaN(index)?this.getObj(index):this.instance[index];
		obj.reload(reset);
	},
	pager:{
		tpl:{
			omi:'<li class="paginate_button"><a>……</a></li>',
			jump:'<li class="paginate_button"><a href="{href}">{page}</a></li>',
			active:'<li class="paginate_button active"><a href="javascript:;">{page}</a></li>',
			before:'',
			after:''
		},
		draw:function(num,total,index) {
			this.index=index;
			if (isNaN(num)||total<num){
				num=1;
			}
			var res = '',a=1;
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
						res += this.tpl.omi + this.jump(total);
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
				res += this.tpl.omi + this.jump(total);
			}
			return this.tpl.before.replace(/{index}/g,index)+res+this.tpl.after.replace(/{index}/g,index);
		},
		jump:function(page){
			return this.tpl.jump.replace('{page}',page).replace('{href}',`javascript:Pager.jump(${page-1},${this.index})`);
		},
		here:function(page){
			return this.tpl.active.replace('{page}',page);
		}
	}
};
})();