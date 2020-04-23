var defineds = require('utils/defineds.js');
var http = require('utils/http.js');
//获取用户信息
var getUserInfoFunc = function (callback) {
  //	wx.getUserInfo({
  //		lang:'zh_CN',
  //		success: function (info) {
  //			callback(info);
  //		},
  //    fail:function(res){
  //      wx.hideLoading();
  //      wx.showModal({
  //        title: '请授权后使用',
  //        showCancel:false,
  //        success:function(){
  //          wx.openSetting({
  //            success: (res) => {
  //              getUserInfoFunc(callback);
  //            }
  //          })
  //        }
  //      })
  //    }
  //	});
  callback()
  // if (wx.canIUse('getUserInfo')) {
  //   wx.getUserInfo({
  //     lang: 'zh_CN',
  //     success: function (res) {

  //       console.log('getUserInfoFunc  res', res);
  //       wx.setStorageSync('userinfo', res);

  //       callback && callback(res);



  //     },
  //     fail: function (res) {

  //       console.log('getUserInfo  res', res);
  //       //
  //       //if(res.errMsg != 'getUserInfo:fail scope unauthorized'){
  //       // wx.navigateTo({ url: "/pages/userauth" });
  //       //}
  //     }
  //   });
  // } else {
  //   //弹出授权申请窗口
  //   console.log('getUserInfo  nocan');
  //   // wx.navigateTo({ url: "/pages/userauth" });
  // }
}

