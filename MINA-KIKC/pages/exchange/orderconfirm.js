// pages/mall/main.js
var wig_deliver = require('../../utils/wig_deliver.js');
var app = getApp();

let pageObj = {
  data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/exchange/orderconfirm'
  },
	BindPay:function(e){
		this.buildOrder();
	},
	initPage:function(){
    var _this = this;
    
    if(this._has_load_initdata){return false;}
    this._has_load_initdata = true;

    var goods = _this._goods;
    wx.showLoading();
    app.http.post('Order/getGiftOrderInfo', { 'goods': JSON.stringify(goods) }, function (json) {
      wx.hideLoading();
      if(json.success==1){
        _this.setData({
          'prods': json.data,
          'good_amt': json.good_fee,
          'pay_amt': json.good_fee,
          'vip_point': json.vip_point,
          'post_fee': json.post_fee,
          'afterload':true
        });
      
        _this.initDeiverType(json['deliver_type']);
        _this.validPayCondition();
      }else{
        app.alertMsg('库存不足', {
          cb: function () {
            wx.navigateBack()
          }
        });
      }
		});
	},
  onShow:function(){
    app.checkUserStatus(() => {
      this.initPage();
      if (wx.getStorageSync('refeshAddr')) {
        this.setOrderAddr(wx.getStorageSync('refeshAddr') || '');
        this.bindSetRecAddr();
        wx.setStorageSync('refeshAddr', false);
        this.setData({
          'wig_address_status': false
        })
      }

    });
    app.updateIconStyle(this);
    // var is_reg_jump = wx.getStorageSync('is_reg_jump');
    // if (is_reg_jump) {
    //   this.initPage();
    //   wx.setStorageSync('is_reg_jump', false);
    // } else {
    //     //重绘地址
    //   if (wx.getStorageSync('refeshAddr')){
    //     this.setOrderAddr();
    //     this.bindSetRecAddr();
    //     wx.setStorageSync('refeshAddr', false);
    //   }
    // }
  },
  onReady:function(){
		wx.setNavigationBarTitle({ title: '确认兑换订单' });
  },
  onLoad: function (option) {
		// var _this = this;
    this._option = option;
    if (!option.plat_num_iid || !option.plat_sku_iid){
			app.alertMsg('参数不存在',{
				cb: app.goBack
			})
		}
    this.setData({
      'windowHeight': app.globalData.sys_info.windowHeight,
      'windowWidth': app.globalData.sys_info.windowWidth
    });
    var buyqty = option.buyqty || 1;
    this._goods = { "plat_num_iid": option.plat_num_iid, "plat_sku_iid": option.plat_sku_iid, "buyqty": buyqty };

    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
	
	validPayCondition:function(){
		var pay_amt = this.data.pay_amt;
		var vip_info = wx.getStorageSync('vip_info');
		var passed = false;
		if (pay_amt <= vip_info['point']){
			passed = true;
		}
		this.setData({
			'exchageable': passed
		});
	},
	setOrderAddr: function (lineid) {
		var _this = this;
		if (lineid) {
			var addr = app.getVipAddrById(lineid);
			if (addr) {
				_this.setData({
					'recAddr': addr
				});
        _this._renderPayAmt();
        
        //修改默认地址
        wx.showLoading({ title: '请稍后...' })
        app.http.post('Member/updatedefault', { 'id': addr.id }, function (json) {
          wx.hideLoading();
          if (json.success == -1) {
            app.alertMsg(json.msg);
          } else {
            wx.setStorageSync('vip_address', json.data || []);
          }
        });

				return
			}
		}
		app.getVipDefAddr(function (addr) {
			_this.setData({
				'recAddr': addr
			});
      _this._renderPayAmt();
		},true)
	},

  delOrderAddr: function (lineid) {
    var _this = this;
    if (lineid) {
      var addr = app.getVipAddrById(lineid);
      if (addr) {
        wx.showLoading({ title: '请稍后...' })
        app.http.post('Member/delVipAddress', { 'id': addr.id }, function (json) {
          wx.hideLoading();
          if (json.success == -1) {
            app.alertMsg(json.msg);
          } else {
            _this.setData({
              'wig_address_list': json.data,
            });
            console.log(json.data)
            wx.setStorageSync('vip_address', json.data || []);
          }
        });
        return
      }

    }
  },

	setPickShopAddr: function (shopid) {
		var _this = this;
		this.wig_deliver_getShopbyId(shopid, (shop) => {
			_this.setData({
				'pickAddr': shop,
				'wig_deliver_curpickshop': shop,
				'deliver_type': 'inshop'
			});
      _this._renderPayAmt();
		});
	},
  _renderPayAmt:function () {
    var _this = this;
    var pay_amt = this.data.good_amt;
    if (this.data.deliver_type == 'online') {
      pay_amt = (parseFloat(pay_amt) + parseFloat(this.data.post_fee || 0)).toFixed(0);
    }
    pay_amt = parseInt(pay_amt).toFixed(0);
    _this.setData({
      'pay_amt': pay_amt,
    });
  },
	buildOrder:function(){
		var _this = this;
		var deliver_type = this.data.deliver_type;
		var deliver_id = false;

		if (deliver_type=='inshop'){
			var deliver_id = this.data.pickAddr && this.data.pickAddr['shop_id'] || '';
      if(!this.name || !this.mobile){
        app.alertMsg('取货人姓名或手机未输入');
        return false;
      }
      if (this.mobile.length!=11){
        app.alertMsg('手机号码为11位数');
        return false;
      }
		}
		if (deliver_type == 'online'){
			var deliver_id = this.data.recAddr && this.data.recAddr['id'] || '';
		}

		if (!deliver_id){
      if (deliver_type == 'online') {
        var errmsg = '请填写收货地址';
      } else {
        var errmsg = '请选择取货门店';
      }
      app.alertMsg(errmsg);
      this.setData({
        'wig_address_status': true,
      })
			return false;
		}

		var postdata = {
			"goods": this._goods,
      "deliver": {
        'type': deliver_type, 
        'id': deliver_id,
        'pickername': this.name,
        'pickerphone': this.mobile
      },
      "buyer_message": this.message,
		};
		wx.showLoading({ title: '正在提交...' });
		app.http.post('Order/buildExchOrder', {'orderinfo': JSON.stringify(postdata)}, function (json) {
			wx.hideLoading();
			if(json.success==1){
				app.updateVipPoint(json.lastpoint);
			
				app.alertMsg(json.msg,{
					cb:function(){
						wx.redirectTo({
							url: '/pages/exchange/billdetail?billno='+json.billno,
						})
					}
				})
				return false;
			}else{
				app.alertMsg(json.msg)
			}
		});
	},
  bindBlur: function (e) {
    if (e.currentTarget.dataset.type=='name'){
      this.name = e.detail.value;
    } else if (e.currentTarget.dataset.type == 'message') {
      this.message = e.detail.value;
    }else{
      this.mobile = e.detail.value;
    }
  }
};

Object.assign(pageObj.data, wig_deliver.wig_data);
Object.assign(pageObj, wig_deliver);

Page(pageObj);