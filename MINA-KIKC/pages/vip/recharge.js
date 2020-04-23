//index.js
//获取应用实例
var app = getApp()
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
  data: {
    page_path: 'pages/vip/recharge',
    'base_conf': app.DF,
    'inputData':[],
    'showrecharge':false,
    'cardloading':false,
    navhidden: true,
  },
  onShow: function () {
    var self = this;
    app.checkUserStatus(() => {
      var userinfo = wx.getStorageSync('userinfo');
      
      this.initPage();

      app.refreshVipInfo((vipinfo) => {
        self.setData({
          'headimgurl':userinfo.avatarUrl,
          'vip':vipinfo
        })
      })

    });
  },
  initPage:function(){
    var self = this;
    wx.showLoading();
    app.http.post('Member/valSet', { timeset: 'valid', order: 'asc', scene: wx.getStorageSync('scene')}, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
    	  var card_pwd_maxlen = json.recharge_pwd_len;
        self.setData({
          'shop': json.recharge_shop,
          'valset':json.data || [],
          'recharge_pwd_len':json.recharge_pwd_len||'',
          'card_pwd_maxlen':card_pwd_maxlen || -1,
          'vip_use_recharge':json.vip_use_recharge || 'N',
        });
      }
    })
  },
  bindRecharge:function(e){
    var self = this;
    var setnum = e.currentTarget.id;
    wx.showLoading();
    app.http.post('Order/valRecharge', { 'setnum': setnum, 'shop_id': this.data.shop.shop_id }, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        self.payinfo = JSON.parse(json.wxPayPara);
        self.wxpay(self.payinfo);
      } else {
        app.alertMsg(json.msg)
      }
    });
  },
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  wxpay: function (payinfo) {
    var self = this;
    wx.requestPayment({
      'timeStamp': payinfo.timeStamp,
      'nonceStr': payinfo.nonceStr,
      'package': payinfo.package,
      'signType': payinfo.signType,
      'paySign': payinfo.paySign,
      'success': function (res) {
        app.alertMsg('充值成功', {
          cb: function(){
            app.refreshVipInfo((vipinfo) => {
              self.setData({
                'vip': vipinfo
              })
            })
          }
        });
      },
      'fail': function (res) { }
    })
  },
  rechargeCard:function(e){
	  var inputData = [];
	  inputData['card_num'] = '';
	  inputData['card_pwd'] = '';
	  this.inputData = inputData;
	  this.setData({
			inputData: this.inputData,
			'showrecharge':true,
			'msgtip':'',
		});
  },
  bindTargetInput: function (e) {
	 // console.log('bindTargetInput  e',e);
	  var fieldname = e.currentTarget.dataset.fieldname;
	  var value = e.detail.value;
	  //光标位置
	  //var cursor = e.detail.cursor;
	  //console.log('cursor',cursor);
	  //value = value.replace(/\s/g, '');
//	  if(/\S{5}/.test(value)){
//		  value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
//  	  }
	  
	  //去掉首尾空格
	  //value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	  this.inputData[fieldname] = value;
	  return value;
	
  },
  bindFocusInput:function(e){
	  this.setData({"msgtip":''});
  },
  formReset:function(e){
	  this.setData({showrecharge:false,"msgtip":''});
  },
  dialog_recharge_close:function(e){
	  this.inputData['card_num'] = '';
	  this.inputData['card_pwd'] = '';
	  this.setData({showrecharge:false,"msgtip":'',inputData:this.inputData});
  },
  formSubmit: function (e) {
      console.log('formSubmit  e',e);
      var self = this;
      if(this.data.cardloading){
    	  return false;
      }
      //取值
      var fields_val = e.detail.value;
      var card_num = fields_val.card_num;
      var card_pwd = fields_val.card_pwd;
      if(!card_num || !card_pwd){
    	  this.setData({'msgtip':"请输入卡号或密码"});
    	  return false;
      }
      //去掉空格
  	 //card_pwd = card_pwd.replace(/\s+/g,'');
  	 //card_num = card_num.replace(/\s+/g,'');
      if(this.data.recharge_pwd_len && card_pwd.length!=this.data.recharge_pwd_len){
    	  this.setData({'msgtip':"请输入"+this.data.recharge_pwd_len+"位完整密码"});
    	  return false;
      }
  	 console.log('card_pwd',card_pwd);
  	 console.log('card_num',card_num);
  	 //标记已经发起请求
  	 self.setData({'cardloading':true});
  	  wx.showLoading();
      app.http.post('Order/bindRecharge', {'card_num': card_num,'card_pwd':card_pwd,'shop_id': this.data.shop.shop_id }, function (json) {
          wx.hideLoading();
          self.setData({'cardloading':false});
          if (json.success == 1) {
        	  self.inputData['card_num'] = '';
        	  self.inputData['card_pwd'] = '';
        	  app.alertMsg('绑定成功',{cb:function(){
        		  app.refreshVipInfo((vipinfo) => {
                      self.setData({
                        'vip': vipinfo,
                        inputData: self.inputData,
                      })
                    });
        	  }});
          } else {
        	  self.setData({'msgtip':json.msg||'绑定失败'});
          }
        });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '会员充值' });
  }
})
