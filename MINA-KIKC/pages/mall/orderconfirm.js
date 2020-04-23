var wig_deliver = require('../../utils/wig_deliver.js');
var app = getApp();

let pageObj = {
  data: {
		imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
		'use_point_pay':false,
		'use_balpay':false,
    page_path: 'pages/mall/orderconfirm',
    payment_type:'N',
    deliver_cod:'N',
    payment_options:[{ 'type': 'N', 'name': '在线支付' }, { 'type': 'Y', 'name': '货到付款' }],
    load_building:false,
    deliver_status: [],
    deliver_index: 0,
    dis_coupon_fee:0,
  },
  bindSetCoupon:function(e){
	  let valid_coupons = this.data.valid_coupons;
    if(!valid_coupons || valid_coupons.length<1){
      return false;
    }
    this.setData({
      wig_coupon_status:true
    });
  },
  wig_coupon_close: function (e) {
    if (e.target.id == 'wig_coupon_close') {
      this.setData({
        'wig_coupon_status': false
      });
    }
  },
  wig_coupon_selectItem:function(e){
    let that = this;
    this.setData({
      'wig_coupon_status': false
    });
    this.setOrderCopon(e.currentTarget.id);
    this.getcheckDeliver().then(()=>{
      that._renderPayAmt();
    })
  },
  // 重新获取快递费用
  getcheckDeliver:function(){
    return new Promise((resolve, reject)=>{
      let _this = this
      var deliver_type = this.data.deliver_type;
      if (deliver_type == 'inshop') {
        var deliver_id = this.data.pickAddr && this.data.pickAddr['shop_id'] || '';
      }
      if (deliver_type == 'online') {
        var deliver_id = this.data.recAddr && this.data.recAddr['id'] || '';
      }
      var postdata = {
        "goods": this.goods,
        "is_buycar": this.isbuycar,
        "deliver": { 'type': deliver_type, 'id': deliver_id, 'pickername': this.name, 'pickerphone': this.mobile, 'selfcode': this.currentCodeNum },
        "buyer_message": this.message,
        "use_point_pay": this.data.use_point_pay,
        "pointpay_amt": (this.data.payment_type != 'N') ? 0 : this.data.pay_point_amt || 0,
        "use_balpay": this.data.use_balpay,
        "balpay_amt": (this.data.payment_type != 'N') ? 0 : this.data.pay_bal_amt || 0,
        "invoice": this.data.invoice,
        "coupon_num": (this.coupon && this.coupon.billno) || '',
        "share_vipid": this.data.share_vipid,
        "payment_type": this.data.payment_type,
      };
      app.http.post('Order/checkDeliver', { 'orderinfo': JSON.stringify(postdata) }, function (res) {
        if (res.success == 1) {
          let data = res.data         
          _this.setData({
            post_fee: data.post_fee,
            remark: data.remark
          });
          _this._renderPayAmt();
          resolve();
        } else {
          reject();
        }
        

      })
    })
    
  },
  setOrderCopon:function(billno){
    var _this = this;
    var coupon = false;
    if (this.data.wig_coupon_curid == billno){
      coupon = false;
      billno = '';
    }else{
      this.data.valid_coupons.forEach(function(item,idx){
        if(item.billno == billno){
          coupon = item;
        }
      });
    }
    this.setData({
      'wig_coupon_curid': billno,
      'coupon': coupon
    })
    this.coupon = coupon;
    this._renderPayAmt();
  },
	BindPay:function(e){
		this.buildOrder();
	},
	bindRadioTap:function(e){
		this.setData({
			'use_point_pay': !this.data.use_point_pay,
		});
    if(!this.data.use_point_pay){
      this.act_point = 0;
    }
		this._renderPayAmt();
	},
	bindRadioTapBal: function (e) {
		this.setData({
			'use_balpay': !this.data.use_balpay,
		});
		this._renderPayAmt();
	},
	bindSetPayment:function(e){
		if(this.data.deliver_cod!='Y'){
			return false;
		}
		this.setData({
			wig_payment_status:true,
			payment_temptype:this.data.payment_type || this.data.payment_options[0]['type'],
		});
	},
	wig_payment_close:function(e){
		
		if (e.target.id == 'wig_payment_close') {
			this.setData({
				wig_payment_status:false,
			});
		}
	},
	wig_payment_switchType:function(e){
		var curtype = e.currentTarget.id;
		this.setData({
			'payment_temptype': curtype
		});
	},
	wig_payment_confirm:function(e){
		this.setData({
			wig_payment_status:false,
			payment_type:this.data.payment_temptype,
		});
	},
	//校验逻辑
	_validPointInput:function(v){
		var vip_point_rate = this.data.vip_point_rate;
		if (v > this.data.vip_point) {
			app.alertMsg('不能超过用户当前积分');
			return false;
		}
		var inputAmt = v / vip_point_rate;
    if (inputAmt > parseFloat(this._getAllowPointAmt()) ) {
			app.alertMsg('不能超过应付金额');
			return false;
		}

    if (inputAmt > this.data.mall_point_max) {
      app.alertMsg('不能超过积分支付上限');
      return false;
    }

    this.act_point = v;
		return inputAmt;
	},
	_validBalInput:function(v){
		if (v > this.data.vip_amt) {
			app.alertMsg('不能超过用户当前余额');
			return false;
		}
    if (v > parseFloat(this._getAllowBalAmt()) ) {
			app.alertMsg('不能超过应付金额');
			return false;
		}
		return v;
	},
  // 更改货物状态
  bindDeliverChange: function (e) {
    var index = e.detail.value;
    this.currentCodeNum = this.data.deliver_status[index].code_num; // 这个currentCodeNum就是选中项的code_num
    this.setData({
      deliver_index: e.detail.value
    })
  },
	bindPointPayBlur: function(e){
		var v = e.detail.value;
		var inputAmt = this._validPointInput(v);
		if (inputAmt==false){
			this.setData({
				'input_point': '',
				'pay_point_amt': 0
			});
		}else{
			this.setData({
				'pay_point_amt': inputAmt,
			});
		}
		this._renderPayAmt();
	},
  bindPointBlur: function(e){
    var v = e.detail.value;
    var inputAmt = this._validPointInput(v);
    if (inputAmt == false) {
      this.setData({
        'input_point': '',
        'pay_point_amt': 0
      });
    } else {
      this.setData({
        'pay_point_amt': inputAmt,
      });
    }
    let that = this
    this.getcheckDeliver().then(() => {
      that._renderPayAmt();
    })
  },
	bindBalPayBlur: function (e) {
		//填写余额付款金额
		var v = e.detail.value;
		var inputAmt = this._validBalInput(v);
		if (inputAmt === false) {
			this.setData({
				'input_bal': '',
				'pay_bal_amt': 0
			});
		} else {
			this.setData({
				'pay_bal_amt': inputAmt,
			});	
		}
		this._renderPayAmt();
	},
  //扣掉优惠加上运费
  _getFiexAmt: function (is_point_calc) {
    var pay_amt = this.data.good_amt - (this.data.ttl_disc_fee || 0);
    if (this.coupon) {
      if (this.coupon.coupon_type == "CASH"){
        pay_amt = (parseFloat(pay_amt) - parseFloat(this.coupon.amount || 0)).toFixed(2);
      } else if (this.coupon.coupon_type == "DISCOUNT"){
        var dis_coupon_fee = pay_amt - Math.round((parseFloat(pay_amt) * parseFloat(this.coupon.amount || 1)) * 100) / 100;
        dis_coupon_fee = Math.round((dis_coupon_fee) * 100) / 100;
        console.log('折扣',dis_coupon_fee);
        this.setData({
          'dis_coupon_fee': dis_coupon_fee,
        });	
        pay_amt = Math.round((parseFloat(pay_amt) * parseFloat(this.coupon.amount || 1)) * 100) / 100;
      }
      
      if (parseFloat(pay_amt) < 0) {
        pay_amt = 0;
      }
    }
    if (is_point_calc){
      return pay_amt;
    }
    if (this.data.deliver_type == 'online') {
      pay_amt = (parseFloat(pay_amt) + parseFloat(this.data.post_fee || 0)).toFixed(2);
    }
    return pay_amt;
  },
  //允许使用的余额
  _getAllowBalAmt:function () {
    var pay_amt = this._getFiexAmt(false);
    if (this.data.use_point_pay) {
      pay_amt = (parseFloat(pay_amt) - parseFloat(this.pay_point_amt || 0)).toFixed(2);
    }
    return pay_amt;
  },
  //允许使用的积分
  _getAllowPointAmt:function () {
    var pay_amt = this._getFiexAmt(true);
    if (this.data.use_balpay) {
      pay_amt = (parseFloat(pay_amt) - parseFloat(this.pay_bal_amt || 0)).toFixed(2);
    }
    return pay_amt;
  },
	_renderPayAmt(){

    var pay_amt = this._getFiexAmt(false);

		if (this.data.use_point_pay) {
      pay_amt = (parseFloat(pay_amt) - parseFloat(this.data.pay_point_amt || 0)).toFixed(2);
		}
		if (this.data.use_balpay) {
      pay_amt = (parseFloat(pay_amt) - parseFloat(this.data.pay_bal_amt || 0)).toFixed(2);
		}
		this.setData({
			'pay_amt': pay_amt
		});
	},

	onShow:function(){
    app.checkUserStatus(() => {
      this.initPage(()=>{
        if (this.data.allow_invoice){
          this.initInvoice();
        }
        let vip_info = wx.getStorageSync('vip_info');
        if (vip_info) {
          this.name = vip_info.vip_name;
          this.mobile = vip_info.phone;
          this.setData({
            user_name: vip_info.vip_name,
            user_phone: vip_info.phone
          })
        }
        //页面返回数据判断重绘地址
        if (wx.getStorageSync('refeshAddr')){
          this.setOrderAddr(wx.getStorageSync('refeshAddr') || '');
          this.bindSetRecAddr();
          wx.setStorageSync('refeshAddr', false);
          this.setData({
            'wig_address_status':false
          })
        }

      });
    });
	},
  
  initPage: function (callback) {
    var _this = this;
    var option = this._option;

    if(this._init_data_loaded){
      typeof callback === 'function' && callback();
      return false;
    }

    wx.showLoading();
    app.http.post('Order/getMallOrderInfo', { 'goods': JSON.stringify(_this.goods), 'is_buycar': _this.isbuycar }, function (json) {
      console.log('getMallOrderInfo json',json)
      console.log('getMallOrderInfo goods',_this.goods)
      wx.hideLoading();
      _this._init_data_loaded = true;
      if (json.success == 1) {


        var def_deliver_type = (json['deliver_type'] == 1)?'inshop':'online';
        wx.setStorageSync('order_deliver_type', def_deliver_type);
        console.log('promo_prods',json.promo_prods);
        console.log('shop_prods',json.shop_prods);
        _this.setData({
          'promo_prods': json.promo_prods,
          'shop_prods': json.shop_prods,
          'valid_coupons': json.valid_coupons || [],
          'coupon_message': json.coupon_message,
          'ttl_disc_fee': json.ttl_disc_fee,
          'good_amt': json.ttl_prod_fee,

          'allow_usepoint': json.allow_usepoint,
          'vip_point_rate': json.vip_point_rate,
          'mall_point_max': json.mall_point_max,

          'allow_balpay': json.allow_balpay,
          'vip_point': json.vip_point,
          'vip_amount': json.vip_amount,
          'post_fee': json.post_fee,
          'remark': json.remark,
          'share_vipid': option.share_vipid || '',

          'deliver_type': def_deliver_type,
          'deliver_type_code': json['deliver_type'],

          'allow_invoice': json['allow_invoice'],
		  'order_remark': json['order_remark'],
          'deliver_cod': json['deliver_cod']||'N',
          'deliver_status': json['selfcode']||[],
          
        });
        _this.currentCodeNum = json['selfcode'][0].code_num || ''
        //检测是否允许结算
        if (json.allow_build == 'N') {
          app.alertMsg(json.msg, {
            cb: app.goBack
          });
          return false;
        }

        _this.initDeiverType(json['deliver_type']);
        
        typeof callback === 'function' && callback();

      } else {
        app.alertMsg(json.msg, {
          cb: app.goBack
        });
        return false;
      }
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '确认订单' });
  },
  onLoad: function (option) {
    this._option = option;
    this.setData({
      'windowWidth': app.globalData.sys_info.windowWidth,
      'windowHeight': app.globalData.sys_info.windowHeight
    });
    console.log('orderconfirm  onload  option',option);
    app.updateIconStyle(this);
    this.isbuycar = 'Y'
    this.goods = '';
    if (option.plat_num_iid && option.plat_sku_iid){
      this.isbuycar = 'N'
      this.goods = { 'plat_num_iid': option.plat_num_iid, 'plat_sku_iid': option.plat_sku_iid, 'buyqty': option.buyqty || 1};
		}
    //参团id
    if(option.group_id){
    	this.goods['group_id'] = option.group_id;
    }
    //活动类型
    if(option.gifttype){
    	this.goods['gifttype'] = option.gifttype;
    }
    if(option.promo_num){
    	this.goods['promo_num'] = option.promo_num;
    }

    app.vipLogin(this.data.page_path + app.query2Str(option));
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
			})
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
		});
	},
  initInvoice:function(){
    //发票信息
    var invoice = wx.getStorageSync('invoice');
    if(!invoice){
      invoice = {'invoice_type':'N'}
    }
    var invoiceTxt = {'N':'不开票','P': '个人','C': '公司'};
    var invoice_type = invoice['invoice_type'];
    var invoice_tip = invoiceTxt[invoice_type];
    if (invoice_type!='N'){
      invoice_tip += '/' + invoice['invoice_name']
    }
    this.setData({
      'invoice_tip': invoice_tip,
      'invoice': invoice
    })
  },
	buildOrder:function(){
		var _this = this;
		if(this.data.load_building){
			return false;
		}
		var deliver_type = this.data.deliver_type;
		var deliver_id = false;

		if (deliver_type=='inshop'){
			var deliver_id = this.data.pickAddr && this.data.pickAddr['shop_id'] || '';
      if (!this.name || !this.mobile) {
        app.alertMsg('取货人姓名或手机未输入');
        return false;
      }
      if (this.mobile.length != 11) {
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
      }else{
        var errmsg = '请选择取货门店';
      }
      app.alertMsg(errmsg);
      this.setData({
        'wig_address_status': true,
      })
			return false;
		}

		var postdata = {
			"goods": this.goods,
			"is_buycar": this.isbuycar,
      "deliver": { 'type': deliver_type, 'id': deliver_id, 'pickername': this.name, 'pickerphone': this.mobile, 'selfcode': this.currentCodeNum},
      "buyer_message": this.message,
			"use_point_pay": this.data.use_point_pay,
			"pointpay_amt": (this.data.payment_type!='N')?0:this.data.pay_point_amt||0,
			"use_balpay": this.data.use_balpay,
			"balpay_amt": (this.data.payment_type!='N')?0:this.data.pay_bal_amt||0,
			"invoice": this.data.invoice,
      "coupon_num": (_this.coupon && _this.coupon.billno) || '',
      "share_vipid": this.data.share_vipid,
      "payment_type":this.data.payment_type,
		};

    if (postdata.use_point_pay && (_this.act_point % _this.data.vip_point_rate) != 0) {
      app.alertMsg('使用积分，请输入' + _this.data.vip_point_rate + '的整数倍');
      return false;
    }
console.log('postdata',postdata);
//return false;
		_this.setData({load_building:true});
		wx.showLoading({ title: '正在提交...' });
		app.http.post('Order/buildMallOrder', {'orderinfo': JSON.stringify(postdata)}, function (json) {
			wx.hideLoading();
			_this.setData({load_building:false});
			if(json.success==-1){
				app.alertMsg(json.msg);
				return false;
			}
			console.log('buildMallOrder  json',json);
			if(json.is_group=='K'){
				_this.jumpPage(json);
				return false;
			}
			if (json.is_payed=='N'){
				var payinfo = JSON.parse(json.wxPayPara);
				wx.requestPayment({
					'timeStamp': payinfo.timeStamp,
					'nonceStr': payinfo.nonceStr,
					'package': payinfo.package,
          'signType': payinfo.signType,
					'paySign': payinfo.paySign,
					'success': function (res) {
						_this.jumpPage(json);
					 },
					'fail': function (res) { 
						//开团待付款或参团待付款
						if(json.group_id && json.is_group=='Y'){
							
							wx.redirectTo({
								url: '/pages/mall/orderdetail?paybillno='+json.data,
							});
							return false;
						}else{
							_this.jumpPage(json)
						}
					}
				})
			}else{
				_this.jumpPage(json);
			}
		});
	},
  jumpPage:function(json){
	  var target_url = '';
	  if(json.group_id){
		  if(json.is_group=='Y'){
			  target_url = '/pages/mall/groupdetail?group_id='+json.group_id+'&group_type=S';
		  }else if(json.is_group=='K'){
			  target_url = '/pages/mall/bargaindetail?group_id='+json.group_id+'&group_type=S';
			  if(json.bargain_amt){
				  target_url = target_url+'&bargain_amt='+json.bargain_amt;
			  }
		  }
		  
	  }else{
		  target_url = '/pages/mall/orderdetail?paybillno='+json.data;
	  }
	  wx.redirectTo({
			url: target_url,
		});
  },
  bindBlur: function (e) {
    if (e.currentTarget.dataset.type == 'name') {
      this.name = e.detail.value;
    } else if (e.currentTarget.dataset.type == 'message'){
      this.message = e.detail.value;
    } else {
      this.mobile = e.detail.value;
    }
  }

};

Object.assign(pageObj.data, wig_deliver.wig_data);
Object.assign(pageObj, wig_deliver);

Page(pageObj);