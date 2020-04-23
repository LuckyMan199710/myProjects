// pagesA/live/home.js
var app = getApp()
var defineds = require('../../utils/defineds.js');
var page = 1, end = true
let livePlayer = requirePlugin('live-player-plugin') // 引入获取直播状态接口
import helper from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'base_conf': app.DF,
    mylogo: '',
    list: [],
    ontabpage: 'livewxh',
    page_path: 'pagesA/live/home',
    list1: [
      {
        anchor_img: "http://mmbiz.qpic.cn/mmbiz_jpg/2mTaWomDvCZHTiaWaDEHchf3TVkqH1s7ku1cPm65y98nouRAqu3vnMHGO3OI10GGPIsEcjv6koasQAjYbgScqnw/0",
        anchor_name: "小乎",
        cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/2mTaWomDvCZHTiaWaDEHchf3TVkqH1s7kPViaFZaK3siaATmmzpHKibqWgb05j8bjODiadUIuyXu3Tubcgh3E09ylQg/0",
        end_time: 1584092634,
        goods: [],
        live_status: 103,
        name: "测试直播2",
        roomid: 3,
        start_time: 1584090214
      },
      {
        anchor_img: "http://mmbiz.qpic.cn/mmbiz_jpg/2mTaWomDvCZHTiaWaDEHchf3TVkqH1s7ku1cPm65y98nouRAqu3vnMHGO3OI10GGPIsEcjv6koasQAjYbgScqnw/0",
        anchor_name: "小乎",
        cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/2mTaWomDvCZHTiaWaDEHchf3TVkqH1s7kPViaFZaK3siaATmmzpHKibqWgb05j8bjODiadUIuyXu3Tubcgh3E09ylQg/0",
        end_time: 1584081916,
        goods: [],
        live_status: 103,
        name: "测试一下直播",
        roomid: 2,
        start_time: 1584080399
      }
    ],
    type: [
      { id: '101', name: '直播中' },
      { id: '102', name: '未开始' },
      { id: '103', name: '已结束' },
      { id: '104', name: '禁播' },
      { id: '105', name: '暂停中' },
      { id: '106', name: '异常' },
      { id: '107', name: '已过期' }
    ]
  },
  onLoad: function (options) {
    this.getliveinfo()
    console.log(app.DF)
    this.setData({
      base_conf: app.DF
    })
    //this.getTypes();
  },
  onReady: function () {
    console.log('app.defineds.color_primary', app.DF)
    wx.setNavigationBarTitle({ title: '直播列表' });
  },
  onShow: function () {

  },
  onReachBottom() {
    if (!this.end) {
      this.getliveinfo()
    }
  },
  onPullDownRefresh() {
    let me = this
    page = 1
    end = true
    me.getliveinfo()
  },
  getLiveStatus(room_id) {
    return new Promise(resolve => {
      livePlayer.getLiveStatus({
        room_id: room_id
      })
        .then(res => {
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
          const liveStatus = res.liveStatus
          resolve(liveStatus)
          console.log('直播间状态：：：：：：：：：：：', res)
        })
        .catch(err => {
          console.log(err)
        })
    })

  },
  getType(live_status) {
    switch (live_status) {
      case 101:
        return '直播中';
      case 102:
        return '未开始';
      case 103:
        return '回放';
      case 104:
        return '禁播';
      case 105:
        return '暂停中';
      case 106:
        return '异常';
      case 107:
        return '已过期';
      default:
        return '无状态'
    }
  },
  formatDate(time) {
    var now = new Date(time * 1000)
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
      start: 1,
      limit: 10
    }
    app.http.post('Live/getZBList', data, function (res) {
      console.log('getZBList:' + res)
      if (res.success !== 1) return false
      let data = res
      if (page == 1) {
        me.setData({
          list: []
        })
      }
      if (data.data && data.data.length > 0) {
        data.data = data.data.map(item => {
          // if (!item.live_status) {
          //   //  1(未开播) 2(已结束) 3(直播中)
          //   if (item.own_live_status == 1) item.live_status = 102
          //   if (item.own_live_status == 2) item.live_status = 103
          //   if (item.own_live_status == 3) item.live_status = 101
          // }
          return {
            ...item,
            status_name: me.getType(item.live_status),
            // start_times: this.formatDate(item.start_time),
            // end_times: this.formatDate(item.end_time),
          }
        })
      }

      if (data.data && data.data.length > 0) {
        let list = me.data.list.concat(data.data)
        me.setData({
          list: list
        })
        if (data.data.length >= 10) {
          end = false
          page++
        }
      } else {
        end = true
      }
      wx.stopPullDownRefresh({
        complete: function (res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    })
    // this.$http.post(data).then(res => {

    // })
  },
  getTypes() {
    app.http.post('Mall/getTypes', {}, function (json) {
      wx.hideLoading();

      console.log('getTypes json', json);

    });
  },
  navLive: helper.throttle(function (e) {
    let item = e.currentTarget.dataset.item
    let roomid = item.room_id
    if (item.goods) {
      wx.setStorageSync('goods', JSON.stringify(item.goods))
    }
    if (item.live_status) {
      this.nav(item.live_status, item)
    } else {
      this.getLiveStatus(item.room_id).then(status => {
        console.log(status)
        this.nav(status, item)
      })
    }
  }, 1500),
  nav(status, item) {
    if (status == 103) {
      this.getVideo(item.roomid)
      // console.log('跳转到回放列表')
    } else {
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`
      })
    }
  },
  getVideo(roomid) {
    let data = {
      start: 1,
      room_id: roomid,
      limit: 10
    }
    app.http.post('Live/getZBReList', data, function (res) {
      let data = JSON.parse(res.data)
      if (data.live_replay.length > 0) {
        let media_url = data.live_replay[0].media_url
        wx.navigateTo({
          url: './video?url=' + media_url
        })
      }
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})