var app = getApp()
Page({
  data: {
	  'base_conf': app.DF,
  },
  bindNewAddr: function () {
    page_path: 'pages/address/edit'
  },
  bindDateChange: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
	bindBlur: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},
	bindSelAddr: function (e) {
		wx.setStorageSync('order_addr_lineid', e.currentTarget.id);
		wx.navigateBack({
			delta:1
		});
	},
  initPage: function () {
    var _this = this;
    var option = this._option;
    var vip_address = wx.getStorageSync('vip_address');


    

    if (option.lineid && vip_address) {
      vip_address.forEach((item) => {
        if (item.lineid == option.lineid) {
          item.district = item.state + ',' + item.city + ',' + item.district;
          item.district = item.district.split(',');
          _this.inputData = item;
        }
      })
      _this.setData({
        'inputData': _this.inputData
      })
    } else {
      
      var lat = wx.getStorageSync('lat');
      var lng = wx.getStorageSync('lng');
      var vip_info = wx.getStorageSync('vip_info');

      wx.showLoading({title: '正在定位'});
      app.http.post('Pubdata/getPositionAddr', { lng: lng, lat: lat }, function (json) {
        wx.hideLoading();
        if(json.success==1){
          _this.inputData = {
            'phone': vip_info && vip_info['phone'] || '',
            'district': [json.ipinfo['province'], json.ipinfo['city'], json.ipinfo['district']]
          };
        }else{
          app.alertMsg('定位失败，请手动选择地址')
          _this.inputData = {
            'phone': vip_info && vip_info['phone'] || '',
          };
        }
        _this.setData({
          'inputData': _this.inputData
        })
      });  
    }
    
  }, 
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    if (!this._option.lineid){
			wx.setNavigationBarTitle({ title: '新增地址' });
		}else{
			wx.setNavigationBarTitle({ title: '地址修改' });
		}
  },
	formSubmit: function (e) {
    // console.log(e.detail.value);
		var _this = this;
    var form_data = e.detail.value;

    _this.inputData = Object.assign(_this.inputData,form_data);
    
		var fields = ['收货姓名', '手机号', '区','详细地址'];
		var mustInput = ['relname', 'phone', 'district', 'address'];
		let err_msg = '';
		for (var i = 0; i < mustInput.length; i++) {
			
			if (!_this.inputData[ mustInput[i] ]) {
				err_msg = fields[i] + '为必填项';
				break;
			}
		}
		if (!!err_msg) {
			app.alertMsg(err_msg);
			return false;
		}
    if (_this.inputData.phone.length != 11) {
      app.alertMsg('手机号码为11位数');
      return false;
    }

    _this.inputData.state = _this.inputData.district[0];
    _this.inputData.city = _this.inputData.district[1];
    _this.inputData.district = _this.inputData.district[2];

		wx.showLoading({ title: '正在提交' })
		app.http.post('Member/saveVipAddress', _this.inputData, function (json) {
			wx.hideLoading();
			if (json.success == 1) {
				wx.setStorageSync('refeshAddr', json.newlineid);
				wx.setStorageSync('vip_address', json.data);
				app.alertMsg(json.msg, {
					cb: app.goBack
				});
			} else {
				app.alertMsg(json.msg);
			}
		});
	}
})
