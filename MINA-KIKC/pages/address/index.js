//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    page_path: 'pages/address/index'
  },
	bindNewAddr: function (e) {
		wx.navigateTo({
			url: '/pages/address/edit',
			complete:function(res){
				console.log(res);
			}
		})
	},
	bindModifyAddr:function(e){
		wx.navigateTo({
			url: '/pages/address/edit?lineid=' + e.currentTarget.id,
		})
	},
	bindSelAddr: function (e) {
		if (this._jumpback){
			wx.setStorageSync('order_addr_lineid', e.currentTarget.id);
			wx.navigateBack({
				delta:1
			});
		}
  }, 
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '选择地址' });
  },
  initPage:function(){

  }
	// onLoad: function (options) {
	// 	this._jumpback = options.from_order;
	// 	if(options.from_order){
	// 		wx.setNavigationBarTitle({ title: '选择地址' });
	// 	}else{
	// 		wx.setNavigationBarTitle({ title: '地址管理' });
	// 	}
	// 	var _this = this;
  // }
	// onShow:function(){
	// 	var _this = this;
	// 	app.userLoginPromise
	// 		.then(json => {

	// 			app.getVipAddrs(function (vipAddrs) {
	// 				_this.setData({
	// 					'vipAddrs': vipAddrs
	// 				})
	// 			})

	// 		})
	// }
})
