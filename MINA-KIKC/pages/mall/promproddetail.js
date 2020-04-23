var app = getApp();
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

var userRecord = require('../../utils/record.js');
var AddcartIns = require('../../utils/wig_addcart.js');
var newAddcartIns = require('../../utils/new_wig_addcart.js');
var UserAction = userRecord(app);

let pageObj = {
  data: {
		imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    navhidden: true,
    car: '/images/car.png',
    intoindex: '',
    exclusive: app.kikcExclusive,  // KIKC专属样式
  },
  bindAddcart:function(e){
    //调起购物车
    var pid= e.target.dataset.pid || '';
    if(!pid){
      app.alertMsg('商品参数不存在');
      return false;
    }
    this.showAddcart(pid);
  },
  handleBuymeal() {
    // let list = this.data.prods
    // let prods = list.map(item => item.plat_num_iid)
    this.newshowAddcart(this.options)
  },
  onReady:function(){
		wx.setNavigationBarTitle({ title: '活动详情' });
  },
  onLoad: function (options) {
		var _this = this;
    var prom_id = options.prom_id || '';
    var shop_id = options.shop_id || '';
    console.log('onLoad  options',options);
    var share_vipid = options.share_vipid || '';
    _this.options = options
		if (!prom_id){
			app.alertMsg('活动参数不存在',{
				cb: app.goBack
			})
		}
		app.updateIconStyle(this);
		//授权调用
		app.userLoginPromise
			.then(json => {
				wx.showLoading({
					title: '正在加载',
				});
				//加载积分产品数据
				app.http.post('Prod/getPromInfo', { 'prom_id': prom_id,shop_id:shop_id}, function (json) {
					wx.hideLoading();
					if (json.success) {
						console.log('getPromInfo  json',json);
						_this.setData({
							'promo': json.data,
							'prom_id': prom_id,
							'bannar': json.bannar,
							'prods':json.promo_prods,
              'share_vipid': share_vipid,
              'showgoods': json.showgoods,
              'is_addcart_access':json.is_addcart_access,
              'errmsg': json.msg,
              'prod_promo':prom_id,
						});
						
            //记录推荐人vipid
            if (share_vipid) {
              _this.logVipFriend(share_vipid);
            }
						//访问记录
            UserAction.recordPageView('SALEACTIVE', 0, prom_id);

					}
				});

				
			})
  },

	bindUserAction:function(e){
		var type = e.currentTarget.id;
		var shopid = this.data.prod.shop_id;
		var plat_num_iid =  this.data.plat_num_iid;
		var _this = this;
		if(type==1){
			UserAction.recordZan('PROD', shopid, plat_num_iid,(json)=>{
				if(json.success==1){
					_this.setData({'has_zan':1})
				}
			});
		}
		if (type == 3) {
			UserAction.recordCollect('PROD', shopid, plat_num_iid, (json) => {
				if (json.success == 1) {
					_this.setData({'has_collect': 1})
				}
			});
		}
	},
	// 分享
	onShareAppMessage: function (res) {
		var vip_info = wx.getStorageSync('vip_info');
		var weixinid = wx.getStorageSync('weixinid');
    var prom_id = this.data.prom_id;
		if (vip_info) {
      var share_path = '/pages/mall/promproddetail?prom_id=' + prom_id + '&share_vipid=' + vip_info.vip_id;
		} else {
      var share_path = '/pages/mall/promproddetail?prom_id=' + prom_id;
		}
    var shareimg = this.data.bannar;
		return {
      'title': this.data.promo.promo_name,
			'path': share_path,
			'imageUrl': this.data.imgbase + shareimg,
			'success': function (res) {
        UserAction.recordShare('SALEACTIVE', 0, prom_id);
			}
		}
	},

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  logVipFriend: function (prtvipid) {
    if (prtvipid) {
      app.http.post('Member/logVipFriend', { 'prtvipid': prtvipid }, function () { });
    }
  },

};

Object.assign(pageObj, AddcartIns, newAddcartIns);

Page(pageObj);