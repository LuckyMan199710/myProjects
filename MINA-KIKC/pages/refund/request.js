var AddcartIns = require('../../utils/wig_addcart.js');
//main.js
//一级主
var app = getApp()
let pageObj = {
  data: {
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/refund/request',
    mytype: false, // 是否是换货
	menuvalues:'DD', //默认选择第一个
    curskuid: '',
    returndesc: ''
    // input_amt_exchange: '', // 换货的退款金额
  },
  //选项卡效果
  menuChange: function (e) {
    let value = e.currentTarget.dataset.value;
	if(value == 'EC'){
		this.setData({
			menuvalues:value,
			mytype:true
		})
	}
	else{
		this.setData({
			menuvalues:value,
			mytype:false
		})
	}
    /* var id = e.currentTarget.id;
    var new_value = e.detail.value;
    console.log('radioChange  e', e);
    if (new_value == 'EC') {
      this.setData({
        mytype: true
      })
    } else {
      this.setData({
        has_goods: new_value == 'DD' ? 'N' : 'Y',
        mytype: false
      });
    } */

    // this.setNewData(id, new_value, 1);
  },
  bindPickerChange: function (e) {
    this.setData({
      'sel_refund_idx': e.detail.value
    });
  },
  getRefundAmt() {
    let _this = this
    var post_data = {};
    post_data['billno'] = this.data.billno;
    post_data['plat_num_iid'] = this.data.plat_num_iid;
    post_data['plat_sku_iid'] = this.data.orderitem.plat_sku_iid;
    post_data['qty'] = this.data.orderitem['payment']

    app.http.post('Order/getRefundAmt', post_data, function (json) {
      if (json.success == 1) {
        _this.setData({
          'input_amt_exchange': json.refund_fee
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  bindInput: function (e) {
    var _this = this;
    var id = e.currentTarget.id;
    var value = e.detail.value;
    if (id == 'qty') {
      var input_qty = value;
      if (!value) {
        input_qty = '';
      }
      if (value > this.data.orderitem.qty || value < 0) {
        input_qty = '';
        // return false;
      }
      if (input_qty == '') {
        this.setData({
          'input_qty': input_qty,
          'input_amt': '--'
        })
        return false;
      }
      this.setData({
        'input_qty': input_qty,
        'input_amt': '正在计算...'
      })
      var post_data = {};
      post_data['billno'] = this.data.billno;
      post_data['plat_num_iid'] = this.data.plat_num_iid;
      post_data['plat_sku_iid'] = this.data.orderitem.plat_sku_iid;
      post_data['qty'] = input_qty;

      app.http.post('Order/getRefundAmt', post_data, function (json) {
        if (json.success == 1) {
          _this.setData({
            'input_amt': json.refund_fee
          });
        } else {
          app.alertMsg(json.msg);
        }
      });

      this.inputData[id] = e.detail.value;
    } else {
      this.inputData[id] = e.detail.value;
    }
  },
  formSubmit: function (e) {
    if (this.data.mytype) {
      this.exchangeMethod(e)
      return false
    }
    var post_data = e.detail.value;
    console.log('formSubmit  e', e);
    var _this = this;
    if (!post_data['reasondesc'].replace(/(^\s*)|(\s*$)/g, "")) {
      app.alertMsg('退款原因不能为空');
      return false;
    }
    //申请最大退款数量
    var orderitem = this.data.orderitem;
    var refund_qty = orderitem.qty - orderitem.cancelqty - orderitem.returnqty;
    if (post_data['qty'] > refund_qty || post_data['qty'] <= 0) {
      app.alertMsg('退款数量不正确,必须大于0小于等于' + refund_qty);
      return false;
    }
    var refundtypes = this.data.refundtype;
    refundtypes && refundtypes.forEach(function (item, idx) {
      if (idx == _this.data.sel_refund_idx) {
        post_data['returntype'] = item['code_num']
      }
    });
    post_data['billno'] = this.data.billno;
    post_data['plat_num_iid'] = this.data.plat_num_iid;
    post_data['plat_sku_iid'] = this.data.orderitem.plat_sku_iid;
    if (this.data.has_goods) {
      post_data['has_goods'] = this.data.has_goods;
    }
    // if (this.data.orderitem.status == 'PD'){
    //   post_data['qty'] = this.data.orderitem.qty;
    // }
    console.log('post_data', post_data);
    // return false;
    wx.showLoading();
    app.http.post('Order/refundreq', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        app.alertMsg(json.msg, {
          'cb': app.goBack
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  // 换货提交方法
  exchangeMethod(e) {
    var post_data = e.detail.value;
    // console.log('formSubmit  e', e);
    var _this = this;
    var option = this._option;
    var orderbill = option.orderbill || '';
	//商品规格是否选择完全
	if(this.data.skulvl ===2){
		if(!this.data.color_name || !this.data.spec_num){
			app.alertMsg('请选择需要更换的商品规格');
			return false;
		}	
	}
	if(this.data.skulvl === 1){
		if(!this.data.color_name || !this.data.spec_num){
			app.alertMsg('请选择需要更换的商品规格');
			return false;
		}
	}
    if (!post_data['exchangedesc'].replace(/(^\s*)|(\s*$)/g, "")) {
      app.alertMsg('换货原因不能为空');
      return false;
    }
    if (this.data.curskuid.sku_id == this.data.orderitem.sku_id) {
      app.alertMsg('请选择其他属性的商品');
      return false;
    }
    var data = {
      billno: orderbill,
      new_skuid: this.data.curskuid['sku_id'],
      new_plat_sku_iid:this.data.curskuid['plat_sku_iid'],
      old_skuid: this.data.orderitem['sku_id'],
      old_plat_sku_iid:this.data.orderitem['plat_sku_iid'],
      exchange_reason: post_data['exchangedesc']
    }
    // param: billno(订单号）/new_skuid（新的skuid）/exchange_reason(换货原因，限制30个字符前段也麻烦限制下)
    console.log(post_data['exchangedesc'], this.data.curskuid['sku_id'])
    app.http.post('order/exchange', data, function(res) {
      if (res.success == 0) {
        wx.showToast({
          title: '提交成功',
          duration: 1500,
          success() {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      }
    })
  },
 /* getProdSkus(plat_num_iid) {
    var _this = this;
    //加载sku
    app.http.post('Prod/getProdSkus', { 'plat_num_iid': plat_num_iid }, function (json) {
      console.log('getProdSkus json', json);
      if (json.success == 1) {
        if (!json.data) {
          app.alertMsg('读取产品sku数据失败', {
            cb: app.goBack
          });
          return false;
        }
		//
        var skulvl = _this.getFormatSkuLvl(json.data);
        console.log('getFormatSkuLvl ', _this.getFormatSkuLvl);
        _this.__prodskudata = json.data;
        console.log('skulvl 1112', skulvl);
        if (skulvl == 1) {
          _this.setData({
            'skulvl': 1,
            'sku1': json.data,
            'curskuid': json.data[0],
            'curbuyqty': 1
          });
        } else {
          console.log('skulvl 334', skulvl);
          var targetsku1 = skulvl['targetsku1'] && skulvl['targetsku1'].length > 0 ? skulvl['targetsku1'][0] : skulvl['sku1'][0];
          var sku2objs = _this.getSku2BySku1(json.data, targetsku1);
          var curskuid = _this.getSkuTargetBycolorspec(json.data, targetsku1, sku2objs[0]['spec_num']);
          _this.setData({
            'skulvl': 2,
            'sku1': skulvl['sku1name'],
            'sku2': sku2objs,
            'curskuid': curskuid,
            'curbuyqty': 1
          });
        }
        _this.getRelativeProd();


      } else {
        app.alertMsg('加载失败', { cb: app.goBack });
      }

    });
  }, */
  /* bindSku1: function (e) {
    var id = e.currentTarget.id;
    var sku2objs = this.getSku2BySku1(this.__prodskudata, id);
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, id, sku2objs[0]['spec_num']);
    console.log('bindSku1 curskuid', curskuid);
    this.setData({
      'sku2': sku2objs,
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  }, */
 /* bindSku2: function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, this.data.curskuid['color_num'], id);
    console.log('bindSku2 curskuid', curskuid);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  }, */
  /* bindSkuid: function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetByskuid(this.__prodskudata, id);
    console.log('bindSkuid curskuid', curskuid);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  }, */
  /* getSku2BySku1: function (data, skul_num) {
    var tempdata = [];
    data.forEach(function (item) {
      if (item.color_num == skul_num) {
        tempdata.push(item);
      }
    });
    return tempdata;
  }, */
 /* getSkuTargetByskuid(data, skuid) {
    var target = null;
    data.forEach(function (item) {
      if (item.sku_id == skuid) {
        target = item;
      }
    });
    return target;
  }, */
  /* getSkuTargetBycolorspec(data, color_num, spec_num) {
    var target = null;
    data.forEach(function (item) {
      if (item.color_num == color_num && item.spec_num == spec_num) {
        target = item;
      }
    });
    return target;
  }, */
  //读取相关商品
  getRelativeProd: function () {
    var _this = this;
    app.http.post('Prod/getRelativeProds', { 'plat_num_iid': this.data.plat_num_iid }, function (json) {
      _this.setData({
        'relativeprods': json.data
      })
    })
  },
  initPage: function () {
    var _this = this;
    //判断会员
    var option = this._option;
    var orderbill = option.orderbill || '';
    var plat_num_iid = option.plat_num_iid || '';
    var plat_sku_iid = option.plat_sku_iid || '';
    wx.showLoading();
    app.http.post('Order/refund', { 'orderbill': orderbill, 'plat_num_iid': plat_num_iid, 'plat_sku_iid': plat_sku_iid }, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        var refundtype = [];
        for (let k in json.refundtype) {
          refundtype.push(json.refundtype[k]);
        }
        var has_goods = '';
        if (json.orderitem.status == "DD") {
          json.orderitem.checkedDD = true;
          json.orderitem.checkedFF = false;
          has_goods = 'N';
        } else if (json.orderitem.status == "FF") {
          json.orderitem.checkedDD = false;
          json.orderitem.checkedFF = true;
          has_goods = 'Y';
        } else if (json.orderitem.status == "EC") {
          json.orderitem.checkedDD = false;
          json.orderitem.checkedEC = true;
          has_goods = 'Y';
        }
        _this.setData({
          'sel_refund_idx': 0,
          'orderitem': json.orderitem,
          'refundtype': refundtype,
          'billno': orderbill,
          'plat_num_iid': plat_num_iid,
          'has_goods': has_goods || '',
          'returndesc': json.returndesc
        });
        _this.inputData = {};
        /* _this.getProdSkus(plat_num_iid) */
        // _this.getRefundAmt()
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  exchange: function (e) {
    //调起购物车
	console.log(e.currentTarget.dataset.num);
    var pid = e.currentTarget.dataset.num || '';
    var prod_promo = e.currentTarget.dataset.promo_num || '';
    if (!pid) {
      app.alertMsg('商品参数不存在');
      return false;
    }
    var actiontype = 'exchange';
    var share_vipid = this.data.share_vipid;//这个页面暂时未用到分享会员id,缺省为0
    var curdata = {
      prod_promo: prod_promo
    }
    this.setData({
      prod_promo: prod_promo
    })
    this.showAddcart(pid, actiontype, share_vipid, curdata);
  },
  //获得商品规格的可选择的数量
/*  getFormatSkuLvl: function (data) {
		var sku1 = [];  //放颜色编号
		var sku1name = []; //放颜色名
		var sku2 = []; //放尺码
		var skulvl = 2;
		var targetsku1 = [];
		console.log('getFormatSkuLvl');
		console.log('getFormatSkuLvl',data);
		data.forEach(function (item) {
     
     if (item.color == 'null') { item.color=''}
     if (item.spec == 'null') { item.spec = ''}
			//商品号存在 并且sku1数组中没有存在 则放在sku1列表中
			if (item.color_num && (sku1.indexOf(item.color_num) == -1)) {
				sku1.push(item.color_num);
				console.log('item',item);
				//库存大于0时 
				if(item.stockqty>0){
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
		// if (sku1.length != sku2.length) {
		// 	skulvl = 1;
		// }
		if(skulvl==1){
			return 1;
		}
		console.log('targetsku1',targetsku1);
		return {
			'sku1':sku1,
			'sku2': sku2,
			'sku1name': sku1name,
			'targetsku1':targetsku1
		}
	}, */
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    if (!option.orderbill || !option.plat_num_iid || !option.plat_sku_iid) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '退款申请' });
  }
}
Object.assign(pageObj, AddcartIns);
Page(pageObj);