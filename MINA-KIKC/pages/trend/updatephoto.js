// pages/trend/updatephoto.js
var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/trend/upload',
    canvasImg: '',
    labelList: [],  // 自定义的标签列表
    content: '',
    fash_id: 0
  },
  onLoad: function (options) {
    this._options = options;
  },
  bindinput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  getphotos: function () {
    let that = this;
    let zdy = {
      photoid: that._options.photoid
    }
    app.http.post('FashPhoto/photoinfo', zdy, function (res) {
      if (res.success !== 1) return false;
      console.log('获取某一作品的详情', res);
      let data = res.data;
      that.setData({
        labelList: data.custom_label,
        photourl: data.photo_url,
        sys_name: data.sys_label[0].name
      })
      console.log('photolist', that.data.photolist)
    })
  },
  // 确定添加
  handleAdd: function (e) {
    if (this.data.content === '') {
      app.alertMsg('输入内容不能为空');
      return false;
    }
    if (this.data.labelList.length >= 6) {
      app.alertMsg('只能提交6个标签');
      return false;
    }
    this.data.labelList.push(this.data.content)
    this.setData({
      'labelList': this.data.labelList,
      content: ''
    })
  },
  handleReduce: function (e) {
    let index = e.currentTarget.dataset.index;
    this.data.labelList.splice(index, 1);
    this.setData({
      'labelList': this.data.labelList
    })
  },
  // 提交并保存
  handleSubmit: function (e) {
    let labels = '';
    let _this = this;
    if (this.data.labelList.length > 0) {
      labels = this.data.labelList.join(';')
    }
    let zdy = {
      photoid: _this._options.photoid,
      labels: labels
    }
    app.http.post('FashPhoto/updatephoto', zdy, function (res) {
      console.log('提交新增的上传作品信息', res)
      wx.hideLoading()
      wx.reLaunch({
        url: '/pages/trend/mine?mineToggle=Y'
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getphotos()
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