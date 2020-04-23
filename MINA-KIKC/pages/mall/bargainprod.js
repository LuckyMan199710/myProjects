var app = getApp();
var wig_counter = require('../../utils/wig_counter.js');
var userRecord = require('../../utils/record.js');
var nav = require('../../utils/nav.js');
var AddcartIns = require('../../utils/wig_addcart.js');
var AppAction = nav(app);

var UserAction = userRecord(app);

let pageObj = {
  data: {
		imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
		imgs: [],
		videos: [],
		indicatorDots: true,
		autoplay: true,
		circular: true,
		interval: 5000,
		duration: 1000,
		winWidth:320,
		has_zan:0,
    has_collect: 0,
    navhidden: true,
    page_path: 'pages/mall/bargaindetail',
    swiper_play:true,
    poster_image:app.STATIC_URL+'images/public.png',
    video_show:true,
    video_autoplay:true,
    video_index:0,
  },
	bindBuy:function(e){
		if(!this.data.curskuid){return false;}
		var curskuid = this.data.curskuid;
		var curbuyqty = this.data.wig_counter_data.num;
		var share_vipid = e.target.dataset.vid;
		var actiontype = 'buynow';
    this.showAddcart(curskuid['plat_num_iid'],actiontype,share_vipid,{
      'curbuyqty':curbuyqty,
      'curskuid': this.data.curskuid
    });
	},
	bindAddcart:function(e){
    var share_vipid = e.target.dataset.vid;
		var _this = this;
		if(!this.data.curskuid){ return false; }
		var post_data = {
			'shop_id':this.data.prod.shop_id,
			'buyqty': this.data.wig_counter_data.num || 1,
			'plat_sku_iid': this.data.curskuid.plat_sku_iid,
			'plat_num_iid': this.data.curskuid.plat_num_iid,
      'share_vipid': share_vipid,
      'prod_promo': this.data.source_promo
		}
		console.log('bindAddcart  curskuid',this.data.curskuid);
		console.log('bindAddcart  post_data',post_data);
		
		wx.showLoading({mask: true});
		app.http.post('Prod/addBuycart', post_data,function(json){
			wx.hideLoading();
			if(json.success==1){
			  wx.showToast({title: json.msg});
				_this.setData({
					'cartsum': json.sum
				});
				//加购物车
				UserAction.recordAddcart('PROD', _this.data.prod.shop_id, _this.data.plat_num_iid);
			}else{
        app.alertMsg(json.msg);
      }
		})
	},

	bindSkuid:function(e){
		var id = e.currentTarget.id;
		var curskuid = this.getSkuTargetByskuid(this.__prodskudata,id);
		console.log('bindSkuid curskuid',curskuid);
		this.setData({
			'curskuid': curskuid,
			'curbuyqty':1
		});
	},
	bindSku1:function(e){
		var id = e.currentTarget.id;
		var sku2objs = this.getSku2BySku1(this.__prodskudata, id);
		var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, id, sku2objs[0]['spec_num']);
		console.log('bindSku1 curskuid',curskuid);
		this.setData({
			'sku2':sku2objs,
			'curskuid': curskuid,
			'curbuyqty':1
		});
	},
	bindSku2: function (e) {
		var id = e.currentTarget.id;
		var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, this.data.curskuid['color_num'], id);
		console.log('bindSku2 curskuid',curskuid);
		this.setData({
			'curskuid': curskuid,
			'curbuyqty':1
		});
  },
  //发起砍价
  bindActiveBargain:function(e){
	  console.log('bindActiveGroup  e',e);
	  var _this = this;
	  var vip_info = wx.getStorageSync('vip_info');
	  this.buyByGroup(e);
	  
  },
  buyByGroup:function(e){
	  if(!this.data.curskuid){return false;}
	  var _this = this;
	  //先判断是否为会员
	  app.http.post('Mall/checkBargain',{billno:this.data.curskuid.promo_p.billno},function(json){
			console.log('checkBargain  json',json);
			if(json.success == -1){
				app.alertMsg(json.msg);
				return false;
			}
			//跳转到注册会员
			if(json.success == -2){
				app.alertMsg('请注册会员',{cb:function(){
					app.vipLogin(_this.data.page_path + app.query2Str(_this._option));
				}});
				return false;
			}
			var curskuid = _this.data.curskuid;
			var curbuyqty = _this.data.wig_counter_data.num;
			var share_vipid = e.currentTarget.dataset.vid;
			var actiontype = 'buynow';
			_this.showAddcart(curskuid['plat_num_iid'],actiontype,share_vipid,{
		    'curbuyqty':curbuyqty,
		    'curskuid': _this.data.curskuid,
		    'promo_num':_this.data.promo_num||'',
		    'gifttype':_this.data.gifttype||'',
		  });
		});
		
  },
  onReady: function () {
    //wx.setNavigationBarTitle({ title: '商品详情' });
  },
  onShow:function(){
	
  },
  onLoad: function (options) {
		var _this = this;
		this._option = options;
    wx.showShareMenu({
      withShareTicket: true
    })
		var plat_num_iid = options.plat_num_iid;
    var source_promo = options.source_promo || '';
    var share_vipid = options.share_vipid || '';
    var keyword = options.keyword || '';
    var promo_num = options.promo_num || '';
		console.log('proddetail  options',options);
		if (!plat_num_iid){
			app.alertMsg('产品参数不存在',{
				cb: app.goBack
			})
		}
		app.updateIconStyle(this);
    _this.setData({
      'winWidth': app.globalData.sys_info.windowWidth,
      'promo_num':promo_num
    })
		//授权调用
		app.userLoginPromise
			.then(json => {
				//加载积分产品数据
				app.http.post('Mall/getPromoDetail', { 'promo_num': promo_num}).then(json => {
					console.log('getPromoDetail  json',json);
					if(json.success == 1){
						if(json.data.billstatus=='CL'){
							app.alertMsg('砍价活动已下架', {
								cb: app.goBack
							});
							return false;
						}
						if(json.data.gifttype!='K'){
							app.alertMsg('砍价活动不存在', {
								cb: app.goBack
							});
							return false;
						}
					}else{
						app.alertMsg(json.msg, {
							cb: app.goBack
						});
						return false;
					}
					_this.setData({gifttype:json.data.gifttype});
				app.http.post('Prod/getprodinfo', { 'plat_num_iid': plat_num_iid }, function (json) {
					console.log('getprodinfo json',json);
					console.log('getprodinfo plat_num_iid',plat_num_iid);
					if (json.success) {
						if (!json.data) {
							app.alertMsg('产品不存在或已下架', {
								cb: app.goBack
							});
							return false;
						}
						var imgs = [];
						if (json.covers) {
							for (var i in json.covers) {
								json.covers[i] && imgs.push(json.covers[i]);
							}
						}
						var temp_videos = [];
						if (json.videos) {
							var kk=0;
							for (var i in json.videos) {
								
								json.videos[i]&& json.videos[i]['video_url'] && temp_videos.push({src:json.videos[i],mk:'myvideo'+kk,play:false,show:true});
								kk++;
							}
						}
						console.log('temp_videos',temp_videos);
						console.log('videos',json.videos);
						_this.setData({
							'prod': json.data,
							'plat_num_iid': plat_num_iid,
							'has_zan': json.data.has_zan,
							'has_collect': json.data.has_collect,
							'imgs': imgs || [],
							'videos':temp_videos || [],
              'share_vipid': share_vipid,
              'source_promo': source_promo,
              'shop_info': json.shop_info,
              'gradedata':json.propdata,
              'video_show':temp_videos.length>=1?true:false,
						});
						console.log('video_show',_this.data.video_show);
						//加载sku
						app.http.post('Prod/getProdSkus', { 'plat_num_iid': plat_num_iid ,promo_num:_this.data.promo_num||''}, function (json) {
							console.log('getProdSkus json',json);
							if(json.success==1){
								if (!json.data) {
									app.alertMsg('读取产品sku数据失败', {
										cb: app.goBack
									});
									return false;
								}
								if(json.promo_name){
									wx.setNavigationBarTitle({ title: json.promo_name });
									_this.setData({promo_name:json.promo_name});
								}
									var skulvl = _this.getFormatSkuLvl(json.data);
									console.log('getFormatSkuLvl ',_this.getFormatSkuLvl);
									_this.__prodskudata = json.data;
									console.log('skulvl 1112',skulvl);
									if (skulvl == 1) {
										
										_this.setData({
											'skulvl': 1,
											'sku1': json.data,
											'curskuid': json.data[0],
											'curbuyqty': 1
										});
									} else {
										console.log('skulvl 334',skulvl);
										var targetsku1 = skulvl['targetsku1'] && skulvl['targetsku1'].length>0?skulvl['targetsku1'][0]:skulvl['sku1'][0];
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
									
									
							}else{
								app.alertMsg('加载失败',{cb:app.goBack});
							}

						});
						
            //记录推荐人vipid
            if (share_vipid) {
              _this.logVipFriend(share_vipid);
            }
						//访问记录
            UserAction.recordPageView('PROD', _this.data.prod.shop_id, plat_num_iid);
            //搜索记录
            if (keyword){
              UserAction.recordSearch('PROD', _this.data.prod.shop_id, plat_num_iid, keyword);
            }
					}
				});
			});
				_this.getBuycarCount();
			})
  },
  bindpause:function(e){
	  console.log('54545');
	  this.enterPlay(e,'pause');
  },
  bindended:function(e){
	  console.log('54545')
	  console.log('bindended  e',e);
	  this.enterPlay(e,'ended');
  },
  bindposter:function(e,action){
	  console.log('bindposter  e',e);
	  var _this = this;
	  let videos = this.data.videos;
	  let swiper_play = this.data.swiper_play;
	  let src = e.currentTarget.dataset.src;
	  let poster = e.currentTarget.dataset.poster;
	  let index = e.currentTarget.dataset.index;
	  this.setData({swiper_play:!swiper_play,video_show:true,video_autoplay:true,video_index:index});
  },
  videoPlay:function(id){
	  if(!this.data.playId){
		  var videoContext = wx.createVideoContext(id)
		  videoContext.play();
		  this.setData({playId:id});
	  }else{
		  var videoContextPrev = wx.createVideoContext(this.data.playId);       
		  videoContextPrev.seek(0);       
		  videoContextPrev.pause();       
		  this.setData({playIndex:id});      
		  var videoContextCurrent = wx.createVideoContext(id);
		  videoContextCurrent.play();

	  }
	 

  },
  enterPlay:function(e){
	  //视频播放停止，进行图片轮播
	  this.setData({swiper_play:true,video_show:false});
  },
  //收藏、点赞
	bindUserAction:function(e){
		var type = e.currentTarget.id;
		var shopid = this.data.prod.shop_id;
		var plat_num_iid =  this.data.plat_num_iid;
		var _this = this;
		if(type==1){
			UserAction.recordZan('PROD', shopid, plat_num_iid,(json)=>{
				if(json.success==1){
					_this.setData({'has_zan':1})
				}
			});
		}
		if (type == 3) {
			UserAction.recordCollect('PROD', shopid, plat_num_iid, (json) => {
				if (json.success == 1) {
					_this.setData({'has_collect': 1})
				}
			});
		}
	},
  //删除收藏、点赞
  delbindUserAction: function (e) {
    var type = e.currentTarget.id;
    var shopid = this.data.prod.shop_id;
    var plat_num_iid = this.data.plat_num_iid;
    var _this = this;
    if (type == 1) {
      UserAction.delZan('PROD', shopid, plat_num_iid, (json) => {
        if (json.success == 1) {
          _this.setData({ 'has_zan': 0 })
        }
      });
    }
    if (type == 3) {
      UserAction.delCollect('PROD', shopid, plat_num_iid, (json) => {
        if (json.success == 1) {
          _this.setData({ 'has_collect': 0 })
        }
      });
    }
  },
	// 分享
	onShareAppMessage: function (res) {
		var vip_info = wx.getStorageSync('vip_info');
		var weixinid = wx.getStorageSync('weixinid');
		var shopid = this.data.prod.shop_id;
		var plat_num_iid = this.data.plat_num_iid;
		var promo_num = this.data.promo_num;
		if (vip_info) {
      var share_path = '/pages/mall/bargainprod?plat_num_iid=' + plat_num_iid + '&share_vipid=' + vip_info.vip_id;
		} else {
      var share_path = '/pages/mall/bargainprod?plat_num_iid=' + plat_num_iid;
		}
		if(promo_num){
			share_path = share_path +'&promo_num='+promo_num;
		}
		var shareimg = this.data.imgs[0];
		return {
			'title': this.data.prod.plat_num_name,
			'path': share_path,
			'imageUrl': this.data.imgbase + shareimg,
      'desc': this.data.prod.share_desc,
			'success': function (res) {
				UserAction.recordShare('PROD', shopid, plat_num_iid);
			}
		}
	},
	//读取相关商品
	getRelativeProd:function(){
		var _this = this;
		app.http.post('Prod/getRelativeProds', { 'plat_num_iid': this.data.plat_num_iid}, function (json) {
      _this.setData({
				'relativeprods': json.data
			})
		})
	},
	getBuycarCount:function(){
		var _this = this;
		app.http.post('Prod/getBuycartCount',{},function(json){
			_this.setData({
				'cartsum':json.sum
			})
		})
	},
	getSku2BySku1:function(data,skul_num){
		var tempdata = [];
		data.forEach(function(item){
			if (item.color_num == skul_num){
				tempdata.push(item);
			}
		});
		return tempdata;
	},
	getSkuTargetBycolorspec(data,color_num,spec_num){
		var target = null;
		data.forEach(function (item) {
			if (item.color_num == color_num && item.spec_num == spec_num) {
				target = item;
			}
		});
		return target;
	},
	getSkuTargetByskuid(data, skuid) {
		var target = null;
		data.forEach(function (item) {
			if (item.sku_id == skuid) {
				target = item;
			}
		});
		return target;
	},
//	getFormatSkuLvl:function(data){
//		var sku1 = [];
//		var sku1name = [];
//		var sku2 = [];
//		var skulvl = 2;
//		var targetsku1 = [];
//		console.log('getFormatSkuLvl');
//		data.forEach(function (item) {
//      
//      if (item.color == 'null') { item.color=''}
//      if (item.spec == 'null') { item.spec = '' }
//
//			if (item.color_num && (sku1.indexOf(item.color_num) == -1)) {
//				sku1.push(item.color_num);
//				console.log('item',item);
//				if(item.stockqty>0){
//					targetsku1.push(item.color_num);
//				}
//				let tempobj = { 'color': item.color, 'color_num': item.color_num };
//				sku1name.push(tempobj);
//			}
//			if (item.spec_num && (sku2.indexOf(item.spec_num) == -1)) {
//				sku2.push(item.spec_num);
//			}
//
//			//有一个没设置则采用1维sku
//			if (!item.color_num && !item.spec_num) {
//				skulvl = 1;
//			}
//
//		});
//
//		if (sku1.length == 0 || sku2.length == 0) {
//			skulvl = 1;
//		}
//
//		// if (sku1.length != sku2.length) {
//		// 	skulvl = 1;
//		// }
//
//		if(skulvl==1){
//			return 1;
//		}
//		console.log('targetsku1',targetsku1);
//		return {
//			'sku1':sku1,
//			'sku2': sku2,
//			'sku1name': sku1name,
//			'targetsku1':targetsku1
//		}
//	},

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },
  logVipFriend: function (prtvipid) {
    if (prtvipid) {
      app.http.post('Member/logVipFriend', { 'prtvipid': prtvipid }, function () { });
    }
  },


};


Object.assign(pageObj.data, wig_counter.wig_data);
Object.assign(pageObj, wig_counter);
Object.assign(pageObj, AddcartIns);
Page(pageObj);