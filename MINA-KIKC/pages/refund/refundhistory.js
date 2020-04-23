var app = getApp()
var AddlogisIns = require('../../utils/wig_logis.js');

var pageObj = {
	data: {
    page_path: 'pages/refund/refundhistory',
    hidden:true
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的退换货' });
  },
	initPage:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Order/refundlists', {}, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'refundlists': json.data || [],
          'loaded':true
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  formSubmit: function (e) {
    var post_data = e.detail.value;
    var _this = this;
    wx.showLoading();
    app.http.post('Order/updatelogis', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        _this.data.refundlists && _this.data.refundlists.forEach(function (item, index) {
          if (item.refund_id == post_data.refundid) {
            _this.data.refundlists[index].logis_company = post_data.logis_company;
            _this.data.refundlists[index].retinvoiceno = post_data.retinvoiceno;
            _this.setData({
              'refundlists': _this.data.refundlists,
            })
          }
        });
        app.alertMsg(json.msg);
        _this.setData({
          'hidden': true
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  // logis:function(e){
  //   var _this = this;
  //   _this.setData({
  //     'hidden': false,
  //     'refundid': e.currentTarget.dataset.refundid,
  //     'logis_company': e.currentTarget.dataset.logis_company,
  //     'retinvoiceno': e.currentTarget.dataset.retinvoiceno,
  //   });
  // },
  // hidden:function(){
  //   var _this = this;
  //   _this.setData({
  //     'hidden': true
  //   });
  // },
  // formSubmit: function (e) {
  //   var post_data = e.detail.value;
  //   var _this = this;
  //   wx.showLoading();
  //   app.http.post('Order/updatelogis', post_data, function (json) {
  //     wx.hideLoading();
  //     if (json.success == 1) {
  //       app.alertMsg(json.msg);
  //       _this.setData({
  //         'hidden': true
  //       });
  //     } else {
  //       app.alertMsg(json.msg);
  //     }
  //   });
  // },

}

Object.assign(pageObj, AddlogisIns);
Page(pageObj);
