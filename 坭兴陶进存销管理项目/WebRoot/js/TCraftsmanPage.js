$(function(){
	/**
	 * 重写验证身份证号码是否正确的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
		isRightIDCard : {//  验证传真  
			validator : function(value) {  
			var idCard=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		    return idCard.test(value);  
			   },  
			   message : '身份证号码不正确'  
			},  
	}); 
	
	
	/**
	 * 重写验证手机号码 的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
	    isTcmRightPhone: {    
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
	
	
	/*显示信息*/
	$('#TcmTable').datagrid({
		url : "TCraftsmanPage.json",
		fit:true,
		border:false,
		method: "GET",
		striped:true,
		pagination:true,
		pageSize:10,
		pageList:[10,20,30,40],
		sortName:'cfmId',
		sortOrder:'asc',
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		rownumbers:true,
		remoteSort:false, // 定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   // 隔行换色
			}
		},
		toolbar : '#TcmDivBox',
	
			// fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'cfmId',title:'序号',align:'center',width:50,checkbox: true,},
        	{field:'cfmPic',title:'图片',align:'center',width:60,
				formatter: function(value,row,index){
					if (value!=""){
						return "<img style='width:24px;height:30px;padding-top:5px;position: relative;' src='"+value+"' onmouseover='disPlayImage(this)' onmouseout='cancelDisImg(this)'>";
					} else {
						return "暂无";
					}
				},
        	},
        	{field:'cfmName',title:'姓名',align:'center',width:120},      
        	{field:'idCard',title:'身份证号',align:'center',width:250,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	},
        	{field:'cfmBirthday',title:'出生年月',align:'center',width:120,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	},
        	{field:'nativePlace',title:'籍贯',align:'center',width:160,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	},
        	{field:'policitalStatus',title:'政治面貌',align:'center',width:120,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	},
        	{field:'cfmTitle',title:'职称',align:'center',width:120,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'qualification',title:'学历',align:'center',width:150,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'duty',title:'职务',align:'center',width:150,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	},
        	{field:'cfmTelphone',title:'联系电话',align:'center',width:130,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'cfmPostCode',title:'邮政编号',align:'center',width:130,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'strongPoint',title:'特长',align:'center',width:250,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'awards',title:'获奖情况',align:'center',width:250,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'cfmAddress',title:'地址',align:'center',width:250,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
        	{field:'professional',title:'专业',align:'center',width:250,
        		formatter: function(value,row,index){
					if (value){
						return value;
					} else {
						return '暂无';
					}
				}
        	}, 
				]],
			onRowContextMenu : function(e, rowIndex, rowdata){										// 右键显示出现操作菜单
			  e.preventDefault();
			 $("#TcmMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			 });
			 $(this).datagrid("clearChecked");
			 $(this).datagrid("clearSelections");
			 $('#TcmTable').datagrid('unselectAll');
			 $('#TcmTable').datagrid('selectRow',rowIndex);
		}
	});
	
	/* 查询出库信息界面 */
	$("#TcmSearchForm").dialog({
		width:1030,
		height:255,
		title:'查询技术人员信息',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				tcmSeachManFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TcmSearchForm").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TcmSearchForm input").val("");
			}
		}]
	});
	
	//更新界面
	$("#TCMUpdateBox").dialog({
		title : '从业人员信息更新界面',
		iconCls : 'icon-edit',
		width : 1068,
		height : 475,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '更新',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   confirTcmUpdateFn();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TCMUpdateBox').dialog('close');			//关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	/* 查看详情界面 */
	 $("#tcmSeeDetailPage").dialog({
		 width:908,
		 height:398,
		 title:'技术人员信息界面',
		 closed : true,
		 modal : true,
	 });
	
	TcmInitFn();				// 调用初始化导航控件方法
});


