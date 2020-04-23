//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    loading:false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function(){
	  console.log('onshow');
  },
  onLoad: function () {
    console.log('onLoad')
    wx.setNavigationBarTitle({title: '用户授权'});
    app.updateIconStyle(this);
    var that = this
    //调用应用实例的方法获取全局数据
//    app.getUserInfo(function(userInfo){
//      //更新数据
//      that.setData({
//        userInfo:userInfo
//      })
//    })
  },
  handleReset() {
    wx.navigateTo({
      url: '/pages/mall/main',
    })
  },
  auth_getuserinfo:function(e){
	  let self = this;
	  console.log('auth_getuserinfo e',e);
	  if(this.data.loading){return;}
	  this.setData({loading:true});
	  if (e.detail['errMsg'] == 'getUserInfo:ok' || e.detail.userInfo){
		  
	        wx.setStorageSync('userinfo', e.detail);
	        app.decryptUserInfo(e.detail,()=>{
	        	console.log('解密数据完成');
	        	var pages = getCurrentPages();             //  获取页面栈
	        	console.log('页面pages',pages);
	        	if(pages.length<=1){
	        		wx.redirectTo({
   	                 url: "/pages/main",
   	               })
	        	}else{
	        		app.goBack();
	        	}
	        	
	        });
	      }else{
	    	  this.setData({loading:false});
//	        app.alertDialog('请允许授权',{
//	          cb: (res) => {
//	            if (res == true) {
//	              
//	            	 //wx.navigateTo({url:'/pages/userauth'});
//	            }else{
//	              app.goBack();
//	            }
//	          }
//	        })
	    	  app.alertMsg('请允许授权',{cb:function(){wx.navigateTo({url:'pages/userauth'});}});
	      }
  }
})
