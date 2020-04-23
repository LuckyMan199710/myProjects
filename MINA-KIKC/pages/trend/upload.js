// pages/trend/upload.js
var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/trend/upload',
    canvasImg: '',
    labelList: [],  // 自定义的标签列表
    content: '',
    fash_id: 0,
    uploadToggle: 'Y'
  },
  onLoad: function (options) {
    console.log(options)
    app.updateIconStyle(this);
    this.setData({
      canvasImg: options.imgurl,
      fash_id: options.fash_id,
      sys_label: JSON.parse(decodeURIComponent(options.sys_label))
    })
    this.setData({
      uploadToggle: wx.getStorageSync('uploadToggle') || 'Y'
    })
  },
  bindinput: function (e) {
    this.setData({
      content: e.detail.value
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
  handleSubmit: function (e) {
    let labels = '';
    let _this = this;
    if (this.data.labelList.length > 0) {
      labels = this.data.labelList.join(';')
    }
    var pics = [];
    console.log(this.data.canvasImg)
    pics.push(this.data.canvasImg);
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    app.uploadimg(
      {
        url: app.BASE_URL + 'Pubdata/picupload',
        path: pics//这里是选取的图片的地址数组
      },
      function (res) {
        let data = JSON.parse(res);
        console.log('返回的图片路径', JSON.parse(res))
        let zdy = {
          imgpath: data.imgpath,
          fash_id: _this.data.fash_id,
          labels: labels
        }
        app.http.post('FashPhoto/savenewphoto', zdy, function(res){
          console.log('提交新增的上传作品信息',res)
          wx.hideLoading()
          wx.reLaunch({
            url: '/pages/trend/mine?mineToggle=Y'
          })
        })
      }
    );
  },
  handleclose: function (e) {
    this.setData({
      uploadToggle: 'N'
    })
    wx.setStorageSync('uploadToggle', 'N')
  },
  onReady: function () {

  },
  onShow: function () {

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