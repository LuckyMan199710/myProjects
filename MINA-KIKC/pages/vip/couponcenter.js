//获取应用实例
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
		coupons: [],
    navhidden: true,
    page_path: 'pages/vip/couponcenter'
	},
	switchTab: function (event) {
		this.setData({
			curType: event.target.id
		});
	},
  onShow:function(){
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  initPage:function(){
    var _this = this;
    wx.showLoading();
    var shop_id = _this._option.shopid || '';
    app.http.post('Member/getFreeCpns', { 'shopid': shop_id}, function (json) {
      wx.hideLoading();
      let coupons = json.coupons;
      _this.setData({
        'coupons': coupons || [],
        'load_end': true
      });
    })
  },
  onReady:function(){
		wx.setNavigationBarTitle({ title: '领券中心' });
  },
	onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
	},
	bindGetCpn:function(e){
		var couponid = e.currentTarget.id
		var coupondata = this.getCouponById(couponid);
		if (coupondata==false){
			app.alertMsg('读取卡券数据出错');
			return false;
		}
		if(coupondata['card_id']){
			this.getCardSign(coupondata['coupon_id'],function(){
				app.alertMsg('领取成功');
			});
			return false;
		}
		//普通卡券
    wx.showLoading();
		app.http.post('Member/addCouponToVip', { 'coupon_id': coupondata['coupon_id']},function(json){
      wx.hideLoading();
			app.alertMsg(json.msg);
		});
	},
	getCouponById:function(id){
		var target = false;
		this.data.coupons && this.data.coupons.forEach((item)=>{
			if(item.coupon_id == id){
				target = item;
			}
		});
		return target;
	},
	getCardSign: function (coupon_id,callback) {
    wx.showLoading();
		app.http.post('Login/getCouponCardSign', { 'coupon_id': coupon_id}, function (json) {
      wx.hideLoading();
			if (json.success == 1) {
					wx.addCard({
						cardList: [{
							'cardId': json.card_id,
							'cardExt': JSON.stringify(json.cardExt)
						}],
						success: function (res) {
							callback(res);
						},
						fail: function (res) {}
					})
					//add card end
			} else {
				app.alertMsg(json.msg);
			}
		})
	},

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },

})
