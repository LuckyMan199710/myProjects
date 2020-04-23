var app = getApp();
let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    page_path: 'pages/mall/cpnorderconfirm'
  },
	BindPay:function(e){
		this.buildOrder();
  }, 
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    if ((!option.coupon_id && !option.buycon_num) || !option.shop_id ) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    app.updateIconStyle(this);
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '现金购券订单确认' });
  },
  initPage:function(){
    var _this = this;
    var option = this._option;
    wx.showLoading();
    app.http.post('Order/getCpnOrderInfo', { "coupon_id": option.coupon_id||'' ,'buycon_num':option.buycon_num||''}, function (json) {
      wx.hideLoading();
      if (json.data) {
    	  console.log('getCpnOrderInfo  json',json);
        _this.setData({
          'coupon': json.data,
          'coupon_id': option.coupon_id,
          'shop_id': option.shop_id,
          'buycon_num': option.buycon_num
        });
        _this.renderView();
      } 
      if(json.success==-1){
    	 _this.setData({
    		 msg:json.msg||'无法购买'
    	 }); 
      }
      
    });
  },
  renderView:function(){
	  var coupon = this.data.coupon;
	  if(!coupon){return;}
	  if(coupon['effict_type']=='Y'){
		  if(coupon['fixed_begin_term']==0){
			  coupon['dateval']='当天生效,'+coupon['expireday']+'天后失效';
		  }else{
			  coupon['dateval']=coupon['fixed_begin_term']+'天后生效,'+coupon['expireday']+'天后失效';
		  }
		  
	  }else{
		  coupon['dateval']=coupon['startdate']+'至'+coupon['enddate'];
	  }
	  if(coupon['remark']==''){
		  coupon['remark']='暂无说明';
	  }
	  this.setData({coupon:coupon});
  },
	buildOrder:function(){
		var _this = this;
    if (_this.payinfo){
      _this.wxpay(_this.payinfo);
      return false;
    }
		wx.showLoading();
		app.http.post('Order/buildCpnOrder', {'coupon_id': this.data.coupon_id||'','shop_id':this.data.shop_id||'','buycon_num':this.data.buycon_num||''}, function (json) {
			wx.hideLoading();
			if(json.success==1){
        _this.payinfo = JSON.parse(json.wxPayPara);
        _this.wxpay(_this.payinfo);
			}else{
        app.alertMsg(json.msg, {
          cb: app.goBack
        })
			}
		});
	},
  wxpay: function (payinfo){
    wx.requestPayment({
      'timeStamp': payinfo.timeStamp,
      'nonceStr': payinfo.nonceStr,
      'package': payinfo.package,
      'signType': payinfo.signType,
      'paySign': payinfo.paySign,
      'success': function (res) {
        app.alertMsg('支付成功', {
          cb: app.goBack
        });
      },
      'fail': function (res) { }
    })
  }
};
Page(pageObj);