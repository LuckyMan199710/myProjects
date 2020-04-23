// pages/mall/informationdetail.js
var app = getApp();
var nav = require('../../utils/nav.js');
var userRecord = require('../../utils/record.js');
var AddcartIns = require('../../utils/wig_addcart.js');
var AppAction = nav(app);
var UserAction = userRecord(app);
var pageObj = {

  /**
   * 页面的初始数据
   */
  data: {
    'base_conf': app.DF,
    navhidden: true,
    imgbase: app.STATIC_URL + 'uploads/',
    'ques_list': [],
    title: '',
    mydate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._option = options;
    var _this = this;
    var trend_id = ''
    if (options.id) {
      trend_id = options.id
    }
    if (options.billno) {
      var billno = options.billno;
    } else {
      var billno = '';
    }
    var share_vipid = options.share_vipid;//分享者会员id
    
    this.setData({
      'bannarH': app.globalData.sys_info.windowWidth * 150 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight,
      'share_vipid': share_vipid || ''
    });
    wx.setNavigationBarTitle({ title: '潮流资讯' });
    _this.loadModalData(trend_id);
    // app.userLoginPromise
    //   .then(json => {
    //     wx.showLoading({ title: '正在加载...' });
    //     app.http.post('Mall/getTemplateInfo', { 'billno': billno, 'shopid': options.shopid || '' }, function (json) {
    //       wx.hideLoading();
    //       wx.setNavigationBarTitle({ title: '潮流资讯' });
    //       console.log('getTemplateInfo  json', json);
    //       _this.setData({
    //         'vote': json.vote,
    //       });
    //       if (!billno && !options.shopid) {
    //         //设置店铺
    //         _this._option.shopid = json.vote.shop_id;
    //         _this._option.billno = json.vote._id;
    //         billno = json.vote._id;
    //       }
    //       console.log('billno', billno);
    //       _this.loadModalData(trend_id);
    //       //记录推荐人vipid
    //       if (share_vipid) {
    //         _this.logVipFriend(share_vipid);
    //       }
    //       //访问记录
    //       // UserAction.recordPageView('TEMPL', json.vote.shop_id, json.vote._id);
    //     });
    //   })
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  loadModalData: function (trend_id) {
    var vip_info = wx.getStorageSync('vip_info');
    //加载各模块的数据
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    let utoken = wx.getStorageSync("utoken")
    // this._option.shopid || ''
    app.http.post('Trend/trendDetail', { 'trend_id': trend_id }, function (json) {
      wx.hideLoading();
      console.log('getAllTemplateInfo  json', json);
      var ques_list = json.data;
      var title = json.trend.title
      var x = json.trend.createdate
      var mydate = x.substring(0, x.indexOf(' '))
      var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      var monthday = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var str = weekday[new Date(mydate).getDay()] + ' ' + monthday[new Date(mydate).getMonth()] + ' ' + new Date(mydate).getDate()
      _this.setData({
        'ques_list': ques_list,
        title: title,
        mydate: str
      })
      console.log('ques_list', ques_list)
    });
  }
}

Object.assign(pageObj, AddcartIns);
Page(pageObj);