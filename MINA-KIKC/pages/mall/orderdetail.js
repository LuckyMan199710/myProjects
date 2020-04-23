var app = getApp();
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    navhidden: true,
    page_path: 'pages/mall/orderdetail',
    show: true,
  },
	BindPay:function(e){
		this.buildOrder();
	},
	bindProdDetail:function(e){
		  console.log('bindProdDetail  e',e);
		  var plat_num_iid = e.currentTarget.dataset.plat_numiid;
		  if(!plat_num_iid){return ;}
		  var group_id = e.currentTarget.dataset.group_id;
		  var is_group = e.currentTarget.dataset.is_group;
		  if(group_id){
			  if(is_group=='Y'){
				  wx.navigateTo({url:'/pages/mall/groupdetail?group_id='+group_id});
			  }else if(is_group=='K'){
				  wx.navigateTo({url:'/pages/mall/bargaindetail?group_id='+group_id});
			  }
			  
		  }else{
			  wx.navigateTo({url:'/pages/mall/proddetail?plat_num_iid='+plat_num_iid});
		  }
	},
	catchBubbling:function(e){
		//阻止事件冒泡
	},
  onShow: function (){
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '订单详情' });
  },
  onLoad: function (option) {
    this._option = option;
    if (!option.paybillno){
			app.alertMsg('参数不存在',{
				cb: app.goBack
			})
      return false;
		}
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  initPage:function(){
    var _this = this;
    var option = this._option;
    wx.showLoading();
    app.http.post('Order/getMallOrderById', { "paybillno": option.paybillno }, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'order': json.order,
          'orderitem': json.orderitem,
          'order_billnos': json.order_billnos,
          'msg':json.msg||'',
        });

      } else {
        app.alertMsg(json.msg, {
          cb: app.goBack
        })
      }
    });
  },
  /* 折叠框实现 */
  showView: function () {
    let that = this;
    that.setData({
      show: (!that.data.show)
    })
  },
	buildOrder:function(){
		var _this = this;
	if(this.data.msg){
    	app.alertMsg(this.data.msg);
    	return false;
    }
    wx.showLoading();
    app.http.post('Order/wxPay', { 'paybillno': this._option.paybillno }, function (json) {
      wx.hideLoading();
      if (json.success == -1) {
        app.alertMsg(json.msg);
        return false;
      }
      if (json.is_payed == 'N') {
        var payinfo = JSON.parse(json.wxPayPara);
        wx.requestPayment({
          'timeStamp': payinfo.timeStamp,
          'nonceStr': payinfo.nonceStr,
          'package': payinfo.package,
          'signType': payinfo.signType,
          'paySign': payinfo.paySign,
          'success': function (res) {
        	  if(!json.lottery){
        		  wx.redirectTo({
                      url: '/pages/mall/orderdetail?paybillno=' + json.data,
                    })
        	  }else{
        		  var target_url = '';
        		  if(json.lottery.gametype=='T'){
        			  target_url = '/pages/game/zhuanpan?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='C'){
        			  target_url = '/pages/game/guaka?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='E'){
        			  target_url = '/pages/game/jindan?billno=' + json.lottery.billno;
        		  }
        		  if(json.is_group=='K'){
        			  app.alertMsg('砍价商品订单支付成功,获得抽奖机会',{cb:function(){
        				  wx.redirectTo({
                              url: target_url,
                            });
        			  }});
        			  return false;
        		  }
        		  wx.redirectTo({
                      url: target_url,
                    });
        	  }
            
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/mall/orderdetail?paybillno=' + json.data,
            })
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/mall/orderdetail?paybillno=' + json.data,
        })
      }
    });

	},
  OrderCancel:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Order/cancelOrder', { "paybillno": this._option.paybillno }, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        app.alertMsg(json.msg, {
          cb: function () {
            wx.redirectTo({
              url: '/pages/mall/orderdetail?paybillno=' + _this._option.paybillno,
            })
          }
        })
      } else {
        app.alertMsg(json.msg)
      }
      return false;
    });
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
};
Page(pageObj);