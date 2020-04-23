var dialog = require('../../utils/wig_dialog.js');
var AddcartIns = require('../../utils/wig_addcart.js');
var app = getApp();
//排序菜单
var menuList = [{ name: "新品", id: "new" },{ name: "价格", id: "price" },{ name: "销量", id: "sold" }];

let pageObj = {
  data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
    collection: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/collection.png',
    iscollection: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/collection2.png',
    car: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/car.png',
		menuList:menuList,
		currentId:'new',
    image_size:'S',
    hidden:true,
    tianimg: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon+'/weidianji.png',
    hengimg: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji1.png',
    tianimgs: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji.png',
    is_addcart_show:false,
    data_load: false,
    load_end: false,
    is_loading: false
  },
	onShow:function(){
    // this.showAddcart();
  },
  onLoad: function (options) {
    this.options=options;
		wx.setNavigationBarTitle({ title: '商品列表' });
		var _this = this;
		app.updateIconStyle(this);
		// //授权调用
		app.userLoginPromise
			.then(json => {
				//加载积分产品数据
        _this.fetchProds({ pagenum:1}, function(json){
        	console.log('fetchProds json',json);
          let prods = json['data']
          // 即时折扣是否开始
          
          _this.setData({
            'prods': json['data'] || [],
            'page': json.page || 1
          });
          
        });
			})
  },
  bindAddcart: function (e) {
    //调起购物车
    var pid = e.target.dataset.pid || '';
    if (!pid) {
      app.alertMsg('商品参数不存在');
      return false;
    }
    this.showAddcart(pid);
  },
  pailie:function(e){
    if (e.currentTarget.dataset.type == 'S') {
      var tianimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji.png';
      var hengimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji1.png';
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji.png';
      
    } else {

      var tianimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji.png';
      var hengimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji1.png';
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji1.png';
    }
    
    this.setData({
      image_size: e.currentTarget.dataset.type,
      tianimg: tianimg,
      hengimg: hengimg,
      hidden: true,
      tianimgs: tianimgs
    })
  },
  pailiehidden: function (e) {
    if (this.data.hidden && this.data.image_size=='S'){
      var hidd=false;
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji.png';
    } else if (this.data.hidden && this.data.image_size == 'L'){
      var hidd = false;
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji1.png';
    } else if (!this.data.hidden && this.data.image_size == 'S') {
      var hidd = true;
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji.png';
    } else if (!this.data.hidden && this.data.image_size == 'L') {
      var hidd = true;
      var tianimgs = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji1.png';
    } 
    if (this.data.image_size == 'S') {
      var tianimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji.png';
      var hengimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji1.png';

    } else {
      var tianimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/weidianji.png';
      var hengimg = app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/dianji1.png';
    }
    this.setData({
      hidden: hidd,
      tianimgs: tianimgs,
      tianimg: tianimg,
      hengimg: hengimg,
    })
  },
  // onReachBottom: function (e) {
  //   this.lower();
  // },
  lower: function (e) {
    //下拉加载更多
    var self = this;
    var new_page = parseInt(this.data.page) + 1;
    self.fetchProds({ 'pagenum': new_page}, function(json){
        var temp_prods = self.data.prods || [];
        json.data && json.data.forEach(function (item) {
          temp_prods.push(item);
        });
        self.setData({
          'prods': temp_prods,
          'page': json.page || new_page
        });
    });
  },
  fetchProds: function (post_data,callback){
    //读取产品分页
    var self = this;

    //正在加载
    if (self.data.is_loading){
      return false;
    }

    //加载结束
    if (self.data.load_end) {
      return false;
    }

    self.setData({
      'is_loading':true
    });
    //追加参数
    post_data.shop_id = self.options.shop_id || '';
    post_data.keyword = self.options.keyword || '';
    post_data.prodtype = self.options.prodtype || '';
    post_data.sortby = 'new';
    wx.showLoading();
    app.http.post('Prod/getprods', post_data, function (json) {
      wx.hideLoading();
      self.setData({
        'is_loading': false,
        'data_load':true,
        'load_end': json.load_end,
      });
      if (json.success == 1) {
        typeof callback === 'function' && callback(json);
      }else{
        app.alertMsg(json.msg);
      }
    })

  }
};
Object.assign(pageObj, AddcartIns);

Page(pageObj);