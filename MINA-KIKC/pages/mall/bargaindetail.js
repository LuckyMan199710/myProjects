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
    formgroup:false,
    is_group:false,
    group_end:false,
    group_success:false,
    loading:false,
    showtype:'bargain_detail',
    video_show:true,
    video_autoplay:true,
    video_index:0,
    color_primary:app.DF.color_primary?app.DF.color_primary:'#ad2a26',
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
  bindGoBargain:function(e){
	  console.log('bindGoBargain  e',e);
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
					app.vipLogin(_this.data.page_path + app.query2Str(_this.options));
				}});
				return false;
			}
			var curskuid = _this.data.curskuid;
			var curbuyqty = _this.data.wig_counter_data.num;
			var share_vipid = _this.data.share_vipid || '';
			var actiontype = 'buynow';
			_this.showAddcart(curskuid['plat_num_iid'],actiontype,share_vipid,{
		    'curbuyqty':curbuyqty,
		    'curskuid': _this.data.curskuid,
		    'promo_num':_this.data.promo_num||'',
		    'gifttype':_this.data.gifttype||'K',
		  });
		});
		
  },
//  bindGoBargain:function(e){
//	  var plat_num_iid = this.data.plat_num_iid;
//	  var promo_num = this.data.promo_num;
//	  wx.navigateTo({url:'/pages/mall/main?plat_num_iid='+plat_num_iid+'&promo_num='+promo_num});
//  },
  bindHelpBargain:function(e){
	  var _this = this;
	  console.log('bindHelpBargain');
	  if(!this.data.group_id || !this.data.groupdetail_data){return;}
	  app.http.post('Mall/checkBargain',{group_id:_this.data.group_id,billno:this.data.groupdetail_data.billno},function(json){
		  console.log('checkBargain  json',json);
		  if(json.success==-1){
			  app.alertMsg(json.msg);
			  return false;
		  }
		  if(json.success==-2){
			  app.alertMsg('请注册会员',{cb:function(){
				  app.vipLogin(_this.data.page_path + app.query2Str(_this.options));
			  }});
			  return false;
		  }
		  _this.helpBargain();
	  });
  },
  //帮砍价
  helpBargain:function(){
	  var _this = this;
	  app.http.post('Order/goHelpBargain',{group_id:_this.data.group_id},function(json){
		  if(json.success==1){
			  _this.setData({group_success:true});
			  if(!json.lottery){
				  _this.getBargainList();
				  return false;
			  }else{
				  var target_url = '';
        		  if(json.lottery.gametype=='T'){
        			  target_url = '/pages/game/zhuanpan?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='C'){
        			  target_url = '/pages/game/guaka?billno=' + json.lottery.billno;
        		  }else if(json.lottery.gametype=='E'){
        			  target_url = '/pages/game/jindan?billno=' + json.lottery.billno;
        		  }
        		  if(target_url){
        			  app.alertMsg('砍价成功,获得抽奖机会',{cb:function(){
        				  wx.navigateTo({
                              url: target_url,
                            });
        				  _this.getBargainList();
                		  return false;
        			  }});
        			  
        		  }
        		  
			  }
		  }else{
			  app.alertMsg(json.msg || '帮砍失败');
		  }
	  });
  },
  //当前价购买
  bindBuyBargain:function(e){
	  var vip_info = wx.getStorageSync('vip_info');
	  var bargain_one = this.data.bargain_one;
	  if(vip_info["vip_id"]!=bargain_one["first_vipid"]||!this.data.group_id){
		  return false;
	  }
	  
	  app.http.post('Mall/getPayBillno',{group_id:this.data.group_id,gifttype:'K'},function(json){
		  if(json.success==1 && json.order){
			  wx.navigateTo({url:'/pages/mall/orderdetailone?paybillno='+json.order.pay_billno+'&billno='+json.order.billno});
			  return false;
		  }else{
			  app.alertMsg(json.msg || '购买失败');
		  }
	  });
  },
  closeMarkTip:function(e){
	  console.log('closeMarkTip  e',e);
	  this.setData({group_success:false});
  },
  closeMarkShare:function(e){
	  console.log('closeMarkShare  e',e);
	  this.setData({groupvisit:false});
  },
  bindBargainVisit:function(e){
	  console.log('bindBargainVisit  e',e);
	  var self = this;
	  if(!this.data.curskuid){return false;}
	  var group_id = this.data.group_id;
	  if(!group_id){
		  return false;
	  }
	  self.setData({group_success:false});
	  //return false;
	  wx.showLoading();
	  app.http.post('Mall/pageQrCode', { 'group_id': group_id ,type:'bargain'}, function (json) {
		  console.log('pageQrCode  json',json);
		  if (json.success == 1) {
		        var qrcode_url_source = self.data.imgbase + json.data;
		        console.log(qrcode_url_source);
		        //下载二维码
		        wx.downloadFile({
		          url: qrcode_url_source,
		          success: (res) => {
		        	  console.log('downloadFile res',res);
		            if (res.statusCode == '200') {
		              self.pageQrcodeFile = res.tempFilePath;
		              self.drawImage();
		            }
		            else {
		            	 wx.hideLoading();
		              app.alertMsg('生成分享图片失败');
		            }
		          },
		          complete: function () {
		        	  
		          }
		        });
		      } else {
		    	  wx.hideLoading();
		        app.alertMsg(json.msg);
		      }
		  
	  });
  },
  //画图
  drawImage: function () {
    var self = this;
    console.log('drawImage');
    const wxGetImageInfo = app.promisify(wx.getImageInfo);
    let prod_img = self.data.prod.pic_main || self.data.imgs[0];
    
    const getTxtBlocks = (content = '') => {
        let result = []
        if (typeof content === 'string') {
          // 将文字简单分行，每十六个字符为一行
          const COUNT_PER_BLOCK = 12
          for (let offset = 0, l = content.length; offset < l;) {
            let start = offset
            let end = offset + COUNT_PER_BLOCK
            let block = content.substring(start, end)
            result.push(block)
            offset += COUNT_PER_BLOCK
          }
        }
        return result
      }

    Promise.all([
        wxGetImageInfo({
            src: self.data.imgbase+(self.data.groupdetail_data.group_share_bg||'/share_bg.jpg')
        }),
        wxGetImageInfo({
            src: self.data.imgbase+prod_img
        }),
        wxGetImageInfo({
            src: self.pageQrcodeFile
        })
    ]).then(res => {
    	 console.log('drawImage  res',res);
        const ctx = wx.createCanvasContext('shareCanvas')
        // 底图
        ctx.drawImage(res[0].path, 0, 0, 275, 400)
        //产品主图
        ctx.drawImage(res[1].path,25,40,225,260)
        // 作者名称
//        ctx.setTextAlign('center')    // 文字居中
//        ctx.setFillStyle('#000000')  // 文字颜色：黑色
//        ctx.setFontSize(14)         // 文字字号：22px
//        ctx.fillText("作者：一斤代码", 150, 360)
        //产品名称
        var fillContent = self.data.prod.plat_num_name;
      const FROM_X = 100
      const FROM_Y = 330
      const LIGHT_HEIGHT = 21
      var last_y = 0;
      let fillContentBlocks = getTxtBlocks(fillContent);
      if (fillContentBlocks.length > 2) {
    	  fillContentBlocks[1] = fillContentBlocks[1] + '...';
      }
      ctx.setTextAlign('left');
      ctx.setFillStyle('#000000')
      ctx.setFontSize(14)
      ctx.font = "bold"
      for (let i = 0, l = fillContentBlocks.length; i < l; i++) {
        //最多绘制二行文字
        if (i < 2) {
          let x = FROM_X
          let y = FROM_Y + LIGHT_HEIGHT * i
          last_y = y;
          ctx.fillText(fillContentBlocks[i], x, y, 120)
        } else {
          break;
        }
      }
      
      //砍价
      var saleprice = self.data.curskuid['promo_p']['min_price'];
      var fill_saleprice = '砍价： ';
      ctx.fillText(fill_saleprice, FROM_X, last_y+30, 50)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#e10601')
      ctx.setFontSize(16)
      ctx.fillText('￥'+saleprice, 145, last_y+30, 50)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#ffffff')
      ctx.setFontSize(10)
        // 小程序码
        ctx.save(); // 先保存状态 已便于画完圆再用
      	ctx.beginPath(); //开始绘制
      	//先画个圆
      	ctx.arc(55, 350, 31, 0, Math.PI * 2, false);
      	ctx.clip();
      	const qrImgSize = 60
        ctx.drawImage(res[2].path, 25, 320, qrImgSize, qrImgSize)
        ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
       
        ctx.stroke()
        ctx.draw()
        self.setData({groupvisit:true});
        wx.hideLoading();
    }).catch(err =>{
    	 wx.hideLoading();
    	console.log('drawImage err',err);
    });
  },
  //保存图片到相册
  savePhoto:function (e){
	  let self = this;
	  const wxCanvasToTempFilePath = app.promisify(wx.canvasToTempFilePath)
	  const wxSaveImageToPhotosAlbum = app.promisify(wx.saveImageToPhotosAlbum)
	  wxCanvasToTempFilePath({
	      canvasId: 'shareCanvas'
	  }, this).then(res => {
		  console.log('savePhoto   res001',res);
	      return wxSaveImageToPhotosAlbum({
	          filePath: res.tempFilePath
	      })
	  }).then(res => {
		  console.log('savePhoto   res002',res);
		 
	      wx.showToast({
	          title: '已保存到相册'
	      });
	      self.recordGroupShare();
	      self.setData({groupvisit:false});
	  }).catch(err => {
		  console.log('保存相册失败   err',err);
		  app.alertMsg("保存到相册失败");
	  });
  },
  changeShowType:function(e){
	  var type = e.currentTarget.dataset.type;
	  if(!type){return false;}
	  this.setData({showtype:type});
  },
  getBargainList:function(){
	  var _this = this;
	  var groupdetail_data = this.data.groupdetail_data ||'';
	  var post_data = { 'billno':groupdetail_data.billno || '',group_id:this.data.group_id || ''};
	  if(_this.timer){
		  clearInterval(_this.timer);
	  }
	  app.http.post('Mall/getBargainList',post_data, function (json) {
		  console.log('getBargainList  json',json);
		  console.log('getBargainList  post_data',post_data);
		  if(json.success == 1){
			  var bargain_list = json.list||[];
			  var bargain_one = json.onelist||'';
			  console.log('bargain_one',bargain_one);
			  _this.setData({bargain_list:bargain_list,loading:true,bargain_one:bargain_one});
			  if(bargain_list.length<=0){
				  _this.setData({showtype:'prod_detail'});
			  }
			  _this.setData({left_hours:bargain_one.left_hours,left_minutes:bargain_one.left_minutes,left_seconds:bargain_one.left_seconds,dist_time:bargain_one.dist_time});
			  //计时器
			  _this.timer = setInterval(function(){
				  
				  var dist_time = _this.data.dist_time-1;
				  var left_hours =  parseInt(dist_time/60/60);
				  var left_minutes =  parseInt(dist_time/60%60);
				  var left_seconds =  parseInt(dist_time%60);
				  left_hours = left_hours>=10?left_hours:0+left_hours.toString();
				  left_minutes = left_minutes>=10?left_minutes:0+left_minutes.toString();
				  left_seconds = left_seconds>=10?left_seconds:0+left_seconds.toString();
				  _this.setData({left_hours:left_hours,left_minutes:left_minutes,left_seconds:left_seconds,dist_time:dist_time});
				  if(dist_time<0){
					  clearInterval(_this.timer);
				  }
				  
				},1000);
//			  
//			  //自动关闭遮幕
//			  var success_timer = setInterval(function(){
//				  _this.setData({group_success:false});
//				  clearInterval(success_timer);
//			  },5000);
		  }else{
			  app.alertMsg(json.msg||'砍价活动不存在',{cb:app.goback});
		  }
		  
	  });
  },
  recordGroupShare:function(){
	  var group_id = this.data.group_id;
	  app.http.post('Pubdata/recordGroupShare', { group_id: group_id,gifttype:'K'}, function (json) {
		  console.log('recordGroupShare  json',json);
			})
  },
  recordGroupView:function(){
	  var group_id = this.data.group_id;
	  app.http.post('Pubdata/recordGroupView', { group_id: group_id,gifttype:'K'}, function (json) {
		  console.log('recordGroupView  json',json);
			})
  },
  preventTouchMove: function () { },
  onReady: function () {
    //wx.setNavigationBarTitle({ title: '商品详情' });
  },
  onShow:function(){
	  var _this = this;
	  if(this.data.groupdetail_data){
		  this.getBargainList();
	  }
  },
  onLoad: function (options) {
		var _this = this;
		 //测试
		//options.group_id = 99;
		
		_this.options = options;
    wx.showShareMenu({
      withShareTicket: true
    })
		var plat_num_iid = options.plat_num_iid;
    var source_promo = options.source_promo || '';
    var share_vipid = options.share_vipid || '';
    var keyword = options.keyword || '';
    var group_id = options.group_id || '';
	console.log('bargaindetail onload options',options);
    if (options.scene) {
    	var qrcode_obj = app.decodeURI(options)||"";
    	console.log('qrcode_obj',qrcode_obj);
    	if(!qrcode_obj || (qrcode_obj && !qrcode_obj['id'])){
    		app.alertMsg('参数不存在',{
				cb: app.goBack
			})
    	}
    	options.group_id = qrcode_obj['id'];
    	group_id = qrcode_obj['id']; 
    }else{
    	if (!group_id){
			app.alertMsg('参数不存在',{
				cb: app.goBack
			})
		}
    }
    
    
    //参团成功进入团详情页
    if(options.group_type && options.group_type=='S'){
    	this.setData({group_success:true});
    }
		
		app.updateIconStyle(this);
    _this.setData({
      'winWidth': app.globalData.sys_info.windowWidth
    })

    console.log('onLoad  group_id',options.group_id);
    if(options.group_id){
    	wx.setNavigationBarTitle({ title: '砍价详情' });
    	_this.setData({groupdetail:true,group_id:options.group_id});
    }
		//授权调用
		app.userLoginPromise
			.then(json => {
				
				//加载积分产品数据
				app.http.post('Mall/getBargainDetail', { 'group_id': group_id}).then(json => {
						console.log('getBargainDetail  json',json);
					if(json.success != 1 || !json.data){
						app.alertMsg('砍价活动不存在', {
							cb: app.goBack
						});
						return false;
					}
					_this.setData({groupdetail_data:json.data,gifttype:'K'});
					if(json.msg && json.data){
						if(json.data.billstatus !='CL'){
							app.alertMsg(json.msg,{cb:function(){
								wx.redirectTo({url:'/pages/mall/bargainprod?plat_num_iid='+json.data.plat_num_iid+'&share_vipid='+share_vipid+'&promo_num='+json.data.billno});
								
							}});
							return false;
						}
					}
					if(json.msg){
						app.alertMsg(json.msg, {
							cb: app.goBack
							});
						return false;
					}
					
					_this.setData({group_id:group_id,promo_num:json.data.billno});
		    		plat_num_iid = json.data.plat_num_iid;
		    		wx.showLoading({title: '正在加载...'});
					app.http.post('Prod/getprodinfo', { 'plat_num_iid': plat_num_iid}, function (json) {
					console.log('getprodinfo json',json);
					console.log('getprodinfo plat_num_iid',plat_num_iid);
					if (json.success) {
						if (!json.data) {
							wx.hideLoading();
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
						
						
						//显示帮砍清单列表
						_this.getBargainList();
	
						//加载sku
						app.http.post('Prod/getProdSkus', { 'plat_num_iid': plat_num_iid,promo_num:_this.data.promo_num,group_id:_this.data.group_id||''}, function (json) {
							wx.hideLoading();
							console.log('getProdSkus json',json);
							if(json.success==1){
								if (!json.data) {
									app.alertMsg('读取产品sku数据失败', {
										cb: app.goBack
									});
									return false;
								}
								//判断活动是否下架
								if(_this.data.groupdetail_data.billstatus=='CL'){
									app.alertMsg("砍价活动已下架");
								}
								if(json.promo_name){
									_this.setData({promo_name:json.promo_name});
								}
								
									var skulvl = _this.getFormatSkuLvl(json.data);
									console.log('getFormatSkuLvl ',_this.getFormatSkuLvl);
									_this.__prodskudata = json.data;
									console.log('skulvl 1112',skulvl);
									if (skulvl == 1) {
										var cursku_data = null;
										json.order_sku && json.data && json.data.forEach(function (item){
											if(item.sku_id==json.order_sku.sku_id){
												cursku_data = item;
											}
										});
										_this.setData({
											'skulvl': 1,
											'sku1': json.data,
											'curskuid': cursku_data?cursku_data:json.data[0],
											'curbuyqty': 1
										});
									} else {
										console.log('skulvl 334',skulvl);
										var targetsku1 = skulvl['targetsku1'] && skulvl['targetsku1'].length>0?skulvl['targetsku1'][0]:skulvl['sku1'][0];
										console.log('targetsku1  011',targetsku1);
										if(json.order_sku && json.order_sku.color_num){
											targetsku1 = json.order_sku.color_num;
											var ordersku_specnum = json.order_sku.spec_num;
										}
										console.log('targetsku1  022',targetsku1);
										var sku2objs = _this.getSku2BySku1(json.data, targetsku1);
										var curskuid = _this.getSkuTargetBycolorspec(json.data, targetsku1, ordersku_specnum||sku2objs[0]['spec_num']);
										console.log('sku2objs  022',sku2objs);
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
            //团详情浏览记录
            _this.recordGroupView();
            
					}
				});
				_this.getBuycarCount();
			});
			});
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
  shareFriend:function(e){

  },
	// 分享
	onShareAppMessage: function (res) {
		var _this = this;
		var vip_info = wx.getStorageSync('vip_info');
		var weixinid = wx.getStorageSync('weixinid');
		var shopid = this.data.prod.shop_id;
		var plat_num_iid = this.data.plat_num_iid;
		var group_id = this.data.group_id;
		if (vip_info) {
      var share_path = '/pages/mall/bargaindetail?plat_num_iid=' + plat_num_iid + '&share_vipid=' + vip_info.vip_id;
		} else {
      var share_path = '/pages/mall/bargaindetail?plat_num_iid=' + plat_num_iid;
		}
		if(group_id){
			share_path = share_path+'&group_id='+group_id;
		}
		var shareimg = this.data.prod.pic_main||this.data.imgs[0];
		//不能判断是否分享成功，只要点击分享就隐藏
		_this.setData({groupvisit:false});
		return {
			'title': this.data.promo_name+': '+' '+this.data.prod.plat_num_name,//this.data.prod.plat_num_name,
			'path': share_path,
			'imageUrl': this.data.imgbase + shareimg,
      'desc': this.data.prod.share_desc,
			'success': function (res) {
				UserAction.recordShare('PROD', shopid, plat_num_iid);
				_this.recordGroupShare();
				
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
//			if (item.color_num == skul_num){
//				tempdata.push(item);
//			}
			if (item.color_num == _this.data.bargain_one.sku_num){
				tempdata.push(item);
			}
		});
		return tempdata;
	},
	getSkuTargetBycolorspec(data,color_num,spec_num){
		var _this = this;
		var target = null;
		data.forEach(function (item) {
//			if (item.color_num == color_num && item.spec_num == spec_num) {
//				target = item;
//			}
			if (item.color_num == _this.data.bargain_one.color_num && item.spec_num == _this.data.bargain_one.spec_num) {
				target = item;
			}
		});
		return target;
	},
	getSkuTargetByskuid(data, skuid) {
		var _this = this;
		var target = null;
		data.forEach(function (item) {
//			if (item.sku_id == skuid) {
//				target = item;
//			}
			if (item.sku_id == _this.data.bargain_one.sku_id) {
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