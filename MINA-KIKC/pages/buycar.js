var app = getApp();
var _M = require('../utils/m.js');

import manba from '../miniprogram_npm/manba/index.js'
var Buycart = _M.create();
Buycart.attributes = ['id', 'shop_id', 'buyqty', 'price', 'promo', 'settled'];

Buycart.include({
  'updateRemote': function (url, callback) {
    var data = this.attributes();
    Object.assign(data, this.old_attr_data);
    app.http.post(url, data, callback);
  }
})

let pageObj = {
  data: {
    'ontabpage': 'buycar',
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    buycar_err: '',
    show_promo: false,
    page_path: 'pages/buycar',
    sel_del_map: {},//映射删除的商品id选中状态
    mallfunc_status: 'N',
    servertime: '',
  },
  bindSwitchEditStatus: function () {
    //编辑状态
    this.setData({ 'edit_status': !this.data.edit_status });
  },
  bindSelDel: function (e) {
    //勾选删除项
    var map_status = this.data.sel_del_map;
    var id = e.currentTarget.id;
    if (map_status.hasOwnProperty(id)) {
      delete map_status[id];
    } else {
      map_status[id] = true;
    }
    this.setData({
      'sel_del_map': map_status
    });
  },
  bindRadioTap: function (e) {
    // 勾选结算项
    var id = e.currentTarget.id;
    var curins = Buycart.find(e.currentTarget.id);
    curins.settled = curins.settled == 'Y' ? 'N' : 'Y';
    this._updateIns(curins);
  },
  bindBuy: function (e) {
    // 跳转结算
    wx.navigateTo({
      url: '/pages/mall/orderconfirm',
    })
  },
  bindDel: function (e) {
    var _this = this;
    var del_ids = [];
    for (var key in this.data.sel_del_map) {
      if (this.data.sel_del_map.hasOwnProperty(key)) {
        del_ids.push(key);
      }
    }
    wx.showLoading({ mask: true })
    app.http.post('Prod/deleteBuycar', { del_ids: del_ids }, function (json) {
      wx.hideLoading()
      if (json.success == 1) {
        _this.loadBuycart();
      }
    });
  },
  _updateIns: function (curins) {
    var _this = this;
    wx.showLoading({ mask: true })
    curins.updateRemote('Prod/updateBuycar', function (json) {
      wx.hideLoading()
      if (json.success == 1) {
        curins.save();
        curins.update();
        _this.render(json);
      } else {
        app.alertMsg(json.msg)
      }
    })
  },
  //currentTarget:function(e){
  wig_counter_change: function (e) {
    var type = e.currentTarget.dataset && e.currentTarget.dataset.type;
    var id = e.currentTarget.id;
    var curins = Buycart.find(e.currentTarget.id);
    if (type == 'l') {
      if (curins.buyqty <= 1) {
        return false;
      }
      curins.buyqty--;
    }
    if (type == 'r') {
      curins.buyqty++;
    }
    this._updateIns(curins);
  },
  'bindBalPayBlur': function (e) {
    //填写下单数量
    var v = e.detail.value;
    var id = e.currentTarget.id;
    var curins = Buycart.find(e.currentTarget.id);
    if (v == '' || v <= 0 || isNaN(v) || v != Math.round(v)) {
      app.alertMsg('购买数量必须是正整数');
      return false;
    }
    else {
      curins.buyqty = v;
      this._updateIns(curins);
    }
  },
  bindPickerChange: function (e) {
    var sel_prom_idx = e.detail.value;
    var id = e.currentTarget.id;
    var curins = Buycart.find(e.currentTarget.id);
    if (curins.promos && curins.promos.length > 0) {
      let last_promo = curins.promo;
      if (sel_prom_idx == curins.promos.length) {
        curins.promo = '';
      } else {
        curins.promo = curins.promos[sel_prom_idx]['billno'];
      }
      if (last_promo == curins.promo) {
        return false;
      }
      this._updateIns(curins);
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '购物车' });
  },
  onLoad: function (option) { },
  onShow: function () {
    var _this = this;
    app.userLoginPromise
      .then(json => {
        _this.loadBuycart();
      });
    app.updateIconStyle(this);
  },
  render: function (json) {
    var num = 0;
    var shop_prods = json.shop_prods;
    console.log('render  json', json);
    this.data.servertime = json.servertime;
    for (let k in shop_prods) {
      var shop_user_prods = shop_prods[k]['user_prods'];
      shop_user_prods && shop_user_prods.forEach(function (item, idx) {
        var promos = Array.from(Buycart.find(item._id)['promos'] || []);
        if (promos.length > 0) {

          promos.push({ 'billno': '', 'promo_name': '不参与' });
          item.sel_promo_idx = promos.length - 1;
          if (item.promo) {
            for (var pi = 0; pi < promos.length; pi++) {
              if (promos[pi]['billno'] == item.promo) {
                item.sel_promo_idx = pi;
                break;
              }
            }
          }

        }
        item['promos'] = promos;
        return item;
      })
    }

    var promo_prods = json.promo_prods;
    for (let k in promo_prods) {
      let startdate = undefined;
      let enddate = undefined;
      if (promo_prods[k].startdate != undefined) {
        startdate = promo_prods[k].startdate.replace(/-/g, '/');
      }
      if (promo_prods[k].enddate != undefined) {
        enddate = promo_prods[k].enddate.replace(/-/g, '/');
      }

      //let nowTime = new Date().getTime()
      let nowTime = new Date(this.data.servertime.replace(/-/g, '/')).getTime();
      // 未开始
      if (new Date(startdate).getTime() > nowTime) {
        promo_prods[k].isDiscount = false

      } else if (new Date(startdate).getTime() < nowTime && nowTime < new Date(enddate).getTime()) {
        promo_prods[k].isDiscount = true
      }
      //console.log("预热活动中"+promo_prods[k].isDiscount)
      promo_prods[k].formatstartdate = manba(startdate).format('MM月DD日 hh:mm')
      promo_prods[k].formatenddate = manba(enddate).format('MM月DD日 hh:mm')

      var promo_user_prods = promo_prods[k]['user_prods'];
      if (promo_user_prods && promo_user_prods.length > 0) {
        promo_user_prods.forEach(function (item, idx) {
          var promos = Array.from(Buycart.find(item._id)['promos'] || []);
          // console.log('promos:::::::::::::::', promos, item.promo)
          item.save_price = parseInt(item.price - item.promo_price)
          if (item.promo_price == undefined) {
            item.discounts = 0;
          } else {
            item.discounts = Number(item.promo_price / item.price).toFixed(2)
          }
          if (promos.length > 0) {
            promos.push({ 'billno': '', 'promo_name': '不参与' });
            item.sel_promo_idx = promos.length - 1;
            if (item.promo) {
              for (var pi = 0; pi < promos.length; pi++) {
                if (promos[pi]['billno'] == item.promo) {
                  item.sel_promo_idx = pi;
                  // console.log('pi::::::::::::::', pi)
                  break;
                } else {
                  item.sel_promo_idx = 0
                }
              }
            }
            // console.log('-----------------------------', item.sel_promo_idx)
          }
          item['promos'] = promos;
          return item;
        })
      }
    }
    this.setData({
      'shop_prods': shop_prods,
      'promo_prods': promo_prods,

      'num': json.ttl_num,
      'settled_num': json.settled_num,

      'ttl_disc_fee': json.ttl_disc_fee || 0,
      'ttl_pay_fee': json.ttl_pay_fee,
      'ttl_prod_fee': json.ttl_prod_fee,

      'buycar_err': json.msg || '',
      'has_load': true
    })
  },
  loadBuycart: function () {
    var _this = this;
    wx.showLoading({ mask: true });
    app.http.post('Prod/getBuycart', {}, (json) => {
      if (json.success == -1) {
        app.alertMsg(json.msg);
      }
      _this.setData({
        'mallfunc_status': json['mallfunc_status'] || "N"
      });
      wx.hideLoading();
      Buycart.populate(json.data);//载入列表数据
      _this.render(json);

    });
  }
};
Page(pageObj);