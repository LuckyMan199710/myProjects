var app = getApp();
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
	data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
		is_cpn_loadmore:true,
    is_prod_loadmore: true,
    navhidden: true,
    'ontabpage': 'exchange',
    page_path: 'pages/vip/exchange'
	},
  initPage:function(){
    var _this = this;
    var vip_info = wx.getStorageSync('vip_info');
    this.setData({
      'vip_point': vip_info.point
    });
    this.loadInitData(function(){
      //首次不执行，从其他页面返回才执行
      _this.reRenderView();
    });
    if(!this._has_record_page){
      //访问记录
      UserAction.recordPageView('POINTCHANGE', 0, '');
      this._has_record_page = true;
    }
  },
  loadInitData:function(callback){
    var _this = this;
    if(this._has_load_initdata){
      typeof callback === 'function'  && callback();
    }else{
      this._has_load_initdata = true;
      wx.showLoading();
      app.http.post('Member/getExchableCpns', { 'limit': 'Y' }, function (json) {
        wx.hideLoading();
        _this.setData({
          'coupons': _this.formatExch(json.data),
          'is_cpn_loadmore': !json.hasmore
        });
      });
      app.http.post('Member/getExchableProds', { 'limit': 'Y' }, function (json) {
        _this.setData({
          'prods': _this.formatExch(json.data),
          'is_prod_loadmore': !json.hasmore
        });
      });
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '积分兑换' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
	},
	onShow: function(){
    app.checkUserStatus(() => {
      this.initPage();
    });
	},
	bindExchCpn:function(e){
		var _this = this;
		if (e.target.id) {
			var exch_id = e.target.id;
			var e_dataset = e.currentTarget.dataset;
			if (e_dataset.exchable=='N'){
				app.alertMsg('积分不足，无法兑换');
				return false;
			}
			app.alertDialog('确定兑换?',{
				cb:function(res){
					if(res){
						wx.showLoading({ title: '请稍候' });
						app.http.post('Member/exchCpn', { 'exch_id': exch_id }, function (json) {
							wx.hideLoading();
							app.alertMsg(json.msg);
							if(json.success==1){
								//更新积分
								_this.reRenderView();
							}
						});
					}
				}
			})
		} else {
			app.alertMsg('兑换失败');
		}
	},
	reRenderView:function(){
		app.refreshVipInfo((vipinfo)=>{
				this.setData({
					coupons: this.formatExch(this.data.coupons)
				});
				this.setData({
					prods: this.formatExch(this.data.prods)
				});
				this.setData({
					'vip_point': vipinfo.point
				});
		})
	},
	bindLoadMore:function(e){
		var _this = this;
		var loadtype = e.target.id;
		if (loadtype == 'cpn') {
			wx.showLoading({title: '加载中..'});
			app.http.post('Member/getExchableCpns', { }, function (json) {
				wx.hideLoading();
				_this.setData({
					'coupons': _this.formatExch(json.data),
					'is_cpn_loadmore': true
				});
			});
		}

		if (loadtype == 'prod') {
			wx.showLoading({ title: '加载中..' });
			app.http.post('Member/getExchableProds', { }, function (json) {
				wx.hideLoading();
				_this.setData({
					'prods': _this.formatExch(json.data),
					'is_prod_loadmore': true
				});
			})
		}
	},

	formatExch:function(data){
		var vip_info = wx.getStorageSync('vip_info');
		data && data.forEach(function(item){
			if (item.point <= vip_info['point']){
				item.excable = 'Y';
			}else{
				item.excable = 'N';
			}
			return item;
		});
		return data;
	},

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
})
