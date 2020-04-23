//main.js
//一级主页
var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
		is_fillinfo:false
	},
  bindPickChange: function (e) {
    console.log(e)
    var id = e.currentTarget.id;
    var value = e.detail.value;
    if(id=='sex'){
      this.inputData['sex_idx'] = value;
      value = this.data.sex_codes[value]['code_num']
    }
    this.inputData[id] = value;
    this.setData({
      inputData: this.inputData
    })
  },
	bindBlurF: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
  bindInputBlur:function(e){
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
			this.setData({'phone':wxphone})
			this.wxphone = wxphone;
			this.phone = wxphone;
		}else{
			app.http.post('Login/decryptWxPhone', { iv: e.detail.iv, encryptedData: e.detail.encryptedData},(json)=>{
				if(json.success==1){
					wx.setStorageSync('wxphone', json.phone);
					this.setData({ 'phone': json.phone })
					this.wxphone = wxphone;
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
			wx.showLoading({title: '正在验证'})
      app.http.post('Login/validMobile', fields, function (json) {
				wx.hideLoading();
				if (json.success == 1) {
          if(json.is_vip=='Y'){
            wx.setStorageSync('vip_info', json.vip_info);
          }

          clearTimeout(_this.countTimer);
          _this.setData({
            'validphone':fields.phone
          });
          _this.loadSignForm(json.is_vip);

					// wx.setStorageSync('vip_info',json.vip_info);
					// app.alertMsg(json.msg,{
					// 	cb:app.goBack
					// });
				} else {
					app.alertMsg(json.msg);
				}
			});
	},
	onLoad: function () {
		wx.setNavigationBarTitle({ title: '会员注册' });
		app.updateIconStyle(this);
		app.userLoginPromise
			.then(json => {
				//判断会员
				let vip_info = wx.getStorageSync('vip_info');
				if (vip_info) {
					app.jumpToMainPage();
					return false;
				}
        // this.loadSignForm('Y');
			})
	},
  loadSignForm: function (is_vip){
    var _this = this;
    //填写会员信息
    wx.showLoading({ title: '正在加载' })
    app.http.post('Login/getVipSignFields', { getvip: is_vip }, function (json) {
      if (json.success == 1) {
        wx.hideLoading();

        //已填写的数据
        _this.inputData = json.vip_info || {};
        _this.inputData.phone = _this.data.validphone;

        _this.inputData.sex_idx = 0;
        if (!_this.inputData.sex) {
          _this.inputData.sex = json.sex_codes[0]['code_num']
        }else{
          _this.inputData.sex_idx = 0;
          json.sex_codes && json.sex_codes.forEach((item,idx)=>{
            if (item.code_num == _this.inputData.sex){
              _this.inputData.sex_idx = idx
            }
          })
        }

        _this.setData({
          'is_fillinfo': true,
          'fields': json.fields,
          'sex_codes': json.sex_codes,
          'inputData': _this.inputData
        });
        _this.mustInput = json.mustInput || [2, 3];
      } else {
        app.alertMsg('加载失败');
      }

    })
  },
  formSubmitInfo: function (e) {
    var _this = this;
    var fields = this.data.fields;
    var mustInput = this.mustInput;

    let err_msg = '';
    for (var i = 0; i < fields.length; i++) {
      if (mustInput.includes(parseInt(fields[i].status)) && !_this.inputData[fields[i].name]) {
        err_msg = fields[i].text + '为必填项';
        break;
      }
    }
    if (!!err_msg) {
      app.alertMsg(err_msg);
      return false;
    }

    wx.showLoading({ title: '正在提交' })
    app.http.post('Login/saveInfo', _this.inputData, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        wx.setStorageSync('vip_info', json.vip_info);
        app.alertMsg(json.msg, {
          cb: app.jumpToMainPage
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  }

})
