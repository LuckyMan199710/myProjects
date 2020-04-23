var app = getApp();
var wig_counter = require('../../utils/wig_counter.js');
var userRecord = require('../../utils/record.js');
var nav = require('../../utils/nav.js');
var AddcartIns = require('../../utils/wig_addcart.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var AppAction = nav(app);

var UserAction = userRecord(app);
var countDown = '', timer = null, timer2 = null
let PreheatTime = 30; // 预热前30分钟开始执行任务
import manba from '../../miniprogram_npm/manba/index.js'
let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    imgs: [],
    videos: [],
    indicatorDots: true,
    autoplay: false,
    circular: true,
    interval: 1000,
    duration: 300,
    winWidth: 320,
    has_zan: 0,
    has_collect: 0,
    navhidden: true,
    page_path: 'pages/mall/proddetail',
    swiper_play: true,
    poster_image: app.STATIC_URL + 'images/public.png',
    video_show: true,
    video_autoplay: true,
    video_index: 0,
    isClose: true,
    isDiscount: false, // false为未开始 true已开始
    formatcountDown: '', // 格式化
    zdycurskuid: '', //自定义的限时折扣字段
    remainingTime: '', //距离开始时间
    servertime: '',
    ispromo: false
    // startdate: '',
    // enddate: '',
    // startdates: '',
    // nowdates: ''
  },
  handleClose() {
    console.log('关闭')
    this.setData({
      is_addcart_show: false
    })
  },
  bindBuy: function (e) {
    if (!this.data.curskuid) { return false; }
    var curskuid = this.data.curskuid;
    var curbuyqty = this.data.wig_counter_data.num;
    var share_vipid = e.target.dataset.vid;
    var actiontype = 'buynow';
    this.showAddcart(curskuid['plat_num_iid'], actiontype, share_vipid, {
      'curbuyqty': curbuyqty,
      'curskuid': this.data.curskuid
    });
  },
  bindAddcart2: function (e) {
    if (!this.data.curskuid) { return false; }
    var curskuid = this.data.curskuid;
    var curbuyqty = this.data.wig_counter_data.num;
    var share_vipid = e.target.dataset.vid;
    var actiontype = 'cartnow';
    this.showAddcartNew(curskuid['plat_num_iid'], actiontype, share_vipid, {
      'curbuyqty': curbuyqty,
      'curskuid': this.data.curskuid
    });
    // this.getBuycarCount()
  },
  bindAddcart: function (e) {
    var share_vipid = e.target.dataset.vid;
    var _this = this;
    if (!this.data.curskuid) { return false; }
    var post_data = {
      'shop_id': this.data.prod.shop_id,
      'buyqty': this.data.wig_counter_data.num || 1,
      'plat_sku_iid': this.data.curskuid.plat_sku_iid,
      'plat_num_iid': this.data.curskuid.plat_num_iid,
      'share_vipid': share_vipid,
      'prod_promo': this.data.source_promo
    }
    console.log('bindAddcart  curskuid', this.data.curskuid);
    console.log('bindAddcart  post_data', post_data);


    wx.showLoading({ mask: true });
    app.http.post('Prod/addBuycart', post_data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        wx.showToast({ title: json.msg });
        _this.setData({
          'cartsum': json.sum
        });
        //加购物车
        UserAction.recordAddcart('PROD', _this.data.prod.shop_id, _this.data.plat_num_iid);
      } else {
        app.alertMsg(json.msg);
      }
    })
  },

  bindSkuid: function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetByskuid(this.__prodskudata, id);
    console.log('bindSkuid curskuid', curskuid);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },
  bindSku1: function (e) {
    var id = e.currentTarget.id;
    var sku2objs = this.getSku2BySku1(this.__prodskudata, id);
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, id, sku2objs[0]['spec_num']);
    console.log('bindSku1 curskuid', curskuid);
    this.setData({
      'sku2': sku2objs,
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },
  bindSku2: function (e) {
    var id = e.currentTarget.id;
    var curskuid = this.getSkuTargetBycolorspec(this.__prodskudata, this.data.curskuid['color_num'], id);
    console.log('bindSku2 curskuid', curskuid);
    this.setData({
      'curskuid': curskuid,
      'curbuyqty': 1
    });
  },

  onReady: function () {
    wx.setNavigationBarTitle({ title: '商品详情' });
  },
  onShow: function () {
  },
  onHide: function () {
    clearInterval(timer)
    clearInterval(timer2)
  },
  onUnload: function () {
    clearInterval(timer)
    clearInterval(timer2)
  },
  onLoad: function (options) {
    var _this = this;
    this.options = options
    app.updateIconStyle(this);
    _this.setData({
      'winWidth': app.globalData.sys_info.windowWidth
    })

    _this.getprodinfo()

  },
  getprodinfo() {
    let _this = this
    let options = this.options
    wx.showShareMenu({
      withShareTicket: true
    })

    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      var plat_num_iid = app.getQueryVariable(scene, 'plat_num_iid');
      if (plat_num_iid) {
        var source_promo = app.getQueryVariable(scene, 'source_promo') || '';
        var share_vipid = app.getQueryVariable(scene, 'share_vipid') || '';
        var keyword = app.getQueryVariable(scene, 'keyword') || '';
        var promo_num = app.getQueryVariable(scene, 'promo_num') || '';
      } else {
        var vars = scene.split("#");
        if (vars.length >= 2) {
          plat_num_iid = vars[0];
          var share_vipid = vars[1] || '';
          //console.log('proddetail  plat_num_iid&share_vipid:', plat_num_iid + '&'+share_vipid);
        }
      }
    } else {
      var plat_num_iid = options.plat_num_iid;
      var source_promo = options.source_promo || '';
      var share_vipid = options.share_vipid || '';
      var keyword = options.keyword || '';
      var promo_num = options.promo_num || '';
    }
    // var plat_num_iid = options.plat_num_iid;
    // var source_promo = options.source_promo || '';
    // var share_vipid = options.share_vipid || '';
    // var keyword = options.keyword || '';
    // var promo_num = options.promo_num || '';
    console.log('proddetail  options', options);
    if (!plat_num_iid) {
      app.alertMsg('产品参数不存在', {
        cb: app.goBack
      })
    }



    //授权调用
    app.userLoginPromise
      .then(json => {
        //加载积分产品数据
        app.http.post('Prod/getprodinfo', { 'plat_num_iid': plat_num_iid }, function (json) {
          console.log('getprodinfo json', json);
          console.log('getprodinfo plat_num_iid', plat_num_iid);
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
              var kk = 0;
              for (var i in json.videos) {
                json.videos[i] && json.videos[i]['video_url'] && temp_videos.push({ src: json.videos[i], mk: 'myvideo' + kk, play: false, show: true });
                kk++;
              }
            }
            var article = json.data.prod_content || '';
            WxParse.wxParse('article', 'html', article, _this, 5);
            console.log('temp_videos', temp_videos);
            _this.setData({
              'prod': json.data,
              'plat_num_iid': plat_num_iid,
              'has_zan': json.data.has_zan,
              'has_collect': json.data.has_collect,
              'imgs': imgs || [],
              'videos': temp_videos || [],
              'share_vipid': share_vipid,
              'source_promo': source_promo,
              'shop_info': json.shop_info,
              'gradedata': json.propdata,
              'video_show': temp_videos.length >= 1 ? true : false,
              'prod_display_mkprice': json.prod_display_mkprice || 'Y',
              'servertime': json.servertime

            });
            let datas = {
              'plat_num_iid': plat_num_iid
            }
            if (source_promo) {
              datas['promo_num'] = source_promo
            }
            //加载sku
            app.http.post('Prod/getProdSkus', datas, function (json) {
              console.log('getProdSkus json', json);
              if (json.success == 1) {
                if (!json.data) {
                  app.alertMsg('读取产品sku数据失败', {
                    cb: app.goBack
                  });
                  return false;
                }

                var skulvl = _this.getFormatSkuLvl(json.data);
                console.log('getFormatSkuLvl ', _this.getFormatSkuLvl);
                _this.__prodskudata = json.data;
                _this.__prodskujson = json
                console.log('skulvl 1112', skulvl);
                if (json.data[0] && json.data[0]['promo_z'] && Object.keys(json.data[0]['promo_z']).length > 0) {
                  _this.setData({
                    ispromo: true
                  })
                  // 即时折扣是否开始
                  let startdate = json.data[0]['promo_z'].startdate ? json.data[0]['promo_z'].startdate.replace(/-/g, '/') : ''

                  let enddate = json.data[0]['promo_z'].enddate ? json.data[0]['promo_z'].enddate.replace(/-/g, '/') : ''
                  ///let nowTime = new Date().getTime()
                  let nowTime = _this.data.servertime ? new Date(_this.data.servertime.replace(/-/g, '/')).getTime() : ''
                  console.log('------------------', nowTime)
                  // 未开始
                  if (new Date(startdate).getTime() > nowTime) {
                    let remainingTime = parseInt(new Date(startdate).getTime() - nowTime)
                    // 如果临近开始折扣活动时，执行定时任务
                    if (remainingTime <= PreheatTime * 60000) {
                      _this.funremaining()
                    }
                    _this.setData({
                      isDiscount: false,
                      remainingTime: remainingTime
                    })
                  } else if (new Date(startdate).getTime() < nowTime && nowTime < new Date(enddate).getTime()) {

                    countDown = new Date(enddate).getTime() - nowTime
                    console.log('countDown:::::::::::', countDown)
                    _this.funcountDown()
                    _this.setData({
                      isDiscount: true,
                      formatcountDown: _this.getdown(countDown)
                    })
                  }
                  json.data[0]['promo_z'].startMonthDay = manba(startdate).format('MM月DD日')
                  json.data[0]['promo_z'].endMonthDay = manba(enddate).format('MM月DD日')

                  json.data[0]['promo_z'].startTime = manba(startdate).format('hh:mm:ss')
                  json.data[0]['promo_z'].endTime = manba(enddate).format('hh:mm:ss')
                }
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
                _this.setData({
                  zdycurskuid: json.data[0]
                })

                _this.getRelativeProd();


              } else {
                app.alertMsg('加载失败', { cb: app.goBack });
              }

            });

            //记录推荐人vipid
            if (share_vipid) {
              _this.logVipFriend(share_vipid);
            }
            //访问记录
            UserAction.recordPageView('PROD', _this.data.prod.shop_id, plat_num_iid);
            //搜索记录
            if (keyword) {
              UserAction.recordSearch('PROD', _this.data.prod.shop_id, plat_num_iid, keyword);
            }
          }
        });
        _this.getBuycarCount();
      })
  },
  getdown(time) {
    var day = parseInt((time / (1000 * 60 * 60 * 24)));
    var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (time % (1000 * 60)) / 1000;
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds
    var timestr=0;
    if (day >= 1) {
      timestr = day + '天 '
      timestr += hours + ':' + minutes + ':' + seconds
    }else{
      timestr = hours + ':' + minutes + ':' + seconds
    }
    return timestr
  },

  getDay(days) {
    let time = parseInt(days / (1000 * 60 * 60 * 24))
    if (time == 0) {
      return ''
    } else if (time < 10) {
      time = time
    }
    return parseInt(days / (1000 * 60 * 60 * 24)) + '天 '
  },
  funremaining() {
    let _this = this
    let remainingTime = this.data.remainingTime
    timer2 = setInterval(function () {
      remainingTime = remainingTime - 1000
      console.log(remainingTime)
      if (remainingTime < 0) {
        _this.getprodinfo()
        clearInterval(timer2)
      }
    }, 1000)
  },
  // 倒计时
  funcountDown() {
    let _this = this
    timer = setInterval(function () {
      countDown = countDown - 1000
      if (countDown < 0) {
        clearInterval(timer)
      }
      _this.setData({
        formatcountDown: _this.getdown(countDown)
      })
    }, 1000)
  },
  bannerImgTap: function (e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src;
    let img_arr = []
    for (let i = 0; i < that.data.imgs.length; i++) {
      img_arr.push(that.data.imgbase + that.data.imgs[i])
    }
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: img_arr // 需要预览的图片http链接列表
    })
  },
  detailImg: function (e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src;
    let img_arr = []
    img_arr.push(nowImgUrl)
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: img_arr // 需要预览的图片http链接列表
    })
  },
  bindpause: function (e) {
    console.log('54545');
    this.enterPlay(e, 'pause');
  },
  bindended: function (e) {
    console.log('54545')
    console.log('bindended  e', e);
    this.enterPlay(e, 'ended');
  },
  bindposter: function (e) {
    console.log('bindposter  e', e);
    var _this = this;
    let videos = this.data.videos;
    let swiper_play = this.data.swiper_play;
    let src = e.currentTarget.dataset.src;
    let poster = e.currentTarget.dataset.poster;
    let index = e.currentTarget.dataset.index;
    this.setData({ swiper_play: !swiper_play, video_show: true, video_autoplay: true, video_index: index });

    //	  var _this = this;
    //	  let videos = this.data.videos;
    //	  let mk = e.currentTarget.dataset.mk;
    //	  videos && videos.forEach(function(item,index){
    //		  console.log('item',item);
    //		  if(item.mk == mk){
    //			  videos[index]['show'] = false;
    //			  videos[index]['play'] = true;
    //		  }
    //	  });
    //	  console.log('bindposter  videos',videos);
    //	  let swiper_play = this.data.swiper_play;
    //	  console.log('bind_swiper  swiper_play',swiper_play);
    //	  this.setData({swiper_play:!swiper_play,videos:videos});
    //	  
    //	  setTimeout(function(){
    //		  _this.videoPlay(mk);
    //	  },500);
  },
  videoPlay: function (id) {
    if (!this.data.playId) {
      var videoContext = wx.createVideoContext(id)
      videoContext.play();
      this.setData({ playId: id });
    } else {
      var videoContextPrev = wx.createVideoContext(this.data.playId);
      videoContextPrev.seek(0);
      videoContextPrev.pause();
      this.setData({ playIndex: id });
      var videoContextCurrent = wx.createVideoContext(id);
      videoContextCurrent.play();

    }


  },
  enterPlay: function (e) {
    this.setData({ swiper_play: true, video_show: false });
    //视频播放停止，进行图片轮播
    //	  let videos = this.data.videos;
    //	  let mk = e.currentTarget.dataset.mk;
    //	  videos && videos.forEach(function(item,index){
    //		  if(item.mk == mk){
    //			  videos[index]['show'] = true;
    //			  videos[index]['play'] = false;
    //		  }
    //	  });
    //	  console.log('bindended  videos',videos);
    //	  this.setData({swiper_play:true,videos:videos});
  },
  //收藏、点赞
  bindUserAction: function (e) {
    var type = e.currentTarget.id;
    var shopid = this.data.prod.shop_id;
    var plat_num_iid = this.data.plat_num_iid;
    var _this = this;
    if (type == 1) {
      UserAction.recordZan('PROD', shopid, plat_num_iid, (json) => {
        if (json.success == 1) {
          _this.setData({ 'has_zan': 1 })
        }
      });
    }
    if (type == 3) {
      UserAction.recordCollect('PROD', shopid, plat_num_iid, (json) => {
        if (json.success == 1) {
          _this.setData({ 'has_collect': 1 })
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
      var share_path = '/pages/mall/proddetail?plat_num_iid=' + plat_num_iid + '&share_vipid=' + vip_info.vip_id;
    } else {
      var share_path = '/pages/mall/proddetail?plat_num_iid=' + plat_num_iid;
    }
    if (promo_num) {
      share_path = share_path + '&promo_num=' + promo_num;
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
  getRelativeProd: function () {
    var _this = this;
    app.http.post('Prod/getRelativeProds', { 'plat_num_iid': this.data.plat_num_iid }, function (json) {
      _this.setData({
        'relativeprods': json.data
      })
    })
  },
  getBuycarCount: function () {
    var _this = this;
    app.http.post('Prod/getBuycartCount', {}, function (json) {
      _this.setData({
        'cartsum': json.sum
      })
    })
  },
  getSku2BySku1: function (data, skul_num) {
    var tempdata = [];
    data.forEach(function (item) {
      if (item.color_num == skul_num) {
        tempdata.push(item);
      }
    });
    return tempdata;
  },
  getSkuTargetBycolorspec(data, color_num, spec_num) {
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
  closeMarkShare: function (e) {
    console.log('closeMarkShare  e', e);
    this.setData({ groupvisit: false });
  },
  bindBargainVisit: function (e) {
    console.log('bindBargainVisit  e', e);
    var self = this;
    if (!this.data.curskuid) { return false; }
    var plat_num_iid = this.data.plat_num_iid;
    if (!plat_num_iid) {
      return false;
    }
    self.setData({ group_success: false });
    //return false;
    wx.showLoading();
    app.http.post('Mall/pageQrCode', { 'group_id': plat_num_iid, type: 'vipshareprod' }, function (json) {
      console.log('pageQrCode  json', json);
      if (json.success == 1) {
        var qrcode_url_source = self.data.imgbase + json.data;
        console.log(qrcode_url_source);
        //下载二维码
        wx.downloadFile({
          url: qrcode_url_source,
          success: (res) => {
            console.log('downloadFile res', res);
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
  // 绘制固定宽高的不变形的图片(保证短边全部显示出来)
  /**
   * @param {Object} ctx   canvas对象
   * @param {String} initX 绘制图片起始x坐标
   * @param {String} initY 绘制图片起始y坐标
   * @param {String} width 绘制图片的宽度
   * @param {String} height 绘制图片的高度
   * @param {String} drawImg 绘制图片的url
   * @param {String} scale 原图的宽高比例(宽/高)
   * 
   */
  aspectFillImg: function (ctx, initX, initY, width, height, drawImg, scale) {
    ctx.beginPath()
    ctx.save()
    ctx.rect(initX, initY, width, height)
    ctx.clip()
    if (scale > width / height) {
      ctx.drawImage(drawImg, initX - (height * scale - width), initY, width * scale, height)
    } else {
      ctx.drawImage(drawImg, initX, initY + (width / scale - height), width, height / scale)
    }
    ctx.restore()
  },
  canvasTextAutoLine: function (str, canvas, initX, initY, lineHeight, canvasWidth, lines, fontSize = 28, color =
    '#000000', align = 'left') {
    var lineWidth = 0;
    var lastSubStrIndex = 0;
    var beginLineHeight = lineHeight;
    var beginY = initY + lineHeight;
    var initY = initY + lineHeight;
    var ctx = canvas;
    if (str) {
      var str = str.toString()
    } else {
      var str = ''
    }
    var textAlign = align
    return new Promise(resolve => {

      canvas.setFontSize(fontSize)
      canvas.setFillStyle(color)
      canvas.textAlign = textAlign;
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        // console.log(lineWidth)
        if (textAlign == 'right') {
          if (lineWidth > canvasWidth - initX && canvasWidth) { //减去initX,防止边界出现的问题
            if (initY >= beginY + beginLineHeight * (lines - 1)) {
              ctx.fillText(str.substring(lastSubStrIndex, i - 1) + '...', initX, initY);
              resolve(canvasWidth - initX)
              return
            } else {
              ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
          }
        } else {
          if (lineWidth > canvasWidth - initX && canvasWidth) { //减去initX,防止边界出现的问题
            if (initY >= beginY + beginLineHeight * (lines - 1)) {
              ctx.fillText(str.substring(lastSubStrIndex, i - 1) + '...', initX, initY);
              resolve(canvasWidth)
              return
            } else {
              ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
          }
        }

        if (i == str.length - 1) {
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
          resolve(ctx.measureText(str).width)
        }
      }
    })
  },
  //画图
  drawImage: function () {
    var self = this;
    console.log('drawImage');
    const wxGetImageInfo = app.promisify(wx.getImageInfo);
    let prod_img = self.data.prod.pic_main || self.data.imgs[0];

    self.scale = 1
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
        src: self.data.imgbase + ('share_bg.jpg')
      }),
      wxGetImageInfo({
        src: self.data.imgbase + prod_img
      }),
      wxGetImageInfo({
        src: self.pageQrcodeFile
      })
    ]).then(res => {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: res[1].path,
          success(r) {
            self.scale = r.width / r.height
            resolve(res)
          }
        })
      })
    }).then(res => {
      console.log('drawImage  res', res);
      const ctx = wx.createCanvasContext('shareCanvas')
      // 底图
      ctx.drawImage(res[0].path, 0, 0, 275, 400)
      self.aspectFillImg(ctx, 25, 40, 225, 225, res[1].path, self.scale)
      //产品主图


      // 作者名称
      //        ctx.setTextAlign('center')    // 文字居中
      //        ctx.setFillStyle('#000000')  // 文字颜色：黑色
      //        ctx.setFontSize(14)         // 文字字号：22px
      //        ctx.fillText("作者：一斤代码", 150, 360)
      // 限时折扣
      if (self.data.curskuid['promo_z']) {
        self.canvasTextAutoLine(self.data.curskuid['promo_z']['discount'] + '折', ctx, 25, 245, 60, 75, 1, 14, '#f23030');
        if (self.data.curskuid['promo_z']['isstart']) {
          self.canvasTextAutoLine(self.data.curskuid['promo_z']['enddate'] + '结束', ctx, 70, 245, 60, 255, 1, 14, '#333333');
        } else {
          self.canvasTextAutoLine(self.data.curskuid['promo_z']['startdate'] + '开始', ctx, 70, 245, 60, 255, 1, 14, '#333333');
        }

      }
      // self.canvasTextAutoLine('2折', 
      // ctx, 25, 245, 60, 200, 1, 14, 'red');
      // (str, canvas, initX, initY, lineHeight, canvasWidth, lines, fontSize = 28, color =
      //   '#000000', align = 'left')
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
      var saleprice = 0;
      if (self.data.curskuid['promo_z'] && self.data.curskuid['promo_z']['isstart']) {
        saleprice = self.data.curskuid['promo_z']['saleprice'];
      } else {
        saleprice = self.data.curskuid.price;
      };
      var fill_saleprice = '售价： ';
      ctx.fillText(fill_saleprice, FROM_X, last_y + 30, 50)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#e10601')
      ctx.setFontSize(16)
      ctx.fillText('￥' + saleprice, 145, last_y + 30, 50)
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
      self.setData({ groupvisit: true });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.log('drawImage err', err);
    });
  },
  //保存图片到相册
  savePhoto: function (e) {
    let self = this;
    const wxCanvasToTempFilePath = app.promisify(wx.canvasToTempFilePath);
    const wxSaveImageToPhotosAlbum = app.promisify(wx.saveImageToPhotosAlbum);

    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      console.log('savePhoto   res001', res);
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      console.log('savePhoto   res002', res);
      wx.showToast({
        title: '已保存到相册'
      });
      // self.recordGroupShare();
      self.setData({ groupvisit: false });
    }).catch(err => {
      console.log('保存相册失败   err', err);
      //app.alertMsg("保存到相册失败");
      if (err.errMsg.indexOf("saveImageToPhotosAlbum:fail") > -1) {
        // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
        wx.showModal({
          title: '提示',
          content: '需要您授权保存相册',
          showCancel: false,
          success: modalSuccess => {
            wx.openSetting({
              success(settingdata) {
                console.log("settingdata", settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  wx.showModal({
                    title: '提示',
                    content: '获取权限成功,再次点击图片即可保存',
                    showCancel: false,
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '获取权限失败，将无法保存到相册哦~',
                    showCancel: false,
                  })
                }
              },
              fail(failData) {
                console.log("failData", failData)
              },
              complete(finishData) {
                console.log("finishData", finishData)
              }
            })
          }
        })
      }

    });
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