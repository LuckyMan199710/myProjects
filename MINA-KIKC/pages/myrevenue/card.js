var app = getApp();
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
  data: {
    page_path: 'pages/myrevenue/card',
    'base_conf': app.DF,
    navhidden: true,
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '授权分销申请' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onShow: function () {
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  initPage: function () {
    var _this = this;
    var option = this._option
    wx.showLoading();
    app.http.post('Myrevenue/card', {}, function (json) {
      wx.hideLoading();
      if (json.status==3){
        //已通过分享申请，跳到分享好友二维码页
        wx.navigateTo({
          url: '/pages/mymember/sharefriends'
        })
      }else if(json.status==5){
    	  //未申请
    	  wx.navigateTo({
              url: '/pages/myrevenue/reg'
            }) 
      }else{
        _this.setData({
          'status': json.status,
          'headimgurl': json.headimgurl,
          'leftmoney': json.leftmoney||'',
          'vipmoney': json.vipmoney||0,
          'remarks':json.remarks
        })
      }
    })
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  reapply: function () {
	  console.log('重新申请');
	  //跳转
	  wx.navigateTo({'url':'/pages/myrevenue/reg?action=reapply'});
  },
  shopping: function () {
	  console.log('前往商城');
	  //跳转
	  wx.navigateTo({'url':'/pages/mall/main'});
  },
})