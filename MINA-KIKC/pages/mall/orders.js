// pages/mall/orders.js
var app = getApp()
import manba from '../../miniprogram_npm/manba/index.js'
Page({

  data: {
    imgbase: app.STATIC_URL,
    ordertype: 'all',
    'base_conf': app.DF,
    page_path: 'pages/mall/orders'
  }, 
  onShow: function () {
    var option = this._option;
    if(option.status){
      var status = option.status;
    }else{
      var status = '';
    }
    app.checkUserStatus(() => {
      this.initPage(status);
    });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的订单' });
  },
  ordertype:function(e){
    this.initPage(e.currentTarget.dataset.ordertype);
  },
  bindFinishOrder:function(e){
    var self = this;
    var billno = e.currentTarget.dataset.billno;
    if(!billno){
      return false;
    }
    wx.showLoading();
    app.http.post('Order/finishOrder', { 'billno': billno }, function (json) {
      wx.hideLoading();
      if(json.success==1){
        var orders = self.data.orderlist;
        var orders = self.updateStack(orders, 'billno', billno,'status',json.orderstatus);
        self.setData({
          'orderlist': orders
        });
        self.data.orderlist.forEach(item=>{
          item
        })
      }else{
        app.alertMsg(json.msg);
      }
    });
  },
  updateStack: function (stack, targetkey, targetval,setkey,setval) {
    for(var i =0;i<stack.length;i++){
      if (stack[i][targetkey] == targetval){
        stack[i][setkey] = setval
        break;
      }
    }
    return stack;
  },
  initPage:function(ordertype){
    console.log(ordertype)
    var _this = this;
    wx.showLoading();
    app.http.post('Mall/getorders', { 'ordertype': ordertype }, function (json) {
      // console.log(json)
      wx.hideLoading();
      if (json.data && json.data.length > 0) {
        json.data.map(item => {
          item.created = manba(item.created).format('YYYY-MM-DD hh:mm:ss')
        })
      }
      
      _this.setData({
        'orderlist': json.data || [],
        'load_end': true,
        'ordertype':ordertype,
      });
    });
  }
})