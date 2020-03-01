$(function() {
	
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
	
	//重写控件进行验证添加的部门的编号是否已经使用
	$.extend($.fn.validatebox.defaults.rules, {    
	    isExist: {    
	        validator: function(value, param){
	        	if((value.length<3)||(value.length>10)){
	        		$.fn.validatebox.defaults.rules.isExist.message = "输入的编号必须介于3到10为之间";
	        		return false;
	        	}
	        		var result = $.ajax({
	                         url: param[0],								//远程的访问的地址
	                         data: param[1]+"="+value,					//组合name的时行形成如:username:1234
	                         async: false,
	                         type: "post"
	                     }).responseText;
	                     if(result=="false"){
	                     	$.fn.validatebox.defaults.rules.isExist.message = "部门编号已经存在,请重新输入";
	                     	return false;
	                     }else if(result=="true"){
	                     	return true;
	                     }
	        },    
	        message: '输入编号可以使用'   
	    }    
	}); 
	
	
	/* datagrid显示企业信息 */
	$("#dmpNewsBox").datagrid({
		url : 'departmentPage.json',
		fit : true,
		fitColumns : true,
		border : false,
		striped : true,
		rownumbers : true,
		method: "POST",
		pagination:true,
		pageSize:10,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		nowrap:true,
		idField:'dptId',
		pageList:[10,20,30,40],
		scrollbarSize:12,
		toolbar:'#dmNavsBox',
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [ [
			{
				field : 'dptId',
				title : '部门序号',
				align:'center',
				checkbox :true
			},
			{
				field : 'dptName',
				title : '部门名称',
				width : 100,
				align:'center'
			},
			{
				field : 'company',
				title : '所属公司',
				width : 150,
				align:'center'
			},
			{
				field : 'dptDesc',
				title : '部门描述',
				width : 500,
				align:'center',
				formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return val;}}
			}
			
		] ],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			e.preventDefault();
			$("#depMenuBox").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$(this).datagrid('unselectAll');
			$(this).datagrid('selectRow',rowIndex);
		}
		 
	});
	
	/* 更新界面 */
	$("#demUpdateFormBox").dialog({
		width:1025,
		height:300,
		title:'部门更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				udpNews();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#demUpdateFormBox").dialog('close');
			}
		}]

	});
	
	/* 查询界面 */
	$("#demSearchFormBox").dialog({
		width:1020,
		height:180,
		title:'查询部门界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				searchInputDepartment();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#demSearchFormBox").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#demSearchFormBox input").val("");
			}
		}]
	});
	
	dmpInit();								//初始化
});

$("#dmAddBT").linkbutton({					//添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		if(!$("input[name='dptId']").validatebox('isValid')){
			$("#dptId").focus();
		}else if(!$("input[name='depName']").validatebox('isValid')){
			$("input[name='depName']").focus();
		}else{
			toPrompt("添加部门提示","添加成功");
		}
		
	}
});
$("#dmDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		deleteChooseDepartment();
	}
});
$("#dmUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		updateChooseDeapartment();
	}
});
$("#dmSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#demSearchFormBox").dialog('open');
	}
});
$("#dmOutput").linkbutton({						//导出
	plain:true,
	iconCls:'icon-large-smartart'
});
$("#dmClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#inputContentBox input").val("");
		$("#depBriefNews").val("");
	}
});
$("#dmCallbackBt").linkbutton({				    //返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


/* 初始化规定 */
function dmpInit(){
	
	//编号
	$("input[name='dptId'],input[name='updateDptId']").validatebox({
		 required: true,
		 missingMessage:"请输入部门编号",
		 validType : 'isExist["demo","departmentID"]',								//demo表示提交验证的路径,username表示对应的键,值是输入在文本框的值
		 delay:1000,															//delay表示输入文本后多少时间向后台验证是否存在该编号
	});
	
	/* 部门名称 */
	$("input[name='depName'],input[name='updateDepName']").validatebox({
		 required: true,
		 missingMessage:"请输入部门名称",
	});
	
	/* 所属公司 */
	$("input[name='company'],input[name='updateCompany'],input[name='searchDemCompany']").combogrid({
		panelWidth:1000,
		panelHeight:'auto',
	    idField:'id',
	    fitColumns:true,    
	    textField:'name',    
	    url:'companyDemo.json', 
	    editable:false,
	   	nowrap:false, 
	   	scrollbarSize:12,
	    columns:[[    
	        {field:'id',title:'编号',width:60,align:'center'},    
	        {field:'name',title:'企业名称',width:250,align:'center'},
	        {field:'cpyTelphone',title:'企业电话',width:100,align:'center'},
	        {field:'legalRepresentative',title:'法定代表人',width:120,align:'center'},
	        {field:'contact',title:'企业联系人',width:120,align:'center'},
	        {field:'cpyContactTelphone',title:'联系人电话',width:120,align:'center'},
	        {field:'cpyEmail',title:'企业邮箱',width:120,align:'center'},
	        {field:'cpyFax',title:'企业传真',width:120,align:'center'},
	        {field:'cpyAddress',title:'企业地址',width:250,align:'center'},
	    ]]    
	});
	
}


//提示信息通用的方法
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:100
	});
}

