var app = getApp();
Page({
  data: {
	menuTapCurrent:'0',  //选项卡选项
    'ontabpage': 'profit',
    page_path: 'pages/myrevenue/main',
    'base_conf': app.DF,
    mallfunc_status: 'Y'
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '我的收益' });
  },
  onLoad: function (option) {
    // wx.setNavigationBarTitle({ title: '我的收益' });
    // var _this=this;
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
  initPage: function (options) {
    var _this = this;
    // var vip_info = wx.getStorageSync('vip_info');
    // if (!vip_info) {
    //   var ret = app.getCardWidget();
    //   return false;
    // }
    wx.showLoading();
    app.http.post('Myrevenue/getprofit', {}, function (json) {
      console.log(json.total_sub_cnt)
      wx.hideLoading();
      let data = json;
      // app.checkShareRight(json);
      let is_apply = data.is_shareapply || '';
      if (is_apply == 'reg') {
        //跳转到分销申请界面
        app.alertDialog('是否跳转到分销申请界面', {
          cb: function (res) {
            if (res) {
              wx.navigateTo({
                url: '/pages/myrevenue/reg',
              });
            } else {
              wx.navigateBack({ delta: 1 })
            }
          }
        })
        return;
      } else if (is_apply == 'card') {
        //跳转到审核页界面
        app.alertDialog('是否跳转到审核页界面', {
          cb: function (res) {
            if (res) {
              wx.navigateTo({
                url: '/pages/myrevenue/card',
              });
            } else {
              wx.navigateBack({ delta: 1 })
            }
          }
        })
        return;
      }
      if(json.reg==1){
        //跳到申请分销商页
        wx.navigateTo({
          url: '/pages/myrevenue/reg?address_area=' + json.vip.address_area
        })
      } else if (json.card == 1) {
        //已申请跳到审核页
        wx.navigateTo({
          url: '/pages/myrevenue/card'
        })
      }else{
        _this.setData({
          'total_sub_cnt': json.total_sub_cnt,
          'sub_cnt': json.sub_cnt,
          'ttl_amt': parseFloat(json.ttl_amt),
          'bal_amt': parseFloat(json.bal_amt),
          'frz_amt': parseFloat(json.frz_amt),
          'delay_amt': parseFloat(json.delay_amt),
          'max_cash_amt': json.max_cash_amt,
          'istocard': json.istocard,
          'friends': json.friends,
        })
      }
    });
  },
  /* 选项卡 */
  menuTap:function(e){
	  var current=e.currentTarget.dataset.current;//获取到绑定的数据
	  //改变menuTapCurrent的值为当前选中的menu所绑定的数据
	  this.setData({
	   menuTapCurrent:current
	  });
  }
  // share: function () {
  //   var _this = this;
  //   app.http.post('Mymember/shareFriendss', {}, function (json) {
  //     if (json.success == 1) {
  //       console.log(json.brandlogo)
  //       var imgurl = json.imgurl;
  //       imgurl = imgurl.replace('?', "!");
  //       imgurl = imgurl.replace('=', "@");
  //       wx.navigateTo({
  //         url: '/pages/mymember/sharefriends?brandlogo=' + json.brandlogo + '&imgurl=' + imgurl
  //       })
  //     } else {
  //       app.alertMsg(json.msg);
  //     }
  //   });
  // },
  
})