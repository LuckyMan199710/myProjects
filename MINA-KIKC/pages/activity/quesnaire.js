var app = getApp()
Page({
  data: {},
  onReady: function () {
    wx.setNavigationBarTitle({ title: '问卷调查' });
  },
  onLoad: function (option) {
    var _this = this;
    this._option = option;
    app.userLoginPromise
      .then(json => {
        _this.initPage();
        app.updateIconStyle(_this);
      })
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Vote/getVote', {}, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'list': json.list,
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  }
})