//删除选中记录
function deleteChooseDepartment(){
	var rows=$("#dmpNewsBox").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除某某条数据成功");
				var ids = [];												//用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									//将选定的行的id加入到数组中
				}
																			//获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			//进行后台数据交互
				
				
				$("#dmpNewsBox").datagrid('load');						//调用该方法刷新当前页
				$("#dmpNewsBox").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//更新部门方法
function updateChooseDeapartment(){
	var rows=$("#dmpNewsBox").datagrid('getSelections');
	if(rows.length==1){
		upGetValue(rows);
		$("#demUpdateFormBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中的记录的数据,传递到更新界面
function upGetValue(rows){
	//部门名称
	if(rows[0].dptId!=""){
		$("#updateDptId").val(rows[0].dptId);
	}
	
	//部门名称
	if(rows[0].dptName!=""){
		$("#updateDepName").val(rows[0].dptName);
	}
	
	//所属公司
	if(rows[0].company!=""){
		 $("#updateCompany").combogrid('setValue',rows[0].company);
		 $("#updateCompany").combogrid('setText',rows[0].company);
	}
	
	//公司简介
	if(rows[0].dptDesc!=""){
		 $("#updateDptDesc").val(rows[0].dptDesc);
	}
}

//确认更新数据方法
function udpNews(){
	if(!$("input[name='updateDptId']").validatebox('isValid')){
		$("#updateDptId").focus();
	}else if(!$("input[name='updateDepName']").validatebox('isValid')){
		$("input[name='updateDepName']").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('修改信息提示','是否修改成功');
				$("#demUpdateFormBox").dialog('close');
			}
		});
	}
}


/* 查询部门方法 (如果不输入则自动查询全部的)*/
function searchInputDepartment(){
	var dID=$("input[name='searchDptId']").val();
	var dName=$("input[name='searchDemDepName']").val();
	var dCompany=$("input[name='searchDemCompany']").val();
	if(dID==""&&dName==""&&dCompany==""){
		//查询全部信息
	}
	toPrompt('查询信息提示','是否查询成功');
	$("#demSearchFormBox").dialog('close');
}

/* 删除当前行的方法 */
function depDeleteChooseRow(){
	var rows=$("#dmpNewsBox").datagrid('getSelections');
	if(rows.length==1){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除某某条数据成功");
				
				$("#dmpNewsBox").datagrid('load');						//调用该方法刷新当前页
				$("#dmpNewsBox").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else if(rows.length>1){
		$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

/* 右键菜单更新按钮事件 */
$("#depUpdateMenu").click(function(){
	updateChooseDeapartment();
});

/* 右键菜单删除按钮事件 */
$("#depDeletMenu").click(function(){
	depDeleteChooseRow();
});





