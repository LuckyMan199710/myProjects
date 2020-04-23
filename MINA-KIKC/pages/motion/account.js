// pages/motion/account.js
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
var page = 1;
var getData = function (that) {
  app.http.fetch('werun/getVipTrans', { 'page': page, 'size': 20 }, (json) => {
    wx.hideLoading();
    let data = json.data;
    var l = that.data.billlist;
    for (let i = 0; i < data.billlist.length; i++) {
      let reltype = data.billlist[i].reltype;
      let createdate = data.billlist[i].createdate;
      let str;
      let arr = data.billlist[i];
      switch (reltype) {
        case 'exch': str = '兑换物品'
          break;
        case 'login': str = '每日步数'
          break;
      }
      arr.reltype = str;
      if (createdate) {
        arr.createdate = createdate.substring(0, createdate.indexOf(' '));
      }
      l.push(arr)
    }
    console.log(l)
    that.setData({
      lod: false,
      'billlist': l,
      dataend: data.is_end
    })
    wx.stopPullDownRefresh()
    
  });
}
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    navhidden: true,
    page_path: 'pages/vip/point',
    lod: false,
    billlist: [],
    dataend: false
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    page = 1;
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    getData(_this)
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '步数变动' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
    this.setData({
      leftstep: this._option.leftstep
    })
  },
  onPullDownRefresh() {
    // wx.showToast({
    //   title: '刷新中...',
    //   icon: 'loading'
    // })
    var that = this
    page = 1;
    this.setData({
      billlist: [],
    });
    
    getData(that)
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.dataend == false && that.data.lod == false) {
      that.setData({
        lod: true,
      });
      page++;
      getData(that)
    }
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
})
