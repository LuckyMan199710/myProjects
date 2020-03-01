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
	
	$("#disMWhpGrid").datagrid({
		url : 'mWarehousePage.json',
		fit : true,
		border : false,
		striped : true,
		rownumbers : true,
		method: "POST",
		pagination:true,
		pageSize:10,
		idField:'mwhId',
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pageList:[10,20,30,40],
		scrollbarSize:12,
		toolbar:'#mWhpNavsBox',
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [ [
			{
				field : 'mwhId',
				title : '部门管理序号',
				align:'center',
				checkbox :true
			},
			{
				field : 'empName',
				title : '管理人',
				width : 160,
				align:'center'
			},
			{
				field : 'warehouseName',
				title : '仓库名称',
				width : 250,
				align:'center'
			},
			
			{
				field : 'warehouseType',
				title : '仓库类型',
				width : 160,
				align:'center'
			},
			{
				field : 'mwhStatus',
				title : '仓库状态',
				width : 160,
				align:'center',
				formatter : function(value,row,index){
	        		if(value=="1"){
	        			return '可用'
	        		}else{
	        			return '不可用'
	        		}
	        	},
	        	styler : function(value,row,index){
	        		if(value=="1"){
	        			return 'color:green'
	        		}else{
	        			return 'color:red'
	        		}
	        	}
			},
			{
				field : 'department',
				title : '员工部门',
				width : 160,
				align:'center'
			},
			{
				field : 'empTelphone',
				title : '员工电话',
				width : 160,
				align:'center'
			},
			{
				field : 'empEmail',
				title : '员工邮箱',
				width : 160,
				align:'center'
			},
			{
				field : 'empAddress',
				title : '员工地址',
				width : 350,
				align:'center',
				formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return val;}}
			},
			{
				field : 'warehouseAddress',
				title : '仓库地址',
				width : 350,
				align:'center',
				formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return val;}}
			}
		] ],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			e.preventDefault();
			$("#mwhpMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$(this).datagrid('unselectAll');
			$(this).datagrid('selectRow',rowIndex);
	    }
		 
	});
	
	/* 更新窗体 */
	$("#mWhpUpdateBox").dialog({
		width:1020,
		height:173,
		title:'仓库管理信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				confirmUpdateWhpNews();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#mWhpUpdateBox").dialog('close');
			}
		}]
	});
	
	/* 查询窗体 */
	$("#mWhpSearchBox").dialog({
		width:1020,
		height:173,
		title:'仓库管理信息查询界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				searchWhpNews();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#mWhpSearchBox").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#mWhpSearchBox input").val("");
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#warehouseAndManagerNews").dialog({
		 width:903,
		 height:390,
		 title:'详细信息界面',
		 closed : true,
		 modal : true,
	 });
	
	mWhpInit();
});

