// pagesA/live/video.js
import helper from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videourl: '',
    objectFit: 'cover',
    headerHeight: 0,
    statusBarHeight: 0,

    goodsToggle: false,
    goods: []
  },

  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onLoad(option) {
    this.setData({
      videourl: option.url
    })
    this.getSysInfo()
    let goods = JSON.parse(wx.getStorageSync('goods')).map(item => {
      item.price = helper.numFormat(item.price / 100)
      item.price2 = helper.numFormat(item.price2 / 100)
      return {
        ...item
      }
    })

    this.setData({
      goods: goods
    })
  },

  getSysInfo() {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        // 获取胶囊的属性
        const rect = wx.getMenuButtonBoundingClientRect()
        const barH = res.statusBarHeight
        const NavigationBarPaddingTop = rect.top - barH
        const NavigationBar = barH + rect.height + 2 * NavigationBarPaddingTop

        that.statusBarHeight = barH
        // that.headerHeight = NavigationBar
        that.setData({
          headerHeight: NavigationBar
        })
        console.log('that.headerHeight::::::::::', that.headerHeight)
      }
    })
  },
  handleGoods() {
    this.videoContext.pause()
    this.setData({
      goodsToggle: true
    })
  },
  handlePlay() {
    this.videoContext.play()
    this.setData({
      goodsToggle: false
    })
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  navGoods: helper.throttle(function (e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/' + url
    })
  }, 1500)
})