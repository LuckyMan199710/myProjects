//index.js
//获取应用实例
var app = getApp()
Page({
	data: {},
	//事件处理函数
	bindViewTap: function () {},
	onLoad: function () {
		app.updateIconStyle(this);
		wx.setNavigationBarTitle({
			title: '荐友有礼'
		})
	}
})
