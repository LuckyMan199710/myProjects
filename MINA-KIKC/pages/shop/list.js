var app = getApp();
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
Page({
  data: {
    'base_conf': app.DF,
    page_path: 'pages/shop/list',
    'ontabpage': 'nearby',
		'imgbase': app.STATIC_URL + 'uploads/',
		'fakeshopcover':'../image/mallmain.png'
	},
  onLoad: function () {
		var _this = this;
		wx.setNavigationBarTitle({ title: '附近门店' });
		wx.getSystemInfo({
			success: function (res) {
				_this.setData({
					windowHeight: res.windowHeight,
					windowWidth: res.windowWidth
				})
			}
		});

		app.userLoginPromise
			.then(json => {
				wx.showLoading({ title: '加载中' });
				_this.fetchShops({page:1},function(json){
					wx.hideLoading();
					_this.is_end = json.is_end;
					
					_this.setData({
						'shops':json.shops,
						'page':json.page
					})
          //访问记录
          UserAction.recordPageView('STORE', 0, '');
				})
			})
			app.updateIconStyle(this);
  },

	fetchShops: function (option,callback){
		var _this = this;
		app.getUserLocation(function (loction) {
			var userinfo = wx.getStorageSync('userinfo');
			console.log('定位信息 userinfo');
			console.log(userinfo);
			app.http.post('Shop/getNearbyShop', { lat: loction.lat, lng: loction.lng, 'city': userinfo.city, 'page': option.page }, function (json) {
					callback(json);
			})
		})
	},
	
	lower: function (e) {
		var _this = this;
		if (this.is_loading) {
			return false;
		}
		if (this.is_end == 'Y') {
			return false;
		}
		this.is_loading = true;
		wx.showLoading({title: '加载中'});

		this.fetchShops({page:parseInt(this.data.page)+1},function(json){
			wx.hideLoading();
			var shops = _this.data.shops;
			json.shops.forEach(function (item) {
				shops.push(item);
			});
			_this.is_loading = false;
			_this.is_end = json.is_end;
			_this.setData({
				'shops': shops,
				'page': json.page
			})
		})
			
	},
	openmap: function (e) {
		var shopid = e.target.id;
		var targetshop = false;
		this.data.shops.forEach(function(item){
			if (item.shop_id == shopid){
				targetshop = item;
			}
		})

		if (targetshop) {
			// posinfo = posinfo.split('_');
			var latitude = parseFloat(targetshop['lat']);
			var longitude = parseFloat(targetshop['lng']);
			if (longitude || latitude){
				wx.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: targetshop['name'],
					address: targetshop['address'],
					scale: 28
				})
				return false;
			}
		} 
		app.alertMsg('未设置地图定位');
		
	},
	makephoneCall: function (e) {
		if (e.target.id) {
			wx.makePhoneCall({
				phoneNumber: e.target.id
			})
		} else {
			app.alertMsg('未设置联系方式');
		}

	}
})
