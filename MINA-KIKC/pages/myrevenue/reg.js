var app = getApp();
Page({
  data: {
    page_path: 'pages/myrevenue/reg',
    'base_conf': app.DF,
  },
  bindAddrChange: function (e) {
    this.setData({
      'address_area': e.detail.value
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '分销员申请' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onShow: function () {
    app.checkUserStatus(() => {
      //会员才执行;非会员则需等待激活会员卡后执行
      this.initPage();
    });
  },
  initPage: function () {
    var _this = this;
    var option = this._option
//    _this.setData({
//      'address_area': option.address_area ? option.address_area:''
//    });
    wx.showLoading({ title: '正在加载' });
    app.http.post('Myrevenue/reg', {}, function (json) {
      wx.hideLoading();
      console.log('reg  json',json);
      if (json.success == 1) {
    	  let reginfo = json.info || {};
    	  if((reginfo.drp_status && reginfo.drp_status != 'CL') || json.is_apply == false){
    		  wx.navigateTo({
                  url: '/pages/myrevenue/card'
                })
    	  }
        _this.setData({
        	name:reginfo['name']||'',
        	mobile:reginfo['mobile']||'',
        	address_area:reginfo['address_area']||''
        });
      } else {
    	  app.alertMsg(json.msg);
        
      }
    });

  },
  formSubmit: function (e) {
    var _this = this;
    var inputData = e.detail.value;
    console.log('formSubmit detail',e.detail);
    if (inputData.mobile == '') {
        app.alertMsg('请输入手机号码');
        return false;
      } 
    if (inputData.name == '') {
        app.alertMsg('请输入姓名');
        return false;
      } 
    if (inputData.mobile.length != 11) {
      app.alertMsg('手机号码为11位数');
      return false;
    } 
    let region = e.detail.region;
    if((region instanceof Array && region.length==0) || (typeof(region)=='string' && region=='')){
    	
    	 if(_this.data.address_area == ''){
    		 app.alertMsg('请输入地区');
             return false;
    	 }else{
    		 inputData.region =  _this.data.address_area;
    	 }
    	
    }
    //return ;
    inputData = JSON.stringify(inputData)
    wx.showLoading({ title: '正在提交' });
    app.http.post('Pubdata/regDrp', {inputData}, function (json) {
      wx.hideLoading();
      if (json.success == 1) {
        app.alertMsg(json.msg,{cb:function(){
        	wx.redirectTo({
                url: '/pages/myrevenue/card'
              })
              }
        });
      } else {
        app.alertMsg(json.msg);
      }
    });
  },
  
})