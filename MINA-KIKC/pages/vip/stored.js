// pages/vip/stored.js
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    navhidden: true,
    page_path: 'pages/vip/point'
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Member/getStoreTrans', { 'limit': 'Y' }, (json) => {
      wx.hideLoading();
      this.setData({
        'pointTrans': json.data,
        'is_point_loadmore': !json.hasmore
      })
    });
    var vip_info = wx.getStorageSync('vip_info');
    this.setData({
      'point': vip_info.point
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '储值流水' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  bindLoadMore: function (e) {
    var _this = this;
    var loadtype = e.target.id;
    if (loadtype == 'cpn') {
      app.http.post('Member/getPointTrans', {}, function (json) {
        _this.setData({
          'pointTrans': json.data,
          'is_point_loadmore': true
        });
      });
    }

    if (loadtype == 'prod') {
      app.http.post('Member/getConsumeTrans', {}, function (json) {

        json.data && json.data.forEach(function (item, i) {
          if (!item.cover) {
            json.data[i].cover = 'public_prodcover.jpg'
          }
        });
        _this.setData({
          'consumeTrans': json.data,
          'is_prod_loadmore': true
        })

      })
    }
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
})
