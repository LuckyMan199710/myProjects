// pages/motion/Shake.js
var app = getApp()
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
var nav = require('../../utils/nav.js');

const innerAudioContext = wx.createInnerAudioContext()
const innerAudioContext2 = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasResutl: -1,
    bar_state: 0,
    winWidth: 0,
    winHeight: 0,
    'base_conf': app.DF,
    awardList: [],//奖品数组
    imgbase: app.STATIC_URL + 'uploads/',
    img_url: app.STATIC_URL + "Images/img_yaoyiyao.png",
    loading: "/images/small_loading.gif",
    'yao1': app.STATIC_URL + "wap/music/red-01.mp3",
    'yao2': app.STATIC_URL + "wap/music/red-02.mp3",
    bgm: false,
    'hidden': true,
    flat: true, // 为true时允许，false时禁止
    navhidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    if (option.scene) {
      var qrcode_obj = app.decodeURI(option) || "";
      console.log('qrcode_obj', qrcode_obj);
      if (!qrcode_obj || (qrcode_obj && !qrcode_obj['billno'])) {
        app.alertMsg('参数不存在', {
          cb: app.goBack
        })
      }
      option.billno = qrcode_obj['billno'];
    } else {
      if (!option.billno) {
        app.alertMsg('参数不存在', {
          cb: app.goBack
        });
        return false;
      }
    }
    this._option = option;

    app.checkUserStatus(() => {
      console.log('onShow0055');
      this.initPage();
    });
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },


  BGM: function (e) {
    let that = this;
    // if (!that.data.flat) return false;
    // if (that.data.bgm) {
    //   that.setData({
    //     bgm: false,
    //   })
    //   innerAudioContext.pause(); /**  暂停音乐 */
    // } else {

    // 播放音乐
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.src = that.data.yao1;
    innerAudioContext.play()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var context = wx.createContext()
    context.rect(5, 5, 25, 15)
    context.stroke()
    context.drawImage()
    wx.drawCanvas({
      canvasId: 'myCanvas',
      actions: context.getActions()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.initAnimation();
    if (!that.data.flat) return false;
    // that.alertMsg(that.data.flat)
    //重力加速度
    wx.startAccelerometer({
      interval: 'ui'
    })
    wx.onAccelerometerChange(function (res) {
      // console.log(res.z)
      // if (res.x > .2 && res.y > 0) {
      //   that.BGM()
      // }
      if (res.x > .2 && res.y > .2) {
        console.log(res.x, 'x')
        console.log(res.y, 'y')
        // wx.showToast({
        //   title: '摇一摇成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        if (!that.data.flat) return false;
        that.setData({
          flat: false
        })
        that.startAnimation();
        // that.vibrateShort();
      }
    })
    
    var that = this;
    //获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.downloadFile({
      url: that.data.img_url,
      success: function (sres) {
        console.log(sres);
      }, fail: function (fres) {

      }
    })
  },
  initPage: function () {
    this.setData({
      'background': '#ee903c',
    });
    this.setPrize();
  },
  initAnimation: function () {
    var that = this;
    //实例化一个动画
    this.animation1 = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 400,
      /**
      * http://cubic-bezier.com/#0,0,.58,1 
      * linear 动画一直较为均匀
      * ease 从匀速到加速在到匀速
      * ease-in 缓慢到匀速
      * ease-in-out 从缓慢到匀速再到缓慢
      * 
      * http://www.tuicool.com/articles/neqMVr
      * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
      * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
      */
      timingFunction: 'ease',
      // 延迟多长时间开始
      // delay: 100,
      /**
      * 以什么为基点做动画 效果自己演示
      * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
      * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
      */
      transformOrigin: 'left top 0',
      success: function (res) {
        console.log(res)

      }
    })
    //实例化一个动画
    this.animation2 = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 400,
      /**
      * http://cubic-bezier.com/#0,0,.58,1 
      * linear 动画一直较为均匀
      * ease 从匀速到加速在到匀速
      * ease-in 缓慢到匀速
      * ease-in-out 从缓慢到匀速再到缓慢
      * 
      * http://www.tuicool.com/articles/neqMVr
      * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
      * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
      */
      timingFunction: 'ease',
      // 延迟多长时间开始
      // delay: 100,
      /**
      * 以什么为基点做动画 效果自己演示
      * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
      * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
      */
      transformOrigin: 'left top 0',
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
  *位移
  */
  startAnimation: function () {
    var that = this
    //x轴位移100px
    var h1 = "35%";
    var h2 = "65%";
    that.BGM()
    setTimeout(function () {
      innerAudioContext.pause();
    }, 1000)
    if (this.data.bar_state == 1) {
      h1 = "40%";
      h2 = "40%";
      innerAudioContext2.autoplay = true
      innerAudioContext2.src = that.data.yao2;
      innerAudioContext2.play()

      setTimeout(function () {
        that.setData({
          //输出动画
          bar_state: 0,
          hasResutl: 0
        })
        setTimeout(function () {
          that.setData({
            hasResutl: 1,
            flat: false
          })
          that.startGame();
        }, 1000)
      }, 400)

    } else {
      h1 = "25%";
      h2 = "55%";
      this.setData({
        bar_state: 1
      })
      setTimeout(function () {
        that.startAnimation();
      }, 600)
    }
    this.animation1.height(h1).step()
    this.animation2.top(h2).step()
    this.setData({
      //输出动画
      animation1: that.animation1.export(),
      animation2: that.animation2.export()
    })

  },

  setPrize: function () {
    var _this = this;
    _this.setData({
      'background': '#ee903c'
      //canvashidden:false,
    });
    var billno = _this._option.billno;
    wx.showLoading({
      title: '正在加载游戏',
    });
    //刮刮卡初始化
    if (_this.data.isStart) {
      _this.initGame();
    }
    var vip_info = wx.getStorageSync('vip_info');
    app.http.post('Game/getGamePrize', { 'billno': billno }, function (json) {
      wx.hideLoading();
      //奖品item设置
      var awardList = [];
      var basePrize = json.data['prize_dtl'] || [];
      console.log('getGamePrize  prize_dtl');
      console.log(basePrize);
      if (typeof (basePrize) != "undefined" && basePrize.length <= 0) {
        app.alertMsg('奖品明细未设置，请联系管理员');
        return false;
      }
      basePrize.push({ 'lottername': '谢谢参与', 'seqid': 0 });
      _this.setData({
        'info': json.data,
        'basePrize': basePrize,
        'lefttimes': json.data.chance
      });
      console.log('getGamePrize  json');
      _this.setData({
        'info': json.data,
        'basePrize': basePrize,
        'awardList': awardList,
        'isRunning': false,
        'resultSeq': -1,
        'resultTarget': false,
        'indexSelect': -1,
        'lefttimes': json.data.chance,
      });
      console.log(json)
      if (json.data.isvalid == 'N') {
        app.alertMsg(json.data.errmsg, {
          cb: function () {
            wx.navigateBack()
          }
        });
        return false;
      }
      var isStart = _this.data.isStart;
      if (isStart) {
        //访问记录
        UserAction.recordPageView('GAME', 0, billno);
      }

      //开始游戏
      //_this.startGame();
      //_this.onStart();


      //if(_this.data.isStart == false){return false;}

    })
  },

  //开始游戏
  startGame: function () {
    if (this.data.info.isvalid == 'N') {
      app.alertMsg(this.data.info.errmsg);
      return false;
    }
    if (this.data.lefttimes == 0) {
      app.alertMsg('您的抽奖机会已经用完');
      return false;
    }
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    var _this = this;
    var billno = _this.billno;

    var is_back = false;
    var luckid = -1;

    app.http.post('Game/randLuttery', { 'billno': this._option.billno }, function (json) {
      console.log('randLuttery   json', json);
      is_back = true;

      var target = false;//目标结果
      var targetSeq = -1;//目标结果
      _this.data.basePrize.forEach(function (item, idx) {
        if (item.seqid == json.luckid) {
          target = item;
          targetSeq = idx;
        }
      });
      if (target == false || targetSeq == -1) {
        app.alertMsg('出现异常，请重新抽奖');
        clearInterval(timer);
        _this.setPrize();
      }
      _this.setData({
        'resultTarget': target,
        'resultSeq': targetSeq,
        'lefttimes': (_this.data.lefttimes - 1)
      });
      _this.updateVipPoint(json.last_point);


      let resultTarget = _this.data.resultTarget;
      if (resultTarget.seqid == 0) {
        var prize_name = resultTarget.lottername;
      } else {
        var prize_name = '中奖啦！您获得了' + resultTarget.lottername;
      }

      //修改
      var content = '';
      var confirm_txt = '';
      var cancel_txt = '';
      if (resultTarget.prizetype == 'A') {
        content = '实物奖品需要填写地址才能发货';
        confirm_txt = '去填写';
        cancel_txt = '再玩一次';
      } else {
        confirm_txt = '再玩一次';
        cancel_txt = '不玩了';
      }

      _this.setData({ wid_dialog_conf: { gameresult_show: true, imgbase: app.STATIC_URL + 'uploads/', imageurl: resultTarget.imageurl, title: prize_name, content: content, confirm_txt: confirm_txt, cancel_txt: cancel_txt } });
      console.log('中奖结果  content', content);
    });
  },

  gameConfirm: function (e) {
    let wid_dialog_conf = this.data.wid_dialog_conf;
    wid_dialog_conf['gameresult_show'] = false;
    this.setData({ wid_dialog_conf: wid_dialog_conf });
    this.setData({
      flat: true
    })
    if (this.data.resultTarget.prizetype == 'A') {
      wx.navigateTo({ url: '/pages/game/prize', });
    } else {
      this.setPrize();
    }
  },
  gameCancel: function (e) {
    let wid_dialog_conf = this.data.wid_dialog_conf;
    wid_dialog_conf['gameresult_show'] = false;
    this.setData({ wid_dialog_conf: wid_dialog_conf });
    this.setData({
      flat: true
    })
    if (this.data.resultTarget.prizetype == 'A') {
      this.setPrize();
    } else {
      app.goBack();
    }
  },

  updateVipPoint: function (point) {
    var vipinfo = wx.getStorageSync('vip_info');
    if (vipinfo) {
      vipinfo.point = point;
      wx.setStorageSync('vip_info', vipinfo)
    }
  },

  handleClose: function () {
    this.setData({
      hasResutl: -1
    })
  },

  rule: function (e) {
    console.log(222)
    this.setData({
      hidden: false,
    })
  },
  hidden: function () {
    this.setData({
      hidden: true,
    })
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
})