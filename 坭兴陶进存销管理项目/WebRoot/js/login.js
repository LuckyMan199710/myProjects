/**
 * 模式化登录窗口
 */
$(function(){
	$("#username").focus();
	//重写validatebox控件,用作提示登录失败的信息
	$.extend($.fn.validatebox.defaults.rules, {    
	    isSucceedLogin: {    
	        validator: function(value, param){
	        	if(value=="aaa"){
	        		return true;
	        	}
	               
	        },    
	        message: 'Please enter at least {0} characters.'   
	    }    
	});  
	
		$("#mm").dialog({
			width:500,
			height:320,
			title:"",
			closable:true,
			left:830,
			top:128,
			draggable:false,
 		});
		$("#username").validatebox({
			required : true,
			missingMessage : '请输入账号'
		});
		$("#password").validatebox({
			required : true,
			missingMessage : '请输入密码'
		});
		$("#code").validatebox({
			required : true,
			missingMessage : '请输入验证码'
		});
		$('#hint').tooltip({
			width:500,
							position:'top',
							content: '<span style="color:#ff0000;font-size:12px;">用户名或密码错误,请重新输入</span>',
							onShow: function(){$(this).tooltip('tip').css({backgroundColor: '#ffffcc',borderColor: '#ff0000'});
							}});
		$('#hint').tooltip('hide');
		isCanSubmit();					//判断是否可以提交
		
	});

//点击更换验证码
function changImg(obj){
	obj.src="/sysyfaces/checkImgs?"+new Date().getTime();
};

//提交之前验证
function isCanSubmit(){
	if(!$("#username").validatebox('isValid')){
		$("#username").focus();
		return false;
	}else if(!$("#password").validatebox('isValid')){
		$("#password").focus();
		return false;
	}else if(!$("#code").validatebox('isValid')){
		$("#code").focus();
		return false;
	}else{
		return true;
	}
}

//通过ajax进行验证输入的账号和密码是否正确
function isLoginSucceed(){
	var name=$("#username").val();
	var pw=$("#password").val();
	if(name=="abc"&&pw=="abc"){
		return true;
	}
	return false;
}


//判断用户登录情况
function goLogin(){
	if(isCanSubmit()){						//判断是否都输入内容
		if(isLoginSucceed()){				//判断输入的用户名,密码和验证码是否正确正确
			return true;
		}else{								//错误时弹出错误的提示框
			$('#hint').tooltip('show');
			$("#username").focus();
			return false;
		}
	}
	return false;
}