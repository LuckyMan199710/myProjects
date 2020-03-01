var grobal;
$(function(){
	
	/** 重写datagrid当查询不到数据时提示响应的信息 */
	var myview = $.extend({},$.fn.datagrid.defaults.view,{
	    onAfterRender:function(target){
	        $.fn.datagrid.defaults.view.onAfterRender.call(this,target);
	        var opts = $(target).datagrid('options');
	        var vc = $(target).datagrid('getPanel').children('div.datagrid-view');
	        vc.children('div.datagrid-empty').remove();
	        if (!$(target).datagrid('getRows').length){
	            var d = $('<div class="datagrid-empty"></div>').html(opts.emptyMsg || 'no records').appendTo(vc);
	            d.css({
	                position:'absolute',
	                left:0,
	                top:50,
	                width:'100%',
	                textAlign:'center'
	            });
	        }
	    }
	    });
	
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
	 * 重写验证座机电话的validatebox
	 */
	
	$.extend($.fn.validatebox.defaults.rules, {    
	    isFixPhone: {    
	        validator: function(value, param){    
	        	var isPhone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
	        		 return isPhone.test(value);
	        },    
	        message: '请输入有效的号码如:012-5201212'   
	    }    
	}); 
	
	/**
	 * 重写验证邮政编码的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {   
	    isEnterRightPostCode: {    
	        validator: function(value, param){    
	        	var isPhone = /^[0-9][0-9]{5}$/;
	        		 return isPhone.test(value);
	        },    
	        message: '请输入有效的邮政编码如:537211'   
	    }    
	}); 
	
	
	/**
	 * 重写验证传真的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
		isfax : {// 验证传真  
			validator : function(value) {  
		    return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);  
			   },  
			   message : '传真号码不正确'  
			},  
	}); 
	
	/**
	 * 企业详细信息页面窗体
	 */
	
	$("#enterpriseDetailNewBox").dialog({
		width : 903,
		height : 675,
		title : '公司详情信息',
		closed : true,
		modal : true
	});
	
	
	$('#enterpriseNews').datagrid({
		url : "enterpriseDemo.json",
		fit:true,
		border:false,
		method: "POST",
		pagination:true,
		striped:true,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		sortName:'cpyId',
		sortOrder:'asc',
		rownumbers:true,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar : '#enterpriseNav',
	
			//fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'cpyId',title:'序号',align:'center',width:50,checkbox: true,},
        	{field:'creditCode',title:'统一社会信用代码',align:'center',width:135,sortable:true},
        	{field:'cpyName',title:'企业名称',align:'center',width:220},      
        	{field:'cpyTelphone',title:'企业电话',align:'center',width:120},
        	{field:'bankOfDeposit',title:'开行户',align:'center',width:120},
        	{field:'cpyAccount',title:'账号',align:'center',width:200},
        	{field:'business',title:'业务范围',align:'center',width:200},
        	{field:'registeredCapital',title:'注册资本',align:'center',width:120}, 
        	{field:'registeredTime',title:'注册时间',align:'center',width:150,sortable:true}, 
        	{field:'legalRepresentative',title:'法定代表人',align:'center',width:120}, 
        	{field:'cpyType',title:'企业类型',align:'center',width:100,
        		formatter: function(value,row,index){
				if (value==0){
					return "本企业";
				} else if(value==1) {
					return "供货商";
				}
			}
        	}, 
        	{field:'cpyAddress',title:'地址',align:'center',width:220}, 
				]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			 e.preventDefault();
			$("#enterprisemenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$('#enterpriseNews').datagrid('unselectAll');
			$('#enterpriseNews').datagrid('selectRow',rowIndex);
		}
	});
	
	/**
	 * 企业信息更新弹窗
	 */
	
	$("#updateEnterpriseBox").dialog({
		title : '企业信息更新界面',
		iconCls : 'icon-edit',
		width : 1410,
		height : 560,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '修改',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   var temp=isCanUpdate();
		        		   if(temp){
		        			   updateEnterpriseRow();
		        		   }
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#updateEnterpriseBox').dialog('close');			//关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	
	init();							//初始化面板
});


//设置导航按钮的事件
	$("#eqAdd").click(function(){						//添加
		addEnterprise();
	});
	
	$("#eqDelete").click(function(){					//删除
		var rows=$("#enterpriseNews").datagrid('getSelections');
		deleteChooseRows(rows);
	});
	
	$("#eqUpdate").click(function(){					//更新
		openEnterPriseUpdateBox();
	});
	
	$("#eqSearch").click(function(){					//查询
		if(!$("#center").tabs('exists','企业查询')){
			$("#center").tabs('add',{
				title : '企业查询',
				closable:true,
				href:"searchEnterprise.html",
			});
		}else{
			$('#center').tabs('select','企业查询');
		}
	});
	
	$("#eqClear").click(function(){						//清除
		$("#enterpriseNav input").val("");
	});
	
	$("#eqcallback").click(function(){					//返回
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	});
	
	

	$("#eqAdd").linkbutton({					//添加
		plain:true,
		iconCls:'icon-add'
	});
	$("#eqDelete").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel'
	});
	$("#eqUpdate").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit'
	});
	$("#eqSearch").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search'
	});
	$("#output").linkbutton({					//导出
		plain:true,
		iconCls:'icon-large-smartart'
	});
	$("#eqClear").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel'
	});
	$("#eqcallback").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo'
	});
	
	/* 添加页面选择图片事件 */
	$("#QRCodeOfCompany").click(function(){			//上传企业图片
		$("#QRCodeOfCompany").attr('value',"上传成功");
		$("#QRCodeOfCompany").attr('color',"#ff0000");
		toPrompt('上传提示','上传企业图片成功');//提示信息
	});
	
	$("#QRCodeOfWebChat").click(function(){			//上传微信公众号片图片
		$("#QRCodeOfWebChat").attr('value',"上传成功");
		toPrompt('上传提示','上传企业微信公众号片图片成功');//提示信息
	});
	
	$("#trademark").click(function(){			//上传企业商标图片
		$("#trademark").attr('value',"上传成功");
		toPrompt('上传提示','上传企业商标图片成功');//提示信息
	});
	
	
	/* 更新界面更换图片事件 */
	
	$("#updateEmQRCodeOfCompanyImg").click(function(){			//上传企业图片
		alert("点击了更换企业图片按钮");
	});
	
	$("#updateqrcodeOfWebChatImg").click(function(){			//上传微信公众号片图片
		alert("更换微信公众号片图片");
	});
	
	$("#updatetrademarkImg").click(function(){			//上传企业商标图片
		alert("更换企业商标图片");
	});
	
	
