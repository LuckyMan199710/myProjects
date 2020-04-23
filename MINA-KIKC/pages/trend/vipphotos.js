// pages/trend/vipphotos.js
var app = getApp()
var page = 1;
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/trend/vipphotos',
    info: '',
    scrollTop: 0
  },
  onLoad: function (options) {
    let that = this;
    this._options = options
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        //将高度乘以换算后的该设备的rpx与px的比例
        that.setData({
          height: windowHeight
        })
      }
    })
  },
  
  onReady: function () {
    wx.setNavigationBarTitle({ title: '个人作品' });
  },
  getviprank: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.http.post('FashPhoto/viprank', { vipid: that._options.vipid }, function(res){
      wx.hideLoading()
      if (res.success !== 1) return false;
      let data = res.data;
      that.setData({
        info: data
      })
    })
  },
  // 获取某个会员的所有公开作品列表
  getvipphotos: function () {
    let that = this;
    let zdy = {
      page: page,
      size: 10,
      vipid: that._options.vipid
    }
    wx.showLoading({
      title: '加载中...',
      mark: true
    })
    app.http.post('FashPhoto/vipphotos', zdy, function (res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      for (let i = 0; i < res.data.billlist.length; i++) {
        let timeStamp = new Date(res.data.billlist[i].createdate.replace(/-/g, "/")).getTime() / 1000;
        res.data.billlist[i].createdate = app.simplyTime(timeStamp)
      }
      console.log('获取当前会员的所有作品', res)
      if (page == 1) {
        that.setData({
          photolist: res.data.billlist || [],
          dataend: res.data.is_end
        })
      } else {
        var l = that.data.photolist;
        for (var i = 0; i < res.data.billlist.length; i++) {
          l.push(res.data.billlist[i])
        }
        that.setData({
          dataend: res.data.is_end,
          photolist: l
        });
        that.setData({
          lod: false,
        });
      }
      console.log('photolist', that.data.photolist)
    })
  },
  handleDetail: function (e) {
    let photoid = e.currentTarget.dataset.photoid
    wx.navigateTo({
      url: '/pages/trend/detail?photoid=' + photoid
    })
  },
  // 滑到底部
  handleReach: function (e) {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      that.getvipphotos();
    }
  },
  onShow: function () {
    this.getviprank();
    this.getvipphotos();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})