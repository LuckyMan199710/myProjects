import Scratch from "../../utils/game/guaka.js"
var app = getApp()
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

Page({
  data: {
    isStart: true,
    txt: "立即刮奖",
    clicknum:0,
    'imgbase': app.STATIC_URL + 'uploads/',
    buttondisplay: 'block',
    buttonhidden:false,
    buttonbackground:'#ED1E28',//'orange',
    button_zindex:200,
    txt_zindex:"z-index:150;",
    navhidden: true,
    guakaimage:app.STATIC_URL+'images/placeholder2.png',
    'base_conf': app.DF,
    backimage:"background-image:url('"+app.STATIC_URL+'images/placeholder2.png'+"');",//app.STATIC_URL+'images/placeholder.png',
    canvashidden:true,
    buttonposition:'position:absolute;top:27px;left:77px;margin:0;width:100px;z-index:200;',
    leaved_end:false
  },
  onShow: function () {
	  if(this.data.leaved_end){
		  console.log('onshow  leaved_end',this.data.leaved_end);
	  //返回进入页面，初始化
	  this.setData({canvashidden:true,buttonhidden:false,txt_zindex:"z-index:150;",isStart:true,
		  backimage:"background-image:url('"+app.STATIC_URL+'images/placeholder2.png'+"');",
		  button_zindex:200,
		  buttonposition:'position:absolute;top:27px;left:77px;margin:0;width:100px;z-index:200;'
		  });
	  }
	    
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
        console.log('onShow0055');
        this.initPage();
      });
      app.updateIconStyle(this);
	    app.vipLogin(this.data.page_path + app.query2Str(option));
 },
 onReady: function () {
	    wx.setNavigationBarTitle({ title: '刮刮乐游戏' });
 },
 initPage: function () {
	 this.setData({
			'background': '#ee903c',
		});
	 this.setPrize();
	 //this.setLights();
 },
 setPrize:function(){
 var _this = this;
 _this.setData({
		'background': '#ee903c',
		//canvashidden:false,
	});
 var billno = _this._option.billno;
		wx.showLoading({
			title: '正在加载游戏',
		});
		 //刮刮卡初始化
		 if(_this.data.isStart)
		 {
			 _this.initGame();
		 }
 var vip_info = wx.getStorageSync('vip_info');
 app.http.post('Game/getGamePrize', { 'billno': billno}, function (json) {
			wx.hideLoading();
			var basePrize = json.data['prize_dtl'] || [];
			console.log('getGamePrize  prize_dtl');
			console.log(basePrize);
			if(typeof(basePrize)!="undefined" &&  basePrize.length<=0)
			{
				 app.alertMsg('奖品明细未设置，请联系管理员');
				 return false;
			}
			basePrize.push({ 'lottername': '谢谢参与', 'seqid': 0 });
			_this.setData({
				'info': json.data,
				'basePrize': basePrize,
				'lefttimes':json.data.chance
			});
			console.log('getGamePrize  json');
			console.log(json)
			if (json.data.isvalid == 'N') {
		     app.alertMsg(json.data.errmsg, {
		       cb: function () {
		         wx.navigateBack()
		       }
		     });
			return false;
			}
			var isStart = _this.data.isStart;
			if(isStart)
			{
				//访问记录
				UserAction.recordPageView('GAME', 0, billno);
			}
			
			//开始游戏
			//_this.startGame();
			//_this.onStart();
			
	
   //if(_this.data.isStart == false){return false;}
      
})
},
//刮刮卡初始化
initGame:function(){
	   //刮刮卡初始化
	var _this = this;
	   _this.scratch = new Scratch(_this, {
	 canvasWidth: 265,//197
	 canvasHeight: 100,//72
	 imageResource: app.STATIC_URL+'images/placeholder2.png',
	 maskColor: "red",
	 r: 10,
	 awardTxt: "",
	 awardTxtColor: "#3985ff",
	 awardTxtFontSize: "24px",
	 callback: () => {
/*	   wx.showModal({
	     title: '提示',
	     content: '谢谢参与',
	     showCancel: false,
	     success: (res) => {
	    	 //_this.scratch.reset()
	       if (res.confirm) {
	         console.log('用户点击确定')
	       } else if (res.cancel) {
	         console.log('用户点击取消')
	       }
	     }
	   }) */  

	 }
	})
},
startGame: function () {
	var _this = this;
	var isStart = _this.data.isStart;
	if(isStart)
	{
		_this.setData({canvashidden:false,buttonhidden:true,txt_zindex:'',backimage:'',button_zindex:-1,buttonposition:''});
		//_this.scratch.start(_this);
	}
	console.log('startGame  this');
	console.log('startGame  isvalid:'+_this.data.info.isvalid);
	//console.log(_this);
	console.log('startGame  12345');
	if (_this.data.info.isvalid == 'N') {
		app.alertMsg(_this.data.info.errmsg);
		return false;
	}
	if(this.data.lefttimes==0){
		wx.hideLoading();
		app.alertMsg('您的抽奖机会已经用完');
		return false;
	}
	if (_this.data.isRunning) return;
	_this.setData({
		isRunning: true
	});

	var billno = _this.billno;

	var is_back = false;
	var luckid = -1;
	
	app.http.post('Game/randLuttery', { 'billno': _this._option.billno },function(json){
		wx.hideLoading();
		console.log('randLuttery json');
		console.log('开始游戏，读取奖品');
		console.log(json);
		console.log('basePrize');
		console.log(_this.data.basePrize);
		if(json.success == 0)
		{
			app.alertMsg(json.errmsg, {
			       cb: function () {
			         wx.navigateBack()
			       }
			     });
			return false;
		}
		is_back = true;
		var target = false;//目标结果
		var targetSeq = -1;//目标结果
		_this.data.basePrize.forEach(function(item,idx){
			if(item.seqid == json.luckid){
				target = item;
				targetSeq = idx;
			}
		});
  if (target===false || targetSeq == -1) {
    app.alertMsg('出现异常，请重新抽奖');
    
    _this.setPrize();
  }
		_this.setData({
			'resultTarget': target,
			'resultSeq': targetSeq,
			'lefttimes':(_this.data.lefttimes-1)
		});
		//更新会员积分
		_this.updateVipPoint(json.last_point);
		var isStart = _this.data.isStart;
/*		if(!isStart)
		{
			_this.initGame();
			_this.scratch.restart(_this);
		}*/
		//渲染奖品
		_this.renderPrize();
		//开始刮奖
		_this.onStart();
		
	//var isStart = _this.data.isStart;
	    
	});
	
	
},
 onStart () {
	console.log('开始刮奖');
	var _this = this;
	var isStart = _this.data.isStart;
	console.log('isStart',_this.data.isStart);
	if(isStart){
		  _this.setData({canvashidden:false,buttonhidden:true,txt_zindex:'',backimage:'',button_zindex:-1,buttonposition:''});
			console.log('onStart_start');
	      _this.scratch.start(_this);
	      _this.setData({
	        //txt: "重新开始",
	        isStart: false,
	        button_zindex:-1,
	        buttondisplay:'none',
	        canvashidden:false,
	        buttonbackground:'#ED1E28',
	      });
	    }else{
	    	console.log('onStart_restart');
	     _this.scratch.restart(_this);
	    }
	//激活刮奖
	_this.scratch.startgame();
  },

	renderPrize:function(){
		console.log('渲染奖品002');
		var _this = this;
		let resultTarget = _this.data.resultTarget;
		if (resultTarget.seqid==0){
			var prize_name = resultTarget.lottername;
		}else{
			var prize_name = '中奖啦！您获得了'+resultTarget.lottername;
		}
	  console.log('renderPrize   prize_name');
	  console.log(prize_name);
	  console.log('resultTarget002');
  	  console.log(resultTarget);
	  _this.scratch = new Scratch(_this, {
      canvasWidth: 265,
      canvasHeight: 100,
      imageResource: app.STATIC_URL+'images/placeholder2.png',
      maskColor: "red",
      r: 10,
      awardTxt: resultTarget.lottername,
      awardTxtColor: "#3985ff",
      awardTxtFontSize: "24px",
      callback: () => {
    	  console.log('弹出奖品');
    	  console.log('resultTarget002');
    	  console.log(resultTarget);
//    	  if(resultTarget.prizetype=='A'){
//  			wx.showModal({
//  				title: prize_name,
//  				content: '实物奖品需要填写地址才能发货',
//  				showCancel: true,
//  				confirmText:'去填写',
//  				cancelText:'再玩一次',
//  				complete: function (res) {
//  					if(!res.confirm){
//  						_this.setData({
//  	  						isRunning: false,
//  	  						buttondisplay: 'none',
//  	  					})
//  	  				
//  	  				_this.initGame();
//  					//_this.setPrize();
//  						//_this.onStart();
//  						_this.startGame();
//  					}else{
//  						wx.redirectTo({
//  							url: '/pages/game/prize',
//  						})
//  					}
//  				}
//  			});
//  			return false;
//  		}else{
//
//  			wx.showModal({
//  				title: prize_name,
//  				content: '',
//  				showCancel: true,
//  				confirmText:'再玩一次',
//  				cancelText:'取消',
//  				complete: function (res) {
//  					if(res.confirm){
//  						_this.setData({
//  	  						isRunning: false,
//  	  						buttondisplay: 'none',
//  	  					})
//  	  				_this.initGame();
//  					//_this.setPrize();
//  						console.log('showModal_onStart');
//  						//_this.onStart();
//  						_this.startGame();
//  					}else{
//  						wx.navigateBack();
//  					}
//  				}
//  			});
//  			return false;
//  		}  
    	  
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
			_this.setData({isRunning:false,canvashidden:true});
			_this.setData({wid_dialog_conf:{gameresult_show:true,imgbase:app.STATIC_URL + 'uploads/',imageurl:resultTarget.imageurl,title:prize_name,content:content,confirm_txt:confirm_txt,cancel_txt:cancel_txt}});
			console.log('中奖结果  content',content);
			
    	  return false;
      }
    });
	  
	},
	updateVipPoint: function (point) {
		var vipinfo = wx.getStorageSync('vip_info');
		if (vipinfo) {
			vipinfo.point = point;
			wx.setStorageSync('vip_info', vipinfo)
		}
	},
	gameConfirm:function(e){
		var _this = this;
		console.log('gameConfirm  e',e);
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf,canvashidden:false,isStart:true});
		if(this.data.resultTarget.prizetype=='A'){
			this.initGame();
			this.setData({leaved_end:true});
			wx.navigateTo({url: '/pages/game/prize',});
		}else{
			wx.showLoading({
				title: '正在加载...',
			});
			this.initGame();
			this.startGame();
		}
		
	},
	gameCancel:function(e){
		var _this = this;
		console.log('gameCancel  e',e);
		let wid_dialog_conf = this.data.wid_dialog_conf;
		wid_dialog_conf['gameresult_show'] = false;
		this.setData({wid_dialog_conf:wid_dialog_conf,canvashidden:false,isStart:true});
		if(this.data.resultTarget.prizetype=='A'){
			wx.showLoading({
				title: '正在加载...',
			});
			this.initGame();
			this.startGame();			
		}else{
			this.initGame();
			this.setData({leaved_end:true});
			app.goBack();
		}
		
	},
  onShareAppMessage: function (res) {
    var _this = this;
    var billno = _this.data.info.billno;
    var img = _this.data.info.bannerurl;
    return {
      'title': _this.data.info.title,
      'path': '/pages/game/guaka?billno=' + billno,
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
  preventTouchMove: function () { },
})