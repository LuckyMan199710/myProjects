// var BASE_URL = 'https://crm.93568.com.cn/index.php/MinWeiXin/';
// var STATIC_URL = 'https://crm.93568.com.cn/Public/';
// var compid = '1';

var cons = require('constant.js');
// var STATIC_URL = cons.STATIC_URL;
// var BASE_URL = cons.BASE_URL;
// var compid = cons.compid;

var ext_conf = wx.getExtConfigSync() || {};
if (ext_conf.comp_id) {
  cons.compid = ext_conf.comp_id;
}
if (ext_conf.styleicon) {
  cons.styleicon = ext_conf.styleicon;
}
if (ext_conf.color_primary) {
  cons.color_primary = ext_conf.color_primary;
}
if (ext_conf.color_second) {
  cons.color_second = ext_conf.color_second;
}
if (ext_conf.hostname) {
  cons.BASE_URL = 'https://' + ext_conf.hostname + '/index.php/MinWeiXinV2/';
}
if (ext_conf.staticname) {
  cons.STATIC_URL = 'https://' + ext_conf.staticname + '/Public/';
}

let defineds = {
  // icons: {
  //   'search': STATIC_URL + 'image/icons/search.png',
  //   'share': STATIC_URL + 'image/icons/share.png',
  //   'balance': STATIC_URL + 'image/icons/balance.png',
  //   'sign': STATIC_URL + 'image/icons/sign.png',
  //   'coupons': STATIC_URL + 'image/icons/coupons.png',
  //   'setting': STATIC_URL + 'image/icons/setting.png',
  //   'about': STATIC_URL + 'image/icons/about.png',
  //   'contact': STATIC_URL + 'image/icons/contact.png',
  //   'map': STATIC_URL + 'image/icons/map.png',
  //   'phone': STATIC_URL + 'image/icons/phone.png',
  //   'shop': STATIC_URL + 'image/icons/shop.png',
  //   'helper': STATIC_URL + 'image/icons/helper.png',
  //   'my': STATIC_URL + 'image/icons/my.png',
  //   'scan': STATIC_URL + 'image/icons/scan.png',
  //   'home_on': STATIC_URL + 'image/icons/home_on.png',
  //   'redpack': STATIC_URL + 'image/icons/redpack.png',
  // },
	// BASE_URL: BASE_URL,
	// STATIC_URL: STATIC_URL,
	// 'compid': compid
}
Object.assign(defineds,cons);
console.log(defineds);
console.log('DF是',defineds)
module.exports = defineds;