/* 初始化导航控件 */
function TcmInitFn(){
	$("#TcmAdd").linkbutton({					// 添加
		plain:true,
		iconCls:'icon-add',
		onClick:function(){
			TcmAddFn();
		}
	});
	$("#TcmDelete").linkbutton({					// 删除
		plain:true,
		iconCls:'icon-cancel',
		onClick:function(){
			deletTcmRowsFn();
		}
	});
	$("#TcmUpdate").linkbutton({					// 更新
		plain:true,
		iconCls:'icon-edit',
		onClick:function(){
			openTcmDialogFn();
		}
	});
	$("#TcmSearch").linkbutton({					// 查找
		plain:true,
		iconCls:'icon-search',
		onClick:function(){
			$("#TcmSearchForm").dialog('open');
		}
	});
	$("#Tcmoutput").linkbutton({					// 导出
		plain:true,
		iconCls:'icon-large-smartart',
		onClick:function(){
		}
	});
	$("#TcmClear").linkbutton({						// 清空
		plain:true,
		iconCls:'icon-cancel',
		onClick:function(){
			$("#TcmFormBox input").val("");
			$("#TcmFormBox #TcmUploadImg").val("上传图片");
			$("#TcmFormBox textarea").val("");
		}
	});
	$("#Tcmcallback").linkbutton({				// 返回
		plain:true,
		iconCls:'icon-undo',
		onClick:function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	// 人员姓名
	$("#cfmName,#tcmUcfmName").validatebox({
		required : true,
		missingMessage: '请输入姓名'
	});
	
	// 身份证号码
	$("#idCard,#tcmUidCard").validatebox({
		 validType:'isRightIDCard[]',
	});
	
	// 出生年月
	$("#cfmBirthday,#tcmUcfmBirthday").datebox({
		editable:false
	});
	
	// 电话号码
	$("#cfmTelphone,#tcmUcfmTelphone").validatebox({
		validType:"isTcmRightPhone[]",
	});
	
	// 邮政编码
	$("#cfmPostCode,#tcmUcfmPostCode").validatebox({
		validType:"isRightPostCode[]",
	});
	
	// 学历
	$("#qualification,#tcmSqualification,#tcmUqualification").combobox({
		// url:'指向查询数据的地址'(此处的data只是做临时数据,当有url执行的json数据时,可以删除)
		valueField: 'value',
		textField: 'label',
		editable:false,
		panelHeight : 'auto',
		data: [{
			label: '小学',
			value: '小学'
		},{
			label: '初中',
			value: '初中'
		},{
			label: '高中/中职',
			value: '高中/中职'
		},{
			label: '专科',
			value: '专科'
		},{
			label: '本科',
			value: '本科'
		},{
			label: '硕士研究生',
			value: '硕士研究生'
		},{
			label: '博士研究生',
			value: '博士研究生'
		}],
	});
	
	// 政治面貌
	$("#policitalStatus,#tcmSpolicitalStatus,#tcmUpolicitalStatus").combobox({
		url:'PolitiCalStatus.json',
		valueField: 'value',
		textField: 'label',
		editable:false,
		panelHeight:'200',
	});
	
}

/* 添加界面上传图片方法 */
$("#TcmUploadImg").click(function(){
	// 显示选中的图片
	$("#cfmPic").css('display','inline-block');			
});

/* 更新界面上传图片方法 */
$("#TcmUploadImgInUpdatePage").click(function(){
	//修改图片的路径
	$("#tcmCfmPic").attr('src','对应路径的值');
	// 显示选中的图片
	$("#tcmCfmPic").css('display','inline-block');	
	alert('点击了更新界面');
});


/* 当输入省份中的框失去焦点时根据身份证产成相应的出生日期和籍贯 */
$("#idCard").blur(function(){
if($("#idCard").validatebox('isValid')){
	getJSon();
	}
});


// 根据身份证生成对应的年月和籍贯
function getJSon(){
	var jsonLength=0;
	var mySite = {};
	var value=$("#idCard").val();
	$.ajax({
		url:"nativeCity.json",  // 文件地址
		type:"GET",     		// 数据传递方式
		dataType:"JSON",  		// 数据类型
		success:function(data){ // 获取数据成功执行的函数
			jsonLength=data.length;
			 mySite.cityData=data;
			// 获得出生日期
	         if(value.length==15){
	             var year = "19"+value.substring(6,8)+"-"+value.substring(8,10)+"-"+value.substring(10,12);
	             $("#cfmBirthday").datebox('setValue',year);
	             $("#cfmBirthday").datebox('setText',year);
	         }
	         if(value.length==18){
	             var year = value.substring(6,10)+"-"+value.substring(10,12)+"-"+value.substring(12,14);
	             $("#cfmBirthday").datebox('setValue',year);
	             $("#cfmBirthday").datebox('setText',year);
	         }
	         // 判断籍贯
	         for (var i = 0; i < jsonLength; i++) {
	           if(value.substring(0,6)==mySite.cityData[i].code){
	        	   $("#nativePlace").val(mySite.cityData[i].title);					// 将籍贯的值设置到对应的输入框中
	           }
	        }
	         
		}
	});

}

// 判断是否符合添加技术人员的方法
function TcmIsCanAdd(){
	if(!$("#cfmName").validatebox('isValid')){
		$("#cfmName").focus();
		return false;
	} 
	if($("#idCard").val()!=""){
		if(!$("#idCard").validatebox('isValid')){
			$("#idCard").focus();
			return false;
		}
	} 
	if($("#cfmTelphone").val()!=""){
		if(!$("#cfmTelphone").validatebox('isValid')){
			$("#cfmTelphone").focus();
			return false;
		}
	}
	if($("#cfmPostCode").val()!=""){
		if(!$("#cfmPostCode").validatebox('isValid')){
			$("#cfmPostCode").focus();
			return false;
		}
	}
	return true;
}




// 添加新的技术人员信息的方法
function TcmAddFn(){
	var value=TcmIsCanAdd();
	if(value){
		toPrompt('添加信息提示','添加技术人员信息成功!');
		$('#TcmTable').datagrid('load');
	}
}

//  删除选中记录
function deletTcmRowsFn(){
	var rows=$("#TcmTable").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除某某条数据成功");
				var ids = [];												// 用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									// 将选定的行的id加入到数组中
				}
																			// 获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			// 进行后台数据交互
				
				
				$("#TcmTable").datagrid('load');						// 调用该方法刷新当前页
				$("#TcmTable").datagrid('unselectAll');					// 删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

// 查询信息的方法
function tcmSeachManFn(){
	toPrompt('查询信息提示','是否查询成功');
	$("#TcmSearchForm").dialog('close');
}

// 打开更新窗体
function openTcmDialogFn(){
	var rows=$("#TcmTable").datagrid('getSelections');
	if(rows.length==1){
		getTcmRowsValue(rows);
		$("#TCMUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中行的信息并传递到更新界面放过
function getTcmRowsValue(rows){
	
	// 进来前先将之前查询的img的src值置为空，防止下一次更新的时候重复显示上一次的图片
	$("#tcmCfmPic").attr('src',"");
	
	// 姓名
	$("#tcmUcfmName").val(rows[0].cfmName);
	
	// 身份证号
	$("#tcmUidCard").val(rows[0].idCard);
	
	// 职称‘
	$("#tcmUcfmTitle").val(rows[0].cfmTitle);
	
	//图片
	if(rows[0].cfmPic!=""){
		$("#tcmCfmPic").attr('src',rows[0].cfmPic);
		$("#tcmCfmPic").css('display','inline-block');	
	}
	
	// 政治面貌
	if(rows[0].policitalStatus!=""){
		$("#tcmUpolicitalStatus").combobox('setValue',rows[0].policitalStatus);
		$("#tcmUpolicitalStatus").combobox('setText',rows[0].policitalStatus);
	}
	
	// 学历
	if(rows[0].qualification!=""){
		$("#tcmUqualification").combobox('setValue',rows[0].qualification);
		$("#tcmUqualification").combobox('setText',rows[0].qualification);
	}
	
	// 出生年月
	if(rows[0].cfmBirthday!=""){
		$("#tcmUcfmBirthday").datebox('setValue',rows[0].cfmBirthday);
		$("#tcmUcfmBirthday").datebox('setText',rows[0].cfmBirthday);
	}
	
	// 联系电话
	$("#tcmUcfmTelphone").val(rows[0].cfmTelphone);
	
	// 邮政编码
	$("#tcmUcfmPostCode").val(rows[0].cfmPostCode);
	
	// 籍贯
	$("#tcmUnativePlace").val(rows[0].nativePlace);
	
	// 职务
	$("#tcmUduty").val(rows[0].duty);
	
	// 特长
	$("#tcmUstrongPoint").val(rows[0].strongPoint);
	
	//地址
	$("#tcmUcfmAddress").val(rows[0].cfmAddress);
	
	//获奖情况
	$("#tcmUawards").val(rows[0].awards);
	
	//专业
	$("#tcmUprofessional").val(rows[0].professional);
	
}

// 判断是否符合更新的条件
function tcmIsCanUpdateFn(){
	// 姓名
	if(!$("#tcmUcfmName").validatebox('isValid')){
		$("#tcmUcfmName").focus();
		return false;
	} 
	// 身份证号
	if($("#tcmUidCard").val()!=""){
		if(!$("#tcmUidCard").validatebox('isValid')){
			$("#tcmUidCard").focus();
			return false;
		}
	} 
	//联系电话
	if($("#tcmUcfmTelphone").val()!=""){
		if(!$("#tcmUcfmTelphone").validatebox('isValid')){
			$("#tcmUcfmTelphone").focus();
			return false;
		}
	}
	//邮政编号
	if($("#tcmUcfmPostCode").val()!=""){
		if(!$("#tcmUcfmPostCode").validatebox('isValid')){
			$("#tcmUcfmPostCode").focus();
			return false;
		}
	}
	return true;
}

//更新界面中的确认修改
function confirTcmUpdateFn(){
	var l=tcmIsCanUpdateFn();
	if(l){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$('#TcmTable').datagrid('load');			// 刷新当前页
				$("#TCMUpdateBox").dialog('close');
				toPrompt('更新提示','更新人员信息成功');
			}
		});
		
	}
}

//查看详情
function seeTcmDetail(){
	var rows=$("#TcmTable").datagrid('getSelections');
	if(rows.length==1){
		getTcmRowDetailNews(rows);
		$("#tcmSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

// 将选中的信息传导详细界面
function getTcmRowDetailNews(rows){
	
	//初始化时将Img的src设置为空防止显示上一次的图片
	$("#tcmManImg").attr('src',"");
	
	// 姓名
	$("#tcmDcfmName").text(rows[0].cfmName);
	
	// 身份证号码
	if(rows[0].idCard!=""){
		$("#tcmDidCard").text(rows[0].idCard);
	}else{
		$("#tcmDidCard").text("暂无");
	}
	
	// 出生年月
	if(rows[0].cfmBirthday!=""){
		$("#tcmDcfmBirthday").text(rows[0].cfmBirthday);
	}else{
		$("#tcmDcfmBirthday").text("暂无");
	}
	
	// 政治面貌
	if(rows[0].policitalStatus!=""){
		$("#tcmDpolicitalStatus").text(rows[0].policitalStatus);
	}else{
		$("#tcmDpolicitalStatus").text("暂无");
	}
	
	// 职称
	if(rows[0].cfmTitle!=""){
		$("#tcmDcfmTitle").text(rows[0].cfmTitle);
	}else{
		$("#tcmDcfmTitle").text("暂无");
	}
	
	// 学历
	if(rows[0].qualification!=""){
		$("#tcmDqualification").text(rows[0].qualification);
	}else{
		$("#tcmDqualification").text("暂无");
	}
	
	// 联系电话
	if(rows[0].cfmTelphone!=""){
		$("#tcmDcfmTelphone").text(rows[0].cfmTelphone);
	}else{
		$("#tcmDcfmTelphone").text("暂无");
	}
	
	// 邮政编码
	if(rows[0].cfmPostCode!=""){
		$("#tcmDcfmPostCode").text(rows[0].cfmPostCode);
	}else{
		$("#tcmDcfmPostCode").text("暂无");
	}
	
	// 籍贯
	if(rows[0].nativePlace!=""){
		$("#tcmDnativePlace").text(rows[0].nativePlace);
	}else{
		$("#tcmDnativePlace").text("暂无");
	}
	
	// 职务
	if(rows[0].duty!=""){
		$("#tcmDduty").text(rows[0].duty);
	}else{
		$("#tcmDduty").text("暂无");
	}
	
	// 特长
	if(rows[0].strongPoint!=""){
		$("#tcmDstrongPoint").text(rows[0].strongPoint);
	}else{
		$("#tcmDstrongPoint").text("暂无");
	}
	
	// 地址
	if(rows[0].cfmAddress!=""){
		$("#tcmDcfmAddress").text(rows[0].cfmAddress);
	}else{
		$("#tcmDcfmAddress").text("暂无");
	}
	
	// 获奖情况
	if(rows[0].awards!=""){
		$("#tcmDawards").text(rows[0].awards);
	}else{
		$("#tcmDawards").text("暂无");
	}
	
	// 专业
	if(rows[0].professional!=""){
		$("#tcmDprofessional").text(rows[0].professional);
	}else{
		$("#tcmDprofessional").text("暂无");
	}
	
	//图片
	if(rows[0].cfmPic!=""){
		$("#tcmManImg").attr('src',rows[0].cfmPic);
	}
	
	
	
}


/* 右键弹出菜单 */

// 更新事件
$("#TcmUpdateMenu").click(function (){			
	openTcmDialogFn();
});


// 删除事件
$("#TcmDeletMenu").click(function (){
	deletTcmRowsFn();
});

// 查看详情事件
$("#TcmSeeMenu").click(function (){
	seeTcmDetail();
});


//  鼠标移动到图片上执行的方法
function disPlayImage(value){
	var imgPath=$(value).attr('src');
	getXandY(value);
	$("#disImgBox").css('display','inline-block')
	$("#disChooseImg").attr('src',imgPath);
}

//  鼠标移走时执行的方法
function cancelDisImg(value){
	var imgPath=$(value).attr('src');
	$("#disImgBox").css('display','none');
}

//  获得当前鼠标的x,y轴的值
function getXandY(l){
     $(l).mousemove(function(e) {
         xx= e.pageX || e.clientX;
         yy = e.pageY || e.clientY;
         $("#disImgBox").css('top',yy-270);
         $("#disImgBox").css('left',xx-130);
     });
};

//  提示信息通用的方法
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:105
	});
}