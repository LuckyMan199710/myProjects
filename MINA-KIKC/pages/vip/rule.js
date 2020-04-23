var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
	},
  initPage:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Member/viprule', {}, function (json) {
      wx.hideLoading();
      wx.setNavigationBarTitle({ title: json.title || '会员规则' });
      _this.setData({
        'img': json.img,
        'brandimg': json.brandimg

      });
    });
  },
	onLoad: function () {
		var _this = this;
    this.setData({
			'bannarH': app.globalData.sys_info.windowWidth * 120 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight
    });
    app.updateIconStyle(this);
    app.userLoginPromise
      .then(json => {
        _this.initPage();
      })
	}
})
