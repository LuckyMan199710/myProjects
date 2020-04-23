// pages/mall/information.js
var app = getApp()
var pageObj ={
  data: {
    'base_conf': app.DF,
    'ontabpage': 'information',
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/mall/information',
    infor_list: []
  },
  onLoad: function (options) {
    app.updateIconStyle(this);
    wx.setNavigationBarTitle({ title: '潮流资讯' });
    this.getList();
  },
  onPullDownRefresh: function () {
    this.getList()
    wx.stopPullDownRefresh()
  },
  getList: function () {
    let _this = this
    let utoken = wx.getStorageSync("utoken")
    app.http.post('Trend/trendList', { 'utoken': utoken }, function (response) {
      wx.hideLoading();
      console.log('gettrendList  response', response);
      var infor_list = response.data;
      _this.setData({
        'infor_list': infor_list
      })
      for (var i=0;i<infor_list.length;i++) {
        var x = _this.data.infor_list[i].createdate
        var mydate = x.substring(0, x.indexOf(' '))
        console.log(mydate)
        var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
        var monthday = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var str = weekday[new Date(mydate).getDay()] + ' ' + monthday[new Date(mydate).getMonth()] + ' ' + new Date(mydate).getDate()
        _this.data.infor_list[i].createdate = str
      }
      _this.setData({
        'infor_list': _this.data.infor_list
      })
      console.log(_this.data.infor_list)
    });
  }
}

Page(pageObj);