//main.js
//一级主页
var app = getApp()
var userRecord = require('../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../utils/nav.js');
var AppAction = nav(app);
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
    navhidden: true,
	},
	onLoad: function (res) {
		var _this = this;
		var bannarid = res.bannarid;
		var _type = res.type;
		var shopid = res.shopid;
		app.updateIconStyle(this);
		app.http.post('Pubdata/getBannarDtl', { 'bannarid': bannarid, 'shopid': shopid},function(json){
			if(json.data){
				wx.setNavigationBarTitle({
					title: json.data.title,
				});
				_this.setData({
          'type': _type,
					'shop': json.shop,
					'bannar':json.data,
          'shopid':shopid,
          'bannarid': bannarid
				})
			}
      //访问记录
      if (json.data.shop) {
        var shopid = json.data.shop.shop_id;
      } else {
        var shopid = 0;
      }
      UserAction.recordPageView('BANNAR', shopid, json.data.bannar_id);
		})
		
	},
	openmap: function (e) {
		var posinfo = e.target.id;
		if (e.target.id) {
			posinfo = posinfo.split('_');
			var latitude = parseFloat(posinfo[0]);
			var longitude = parseFloat(posinfo[1]);
			if (longitude || latitude) {
				wx.openLocation({
					latitude: latitude,
					longitude: longitude,
					scale: 28
				})
				return false;
			}
		}
		app.alertMsg('未设置地图定位');

	},
  onShareAppMessage: function (res) {
    var _this = this;
    var img = _this.data.bannar.content_img;
    if (img=='') {
      var img = this.data.bannar.image_url;
    }
    return {
      'title':'分享好友',
      'path': '/pages/activity?type=' + this.data.type + '&shopid=' + this.data.shopid + '&bannarid=' + this.data.bannarid,
      'imageUrl': this.data.imgbase + img,
      'success': function (res) {
        //转发记录
        UserAction.recordShare('BANNAR', 0, _this.data.bannar.bannar_id);
        // 转发成功
      },
      'fail': function (res) {
        // 转发失败
      }
    }
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },

  
})
