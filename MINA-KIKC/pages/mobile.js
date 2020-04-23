//main.js
//一级主页
var app = getApp()
Page({
	data: {
		is_fillinfo:false,
		'base_conf': app.DF,
	},
	bindBlurF: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
	bindBlur:function(e){
		let id = e.currentTarget.id;
		if(id=='phone'){
			this.phone = e.detail.value;
		}
		if (id == 'code') {
			this.code = e.detail.value;
		}
	},
	getPhoneNumber:function(e){
		//读取微信原生手机号
		var wxphone = wx.getStorageSync('wxphone');
		if (wxphone){
			this.setData({'wxphone':wxphone})
			this.phone = wxphone;
		}else{
			app.http.post('Login/decryptWxPhone', { iv: e.detail.iv, encryptedData: e.detail.encryptedData},(json)=>{
				if(json.success==1){
					wx.setStorageSync('wxphone', json.phone);
					this.setData({ 'wxphone': json.phone })
					this.phone = wxphone;
				}else{
					app.alertMsg(json.msg+',请手工输入手机号');
				}
			})
		}
	},
	//发送短信
	bindSendSms:function(e){
		var _this = this;
		if(this.data.second>0){
			return false;
		}
		let phone = (this.phone || '').replace(" ", '');
		if (!phone || phone.length!=11){
			app.alertMsg('请输入11位的手机号');
			return false;
		}
		let vip_info = wx.getStorageSync('vip_info');
		if(vip_info.phone && vip_info.phone == phone){
			app.alertMsg('新手机号不能与已绑定手机号相同');
			return false;
		}
		app.http.post("Login/sendSms",{phone:phone},function(json){
			app.alertMsg(json.msg);
			if(json.success==1){
				_this.countDown();
			}
		})
	},
	//计数
	countDown:function(){
		let _this = this;
		let count = 90;
		var countdown = function () {
			count--;
			_this.setData({
				second: count
			})
			if (count > 0) {
				_this.countTimer = setTimeout(function () {
					countdown();
				}, 1000);
			}
		}
		countdown();
	},
	formSubmit: function (e) {//验证手机表单提交
			var _this = this;
			let fields = e.detail.value;
			if(!fields.phone || !fields.code){
				app.alertMsg('手机号和验证码不能为空');
				return false;
			}
			let vip_info = wx.getStorageSync('vip_info');
			if(vip_info.phone && vip_info.phone == fields.phone){
				app.alertMsg('手机号不能与已绑定手机号相同');
				return false;
			}
			
			wx.showLoading({title: '正在验证'})
			app.http.post('Login/validUpdateMobile', fields, function (json) {
				wx.hideLoading();
				if (json.success == 1) {
					wx.setStorageSync('vip_info',json.vip_info);
					app.alertMsg(json.msg,{
						cb:app.goBack
					});
				} else {
					app.alertMsg(json.msg);
				}
			});
	},
	onLoad: function () {
		wx.setNavigationBarTitle({ title: '更换绑定手机号' });
		app.updateIconStyle(this);
		app.userLoginPromise
			.then(json => {
				//判断会员
				let vip_info = wx.getStorageSync('vip_info');
				if (!vip_info) {
					app.jumpToMainPage();
					return false;
				}



			})
	}

})
