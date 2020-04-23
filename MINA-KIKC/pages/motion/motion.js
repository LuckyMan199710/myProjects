// pages/motion/motion.js
var wig_counter = require('../../utils/wig_counter.js');
var app = getApp();

let pageObj = {
  /**
   * 页面的初始数据
   */
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/motion/motion',
    leftstep: '',
    todaystep: '',
    bgimgurl: '',
    prizelist: [],
    username: '',
    billno: '',
    detail: {},
    exchange_toggle: false,
    flat: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.option = options
    this.setData({
      billno: that.option.billno
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: '微信运动' });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        that.setData({
          username: res.data.userInfo.nickName
        })
      }
    })
    app.checkUserStatus(function () {
      wx.login({
        success: function (res) {
          let code = res.code
          wx.getUserInfo({
            success: function (res) {
              wx.getWeRunData({
                success(res) {
                  let info = {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code
                  }
                  app.http.post('Login/saveWeRunData', info, (json) => {
                    console.log(json)
                    that.getwrinfo()
                  })
                }
              })
            }
          })
        }
      })
    })
    
    
  },
  getwrinfo(){
    let that = this
    app.http.post('werun/getWeruninfo', { billno: this.option.billno }, (json) => {
      console.log('getWeruninfo', json)
      let data = json.data
      that.setData({
        bgimgurl: data.bgimgurl
      })
    })
    that.getVipWeruninfo()
    that.getWerunprizelist()
  },
  // 用户的步数信息
  getVipWeruninfo() {
    let that = this
    app.http.post('werun/getVipWeruninfo', {billno: this.option.billno}, (json) => {
      console.log('getVipWeruninfo', json)
      let data = json.data
      that.setData({
        leftstep: data.leftstep,
        todaystep: data.todaystep,
        totalstep: data.totalstep
      })
    })
  },
  // 获取可兑换物品列表
  getWerunprizelist() {
    let that = this
    app.http.post('werun/getWerunprizelist', { billno: this.option.billno }, (json) => {
      console.log('getWerunprizelist', json)
      let data = json.data
      that.setData({
        prizelist: data
      })
    })
  },

  getexchange(e) {

    let mydetail = e.currentTarget.dataset.detail
    let isClick = this.data.leftstep > mydetail.usestep && mydetail.left_qty > 0;
    console.log(isClick)
    if (!isClick) {
      return false;
    }
    this.setData({
      detail: mydetail,
      exchange_toggle: true
    })
    this.wig_counter_init({
      'max': mydetail.left_qty,
      'num': 1
    });

    var exchageable = false;
    if (mydetail) {
      if (this.data.leftstep >= mydetail['usestep']) {
        exchageable = true;
      }
      this.setData({
        'exchageable': exchageable
      });
    }
  },
  handleclose: function (e) {
    this.setData({
      exchange_toggle: false
    })
  },

  // 兑换事件
  bindBuy: function (e) {
    let that = this
    // var curbuyqty = this.wig_counter_getnum();
    // if (isNaN(curbuyqty)) {
    //   app.alertMsg('请输入正确的购买数量');
    //   return false;
    // }
    if (this.data.flat == true) {
      return false;
    }
    that.setData({
      flat: true
    })
    console.log(e)
    let zdy = {
      billno: that.data.billno,
      prize_id: e.currentTarget.dataset.prize_id,
      qty: 1
    }
    wx.showLoading({
      title: '兑换中...',
    })
    app.http.post('werun/exchange', zdy, (json) => {
      console.log(json)
      wx.hideLoading()
      if (json.success === 1) {
        app.alertMsg('兑换成功');
      } else {
        app.alertMsg(json.msg);
      }

      this.setData({
        'exchange_toggle': false,
        flat: false
      });
      that.getVipWeruninfo()
      that.getWerunprizelist()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
}

Object.assign(pageObj.data, wig_counter.wig_data);
Object.assign(pageObj, wig_counter);

Page(pageObj);