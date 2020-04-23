// -----------KIKC版本---------------
// let static_url = 'https://scrm-kikc.oss-cn-shenzhen.aliyuncs.com/Public/'
// let iconstyle = 'black'
// let defineds = {
//   BASE_URL: 'https://scrm.kikc.com.cn/index.php/MinWeiXinV2/',
//   STATIC_URL: static_url,
//   'compid': 18,
//   'kikcExclusive': true, // 为true时代表 kikc专属排版,为空代表森威排版

// -----------麦寻版本---------------
// let static_url = 'https://scrm-oss.oss-cn-shenzhen.aliyuncs.com/Public/'
// let iconstyle = 'black'
// let defineds = {
//   BASE_URL: 'https://vip.senwell.cn/index.php/MinWeiXinV2/', 
//   STATIC_URL: static_url,
//   'compid': 15,
//   'kikcExclusive': false, // 为true时代表 kikc专属排版,为空代表森威排版

// -----------森威演示版本-------------
let static_url = 'https://scrmt.senwell.cn/Public/'
let iconstyle = 'black'
let defineds = {
  BASE_URL: 'https://scrmt.senwell.cn/index.php/MinWeiXinV2/',
  STATIC_URL: static_url,
  'compid': 1,
  'kikcExclusive': false, // 为true时代表 kikc专属排版,为空代表森威排版

// -----------亨奴版本-------------
  //  let static_url = 'https://scrm-oss.oss-cn-shenzhen.aliyuncs.com/Public/'
  //  let iconstyle = 'black'
  //  let defineds = {
  //  BASE_URL: 'https://vip.senwell.cn/index.php/MinWeiXinV2/',
  //  STATIC_URL: static_url,
  //  'compid': 11,
  //  'kikcExclusive': false, // 为true时代表 kikc专属排版,为空代表森威排版

  'styleicon': iconstyle,
  'color_primary': '#8f5e24',
  'color_second': '#8f5e24', 
  'navlist': [{
    'id': 0,
    'url': 'pages/mall/main',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/index.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/indexs.png',
    'title': '商城首页',
    'ontabpage': 'mall_main'
  }, {
    'id': 1,
    'url': 'pages/mall/classprods',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/class.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/classs.png',
    'title': '分类',
    'ontabpage': 'class_prods'
  }, {
    'id': 2,
    'url': 'pages/mall/information',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-information.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-informations.png',
    'title': '潮流资讯',
    'ontabpage': 'information'
  }, {
    'id': 3,
    'url': 'pages/buycar',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/cars.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/carss.png',
    'title': '购物车',
    'ontabpage': 'buycar'
  }, {
    'id': 4,
    'url': 'pages/main',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/center.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/centers.png',
    'title': '会员中心',
    'ontabpage': 'main'
  }, {
    'id': 5,
    'url': 'pages/myrevenue/main',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-profit.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-profits.png',
    'title': '分销商',
    'ontabpage': 'profit'
  }, {
    'id': 6,
    'url': 'pages/shop/list',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-nearby.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-nearbys.png',
    'title': '附近门店',
    'ontabpage': 'nearby'
  }, {
    'id': 7,
    'url': 'pages/mall/find',
    'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-find.png',
    'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-finds.png',
    'title': '发现',
    'ontabpage': 'find'
    }, {
      'id': 8,
      'url': 'pages/vip/exchange',
      'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-find.png',
      'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-finds.png',
      'title': '积分商城',
      'ontabpage': 'exchange'
    }, {
      'id': 9,
      'url': 'pages/trend/allworks',
      'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/icon-find.png',
      'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/icon-finds.png',
      'title': '我的潮拍',
      'ontabpage': 'allworks'
    }, {
      'id': 10,
      'url': 'pagesA/live/home',
      'imgUrl': static_url + 'wap/styleicon/' + iconstyle + '/liveWxh.png',
      'imgUrlHd': static_url + 'wap/styleicon/' + iconstyle + '/liveWxhs.png',
      'title': '直播',
      'ontabpage': 'liveWxh'
    }],
  // 0商城首页  1分类   2潮流资讯   3购物车   4会员中心   5分销商   6附近门店   7发现  8积分商城 9我的潮拍 10直播
  'bottomTheme': [
    [0, 1, 3, 4],    // 商城首页 分类 购物车 会员中心
    [0, 1, 2, 3, 4], // 商城首页 分类 潮流资讯 购物车 会员中心
    [0, 4, 2, 5, 6], // 商城首页 会员中心 潮流资讯 分销商 附近门店
    [0, 5, 2, 3, 4], // 商城首页 分销商 潮流资讯 购物车 会员中心
    [0, 1, 7, 3, 4]  // 商城首页 分类 发现 购物车 会员中心
  ],
  'mynavlist': []
}
module.exports = defineds;