/* 导航栏样式设置 */
$("#mWhpAddBT").linkbutton({					//添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		var mWhpEmployeeId = $("#mWhpEmployeeId");			//员工编号
		var mWhpwareHouseId = $("#mWhpwareHouseId");		//仓库编号
		var mWhpMwhStatus = $("#mWhpMwhStatus");			//状态
		var a=addMWhpNews(mWhpEmployeeId,mWhpwareHouseId,mWhpMwhStatus);
		if(a){
			$("#disMWhpGrid").datagrid('load');
			toPrompt('添加信息提示','添加成功');
		}
	}
});
$("#mWhpDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		deletMWhpChooseRows();
	}
});
$("#mWhpUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		updateWMhpRows();
	}
});
$("#mWhpSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#mWhpSearchBox").dialog('open');
	}
});
$("#mWhpOutput").linkbutton({					//导出
	plain:true,
	iconCls:'icon-large-smartart'
});
$("#mWhpClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#mWhpInputBox").find("input").val("");
	}
});
$("#mWhpCallbackBt").linkbutton({				 //返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});

/* 管理仓库界面输入控件限制 */
function mWhpInit(){
	
	//用户名称
	$("#mWhpEmployeeId,#updatemWhpEmployeeId").combogrid({
		panelWidth:1200,
		panelHeight:'132',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName',    
	    url:'column.json', 
	    editable:false,
	   	nowrap:false, 
	   	scrollbarSize:12,
	   	sortName:'employeeId',
		sortOrder:'asc',
	    columns:[[    
	        {field:'employeeId',title:'员工编号',width:100,align:'center',sortable:true},    
	        {field:'empName',title:'员工名称',width:100,align:'center'},
	        {field:'department',title:'所属部门',width:100,align:'center'},
	        {field:'role',title:'员工角色',width:100,align:'center'},
	        {field:'empTelphone',title:'联系电话',width:120,align:'center'},
	        {field:'empEmail',title:'电子邮箱',width:120,align:'center'},
	        {field:'aStatus',title:'状态',width:80,align:'center',
	        	formatter : function(value,row,index){
	        		if(value=="1"){
	        			return '激活'
	        		}else{
	        			return '失效'
	        		}
	        	},
	        	styler : function(value,row,index){
	        		if(value=="1"){
	        			return 'color:green'
	        		}else{
	        			return 'color:red'
	        		}
	        	}
	        },
	        {field:'empAddress',title:'员工地址',width:300,align:'center'},
	    ]]
	    
	});
	
	//仓库名称
	$("#mWhpwareHouseId,#updatemWhpwareHouseId").combogrid({
		panelWidth:800,
		panelHeight:'auto',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url:'warehousecomboDemo.json', 
	    editable:false,
	   	nowrap:false, 
	   	scrollbarSize:12,
	    columns:[[    
	        {field:'warehouseId',title:'仓库编号',width:80,align:'center'},    
	        {field:'warehouseName',title:'仓库名称',width:100,align:'center'},
	        {field:'warehouseType',title:'仓库类型',width:100,align:'center'},
	        {field:'warehouseAddress',title:'仓库地址',width:250,align:'center'},
	    ]]    
	});
	
	//状态
	$("#mWhpMwhStatus,#updatemWhpMwhStatus,#searchemWhpMwhStatus").combobox({
		valueField: 'value',
		textField: 'label',
		panelHeight:'auto',
		editable:false,
		required:true,
		missingMessage:"请选择状态",
		data: [
			 {
				label: '可用',
				value: '0'
			},{
				label: '不可用',
				value: '1'
			}
		]
	});

}

/* 右键菜单执行的事件 */
$("#mwhpUpdateMenu").click(function(){			//更新
	updateWMhpRows();
});

$("#mwhpDeletMenu").click(function(){			//删除
	removeMWhpChooseRow();
});	

$("#mwhpSeeMenu").click(function(){			    //查看
	seeMWhpDetail();
});	




//添加方法
function addMWhpNews(a,b,c){
	if(a.val()==""){
		toPrompt('添加信息提示','请选择员工编号');
		return false;
	}else if(b.val()==""){
		toPrompt('添加信息提示','请选择仓库编号');
		return false;
	}else if(c.val()==""){
		toPrompt('添加信息提示','请选择状态');
		return false;
	}else{
		return true;
	}
}

//删除方法
function deletMWhpChooseRows(){
	var rows=$("#disMWhpGrid").datagrid('getSelections');
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
				
				
				$("#disMWhpGrid").datagrid('load');						//调用该方法刷新当前页
				$("#disMWhpGrid").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//删除当前行的方法
function removeMWhpChooseRow(){
	/* 删除当前行的方法 */
		var rows=$("#disMWhpGrid").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除某某条数据成功");
					
					$("#disMWhpGrid").datagrid('load');						//调用该方法刷新当前页
					$("#disMWhpGrid").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else if(rows.length>1){
			$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}


//更新方法(打开更新窗体并判断条件)
function updateWMhpRows(){
	var rows=$("#disMWhpGrid").datagrid('getSelections');
	if(rows.length==1){
		getWhpRowValue(rows);
		$("#mWhpUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中的行的信息并传递到更新界面
function getWhpRowValue(rows){
	$("#updatemWhpEmployeeId").combogrid('setValue',rows[0].employeeId);
	$("#updatemWhpEmployeeId").combogrid('setText',rows[0].empName);
	
	$("#updatemWhpwareHouseId").combogrid('setValue',rows[0].wareHouseId);
	$("#updatemWhpwareHouseId").combogrid('setText',rows[0].warehouseName);
	
	$("#updatemWhpMwhStatus").combobox('setValue',rows[0].mwhStatus);
	if(rows[0].mwhStatus=="0"){
		$("#updatemWhpMwhStatus").combobox('setText','不可用');
	}else if(rows[0].mwhStatus=="1"){
		$("#updatemWhpMwhStatus").combobox('setText','可用');
	}
}

//确认更新的方法
function confirmUpdateWhpNews(){
	var muWhpEmployeeId = $("#updatemWhpEmployeeId");			//员工编号
	var muWhpwareHouseId = $("#updatemWhpwareHouseId");		//仓库编号
	var muWhpMwhStatus = $("#updatemWhpMwhStatus");			//状态
	var a=addMWhpNews(muWhpEmployeeId,muWhpwareHouseId,muWhpMwhStatus);
	if(a){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新提示','更新成功');
				$("#mWhpUpdateBox").dialog('close');
			}
		});
	}
}

//查询信息方法(未输入值则默认查询全部)
function searchWhpNews(){
	var a = $("#searchmWhpEmployeeId");			//员工编号
	var b = $("#searchmWhpwareHouseId");		//仓库编号
	var c = $("#searchemWhpMwhStatus");			//状态
	if(a.val()==""&&b.val()==""&&c.val()==""){
		var ba=$("#searchemWhpMwhStatus").combobox('getValue');	//获取仓库类型的值--可以传递到数据库
		//没输入时默认查询全部
	}
	toPrompt('查询提示','查询成功aaaaa');
	$("#mWhpSearchBox").dialog('close');
}

//查看详情
function seeMWhpDetail(){
	var rows=$("#disMWhpGrid").datagrid('getSelections');
	if(rows.length==1){
		getRowDetailNews(rows);
		$("#warehouseAndManagerNews").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

//将选中的信息传导详细界面
function getRowDetailNews(rows){
	//员工编号
	$("#wmDisEmployeeId").text(rows[0].employeeId);
	
	//员工名称
	$("#wmDisEmpName").text(rows[0].empName);
	
	//所属部门
	$("#wmDisDepartment").text(rows[0].department);
	
	//员工电话
	$("#wmDisEmpTelphone").text(rows[0].empTelphone);
	
	//员工邮箱
	$("#wmDisEmpEmail").text(rows[0].empEmail);
	
	//邮政编码
	$("#wmDisEmpPostCode").text(rows[0].empPostCode);
	
	//员工角色
	$("#wmDisRole").text(rows[0].role);
	
	//员工地址
	$("#wmDisEmpAddress").text(rows[0].empAddress);
	
	//仓库编号
	$("#wmDisWarehouseId").text(rows[0].wareHouseId);
	
	//仓库名称
	$("#wmDisWarehouseName").text(rows[0].warehouseName);
	
	//仓库状态
	if(rows[0].mwhStatus=="0"){
		$("#wmDismwhStatus").text("不可用");
		$("#wmDismwhStatus").css({color:"red"});
	}else{
		$("#wmDismwhStatus").text("可用");
		$("#wmDismwhStatus").css({color:"green"});
	}
	
	//仓库管理者
	$("#wmDisManageName").text(rows[0].empName);
	
	//仓库类型
	$("#wmDisWarehouseType").text(rows[0].warehouseType);
	
	//仓库地址
	$("#wmDisWarehouseAddress").text(rows[0].warehouseAddress);
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
