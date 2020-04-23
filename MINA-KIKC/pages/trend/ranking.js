// pages/trend/ranking.js
var app = getApp();
var page = 1;
Page({
  data: {
    'base_conf': app.DF,
    page_path: 'pages/trend/ranking',
    imgbase: app.STATIC_URL + 'uploads/',
    imgurl: app.STATIC_URL,
    random: Math.random()*10,
    vipid: '',
    myself: ''
  },
  onLoad: function (options) {
    let that = this;
    let vip_info = wx.getStorageSync('vip_info')
    if (vip_info.vip_id) {
      this.setData({
        vipid: vip_info.vip_id
      })
    }
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
    wx.setNavigationBarTitle({ title: '排行榜' });
  },
  getviprank: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.http.post('FashPhoto/viprank', { vipid: that.data.vipid }, function (res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      let data = res.data;
      that.setData({
        myself: data
      })
    })
  },
  getallrank: function () {
    let that = this;
    let zdy = {
      page: page,
      size: 10
    }
    if (that.data.banner) {
      zdy.fash_id = that.data.banner[that.data.curIndex].fash_id
    }
    if (that.data.order) {
      zdy.order = that.data.order
    }
    wx.showLoading({
      title: '加载中...',
      mark: true
    })
    app.http.post('FashPhoto/allrank', zdy, function (res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      console.log('获取所有会员活动总排行', res)
      if (page == 1) {
        that.setData({
          ranklist: res.data.billlist || [],
          dataend: res.data.is_end
        })
      } else {
        var l = that.data.ranklist;
        for (var i = 0; i < res.data.billlist.length; i++) {
          l.push(res.data.billlist[i])
        }
        that.setData({
          dataend: res.data.is_end,
          ranklist: l
        });
        that.setData({
          lod: false,
        });
      }
      console.log('ranklist', that.data.ranklist)
    })
  },
  handleDetail: function (e) {
    let vipid = e.currentTarget.dataset.vipid
    console.log(e.currentTarget.dataset.vipid)
    if (vipid) {
      wx.navigateTo({
        url: '/pages/trend/vipphotos?vipid=' + vipid
      })
    }
  },
  onShow: function () {
    this.getviprank()
    this.getallrank()
    app.updateIconStyle(this);
  },
  // 滑到底部
  handleReach: function (e) {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      that.getallrank();
    }
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