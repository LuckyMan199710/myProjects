var app = getApp();
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

Page({
  data: {
    'imgbase': app.STATIC_URL + 'uploads/',
    src: app.DF.STATIC_URL + 'wap/styleicon/' + app.DF.styleicon +'/egg.png',
    hidden: true,
    animationData: {},
    awardList: [],//奖品数组
    jindana: true,
    navhidden: true,
    'base_conf': app.DF,
    lefttimes:0,
  },
  imageError: function (e) {
    console.log('image3发生error事件，携带值为', e.detail.errMsg)
  },
  onShow: function () {
   
  },
  onLoad: function (option) {
    //this.setPrize();
    if (option.scene) {
      var qrcode_obj = app.decodeURI(option) || "";
      console.log('qrcode_obj', qrcode_obj);
      if (!qrcode_obj || (qrcode_obj && !qrcode_obj['billno'])) {
        app.alertMsg('参数不存在', {
          cb: app.goBack
        })
      }
      option.billno = qrcode_obj['billno'];
    } else {
      if (!option.billno) {
        app.alertMsg('参数不存在', {
          cb: app.goBack
        });
        return false;
      }
    }
    this._option = option;

    app.checkUserStatus(() => {
      this.initPage();
    });
    app.updateIconStyle(this);
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },

  initPage: function () {
    this.setPrize();
  },

  setPrize: function () {
    var _this = this;
    var res = wx.getSystemInfoSync()
    var windowWidth = res.windowWidth;
    var windowHeight = res.windowHeight;
    var billno = _this._option.billno;
    
    wx.setNavigationBarTitle({ title: '砸金蛋' });
    var awardList = [];
    var topAward = 0;
    var leftAward = 0;
    for (var j = 0; j < 3; j++) {
      if (j == 0) {
        topAward = 55;
        leftAward = 10;
      } else if (j == 1) {
        topAward = 55;
        leftAward = 35;
      } else if (j == 2) {
        topAward = 55;
        leftAward = 60;
      }

      awardList.push({ topAward: topAward, leftAward: leftAward });
    }
    //3表示三个金蛋
    wx.showLoading({
      title: '正在加载游戏',
    });
    app.http.post('Game/getGamePrize', { 'billno': billno }, function (json) {
      wx.hideLoading();
      console.log('getGamePrize  json',json);
      _this.setData({
    	'info': json.data,
        'basePrize': json.data['prize_dtl'],
        awardList: awardList,
        colorAwardDefault:'top',
        lefttimes:json.data.chance
      })

      if (json.data.isvalid == 'N') {
        app.alertMsg(json.data.errmsg, {
          cb: function () {
            wx.navigateBack()
          }
        });
        return false;
      }

    })
    
  },

  //砸金蛋
  jindan: function (e) {
    var res = wx.getSystemInfoSync()
    var windowWidth = res.windowWidth;
    var windowHeight = res.windowHeight;
    console.log(windowWidth)
    console.log(windowHeight)
    if(this.data.lefttimes==0){
		app.alertMsg('您的抽奖机会已经用完');
		return false;
	}
    var _this = this;
    var indexSelect = e.currentTarget.dataset.index;
    var billno = _this._option.billno;

    if (indexSelect == 0) {
      //第一个金蛋
      _this.setData({
        mode1: 'bottom',
        //锥子
        zhuizileft: 23,
        zhuizitop: 43,
        //礼物
        liwuleft: 21,
        liwutop: 65,
        //彩礼
        cailileft: 16,
        cailitop: 58,
        indexSelect: indexSelect,
        hidden: false,
      })
    } else if (indexSelect == 1) {
      //第二个金蛋
      _this.setData({
        mode1: 'bottom',
        //锥子
        zhuizileft: 48,
        zhuizitop: 43,
        //礼物
        liwuleft: 46,
        liwutop: 65,
        //彩礼
        cailileft: 42,
        cailitop: 58,
        indexSelect: indexSelect,
        hidden: false,
      })
    } else if (indexSelect == 2) {
      //第三个金蛋
      _this.setData({
        mode1: 'bottom',
        //锥子
        zhuizileft: 75,
        zhuizitop: 43,
        //礼物
        liwuleft: 71,
        liwutop: 65,
        //彩礼
        cailileft: 67,
        cailitop: 58,
        indexSelect: indexSelect,
        hidden: false,
      })
    }

    //礼包慢慢上移动画
    var animation = wx.createAnimation({
      transformOrigin: "80% 80%",
      duration: 1000,
      timingFunction: "linear",
      delay: 0
    })
    this.animationData = animation
    animation.translateY(-20).step()
    setTimeout(function () {
      _this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)

    //获奖提示
    // setTimeout(function () {
    //   wx.showModal({
    //     title: '恭喜您',
    //     content: '砸了第' + (indexSelect + 1) + "个",
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //         _this.setData({
    //           isRunning: false
    //         })
    //       }
    //     }
    //   })
    // }, 3000)
    var is_back = false;
    app.http.post('Game/randLuttery', { 'billno': billno }, function (json) {
      console.log(json)
      //获奖提示
      is_back = true;
      var target = false;//目标结果
      var targetSeq = -1;//目标结果
      _this.data.basePrize.forEach(function (item, idx) {
        if (item.seqid == json.luckid) {
          target = item;
          targetSeq = idx;
        }
      });
      if (target == false || targetSeq == -1) {
        var msg=''
        if (json.luckmsg){
          msg=json.luckmsg;
        } else if (json.errmsg) {
          msg = json.errmsg;
        }else{
          msg ='出现异常，请重新抽奖';
        }

        //获奖提示
        setTimeout(function () {
//          wx.showModal({
//            title: '恭喜您',
//            content: msg,
//            showCancel: false,
//            success: function (res) {
//              if (res.confirm) {
//                _this.setData({
//                  isRunning: false,
//                  jindana: true,
//                  mode1: 'top',
//                  hidden: true,
//                })
//
//                //礼包慢慢上移动画
//                var animation = wx.createAnimation({
//                  transformOrigin: "80% 80%",
//                  duration: 1000,
//                  timingFunction: "linear",
//                  delay: 0
//                })
//                _this.animationData = animation
//                animation.translateY(0).step()
//                setTimeout(function () {
//                  _this.setData({
//                    animationData: animation.export()
//                  })
//                }.bind(_this), 1)
//
//              }
//            }
//          })
        	//修改
        	var prize_name = '恭喜您';
			var content = msg;
			var confirm_txt = '再玩一次';
			var cancel_txt = '不玩了';
			_this.setData({wid_dialog_conf:{gameresult_show:true,imgbase:app.STATIC_URL + 'uploads/',imageurl:'',title:prize_name,content:content,confirm_txt:confirm_txt,cancel_txt:cancel_txt}});
			
        	
        }, 2000)
        clearInterval(timer);
      }
      _this.setData({
        'resultTarget': target,
        'resultSeq': targetSeq,
        'lefttimes':(_this.data.lefttimes-1)
      });
      _this.updateVipPoint(json.last_point);
    });

    _this.setData({
      //点一次之后，不能再点第二次
      jindana: false
    })
    var indexSelects = -1
    var i = 0;
    var timer = setInterval(function () {
      //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
      i += 30;
      if (i > 1000 && _this.data.resultSeq != -1) {
        if (indexSelects == _this.data.resultSeq) {
          clearInterval(timer);
          let resultTarget = _this.data.resultTarget;
          if (resultTarget.seqid == 0) {
            var prize_name = resultTarget.lottername;
          } else {
            var prize_name = '中奖啦！您获得了' + resultTarget.lottername;
          }
          //修改
			var content = '';
			var confirm_txt = '';
			var cancel_txt = '';
			if(resultTarget.prizetype=='A'){
				content = '实物奖品需要填写地址才能发货';
				confirm_txt = '去填写';
				cancel_txt = '再玩一次';
			}else{
				confirm_txt = '再玩一次';
				cancel_txt = '不玩了';
			}
			
			_this.setData({wid_dialog_conf:{gameresult_show:true,imgbase:app.STATIC_URL + 'uploads/',imageurl:resultTarget.imageurl,title:prize_name,content:content,confirm_txt:confirm_txt,cancel_txt:cancel_txt}});
			console.log('中奖结果  content',content);
			
//          if (resultTarget.prizetype == 'A') {
//            wx.showModal({
//              title: prize_name,
//              content: '实物奖品需要填写地址才能发货',
//              showCancel: true,
//              confirmText: '去填写',
//              cancelText: '再玩一次',
//              complete: function (res) {
//                if (!res.confirm) {
//                  //_this.setPrize();
//                  _this.setData({
//                    jindana: true,
//                    mode1: 'top',
//                    hidden: true
//                  })
//
//                  //礼包慢慢上移动画
//                  var animation = wx.createAnimation({
//                    transformOrigin: "80% 80%",
//                    duration: 1000,
//                    timingFunction: "linear",
//                    delay: 0
//                  })
//                  _this.animationData = animation
//                  animation.translateY(0).step()
//                  setTimeout(function () {
//                    _this.setData({
//                      animationData: animation.export()
//                    })
//                  }.bind(_this), 1)
//
//                } else {
//                  wx.redirectTo({
//                    url: '/pages/game/prize',
//                  })
//                }
//              }
//            });
//            return false;
//          } else {
//            app.alertMsg(prize_name, {
//              cb: function () {
//                //_this.setPrize();
//                _this.setData({
//                  jindana: true,
//                  mode1: 'top',
//                  hidden: true
//                })
//
//                //礼包慢慢上移动画
//                var animation = wx.createAnimation({
//                  transformOrigin: "80% 80%",
//                  duration: 1000,
//                  timingFunction: "linear",
//                  delay: 0
//                })
//                _this.animationData = animation;
//                animation.translateY(0).step()
//                setTimeout(function () {
//                  _this.setData({
//                    animationData: animation.export()
//                  })
//                }.bind(_this), 1)
//
//              }
//            });
//          }
          //已经锁定结果，就不要再增加了indexSelects了
        } else {
          indexSelects++;//放后面才可能得到indexSelects=0
        }
      } else {
        indexSelects++;//放后面才可能得到indexSelect=0
      }
      indexSelects = indexSelects % 8;
      _this.setData({
        indexSelects: indexSelects
      })
    }, (60 + i))

  },
  updateVipPoint: function (point) {
    var vipinfo = wx.getStorageSync('vip_info');
    if (vipinfo) {
      vipinfo.point = point;
      wx.setStorageSync('vip_info', vipinfo)
    }
  },
  gameConfirm:function(e){
	  let _this = this;
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf,jindana:true,mode1:'top',hidden:true});
		if(this.data.resultTarget.prizetype=='A'){
			wx.navigateTo({url: '/pages/game/prize',});
		}else{
			//礼包慢慢上移动画
            var animation = wx.createAnimation({
              transformOrigin: "80% 80%",
              duration: 1000,
              timingFunction: "linear",
              delay: 0
            })
            _this.animationData = animation
            animation.translateY(0).step()
            setTimeout(function () {
              _this.setData({
                animationData: animation.export()
              })
            }.bind(_this), 1)
		}
		
	},
	gameCancel:function(e){
		let _this = this;
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf,jindana:true,mode1:'top',hidden:true});
		if(this.data.resultTarget.prizetype=='A'){
			//礼包慢慢上移动画
            var animation = wx.createAnimation({
              transformOrigin: "80% 80%",
              duration: 1000,
              timingFunction: "linear",
              delay: 0
            })
            _this.animationData = animation
            animation.translateY(0).step()
            setTimeout(function () {
              _this.setData({
                animationData: animation.export()
              })
            }.bind(_this), 1)
		}else{
			app.goBack();
		}
		
	},
  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },

})