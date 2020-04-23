var app = getApp()
var userRecord = require('../../utils/record.js');
// var wig_counter = require('../../utils/wig_counter.js');
var AddcartIns = require('../../utils/wig_addcart.js');

var UserAction = userRecord(app);

var pageObj = {
  data: {
    'ontabpage': 'mall_main',
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    prodTypeData: {
      'prod_type1': 'a'
    },
    tab: 0,
    collection: '/images/collection.png',
    iscollection: '/images/collection2.png',
    car: '/images/car.png',
    plat_num_iid: '',
    hidden: true,
    num: 1,
    scrollTop: 0,
    prodgroup: '',
    page_path: 'pages/mall/main',
    shopname: ''
  },
  onLoad: function (options) {
    this._option = options;
    if (options.billno) {
      var billno = options.billno;
    } else {
      var billno = '';
    }
    var shopid = options.shopid;
    this.shopid = shopid;
    var share_vipid = options.share_vipid;//分享者会员id
    var _this = this;
    this.setData({
      'bannarH': app.globalData.sys_info.windowWidth * 150 / 320,
      'windowHeight': app.globalData.sys_info.windowHeight
    });
    app.updateIconStyle(this);
    // var vip_info = wx.getStorageSync('vip_info');
    app.userLoginPromise
      .then(json => {
        wx.showLoading({ title: '正在加载...' });
        app.http.post('Mall/getTemplateInfo', { 'billno': billno, 'shopid': shopid }, function (json) {
          wx.hideLoading();
          wx.setNavigationBarTitle({ title: json.vote.shop_name || '在线商城' });
          _this.setData({
            'vote': json.vote,
          });
          _this.loadModalData(billno, shopid);
          //记录推荐人vipid
          if (share_vipid) {
            _this.logVipFriend(share_vipid);
          }
          //访问记录
          UserAction.recordPageView('TEMPL', json.vote.shop_id, json.vote._id);
        });
      })
  },
  loadModalData: function (billno, shopid) {
    var vip_info = wx.getStorageSync('vip_info');
    //加载各模块的数据
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getAllTemplateInfo', { 'billno': billno, 'shopid': shopid }, function (json) {
      wx.hideLoading();
      var ques_list = json.ques_list;
      _this.setData({
        'ques_list': ques_list,
      })
      ques_list && ques_list.forEach(function (item, index) {

        if (item.type_num == '4') {
          //某类商品
          _this._loadTypeProds(item, index);
        }
        if (item.type_num == '5') {
          //推荐商品
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
    });
  },
  _loadTypeProds: function (item, index) {
    //组件分类商品
    var _this = this;
    app.http.post('Mall/getControlTypeProds', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.prodslist = json.data;
      _this.data.ques_list[index].prodslist = json.data;
      _this.setData({
        'ques_list': _this.data.ques_list,
        'prod_source': json.prod_source
      })
    });
  },
  _loadProds: function (item, index) {
    //推荐商品
    var _this = this;
    app.http.post('Mall/getControlProds', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.prodsource = json.data;
      _this.data.ques_list[index].prodsource = json.data;
      _this.setData({
        'ques_list': _this.data.ques_list,
      })
    });
  },
  _loadClassProds: function (item, index) {
    //组件分类商品
    var _this = this;
    app.http.post('Mall/getControlTypeProds', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      _this.setData({
        'prodgroup': json.data,
        'prodtype': item.classname[0].classnum
      })
    });
  },
  //商品分组
  ClassProds: function (e) {
    var classnum = e.target.dataset.num;
    var control = e.target.dataset.control;
    var templ = e.target.dataset.templ;
    var _this = this;
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getClassProds', { 'classnum': classnum, 'control': control, 'templ': templ }, function (json) {
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
    app.http.post('Mall/getControlCoupon', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.coupon = json.data;
      _this.data.ques_list[index].coupon = json.data;
      _this.setData({
        'ques_list': _this.data.ques_list,
      })
    });
  },
  _loadEnterShop: function (item, index) {
    //店铺列表
    var _this = this;
    app.http.post('Mall/getControlEntershop', { 'templ_num': item.templ_num, 'control_num': item.control_num }, function (json) {
      //item.coupon = json.data;
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
  iscollection: function (plat_num_iid, types, cla = 0) {
    var _this = this;
    _this.data.ques_list && _this.data.ques_list.forEach(function (item, index) {
      if (item.type_num == 4 && item.prodslist) {
        item.prodslist.forEach(function (item2, index2) {
          if (item2.plat_num_iid == plat_num_iid) {
            if (types == 'Y') {
              _this.data.ques_list[index].prodslist[index2].pagecollectcnt = 1;
            } else {
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
            } else {
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
  bindSearch: function (e) {
    var keyword = e.detail.value
    var shop_id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/mall/prodlist?shop_id=" + shop_id + "&keyword=" + keyword,
    })
  },
  buy: function (e) {
    //调起购物车
    var pid = e.target.dataset.num || '';
    if (!pid) {
      app.alertMsg('商品参数不存在');
      return false;
    }
    this.showAddcart(pid);
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
  getCouponById: function (id) {
    var target = false;
    this.data.ques_list && this.data.ques_list.forEach((item) => {
      if (item.type_num == 2) {
        item.banner && item.banner.forEach((item2) => {
          if (item2.coupon_id == id && item2.reltype == 'COUPON') {
            target = item2;
          }
        });
      }
      if (item.type_num == 7) {
        item.coupon && item.coupon.forEach((item2) => {
          if (item2.coupon_id == id) {
            target = item2;
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

  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  logVipFriend: function (prtvipid) {
    if (prtvipid) {
      app.http.post('Member/logVipFriend', { 'prtvipid': prtvipid }, function () { });
    }
  },
  onShareAppMessage: function (res) {
    var _this = this;
    var vip_info = wx.getStorageSync('vip_info');
    console.log(_this.shopid)

    var query = app.query2Str(_this._option) || '';
    console.log(query)
    if (vip_info) {
      if (query) {
        query = query + '&share_vipid=' + vip_info.vip_id;
      } else {
        query = '?share_vipid=' + vip_info.vip_id;
      }
      var share_path = '/pages/mall/brand' + query;
    } else {
      var share_path = '/pages/mall/brand' + query;
    }

    // if (vip_info) {
    //   var share_path = '/pages/mall/brand?share_vipid=' + vip_info.vip_id +'&shopid='+_this.shopid;
    // } else {
    //   var share_path = '/pages/mall/brand';
    // }
    // var shareimg = '';
    var shareimg = _this.data.vote.share_images;
    if (!shareimg){
      if (_this.data.ques_list) {
        _this.data.ques_list.forEach(function (item, index) {
          if (item.type_num == 2 && item.banner) {
            shareimg = item.banner[0].image_url;
          }
        });
      }
    }

    var share_title = _this.data.vote.share_title;

    return {
      'title': share_title ||  this.data.sharePara && this.data.sharePara.title || '首页',
      'path': share_path,
      'imageUrl': this.data.imgbase + shareimg,
      'success': function (res) {
        //转发记录
        UserAction.recordShare('VIPCENTER', 0, '');
      },
      'fail': function (res) { }
    }
  },
};

Object.assign(pageObj, AddcartIns);
Page(pageObj);
