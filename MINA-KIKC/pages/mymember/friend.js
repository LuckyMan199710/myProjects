var app = getApp();
Page({
  data: {
    page_path: 'pages/mymember/friend',
    'base_conf': app.DF,
    scrollTop: 0,
    navlist: [
      {
        id: 'regdate',
        name: '入会日期优先'
      },
      {
        id: 'amt',
        name: '消费金额优先'
      },
      {
        id: 'sub_cnt',
        name: '团队人数优先'
      }
    ],
    navIndex: 0,
    selected: 'regdate',
    start_date: '',
    end_date: '',
    end_time: '',
    timeToggle: false, // 是否显示日期
    phone: '',
    time_type: ''
  },
  zdyDate(date) {
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate();
    return Y + M + D
  },
  handleCustom() {
    this.setData({
      timeToggle: !this.data.timeToggle
    })
  },
  handleClear() {
    this.setData({
      code: ''
    })
    this.initPage()
  },
  handleInput(e) {
    console.log(e)
    this.setData({
      code: e.detail.value
    })
  },
  handleConfirm(e) {
    this.initPage()
  },
  bindPickerChange(e) {
    console.log('lllllllllllll', e)
    this.setData({
      navIndex: e.detail.value,
      selected: this.data.navlist[e.detail.value].id
    })
    this.initPage()
  },
  bindStartDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start_date: e.detail.value
    })
    if (this.data.end_date) {
      this.initPage()
    }
  },
  bindEndDateChange(e) {
    this.setData({
      end_date: e.detail.value,
      end_time: e.detail.value
    })
    if (this.data.start_date) {
      this.initPage()
    }
  },
  handleSetTime(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let newTime = new Date().getTime()
    this.setData({
      time_type: type
    })
    if (type == 'today') {
      this.setData({
        start_date: this.zdyDate(new Date()),
        end_date: this.zdyDate(new Date()),
        end_time: this.zdyDate(new Date())
      })
    } else if (type == 'yestoday') {
      this.setData({
        start_date: this.zdyDate(new Date(newTime - 86400000)),
        end_date: this.zdyDate(new Date(newTime - 86400000)),
        end_time: this.zdyDate(new Date(newTime - 86400000))
      })
    } else if (type == 'week') {
      this.setData({
        start_date: this.zdyDate(new Date(newTime - 7 * 86400000)),
        end_date: this.zdyDate(new Date()),
        end_time: this.zdyDate(new Date())
      })
    } else {
      this.setData({
        start_date: '',
        end_date: '',
        end_time: this.zdyDate(new Date())
      })
    }
    this.initPage()

  }, 
  onReady: function () {
    if (this._option.isdrp === 'Y') {
      wx.setNavigationBarTitle({ title: '我的分销商' });
    } else {
      wx.setNavigationBarTitle({ title: '我的粉丝' });
    }
    
  },
  onLoad: function (option) {
    // wx.setNavigationBarTitle({ title: '我的好友' });
    // var _this=this;
    // this._options = options;
    // app.userLoginPromise
    //   .then(json => {

    //     _this._onloadcalled = true;
    //     _this.initPage();

    //   })
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onShow: function () {
    // if (this._onloadcalled) {
    //   this.initPage();
    // }
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  initPage: function () {
    var _this = this;
    // var vip_info = wx.getStorageSync('vip_info');
    // if (!vip_info) {
    //   var ret = app.getCardWidget();
    //   return false;
    // }
    _this.lower_status=true;
    _this.i=1;
    var options = this._option;
    if (options.vip_id) {
      wx.showLoading();
      app.http.post('Mymember/savefriends', { 'vip_id': options.vip_id, isdrp: _this._option.isdrp }, function (json) {
        wx.hideLoading();
        if (json.success != 1) {
          app.alertMsg('添加好友失败');
        }
      });
    }
    wx.showLoading();
    let data = {
      phone: this.data.code==undefined?'':this.data.code,
      begdate: this.data.start_date,
      enddate: this.data.end_date,
      types: this.data.selected,
      isdrp:_this._option.isdrp
    }
    //注释 记得改回来
    app.http.post('Mymember/getfriends', data, function (json) {
      wx.hideLoading();
      // json.data && json.data.forEach(function (item) {
      //   if(item.vip_name.length>3){
      //     item.vip_name = item.vip_name.substring(0, 3) + "...";
      //   }
      // })
      console.log('getfriends json',json)
      /* if(json.is_apply=='reg'){
		  wx.navigateTo({
              url: '/pages/myrevenue/reg'
            })
	  }else if(json.is_apply=='card'){
		  wx.navigateTo({
              url: '/pages/myrevenue/card'
            })
	  }
      if((json.drpinfo && json.drpinfo['status'] !='CK')){
    	  wx.navigateTo({
              url: '/pages/myrevenue/card'
            })
      }
      _this.setData({
        friends: json.data,
        types:'regdate'
      }) */
    });
  },
  sortlist: function (e) {

    var _this = this;
    _this.types = e.currentTarget.dataset.type;
    console.log(_this.types)
    wx.showLoading();
    let data = {
      code: this.data.code,
      begdate: this.data.start_date,
      enddate: this.data.end_date,
      type: this.data.selected,
      isdrp: _this._option.isdrp,
      'types':_this.types,
      'pageno':1,

    }
    app.http.post('Mymember/getfriends', data, function (json) {
      wx.hideLoading();
      // json.data && json.data.forEach(function (item) {
      //   if (item.vip_name.length > 3) {
      //     item.vip_name = item.vip_name.substring(0, 3) + "...";
      //   }
      // })
      console.log(json)
      _this.setData({
        friends: json.data,
        types: _this.types
      })
      _this.i=1;
    });
  },
  lower: function (e) {
    var _this = this;
    if (_this.lower_status == false) {
      return false;
    }
    if (_this.data.friends && _this.data.friends.length > 0) {
      _this.lower_status = false;
      _this.i++;
      _this.getfriend(_this.i, _this.types);
    }
    
  },
  getfriend: function (i, types ='regdate') {
    var _this = this;
    console.log(i)
    console.log(types)
    wx.showLoading();

    let data = {
      code: this.data.code,
      begdate: this.data.start_date,
      enddate: this.data.end_date,
      type: this.data.selected,
      isdrp: _this._option.isdrp,
      'types': _this.types,
      'pageno': i
    }

    app.http.post('Mymember/getfriends', data, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        // json.data && json.data.forEach(function (item) {
        //   if (item.vip_name.length > 3) {
        //     item.vip_name = item.vip_name.substring(0, 3) + "...";
        //   }
        // })
        console.log(json.data)
        json.data && json.data.forEach(function (item) {
          _this.data.friends.push(item)
        })
        console.log(_this.data)
        _this.setData({
          friends: _this.data.friends,
          types: types
        })
        _this.lower_status = true;
      }
    });
  },
  // share:function(){
  //   var _this = this;
  //   app.http.post('Mymember/shareFriendss', {}, function (json) {
  //     if (json.success==1){
  //       console.log(json.brandlogo)
  //       var imgurl = json.imgurl;
  //       imgurl = imgurl.replace('?', "!");
  //       imgurl = imgurl.replace('=', "@");
  //       wx.navigateTo({
  //         url: '/pages/mymember/sharefriends?brandlogo=' + json.brandlogo+'&imgurl=' + imgurl
  //       })
  //     }else{
  //       app.alertMsg(json.msg);
  //     }
  //   });
  // },

})