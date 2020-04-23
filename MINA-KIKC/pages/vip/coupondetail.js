//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/vip/coupondetail'
  },
  onShow:function(){
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  initPage:function(){
  	var _this = this;
    var billno = this._option.billno;
    wx.showLoading();
    app.http.post('Member/getCouponDtl', { 'billno': billno }, function (json) {
      wx.hideLoading();
      _this.setData({
        'coupon': json.data,
        'barcodeurl': app.BASE_URL + 'Barcode/getBarcode?code=' + billno
      });
    })
  },
  onReady:function(){
    wx.setNavigationBarTitle({title: '优惠券详情'})
  },
  onLoad: function (option) {
    this._option = option;
    if (!option.billno) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
	}
})
