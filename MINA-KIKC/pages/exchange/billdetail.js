// pages/exchange/billdetail.js
var app = getApp();
Page({
  data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
    has_load:false,
    page_path: 'pages/exchange/billdetail'
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Order/getBillInfo', { 'billno': this._option.billno }, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'order': json.bill_info,
          'order_info': json.order_info,
          'has_load': true
        });
      }
    });
  },
  bindProdDetail:function(e){
	  console.log('bindProdDetail  e',e);
	  var plat_num_iid = e.currentTarget.dataset.plat_numiid;
	  if(!plat_num_iid){return ;}
	  wx.navigateTo({url:'/pages/exchange/proddetail?plat_num_iid='+plat_num_iid});
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    if (!option.billno) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '兑换订单详情' });
  }

})