var app = getApp()
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL+'uploads/',
    page_path: 'pages/barcode'
	},
	minBarcode: function (e) {
		wx.navigateBack({
			delta:1
		})
	},
  onShow:function(){
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  initPage:function(){
    var _this = this;
    var vip_info = wx.getStorageSync('vip_info');
    var vip_barcode_url = wx.getStorageSync('vip_barcode_url');
    if (!vip_barcode_url){
      wx.showLoading();
      app.http.post('Member/getVipBarcode', { vipnum: vip_info.vip_num }, function (json) {
        wx.hideLoading();
        if (json.success == 1) {
          wx.setStorageSync('vip_barcode_url', json.src);
          _this.setData({
            'barcodeurl': json.src,
            'phone': vip_info.vip_num
          })
        }
      })
    }else{
      _this.setData({
        'barcodeurl': vip_barcode_url,
        'phone': vip_info.vip_num
      })
    }
  },
  onReady:function(){
		wx.setNavigationBarTitle({title: '条形码'});
  },
	onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
	}
	
})
