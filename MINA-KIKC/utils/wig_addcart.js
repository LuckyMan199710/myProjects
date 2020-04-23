var app = getApp();
module.exports = {
  'getFormatSkuLvl': function (data) {
    var sku1 = [];
    var sku1name = [];
    var sku2 = [];
    var skulvl = 2;
    var targetsku1 = [];
    console.log('getFormatSkuLvl');
    data.forEach(function (item) {

      if (item.color == 'null') { item.color = '' }
      if (item.spec == 'null') { item.spec = '' }

      if (item.color_num && (sku1.indexOf(item.color_num) == -1)) {
        sku1.push(item.color_num);
        if (item.stockqty > 0) {
          targetsku1.push(item.color_num);
        }
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

    if (skulvl == 1) {
      return 1;
    }
    console.log('getFormatSkuLvl');
    console.log('sku1', sku1);
    console.log('sku2', sku2);
    return {
      'sku1': sku1,
      'sku2': sku2,
      'sku1name': sku1name,
      'targetsku1': targetsku1
    }
  },
  'getSku2BySku1': function (data, skul_num) {
    var _this = this;
    var tempdata = [];
    data.forEach(function (item) {
      if (item.color_num == skul_num) {
        tempdata.push(item);
      }

    });
    return tempdata;
  },
  'getSkuTargetBycolorspec': function (data, color_num, spec_num) {
    var _this = this;
    console.log('getSkuTargetBycolorspec  bargain_one', _this.data.bargain_one);
    var target = null;
    data.forEach(function (item) {
      if (item.color_num == color_num && item.spec_num == spec_num) {
        target = item;
      }

    });
    return target;
  },
  'getSkuTargetByskuid': function (data, skuid) {
    var _this = this;
    console.log('getSkuTargetByskuid  bargain_one', _this.data.bargain_one);
    var target = null;
    data.forEach(function (item) {
      if (item.sku_id == skuid) {
        target = item;
      }

    });
    return target;
  },
  'addcart_bindSkuid': function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetByskuid(this.__prodskudata, id);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },
  'addcart_bindSku1': function (e) {
    var id = e.currentTarget.id;
    var sku2objs = this.getSku2BySku1(this.__prodskudata, id);
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, id, sku2objs[0]['spec_num']);
    this.setData({
      'sku2': sku2objs,
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },
  'addcart_bindSku2': function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, this.data.curskuid['color_num'], id);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },
  'addcart_decNum': function (e) {
    var num = this.data.curbuyqty;
    var nums = parseInt(num) - 1;
    if (nums <= 1) {
      nums = 1;
    }
    this.setData({
      'curbuyqty': nums
    });
  },
  'addcart_incNum': function (e) {
    this.setData({
      'curbuyqty': parseInt(this.data.curbuyqty) + 1
    });
  },

  //选中
  'addcart_bindSelected': function (e) {
    var curskuid = this.data.curskuid;
    console.log(curskuid)
    this.setData({
      color_name: curskuid.color || '',
      spec_num: curskuid.spec_num || ''
    })
    this.addcart_bindClode();
  },
  'addcart_bindAdd': function () {
    var _this = this;
    if (!this.data.curskuid) { return false; }
    var post_data = {
      'plat_sku_iid': this.data.curskuid.plat_sku_iid,
      'plat_num_iid': this.data.curskuid.plat_num_iid,
      'buyqty': this.data.curbuyqty || 1,
      'prod_promo': this.data.prod_promo || '',
      'share_vipid': this.data.share_vipid || ''
    };
    if (this.data.curskuid.promo_x && this.data.curskuid.promo_x['billno']) {
      post_data['x_promo'] = this.data.curskuid.promo_x['billno']
    }
    this.addcart_bindClode();
    wx.showLoading({ mask: true });
    console.log('addBuycart  post_data', post_data);
    app.http.post('Prod/addBuycart', post_data, function (json) {
      wx.hideLoading();
      wx.showToast({ title: json.msg });
      _this.setData({
        cartsum: json.sum
      })
      if (json.success == 1) { }
    })
  },
  'addcart_bindBuy': function () {
    if (this.data.curskuid.promo_z && this.data.curskuid.promo_z.isstart && this.data.curskuid.promo_z.limit_stock.toUpperCase() == 'Y' && this.data.curskuid.promo_z.promo_leftqty < 1) {
      app.alertMsg("商品库存不足");
      return false;
    }
    if (this.data.curskuid.promo_p && this.data.curskuid.promo_p.isstart && this.data.curskuid.promo_p.limit_stock.toUpperCase() == 'Y' && this.data.curskuid.promo_p.promo_leftqty < 1) {
      app.alertMsg("商品库存不足");
      return false;
    }
    if (this.data.curskuid.stockqty < 1) {
      app.alertMsg("商品库存不足");
      return false;
    }
    var curskuid = this.data.curskuid;
    var curbuyqty = this.data.curbuyqty || 1;//this.data.buyqty || 1;
    var share_vipid = this.data.share_vipid || '';
    console.log('addcart_bindBuy');
    console.log(this.data);
    var target_url = '/pages/mall/orderconfirm?plat_num_iid=' + curskuid['plat_num_iid'] + '&plat_sku_iid=' + curskuid['plat_sku_iid'] + '&buyqty=' + curbuyqty + '&share_vipid=' + share_vipid;
    if (this.data.curgroupid) {
      target_url = target_url + '&group_id=' + this.data.curgroupid;
    }

    if (this.data.promo_num) {
      target_url = target_url + '&promo_num=' + this.data.promo_num;
    }
    if (this.data.gifttype) {
      target_url = target_url + '&gifttype=' + this.data.gifttype;
    }
    console.log('addcart_bindBuy  target_url', target_url);
    wx.navigateTo({
      url: target_url
    })
  },
  'addcart_bindClode': function (e) {
    this.setData({
      'is_addcart_show': false
    });
  },
  'bindBalPayBlur': function (e) {
    //填写下单数量
    var v = e.detail.value;
    console.log('bindBalPayBlur  value', e);
    console.log(v);
    if (v == '' || v <= 0 || isNaN(v) || v != Math.round(v)) {
      // app.alertMsg('购买数量必须是正整数');
      return 1;
    } else if (v > this.data.curskuid.stockqty) {
      return this.data.curskuid.stockqty
    }
    else {
      this.setData({
        'curbuyqty': parseInt(v)
      });
    }
  },
  'fetchSkus': function (pid, actiontype, share_vipid, curdata) {

    var _this = this;
    wx.showLoading();
    var post_data = { 'plat_num_iid': pid };
    if (curdata && curdata['curgroupid']) {
      post_data['group_id'] = curdata['curgroupid'];
    }
    if (curdata && curdata['promo_num']) {
      post_data['promo_num'] = curdata['promo_num'];
    }
    if (curdata && curdata['gifttype']) {
      _this.setData({ gifttype: curdata['gifttype'] });
      console.log('curdata', curdata);
    }
    console.log('getProdSkus  post_data', post_data);
    app.http.post('Prod/getProdSkus', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        if (!json.data) {
          app.alertMsg('读取产品sku数据失败');
          return false;
        }
        console.log('getProdSkus  json', json);
        var skulvl = _this.getFormatSkuLvl(json.data);
        _this.__prodskudata = json.data;
        var default_skuid = json.data[0];
        var curbuyqty = 1;
        if (curdata && curdata['curskuid']) {
          default_skuid = curdata['curskuid'];
        }
        if (curdata && curdata['curbuyqty']) {
          curbuyqty = curdata['curbuyqty'];
        }
        //参团
        if (curdata && curdata['curgroupid']) {
          _this.setData({ curgroupid: curdata['curgroupid'] });
        }
        if (curdata && curdata['promo_num']) {
          _this.setData({ promo_num: curdata['promo_num'] });
        }
        if (skulvl == 1) {

          _this.setData({
            'skulvl': 1,
            'sku1': json.data,
            'curskuid': default_skuid,
            'curbuyqty': curbuyqty,
            'addcart_good_cover': json.img,
            'is_addcart_show': true,
            'actiontype': actiontype || '',
            'share_vipid': share_vipid ? share_vipid : ''
          });
        } else {
          if (curdata && curdata['curskuid']) {
            var query_color = curdata['curskuid']['color_num'];
          } else {
            var query_color = skulvl['sku1'][0];
          }
          // var query_color = curdata && curdata['']
          var sku2objs = _this.getSku2BySku1(json.data, query_color);
          // var curskuid = _this.getSkuTargetBycolorspec(json.data, skulvl['sku1'][0], sku2objs[0]['spec_num']);
          // default_skuid
          console.log('sku1', skulvl['sku1name']);
          console.log('sku2', sku2objs);
          _this.setData({
            'skulvl': 2,
            'sku1': skulvl['sku1name'],
            'sku2': sku2objs,
            'curskuid': default_skuid,
            'curbuyqty': curbuyqty,
            'addcart_good_cover': json.img,
            'is_addcart_show': true,
            'actiontype': actiontype || '',
            'share_vipid': share_vipid ? share_vipid : ''
          });
        }
      } else {
        app.alertMsg('加载失败');
      }
    });
  },
  'fetchSkusNew': function (pid, actiontype, share_vipid, curdata) {

    var _this = this;
    wx.showLoading();
    var post_data = { 'plat_num_iid': pid };
    if (curdata && curdata['curgroupid']) {
      post_data['group_id'] = curdata['curgroupid'];
    }
    if (curdata && curdata['promo_num']) {
      post_data['promo_num'] = curdata['promo_num'];
    }
    if (curdata && curdata['gifttype']) {
      _this.setData({ gifttype: curdata['gifttype'] });
      console.log('curdata', curdata);
    }
    console.log('getProdSkus  post_data', post_data);
    let json = this.__prodskujson
    // app.http.post('Prod/getProdSkus', post_data, function (json) {
    wx.hideLoading();
    if (json.success == 1) {
      if (!json.data) {
        app.alertMsg('读取产品sku数据失败');
        return false;
      }
      console.log('getProdSkus  json', json);
      var skulvl = _this.getFormatSkuLvl(json.data);
      _this.__prodskudata = json.data;
      var default_skuid = json.data[0];
      var curbuyqty = 1;
      if (curdata && curdata['curskuid']) {
        default_skuid = curdata['curskuid'];
      }
      if (curdata && curdata['curbuyqty']) {
        curbuyqty = curdata['curbuyqty'];
      }
      //参团
      if (curdata && curdata['curgroupid']) {
        _this.setData({ curgroupid: curdata['curgroupid'] });
      }
      if (curdata && curdata['promo_num']) {
        _this.setData({ promo_num: curdata['promo_num'] });
      }
      if (skulvl == 1) {

        _this.setData({
          'skulvl': 1,
          'sku1': json.data,
          'curskuid': default_skuid,
          'curbuyqty': curbuyqty,
          'addcart_good_cover': json.img,
          'is_addcart_show': true,
          'actiontype': actiontype || '',
          'share_vipid': share_vipid ? share_vipid : ''
        });
      } else {
        if (curdata && curdata['curskuid']) {
          var query_color = curdata['curskuid']['color_num'];
        } else {
          var query_color = skulvl['sku1'][0];
        }
        // var query_color = curdata && curdata['']
        var sku2objs = _this.getSku2BySku1(json.data, query_color);
        // var curskuid = _this.getSkuTargetBycolorspec(json.data, skulvl['sku1'][0], sku2objs[0]['spec_num']);
        // default_skuid
        console.log('sku1', skulvl['sku1name']);
        console.log('sku2', sku2objs);
        _this.setData({
          'skulvl': 2,
          'sku1': skulvl['sku1name'],
          'sku2': sku2objs,
          'curskuid': default_skuid,
          'curbuyqty': curbuyqty,
          'addcart_good_cover': json.img,
          'is_addcart_show': true,
          'actiontype': actiontype || '',
          'share_vipid': share_vipid ? share_vipid : ''
        });
      }
    } else {
      app.alertMsg('加载失败');
    }
    // });
  },
  showAddcart: function (pid, actiontype, share_vipid, curdata) {
    console.log('showAddcart  curdata', curdata);
    //显示sku面板
    this.fetchSkus(pid, actiontype, share_vipid, curdata);
  },
  showAddcartNew: function (pid, actiontype, share_vipid, curdata) {
    this.fetchSkusNew(pid, actiontype, share_vipid, curdata)
  },
  preventMaskMove: function () { }
};

