var app = getApp();
var AddlogisIns = require('../../utils/wig_logis.js');
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    page_path: 'pages/mall/orderdetailone',
    navhidden: true,
    exchange: '',
    logisToggle: false,
    ex_logis_company: '',
    ex_retinvoiceno: '',
    mystatus: true,
    logistics: '',
	  show:true,
    statusList: {
      SE: '买家申请换货',
      RE: '卖家拒绝换货',
      AE: '卖家同意换货', 
      DD:	'卖家已发货',
      FF:	'换货已完成',
      SH:	'卖家已签收'
    },
    refundList: [{ name: '整单退款', id: 1 }, { name: '整单退货', id: 2}],
    selected: '', // 选择退款类型
    reasondesc: '', // 退款理由
    refundtype: [], // 退款类型
    'sel_refund_idx': 0,
  },
  BindPay: function (e) {
    this.buildOrder();
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '订单详情' });
  },
  onLoad: function (option) {
    this._option = option;
    var billno = option.billno;
    var paybillno = option.paybillno;
    if (!billno) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      });
      return false;
    }
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  handleCode() {
    this.setData({
      logisToggle: true
    })
  },
  handlehidden() {
    this.setData({
      logisToggle: false
    })
  },
  initPage: function () {
    var _this = this;
    var option = this._option;
    this.setData({
      'paybillno': option.paybillno,
      'billno': option.billno,
    });
    wx.showLoading();
    app.http.post('Order/getMallOrderByIdOne', { "paybillno": option.paybillno, "billno": option.billno }, function (json) {
      console.log(json)
      wx.hideLoading();
      if (json.success == 1) {
        _this.setData({
          'order': json.order,
          'orderitem': json.orderitem,
          'payorder': json.payorder,
          'msg':json.msg||'',
          'exchange': json.exchange,
          'logistics': json.logistics,
          'shop': json.shop
        });
        
      } else {
        app.alertMsg(json.msg, {
          cb: app.goBack
        })
      }
    });
  },
  handleSubmit(e) {
    let _this = this
    let retinvoiceno = e.detail.value.retinvoiceno
    let logis_company = e.detail.value.logis_company
    let data = {
      billno: this._option.billno,
      po_name: logis_company,
      po_num: retinvoiceno
    }
    app.http.post('order/savepogistics', data, function(res) {
      console.log(res)
      if (res.success == 0) {
        _this.initPage()
        _this.setData({
          mystatus: false,
          logisToggle: false
        })
      }
    }) 
  },

  // 整单退
  handleRefundItem(e) {
    console.log(e)
    let _this = this
    let index = e.currentTarget.id
    this.setData({
      selected: index
    })
    if (this.data.refundtype.length == 0) {
      app.http.post('Order/refund', {}, function (json) {
        if (json.success == 1) {
          var refundtype = [];
          for (let k in json.refundtype) {
            refundtype.push(json.refundtype[k]);
          }
          _this.setData({
            'refundtype': refundtype
          })
          console.log('refundtype', refundtype)
        }
      })
    }
    
  },
  bindPickerChange: function (e) {
    this.setData({
      'sel_refund_idx': e.detail.value
    });
  },
  handlesub() {
    let _this = this
    if (!this.data.reasondesc.replace(/(^\s*)|(\s*$)/g, "")) {
      app.alertMsg('退款原因不能为空');
      return false;
    }
    let post_data = {
      billno: this._option.billno,
      reasondesc: this.data.reasondesc
    }
    var refundtypes = this.data.refundtype;
    refundtypes && refundtypes.forEach(function (item, idx) {
      if (idx == _this.data.sel_refund_idx) {
        post_data['returntype'] = item['code_num']
      }
    });
    if (_this.data.selected == 2) {
      post_data['has_goods'] = 'Y'
    }
    app.http.post('Order/refundAllReq', post_data, function (json) {
      console.log(json)
      if (json.success == 1)  {
        wx.showToast({
          title: '提交成功',
          duration: 1500
        })
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0,
          
        })
        setTimeout(function() {
          
          _this.initPage();
        }, 1500)
       
      } else {
        wx.showToast({
          title: json.msg,
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  inputReason(e) {
    let value = e.detail.value
    this.setData({
      reasondesc: value
    })
  },
  /* 折叠框实现 */
  showView:function(){
	  let that = this;
	  that.setData({
	    show: (!that.data.show)
	  })
  },
  buildOrder: function () {
    var _this = this;
    if(this.data.msg){
    	app.alertMsg(this.data.msg);
    	return false;
    }
    wx.showLoading();
    app.http.post('Order/wxPay', { 'paybillno': this.data.order['pay_billno'] }, function (json) {
      console.log(1111111111);
      wx.hideLoading();
      if (json.success == -1) {
        app.alertMsg(json.msg);
        return false;
      }
      if (json.is_payed == 'N') {
        var payinfo = JSON.parse(json.wxPayPara);
        wx.requestPayment({
          'timeStamp': payinfo.timeStamp,
          'nonceStr': payinfo.nonceStr,
          'package': payinfo.package,
          'signType': 'MD5',
          'paySign': payinfo.paySign,
          'success': function (res) {
            console.log(json);
            console.log(333333333333333);
        	  if(!json.lottery){
        		  wx.redirectTo({
                      url: '/pages/mall/orderdetail?paybillno=' + json.data,
                    })
        	  }else{
        		  var target_url = '';
        		  if(json.lottery.gametype=='T'){
        			  target_url = '/pages/game/zhuanpan?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='C'){
        			  target_url = '/pages/game/guaka?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='E'){
        			  target_url = '/pages/game/jindan?billno=' + json.lottery.billno;
        		  }
        		  if(json.is_group=='K'){
                console.log('跳转地址',target_url);
                app.alertMsg('砍价商品订单支付成功,获得抽奖机会', {
                  cb: function (){
                  console.log(target_url);
        				  wx.redirectTo({
                              url: target_url,
                            });
        			  }});
        			  return false;
        		  }
        		  wx.redirectTo({
                      url: target_url,
                  });
        	  }
          },
          'fail': function (res) {
            console.log(222222222);
            console.log(json);
            wx.redirectTo({
              url: '/pages/mall/orderdetailone?billno=' + _this.data.billno,
            })
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/mall/orderdetailone?billno=' + _this.data.billno,
        })
      }
    });

  },
  OrderCancel: function () {
    var _this = this;
    wx.showLoading();
    app.http.post('Order/cancelOrder', { "paybillno": this.data.order['pay_billno'] }, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        app.alertMsg(json.msg, {
          cb: function () {
            wx.redirectTo({
              url: '/pages/mall/orderdetailone?billno=' + _this.data.billno,
            })
          }
        })
      } else {
        app.alertMsg(json.msg)
      }
      return false;
    });
  },
  bindProdDetail:function(e){
	  console.log('bindProdDetail  e',e);
	  var plat_num_iid = e.currentTarget.dataset.plat_numiid;
	  if(!plat_num_iid){return ;}
	  var group_id = e.currentTarget.dataset.group_id;
	  var is_group = e.currentTarget.dataset.is_group;
	  if(group_id){
		  if(is_group=='Y'){
			  wx.navigateTo({url:'/pages/mall/groupdetail?group_id='+group_id});
		  }else if(is_group=='K'){
			  wx.navigateTo({url:'/pages/mall/bargaindetail?group_id='+group_id});
		  }
		  
	  }else{
		  wx.navigateTo({url:'/pages/mall/proddetail?plat_num_iid='+plat_num_iid});
	  }
	  
  },
  catchBubbling:function(e){
		//阻止事件冒泡
  },
  formSubmit: function (e) {
	  console.log('formSubmit e',e);
    var post_data = e.detail.value;
    if(!post_data.logis_company){
    	app.alertMsg("快递公司不能为空");
    	return false;
    }
    if(!post_data.retinvoiceno){
    	app.alertMsg("快递单号不能为空");
    	return false;
    }
    var _this = this;
    wx.showLoading();
    app.http.post('Order/updatelogis', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        _this.data.orderitem && _this.data.orderitem.forEach(function (item, index) {
          if (item.refund_id == post_data.refundid) {
            _this.data.orderitem[index].logis_company = post_data.logis_company;
            _this.data.orderitem[index].retinvoiceno = post_data.retinvoiceno;
            _this.setData({
              'orderitem': _this.data.orderitem,
            })
          }
        });
        app.alertMsg(json.msg);
        _this.setData({
          'hidden': true,
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
};
Object.assign(pageObj, AddlogisIns);
Page(pageObj);