/**
 * Created by Small on 2016/7/19.
 */
$.extend({
	web : function(url, data, success, method) {
		url = url == '' ? location.href : url;
		method = typeof method == 'undefined' ? 'post' : method;
		$.ajax({
			url : url,
			method : method,
			data : data,
			dataType : 'json',
			success : success
		});
	},
	small : {
		check2str : function(claName) {
			var data = [];
			$('.' + claName + ':checked').each(function() {
				data.push(this.value);
			});
			$('#' + claName).val(JSON.stringify(data));
		},
		arr2check : function(data, claName) {
			$('.' + claName).prop('checked', false);
			for (x in data)
				$('.' + claName + '[value=' + data[x] + ']').prop('checked',
						true);
		},
		fillForm : function(obj, data) {
			for (x in data) {
				if (x in obj)
					obj[x].value = data[x];
			}
		},
		fillTpl : function(tpl, data) {
			return tpl.replace(/{\w+?}/g, function(word) {
				var key = word.substr(1, word.length - 2);
				return data[key];
			});
		},
		time2str : function(time) {
			var date = new Date(time * 1000);
			var str = date.toLocaleDateString();
			str += ' ' + date.getHours() + ':' + date.getMinutes() + ':'
					+ date.getSeconds();
			return str;
		}
	}
});
$(document).ajaxError(function(event, res) {
	try {
		res = JSON.parse(res.responseText);
		alert(res.info);
	} catch (e) {
		alert('服务器错误！');
	}
});
$(document).ajaxComplete(function() {
	if (typeof layer!='undefined') layer.closeAll('loading');
});
