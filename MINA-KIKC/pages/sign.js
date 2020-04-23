//main.js
//一级主页
var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
		couponTypes: { code: ['CASH', 'DISCOUNT'], name: ['代金券', '折扣券'] },
	},
	bindDateChange:function(e){
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
	bindSexChange:function(e){
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
	bindBlur:function(e){
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData:this.inputData
		})
	},
	formSubmit: function (e){
		var _this = this;
		var fields = this.data.fields;
		var mustInput = this.mustInput;
		
		let err_msg='';
		for(var i=0;i<fields.length;i++){
			if (mustInput.includes(parseInt(fields[i].status))  && !_this.inputData[fields[i].name]) {
				err_msg = fields[i].text  + '为必填项';
				break;
			}
		}
		if (!!err_msg){
			app.alertMsg(err_msg);
			return false;
		}
		
		wx.showLoading({ title: '正在提交' })
		app.http.post('Login/saveInfo', _this.inputData, function (json) {
			wx.hideLoading();
			if (json.success == 1) {
				wx.setStorageSync('vip_info', json.vip_info);
				app.alertMsg(json.msg,{
					cb: app.jumpToMainPage
				});
			} else {
				app.alertMsg(json.msg);
			}
		});
	},
	
	onLoad: function (res) {
		var _this = this;
		this.phone = res.phone || '13640883713';
		if(!this.phone){
			app.alertMsg('缺少参数',{
				cb:app.goBack
			})
		}
		this.inputData = {phone:this.phone};
		app.updateIconStyle(this);
		app.userLoginPromise
			.then(json => {
				//判断会员
				let vip_info = wx.getStorageSync('vip_info');
				if (!vip_info) {
					wx.showLoading({title: '正在加载'})
					app.http.post('Login/getVipSignFields', {}, function (json) {
						if(json.success==1){
							wx.hideLoading();
							
							var sex_code = [];
							var sex_name = [];
							json.sex_codes.forEach(function(item){
								sex_code.push(item.code_num);
								sex_name.push(item.code_name);
							});
							var sex_codes = {
								code:sex_code,
								name: sex_name,
							};
							_this.setData({
								'loadend':true,
								'fields': json.fields,
								'sex_codes': sex_codes
							});
							_this.mustInput = json.mustInput || [2, 3];
						}else{
							app.alertMsg('加载失败');
						}
					});
				} else {
					//跳至会员中心
					app.jumpToMainPage();
				}
			})
		
	}
})
