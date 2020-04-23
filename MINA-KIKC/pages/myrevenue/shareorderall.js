var app = getApp();
Page({
  data: {
    'imgbase': app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    page_path: 'pages/myrevenue/shareorderall',
    navlist: [
      {
        id: -1,
        name: '全部'
      },
      {
        id: 0,
        name: '分享'
      },
      {
        id: 1,
        name: '一级收益'
      },
      {
        id: 2,
        name: '二级收益'
      }
    ],
    navIndex: 0,
    selected: -1,

    start_date: '',
    end_date: '',

    end_time: '',
    timeToggle: false, // 是否显示日期
    code: '',
    time_type: ''
  },
  zdyDate(date) {
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate();
    return Y + M + D
  },
  handleCustom() {
    this.setData({
      timeToggle: !this.data.timeToggle
    })
  },
  handleClear() {
    this.setData({
      code: ''
    })
    this.initPage()
  },
  handleInput(e) {
    console.log(e)
    this.setData({
      code: e.detail.value
    })
  },
  handleConfirm(e) {
    this.initPage()
  },
  bindPickerChange(e) {
    console.log('lllllllllllll', e)
    this.setData({
      navIndex: e.detail.value,
      selected: this.data.navlist[e.detail.value].id
    })
    this.initPage()
  },
  bindStartDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start_date: e.detail.value
    })
    if (this.data.end_date) {
      this.initPage()
    }
  },
  bindEndDateChange(e) {
    this.setData({
      end_date: e.detail.value,
      end_time: e.detail.value
    })
    if (this.data.start_date) {
      this.initPage()
    }
  },
  handleSetTime(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let newTime = new Date().getTime()
    this.setData({
      time_type: type
    })
    if (type == 'today') {
      this.setData({
        start_date: this.zdyDate(new Date()),
        end_date: this.zdyDate(new Date()),
        end_time: this.zdyDate(new Date())
      })
    } else if (type == 'yestoday') {
      this.setData({
        start_date: this.zdyDate(new Date(newTime - 86400000)),
        end_date: this.zdyDate(new Date(newTime - 86400000)),
        end_time: this.zdyDate(new Date(newTime - 86400000))
      })
    } else if (type == 'week') {
      this.setData({
        start_date: this.zdyDate(new Date(newTime - 7 * 86400000)),
        end_date: this.zdyDate(new Date()),
        end_time: this.zdyDate(new Date())
      })
    } else {
      this.setData({
        start_date: '',
        end_date: '',
        end_time: this.zdyDate(new Date())
      })
    }
    this.initPage()

  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '所有订单' });
  },
  onLoad: function (option) {
    // wx.setNavigationBarTitle({ title: '好友订单' });
    // var _this = this;
    // app.userLoginPromise
    //   .then(json => {
    //     _this._onloadcalled = true;
    //     _this.initPage();

    //   })
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onShow: function () {
    // if (this._onloadcalled) {
    //   this.initPage();
    // }
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  handleNav: function (e) {
    let _this = this
    let id = e.currentTarget.dataset.id
    wx.showLoading();
    this.setData({
      selected: id
    })
    app.http.post('Myrevenue/get_orders_all', {
      type: id
    }, function (json) {
      wx.hideLoading();
      app.checkShareRight(json);
      _this.setData({
        orderlist: json.data,
      })
    })
  },
  initPage: function () {
    var _this = this;
    // var vip_info = wx.getStorageSync('vip_info');
    // if (!vip_info) {
    //   var ret = app.getCardWidget();
    //   return false;
    // }
    wx.showLoading();
    let data = {
      code: this.data.code,
      begdate: this.data.start_date,
      enddate: this.data.end_date,
      type: this.data.selected,
      types: this.data.types
    }
    app.http.post('Myrevenue/get_orders_all', data, function (json) {
      wx.hideLoading();
      app.checkShareRight(json);
      _this.setData({
        orderlist: json.data,
      })
    });
  },

})