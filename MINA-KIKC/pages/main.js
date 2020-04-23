//main.js//一级主页
var app = getApp()
var userRecord = require('../utils/record.js');
var QR = require("../utils/qrcode.js");
var UserAction = userRecord(app);
let routeInfo = {
  startLat: 39.90469,    //起点纬度 选填
  startLng: 116.40717,    //起点经度 选填
  startName: "我的位置",   // 起点名称 选填
  endLat: 39.94055,    // 终点纬度必传
  endLng: 116.43207,  //终点经度 必传
  endName: "来福士购物中心",  //终点名称 必传
  mode: "car",  //算路方式 选填
  vip_style: "BOX"
}
Page({
	data: {
		'ontabpage': 'main',
    'base_conf': app.DF,
		imgbase: app.STATIC_URL+'uploads/',
		banners:[],
		indicatorDots: true,
		autoplay: false,
		circular: true,
		interval: 7000,
		duration: 500,
		bannarH:150,
		barcode_status:false,
    mallfunc_status:'N',
    page_path:'pages/main',//当前页面的路径,内部跳转不带斜杠开头
    get_card_hidden:false,//是否显示立即领卡,
    getcard_loading:false,//正在领卡
    loading:false,
    server_component: '',
    coupon_dialog:{coupon_cnt:0},
    timechoose: false,
    exclusive: app.kikcExclusive,  // KIKC专属样式
    canvasHidden: false,
    imagePath: '',
	},
  // completemessage: {
  //   errcode: 0,  // 消息发送状态
  //   name: '11',  // 推送的客服人员姓名
  //   headurl: ''  // 推送的客服人员头像
  // },
  startmessage: function (res) {
    console.log(res)
  },
  
	signVip: function () {
		this.setData({loading:true});
	  //申请会员
    app.vipLogin(this.data.page_path + app.query2Str(this._option));
	},
	scaleBarcode:function(e){
		wx.navigateTo({
			url: '/pages/barcode',
		})
	},
	minBarcode: function (e) {
		this.setData({
			barcode_status: false
		})
	},
	vipjump:function(e){
    wx.navigateTo({
      url: e.currentTarget.id,
      fail:function(){
        app.alertMsg('打开页面失败');
      }
    })
	},
  // 专属客服
  closetimechoose() {
    this.setData({
      timechoose: false
    })
  },
  getmessage () {
    let _this = this;
    app.http.post('Pubdata/server_component', {}, function (json) {
      if (json[0].server_component == '') {
        app.alertMsg('未添加专属客服，敬请期待')
        return;
      }
      _this.setData({
        timechoose: true,
        server_component: json[0].server_component
      })
    })
  },
  completemessage: function (res) {
    console.log(res)
    this.setData({
      timechoose: false
    })
    app.alertMsg('查看服务通知，添加专属客服')

    return false
  },
	onShow:function(){
		console.log('main onshow');
		console.log('main 001definds',app.DF);
    console.log('设置mynavlist', this.data.base_conf)
    var _this = this;
    
    app.updateIconStyle(this);
    app.checkUserStatusByHand(function(){
    	console.log('checkUserStatusByHand');
    	console.log('main 002definds',app.DF);
    	
      app.refreshVipInfo((vip_info)=>{
    	  console.log('refreshVipInfo vip_info',vip_info);
    	  //console.log();
        //只有是会员才执行
        _this.setData({
          'vip_point': vip_info.point,
          'phone': vip_info.phone,
          'lvl_name': vip_info.lvl_name,
          'vip_point': vip_info.point,
          'headimgurl': vip_info.headimgurl,
          'vip_name': vip_info.vip_name,
          'samount': parseFloat(vip_info.samount),
          'is_vip':true,
          'lvl_desc': vip_info.lvl_desc
        });
        let userCode = vip_info.phone
        var size = _this.setCanvasSize(); //动态设置画布大小
        if (userCode) {
          _this.createQrCode(userCode, "mycanvas", size.w, size.h);
          _this.showVipBarCode(vip_info.vip_num);
        }
        
        //app.userLoginPromise.then((json) =>{
        	_this.showGetCard();
        	console.log('coupon_dialog ',_this.data.coupon_dialog);
        	if(!_this.data.coupon_dialog.coupon_cnt){
        		_this.showCouponDialog();
        	}else{
        		//初始化
        		//_this.setData({coupon_dialog:{coupon_cnt:0}});
        	}
        wx.stopPullDownRefresh()
      });
    })
    var vip_info = wx.getStorageSync('vip_info');
    if(!vip_info){
    	_this.setData({loading:false});
    }
	},
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width; 
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, 
      urls: [img]
    });
  },
  showVipBarCode: function (vip_num){
    //显示会员条码
    var _this = this;
    if(this._vip_barcode_load){return};
    app.http.post('Member/getVipBarcode', { vipnum: vip_num},function(json){
      console.log(json)
      if(json.success == 1){
        _this._vip_barcode_load = true;
        wx.setStorageSync('vip_barcode_url', json.src);
        _this.setData({
          'barcodeurl':json.src,
		      'showbarcode':json.showbarcode
        })
      }
    })
    

  },
  showGetCard: function(){
	  var _this = this;
	  //是否显示立即领卡
	    app.http.post('Member/isGetCard', {}, function (json) {
	    	console.log('isGetCard  json',json);
	      _this.setData({
	        'get_card_hidden': json.bool,
	        'vipcard_id':json.card_id || '',
	        'card_setupid':json.setup_id ||'',
	      })
	    });
  },
  showCouponDialog:function(){
	  var _this = this;
		//是否显示优惠券提示弹窗
		    app.http.post('Member/couponNotice', {}, function (json) {
		    	console.log('showCoupon  json',json);
		    	if(json.showcoupon_notice){
		    		_this.setData({
				        'coupondialog_show':json.showcoupon_notice,
				        'coupon_dialog':{coupon_cnt:json.coupon_cnt},
				      });
		    	}
		      
		    });
  },
  _dialog_coupon_close:function(e){
	  this.setData({coupondialog_show:false});
	  wx.navigateTo({url:'pages/main'});
  },
  _dialog_coupon_open:function(e){
	  this.setData({coupondialog_show:false});
	  wx.navigateTo({url:'/pages/vip/coupon?type=V'});
  },
  onReady:function(){
		wx.setNavigationBarTitle({title: '会员中心'});
  },
  preventTouchMove: function () { },
	onLoad: function (option) {
		var _this = this;
    this._option = option;
		var share_vipid = option.share_vipid;//分享者会员id
    this.setData({
      'bannarH': app.globalData.sys_info.windowWidth*150/320,
      'windowHeight': app.globalData.sys_info.windowHeight
    })
    wx.showLoading({ title: '读取数据...' });
    
		app.userLoginPromise
			.then((json) => {
				//获取会员中心链接
				app.http.post('Pubdata/getMemberCenterLinks', {}, function (json) {
          _this.setData({
            base_conf: app.DF
          })
					wx.hideLoading();
					console.log('getMemberCenterLinks  json',json);
					_this.setData({
						'menus': json['data'],
            'mallfunc_status': json['mallfunc_status'] || "N",
            'vip_style': json['vip_style'] || 'BOX'
					});
				});
				
        //未解决跳转页面注册返回刷新广告的问题
				//获取默认及品牌的广告
				app.http.post('Pubdata/getMemberCenterBanners', {}, function (json) {
					_this.setData({
						'banners':json.data
					})
				});
				
				//获取定位后的广告
				app.getUserLocation((latlng)=>{
					if (latlng.lat && latlng.lng){
						app.http.post('Pubdata/getMCPositionBanners', latlng , function (json) {
              
							var banners = _this.data.banners;
							json.data && json.data.forEach(function(item){
								banners.push(item);
							})
							_this.setData({
								'banners': banners,
								'autoplay':true
							})
						});
					}else{
						_this.setData({
							'autoplay': true
						})
					}
				})

				//获取默认及品牌的广告
				app.http.post('Pubdata/getSharePara', {}, function (json) {
					if(json.success==1){
						var sharePara = {
							'title':json.title,
							'cover':json.cover
						};
						_this.setData({
							'sharePara': sharePara
						})
					}
				});
        if (share_vipid){
				  _this.logVipFriend(share_vipid);
        }

				//判断会员
				// let vip_info = wx.getStorageSync('vip_info');
				// if (!vip_info){
				// 	this.setData({
				// 		'is_vip':false
				// 	});
				// 	wx.hideLoading();
				// }else{
				// 	app.http.post('Member/getVipBarcode', { vipnum: vip_info.vip_num},function(json){
				// 		if(json.success == 1){
				// 			_this.setData({
				// 				'barcodeurl':json.src
				// 			})
				// 		}
				// 	})
				// 	this.setData({
				// 		'is_vip': true,
				// 		'lvl_name': vip_info.lvl_name,
				// 		'vip_point':vip_info.point,
				// 		'phone': vip_info.vip_num
				// 	});
				// 	wx.hideLoading();
				// }
        //访问记录
        UserAction.recordPageView('VIPCENTER', 0, '');
			})
	},
	onShareAppMessage: function (res){
    var _this = this;
		var vip_info = wx.getStorageSync('vip_info');
		var weixinid = wx.getStorageSync('weixinid');
		if(vip_info){
			var share_path = '/pages/main?weixinid=' + weixinid + '&share_vipid=' + vip_info.vip_id;
		}else{
			var share_path = '/pages/main?weixinid=' + weixinid;
		}
    // if (this.data.banners[0]) {
		//   var shareimg = this.data.banners[0]['image_url'];
    // }
    // if(!shareimg){
    //   //if (this.data.sharePara){
    //     if (this.data.sharePara.cover){
    //       var shareimg = this.data.sharePara.cover;
          
    //     }
        
    //   //}
    // }
    var shareimg = this.data.sharePara && this.data.sharePara.cover || '';
		return {
			'title': this.data.sharePara && this.data.sharePara.title || '会员中心',
			'path': share_path,
			'imageUrl': this.data.imgbase + shareimg,
			'success': function (res) {
        //转发记录
        UserAction.recordShare('VIPCENTER', 0, '');
			},
			'fail': function (res) {}
		}
	},
  onPullDownRefresh: function () {
    this.onShow()
    // wx.stopPullDownRefresh()
  },
	logVipFriend:function(prtvipid){
		if (prtvipid){
			app.http.post('Member/logVipFriend',{'prtvipid':prtvipid},function(){});
		}
	},

  //领取会员卡
  bindGetCpn: function (e) {
    var couponid = e.currentTarget.id
    var coupondata = this.getCouponById(couponid);
    if (coupondata == false) {
      app.alertMsg('读取卡券数据出错');
      return false;
    }
    if (coupondata['card_id']) {
      this.getCardSign(coupondata['coupon_id'], function () {
        app.alertMsg('领取成功');
      });
      return false;
    }
    //普通卡券
    app.http.post('Member/addCouponToVip', { 'coupon_id': coupondata['coupon_id'] }, function (json) {
      app.alertMsg(json.msg);
    });
  },
  getCouponById: function (id) {
    var target = false;
    this.data.banners.forEach((item) => {
      if (item.reltype == "COUPON") {
        if (item.coupon_id == id) {
          target = item;
        }
      }
    });
    return target;
  },
  getCardSign: function (coupon_id, callback) {
    app.http.post('Login/getCouponCardSign', { 'coupon_id': coupon_id }, function (json) {
      if (json.success == 1) {
        wx.addCard({
          cardList: [{
            'cardId': json.card_id,
            'cardExt': JSON.stringify(json.cardExt)
          }],
          success: function (res) {
            callback(res);
          },
          fail: function (res) { }
        })
        //add card end
      } else {
        app.alertMsg(json.msg);
      }
    })
  },

  getVipCard:function(){
	  var _this = this;
	  if(!_this.data.get_card_hidden || _this.data.getcard_loading){return;}
	  _this.setData({get_card_hidden:false,getcard_loading:true});
	  app.http.post('Login/getWxJdkCardSign', { 'vipcard_id': _this.data.vipcard_id || '','card_setupid': _this.data.card_setupid || '' }, function (json) {
		  console.log('getWxJdkCardSign  json',json);
	      if (json.success == 1) {
	        wx.addCard({
	          cardList: [{
	            'cardId': json.card_id,
	            'cardExt': JSON.stringify(json.cardExt)
	          }],
	          success: function (res) {
	        	  _this.setData({getcard_loading:false});
	        	  app.alertMsg('领取成功');
	        	  
	          },
	          fail: function (res) { 
	        	  _this.setData({getcard_loading:false,get_card_hidden:true});
	        	  app.alertMsg('领取失败');
	          }
	        })
	        //add card end
	      } else {
	        app.alertMsg(json.msg);
	      }
	    });
  },


  //更换头像
  updateHeaderImg:function() {
    var that = this;
    let vip_info = wx.getStorageSync('vip_info');
    console.log('vip_info', vip_info);
    if (vip_info == undefined || vip_info == '' || vip_info.vip_id == '') {
      app.alertMsg('请先申请会员');
    }
    wx.chooseImage({
      count:1,
      success: function (res) {
         var tempFilePaths = res.tempFilePaths
        console.log('chooseImage', res);
        var data = {
          url: app.BASE_URL + 'Mymember/updateHeaderImg',
          path: tempFilePaths//这里是选取的图片的地址数组
        }
        app.uploadimg(data,function(res) {
          console.log('111111111111',res);
          let data = JSON.parse(res);
          if (data.success == 1) {
            that.setData({ "headimgurl": that.data.imgbase + data.data.headerImg});
          } else {
            app.alertMsg(data.msg);
          }
        })
      }
    })
  },


})
