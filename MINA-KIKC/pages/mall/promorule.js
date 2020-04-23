var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
    billno:0,
	},
  initPage:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Mall/promorule', {billno:this.data.billno}, function (json) {
      wx.hideLoading();
      console.log('promorule  json',json);
      _this.setData({
        'img': json.img,

      });
    });
  },
	onLoad: function (option) {
    console.log(option);
		var _this = this;
		wx.setNavigationBarTitle({ title:'活动规则' });
    this.setData({
			'bannarH': app.globalData.sys_info.windowWidth * 120 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight,
      'billno':option.billno,
    });
    app.updateIconStyle(this);
    app.userLoginPromise
      .then(json => {
        _this.initPage();
      })
	}
})
