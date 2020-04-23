var app = getApp();
Page({
  data: {
    page_path: 'pages/vip/branchsignup',
    'base_conf': app.DF,
    imgbase: app.STATIC_URL + 'uploads/',
    data:[],
    casIndex:-1,
  },
  bindDateChange: function (e) {
    var id = e.currentTarget.id;
    this.data[id] = e.detail.value;
    this.setData({
      data: this.data
    })
  },

  onReady: function () {
    
  },
  onLoad: function (option) {
    this.initPage(option);
    app.updateIconStyle(this);
    //this._option = option;
    // app.vipLogin(this.data.page_path + app.query2Str(option));
  },
  // onShow: function () {
  //   app.checkUserStatus(() => {
  //     //会员才执行;非会员则需等待激活会员卡后执行
  //     this.initPage();
  //   });
  // },
  initPage: function (option) {
    var _this = this;
    //var option = this._option
    var vip_info = wx.getStorageSync('vip_info');
    console.log(option)
    wx.showLoading();
    app.http.post('Crumbs/branchsignup', { 'olr_id':option.olr_id}, function (json) {
      console.log(json)
      wx.setNavigationBarTitle({ title: json.olr.title });
      wx.hideLoading();

      if (!vip_info && json.olr.mustvip == 'Y') {
        app.alertMsg('非会员不能参与', {
          cb: app.goBack
        });
      }

      _this.setData({
        'olr':json.olr,
        'isend': json.isend,
        'issubmit': json.issubmit,
        'olrlabel': json.olrlabel
      })
    })
  },

  formSubmit: function (e) {
    var _this = this;
    var msg='';
    var inputData = e.detail.value;
    inputData.olr = _this.data.olr.olr_id;
    _this.data.olrlabel && _this.data.olrlabel.forEach(function (item, idx) {
      if (item.selected == 'Y' && item.fieldmust == 'Y'){
        //必填项
        console.log(inputData[item.fieldname])
        if (!inputData[item.fieldname]){
          msg=item.fieldlabel+'为必填项';
        }
      }
    })

    if (inputData.mobile && inputData.mobile.length != 11) {
      msg='手机号码为11位数';
    }
    if(msg){
      app.alertMsg(msg);
      return false;
    }

    wx.showLoading();
    app.http.post('Crumbs/branchsignup_submit', inputData, function (json) {
      wx.hideLoading();
      if (json.success==1){
        app.alertMsg(json.msg);
        _this.setData({
          'issubmit': 'Y',
        })
      }else{
        app.alertMsg(json.msg);
      }
    });
  },
  
})