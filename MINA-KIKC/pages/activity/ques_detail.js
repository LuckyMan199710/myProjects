var app = getApp();
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);
var nav = require('../../utils/nav.js');
var AppAction = nav(app);

Page({
  data: {
    'base_conf': app.DF,
		imgbase: app.STATIC_URL + 'uploads/',
		imgbase2: app.STATIC_URL.replace('/Public/', ''),
    navhidden: true,
    page_path: 'pages/activity/ques_detail',
    loading:false,
	},
	radioChange:function(e){
		// 单选
		var id = e.currentTarget.id;
		var new_value = e.detail.value;
		this.setNewData(id, new_value,1);
	},
	checkboxChange: function (e) {
		// 多选
		var id = e.currentTarget.id;
		var new_value = e.detail.value;
		this.setNewData(id, new_value, 2);
	},
	bindDateChange:function(e){
		// 日期
		var id = e.currentTarget.id;
		var new_value = e.detail.value;
		this.setNewData(id,new_value);
	},
	bindChangeChildQues:function(e){
		if(this.data.show_lastvote){
			return ;
		}
		var id = e.currentTarget.id;
		var attrs = id.split('__');
		var que_id = attrs[0];
		var child_code = attrs[1];
		var select_num = attrs[2];
		var child_idx = attrs[3];

		// var target_que = false;
		var list = this.data.ques_list;
		list.forEach(function(item,idx){
			if(item.que_id==que_id){
				var target_que = item;
				var _result = item._result || {};
				_result[child_code] = [ select_num, item['child_ques'][child_idx]['child_txt'] ];
				item._result = _result;
				item['child_ques'][child_idx]['_result_'] = parseInt(select_num);
			}
			return item;
		});
		this.setData({
			'ques_list':list
		});
	},
	setNewData: function (id, new_value,is_radiocheck){
		var ques_list = this.data.ques_list;
		ques_list.forEach(function (item, idx) {
			if (item.que_id == id) {
				item._result = new_value;
				//特殊处理
				if (is_radiocheck==1){
					item.sub_entity.forEach(function(item2,idx2){
						if (new_value.indexOf(item2.select_num)!='-1'){
							item2.checked = 'checked';
						}else{
							item2.checked = false;
						}
						return item2;
					})
				}
				if (is_radiocheck == 2) {
					item.sub_entity.forEach(function (item2, idx2) {
						if (new_value.indexOf(item2.select_num) != '-1') {
							item2.checked = 'checked';
						} else {
							item2.checked = false;
						}
						
						return item2;
					})
				}
			}
			return item;
		});
		this.setData({
			ques_list: ques_list
		});
	},
  // bindNewAddr: function() {},
	bindBlur: function (e) {
		console.log('bindBlur e',e);
		var id = e.currentTarget.id;
		var new_value = e.detail.value;
		this.setNewData(id, new_value);
	},
  initPage: function () {
    var _this = this;
    var option = this._option;
    var vip_info = wx.getStorageSync('vip_info');
    console.log('initPage  vip_info',vip_info);
    wx.showLoading();
    app.http.post('Vote/getVoteInfo', { 'billno': option.billno, vip_id: vip_info && vip_info.vip_id ||0,relbill:option.relbill||''}, function (json) {
      wx.hideLoading();
      var vote = json.vote;
      if (json.success == 1) {
    	  console.log('getVoteInfo  last_vote',json.last_vote);
    	  console.log('getVoteInfo  ques_list',json.ques_list);
        _this.setData({
          'vote': vote,
          'ques_list': json.ques_list,
          'targetcode': option.targetcode || '',
          'show_lastvote':json.last_vote?true:false,
          'tip_msg':json.msg||'',
        });
        
        var last_vote = json.last_vote || '';
        wx.setNavigationBarTitle({ title: vote.title || '' });
        //判断当前活动是否有效
        _this.checkVote(vote);

        //转发记录
        UserAction.recordPageView('VOTE', 0, json.vote.billno);
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '问卷调查' });
  },
	onLoad: function (option) {
		var _this = this;
    this._option = option;
    if (!option.billno) {
      app.alertMsg('参数不存在', {
        cb: app.goBack
      })
      return false;
    }
		app.userLoginPromise
			.then(json => {
        _this.initPage();
        app.updateIconStyle(_this);
			})
  },
  checkVote:function(vote){
	  var _this = this;
	  console.log('checkVote  vote',vote);
	  var vip_info = wx.getStorageSync('vip_info');
	  if(vote.status !='A')
      {
//      	app.alertMsg('未激活不能参与', {
//              cb: function () {
//                wx.navigateTo({
//                  url: "/pages/main"
//                })
//              }
//            });
		  
		  _this.setData({tip_msg:'未激活不能参与'});
      	return false;
      }
//      var timestamp = Date.parse(new Date());  
//      timestamp = timestamp / 1000;
//      var startstamp = new Date(vote.startdate);
//      startstamp = startstamp.getTime();
//      var endstamp = new Date(vote.enddate);
//      endstamp = endstamp.getTime();
      if(vote.currentdate>vote.enddate)
      {
      	console.log('活动已经过期');
//    	  app.alertMsg('活动已经过期', {
//              cb: function () {
//              	if(!_this.data.show_lastvote)
//              	{
//              		app.goBack();
//              	}
//              	
//              }
//            });
      	
      	 _this.setData({tip_msg:'活动已经过期'});
    	  return false;
      }
      if(vote.currentdate<vote.startdate)
      {
//      	app.alertMsg('活动未开始', {
//              cb: function () {
//            	  app.goBack();
//              }
//            });
    	  
      	_this.setData({tip_msg:'活动未开始'});
      	return false;
      }
      if (!vip_info && vote.onlyvip == 'Y') {
//        app.alertMsg('非会员不能参与', {
//          cb: function () {
//            wx.navigateTo({
//              url: "/pages/main"
//            })
//          }
//        });
    	  
        _this.setData({tip_msg:'非会员不能参与'});
        return false;
      }

      if (vote.vip_lvl && vote.vip_lvl != vip_info.vip_lvl) {
//        app.alertMsg('您的会员等级不能在这里参与', {
//          cb: function () {
//            app.goBack();
//          }
//        });
    	  
        _this.setData({tip_msg:'您的会员等级不能在这里参与'});
        return false;
      }

      if (vote.dayvipcount >= vote.daytimes) {
//        app.alertMsg('你今天已参与' + vote.dayvipcount + '次，每人每天总次数不能超过' + vote.daytimes + '次', {
//          cb: function () {
//          	if(!_this.data.show_lastvote)
//          	{
//          		app.goBack();
//          	}
//          	
//          }
//        });
        _this.setData({tip_msg:'你今天已参与' + vote.dayvipcount + '次，每人每天总次数不能超过' + vote.daytimes + '次'});
        return false;
      }

      if (vote.vipcount >= vote.totaltimes) {
//        app.alertMsg('你已参与' + vote.vipcount + '次，每人总次数不能超过' + vote.totaltimes + '次', {
//          cb: function () {
//          	if(!_this.data.show_lastvote)
//          	{
//          		app.goBack();
//          	}
//          	
//          }
//        });
        
        _this.setData({tip_msg:'你已参与' + vote.vipcount + '次，每人总次数不能超过' + vote.totaltimes + '次'});
        return false;
      }
      return true;
  },
	formSubmit: function (e) {
		var _this = this;
		if(this.data.loading){
			return false;
		}
		if(this.data.tip_msg){
			return false;
		}
		var res_check = _this.checkVote(_this.data.vote);
		console.log('res_check',res_check);
		if(!res_check){
			return;
		}
		var ques_list = this.data.ques_list;
		var result_arr = [];
		
		//读取结果
		var attr_keys = ['que_id', 'is_mandatory', 'q_type','que_code','q_question','_result'];
		for(var i=0;i<ques_list.length;i++){
			var temp = {};
			for(var j=0;j<attr_keys.length;j++){
				temp[attr_keys[j]] = ques_list[i][attr_keys[j]]
			}
			result_arr.push(temp);
		}
		//检验必填项
		var has_error = false;
		var err_msg = '';
		result_arr.forEach(function(item,idx){
			if (item.is_mandatory == 1 && (!item._result || item._result.length < 1 || JSON.stringify(item._result) == "{}") ){
				err_msg = '请填写必填题目';
				has_error = true;			
			}
			
		});
		if(has_error){
			app.alertMsg(err_msg);
			return false;
		}
		//减少数据
		var submit_arr=[];
		for (var i = 0; i < result_arr.length;i++){
			if (result_arr[i].is_mandatory == 0 && (!result_arr[i]._result || result_arr[i]._result.length < 1)) {

			}else{
				if (result_arr[i]['q_type']==5){
					//特殊处理
					let temp_child_arr = [];
					for (var ii in result_arr[i]['_result']){
						let tempObj = {
							'child_code' : ii,
							'child_txt': result_arr[i]['_result'][ii][1],
							'select_value': result_arr[i]['_result'][ii][0]
						};
						// temp_child_arr.push(ii + ';' + result_arr[i]['_result'][ii][0]);
						temp_child_arr.push(tempObj);
					}
					result_arr[i]['_result'] = temp_child_arr;
				};
				submit_arr.push(result_arr[i]);
			}
		}
		console.log(submit_arr);
		// return false;
		_this.setData({loading:true});
		wx.showLoading({ title: '正在提交' });
		var submit_data = { result: JSON.stringify(submit_arr), 'targetcode': this.data.targetcode,
		'billno':this.data.vote.billno,'shopid':_this._option.shopid};
		if(_this._option.relbill){
			submit_data['relbill'] = _this._option.relbill;
		}
		app.http.post('Vote/saveVoteResult', submit_data , function (json) {
			wx.hideLoading();
			_this.setData({loading:false});
      console.log('saveVoteResult json',json)
			if (json.success == 1) {
				if(json.prize_ret.bonus_type=='L'){
					var target_url = '';
					if(json.prize_ret.gametype=='T'){
						target_url = "/pages/game/zhuanpan?billno="+json.prize_ret.billno;
					}else if(json.prize_ret.gametype=='E'){
						target_url = "/pages/game/jindan?billno="+json.prize_ret.billno;
					}else if(json.prize_ret.gametype=='C'){
						target_url = "/pages/game/guaka?billno="+json.prize_ret.billno;
					}
					app.alertMsg('投票成功,获得抽奖机会',{cb:function(){
						wx.navigateTo({url:target_url});
					}});
					
					return false;
				}
        app.alertMsg(json.msg, {
          cb: function () {
        	  app.goBack();
          }
        });
			} else {
				app.alertMsg(json.msg);
			}
		});
	},


  onShareAppMessage: function (res){
    var _this = this;
    var img = _this.data.vote.pic;
    var billno = _this.data.vote.billno;
		var targetcode = _this.data.targetcode;
		return {
      'title': _this.data.vote.title,
			'path': '/pages/activity/ques_detail?billno=' + billno + '&targetcode=' + targetcode + '&title='+_this.data.vote.title,
      'imageUrl': img,
			'success': function (res) {
        //转发记录
        UserAction.recordShare('VOTE', 0, billno);
				// 转发成功
			},
			'fail': function (res) {
				// 转发失败
			}
		}
	},

  nav: function () {
    var navhidden = AppAction.nav(this.data.navhidden);
    this.setData({
      navhidden: navhidden,
    })
  },

})