App({
  onLaunch: function (option) {
    //每次启动清除经纬度
    wx.removeStorageSync('lat');
    wx.removeStorageSync('lng');
    // wx.setStorageSync('template_id', 1);
    

    // 检查更新最新版
    this.updateDesc()

    var option_query = option.query;
    //option_query.weixinid = 'a9b7ba70783b617e9998dc4dd82eb3c5';
    // console.log(option);
    //识别从哪里来
    let weixinid = option_query.weixinid || '';
    wx.setStorageSync('weixinid', weixinid);

    var sys_info = wx.getSystemInfoSync();
    this.globalData.sys_info = sys_info;
    // console.log(sys_info);
    // wx.removeStorageSync('PHPSESSID');//该移除还是？
    this.userLoginPromise = this.getUserDataToken(weixinid);
  },
  updateDesc: function() {
    // 更新新版本提示
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                  // wx.clearStorageSync();
                  wx.removeStorageSync('lat');
                  wx.removeStorageSync('lng');
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  checkUserStatus: function (callback) {
    this.userLoginPromise.then(() => {
      var vip_info = wx.getStorageSync('vip_info');
      if (vip_info) {
        //已经是会员
        callback();
      } else {
        //判断是否需要激活会员卡
        if (this.globalData.ref_appid == 'wxeb490c6f9b154ef9' && this.globalData.vipcard_extraData) {
          //如果激活成功则继续执行回调
          this.activeUserCard(function () {
            callback();
          });
          delete this.globalData.ref_appid;
          return false;
        }
        if (this.globalData.ref_appid == 'wxeb490c6f9b154ef9') {
          //开卡不填写，直接返回
          delete this.globalData.ref_appid;
          this.alertMsg('请注册后使用', {
            cb: this.goBack
          })
          return false;
        }
      }
    });
  },
  checkUserStatusByHand: function (callback) {
    console.log('checkUserStatusByHand');
    this.userLoginPromise.then(() => {

      var vip_info = wx.getStorageSync('vip_info');
      console.log('checkUserStatusByHand  vip_info', vip_info);
      if (vip_info) {
        //已经是会员
        callback();
      } else {
        //判断是否需要激活会员卡
        if (this.globalData.ref_appid == 'wxeb490c6f9b154ef9' && this.globalData.vipcard_extraData) {
          //如果激活成功则继续执行回调
          this.activeUserCard(function () {
            callback();
          });
          delete this.globalData.ref_appid;
          return false;
        }
        if (this.globalData.ref_appid == 'wxeb490c6f9b154ef9') {
          //开卡不填写，直接返回
          delete this.globalData.ref_appid;
          this.alertMsg('请注册后使用', {
            cb: this.goBack
          })
          return false;
        }
        //非会员也执行
        callback();
      }
    });
  },
  /**
   * 将用户授权的微信公开信息记录到后台,进行解密生成会员
   */
  decryptUserInfo: function (info, callback) {
    console.log('decryptUserInfo');
    console.log(info);
    var _this = this;
    http.post('Login/authUserWxInfo', info, (json) => {
      console.log('Login/authUserWxInfo');
      console.log(json);
      if (json.success == 1) {
        //会员的数据
        //this.globalData.vip_info = json['vip_info'];
        wx.setStorageSync('vip_info', json.vip_info || '');
        wx.setStorageSync('comp_info', json.comp_info || '');
        wx.setStorageSync('user_auth', true);
        //this.userLoginPromise.then(()=>{
        console.log('授权成功，回调');
        typeof callback === 'function' && callback();
        //});

      } else {
        this.alertMsg(json.msg);
      }
    })
  },
  getUserDataToken: function (weixinid) {
    var _this = this;
    console.log('getUserDataToken weixinid', weixinid);
    return new Promise((resolve, reject) => {
      let utoken = wx.getStorageSync("utoken");
      console.log('getUserDataToken  utoken', utoken);
      let userLogin = function () {

        var wxphone = wx.getStorageSync('wxphone');
        wx.clearStorageSync();

        //保留解密后的手机号
        wx.setStorageSync('wxphone', wxphone);

        //保留weixinid
        wx.setStorageSync('weixinid', weixinid);
        wx.login({
          success: function (res) {
            //获取用户信息
            //						getUserInfoFunc(function (info) {
            //							//写入缓存
            //							wx.setStorageSync('userinfo', info.userInfo);
            //							var data = {
            //								"code": res.code,
            //								"rawData": info.rawData,
            //								"signature": info.signature,
            //								'iv': info.iv,
            //								'encryptedData': info.encryptedData
            //							};
            //							http.post('Login/wxLogin', data, function (json) {
            //								if (json.success == 1) {
            //									wx.setStorageSync('utoken', json.utoken);
            //									wx.setStorageSync('vip_info', json.vip_info);
            //									console.log('post wx login ok');
            //									resolve();
            //								} else {
            //									console.log('post wx login wrong'+json.msg);
            //									_this.alertMsg(json.msg);
            //									reject(json.msg);
            //								}
            //							});
            //						})
            var data = { 'code': res.code };
            http.post('Login/wxLogin', data, function (json) {
              console.log('wxLogin  data', data);
              console.log('wxLogin  json', json);
              if (json.success == 1) {
                wx.setStorageSync('utoken', json.utoken);
                wx.setStorageSync('PHPSESSID', json.phpsessid);
                wx.setStorageSync('vip_info', json.vip_info || '');
                wx.setStorageSync('comp_info', json.comp_info || '');
                _this.myBottomList().then(res => {
                  return _this.setNavlist(res)
                  // return res
                }).then(res => {
                  _this.setTemplate(res)
                })
                let userinfo = wx.getStorageSync('userinfo');
                console.log('post wx login ok');
                console.log('json', json);
                console.log('userinfo', userinfo);


                // _this.updateIconStyle();

                //用户信息
                // getUserInfoFunc(function (info) {
                //   console.log('getUserInfoFunc1122', info);

                //   _this.decryptUserInfo(info, () => {
                //     //this.goBack();

                //   });
                // });
                if (json.is_werunsync === 'Y') {//是否异步更新微信运动
                  wx.getWeRunData({
                    success(res) {
                      var info = {
                        encryptedData: res.encryptedData,
                        iv: res.iv
                      }
                      http.post('Login/saveWeRunData', info, (json) => {
                        console.log(json)
                      })
                    }
                  })
                }
                // wx.getWeRunData({
                //   success(res) {
                //     var info = {
                //       encryptedData: res.encryptedData,
                //       iv: res.iv
                //     }
                //     http.post('Login/saveWeRunData', info, (json) => {
                //       console.log(json)
                //     })
                //   }
                // })
                resolve();
              } else {
                console.log('post wx login wrong' + json.msg);
                _this.alertMsg(json.msg);
                reject(json.msg);
              }
            });

          },
          fail: function (res) {
            _this.alertMsg('微信登陆授权失败,请关闭微信后重试');
            reject('wx.login失败');
          }
        });
      }
      wx.setStorageSync('user_auth', false);
      console.log('检查token及登录态');
      //检查token及登录态
      if (!utoken) {
        userLogin();
      } else {
        //检查登陆态
        wx.checkSession({
          success: function (res) {
            //session 未过期，并且在本生命周期一直有效
            // console.log('checksession ok');
            var user_wx_data = wx.getStorageSync('userinfo');
            console.log('user_wx_data', user_wx_data);
            if (user_wx_data) {
              http.post('Login/getTokenStatus', { 'user_wx_info': JSON.stringify(user_wx_data) }, function (json) {
                console.log('getTokenStatus json', json);
                if (json.success == 1) {
                  //写会员信息缓存
                  wx.setStorageSync('vip_info', json.vip_info || '');
                  wx.setStorageSync('comp_info', json.comp_info || '');
                  wx.setStorageSync('user_auth', true);
                  resolve();
                } else {
                  console.log('server token fail');
                  userLogin();
                }
              });

              //resolve();
            } else {
              userLogin();
            }
          },
          fail: function () {
            userLogin();
          }
        })
      }
    })
  },
  jumpToMainPage: function () {
    wx.reLaunch({
      url: '/pages/main',
    })
  },
  myBottomList: function () {
    return new Promise((resolve, reject) => {
      let _this = this
      const templateDate = wx.getStorageSync('mytemplate')
      if (templateDate.length) {
        resolve(templateDate)
      } else {
        http.fetch('Mall/getTemplateId', {}, function (json) {
          if (json.success == 1) {
            const templateId = json.tmeplate
            //const templateId = 0;
            const template_control=json.template_control
           // const template_control = ["0", "1", "10", "5", "4"];
            let template = ''
            if (templateId === 0 || templateId === '') {
              if (template_control.length > 0) {
                template = template_control
              } else {
                template = 1
              }
            } else if (templateId > 0) {
              template = templateId
            }
            wx.setStorageSync('mytemplate', template)
            wx.setStorageSync('ooo', 1)
            resolve(template)
          } else {
            reject()
          }
        })
        
      }
    })
  },
  setNavlist(res){
    let comp_info = wx.getStorageSync('comp_info');
    if (comp_info.iconstyle) {
      defineds.styleicon = comp_info.iconstyle
      defineds.navlist.forEach(item => {
        item.imgUrl = item.imgUrl.replace(/brown/g, comp_info.iconstyle)
        item.imgUrlHd = item.imgUrlHd.replace(/brown/g, comp_info.iconstyle)
      })
    }
    return res
  },
  setTemplate(template){
    let arr = defineds.bottomTheme
    let brr = []
    // if (defineds['mynavlist'].length === 0) {
    //   for (let i = 0; i < arr[0].length; i++) {
    //     let j = arr[0][i]
    //     defineds['mynavlist'].push(defineds.navlist[j])
    //   }
    // }
    console.log('template:::', template)
    if (Array.isArray(template)) {
      if (defineds['mynavlist'].length === 0) {
        brr = template.map(item => {
          return defineds.navlist[parseInt(item)]
        })
        defineds['mynavlist'] = [...brr]
        return defineds['mynavlist']
      }
    } else {
      let templateId = template - 1
      if (defineds['mynavlist'].length === 0 && templateId > -1) {
        for (let i = 0; i < arr[templateId].length; i++) {
          let j = arr[templateId][i]
          defineds['mynavlist'].push(defineds.navlist[j])
        }
        return defineds['mynavlist']
      }
    }
  },
  updateIconStyle: function (page = null) {
    let comp_info = wx.getStorageSync('comp_info');
    if (comp_info) {
      if (comp_info.comp_id) {
        defineds.compid = comp_info.comp_id;
      }
      

      if (comp_info.color_num) {
        defineds.color_primary = comp_info.color_num;
      }
      if (comp_info) {
        defineds.color_second = comp_info.color_num2;
      }
      page && page.setData({ base_conf: defineds });
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: defineds.color_primary });
    } else {
      this.userLoginPromise.then(() => {
        let comp_info = wx.getStorageSync('comp_info');
        console.log('updateCompinfo 0001 defineds', defineds);
        if (comp_info) {
          if (comp_info.comp_id) {
            defineds.compid = comp_info.comp_id;
          }
          if (comp_info.iconstyle) {
            defineds.styleicon = comp_info.iconstyle;
          }
          if (comp_info.color_num) {
            defineds.color_primary = comp_info.color_num;
          }
          if (comp_info.color_num2) {
            defineds.color_second = comp_info.color_num2;
          }       
          page && page.setData({ base_conf: defineds });
          wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: defineds.color_primary });
        }
      });
    }


    //console.log('updateCompinfo 0002 defineds',defineds);
  },
  onShow: function (res) {
    var referrerInfo = res.referrerInfo;
    console.log('app referrerInfo', res);
    // this.myBottomList().then(res=>{
    //   return this.setNavlist(res)
    // }).then(res => {
    //   this.setTemplate(res)
    // })
    if (referrerInfo) {
      this.globalData.ref_appid = referrerInfo.appId;
      if (referrerInfo.appId == 'wxeb490c6f9b154ef9' && referrerInfo.extraData) {
        this.globalData.vipcard_extraData = referrerInfo.extraData;
      }
    }
    if (res.query.scene) {
      wx.setStorageSync('scene', decodeURIComponent(res.query.scene))
    } else {
      wx.setStorageSync('scene', '')
    }
  },
  //全局数据
  globalData: {},
  userLoginPromise: '',//用户登录器
  http: http,//http模块
  goBack: function () {
    if (wx.canIUse('navigateBack')) {
      console.log('goBack  navigateBack');
      var pages = getCurrentPages(); //  获取页面栈
      if (pages.length <= 1) {
        wx.navigateTo({
          url: '/pages/main',
        });
      } else {
        wx.navigateBack({
          delta: 1,
        });
      }

    } else {
      console.log('goBack  navigateTo');
      wx.navigateTo({
        url: '/pages/main',
      });
    }

  },
  //检测是否具有分销权限
  checkShareRight: function (data) {
    console.log('checkShareRight  data', data);
    let is_apply = data.is_shareapply || '';
    if (is_apply == 'reg') {
      //跳转到分销申请界面
      wx.navigateTo({
        url: '/pages/myrevenue/reg',
      });
      return;
    } else if (is_apply == 'card') {
      //跳转到审核页界面
      wx.navigateTo({
        url: '/pages/myrevenue/card',
      });
      return;
    }
  },
  alertMsg(msg, option) {
    wx.showModal({
      content: msg || '提示信息',
      showCancel: false,
      mask: true,
      complete: function (res) {
        option && typeof option.cb == 'function' && option.cb(res);
      }
    })
  },
  alertDialog(msg, option) {
    wx.showModal({
      content: msg || '提示信息',
      showCancel: true,
      complete: function (res) {
        option && typeof option.cb == 'function' && option.cb(res.confirm);
      }
    })
  },
  getUserLocation(callback) {
    let lat = wx.getStorageSync('lat');
    let lng = wx.getStorageSync('lng');
    if (lat && lng) {
      typeof callback == 'function' && callback({
        'lat': lat,
        'lng': lng
      });
    } else {
      this.userLoginPromise
        .then(() => {
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              wx.setStorageSync('lat', res.latitude);
              wx.setStorageSync('lng', res.longitude);
              typeof callback == 'function' && callback({
                'lat': res.latitude,
                'lng': res.longitude
              });
            },
            fail: function () {
              typeof callback == 'function' && callback({
                'lat': '',
                'lng': ''
              });
            }
          })
        });
    }

  },
  getVipDefAddr: function (callback, isfetch = false) {
    this.getVipAddrs((data) => {
      var def_obj = data && data[0] || false;
      data.forEach(function (item) {
        if (item.isdefault == 'Y') {
          def_obj = item;
        }
      });
      callback(def_obj);
    }, isfetch)
  },
  getVipAddrById: function (id) {
    let vip_address = wx.getStorageSync('vip_address');
    if (!vip_address) {
      return false;
    }
    var target = false;
    vip_address.forEach(function (item) {
      if (item.lineid == id) {
        target = item;
      }
    });
    return target;
  },
  getVipAddrs: function (callback, isfetch = false) {
    let vip_address = wx.getStorageSync('vip_address');
    if (vip_address && !isfetch) {
      typeof callback == 'function' && callback(vip_address);
    } else {
      http.post('Member/getVipAddress', {}, function (json) {
        if (json.success == 1) {
          wx.setStorageSync('vip_address', json.data || []);
          callback(json.data || []);
        } else {
          app.alertMsg('读取会员地址失败:' + json.msg);
        }
      });
    }
  },
  // 获取url的参数
  getQueryVariable: function (query, variable) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },
  activeUserCard: function (callback) {
    var _this = this;
    wx.showLoading({ title: '正在激活..' });
    http.post('Login/activeWidgetCard', _this.globalData.vipcard_extraData, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        wx.setStorageSync('vip_info', json.vip_info || '');
        callback();
      } else {
        if (json.oldreg) {
          _this.getCardAndSign();
          return false;
        }
        _this.alertMsg(json.msg, {
          cb: _this.goBack
        });
      }
    });
  },
  fetchShops: function (option, callback) {
    var _this = this;
    this.getUserLocation(function (loction) {
      var userinfo = wx.getStorageSync('userinfo');
      http.post('Shop/getNearbyShop', { lat: loction.lat, lng: loction.lng, 'city': userinfo.city, 'page': option.page }, function (json) {
        callback(json);
      })
    })
  },
  updateVipPoint: function (lastpoint) {
    var vipinfo = wx.getStorageSync('vip_info');
    if (vipinfo) {
      vipinfo.point = lastpoint;
      wx.setStorageSync('vip_info', vipinfo)
    }
  },
  refreshVipInfo: function (callback) {
    //this.userLoginPromise.then((json) => {
    wx.showLoading('正在加载...');
    http.post('Member/getVipInfo', {}, function (json) {
      wx.hideLoading();
      console.log('getVipInfo  json', json);
      if (json.success == 1 && !!json.vip_info) {
        wx.setStorageSync('vip_info', json.vip_info);
        typeof callback === 'function' && callback(json.vip_info);
      }
    });
    //})
  },
  //开卡组件领卡和跳转到开卡组件
  getCardWidget: function () {
    let user_auth = wx.getStorageSync('user_auth');
    console.log('getCardWidget  user_auth001', user_auth);
    var _this = this;
    if (!wx.canIUse('navigateToMiniProgram')) {
      //app.alertMsg('您的微信版本太低了，建议升级后使用');
      _this.getCardAndSign();
      return false;
    } else {
      wx.showLoading();
      http.post('Login/getCardWidgetPara', {}, function (json) {
        wx.hideLoading();
        if (json.success == 1) {
          if (json.is_vip == 'Y') {
            //后台使用ticket读去信息并激活
            wx.setStorageSync('vip_info', json.vip_info || '');
            //跳转至注册前页面
            var after_reg_path = wx.getStorageSync('after_reg_path');
            if (after_reg_path) {
              wx.redirectTo({
                url: '/' + after_reg_path
              });
            }
          } else {
            //使用开卡组件
            wx.navigateToMiniProgram({
              'appId': 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动   
              'extraData': json.cardExt, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数 
              'envVersion': 'release',
              'success': function (res) { },
              'fail': function () { },
              'complete': function () { }
            })
            //add card end
          }
        } else {
          if (json.oldreg) {
            _this.getCardAndSign();
            return false;
          }
          //后台显示注册用户未授权
          if (json.success == -2) {
            let user_auth = wx.getStorageSync('user_auth');
            console.log('getCardWidget  user_auth002', user_auth);
            //user_auth = false;
            if (!user_auth) {

              //获取用户信息
              if (wx.canIUse('getUserInfo')) {
                wx.getUserInfo({
                  lang: 'zh_CN',
                  success: function (res) {
                    console.log('getUserInfoFunc  res', res);
                    wx.setStorageSync('userinfo', res);
                    _this.decryptUserInfo(res, () => {
                      console.log('发起领卡');
                      //重新发起领卡
                      _this.getCardWidget();
                    });

                  },
                  fail: function (res) {
                    _this.alertMsg('请完成微信授权', {
                      cb: function () {
                        wx.redirectTo({
                          url: "/pages/userauth",
                        })
                      }
                    });
                  }
                });
              } else {
                _this.alertMsg('请完成微信授权', {
                  cb: function () {
                    wx.redirectTo({
                      url: "/pages/userauth",
                    })
                  }
                });
              }

              return false;

            } else {
              console.log('注册异常');
              _this.alertMsg('注册异常，请关闭微信后重新登录', {
                cb: _this.goBack
              });

            }
            return false;
          }
          console.log('会员卡异常');
          //会员卡异常
          _this.alertMsg(json.msg, {
            cb: _this.goBack
          });
        }
      })
    }
  },
  //低版本领卡激活
  getCardAndSign: function () {
    var self = this;
    http.post('Login/getUserSignCard', {}, function (json) {
      if (json.success == 1) {
        if (json.need_addcard == 'N') {
          //领过卡
          wx.navigateTo({
            url: '/pages/reg',
          })
        } else {
          wx.addCard({
            cardList: [{
              'cardId': json.card_id,
              'cardExt': JSON.stringify(json.cardExt)
            }],
            success: function (res) {
              wx.navigateTo({
                url: '/pages/reg',
              })
            },
            fail: function (res) { }
          })
          //add card end
        }
      } else {
        self.alertMsg(json.msg);
      }
    })
  },
  // 上传图片
  uploadimg: function (data, callback) {
    if (data.path.length > 0) {
      var that = this;
      var i = data.i ? data.i : 0;
      var success = data.success ? data.success : 0;
      var fail = data.fail ? data.fail : 0;
      var backres = data.backres ? data.backres : '';
      let formData = {};
      let phpsessid = wx.getStorageSync('PHPSESSID');
      let utoken = wx.getStorageSync("utoken");
      let weixinid = wx.getStorageSync("weixinid");
      var header = {
        "Content-Type": "multipart/form-data"
      }
      if (phpsessid) {
        header['Cookie'] = 'PHPSESSID=' + phpsessid;
      }
      formData['phpsessid'] = phpsessid;
      formData['weixinid'] = weixinid;//识别哪个品牌
      formData['comp_id'] = defineds.compid;//识别公司
      if (utoken) {
        formData['utoken'] = utoken;
      }
      formData['comp_id'] = defineds.compid;
      wx.uploadFile({
        url: data.url + '?phpsessid=' + phpsessid + '&comp_id=' + defineds.compid + '&utoken=' + utoken,
        filePath: data.path[0],
        name: 'file',
        dataType: 'form-data',
        header: header,
        formData: formData,
        success: function (resp) {
          success++;
          console.log('返回结果', resp)
          console.log(i);
          //这里可能有BUG，失败也会执行这里
          console.log(resp.data);

          if (resp.data != '') {
            if (backres == '') {
              backres += resp.data;
            }
            else {
              backres += '^#^' + resp.data;
            }
          }
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
          console.log(i);
          i++;
          var _imglist = '';
          if (i == data.path.length) {  //当图片传完时，停止调用
            console.log('执行完毕' + backres);
            console.log('成功：' + success + " 失败：" + fail);
            callback(backres)
          } else {//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            data.backres = backres;
            that.uploadimg(data, callback);
          }
        }
      });
    }
    else {
      callback('')
    }
  },
  vipLogin: function (success_path) {
    var self = this;
    this.userLoginPromise.then((json) => {
      success_path = success_path || 'pages/main';
      var vipinfo = wx.getStorageSync('vip_info');
      var user_auth = wx.getStorageSync('user_auth');
      console.log('vipLogin  user_auth', user_auth);

      if (!vipinfo) {
        if (!user_auth) {
          self.alertMsg('请完成微信授权', {
            cb: function () {
              wx.redirectTo({
                url: "/pages/userauth",
              })
            }
          });
          return false;
        } else {
          //跳转到开卡组件前缓存跳转页面
          wx.setStorageSync('after_reg_path', success_path);
          this.getCardWidget();
        }

      }
    });
  },
  query2Str: function (query) {
    var str = '?';
    for (var k in query) {
      if (query.hasOwnProperty(k)) {
        str += (k + '=' + query[k] + '&')
      }
    }
    if (str.length > 0) {
      str = str.substr(0, str.length - 1) || '';
    }
    return str;
  },
  /**
	 * 解码场景值
	 */
  decodeURI: function (query = {}) {
    if (query.scene) {
      //扫码场景的compid
      var qrcode_para = decodeURIComponent(query.scene);
      if (!!qrcode_para) {
        var qrcode_arr = qrcode_para.split('&');
        var qrcode_obj = {};
        qrcode_arr.forEach(function (item) {
          let temp_arr = item.split('=');
          qrcode_obj[temp_arr[0]] = temp_arr[1];
        });
        return qrcode_obj;
      }
      return;
    } else {
      return;
    }
  },
  promisify: function (f) {
    return function () {
      console.log('arguments', arguments);
      let args = Array.prototype.slice.call(arguments);
      let params = {};
      return new Promise(function (resolve, reject) {
        // console.log('args001',args);
        //   args.push(function (err, result) {
        //       if (err) reject(err);
        //       else resolve(result);
        //   });

        Object.assign(params, args[0], { success: function (result) { resolve(result); }, fail: function (err) { reject(err); } });
        console.log('args002', args);
        console.log('params', params);
        f.apply(null, [params]);
      });
    }
  },
  simplyTime: function (timestamp) {
    let currentUnixTime = Math.round((new Date()).getTime() / 1000);
    // 当前时间的秒数
    let deltaSecond = currentUnixTime - parseInt(timestamp, 10);
    // 当前时间与要转换的时间差（ s ）
    let result;
    if (deltaSecond < 60) {
      result = deltaSecond + '秒前';
    } else if (deltaSecond < 3600) {
      result = Math.floor(deltaSecond / 60) + '分钟前';
    } else if (deltaSecond < 86400) {
      result = Math.floor(deltaSecond / 3600) + '小时前';
    } else if (deltaSecond < 604800) {
      result = Math.floor(deltaSecond / 86400) + '天前';
    } else if (deltaSecond < 2592000) {
      result = Math.floor(deltaSecond / 604800) + '周前';
    } else if (deltaSecond < 31536000) {
      result = Math.floor(deltaSecond / 2592000) + '个月前';
    } else {
      result = Math.floor(deltaSecond / 31536000) + '年前';
    }
    return result;
  },
  BASE_URL: defineds.BASE_URL,
  STATIC_URL: defineds.STATIC_URL,
  styleicon: defineds.styleicon,
  color_primary: defineds.color_primary,
  color_second: defineds.color_second,
  kikcExclusive: defineds.kikcExclusive,
  DF: defineds
})