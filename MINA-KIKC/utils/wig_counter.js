var counterMod = {
	wig_counter_down: function (e) {
		let initdata = this.data.wig_counter_data;
		let newnum = parseInt(initdata.num) - 1;
		if (initdata.min > newnum) {
			newnum = initdata.min;
		}
		initdata.num = newnum;
		this.setData({
			'wig_counter_data': initdata
		});
	},
	wig_counter_listenNumChange: function (e) {
		let initdata = this.data.wig_counter_data;
		let newnum = e.detail.value;
		// if (isNaN(newnum)) {
		// 	newnum = initdata.min;
		// }
		if (initdata.max < newnum) {
			newnum = initdata.max;
		}
		if (initdata.min > newnum) {
			newnum = initdata.min;
		}
		initdata.num = newnum;
		this.setData({
			'wig_counter_data': initdata
		});
	},
	wig_counter_listenNumBlur:function(e){
		let initdata = this.data.wig_counter_data;
		let newnum = e.detail.value;
		if (isNaN(newnum)) {
			newnum = initdata.min;
		}
		if (initdata.max < newnum) {
			newnum = initdata.max;
		}
		if (initdata.min > newnum) {
			newnum = initdata.min;
		}
		initdata.num = newnum;
		this.setData({
			'wig_counter_data': initdata
		});
	},
	wig_counter_up: function (e) {
		let initdata = this.data.wig_counter_data;
		let newnum = parseInt(initdata.num) + 1;
		if (initdata.max < newnum) {
			newnum = initdata.max;
		}
		initdata.num = newnum;
		this.setData({
			'wig_counter_data': initdata
		});
	},
	wig_counter_init: function (importdata) {
		let initdata = this.data.wig_counter_data;
		Object.assign(initdata, importdata);
		this.setData({
			'wig_counter_data': initdata
		});
	},
	wig_counter_getnum:function(){
		return this.data.wig_counter_data.num;
	},
	wig_data: {
		'wig_counter_data': {
			min: 1,
			max: 10000,
			num: 1
		}
	}
};


module.exports = counterMod;