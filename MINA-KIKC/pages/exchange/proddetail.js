// pages/mall/main.js
var wig_counter = require('../../utils/wig_counter.js');
var app = getApp();

let pageObj = {
  data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
		imgs: [],
		indicatorDots: true,
		autoplay: true,
		circular: true,
		interval: 5000,
		duration: 1000,
		winWidth:320,
    page_path: 'pages/exchange/proddetail'
  },
	bindBuy:function(e){
		var curskuid = this.data.curskuid;
		var curbuyqty = this.wig_counter_getnum();
		if (isNaN(curbuyqty)){
			app.alertMsg('请输入正确的购买数量');
			return false;
		}
		wx.navigateTo({
      url: '/pages/exchange/orderconfirm?plat_num_iid=' + curskuid['plat_num_iid'] + '&plat_sku_iid=' + curskuid['plat_sku_iid'] + '&buyqty='+curbuyqty
		})
	},
	bindSkuid:function(e){
		var id = e.currentTarget.id;
		var curskuid = this.getSkuTargetByskuid(this.__prodskudata,id);
		this.setData({
			'curskuid': curskuid,
			'curbuyqty':1
		});
		this.wig_counter_init({
			'max': curskuid.stockqty,
			'num':1
		});
		this.validExchCondition();
	},
	bindSku1:function(e){
		var id = e.currentTarget.id;
		var sku2objs = this.getSku2BySku1(this.__prodskudata, id);
		var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, id, sku2objs[0]['spec_num']);
		this.setData({
			'sku2':sku2objs,
			'curskuid': curskuid,
			'curbuyqty':1
		});
		this.wig_counter_init({
			'max': curskuid.stockqty,
			'num': 1
		});
		this.validExchCondition();
	},
	bindSku2: function (e) {
		var id = e.currentTarget.id;
		var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, this.data.curskuid['color_num'], id);
		this.setData({
			'curskuid': curskuid,
			'curbuyqty':1
		});
		this.wig_counter_init({
			'max': curskuid.stockqty,
			'num': 1
		});
		this.validExchCondition();
	},
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    if (!option.plat_num_iid) {
      app.alertMsg('产品参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    this.setData({
      'winWidth': app.globalData.sys_info.windowWidth
    });
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '商品详情' });
  },
  initPage:function(){
	    var _this = this;
      var option = this._option;
	     //加载积分产品数据
        wx.showLoading();
        app.http.post('Prod/getprodinfo', { 'plat_num_iid': option.plat_num_iid }, function (json) {
					if (json.success) {
						var imgs = [];
						if (json.covers) {
							for (var i in json.covers) {
								if (json.covers[i]){
									imgs.push(json.covers[i]);
								}
							}
						}
						_this.setData({
							'prod': json.data,
							'imgs': imgs
						});

            app.http.post('Prod/getProdSkus', { 'plat_num_iid': option.plat_num_iid }, function (json) {
              wx.hideLoading();
							if(json.success==1){

                var sku_data = [];
                json.data.forEach(function (item) {
                  if (item.stockqty > 0) { 
                    sku_data.push(item);
                  }
                });
                json.data = sku_data;
									var skulvl = _this.getFormatSkuLvl(json.data);
									_this.__prodskudata = json.data;
									if (skulvl == 1) {
										_this.setData({
											'skulvl': 1,
											'sku1': json.data,
											'curskuid': json.data[0],
											'curbuyqty': 1
										});
										_this.wig_counter_init({
											'max': json.data[0].stockqty,
											'num': 1
										});
									} else {
										var sku2objs = _this.getSku2BySku1(json.data, skulvl['sku1'][0]);
										var curskuid = _this.getSkuTargetBycolorspec(json.data, skulvl['sku1'][0], sku2objs[0]['spec_num']);
										_this.setData({
											'skulvl': 2,
											'sku1': skulvl['sku1name'],
											'sku2': sku2objs,
											'curskuid': curskuid,
											'curbuyqty': 1
										});
										_this.wig_counter_init({
											'max': curskuid.stockqty,
											'num': 1
										});
									}
									_this.validExchCondition();

							}else{
								app.alertMsg('加载失败',{cb:app.goBack});
							}

						});

					}
				});
	  },

	
	validExchCondition:function(){
		var curprod = this.data.curskuid;
		var vip_info = wx.getStorageSync('vip_info');
		var exchageable = false;
		if (curprod){
			if(curprod.price <= vip_info['point']){
				exchageable = true;
			}
			this.setData({
				'exchageable': exchageable
			});
		}
	},
	getSku2BySku1:function(data,skul_num){
		var tempdata = [];
		data.forEach(function(item){
			if (item.color_num == skul_num){
				tempdata.push(item);
			}
		});
		return tempdata;
	},
	getSkuTargetBycolorspec(data,color_num,spec_num){
		var target = null;
		data.forEach(function (item) {
      if (item.color_num == color_num && item.spec_num == spec_num) {
				target = item;
			}
		});
		return target;
	},
	getSkuTargetByskuid(data, skuid) {
		var target = null;
		data.forEach(function (item) {
			if (item.sku_id == skuid) {
				target = item;
			}
		});
		return target;
	},
	getFormatSkuLvl:function(data){
		var sku1 = [];
		var sku1name = [];
		var sku2 = [];
		var skulvl = 2;
		data.forEach(function (item) {
      if (item.stockqty>0){}
			if (item.color_num && (sku1.indexOf(item.color_num) == -1)) {
				sku1.push(item.color_num);
				let tempobj = { 'color': item.color, 'color_num': item.color_num };
				sku1name.push(tempobj);
			}
			if (item.spec_num && (sku2.indexOf(item.spec_num) == -1)) {
				sku2.push(item.spec_num);
			}

			//有一个没设置则采用1维sku
			if (!item.color_num && !item.spec_num) {
				skulvl = 1;
			}

		});

		if (sku1.length == 0 || sku2.length == 0) {
			skulvl = 1;
		}

		// if (sku1.length != sku2.length) {
		// 	skulvl = 1;
		// }

		if(skulvl==1){
			return 1;
		}

		return {
			'sku1':sku1,
			'sku2': sku2,
			'sku1name': sku1name
		}
	}

};

Object.assign(pageObj.data, wig_counter.wig_data);
Object.assign(pageObj, wig_counter);

Page(pageObj);