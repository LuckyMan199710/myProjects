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
	
	/* 显示数据table */
	$("#tpdpTable").datagrid({
		fitColumns:true,
		url:'TProcessDetailPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"tpdpExportId",
		pagination:true,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pageSize:10,
		pageList:[10,20,30,40,50],
		border : false,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar:'#tpdpNavForm',
		columns : [[
		            	{field:"tpdpExportId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:'tpdpExportName',title:'委托加工名称',align:'center',width:120,},
		            	{field:"processTypeName",title:"加工类型名称",align:"center",width:120,},
		            	{field:"processStyleName",title:"加工风格名称",align:"center",width:120,},
		            	{field:"tpdpProcessName",title:"加工内容名称",align:"center",width:120,},
		            	{field:"tpdpCraftsmanName",title:"技术人员名称",align:"center",width:120,},
		            	{field:"tpdpWarehouseName",title:"所出仓库名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#tpdpMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
		
	});
	
	/* 更新加工内容信息界面 */
	$("#tpdpUpdateBox").dialog({
		width:770,
		height:200,
		title:'加工明细信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tpdpConfirmUpdateFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tpdpUpdateBox").dialog('close');
			}
		}]
	});
	
	/* 查询界面 */
	$("#tpdpSearchBox").dialog({
		width:770,
		height:200,
		title:'查询加工明细信息界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				tpdpConfirmSearch();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tpdpSearchBox").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#tpdpSearchBox input").val("");
			}
		}]
	});
	
	// 调用初始化参数
	tppInitFn();
});

/* 导航栏和输入控件初始化 */
function tppInitFn(){
	$("#tpdpAddBT").linkbutton({					//添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			tpdpAddRowFn();
		}
	});
	$("#tpdpDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			tpdpDeleteRowsFn();
		}
	});
	$("#tpdpUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			tpdpOpenUpdateBoxFn();
		}
	});
	$("#tpdpSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#tpdpSearchBox").dialog('open');
		}
	});
	$("#tpdpClearBT").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#tpdpNavForm input").val("");
		}
	});
	$("#tpdpOutput").linkbutton({					//导出	
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
		}
	});
	$("#tpdpCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	//委托加工编号
	$("#tpdpExportId,#tpdpSExportId,#tpdpUExportId").combogrid({
		panelWidth:'1100',
		panelHeight:'170',
	    idField:'esspId',
	    fitColumns:true,    
	    textField:'idOfSemiFinishedGoodsName',    
	    url:'TexportSemiGoodsforProcess.json', 
	   	nowrap:false, 
	   	scrollbarSize:12,
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
	        {field:'esspId',title:'编号',width:70,align:'center'},
	        {field:'idOfSemiFinishedGoodsName',title:'名称',width:80,align:'center'},    
	        {field:'esspAmout',title:'数量',width:80,align:'center'},
	        {field:'esspUnitPrice',title:'单价',width:80,align:'center'},    
	        {field:'essOperatorName',title:'经办人',width:80,align:'center'}, 
	        {field:'essWarehouseIdName',title:'所出仓库',width:150,align:'center'},
	        {field:'essExportDate',title:'出库时间',width:120,align:'center'},
	        {field:'essCompanyIdName',title:'公司名称',width:150,align:'center'}, 
	    ]]    
	});
	
	//加工内容编号
	$("#tpdpProcessId,#tpdpSProcessId,#tpdpUProcessId").combogrid({
		panelWidth:'600',
		panelHeight:'200',
	    idField:'processTypeId',
	    fitColumns:true,    
	    textField:'processTypeName',    
	    url:'TProcessContentPage.json', 
	   	nowrap:false, 
	   	scrollbarSize:12,
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
	        {field:'processTypeId',title:'编号',width:100,align:'center'},    
	        {field:'processTypeName',title:'加工名称',width:120,align:'center'},
	        {field:'processStyleName',title:'加工风格',width:120,align:'center'},    
	        {field:'processTypeKey',title:'加工类型',width:120,align:'center'},
	    ]]    
	});
	
	
	//技术人员编号
	$("#tpdpCraftsmanId,#tpdpSCraftsmanId,#tpdpUCraftsmanId").combogrid({
		panelWidth:'900',
		panelHeight:'200',
	    idField:'cfmId',
	    fitColumns:true,    
	    textField:'cfmName',    
	    url:'TCraftsmanPage.json', 
	   	nowrap:false, 
	   	scrollbarSize:12,
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
	        {field:'cfmId',title:'编号',width:70,align:'center'},    
	        {field:'cfmName',title:'名称',width:100,align:'center'},
	        {field:'qualification',title:'学历',width:70,align:'center'},    
	        {field:'duty',title:'职务',width:100,align:'center'},
	        {field:'cfmTelphone',title:'联系电话',width:70,align:'center'},    
	        {field:'cfmAddress',title:'地址',width:100,align:'center'},
	    ]]    
	});
	
	//所出仓库
	$("#tpdpWarehouseId,#tpdpSWarehouseId,#tpdpUWarehouseId").combogrid({
		panelWidth:800,
		panelHeight:'168',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
	   	nowrap:true, 
	   	scrollbarSize:12,
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:160},
					{field:"warehouseName",title:"仓库名称",align:"center",width:260},
					{field:"warehouseTypeName",title:"仓库类型",align:"center",width:160},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]]
	});
};

