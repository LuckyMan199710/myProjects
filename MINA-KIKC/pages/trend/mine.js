// pages/trend/mine.js
var app = getApp();
var page = 1;
Page({
  data: {
    'ontabpage': 'mine',
    'base_conf': app.DF,
    page_path: 'pages/trend/mine',
    imgbase: app.STATIC_URL + 'uploads/',
    photolist: [],
    nickName: '',
    myself: 'Y', // 我的潮拍可编辑
    order: 0,
    mineToggle: 'N'
  },
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo')
    let vipinfo = wx.getStorageSync('vip_info')
    this.setData({
      nickName: userinfo.userInfo.nickName,
      vipid: vipinfo.vip_id
    })
    console.log('用户数据', this.data.nickName, this.data.vipid)
    if (options.mineToggle) {
      this.setData({
        mineToggle: options.mineToggle
      })
    }

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

  },
  
  onShow: function () {
    app.updateIconStyle(this);
    this.getphotos()
  },

  handleDetail: function (e) {
    let photoid = e.currentTarget.dataset.photoid
    let myself = e.currentTarget.dataset.myself
    wx.navigateTo({
      url: '/pages/trend/detail?photoid=' + photoid + '&myself=' + myself
    })
  },
  // 排序
  handleClass: function (e) {
    let order = e.currentTarget.dataset.order;
    this.setData({
      order: e.currentTarget.dataset.order,
      photolist: []
    })
    page = 1;
    if (order == 0) {
      this.setData({myself: 'Y'})
      this.getphotos()
    } else {
      this.setData({ myself: 'N' })
      this.getmylikedphotos()
    }
    
  },
  // 获取作品列表
  getphotos: function () {
    let that = this;
    let zdy = {
      page: page,
      size: 10
    }
    wx.showLoading({
      title: '加载中...',
    })
    app.http.post('FashPhoto/myphotos', zdy, function (res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      for (let i = 0; i < res.data.billlist.length; i++) {
        let timeStamp = new Date(res.data.billlist[i].createdate.replace(/-/g, "/")).getTime() / 1000;
        res.data.billlist[i].createdate = app.simplyTime(timeStamp)
        if (that.data.nickName) {
          res.data.billlist[i].nicker = that.data.nickName;
        }
        if (that.data.vipid) {
          res.data.billlist[i].vip_id = that.data.vipid;
        }
      }
      console.log('获取当前会员的所有作品',res);
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
      console.log('photolist',that.data.photolist)
    })
  },
  // 获取我赞过的人
  getmylikedphotos: function () {
    let that = this;
    let zdy = {
      page: page,
      size: 10
    }
    wx.showLoading({
      title: '加载中...',
    })
    app.http.post('FashPhoto/mylikedphotos', zdy, function (res) {
      wx.hideLoading()
      if (res.success !== 1) return false;
      for (let i = 0; i < res.data.billlist.length; i++) {
        let timeStamp = new Date(res.data.billlist[i].createdate.replace(/-/g, "/")).getTime() / 1000;
        res.data.billlist[i].createdate = app.simplyTime(timeStamp)
      }
      
      console.log('获取当前会员的所有作品', res);
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
      console.log('photolist', that.data.photolist)
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
  // 滑到底部
  handleReach: function (e) {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      if (that.data.order == 0) {
        // order为0代表加载我的潮拍
        that.getphotos()
      } else {
        // order为1代表加载我赞过的人
        that.getmylikedphotos()
      }
    }
  },
  // 点赞
  handlelike: function (e) {
    let that = this;
    let zdy = {
      photoid: e.currentTarget.dataset.photoid
    }
    let index = e.currentTarget.dataset.index
    let nxtpraise = that.data.photolist[index].liked + 1;
    wx.showLoading({
      title: '正在加载...'
    });
    app.http.post('FashPhoto/liked', zdy, function (res) {
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
  //首页切换图片
  onSwiperChange: function (event) {
    if (event.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.current == 0 && this.data.preIndex > 1) {//卡死时，重置current为正确索引
        this.setData({ current: this.data.preIndex });
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ preIndex: this.data.current });
      }
    }
  },
  handleclose: function (e) {
    this.setData({
      mineToggle: 'N'
    })
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