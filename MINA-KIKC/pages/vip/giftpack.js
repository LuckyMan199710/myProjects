// pages/vip/giftpack.js
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
  data: {
    'base_conf': app.DF,
    'imgbase': app.STATIC_URL + 'uploads/',
    imgpublic: app.STATIC_URL,
    bg_image: '',
    loading: false,
    status: false, // 是否领取过
    couponstatus:'',
    couponmsg:'',
    sendstatus:'',
    sendmsg:'',
    navhidden: true
  },
  onLoad: function (options) {
    if (options.scene) {
      var qrcode_obj = app.decodeURI(options) || "";
      console.log('qrcode_obj', qrcode_obj);
      if (!qrcode_obj || (qrcode_obj && !qrcode_obj['coupon_id'])) {
        app.alertMsg('参数不存在', {
          cb: app.goBack
        })
      }
      options.coupon_id = qrcode_obj['coupon_id'];
    } 
    this._option = options;
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '大礼包' });
  },
  onShow: function () {
    this.getvipscancode()
  },
  getvipscancode: function () {
    let that = this;
    app.http.post('Pubdata/vipscancode', { 'coupon_id': that._option.coupon_id }, function (res) {
      if (res.data.bg_image) {
        that.setData({
          bg_image: res.data.bg_image
        })
      }
      that.setData({
          couponstatus: res.data.couponstatus,
          coupon: res.data,
          loading:false
      })
     
    })
  },
  handlegetGift: function () {
    if (this.data.loading) return false;
    let that = this;
    this.setData({
      loading: true
    });
    app.http.post('Pubdata/getCouponPack', { 'coupon_id': that._option.coupon_id }, function (res) {
      if (res.success !== 1){
        wx.showToast({
          title:res.msg,
          icon: 'success',
          duration: 1500
        });
        that.getvipscancode()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1500
        })
        that.setData({
          loading: false
        })
      }
    })
  },
  handleuse: function () {
    wx.navigateTo({
      url: 'pages/vip/coupon',
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})