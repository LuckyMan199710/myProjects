var app = getApp()
var userRecord = require('../../utils/record.js');
// var wig_counter = require('../../utils/wig_counter.js');
var AddcartIns = require('../../utils/wig_addcart.js');

var UserAction = userRecord(app);


var pageObj = {
  data: {
    'base_conf': app.DF,
		'ontabpage': 'mall_main',
		imgbase: app.STATIC_URL + 'uploads/',
		prodTypeData:{
			'prod_type1': 'a'
		},
    tab: 0, 
    //collection: '/images/collection.png',
    //iscollection: '/images/collection2.png',
    //car: '/images/car.png',
    plat_num_iid:'',
    hidden: true,
    num:1,
    scrollTop: 0,
    prodgroup:'',
    page_path: 'pages/mall/main',
    shopname:'',
    imgLoadList: '',
    ques_list: []
  },
  
  onLoad: function (options) {
    this._option = options;
    console.log('onLoad  option',options);
    // let ques_list = wx.getStorageSync('ques_list') || '[]'
    // this.setData({
    //   ques_list: JSON.parse(ques_list)
    // })

    if (options.billno) {
      var billno = options.billno;
    } else {
      var billno = '';
    }
    var share_vipid = options.share_vipid;//分享者会员id
    var _this = this;
    this.setData({
      'bannarH': app.globalData.sys_info.windowWidth * 150 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight,
      'share_vipid': share_vipid || ''
    });
    app.updateIconStyle(this);
    // const shopid = wx.getStorageSync('vip_info').shop_id
    const shopid = options.shopid
    // var vip_info = wx.getStorageSync('vip_info');
    app.userLoginPromise
      .then(json => {
        wx.showLoading({ title: '正在加载...' });
        app.http.post('Mall/getTemplateInfo', { 'billno': billno, 'shopid': shopid || '' }, function (json) {
          _this.setData({
            base_conf: app.DF
          })
          wx.hideLoading();
          wx.setNavigationBarTitle({ title: json.vote.shop_name || '在线商城' });
          console.log('getTemplateInfo  json', json);
          _this.setData({
            'vote': json.vote,
            'ques_list': []
          });
          if (!billno && !options.shopid) {
            //设置店铺
            _this._option.shopid = json.vote.shop_id;
            _this._option.billno = json.vote._id;
            billno = json.vote._id;
          }
          console.log('billno', billno);
          // if (!wx.getStorageSync('ques_list')) {
          _this.loadModalData(billno);
          // }

          //记录推荐人vipid
          if (share_vipid) {
            _this.logVipFriend(share_vipid);
          }
          //访问记录
          UserAction.recordPageView('TEMPL', json.vote.shop_id, json.vote._id);
        });
      })
    
  
  },
  onShow: function () {
    console.log('main onshow');
    console.log('main 001definds', app.DF);
    var _this = this
    app.updateIconStyle(this);
    app.checkUserStatusByHand(function () {
      console.log('checkUserStatusByHand');
      console.log('main 002definds', app.DF);

      app.refreshVipInfo((vip_info) => {
        console.log('refreshVipInfo vip_info', vip_info);

        //console.log();
        //只有是会员才执行
        _this.setData({
          'vip_point': vip_info.point,
          'phone': vip_info.vip_num,
          'lvl_name': vip_info.lvl_name,
          'vip_point': vip_info.point,
          'headimgurl': vip_info.headimgurl,
          'is_vip': true,
        });
        console.log(vip_info)

        //app.userLoginPromise.then((json) =>{
        _this.showGetCard();
        // console.log('coupon_dialog ', _this.data.coupon_dialog);
        // if (!_this.data.coupon_dialog.coupon_cnt) {
        //   _this.showCouponDialog();
        // } else {
        //   //初始化
        //   //_this.setData({coupon_dialog:{coupon_cnt:0}});
        // }

        //});

      });
    })
    var vip_info = wx.getStorageSync('vip_info');
    if (!vip_info) {
      _this.setData({ loading: false });
    }
  },
  showGetCard: function () {
    var _this = this;
    //是否显示立即领卡
    // app.http.post('Member/isGetCard', {}, function (json) {
    //   console.log('isGetCard  json', json);
    //   _this.setData({
    //     'get_card_hidden': json.bool,
    //     'vipcard_id': json.card_id || '',
    //     'card_setupid': json.setup_id || '',
    //   })
    // });
  },
  loadModalData: function (billno){
    var vip_info = wx.getStorageSync('vip_info');
		//加载各模块的数据
		var _this = this;
    
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getAllTemplateInfo', { 'billno': billno, 'shopid': this._option.shopid || ''}, function (json) {
      
      console.log('getAllTemplateInfo  json',json);
      var ques_list = json.ques_list;
      _this.setData({
        'ques_list': ques_list,
      })
      
      
      ques_list && ques_list.forEach(function (item, index) {
        // setTimeout(function(){timeoutLoadItem(item, item.type_num, _this, index)}, 100*index)
        if (item.type_num == '4') {
          //某类商品
          _this._loadTypeProds(item, index);
          
        }
        if (item.type_num == '5') {
          //推荐商品
        	console.log('选择商品');
          
          _this._loadProds(item, index);
        }
        if (item.type_num == '6') {
          //分组类目
          _this._loadClassProds(item, index);
        }
        if (item.type_num == '7') {
          //优惠券
          _this._loadCoupons(item, index);
        }
        if (item.type_num == '11') {
          //店铺列表
          _this._loadEnterShop(item, index);
        }
      })
      
      wx.hideLoading();
    });
	},
  imageOnLoad: function (e) {
    let that = this;
    var realthumb = e.target.dataset.thumb;
    var index = e.target.dataset.myindex;
    let list =  that.data.ques_list[index].prodslist
    for (var i = 0; i < list.length; i++) {
      let list_url = that.data.imgbase + list[i].image_url
      if (list_url == realthumb) {
        list[i].loaded = true
      }
      that.data.ques_list[index].prodslist = list;
    }
    that.setData({
      'ques_list': that.data.ques_list
    })
  },
  imageOnLoad2: function (e) {
    let that = this;
    var realthumb = e.target.dataset.thumb;
    var index = e.target.dataset.myindex;
    let list = that.data.ques_list[index].prodsource
    for (var i = 0; i < list.length; i++) {
      let list_url = that.data.imgbase + list[i].image_url
      if (list_url == realthumb) {
        list[i].loaded = true
      }
      that.data.ques_list[index].prodsource = list;
    }
    that.setData({
      'ques_list': that.data.ques_list
    })
  },
  _loadTypeProds: function (item, index) {
    //组件分类商品
    var _this = this;
    app.http.post('Mall/getControlTypeProds', { 'templ_num': item.templ_num, 'control_num': item.control_num,'shopid':this._option.shopid || ''}, function (json) {
      //item.prodslist = json.data;
    	console.log('getControlTypeProds  json',json);
    	var prodslist = [];
    	json.data && json.data.forEach(function(item2,index2){
        item2.tempthumb ='../../images/loading.jpg'
        item2.loaded = false;
        item2.myindex = index;
    		if(item2.gifttype=='P'){
    			item2.group_url = "/pages/mall/groupprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
    		}else if(item2.gifttype=='K'){
    			item2.group_url = "/pages/mall/bargainprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
    		}
    		prodslist.push(item2);
        
    	});
      _this.data.ques_list[index].prodslist = prodslist;
      _this.setData({
        'ques_list': _this.data.ques_list,
        'prod_source': json.prod_source
      })
    });
  },
  _loadProds: function (item, index) {
    //推荐商品
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getControlProds', { 'templ_num': item.templ_num, 'control_num': item.control_num ,'shopid':this._option.shopid || ''}, function (json) {
      //item.prodsource = json.data;
      wx.hideLoading();
    	console.log('getControlProds  json',json);
    	var prodsource = [];
    	json.data && json.data.forEach(function(item2,index2){
        item2.tempthumb = '../../images/loading.jpg'
        item2.loaded = false;
        item2.myindex = index;
    		if(item2.gifttype=='P'){
    			item2.group_url = "/pages/mall/groupprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
    		}else if(item2.gifttype=='K'){
    			item2.group_url = "/pages/mall/bargainprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
    		}
    		prodsource.push(item2);
    	});
      _this.data.ques_list[index].prodsource = prodsource;
      _this.setData({
        'ques_list': _this.data.ques_list
      })
      wx.setStorageSync('ques_list', JSON.stringify(_this.data.ques_list))
    });
  },
  _loadClassProds: function (item, index) {
    //组件分类商品
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getControlTypeProds', { 'templ_num': item.templ_num, 'control_num': item.control_num ,'shopid':this._option.shopid || ''}, function (json) {
      wx.hideLoading();
      console.log('getControlTypeProds  json',json);
      console.log('item',item);
      var prodgroup = [];
      json.data && json.data.forEach(function(item2,index2){
  		if(item2.gifttype=='P'){
  			item2.group_url = "/pages/mall/groupprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
  		}else if(item2.gifttype=='K'){
  			item2.group_url = "/pages/mall/bargainprod?plat_num_iid="+item2.plat_num_iid+"&promo_num="+item2.promo_num;
  		}
  		prodgroup.push(item2);
  	});
      if(json.data){
    	  _this.setData({
    	        'prodgroup': prodgroup,
    	        'prodtype': item.classname[0].classnum
    	      })
      }
      
    });
  },
  //商品分组
  ClassProds: function (e) {
    var classnum = e.target.dataset.num;
    var control = e.target.dataset.control;
    var templ = e.target.dataset.templ;
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getClassProds', {'classnum': classnum, 'control': control, 'templ': templ}, function (json) {
      wx.hideLoading();
      _this.setData({
        'prodgroup': json.data,
        'prodtype': classnum
      })
    });
    // this.setData({
    //   tab: datasetId,
    //   prodtype: datasetId
    // })
  },  
  _loadCoupons: function (item, index) {
    //优惠券
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getControlCoupon', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.coupon = json.data;
      wx.hideLoading();
      _this.data.ques_list[index].coupon = json.data;
      _this.setData({
        'ques_list': _this.data.ques_list,
      })
    });
  },
  _loadEnterShop: function (item, index) {
    //店铺列表
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getControlEntershop', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.coupon = json.data;
      wx.hideLoading();
      _this.data.ques_list[index].shop = json.data;
      _this.setData({
        'ques_list': _this.data.ques_list,
      })
    });
  },
  //商品收藏
  collection: function (e) {
    var shopid = e.target.dataset.id;
    var plat_num_iid = e.target.dataset.num;
    var cla = e.target.dataset.cla;
    var _this = this;
    UserAction.recordCollect('PROD', shopid, plat_num_iid, (json) => {
      if (json.success == 1) {
        _this.iscollection(plat_num_iid, 'Y', cla);
      }
    });
  }, 
  //删除商品收藏
  delcollection: function (e) {
    var shopid = e.target.dataset.id;
    var plat_num_iid = e.target.dataset.num;
    var cla = e.target.dataset.cla;
    var _this = this;
    UserAction.delCollect('PROD', shopid, plat_num_iid, (json) => {
      if (json.success == 1) {
        _this.iscollection(plat_num_iid, 'N', cla);
      }
    });
  }, 
  iscollection: function (plat_num_iid,types,cla=0) {
    var _this=this;
    _this.data.ques_list && _this.data.ques_list.forEach(function (item, index) {
      if (item.type_num == 4 && item.prodslist) {
        item.prodslist.forEach(function (item2, index2) {
          if (item2.plat_num_iid == plat_num_iid) {
            if(types=='Y'){
              _this.data.ques_list[index].prodslist[index2].pagecollectcnt = 1;
            }else{
              _this.data.ques_list[index].prodslist[index2].pagecollectcnt = 0;
            }
            _this.setData({
              'ques_list': _this.data.ques_list,
            })
          }
        })
      }
      if (item.type_num == 5 && item.prodsource) {
        item.prodsource.forEach(function (item2, index2) {
          if (item2.plat_num_iid == plat_num_iid) {
            if (types == 'Y') {
              _this.data.ques_list[index].prodsource[index2].pagecollectcnt = 1;
            }else{
              _this.data.ques_list[index].prodsource[index2].pagecollectcnt = 0;
            }
            _this.setData({
              'ques_list': _this.data.ques_list,
            })
          }
        })
      }
      if (item.type_num == 6) {
        
        _this.data.prodgroup && _this.data.prodgroup.forEach(function (item2, index2) {
          if (item2.plat_num_iid == plat_num_iid) {
            if (types == 'Y') {
              _this.data.prodgroup[index2].pagecollectcnt = 1;
            } else {
              _this.data.prodgroup[index2].pagecollectcnt = 0;
            }
            _this.setData({
              'prodgroup': _this.data.prodgroup,
            })
          }
        })
      }
    })
  },
  //搜索
  bindSearch:function (e) {
    var keyword = e.detail.value
    if (!keyword){
      keyword = this.data.Search
    }
    var shop_id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/mall/prodlist?shop_id=" + shop_id+"&keyword=" + keyword,
    })
  },
  SearchInput: function (e) {
    this.setData({
      Search: e.detail.value
    })
  },
  buy: function (e) {
	 console.log('main buy');
	 console.log(e.target);
    //调起购物车
    var pid = e.target.dataset.num || '';
    if (!pid) {
      app.alertMsg('商品参数不存在');
      return false;
    }
    var actiontype = 'addcart';
    var share_vipid = this.data.share_vipid;//这个页面暂时未用到分享会员id,缺省为0
    this.showAddcart(pid,actiontype,share_vipid);
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
      app.alertMsg(json.msg)
      return false;
    });
  },
  // 打开会员卡
  openVipCard: function () {
    var _this = this;
    _this.setData({ get_card_hidden: false, getcard_loading: true });
    app.http.post('Member/getVipInfo', { 'vipcard_id': _this.data.vipcard_id || '', 'card_setupid': _this.data.card_setupid || '' }, function (json) {
      console.log('getVipInfo  json', json);
      if (json.success === 1) {
        if (json.vip_info !== '') {
          wx.openCard({
            cardList: [{
              'cardId': json.vip_info.wx_card_id,
              'code': json.vip_info.wx_card_code
            }],
            success: function (res) {
              console.log(res)
            }
          })
        } else {
          app.vipLogin(_this.data.page_path);
        }
        // add card end
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  getVipCard: function () {
    var _this = this;
    app.http.post('Login/getWxJdkCardSign', { 'vipcard_id': _this.data.vipcard_id || '', 'card_setupid': _this.data.card_setupid || '' }, function (json) {
      console.log('getWxJdkCardSign  json', json);
      if (json.success == 1) {
        wx.addCard({
          cardList: [{
            'cardId': json.card_id,
            'cardExt': JSON.stringify(json.cardExt)
          }],
          success: function (res) {
            _this.setData({ getcard_loading: false });
            app.alertMsg('领取成功');

          },
          fail: function (res) {
            _this.setData({ getcard_loading: false, get_card_hidden: true });
            app.alertMsg('领取失败');
          }
        })
        //add card end
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  getCouponById: function (id) {
    var target = false;
    this.data.ques_list && this.data.ques_list.forEach((item) => {
      console.log('id:'+id+' type_num:'+item.type_num);
      if (item.type_num == 2) {
        //广告
        item.banner && item.banner.forEach((item2) => {
          if (item2.coupon_id == id && item2.reltype =='COUPON') {
            target = item2;
          }
        });
      }else if(item.type_num==7){
        //优惠券组件
        item.coupon && item.coupon.forEach((item2) => {
          if (item2.coupon_id == id) {
            target = item2;
          }
        });
      }else if(item.type_num==13){
        ///图导航领取优惠券
        item.image_nav&&item.image_nav.forEach((item2)=>{
          if(item2.link_type=='U'&&item2.coupon_id==id){
            target=item2;
          }
        });
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
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  goTop: function (e) {
    // this.setData({
    //   scrollTop: 0
    // })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  logVipFriend: function (prtvipid) {
    if (prtvipid) {
      app.http.post('Member/logVipFriend', { 'prtvipid': prtvipid }, function () { });
    }
  },
  onShareAppMessage: function (res) {
    var _this = this;
    var vip_info = wx.getStorageSync('vip_info');
    
    var query = app.query2Str(_this._option) || '';
    if (vip_info) {
      if (query) {
        query = query + '&share_vipid=' + vip_info.vip_id;
      }else{
        query = '?share_vipid=' + vip_info.vip_id;
      }
      var share_path = '/pages/mall/main' + query;
    } else {
      var share_path = '/pages/mall/main' + query;
    }
    console.log(share_path);
    // var shareimg='';
    var shareimg = ''
    if (_this.data.vote && _this.data.vote.share_images) {
      shareimg = _this.data.vote.share_images
    }
    if (!shareimg){
      if (_this.data.ques_list){
        _this.data.ques_list.forEach(function (item, index) {
          if (item.type_num == 2 && item.banner) {
            shareimg = item.banner[0].image_url;
          }
        });
      }
    }
    var share_title = _this.data.vote.share_title;
    return {
      'title': share_title || this.data.sharePara && this.data.sharePara.title || '首页',
      'path': share_path,
      'imageUrl': this.data.imgbase + shareimg,
      'desc': _this.data.vote.remark || '',
      'success': function (res) {
        //转发记录
        UserAction.recordShare('VIPCENTER', 0, '');
      },
      'fail': function (res) { }
    }
  },
  bindSearchScan:function(e){
    wx.scanCode({
      success: (res) => {
        // this.setData({
        //   'search_val': res.result
        // })

        var keyword = res.result
        if (!keyword) {
          keyword = this.data.Search
        }
        var shop_id = e.currentTarget.id;
        wx.navigateTo({
          url: "/pages/mall/prodlist?shop_id=" + shop_id + "&keyword=" + keyword,
        })
      },
      fail: (res) => {
        if(res.errMsg == "scanCode:fail"){
          app.alertMsg('扫码失败,类型或不支持'+res.errMsg);
        }
      }
    })
  }
};

Object.assign(pageObj, AddcartIns);
Page(pageObj);