/**
 * 设置输入的条件
 */
function init(){
	/**
	 * 信用编码
	 */
	$("input[name='creditCode'],input[name='updateCreditCode']").validatebox({
		 required: true,
		 validType:"length[12,18]",
		 missingMessage:"请输入统一社会信用代码"    
	});
	
	/**
	 * 企业名称
	 */
	$("input[name='cpyName'],input[name='updateName']").validatebox({
		 required: true,
		 validType:"length[2,100]",
		 missingMessage:"请输入企业名称"    
	});
	
	/**
	 * 企业电话
	 */
	$("input[name='cpyTelphone'],input[name='updatetelphone']").validatebox({
		 required: true,
		 validType:'isFixPhone[]',
		 missingMessage:"请输入企业电话"   
	});
	
	/**
	 * 开户行
	 */
	$("input[name='bankOfDeposit'],input[name='updateBankOfDeposit']").validatebox({
		required: true,
		 validType:"length[2,100]",
		 missingMessage:"请输入开户行"  
	});
	
	/**
	 * 账号
	 */
	$("input[name='cpyAccount'],input[name='updateAccount']").validatebox({
		required: true,
		 validType:"length[12,19]",
		 missingMessage:"请输入账号"  
	});
	
	/**
	 * 业务范围
	 */
	$("input[name='business'],input[name='updateBusiness']").validatebox({
		 required: true,
		 validType:"length[12,19]",
		 missingMessage:"请输入业务范围"  
	});
	
	/**
	 * 注册资本
	 */
	$("input[name='registeredCapital'],input[name='updateRegisteredCapital']").numberbox({
		groupSeparator:',',
		prefix:'￥',
		required: true,
		missingMessage:"请输入注册资本" ,
		min:0,
	});
	
	/**
	 * 注册时间
	 */
	$("input[name='registeredTime'],input[name='updateRegisteredTime']").datetimebox({
		required: true,
		missingMessage:"请选择注册时间",
		editable:false
	});
	
	/**
	 * 法定代表人
	 */
	$("input[name='legalRepresentative'],input[name='updateLegalRepresentative']").validatebox({
		required: true,
		missingMessage:"请输入法定代表人"  
	});
	
		
	
	
	/**
	 * 电子邮箱
	 */
	$("input[name='cpyEmail'],input[name='updateEmail']").validatebox({
		 validType:['email','length[5,30]'],
		 missingMessage:"请输入邮箱地址"
	});
	
	
	/**
	 * 邮政编码
	 */
	$("input[name='cpyPostCode'],input[name='updatePostCode']").validatebox({
		validType:'isEnterRightPostCode[6]',
		invalidMessage:"请输入有效的邮政编码如:537211"
	});
	
	
	/**
	 * 企业联系人
	 */
	$("input[name='contact'],input[name='updateContact']").validatebox({
		 missingMessage:"请输入企业联系人",
	});
	
	
	/**
	 * 人员数量
	 */
	$("input[name='employeeAmout'],input[name='updateEmployeeAmout']").numberbox({
		 missingMessage:"请输入人员数量",
		 min:0,
	});
	
	/**
	 * 联系人电话
	 */
	$("input[name='cpyContactTelphone'],input[name='updateContactTehpone']").validatebox({
		 validType:'isRightPhone[11]',
		 missingMessage:"请输入联系人电话" 
	});
	
	
	/**
	 * 传真
	 */
	$("input[name='cpyFax'],input[name='updateFax']").validatebox({
		 missingMessage:"请输入传真号码",
		 validType:'isfax[6,10]',
	});
	

	/**
	 * 类型
	 */
	$("input[name='cpyType'],input[name='updateType']").combobox({
		valueField: 'value',
		textField: 'label',
		panelHeight:'auto',
		editable:false,
		data: [{
			label: '本企业',
			value: '0'
		},{
			label: '供货商',
			value: '1'
		}]
	});
	
	/**
	 * 生产规模
	 */
	$("input[name='produceScale'],input[name='updateProduceScale']").validatebox({
		missingMessage:"生产规模" 
	});
	
	/**
	 * 企业地址
	 */
	$("input[name='cpyAddress'],input[name='updateAddress']").validatebox({
		required: true,
		missingMessage:"请输入企业地址",
		validType:'length[1,200]'
	});
}


	
	/**
	 * 添加企业时判断是否符合条件
	 */
	function addEnterprise(){
		if(!$("input[name='creditCode']").validatebox('isValid')){			//判断是否输入编号
			$("input[name='creditCode']").focus();
		}else if(!$("input[name='cpyName']").validatebox('isValid')){
			$("input[name='cpyName']").focus();
		}else if(!$("input[name='cpyTelphone']").validatebox('isValid')){
			$("input[name='cpyTelphone']").focus();
		}else if(!$("input[name='bankOfDeposit']").validatebox('isValid')){
			$("input[name='bankOfDeposit']").focus();
		}else if(!$("input[name='cpyAccount']").validatebox('isValid')){
			$("input[name='cpyAccount']").focus();
		}else if(!$("input[name='business']").validatebox('isValid')){
			$("input[name='business']").focus();
		}else if($("input[name='registeredCapital']").val()==""){
			toPrompt('提示消息','请输入注册资本');
		}else if($("input[name='registeredTime']").val()==""){
			toPrompt('提示消息','请选择注册时间');
		}else if(!$("input[name='legalRepresentative']").validatebox('isValid')){
			$("input[name='legalRepresentative']").focus();
		}else if($("#cpyType").combobox('getValue')==""){  					//选择企业类型
			toPrompt('提示消息','请选择企业类型');
		}else if(!$("input[name='cpyAddress']").validatebox('isValid')){
			$("input[name='cpyAddress']").focus();
		}else{
			//全部符合条件则企业信息添加--在当前页的最后一行添加
			$("#enterpriseNews").datagrid('appendRow',{});
			toPrompt('提示信息','添加成功');
		}
		
	}
	
	/**
	 * 删除选中记录(可以时多条)
	 */
	function deleteChooseRows(rows){
		//var rows=$("#enterpriseNews").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#enterpriseNews").datagrid('load');						//调用该方法刷新当前页
					$("#enterpriseNews").datagrid('unselectAll');				//删除完成后取消所有选定,防止有不明问题出现	
					
					toPrompt('删除提示','删除是否成功');							//删除操作提示		
					
				}
			});
		}else{
			$.messager.alert('提示','请选择需要删除的数据！','warning');
		}
	}
	
	
	/**
	 * 删除现在选定的单行
	 */
	function epRemoveNowRow(rows){
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					var rowIndex = rows[0].id;									//获得当前选中行的索引
					
					$("#enterpriseNews").datagrid('load');						//调用该方法刷新当前页
					$("#enterpriseNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
					
					toPrompt('删除提示','删除是否成功');							//根据返回结果执行以下提示
				}
			});
		}else if(rows.length>1){
			$.messager.alert('提示','只能删除当前行,请勿选择多行！','warning');
		}else{
			$.messager.alert('提示','请选择需要删除的数据！','warning');
		}
	}
	
	/**
	 * 打开更新窗口
	 * */
		function openEnterPriseUpdateBox(){
			 var rows = $("#enterpriseNews").datagrid('getSelections');
			 if(rows.length==1){
				 $("#updateEnterpriseBox").dialog('open');
				 getUpdateRowValue(rows);
			 }else{
				 $.messager.alert('更新提示','修改信息必须或只能选择一行!','warning');
			 }
		}
		
	/**
	 * 获得需要修改的列的值
	 */
	function getUpdateRowValue(rows){
		//var rows=$("#enterpriseNews").datagrid('getSelections');
		 $("input[name='updateCreditCode']").val(rows[0].creditCode);
		 $("input[name='updateName']").val(rows[0].cpyName);
		 $("input[name='updatetelphone']").val(rows[0].cpyTelphone);
		 $("input[name='updateBankOfDeposit']").val(rows[0].bankOfDeposit);
		 $("input[name='updateAccount']").val(rows[0].cpyAccount);
		 $("input[name='updateBusiness']").val(rows[0].business);
		 //设置资本
		 $("#updateRegisteredCapital").numberbox('setValue',rows[0].registeredCapital);
		 $("#updateRegisteredCapital").numberbox('setText',rows[0].registeredCapital);
		 //设置时间
		 $("#updateRegisteredTime").datetimebox('setValue', rows[0].registeredTime);
		 $("#updateRegisteredTime").datetimebox('setText', rows[0].registeredTime);
		 $("input[name='updateLegalRepresentative']").val(rows[0].legalRepresentative);
		 $("input[name='updateEmail']").val(rows[0].cpyEmail);
		 $("input[name='updatePostCode']").val(rows[0].cpyPostCode);
		 
		 //企业二维码图片
		if(rows[0].qrcodeOfCompany!=""){
			$("#updateEmQRCodeOfCompanyImg").attr("src",rows[0].qrcodeOfCompany);
		}
		
		//微信公众号图片
		if(rows[0].qrcodeOfWebChat!=""){
			$("#updateqrcodeOfWebChatImg").attr("src",rows[0].qrcodeOfWebChat);
		}
		//企业商标图片
		if(rows[0].trademark!=""){
			$("#updatetrademarkImg").attr("src",rows[0].trademark);
		}
		 
		 //设置人员数量
		 $("#updateEmployeeAmout").numberbox('setValue',rows[0].employeeAmout);
		 $("#updateEmployeeAmout").numberbox('setText',rows[0].employeeAmout);
		 $("input[name='updateContact']").val(rows[0].contact);
		 $("input[name='updateContactTehpone']").val(rows[0].cpyContactTelphone);
		 $("input[name='updateFax']").val(rows[0].cpyFax);
		 if(rows[0].cpyType=="0"){
			 $("#updateType").combobox('setValue',rows[0].cpyType);
			 $("#updateType").combobox('setText',"本企业");
		 }else if(rows[0].cpyType=="1"){
			 $("#updateType").combobox('setValue',rows[0].cpyType);
			 $("#updateType").combobox('setText',"供应商");
		 }
		 $("input[name='updateProduceScale']").val(rows[0].produceScale);
		 $("input[name='updateAddress']").val(rows[0].cpyAddress);
	}
	
	/**
	 * 判断修改是否符合条件
	 */
	function isCanUpdate(){
		if(!$("input[name='updateCreditCode']").validatebox('isValid')){			//判断是否输入编号
			$("input[name='updateCreditCode']").focus();
			return false;
		}else if(!$("input[name='updateName']").validatebox('isValid')){
			$("input[name='updateName']").focus();
			return false;
		}else if(!$("input[name='updatetelphone']").validatebox('isValid')){
			$("input[name='updatetelphone']").focus();
			return false;
		}else if(!$("input[name='updateBankOfDeposit']").validatebox('isValid')){
			$("input[name='updateBankOfDeposit']").focus();
			return false;
		}else if(!$("input[name='updateAccount']").validatebox('isValid')){
			$("input[name='updateAccount']").focus();
			return false;
		}else if(!$("input[name='updateBusiness']").validatebox('isValid')){
			$("input[name='updateBusiness']").focus();
			return false;
		}else if($("input[name='updateRegisteredCapital']").val()==""){
			toPrompt('提示消息','请输入注册资本');
			return false;
		}else if($("input[name='updateRegisteredTime']").val()==""){
			toPrompt('提示消息','请选择注册时间');
			return false;
		}else if(!$("input[name='updateLegalRepresentative']").validatebox('isValid')){
			$("input[name='updateLegalRepresentative']").focus();
			return false;
		}else if($("#updateType").combobox('getValue')==""){  					//选择企业类型
			toPrompt('提示消息','请选择企业类型');
			return false;
		}else if(!$("input[name='updateAddress']").validatebox('isValid')){
			$("input[name='updateAddress']").focus();
			return false;
		}else{
			return true;
		}
	}
	
	/**
	 * 符合条件时进行更新
	 */
	//更新的方法
		function  updateEnterpriseRow(){
				 $.messager.confirm('提示','确认修改?',function(data){
				   if(data){
					   														//获得所有选中的行
					   var rows=$("#enterpriseNews").datagrid('getSelections');
					   
					   														//获得当前选中行的索引
					   var rowIndex = rows[0].id;
					   
					   														//进行数据交互
					   
					   $("#enterpriseNews").datagrid('load');					//调用该方法刷新当前页
					   toPrompt('更新提示','是否更新成功');
					   $('#updateEnterpriseBox').dialog('close');			//关闭修改窗体
				   }
			   });
			
		}
	
	
	
	/**
	 * 点击右键出现菜单的执行更新的事件
	 */
		$("#updateEnterprise").click(function(){
			openEnterPriseUpdateBox();
		});
	
	/**
	 * 点击右键出现菜单执行删除事件
	 */
		$("#deleteEnterprise").click(function(){
			var rows=$("#enterpriseNews").datagrid('getSelections')
			epRemoveNowRow(rows);
		});
	
	/**
	   * 点击右键出现菜单的查看详情的事件
	 */
	$("#detailEnterprise").click(function(){
			watchEnterpriseNews();
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

	
	/**
	 * datagrid中查看企业详细信息的事件,obj参数就是选中查看行的id值
	 */
	function watchEnterpriseNews(){
		console.log(grobal);
		var rows=$('#enterpriseNews').datagrid('getSelections');
		if(rows.length==1){
			getEnterpriseText(rows);
			$("#enterpriseDetailNewBox").dialog('open');
		}else if(rows.length==0){
			$.messager.alert('温馨提示','请选择需要查看的企业信息','warning');
		}else if(rows.length>1){
			$.messager.alert('温馨提示','每次只能查看一个企业的信息','warning');
		}
		
	}
	
	/**
	 * 获得选中的企业信息并设置到企业详细信息中
	 */
	function getEnterpriseText(rows){
		
		$("#disEName").text(rows[0].cpyName);;
		$("#disCreditCode").text(rows[0].creditCode);
		$("#disLegalRepresentative").text(rows[0].legalRepresentative);
		$("#disAccount").text(rows[0].cpyAccount);
		$("#disBankOfDeposit").text(rows[0].bankOfDeposit);
		$("#disRegisteredCapital").text(rows[0].registeredCapital);
		$("#disAddress").text(rows[0].cpyAddress);
		$("#disBusiness").text(rows[0].business);
		
		//生产规模
		if(rows[0].produceScale!=""){
			$("#disProduceScale").text(rows[0].produceScale);
		}else{
			$("#disProduceScale").text("无");
		}
		
		//企业类型
		if(rows[0].cpyType!="0"){
			$("#disEType").text("本企业");
		}else if(rows[0].cpyType!="1"){
			$("#disEType").text("供应商");
		}
		$("#disRegisteredTime").text(rows[0].registeredTime);
		//人员数量
		if(rows[0].employeeAmout!=""){
			$("#disEmployeeAmout").text(rows[0].employeeAmout);
		}else{
			$("#disEmployeeAmout").text("无");
		}
		
		//邮政编码
		if(rows[0].cpyPostCode!=""){
			$("#disPostcode").text(rows[0].cpyPostCode);
		}else{
			$("#disPostcode").text("无");
			}
		
		//商标
		if(rows[0].trademark!=""){
			$("#disTrademark").attr("src",rows[0].trademark);
		}
		//公司图片
		if(rows[0].qrcodeOfCompany!=""){
			$("#disQRCodeOfCompany").attr("src",rows[0].qrcodeOfCompany);
		}
		//微信公众号图片
		if(rows[0].qrcodeOfWebChat!=""){
			$("#disQRCodeOfWebChat").attr("src",rows[0].qrcodeOfWebChat);
		}
		
		//联系信息
		$("#eTelphone").text(rows[0].cpyTelphone);
		if(rows[0].cpyEmail!=""){
			$("#eEail").text(rows[0].cpyEmail);
		}else{
			$("#eEail").text("无");
		}
		
		//企业联系人
		if(rows[0].contact!=""){
			$("#eContact").text(rows[0].contact);
		}else{
			$("#eContact").text("无");
		}
		
		//企业联系人电话
		if(rows[0].cpyContactTelphone!=""){
			$("#eContactTehpone").text(rows[0].cpyContactTelphone);
		}else{
			$("#eContactTehpone").text("无");
		}
		
		//邮政
		if(rows[0].cpyFax!=""){
			$("#eContactTeFaxehpone").text(rows[0].cpyFax);
		}else{
			$("#eFax").text("无");
		}
		
	}
	
	

//	function coursePptChange(obj){
//	  var MyTest = $(obj).files[0];
//	  var reader = new FileReader();
//	  reader.readAsDataURL(MyTest);
//	  reader.onload = function(theFile) {
//	  var image = new Image();
//	  image.src = theFile.target.result;
//	  image.onload = function(){
//	  if(this.width > 2208 || this.height >1242){
//	  $.messager.alert("系统提示信息","ppt图片的最大宽度为 2208 像素，最大高度为 1242 像素！","info");
//	   $("#pptPic").val("");
//	  return false;
//	 }
//	 };
//	 };
//	}

	
	
//	 上传图片 
	function fileup(obj){
		var imgsrc=$(obj).filebox("getValue");
		console.log(imgsrc);
		var file=$(obj).context.ownerDocument.activeElement.files[0];
		console.log(getObjectURL(file));
		alert(getObjectURL(file));
		$("#showImg").attr("src",getObjectURL(file))
		$("#aa").dialog('open');
	}

	function getObjectURL(file){
		var url=null;
		if(window.createObjectURL!=undefined){
			url=window.createObjectURL(file);
		}else if(window.URL!=undefined){
			url = window.URL.createObjectURL(file);
		}else if(window.webkitURL != undefined){
			url = window.webkitURL.createObjectURL(file)
		}
		return url;
	}
	

	/**
	 * 显示图片
	 */
	$("#displayImg").dialog({
		title : '图片展示',
		width : 400,
		height : 400,
		closed : true,
	});
	
	

	

//$("input[name='legalRepresentative']").click(function(){
//	alert($("#QRCodeOfCompany").filebox('getValue'));
//});


