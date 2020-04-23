// pages/trend/detail.js
var app = getApp();
var page = 1;
Page({
  data: {
    'ontabpage': 'detail',
    'base_conf': app.DF,
    page_path: 'pages/trend/detail',
    imgbase: app.STATIC_URL + 'uploads/',
    photolist: [{i:1}],
    bannerurl: '',  // 头部banner位
    myself: ''
  },
  onLoad: function (options) {
    this._options = options;
    if (options.myself == '' || options.myself == undefined) {
      this.setData({
        myself: false
      })
    } else {
      this.setData({
        myself: options.myself
      })
    }
    
    console.log('详情页返回数据',options)
  },
  // 编辑
  handleEdit: function (e) {
    wx.redirectTo({
      url: '/pages/trend/updatephoto?photoid=' + e.currentTarget.dataset.photoid
    })
  },
  handleDelete: function (e) {
    let photoid = e.currentTarget.dataset.photoid;
    let that = this;
    app.alertDialog('确定要删除？', {
      cb: function (res) {
        if (res) {
          app.http.post('FashPhoto/delphoto', { photoid: photoid }, function (res) {
            if (res.success !== 1) return false;
            wx.redirectTo({
              url: '/pages/trend/mine',
            })
          })
        }
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {
    app.updateIconStyle(this);
    this.getphotos()
  },
  getphotos: function () {
    let that = this;
    let zdy = {
      photoid: that._options.photoid
    }
    app.http.post('FashPhoto/photoinfo', zdy, function (res) {
      if (res.success !== 1) return false;
      console.log('获取某一作品的详情', res);
      let arr = [];
      let timeStamp = new Date(res.data.createdate.replace(/-/g, "/")).getTime() / 1000;
      res.data.createdate = app.simplyTime(timeStamp)
      if (res.data) {
        arr.push(res.data)
      }
      that.setData({
        photolist: arr,
        bannerurl: res.data.bannerurl
      })
      console.log('photolist', that.data.photolist)
    })
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
  handleDetail: function (e) {
    wx.navigateBack({
      delta: 1
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

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}