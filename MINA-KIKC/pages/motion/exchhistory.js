//获取应用实例
var app = getApp()
var wig_deliver = require('../../utils/wig_deliver.js');
var page = 1;
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
    page_path: 'pages/game/prize',
    wig_pickshop_list: [],
    arealist: [],
    myindex: '',
    wig_address_curid: 1
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
      this.renderAddr();
    });
    app.updateIconStyle(this);
    // 加载可选择地区列表
    this.getareas();
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));

    this.setData({
      'windowWidth': app.globalData.sys_info.windowWidth,
      'windowHeight': app.globalData.sys_info.windowHeight
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的兑换订单' });
  },
  initPage: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('werun/getUserprizes', {}, function (json) {
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
      if (new_addrs.length > last_addrs.length) {
        _this.setOrderAddr(new_addrs[new_addrs.length - 1]['lineid']);
        _this.setData({
          'wig_address_status': false
        });
      } else {
        app.getVipAddrs((addrs) => {
          _this.wig_address_init(addrs)
        });
        _this.setOrderAddr(wx.getStorageSync('refeshAddr') || '');
        _this.setData({
          'wig_address_status': false
        });
      }
      wx.setStorageSync('refeshAddr', false);
    }
  },
  updateRemotePrize: function (data, callback) {
    app.http.post('werun/setExchaddr', data, function (json) {
      callback(json);
    })
  },
  updatePrizeAddr: function (prizeid, addr) {
    var prizes = [];
    console.log('addr', addr);
    // this.data.prizes.forEach(function (item) {
    //   if (item.id == prizeid) {
    //     Object.assign(item, addr);
    //   }
    //   prizes.push(item);
    // });
    // this.setData({
    //   'prizes': prizes
    // });
    this.initPage()

  },
  setOrderAddr: function (lineid) {
    //为某个实物奖品设置地址
    var _this = this;
    if (lineid) {
      var prizeid = this.data.cureditPrizeId;
      let data = {
        delivertype: 'ONLINE',
        billno: prizeid,
        lineid: lineid
      }
      _this.updateRemotePrize(data, function (json) {
        if (json.success == 1) {
          var addr = app.getVipAddrById(lineid);
          _this.updatePrizeAddr(prizeid, addr);
        }
      });
    }
  },
  
  getPrizeById: function (prizeid) {
    var target = false;
    this.data.prizes.forEach(function (item) {
      if (item.id == prizeid) {
        target = item;
      }
    });
    return target;
  },
  // 选择门店
  showNearshops: function (e) {
    console.log('选择门店',e)
    let _this = this;

    _this.setData({
      wig_pickshop_status: true,
      cureditPrizeId: e.currentTarget.id,
      act_billno: e.currentTarget.dataset.billno
    })
    _this.getlotshops();
  },
  // 关闭弹窗
  shop_close: function (e) {
    if (e.target.id == 'wig_pickshop_close') {
      this.setData({
        'wig_pickshop_status': false,
        myindex: '',
        areanum: ''
      });
    }
  },
  // 确定门店
  selectItem: function (e) {
    //直接关闭所有弹窗
    this.setData({
      'wig_pickshop_status': false,
      myindex: '',
      areanum: ''
    });
    //为某个实物奖品设置地址
    var _this = this;
      var prizeid = this.data.cureditPrizeId;
      let data = {
        delivertype: 'INSHOP',
        billno: prizeid,
        shopid: e.currentTarget.id
      }
      _this.updateRemotePrize(data, function (json) {
        console.log('更改门店自取地址', json)
        if (json.success == 1) {
          // var addr = app.getVipAddrById(lineid);
          _this.updatePrizeAddr(prizeid);
        }
      });
    
  },
  // 选择配送方式
  handleChoicetype: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.id;
    if (index !== '') {
      this.data.prizes[index].prize_deliver ='ONLINE';
      this.setData({
        prizes: this.data.prizes
      })
    }
  },
  // 滑到底部加载
  handleLoad: function () {
    console.log('滑到底部' + page);
    var that = this;
    if (that.data.dataend == false) {
      page++;
      that.getlotshops();
    }
  },
  // 获取地区列表
  getareas: function() {
    let _this = this;
    wx.showLoading({ title: '' });
    app.http.post('Pubdata/getareas', {}, (json) => {
      wx.hideLoading();
      if (json.success !== 1) return false;
      let arr = [];
      for (let i = 0; i < json.data.length; i++) {
        arr.push(json.data[i].areaname)
      }
      _this.setData({
        arealist: arr,
        areaObj: json.data
      })
    })
  },
  bindPickerChange(e) {
    let myindex = e.detail.value;
    this.setData({
      myindex: myindex,
      areanum: this.data.areaObj[myindex].areanum
    })
    page = 1;
    this.getlotshops()
  },
  // 获取门店列表数据
  getlotshops: function () {
    let _this = this;
    let zdy = {
      billno: _this.data.act_billno,
      'page': page, 
      'size': 20
    }
    if (_this.data.areanum) {
      zdy.areanum = _this.data.areanum
    }
    wx.showLoading({ title: '门店加载中' });
    app.http.post('werun/lotshops', zdy, (json) => {
      wx.hideLoading();
      let data = json.data;
      if (page == 1) {
        _this.setData({
          wig_pickshop_list: data.shoplist,
          dataend: data.isend
        })
      } else {
        var l = _this.data.wig_pickshop_list;
        for (var i = 0; i < data.shoplist.length; i++) {
          l.push(data.shoplist[i])
        }
        _this.setData({
          dataend: data.isend,
          wig_pickshop_list: l
        });
      }
    })
  },
  bindEditRecAddr: function (e) {
    var _this = this;
    var id = e.currentTarget.id
    var prize = this.getPrizeById(id);

    _this.setData({
      'cureditPrizeId': id
    });

    app.getVipAddrs((addrs) => {
      addrs && addrs.forEach(function (item, index) {
        if (item.phone == prize.phone && item.state == prize.state && item.city == prize.city && item.district == prize.district && item.address == prize.address) {
          addrs[index].isdefault = 'Y'
        }
      })
      _this.wig_address_init(addrs)
    });
  },
  // 复制功能
  copyTBL: function (e) {
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