/**
 * 判断是否满足添加加工明细的方法
 * */
function tpdpIsCandAdd(){
	if($("#tpdpExportId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择委托加工的名称');
		return false;
	}else if($("#tpdpProcessId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择加工内容的名称');
		return false;
	}else if($("#tpdpCraftsmanId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择技术人员');
		return false;
	}else if($("#tpdpWarehouseId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择加工所出仓库');
		return false;
	}else{
		return true;
	}
}

/**
 * 添加加工明细方法
 */
function tpdpAddRowFn(){
	var res=tpdpIsCandAdd();
	if(res){
		toPrompt('添加信息提示','添加加工明细成功');
		// 刷新当前界面
		$("#tpdpTable").datagrid('load');
	}
}

/**
 * 删除选中的记录
 */
function tpdpDeleteRowsFn(){
	var rows=$("#tpdpTable").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除数据成功");
				var ids = [];												//用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									//将选定的行的id加入到数组中
				}
																			//获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			//进行后台数据交互
				
				
				$("#tpdpTable").datagrid('load');						//调用该方法刷新当前页
				$("#tpdpTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

/**
 * 确定查询方法
 */
function tpdpConfirmSearch(){
	// 委托加工名称
	var styleValue=$("#tpdpSExportId").combogrid('getValue');
	// 加工内容名称
	var typeValue=$("#tpdpSProcessId").combogrid('getValue');
	// 技术人员名称
	var styleValue=$("#tpdpSCraftsmanId").combogrid('getValue');
	// 所出仓库名称
	var typeValue=$("#tpdpSWarehouseId").combogrid('getValue');
	toPrompt("查询提示","查询信息成功");
	$("#tpdpSearchBox").dialog('close');
}

/**
 * 打开更新窗口方法
 */
function tpdpOpenUpdateBoxFn(){
	var rows=$("#tpdpTable").datagrid('getSelections');
	if(rows.length==1){
		tpdpGetRowValueFn(rows);								//调用获得选中行的数据的方法
		$("#tpdpUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/**
 * 获得选中需要修改的行的值
 */
function tpdpGetRowValueFn(rows){
	// 委托加工名称
	$("#tpdpUExportId").combogrid('setValue',rows[0].tpdpExportId);
	$("#tpdpUExportId").combogrid('setText',rows[0].tpdpExportName);
	
	// 加工内容名称
	$("#tpdpUProcessId").combogrid('setValue',rows[0].tpdpProcessId);
	$("#tpdpUProcessId").combogrid('setText',rows[0].tpdpProcessName);
	
	// 技术人员名称
	$("#tpdpUCraftsmanId").combogrid('setValue',rows[0].tpdpCraftsmanId);
	$("#tpdpUCraftsmanId").combogrid('setText',rows[0].tpdpCraftsmanName);
	
	// 所出仓库名称
	$("#tpdpUWarehouseId").combogrid('setValue',rows[0].tpdpWarehouseId);
	$("#tpdpUWarehouseId").combogrid('setText',rows[0].tpdpWarehouseName);
	
}

/**
 * 判断是否符合更新的方法
 */
function tpdpIsCandUpdate(){
	if($("#tpdpUExportId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择委托加工的名称');
		return false;
	}else if($("#tpdpUProcessId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择加工内容的名称');
		return false;
	}else if($("#tpdpUCraftsmanId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择技术人员');
		return false;
	}else if($("#tpdpUWarehouseId").combogrid('getValue')==""){
		toPrompt('添加信息提示','请选择加工所出仓库');
		return false;
	}else{
		return true;
	}
}
/**
 * 点击更新界面中的确定按钮
 */
function tpdpConfirmUpdateFn(){
	var isCanUpdate=tpdpIsCandUpdate();
	if(isCanUpdate){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新提示','更新信息成功');
				// 刷新当前界面
				$("#tpdpTable").datagrid('load');		
				$("#tpdpUpdateBox").dialog('close');
			}
		});
	}
}

/**右键弹出菜单 */

//更新事件
$("#tpdpUpdateMenu").click(function (){			
	tpdpOpenUpdateBoxFn();
});


//删除事件
$("#tpdpDeletMenu").click(function (){
	tpdpDeleteRowsFn();
});



/**
 * 提示信息通用的方法
 */
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:105
	});
}


