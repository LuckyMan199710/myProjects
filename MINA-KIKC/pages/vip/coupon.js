//index.js
//获取应用实例
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
		curType:'W',
    navhidden: true,
		coupons: {
			V: [],
			U: [],
			O: [],
			W: [],
			E: []
		},
    page_path: 'pages/vip/coupon'
	},
	bindViewCoupon:function(e){
		if (e.currentTarget.id){
			wx.navigateTo({
				url: '/pages/vip/coupondetail?billno=' + e.currentTarget.id
			})
		}
	},
	switchTab: function (event) {
		console.log('switchTab event',event);
		this.setData({
			curType: event.currentTarget.id
		});
	},
  onShow:function(){
    app.checkUserStatus(()=>{
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    let coupons = this.data.coupons;
    let type = option && option.type && option.type.toUpperCase()||'';
    if(type && coupons.hasOwnProperty(type)){
    	this.setData({curType:type});
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的优惠券' });
  },
  initPage:function(){
    var _this = this;
    if (this._page_data_load){
      return false;
    }
    this._page_data_load = true;
    //后退不重新加载
    wx.showLoading();
    app.http.post('Member/coupon', {}, function (json) {
      wx.hideLoading();
      let coupons = json.coupons;
      for (let i in coupons) {
        if (!coupons[i]) {
          coupons[i] = []
        }
      }
      console.log('coupons',coupons);
      _this.setData({
        'coupons': coupons,
        'has_loaded': true
      });
    })
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
		app.http.post('Member/addCouponToVip', {'coupon_id': coupondata['coupon_id']},function(json){
    wx.hideLoading();
			app.alertMsg(json.msg);
		});
	},
	getCouponById:function(id){
		var target = false;
		var coupons = this.data.coupons;
		var target_coupons = coupons[this.data.curType];
		target_coupons && target_coupons.forEach((item)=>{
			if(item.coupon_id == id){
				target = item;
			}
		});
		return target;
	},
	bindExchCpn:function(e){
		var _this = this;
		if (e.target.id) {
			var exch_id = e.target.id;
			var e_dataset = e.currentTarget.dataset;
//			if (e_dataset.exchable=='N'){
//				app.alertMsg('积分不足，无法兑换');
//				return false;
//			}
			app.alertDialog('确定兑换?',{
				cb:function(res){
					if(res){
						wx.showLoading({ title: '请稍候' });
						app.http.post('Member/exchCpn', { 'exch_id': exch_id }, function (json) {
							wx.hideLoading();
							app.alertMsg(json.msg);
							if(json.success==1){
								//更新积分
								//_this.reRenderView();
							}
						});
					}
				}
			})
		} else {
			app.alertMsg('兑换失败');
		}
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
