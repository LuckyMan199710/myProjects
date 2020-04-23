// pages/trend/allworks.js
var app = getApp();
var page = 1;
Page({
  data: {
    'ontabpage': 'allworks',
    'base_conf': app.DF,
    page_path: 'pages/trend/allworks',
    imgbase: app.STATIC_URL + 'uploads/',

    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    preIndex: 0,
    curIndex: 0,
    current: 0,

    order: 'createdate', // 排序方式
    scrollTop: 0,
    fashid: ''

  },
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        //将高度乘以换算后的该设备的rpx与px的比例
        that.setData({
          height: windowHeight
        })
      }
    })
    this.getFashlist()
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: '我的潮拍'
    });
  },
  onShow: function() {
    app.updateIconStyle(this);
    // let userinfo = wx.getStorageSync('userinfo')
    // this.setData({
    //   nickName: userinfo.userInfo.nickName
    // })
    

  },
  // 获取banner位数据
  getFashlist: function() {
    let that = this;
    app.http.post('FashPhoto/fashlist', {}, function(res) {
      if (res.success !== 1) return false;
      that.setData({
        banner: res.data,
        current: res.data.length - 1,
        fashid: res.data[res.data.length - 1].fash_id,
        status: res.data[res.data.length - 1].status,
      })
      that.getphotos()
    })
  },
  // 排序
  handleClass: function(e) {
    this.setData({
      order: e.currentTarget.dataset.order,
      scrollTop: 0
    })
    page = 1;
    this.getphotos()
  },
  // 搜索
  handleSearch: function(e) {
    wx.navigateTo({
      url: '/pages/trend/search',
    })
  },
  // 排行榜
  handleRanking: function(e) {
    wx.navigateTo({
      url: '/pages/trend/ranking',
    })
  },
  handleDetail: function(e) {
    let photoid = e.currentTarget.dataset.photoid
    let myself = e.currentTarget.dataset.myself
    wx.navigateTo({
      url: '/pages/trend/detail?photoid=' + photoid + '&myself=' + myself
    })
  },
  //首页切换图片
  onSwiperChange: function(event) {
    let curIndex = event.detail.current;
    this.setData({
      curIndex: curIndex,
      fashid: this.data.banner[curIndex].fash_id,
      status: this.data.banner[curIndex].status,
    })
    if (event.detail.source == "touch") {
      if (event.detail.current == 0) {
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({
          swiperError: swiperError
        })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({
            goodsIndex: this.data.preIndex
          }); //，重置current为正确索引
          this.setData({
            swiperError: 0
          })
        }
      } else { //正常轮播时，记录正确页码索引
        this.setData({
          preIndex: event.detail.current
        });
        this.setData({
          swiperError: 0
        })
      }
    }
    console.log(this.data.curIndex)
    this.getphotos();
  },
  // 获取列表数据
  getphotos: function() {
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
    app.http.post('FashPhoto/allphoto', zdy, function(res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      console.log('获取当前会员的所有作品', res)
      for (let i = 0; i < res.data.billlist.length; i++) {
        let timeStamp = new Date(res.data.billlist[i].createdate.replace(/-/g, "/")).getTime() / 1000;
        res.data.billlist[i].createdate = app.simplyTime(timeStamp)
      }
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
      }
      console.log('that.data.photolist', that.data.photolist)
      
    })
  },
  // 点赞
  handlelike: function(e) {
    let that = this;
    let zdy = {
      photoid: e.currentTarget.dataset.photoid
    }
    let index = e.currentTarget.dataset.index
    let nxtpraise = that.data.photolist[index].liked + 1;
    wx.showLoading({
      title: '正在加载...'
    });
    app.http.post('FashPhoto/liked', zdy, function(res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      console.log('点赞结果', res)
      let param = {};
      let string = "photolist[" + index + "].liked";
      let string2 = "photolist[" + index + "].is_liked";
      param[string] = nxtpraise;
      param[string2] = 'Y';
      that.setData(param);
    })
  },
  // 点击查看某个会员的公开作品
  handleName: function(e) {
    let vipid = e.currentTarget.dataset.vipid
    console.log(e.currentTarget.dataset.vipid)
    if (vipid) {
      wx.navigateTo({
        url: '/pages/trend/vipphotos?vipid=' + vipid,
      })
    }
  },
  // 我要上传
  handleAdd: function (e) {
    let fashid = e.currentTarget.dataset.fashid;
    app.vipLogin(this.data.page_path + app.query2Str(this._option));
    wx.navigateTo({
      url: '/pages/trend/theme?fashid=' + fashid,
    })
  },
  // 滑到底部
  handleReach: function(e) {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      that.getphotos();
    }
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function(res) {
      // wx.hideToast()
      console.log(res, new Date())
    }
  })
}