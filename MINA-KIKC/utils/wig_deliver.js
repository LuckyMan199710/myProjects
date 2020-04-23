var app = getApp();
var wig_address = {
	wig_address_addNewAddr:function(){},
	wig_address_init: function (addrlist, sel_lineid,is_onshow=true){
		//addrlist,lineid：选中中项
		this.setData({
			'wig_address_list':addrlist,
			'wig_address_curid': sel_lineid,
			'wig_address_status': is_onshow
		})
	},
	wig_address_close: function (e) {
		if (e.target.id =='wig_address_close'){
			this.setData({
				'wig_address_status': false
			});
		}
	},
	wig_address_selectItem:function(e){
		this.setOrderAddr(e.currentTarget.id);
		this.setData({
      'wig_address_status': false
		});

	},
	wig_address_modifyItem:function(e){
		wx.navigateTo({
			url: '/pages/address/edit?lineid=' + e.currentTarget.id,
		})
	},
  wig_address_delItem: function (e) {
    this.delOrderAddr(e.currentTarget.id);
    this.setData({
      'wig_address_status': true
    });
  },
	wig_address_addItem: function (e) {
		wx.navigateTo({
			url: '/pages/address/edit'
		})
	},
	wig_data: {
		'wig_address_status':false,
		'wig_address_list': []
	}
};

var wig_pickshop = {
	wig_pickshop_init: function ( sel_shopid, is_onshow = true) {
		this.wig_pickshop_loadShops((shoplist)=>{
			this.setData({
				'wig_pickshop_list': shoplist,
				'wig_pickshop_curid': sel_shopid,
				'wig_pickshop_status': is_onshow
			})
		})
	},
	wig_pickshop_loadShops: function (callback) {
		if (!this.wig_data.wig_pickshop_list) {
			wx.showLoading({ title: '门店加载中' });
			app.fetchShops({ 'page': 1 }, (json) => {
				wx.hideLoading();
				this.wig_data.wig_pickshop_list = json.shops;
				callback(this.wig_data.wig_pickshop_list);
			})
		} else {
			callback(this.wig_data.wig_pickshop_list);
		}
	},
	wig_pickshop_close: function (e) {
		if (e.target.id == 'wig_pickshop_close') {
			this.setData({
				'wig_pickshop_status': false
			});
		}
	},
	wig_pickshop_selectItem: function (e) {

		//直接关闭所有弹窗
		this.setData({
			'wig_pickshop_status': false,
			'wig_deliver_curtype': 'inshop',
			'wig_deliver_status': false,
			'wig_pickshop_curid':e.detail.id
		});
		this.setPickShopAddr(e.currentTarget.id);
	},
	wig_data: {
		'wig_pickshop_status': false,
		'wig_pickshop_list':null
	}
};

// 配送方式选择
var wig_deliver = {
	wig_deliver_switchType:function(e){
		var curtype = e.currentTarget.id;
		if (curtype=='inshop'){
			this.wig_pickshop_loadShops((shops)=>{
				this.wig_deliver_renderCurshop();
			});
		}
		this.setData({
			'wig_deliver_temptype': curtype
		});
	},
	wig_deliver_getShopbyId:function(id,callback){
		this.wig_pickshop_loadShops((shops) => {
			var shop = false;
			if(id){
				shops.forEach((item) => {
					if (item.shop_id == id) {
						shop = item;
					}
				});
			}else{
				shop = shops[0];
			}
			callback(shop);
		});
	},
	wig_deliver_confirm:function(e){
		this.setData({
			'wig_deliver_curtype': this.data.wig_deliver_temptype,
			'wig_deliver_status':false
		});
		this.refreshDeliverType(this.data.wig_deliver_temptype);
	},
	wig_deliver_renderCurshop: function () {
		var curshop = this.data.pickAddr || this.wig_data.wig_pickshop_list[0];
		this.setData({
			'wig_deliver_curpickshop':curshop
		});
	},
	wig_deliver_showNearshops:function(){
		this.wig_pickshop_init(this.data.wig_deliver_curpickshop.shop_id || '');
	},
	wig_deliver_init: function (deliverOptions,curtype) {
		this.setData({
			'wig_deliver_delivertype': deliverOptions,
			'wig_deliver_curtype': curtype || deliverOptions[0]['type'],
			'wig_deliver_temptype': curtype || deliverOptions[0]['type'],
			'wig_deliver_status': true
		});

		if (this.data.wig_deliver_curtype == 'inshop') {
			this.wig_pickshop_loadShops((shops) => {
				this.wig_deliver_renderCurshop();
			});
		}
	},
	wig_deliver_close: function (e) {
		if (e.target.id == 'wig_deliver_close') {
			this.setData({
				'wig_deliver_status': false
			});
		}
	},
	wig_data: {
		'wig_deliver_delivertype': null,
		'wig_deliver_curtype':null,
		'wig_deliver_temptype': null,
		'wig_deliver_status':false
	},



	bindSetRecAddr: function (e) {
		var lineid = this.data.recAddr && this.data.recAddr.lineid || '';
		app.getVipAddrs((addrs) => {
			this.wig_address_init(addrs, lineid)
		});
	},
	bindSetPickAddr: function (e) {
		var shopid = this.data.pickAddr && this.data.pickAddr.shop_id || '';
		this.wig_pickshop_init(shopid);
	},
	bindSetDeliver: function () {
		//选择配送
		this.wig_deliver_init(this.data.deliverOptions, this.data.deliver_type);
	},
	initDeiverType: function (typecode) {
		//初始化配送方式
		// typecode=1:到店取货；2：快递配送；9：任意方式
		if (typecode == 9) {
			var types = [{ 'type': 'online', 'name': '快递配送' }, { 'type': 'inshop', 'name': '门店取货' }];
		}
		if (typecode == 1) {
			var types = [{ 'type': 'inshop', 'name': '门店取货' }];
		}
		if (typecode == 2) {
			var types = [{ 'type': 'online', 'name': '快递配送' }];
		}
		this.setData({
			'deliverOptions': types,
			'deliver_type': types[0]['type']
		});
		if (types[0]['type'] == 'online') {
			this.setOrderAddr();
		}
		if (types[0]['type'] == 'inshop') {
			//this.wig_address_init(addrs, lineid)
			this.setPickShopAddr();//不传shopid就取第一条
		}
	},
	refreshDeliverType: function (type_code) {
		//刷新配送方式
		if (type_code == 'inshop') {
			this.setPickShopAddr();
		}
		if (type_code == 'online') {
			this.setOrderAddr();
		}
		this.setData({
			'deliver_type': type_code
		});
	}
	
};

Object.assign(wig_deliver.wig_data, wig_address.wig_data);
Object.assign(wig_deliver, wig_address);

Object.assign(wig_deliver.wig_data, wig_pickshop.wig_data);
Object.assign(wig_deliver, wig_pickshop);


module.exports = wig_deliver;