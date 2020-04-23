// pages/motion/rule.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailurl: '',
    begdate: '',
    enddate: '',
    detail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.option = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    app.http.fetch('werun/getWeruninfo', { billno: this.option.billno }, (json) => {
      console.log('getWeruninfo', json)
      let data = json.data
      that.setData({
        detailurl: data.detailurl,
        begdate: data.begdate,
        enddate: data.enddate,
        detail: data.detail,
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})