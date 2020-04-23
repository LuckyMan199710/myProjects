// pages/trend/search.js
var app = getApp();
var page = 1;
Page({
  data: {
    'ontabpage': 'search',
    'base_conf': app.DF,
    page_path: 'pages/trend/search',
    imgbase: app.STATIC_URL + 'uploads/',
    searchcon: '',
    labelid: '',
    historyList: '',
    order: 'createdate',
    scrollTop: 0,
    searchflat: true, // 显示搜索条件为true，列表为false
  },
  onLoad: function (options) {
    let that = this;
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
    wx.setNavigationBarTitle({ title: '搜索' });
  },
  handleSearch: function (e) {
    this.setData({
      searchcon: e.detail.value
    })
  },
  // 获取焦点时，清空输入框
  handleFocus: function (e) {
    this.setData({
      searchcon: '',
      labelid: '',
      searchflat: true,   // 获取焦点时，返回搜索页面
      historyList :wx.getStorageSync('photo_search')
    })
  },
  // 搜索
  handleSubmit: function () {
    console.log(this.data.searchcon)
    this.setData({
      searchflat: false
    })
    page = 1;
    this.getphotos()
    // 将输入框内容存入内存
    let search_arr = wx.getStorageSync('photo_search') || [];
    if (search_arr.length > 9) {
      search_arr.pop()
    }
    if (search_arr.length > 0) {
      for (let i = 0; i < search_arr.length; i++) {
        if (search_arr[i] === this.data.searchcon) {
          return false;
        }
      }
    }
    search_arr.unshift(this.data.searchcon);
    wx.setStorageSync('photo_search', search_arr)    
  },
  // 排序
  handleClass: function (e) {
    this.setData({
      order: e.currentTarget.dataset.order,
      scrollTop: 0
    })
    page = 1;
    this.getphotos()
  },
  // 获取主题搜索发现
  getFashlabels: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.http.post('FashPhoto/fashlabels', {}, function (res) {
      wx.hideLoading();
      if (res.success != 1) return false;
      that.setData({
        findList: res.data
      })
    })
  },
  // 点击历史搜索
  handleHistory: function (e) {
    this.setData({
      searchcon: e.currentTarget.dataset.name,
      searchflat: false
    })
    this.getphotos()
  },
  // 点击搜索发现
  handleFind: function (e) {
    this.setData({
      searchcon: e.currentTarget.dataset.name,
      labelid: e.currentTarget.dataset.labelid,
      searchflat: false
    })
    this.getphotos()
  },
  
  // 获取列表信息
  getphotos: function () {
    let that = this;
    let zdy = {
      page: page,
      size: 10
    }
    if (that.data.order) {
      zdy.order = that.data.order
    }
    if (that.data.searchcon) {
      zdy.label = that.data.searchcon
    }
    if (that.data.labelid) {
      zdy.labelid = that.data.labelid;
      zdy.label = ''
    }
    wx.showLoading({
      title: '加载中...',
      mark: true
    })
    app.http.post('FashPhoto/allphoto', zdy, function (res) {
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
        stopPullDownRefresh();
      } else {
        var l = that.data.photolist;
        for (var i = 0; i < res.data.billlist.length; i++) {
          l.push(res.data.billlist[i])
        }
        that.setData({
          dataend: res.data.is_end,
          photolist: l
        });
        stopPullDownRefresh();
        that.setData({
          lod: false,
        });
      }
      console.log('photolist', that.data.photolist)
    })
  },

  onShow: function () {
    this.getFashlabels()
    app.updateIconStyle(this);
    this.setData({
      historyList: wx.getStorageSync('photo_search')
    })
  },
  // 点击查看某个会员的公开作品
  handleName: function (e) {
    let vipid = e.currentTarget.dataset.vipid
    console.log(e.currentTarget.dataset.vipid)
    if (vipid) {
      wx.navigateTo({
        url: '/pages/trend/vipphotos?vipid=' + vipid,
      })
    }
  },
  handleDetail: function (e) {
    let photoid = e.currentTarget.dataset.photoid
    let myself = e.currentTarget.dataset.myself
    wx.navigateTo({
      url: '/pages/trend/detail?photoid=' + photoid + '&myself=' + myself
    })
  },
  handleReach: function () {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      that.getphotos();
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

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}