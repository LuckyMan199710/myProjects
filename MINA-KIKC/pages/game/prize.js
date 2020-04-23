//获取应用实例
var app = getApp()
var wig_deliver = require('../../utils/wig_deliver.js');
var wig_address = {
	wig_address_addNewAddr: function (res) { 
  },
	wig_address_init: function (addrlist, sel_lineid, is_onshow = true) {
		this.setData({
			'wig_address_list': addrlist,
			'wig_address_curid': sel_lineid,
			'wig_address_status': is_onshow
		})
	},
	wig_address_close: function (e) {
		if (e.target.id == 'wig_address_close') {
			this.setData({
				'wig_address_status': false
			});
		}
	},
	wig_address_selectItem: function (e) {
		this.setOrderAddr(e.currentTarget.id);
		this.setData({
			'wig_address_status': false
		});
	},
	wig_address_modifyItem: function (e) {
		wx.navigateTo({
			url: '/pages/address/edit?lineid=' + e.currentTarget.id,
		})
	},
	wig_address_addItem: function (e) {
		wx.navigateTo({
			url: '/pages/address/edit'
		})
	},
	wig_data: {
		'wig_address_status': false,
		'wig_address_list': []
	}
};

var pageObj = {
  data: {
    'base_conf': app.DF,
    page_path: 'pages/game/prize'
  }, 
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
      this.renderAddr();
    });
    app.updateIconStyle(this);
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的奖品' });
  },
  initPage:function(){
    var _this = this;
    wx.showLoading();
    app.http.post('Game/getuserprizes', {}, function (json) {
      wx.hideLoading();
      _this.setData({
        'prizes': json.data || [],
        'load_end': true
      });
    })
  },
	renderAddr: function () {
		var _this = this;
		//重绘地址
		if (wx.getStorageSync('refeshAddr')) {
      var new_addrs = wx.getStorageSync('vip_address') || [];
      var last_addrs = this.data.wig_address_list || [];
      if (new_addrs.length > last_addrs.length){
        _this.setOrderAddr( new_addrs[new_addrs.length - 1]['lineid'] );
        _this.setData({
          'wig_address_status': false
        });
      }else{
        // app.getVipAddrs((addrs) => {
        //   _this.wig_address_init(addrs)
        // });
        _this.setOrderAddr(wx.getStorageSync('refeshAddr') || '');
        _this.setData({
          'wig_address_status': false
        });
      }
			wx.setStorageSync('refeshAddr', false);
		}
	},
	updateRemotePrize:function(prizeid,lineid,callback){
		app.http.post('Game/setPrizeAddr', { 'prizeid': prizeid,'lineid':lineid},function(json){
			callback(json);
		})
	},
	updatePrizeAddr: function (prizeid,addr){
		var prizes = [];
		this.data.prizes.forEach(function(item){
			if(item.id == prizeid){
				Object.assign(item,addr);
			}
			prizes.push(item);
		});
		this.setData({
			'prizes': prizes
		});
	},
	setOrderAddr: function (lineid) {
		//为某个实物奖品设置地址
		var _this = this;
		if (lineid) {
			var prizeid = this.data.cureditPrizeId;
			_this.updateRemotePrize(prizeid,lineid,function(json){
				if(json.success==1){
					var addr = app.getVipAddrById(lineid);
					_this.updatePrizeAddr(prizeid, addr);
				}
			});
		}
	},
	getPrizeById: function (prizeid){
		var target = false;
		this.data.prizes.forEach(function(item){
			if(item.id==prizeid){
				target = item;
			}
		});
		return target;
	},
	bindEditRecAddr: function (e) {
		var _this = this;
		var id = e.currentTarget.id
		var prize = this.getPrizeById(id);

		_this.setData({
			'cureditPrizeId':id
		});
    
		app.getVipAddrs((addrs) => {
      addrs && addrs.forEach(function (item, index) {
        if (item.phone == prize.phone && item.state == prize.state && item.city == prize.city && item.district == prize.district && item.address == prize.address){
          addrs[index].isdefault='Y'
        }
      })
			_this.wig_address_init(addrs)
		});
	},
  // 复制功能
  copyTBL: function(e) {
    var self = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.exch,
      success: function (res) {
        // app.alertMsg('复制成功')
      }
    });
  },
  delOrderAddr: function (lineid) {
    var _this = this;
    if (lineid) {
      var addr = app.getVipAddrById(lineid);
      if (addr) {
        wx.showLoading({ title: '请稍后...' })
        app.http.post('Member/delVipAddress', { 'id': addr.id }, function (json) {
          wx.hideLoading();
          if (json.success == -1) {
            app.alertMsg(json.msg);
          } else {
            _this.setData({
              'wig_address_list': json.data,
            });
            console.log(json.data)
            wx.setStorageSync('vip_address', json.data || []);
          }
        });
        return
      }

    }
  },


};
Object.assign(pageObj.data, wig_address.wig_data);
Object.assign(pageObj, wig_address);

Object.assign(pageObj.data, wig_deliver.wig_data);
Object.assign(pageObj, wig_deliver);

Page(pageObj);
