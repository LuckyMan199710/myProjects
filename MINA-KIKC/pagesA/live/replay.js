// pagesA/live/replay.js
var app = getApp()
var page = 1, end = true
import helper from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    end: true,
    mylogo: '',
    cover_img: '',
    roomid: '',
    list: [],

  },
  onLoad: function (option) {
    page = 1
    end = true
    this.setData({
      roomid: option.roomid,
      cover_img: option.cover_img
    })
    this.getliveinfo()
  },
  
  onReady: function () {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: app.DF.color_primary });
    // wx.setNavigationBarTitle({ title: 'KIKC直播' });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  formatDate(time) {
    var now = new Date(time)
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    var second = now.getSeconds();
    return month + "月" + date + '日' + " " + hour + ":" + minute
  },
  getliveinfo() {
    let me = this
    let data = {
      module: 'app',
      action: 'live',
      app: 'recordVideo',
      room_id: this.data.roomid,
      page: page
    }
    app.http.post('Order/refunddetail', data, function (res) {
      console.log(res)
      let data = res
      if (page == 1) {
        me.setData({
          list: []
        })
      }
      if (data.live_replay && data.live_replay.length > 0) {
        data.live_replay = data.live_replay.map(item => {
          return {
            ...item,
            create_time: me.formatDate(item.create_time),
            expire_time: me.formatDate(item.expire_time)
          }
        })
      }
      
      if (data.live_replay && data.live_replay.length > 0) {
        let list = me.data.list.concat(data.live_replay)
        me.setData({
          list: list
        })
        if (data.live_replay.length >= 10) {
          end = false
          page++
        }
      } else {
        me.end = true
      }
      wx.stopPullDownRefresh({
        complete: function (res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    })
  },
  navVideo: helper.throttle(function (media_url) {
    wx.navigateTo({
      url: './video?url=' + media_url
    })
  }, 1500),

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