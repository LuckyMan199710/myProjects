var app = getApp()
var AddcartIns = require('../../utils/wig_addcart.js');
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);

var pageObj = {
  data: {
    'base_conf': app.DF,
    'ontabpage': 'class_prods',
    imgbase: app.STATIC_URL + 'uploads/',
    page_path: 'pages/mall/classprods',
    num: 10,
    isLoading: false,
    currOrder: { ordertxt: '销量', type: '', order: '' },
  },
  onLoad: function (options) {
    this._option = options;
    var _this = this;
    console.log('onLoad  option', options);
    this.setData({
      'rightW': app.globalData.sys_info.windowWidth - 110,
      'scrollH': app.globalData.sys_info.windowHeight - 51,
      'windowHeight': app.globalData.sys_info.windowHeight
    })
    app.updateIconStyle(this);
    app.userLoginPromise
      .then(json => {
        wx.showLoading({ title: '正在加载...' });
        app.http.post('Mall/getTypes', {}, function (json) {
          wx.hideLoading();
          _this.setData({
            base_conf: app.DF
          })
          _this.base_conf = app.DF;
          wx.setNavigationBarTitle({ title: '分类' });
          console.log('getTypes json', json);
          //分类商品排序
          if (json.prod_sort) {
            var prod_sort = json.prod_sort;
            var currOrder = _this.data.currOrder;
            var orderby = _this.data.orderby || '';
            if (prod_sort == 'SD') {
              currOrder = { ordertxt: '销量', type: 'soldqty', order: 'down' };
              orderby = 'soldqty desc';
            }
            if (prod_sort == 'PD') {
              currOrder = { ordertxt: '价格', type: 'price', order: 'down' };
              orderby = 'price desc';
            }
            if (prod_sort == 'PA') {
              currOrder = { ordertxt: '价格', type: 'price', order: 'up' };
              orderby = 'price asc';
            }
            if (prod_sort == 'UD') {
              currOrder = { ordertxt: '发布时间', type: 'uptime', order: 'down' };
              orderby = 'uptime desc';
            }
            if (prod_sort == 'UA') {
              currOrder = { ordertxt: '发布时间', type: 'uptime', order: 'up' };
              orderby = 'uptime asc';
            }
            _this.setData({ 'currOrder': currOrder, 'orderby': orderby });
          }
          _this.setData({
            'classname': json.data,
            'shopid': json.shopid || '',
            'prod_sort': json.prod_sort || '',
            'soldqty_visible': json.soldqty_visible || ''
          });
          _this.classProds(json.data[0]);
        });
      });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  //商品分组
  classProds: function (e) {
    if (e.classnum) {
      var classnum = e.classnum;
    } else {
      var classnum = e.currentTarget.dataset.num;
    }
    var _this = this;
    var num = _this.data.num;
    if (!classnum || this.data.isLoading) { return false; }
    _this.setData({ page: 1, isLoading: true });
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getTypeProds', { 'classnum': classnum, 'num': num, 'page': 1, orderby: this.data.orderby || '', 'shopid': this.data.shopid || '' }, function (json) {
      wx.hideLoading();
      let data = json.data || [];
      _this.setData({
        'prodgroup': json.data,
        'prodtype': classnum,
        'num': num,
        'pageno': data.length < num ? 0 : 2,
        'isLoading': false,
      })
    });
    console.log('classnum', classnum);
    //_this.setData({pageno:0});
    //_this.getPageData(classnum);
  },
  onReachBottom: function () {
    console.log('onReachBottom');
    let _this = this;
    let classnum = _this.data.prodtype;
    let list = _this.data.prodgroup || [];
    let pageno = _this.data.pageno;
    let num = _this.data.num;
    console.log('pageno001', pageno);
    if (pageno == 0 || _this.data.isLoading) { return false; }
    _this.setData({ isLoading: true });
    app.http.post('Mall/getTypeProds', { 'classnum': classnum, 'num': num, 'page': pageno, orderby: this.data.orderby || '', 'shopid': this._option.shopid || '' }, function (json) {
      wx.hideLoading();
      console.log('getTypeProds  json', json);
      let data = json.data || [];
      pageno = data.length < num ? 0 : ++pageno;
      console.log('pageno002', pageno);
      list = list.concat(data);
      _this.setData({
        'prodgroup': list,
        'prodtype': classnum,
        'pageno': pageno,
        'isLoading': false
      })
    });
  },
  buy: function (e) {
    //调起购物车
    var pid = e.target.dataset.num || '';
    var prod_promo = e.target.dataset.promo_num || '';
    if (!pid) {
      app.alertMsg('商品参数不存在');
      return false;
    }
    var actiontype = 'addcart';
    var share_vipid = this.data.share_vipid;//这个页面暂时未用到分享会员id,缺省为0
    var curdata = {
      prod_promo: prod_promo
    }
    this.setData({
      prod_promo: prod_promo
    })
    this.showAddcart(pid, actiontype, share_vipid, curdata);
  },

  //商品收藏
  collection: function (e) {
    var shopid = e.target.dataset.id;
    var plat_num_iid = e.target.dataset.num;
    var _this = this;
    UserAction.recordCollect('PROD', shopid, plat_num_iid, (json) => {
      if (json.success == 1) {
        _this.iscollection(plat_num_iid, 'Y');
      }
    });
  },
  //删除商品收藏
  delcollection: function (e) {
    var shopid = e.target.dataset.id;
    var plat_num_iid = e.target.dataset.num;
    var _this = this;
    UserAction.delCollect('PROD', shopid, plat_num_iid, (json) => {
      if (json.success == 1) {
        _this.iscollection(plat_num_iid, 'N');
      }
    });
  },
  iscollection: function (plat_num_iid, types) {
    var _this = this;
    _this.data.prodgroup && _this.data.prodgroup.forEach(function (item, index) {
      if (item.plat_num_iid == plat_num_iid) {
        if (types == 'Y') {
          _this.data.prodgroup[index].pagecollectcnt = 1;
        } else {
          _this.data.prodgroup[index].pagecollectcnt = 0;
        }
        _this.setData({
          'prodgroup': _this.data.prodgroup,
        })
      }
    })
  },
  bindOrderBy: function (e) {
    var _this = this;
    this.closeDialog();
    var type = e.currentTarget.dataset.type;
    var order = e.currentTarget.dataset.order;
    console.log('bindOrderBy  e', e);
    var classnum = _this.data.prodtype;
    var num = _this.data.num;
    var currOrder = _this.data.currOrder;
    var orderby = '';
    if (type) {
      orderby += type;
    }
    if (currOrder.type == type && type != 'soldqty') {
      if (currOrder.order == 'up') {
        orderby += ' ' + 'desc';
        order = 'down';
      } else {
        orderby += ' ' + 'asc';
        order = 'up';
      }
    } else {
      if (type == 'soldqty') {
        orderby += ' ' + 'desc';
      } else {
        if (order == 'up') {
          orderby += ' ' + 'asc';
        } else {
          orderby += ' ' + 'desc';
        }
      }
    }


    console.log('bindOrderBy  orderby', orderby);
    if (!orderby || orderby == this.data.orderby || this.data.isLoading) { return false; }
    var ordertxt = '';
    switch (type) {
      case 'price':
        ordertxt = '价格';
        break;
      case 'soldqty':
        ordertxt = '销量';
        break;
      case 'uptime':
        ordertxt = '发布时间';
        break;
      default:
        ordertxt = type;
    }
    this.setData({
      currOrder: { ordertxt: ordertxt, type: type, order: order },
      orderby: orderby,
      isLoading: true,
    });
    wx.showLoading({ title: '正在加载...' });
    app.http.post('Mall/getTypeProds', { 'classnum': classnum, 'num': num, 'page': 1, orderby: orderby }, function (json) {
      wx.hideLoading();
      let data = json.data || [];
      _this.setData({
        'prodgroup': json.data,
        'prodtype': classnum,
        'num': num,
        'pageno': data.length < num ? 0 : 2,
        'isLoading': false,
      })
    });
  },
  changeDialog: function () {
    this.setData({ orderOpen: !this.data.orderOpen });
  },
  closeDialog: function () {
    this.setData({ orderOpen: false });
  },
};

Object.assign(pageObj, AddcartIns);
Page(pageObj);
