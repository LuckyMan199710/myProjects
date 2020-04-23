var defineds = require('defineds.js');
var REST_BASE = defineds.BASE_URL;
var request_flag = {};
var http = {
  fetch: function (url, data, callback) {
    let phpsessid = wx.getStorageSync('PHPSESSID');
    let utoken = wx.getStorageSync("utoken");
    let weixinid = wx.getStorageSync("weixinid");

    var header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (phpsessid) {
      header['Cookie'] = 'PHPSESSID=' + phpsessid;
    }

    data['phpsessid'] = phpsessid;
    data['weixinid'] = weixinid;//识别哪个品牌
    data['comp_id'] = defineds.compid;//识别公司
    if (utoken) {
      data['utoken'] = utoken;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: REST_BASE + url + '?comp_id=' + defineds.compid + '&utoken=' + wx.getStorageSync("utoken"),
        method: 'GET',
        data: data,
        header: header,
        success: function (res) {
          if (typeof res.data == 'object') {
            callback && callback(res.data);
            resolve(res.data);
          } else {
            console.log('调用请求失败   url：', REST_BASE + url);
            //服务器代码有错
            wx.showModal({
              title: '网络繁忙，请稍后',
              showCancel: false,
              complete: function (res) { }
            })
            reject(res);
          }
        }
      })
    })
  },
  post: function (url, data, callback) {
    let phpsessid = wx.getStorageSync('PHPSESSID') || '';
    let utoken = wx.getStorageSync("utoken") || '';
    let weixinid = wx.getStorageSync("weixinid") || '';

    var header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (phpsessid) {
      header['Cookie'] = 'PHPSESSID=' + phpsessid;
    }

    data['phpsessid'] = phpsessid;
    data['weixinid'] = weixinid;//识别哪个品牌
    data['comp_id'] = defineds.compid;//识别公司
    if (utoken) {
      data['utoken'] = utoken;
    }
    console.log('data::::::::::::::::', data)
    return new Promise((resolve, reject) => {
      wx.request({
        url: REST_BASE + url,
        data: data,
        method: 'POST',
        header: header,
        success: function (res) {
          console.log('request  res', res);
          // 删除fail标志
          if (request_flag.hasOwnProperty(url)) {
            delete request_flag[url];
          }

          if (typeof res.data == 'object') {
            if (phpsessid == "" || phpsessid == null || !phpsessid) {
              wx.setStorageSync('PHPSESSID', res.data.phpsessid)
            }
            callback && callback(res.data);
            resolve(res.data);
          } else {
            console.log('调用请求失败   url：', REST_BASE + url);
            //服务器代码有错
            wx.showModal({
              title: '访问人数过多，请稍后',
              showCancel: false,
              complete: function (res) { }
            })
            reject(res);
          }
        },
        fail: function (res) {
          //      				wx.showModal({
          //      					title: '系统暂时无法提供服务',
          //      					showCancel: false,
          //      					complete: function (res) {}
          //      				})

          if (request_flag.hasOwnProperty(url)) {
            delete request_flag[url];

            wx.showModal({
              title: "服务信息超时，请稍候再试",
              showCancel: false,
              complete: function (res) { }
            });

            return;
          }
          request_flag[url] = 1;
          http.post(url, data, callback);
          reject(res);
        }
      });
    });



    //    return wx.request({
    //      url: REST_BASE + url,
    //      data: data,
    //      method: 'POST',
    //      header: header,
    //      success: function (res) {
    //    	  console.log('request  res',res);
    //	    	// 删除fail标志
    //	          if (request_flag.hasOwnProperty(url)) {
    //	            delete request_flag[url];
    //	          }
    //	          
    //				if (typeof res.data == 'object'){
    //					if (phpsessid == "" || phpsessid == null || !phpsessid ) {
    //						wx.setStorageSync('PHPSESSID', res.data.phpsessid)
    //					}
    //					callback(res.data);
    //				}else{
    //					console.log('调用请求失败   url：',REST_BASE + url);
    //					//服务器代码有错
    //					wx.showModal({
    //						title: '调用失败,请联系管理员',
    //						showCancel: false,
    //						complete: function (res) { }
    //					})
    //				}
    //      },
    //			fail:function(res){
    ////				wx.showModal({
    ////					title: '系统暂时无法提供服务',
    ////					showCancel: false,
    ////					complete: function (res) {}
    ////				})
    //				
    //				if (request_flag.hasOwnProperty(url)) {
    //		            delete request_flag[url];
    //
    //		            wx.showModal({
    //		              title: "服务信息超时，请稍候再试",
    //		              showCancel: false,
    //		              complete: function(res) {}
    //		            });
    //
    //		            return;
    //		          }
    //		          request_flag[url] = 1;
    //		          http.post(url,data, callback);
    //			}
    //    });

  }
  // api_post:function(url,data){
  // 	let phpsessid = wx.getStorageSync('PHPSESSID');
  // 	let utoken = wx.getStorageSync("utoken");
  // 	let weixinid = wx.getStorageSync("weixinid");
  // 	var header = {
  // 		'Content-Type': 'application/x-www-form-urlencoded'
  // 	}
  // 	if (phpsessid) {
  // 		header['Cookie'] = 'PHPSESSID=' + phpsessid;
  // 	}
  // 	data['phpsessid'] = phpsessid;
  // 	data['weixinid'] = weixinid;//识别哪个品牌
  // 	data['comp_id'] = defineds.compid;//识别公司
  // 	if (utoken) {
  // 		data['utoken'] = utoken;
  // 	}
  // 	return new Promise((resolve, reject) => {
  // 		wx.request({
  // 			url: REST_BASE + url,
  // 			data: data,
  // 			method: 'POST',
  // 			header: header,
  // 			success: function (res) {
  // 				if (typeof res.data == 'object') {
  // 					if (phpsessid == "" || phpsessid == null || !phpsessid) {
  // 						wx.setStorageSync('PHPSESSID', res.data.phpsessid)
  // 					}
  // 					callback(res.data);
  // 				} else {
  // 					//服务器代码有错
  // 					wx.showModal({
  // 						title: '调用失败,请联系管理员',
  // 						showCancel: false
  // 					})
  // 				}
  // 			},
  // 			fail: function (res) {
  // 				wx.showModal({
  // 					title: '系统暂时无法提供服务',
  // 					showCancel: false
  // 				})
  // 			}
  // 		});
  // 	});
  // }
}

module.exports = http;