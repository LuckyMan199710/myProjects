var app = getApp();
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../../utils/nav.js');
var AppAction = nav(app);
Page({
	data: {
    'base_conf': app.DF,
		circleList: [],//圆点数组
		awardList: [],//奖品数组
		colorCircleFirst: '#FFDF2F',//圆点颜色1
		colorCircleSecond: '#FE4D32',//圆点颜色2
		colorAwardDefault: '#F5F0FC',//奖品默认颜色
		colorAwardSelect: '#ffe400',//奖品选中颜色
		indexSelect: 0,//被选中的奖品index
		isRunning: false,//是否正在抽奖
    navhidden: true,
		imageAward: [
			'谢谢参与',
			'谢谢参与',
			'谢谢参与',
			'谢谢参与',
			'谢谢参与',
			'谢谢参与',
			'谢谢参与',
			'谢谢参与'
		],//奖品图片数组
		'imgbase': app.STATIC_URL + 'uploads/',
		'game_container_bg': 'testimages/zp_bg.png',
    'hidden': true,
    page_path: 'pages/game/zhuanpan',
    lefttimes:0,
	},
  onShow: function () {

    
  },
  onLoad: function (option) {
    if (option.scene) {
        var qrcode_obj = app.decodeURI(option) || "";
        console.log('qrcode_obj', qrcode_obj);
        if (!qrcode_obj || (qrcode_obj && !qrcode_obj['billno'])) {
            app.alertMsg('参数不存在', {
              cb: app.goBack
            })
        }
        option.billno = qrcode_obj['billno'];
    }else{
        if (!option.billno) {
          app.alertMsg('参数不存在', {
            cb: app.goBack
          });
          return false;
        }
    }
    this._option = option;

    
    app.updateIconStyle(this);
    app.checkUserStatus(() => {
      this.initPage();
    });
    app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '转盘游戏' });
  },

  initPage: function () {
    this.setPrize();
    this.setLights();
  },

	setPrize:function(){
		var _this = this;
    var billno = _this._option.billno;
		wx.showLoading({
			title: '正在加载游戏',
		});
    var vip_info = wx.getStorageSync('vip_info');
    app.http.post('Game/getGamePrize', { 'billno': billno}, function (json) {
			wx.hideLoading();
			var basePrize = json.data['prize_dtl'];
			var unluck = 8 - parseInt(basePrize.length);
			for (var i = 0; i < unluck; i++) {
				basePrize.push({ 'lottername': '谢谢参与', 'seqid': 0 });
			}
			basePrize.sort(function () { return 0.5 - Math.random() });
			//奖品item设置
			var awardList = [];
			//间距,怎么顺眼怎么设置吧.
			var topAward = 0;
			var leftAward = 0;
			// 顺时针
			for (var j = 0; j < 8; j++) {
				if (j == 0) {
					topAward = 5;
					leftAward = 5;
				} else if (j < 3) {
					topAward = topAward;
					leftAward = leftAward + 90 + 10;
				} else if (j < 5) {
					leftAward = leftAward;
					topAward = topAward + 90 + 10;
				} else if (j < 7) {
					leftAward = leftAward - 90 - 10;
					topAward = topAward;
				} else if (j < 8) {
					leftAward = leftAward;
					topAward = topAward - 90 - 10;
				}
				var imageAward = basePrize[j]['lottername'];
				var seqid = basePrize[j]['seqid'];
        var prizetype = basePrize[j]['prizetype'];
        var imageUrl = basePrize[j]['imageurl'];
        awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward, seqid: seqid, prizetype: prizetype,imageUrl:imageUrl });
			}
      console.log('getGamePrize json',json)
			_this.setData({
				'info': json.data,
				'basePrize': basePrize,
				'awardList': awardList,
				'isRunning':false,
				'resultSeq':-1,
				'resultTarget': false,
				'indexSelect':-1,
				'lefttimes':json.data.chance,
			});


			if (json.data.isvalid == 'N') {
        app.alertMsg(json.data.errmsg, {
          cb: function () {
            wx.navigateBack()
          }
        });
				return false;
			}
      //访问记录
      UserAction.recordPageView('GAME', 0, billno);
		})
	},
	setLights:function(){
		var _this = this;
		//圆点设置
		var leftCircle = 0;
		var topCircle = 0;
		var circleList = [];
		for (var i = 0; i < 22; i++) {
			if (i == 0) {
				topCircle = 4;
				leftCircle = 5;
			} else if (i < 6) {
				topCircle = 2;
				leftCircle = leftCircle + 58;
			} else if (i == 6) {
				//topCircle = 58
				//leftCircle = 302;
			} else if (i < 12) {
				topCircle = topCircle + 58;
				leftCircle = 302;
//			} else if (i == 12) {

				// topCircle = 302;
				// leftCircle = 320;
			} else if (i < 16) {
				topCircle = 302;

			
				leftCircle = leftCircle - 58;
			} else if (i == 16) {
				topCircle = 300;
				leftCircle = 4;
			} else if (i < 24) {
				topCircle = topCircle - 59;
				leftCircle = 3;
			} else {
				return
			}
			circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
		}
		this.setData({
			circleList: circleList
		})
		// 圆点闪烁
		var lighttimer = setInterval(function () {
			if (_this.data.colorCircleFirst == '#FFDF2F') {
				_this.setData({
					colorCircleFirst: '#FE4D32',
					colorCircleSecond: '#FFDF2F',
				})
			} else {
				_this.setData({
					colorCircleFirst: '#FFDF2F',
					colorCircleSecond: '#FE4D32',
				})
			}
		}, 500)
	},

	//开始游戏
	startGame: function () {

		if (this.data.info.isvalid == 'N') {
			app.alertMsg(this.data.info.errmsg);
			return false;
		}
		if(this.data.lefttimes==0){
			app.alertMsg('您的抽奖机会已经用完');
			return false;
		}
		if (this.data.isRunning) return
		this.setData({
			isRunning: true
		})
		var _this = this;
		var billno = _this.billno;

		var is_back = false;
		var luckid = -1;

		app.http.post('Game/randLuttery', { 'billno': this._option.billno },function(json){
			console.log('randLuttery   json',json);
			is_back = true;
			var target = false;//目标结果
			var targetSeq = -1;//目标结果
			_this.data.basePrize.forEach(function(item,idx){
				if(item.seqid == json.luckid){
					target = item;
					targetSeq = idx;
				}
			});
      if (target==false || targetSeq == -1) {
        app.alertMsg('出现异常，请重新抽奖');
        clearInterval(timer);
        _this.setPrize();
      }
			_this.setData({
				'resultTarget': target,
				'resultSeq': targetSeq,
				'lefttimes':(_this.data.lefttimes-1)
			});
			_this.updateVipPoint(json.last_point);
      
		});
		console.log('randLuttery   001112');
		var indexSelect = -1
		var i = 0;
		var timer = setInterval(function () {
			//这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
			i += 30;
			if (i > 1000 && _this.data.resultSeq!=-1) {
				if (indexSelect == _this.data.resultSeq){
					clearInterval(timer);
					let resultTarget = _this.data.resultTarget;
					if (resultTarget.seqid==0){
						var prize_name = resultTarget.lottername;
					}else{
						var prize_name = '中奖啦！您获得了'+resultTarget.lottername;
					}
//					if(resultTarget.prizetype=='A'){
//						wx.showModal({
//							title: prize_name,
//							content: '实物奖品需要填写地址才能发货',
//							showCancel: true,
//							confirmText:'去填写',
//							cancelText:'再玩一次',
//							complete: function (res) {
//								if(!res.confirm){
//									_this.setPrize();
//								}else{
//									wx.redirectTo({
//										url: '/pages/game/prize',
//									})
//								}
//							}
//						});
//						return false;
//					}else{
//						app.alertMsg(prize_name,{
//							cb:function(){
//								_this.setPrize();
//							}
//						});
//					}
					
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
					
					//已经锁定结果，就不要再增加了indexSelect了
				}else{
					indexSelect++;//放后面才可能得到indexSelect=0
				}
			}else{
				indexSelect++;//放后面才可能得到indexSelect=0
			}
			indexSelect = indexSelect % 8;
			_this.setData({
				indexSelect: indexSelect
			})
		}, (80 + i))
	},
	updateVipPoint: function (point) {
		var vipinfo = wx.getStorageSync('vip_info');
		if (vipinfo) {
			vipinfo.point = point;
			wx.setStorageSync('vip_info', vipinfo)
		}
	},
	gameConfirm:function(e){
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf});
		if(this.data.resultTarget.prizetype=='A'){
			wx.navigateTo({url: '/pages/game/prize',});
		}else{
			this.setPrize();
		}
		
	},
	gameCancel:function(e){
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf});
		if(this.data.resultTarget.prizetype=='A'){
			this.setPrize();
		}else{
			app.goBack();
		}
		
	},
  onShareAppMessage: function (res) {
    var _this = this;
    var billno = _this.data.info.billno;
    var img = _this.data.info.bannerurl;
    return {
      'title': _this.data.info.title,
      'path': '/pages/game/zhuanpan?billno=' + billno,
      'imageUrl': this.data.imgbase + img,
      'success': function (res) {
        //转发记录
        UserAction.recordShare('GAME', 0, billno);
        // 转发成功
      },
      'fail': function (res) {
        // 转发失败
      }
    }
  },
  rule:function(e){
    this.setData({
      hidden: false,
    })
  },
  hidden:function(){
    this.setData({
      hidden: true,
    })
  },

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },

 
})