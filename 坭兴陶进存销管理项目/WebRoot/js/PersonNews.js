$(function(){
	/**
	 * 页面刚加载需要到后台查找登录人的信息并显示
	 */
    loginUserNewInit();
	
	/**
	 * 重写验证手机号码 的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
	    isRightPhone: {    
	        validator: function(value, param){    
	        	 var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
	        	 if(value.length!=11){
	        		 return false;
	        	 }else{
	        		 return myreg.test(value);
	        	 }
	        },    
	        message: '请输入有效的手机号码'   
	    }    
	});  
	
	/**
	 * 重写验证邮政编码的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
	    isRightPostCode: {    
	        validator: function(value, param){    
	        	var isPhone = /^[0-9][0-9]{5}$/;
	        		 return isPhone.test(value);
	        },    
	        message: '请输入有效的邮政编码如:537211'   
	    }    
	}); 
	
	// 当鼠标经过修改的图标是触发的事件
	$("#editPersonNews").hover(
			function () {
			   $(this).css({width:'30px',height:'30px'})
			 },
			function () {
				 $(this).css({width:'25px',height:'25px'})
			 }
	);
	
	// 当鼠标经过返回的图标是触发的事件
	$("#personBack").hover(
			function () {
			   $(this).css({width:'30px',height:'30px'})
			 },
			function () {
				 $(this).css({width:'25px',height:'25px'})
			 }
	);
	
	// 更新界面
	$("#personUpdateBox").dialog({
		title : '修改界面',
		closed : true,
		width:1000,
		height: 255,
		modal:true,
		iconCls:'icon-edit',
		buttons : [
		           {
		        	   text : '修改',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   personConfirmUpdate();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#personUpdateBox').dialog('close');						//关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	// 初始化控件的方法
	perosonInitFn();
});

/**
 * 登录这进来时就初始化登录信息
 */
function loginUserNewInit(){
	// 工号
	$("#personID").text("123456");
	
	// 密码
	$("#personPW").text("123456");
	
	// 姓名
	$("#personName").text("123456");
	
	// 部门
	$("#personDepartment").text("123456");
	
	// 电话
	$("#personPhone").text("123456");
	
	// 邮箱
	$("#personEmail").text("123456");
	
	// 邮政编码
	$("#personCode").text("123456");
	
	// 角色
	$("#personRole").text("123456");
	
	// 地址
	$("#personAddress").text("123456");
	
	// 上次登录时间
	$("#personLastLoginTime").text("123456");
}


/**
 * 初始化控件的方法
 * 
 */
function perosonInitFn(){
	
	//姓名
	$("#updatePersonName").validatebox({
		 required: true,
		 validType:"length[5,20]",
		 missingMessage:"请输入姓名"    
	});
	
	//电话号码
	$("#updatePersonPhone").validatebox({
		 validType:'isRightPhone[11]',
		 missingMessage:"请输入电话号码"
	});
	
	//邮箱
	$("#updatePersonEmail").validatebox({
		 validType:['email','length[5,30]'],
		 missingMessage:"请输入邮箱地址"
	});
	
	//邮编
	$("#updatePersonCode").validatebox({
		 validType:"isRightPostCode[6]",
		 invalidMessage:"请输入有效的邮政编码如:537211"
	});
	
	//密码
	$("#updatePersonPassword").validatebox({
		 validType:"length[5,20]",
		 missingMessage:"请输入密码"
	});
}

/**
 * 判断是否满足更新的条件
 * */
function isCanUpdate(){
	if(!$("#updatePersonName").validatebox('isValid')){
		$("#updatePersonName").focus();
		return false;
	}
	
	if($("#updatePersonPassword").val()!=""){
		if(!$("#updatePersonPassword").validatebox('isValid')){
			$("#updatePersonPassword").focus();
			return false;
		}
	}
	
   if($("#updatePersonPhone").val()!=""){
		if(!$("#updatePersonPhone").validatebox('isValid')){
			$("#updatePersonPhone").focus();
			return false;
		}
	}
   
   if($("#updatePersonEmail").val()!=""){
		if(!$("#updatePersonEmail").validatebox('isValid')){
			$("#updatePersonEmail").focus();
			return false;
		}
	}
   
   if($("#updatePersonCode").val()!=""){
		if(!$("#updatePersonCode").validatebox('isValid')){
			$("#updatePersonCode").focus();
			return false;
		}
	}
   
   return true;
   
}

/**
 * 确认更新的方法
 * */
function personConfirmUpdate(){
	var temp = isCanUpdate();
	if(temp){
		 $.messager.confirm('提示','确认修改?',function(data){
			   if(data){
				   // 此处进行修改并查询更改后的信息到个人信息界面
				   
				   toPrompt('更新个人信息提示','更新成功');
				   $('#personUpdateBox').dialog('close');	
			   }
		   });
	}
}

/***
 * 将用户的值传递到更新界面
 */
function transferNews(){
	
	// 登录工号(用来修改数据)
	var loginId = $("#personID").text();
	$("#updateLoginId").val(loginId);
	
	// 姓名
	var name = $("#personName").text();
	$("#updatePersonName").val(name);
	
	// 密码
	$("#updatePersonPassword").val("******");
	
	// 电话
	var phone = $("#personPhone").text();
	$("#updatePersonPhone").val(phone);
	
	// 邮箱
	var email = $("#personEmail").text()
	$("#updatePersonEmail").val(email);
	
	// 邮政编码
	var code = $("#personCode").text();
	$("#updatePersonCode").val(code);
	
	// 地址
	var address = $("#personAddress").text();
	$("#updatePersonAddress").val(address);
	
}

/**
 * 弹出更新界面的窗口
 * **/
$("#editPersonNews").click(function(){
	// 将值传递到更新界面
	transferNews();
	// 打开更新界面
	$('#personUpdateBox').dialog('open');	
});

/**
 * 点击密码框是将密码消除
 * @param title
 * @param msgs
 */
$("#updatePersonPassword").click(function(){
	$(this).val("");
});

$("#personBack").click(function(){
	 if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
});

//提示信息通用的方法
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:105
	});
}
