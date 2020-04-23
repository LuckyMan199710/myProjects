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
  'new_addcart_bindSkuid': function (e) {
    var id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index
    var curskuid = this.getSkuTargetByskuid(this.__prodskudata[index].data, id);
    let stateNavIdx = "skuList[" + index + "].curskuid";
    this.setData({
      [stateNavIdx]: curskuid,
      'curbuyqty': 1
    });
  },
  'new_addcart_bindSku1': function (e) {
    var id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index
    var sku2objs = this.getSku2BySku1(this.__prodskudata[index].data, id);
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata[index].data, id, sku2objs[0]['spec_num']);
    let stateNavIdx = "skuList[" + index + "].curskuid";
    let sku2 = "skuList[" + index + "].sku2";
    this.setData({
      [sku2]: sku2objs,
      [stateNavIdx]: curskuid,
      'curbuyqty': 1
    });
  },
  'new_addcart_bindSku2': function (e) {
    var id = e.currentTarget.id;
    console.log(e)
    let skuid = e.currentTarget.dataset.curskuid
    let index = e.currentTarget.dataset.index
    
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata[index].data, skuid['color_num'], id);
    console.log('skuidskuidskuid', curskuid)
    let stateNavIdx = "skuList[" + index + "].curskuid";
    this.setData({
      [stateNavIdx]: curskuid,
      'curbuyqty': 1
    });
  },
  'new_addcart_bindAdd': function() {
    console.log(this.data.skuList);
    
    let arr = this.data.skuList
    for (let i=0;i<arr.length;i++) {
      if (arr[i].curskuid['promo_z'] && arr[i].curskuid['promo_z']['isstart'] && arr[i].curskuid['promo_z']['limit_stock'] == 'Y' && arr[i].curskuid['promo_z']['promo_leftqty'] < 1) {
        // app.alertMsg(arr[i].curskuid.plat_num_name + '商品库存不足')
        // app.alertMsg('请选择有效尺码')
        this.setData({
          'intoindex': 'sku' + i
        })
        return false
      } else if (arr[i].curskuid['promo_p'] && arr[i].curskuid['promo_p']['isstart'] && arr[i].curskuid['promo_p']['limit_stock'] == 'Y' && arr[i].curskuid['promo_p']['promo_leftqty'] < 1) {
        // app.alertMsg(arr[i].curskuid.plat_num_name + '商品库存不足')
        // app.alertMsg('请选择有效尺码')
        this.setData({
          'intoindex': 'sku' + i
        })
        return false
      } else if (arr[i].curskuid.stockqty < 1) {
        // app.alertMsg(arr[i].curskuid.plat_num_name + '库存不足')
        // app.alertMsg('请选择有效尺码')
        this.setData({
          'intoindex': 'sku' + i
        })
        return false
      }
    }
    // 条件都满足时，执行递归提交购物车
    this.data.skuList.map(item => {
      this._addcart_bindAdd(item.curskuid)
    })
    this.setData({
      'intoindex': ''
    })
  },

  '_addcart_bindAdd': function (curskuid) {
    var _this = this;
    if (!curskuid) { return false; }
    var post_data = {
      'plat_sku_iid': curskuid.plat_sku_iid,
      'plat_num_iid': curskuid.plat_num_iid,
      'buyqty': 1,
      'prod_promo': _this.data.prod_promo || '',
      // 'share_vipid': share_vipid || ''
    };
    if (curskuid.promo_x && curskuid.promo_x['billno']) {
      post_data['x_promo'] = curskuid.promo_x['billno']
    }
    this.new_addcart_bindClode();
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
  'new_addcart_bindClode': function (e) {
    this.setData({
      'new_is_addcart_show': false,
      'intoindex': ''
    });
  },
  'newfetchSkus': function (options) {
    console.log(options)
    wx.showLoading();
    let _this = this
    let data = {
      prom_id: options.prom_id,
      shop_id: options.shop_id
    }
    app.http.post('Prod/getAllProdSkus', data, function(json) {
      wx.hideLoading();
      console.log(':::::::::::::::::::::::::::::', json)
      if (json.success == 1) {
        if (!json.data) {
          app.alertMsg('读取产品sku数据失败');
          return false;
        }
        let data = json.data
        _this.__prodskudata = json.data;
        data.map(item => {
          var skulvl = _this.getFormatSkuLvl(item.data);
          var default_skuid = item.data[0];

          item['curskuid'] = default_skuid

          if (skulvl == 1) {
            item.data[0].skulvl = 1
            item.sku1 = item.data
          } else {
            var query_color = skulvl['sku1'][0];
            var sku2objs = _this.getSku2BySku1(item.data, query_color);

            item.data[0].skulvl = 2
            item.sku1 = skulvl['sku1name']
            item.sku2 = sku2objs
          }
        })
        _this.setData({
          skuList: data,
          'new_is_addcart_show': true,
        })
      }
    })
  },
  newshowAddcart: function (options) {
    //显示sku面板
    this.newfetchSkus(options);
  },
  preventMaskMove: function () { }
};