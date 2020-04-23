var app = getApp();
var AddlogisIns = require('../../utils/wig_logis.js');
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    page_path: 'pages/mall/orderdetailtwo',
    navhidden: true,
    hidden: true
  },
  BindPay: function (e) {
    this.buildOrder();
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '订单详情' });
  },
  onLoad: function (option) {
    this._option = option;
    var billno = option.billno;
    var paybillno = option.paybillno;
    if (!billno) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      });
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  initPage: function () {
    var _this = this;
    var option = this._option;
    this.setData({
      'paybillno': option.paybillno,
      'billno': option.billno,
    });
    wx.showLoading();
    app.http.post('Order/getMallOrderByIdTwo', { "paybillno": option.paybillno, "billno": option.billno }, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'order': json.order,
          'orderitem': json.orderitem,
          'payorder': json.payorder,
          'msg':json.msg||'',
        });
        
      } else {
        app.alertMsg(json.msg, {
          cb: app.goBack
        })
      }
    });
  },
  bindProdDetail:function(e){
	  var plat_num_iid = e.currentTarget.dataset.plat_numiid;
	  if(!plat_num_iid){return ;}
	  var group_id = e.currentTarget.dataset.group_id;
	  var is_group = e.currentTarget.dataset.is_group;
	  if(group_id){
		  if(is_group=='Y'){
			  wx.navigateTo({url:'/pages/mall/groupdetail?group_id='+group_id});
		  }else if(is_group=='K'){
			  wx.navigateTo({url:'/pages/mall/bargaindetail?group_id='+group_id});
		  }		  
	  }else{
		  wx.navigateTo({url:'/pages/mall/proddetail?plat_num_iid='+plat_num_iid});
	  }
	  
  },
  catchBubbling:function(e){
		//阻止事件冒泡
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
};
Object.assign(pageObj, AddlogisIns);
Page(pageObj);