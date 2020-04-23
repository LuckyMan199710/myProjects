// pages/trend/theme.js
var app = getApp()
let flag = true;
Page({
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/trend/theme',
    bgimgurl: {},
    toggle: true,
    img: {
      top: 0,
      left: 0,
      width: '100%',
      baseScale: 1,
      dataimg: '/images/stage.jpg'
    },
    x: 0,
    y: 0,
    fash_id: 0, // 主题ID
    flat: true,
    sys_name: '',
    operationToggle: 'Y'
  },
  onLoad: function (options) {
    let that = this;
    app.updateIconStyle(this);
    that._options = options;    
    that.setData({
      fash_id: options.fashid
    })
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        //将高度乘以换算后的该设备的rpx与px的比例
        that.setData({
          height: windowHeight
        })
      }
    })
    this.setData({
      operationToggle: wx.getStorageSync('operationToggle') || 'Y'
    })
  },
  distanceList: [0, 0],//存储缩放时,双指距离.只有两个数据.第一项为old distance.最后一项为new distance
  disPoint: { x: 0, y: 0 },//手指touch图片时,在图片上的位置
  imgIdList: {},
  initpage: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    if (_this._options.fashid) {
      let zdy = {
        fash_id: _this._options.fashid
      }
      app.http.fetch('FashPhoto/getFashInfo', zdy, function (res) {
        console.log(res)
        wx.hideLoading();
        let data = res.data;
        let arr = [];
        if (res.success == 1) {
          for (let i = 0; i < res.data.sys_label.length; i++) {
            arr.push(res.data.sys_label[i].name)
          }
          _this.setData({
            bgimgurl: _this.data.imgbase + res.data.bgimgurl,
            sys_label: JSON.stringify(arr),
            sys_name: res.data.sys_label[0].name
          })
        }
      })
    } else {
      app.http.fetch('FashPhoto/getCurrFash', {}, function (res) {
        console.log(res)
        wx.hideLoading();
        let data = res.data;
        let arr = [];
        if (res.success == 1) {
          for (let i = 0; i < res.data.sys_label.length; i++) {
            arr.push(res.data.sys_label[i].name)
          }
          _this.setData({
            bgimgurl: res.data.bgimgurl,
            sys_label: JSON.stringify(arr),
            sys_name: res.data.sys_label[0].name
          })
        }
      })
    }
    
  },
  // 选择图片
  chooseImage: function () {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        _this.data.img.dataimg = tempFilePaths[0]
        _this.setData({
          toggle: false,
          img: _this.data.img
        })
      }
    })
  },
  // 图片初始化位置
  handlereduction: function (e) {
    let scale = wx.getSystemInfoSync().windowWidth / 750;
    let imgwidth = this.data.imgwidth;
    let imgheight = this.data.imgheight;
    if (imgwidth > imgheight) {
      this.data.img.left = 355 * scale * (1 - imgwidth / imgheight)
      this.data.img.top = 0
      this.setData({
        'scaleWidth': 710 * scale * (imgwidth / imgheight),
        'scaleHeight': 710 * scale,
        'img': this.data.img
      })
    } else {
      this.data.img.left = 0
      this.data.img.top = 355 * scale * (1 - imgheight / imgwidth)
      this.setData({
        'scaleWidth': 710 * scale,
        'scaleHeight': 710 * scale * (imgheight / imgwidth),
        'img': this.data.img
      })
    }
  },
  // 图片加载完成后返回的数据
  imgload: function (e) {
    let scale = wx.getSystemInfoSync().windowWidth/750;
    let imgwidth = e.detail.width;
    let imgheight = e.detail.height;
    console.log('图片数据', scale, e.detail.width, e.detail.height)
    this.setData({
      'imgwidth': imgwidth,
      'imgheight': imgheight
    })
    if (imgwidth > imgheight) {
      this.data.img.left = 355 * scale * ( 1 - imgwidth / imgheight)
      this.data.img.top = 0
      this.setData({
        'scaleWidth': 710 * scale * (imgwidth / imgheight),
        'scaleHeight': 710 * scale,        
        'img': this.data.img
      })
    } else {
      this.data.img.left = 0
      this.data.img.top = 355 * scale * (1 - imgheight / imgwidth)
      this.setData({
        'scaleWidth': 710 * scale,
        'scaleHeight': 710 * scale * (imgheight / imgwidth),
        'img': this.data.img
      })
    }
  },
  // 记录最后一次操作的图片位置
  getRect: function () {
    var _this = this;
    _this.setData({
      flat: false
    })
    wx.createSelectorQuery().select('.dtlImg').boundingClientRect(function (rect) {
      _this.data.x = rect.left;//x坐标
      _this.data.y = rect.top;//y坐标
      console.log('最终的x y', rect.left, rect.top, rect)
    }).exec()  
  },

  bindTouchMove: function (e) {
    //一指移动当前图片
    if (e.touches.length == 1 && this.data.flat) {
      this.data.img.left = e.touches[0].clientX - this.disPoint.x
      this.data.img.top = e.touches[0].clientY - this.disPoint.y
      this.setData({ img: this.data.img })
    }
    //二指缩放
    if (e.touches.length == 2) {
      var xMove = e.touches[1].clientX - e.touches[0].clientX
      var yMove = e.touches[1].clientY - e.touches[0].clientY
      var distance = Math.sqrt(xMove * xMove + yMove * yMove);//开根号
      this.distanceList.shift()
      this.distanceList.push(distance)
      if (this.distanceList[0] == 0) { return }
      var distanceDiff = this.distanceList[1] - this.distanceList[0]//两次touch之间, distance的变化. >0,放大图片.<0 缩小图片
      // 假设缩放scale基数为1:  newScale = oldScale + 0.005 * distanceDiff
      var baseScale = this.data.img.baseScale + 0.005 * distanceDiff
      if (baseScale > 0.05) {
        this.data.img.baseScale = baseScale
        var imgWidth = baseScale * parseInt(this.data.img.imgWidth)
        var imgHeight = baseScale * parseInt(this.data.img.imgHeight)
        this.setData({ img: this.data.img })
      } else {
        this.data.img.baseScale = 0.05
        this.setData({ img: this.data.img })
      }
    }
    this.setData({
      scale: this.data.img.baseScale
    })
  },
  /**
   * bindtouchend
   */
  bindTouchEnd: function (e) {
    if (e.touches.length == 2) {//二指缩放
      this.setData({ isCheckDtl: true })
    }
    this.getRect()
  },
  /**
   * bindtouchstart
   */
  bindTouchStart: function (e) {
    console.log(e)
    this.distanceList = [0, 0]//回复初始值
    this.disPoint = { x: 0, y: 0 }
    if (e.touches.length == 1) {
      this.disPoint.x = e.touches[0].clientX - this.data.img.left
      this.disPoint.y = e.touches[0].clientY - this.data.img.top
      this.setData({
        flat: true
      })
    }
  },
  handleSubmit: function (e) {
    var _this = this;
    const ctx = wx.createCanvasContext('myCanvas_A', this);
    var baseWidth = _this.data.scaleWidth * _this.data.img.baseScale;//图片放大之后的宽
    var baseHeight = _this.data.scaleHeight * _this.data.img.baseScale;//图片放大之后的高
    ctx.setFillStyle('#f7f7f7')    //这里是绘制白底，让图片有白色的背景
    ctx.drawImage(_this.data.img.dataimg, this.data.x, this.data.y, baseWidth, baseHeight);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
    console.log('画布数据',ctx, baseWidth, baseHeight, _this.data.img.dataimg)
    ctx.draw();
    wx.showToast({
      title: '上传中...',
      icon: 'loading'
    });//
    setTimeout(function () {//给延时是因为canvas画图需要时间
      wx.canvasToTempFilePath({//调用方法，开始截取
        x: 0,
        y: 0,
        width: 710,
        height: 710,
        destWidth: 750,
        destHeight: 920,
        canvasId: 'myCanvas_A',
        success: function (res) {
          wx.hideLoading()
          console.log('生成的图片路径',res.tempFilePath);
          _this.setData({
            canvasImg: res.tempFilePath
          })
          wx.redirectTo({
            url: '/pages/trend/upload?imgurl=' + res.tempFilePath + '&fash_id=' + _this.data.fash_id + '&sys_label=' + encodeURIComponent(_this.data.sys_label),
          })
        }
      })
    }, 2000)
  },
  handleclose: function (e) {
    this.setData({
      operationToggle: 'N'
    })
    wx.setStorageSync('operationToggle', 'N')
  },
  handleDesc: function (e) {
    this.setData({
      operationToggle: 'Y'
    })
  },
  
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我要上传' });
  },
  onShow: function () {
    this.initpage()
  },
  
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})