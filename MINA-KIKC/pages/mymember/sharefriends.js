import business from '../../utils/business.js'
var app = getApp();
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
  data: {
    'base_conf': app.DF,
    'imgbase': app.STATIC_URL + 'uploads/',
    page_path: 'pages/mymember/sharefriends',
    load_end: false,
    navhidden: true,
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '分享二维码' });
  },
  onLoad: function (option) {
    // wx.setNavigationBarTitle({ title: '分享二维码' });
    // var _this = this;
    // this._options = options;
    // app.userLoginPromise
    //   .then(json => {

    //     _this._onloadcalled = true;
    //     _this.initPage();

    //   })

    this._option = option;
    app.userLoginPromise.then(json => {

    });//建立连接
    app.updateIconStyle(this);
    //app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onShow: function () {
    // if (this._onloadcalled) {
    //   this.initPage();
    // }

    //app.checkUserStatus(() => {
    //会员才执行;非会员则需等待激活会员卡后执行
    //this.initPage();
    //});

    var _this = this;
    app.checkUserStatusByHand(function () {
      if (!_this.data.load_end) {
        _this.initPage();
      }

    });
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  initPage: function () {
    //var _this = this;
    // var vip_info = wx.getStorageSync('vip_info');
    // if (!vip_info) {
    //   var ret = app.getCardWidget();
    //   return false;
    // }
    // var option = this._option;
    // var imgurl = option.imgurl;
    // imgurl = imgurl.replace('!', "?");
    // imgurl = imgurl.replace('@', "=");
    // var _this = this;
    // _this.setData({
    //   'imgurl': imgurl,
    //   'brandlogo': option.brandlogo,
    // })

    var option = this._option;
    var _this = this;

    console.log('shareFriendss  option');
    console.log(option);
    app.http.post('Mymember/shareFriendss', { "share_vipid": option.share_vipid || '' }, function (json) {
      console.log('Mymember/shareFriendss  json');
      console.log(json);
      if (json.success == 1) {

        _this.setData({
          'imgurl': json.imgurl,
          'brandlogo': json.brandlogo,
          'cover': json.cover,
          'share_images': json.share_images,
          'share_vipid': json.vipid ? json.vipid : option.share_vipid,
          'is_vip': json.vipid ? true : false,
          'load_end': true,
          'headimgurl': json.headimgurl || '',
        })
      } else {
        //app.alertMsg(json.msg);
        var vipinfo = wx.getStorageSync('vip_info');
        _this.setData({ 'is_vip': json.vipid ? true : false, 'load_end': true, });
        if (json.success == -2 || json.success == -1) {

          wx.navigateTo({
            url: '/pages/myrevenue/card'
          })
        } else if (json.success == 0) {
          if (json.is_apply == 'reg') {
            wx.navigateTo({
              url: '/pages/myrevenue/reg'
            })
          } else if (json.is_apply == 'card') {
            wx.navigateTo({
              url: '/pages/myrevenue/card'
            })
          }

        }

      }
    });

    //记录推荐人vipid
    if (option.share_vipid) {
      _this.logVipFriend(option.share_vipid);
    }
  },
  bindPreviewPic: function (e) {
    wx.previewImage({
      current: this.data.imgurl, // 当前显示图片的http链接
      urls: [this.data.imgurl] // 需要预览的图片http链接列表
    })
  },
  signVip: function () {
    console.log('申请会员  signVip');
    //申请会员
    app.vipLogin('pages/main' + app.query2Str(this._option));
  },
  reapply: function () {
    console.log('重新申请');
    //跳转
    wx.redirectTo({ 'url': '/pages/myrevenue/reg?action=reapply' });
  },

  // 生成二维码
  // handleSave() {
  //   this.drawImage()
  // },
  closeMarkShare: function (e) {
    console.log('closeMarkShare  e', e);
    this.setData({ groupvisit: false });
  },
  //画图
  drawImage: function () {
    var self = this;
    console.log('drawImage');
    const wxGetImageInfo = app.promisify(wx.getImageInfo);
    wx.showLoading({
      title: '生成海报中',
      mask: true
    })
    let headimgurl
    if (self.data.headimgurl.indexOf('http:') > -1) {
      headimgurl = self.data.headimgurl.replace('http:', 'https:')
    } else {
      headimgurl = self.data.headimgurl
    }
    Promise.all([
      wxGetImageInfo({
        src: self.data.imgbase + self.data.brandlogo
      }),
      wxGetImageInfo({
        src: headimgurl
      }),
      wxGetImageInfo({
        src: self.data.imgurl
      })
    ]).then(res => {
      const ctx = wx.createCanvasContext('shareCanvas')
      
      // 底图
      ctx.drawImage(res[0].path, 0, 0, 750, 1332)
      business.circularImg(ctx, 305, 90, 140, 140, res[1].path)
      ctx.drawImage(res[2].path, 210, 410, 370, 370)

      
      if (self.data.base_conf['kikcExclusive']) {
        business.canvasTextAutoLine('你好，我是你的时尚搭配师', ctx, 375, 250, 40, 715, 1, 28, '#333333', 'center');
        business.canvasTextAutoLine('我为KIKC代言', ctx, 375, 290, 40, 715, 1, 28, '#333333', 'center');
      }

      ctx.draw(false, (() => {
        self.savePhoto()
      })())

      // ctx.draw()
      // self.setData({ groupvisit: true });
      // wx.hideLoading();

      // ctx.draw(false, function (e) {
      //   // 保存到本地
      //   wx.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     width: 750,
      //     height: 1332,
      //     canvasId: 'shareCanvas',
      //     success: function (res) {
      //       let pic = res.tempFilePath;
      //       console.log('pic', pic)
      //       self.setData({
      //         'shareImg': pic
      //       })
      //       // business.savePic(pic)
      //     },
      //   })
      //   // self.savePhoto()
      // })

    })

  },

  //保存图片到相册
  savePhoto: function () {
    let self = this;
    const wxCanvasToTempFilePath = app.promisify(wx.canvasToTempFilePath);
    const wxSaveImageToPhotosAlbum = app.promisify(wx.saveImageToPhotosAlbum);
    
    wxCanvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1332,
      canvasId: 'shareCanvas'
    }, this).then(res => {
      wx.hideLoading()
      console.log('savePhoto   res001', res);
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      console.log('savePhoto   res002', res);
      wx.showToast({
        title: '已保存到相册'
      });
      self.setData({ groupvisit: false });
    }).catch(err => {
      console.log('保存相册失败   err', err);
      if (err.errMsg.indexOf("saveImageToPhotosAlbum:fail") > -1) {
        // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
        wx.showModal({
          title: '提示',
          content: '需要您授权保存相册',
          showCancel: false,
          success: modalSuccess => {
            wx.openSetting({
              success(settingdata) {
                console.log("settingdata", settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  wx.showModal({
                    title: '提示',
                    content: '获取权限成功,再次点击图片即可保存',
                    showCancel: false,
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '获取权限失败，将无法保存到相册哦~',
                    showCancel: false,
                  })
                }
              },
              fail(failData) {
                console.log("failData", failData)
              },
              complete(finishData) {
                console.log("finishData", finishData)
              }
            })
          }
        })
      }

    });
  },




  logVipFriend: function (prtvipid) {
    if (prtvipid) {
      app.http.post('Member/logVipFriend', { 'prtvipid': prtvipid }, function () { });
    }
  },
  onShareAppMessage: function (res) {
    var _this = this;
    var imgurl = _this.data.imgurl;
    var brandlogo = _this.data.brandlogo;
    var share_images = _this.data.share_images;
    var share_vipid = _this.data.share_vipid || '';

    return {
      'title': '分享好友',
      'path': '/pages/mymember/sharefriends?share_vipid=' + share_vipid,//imgurl=' + imgurl + '&brandlogo=' + brandlogo+ '&share_vipid=' + share_vipid,
      'imageUrl': this.data.imgbase + share_images,
      'success': function (res) {
        //转发记录
        //UserAction.recordShare('VOTE', 0, billno);
        // 转发成功
      },
      'fail': function (res) {
        // 转发失败
      }
    }
  },

})