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
	
	$("#key1").datagrid({
		width:460,
		height:275,
		title:'仓库类型',
		fitColumns:true,
		url:'warehousePage.json',
		rownumbers:true,
		striped:true,
		border:true,
		idField:"warehouseId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:3,
		toolbar:'#TWarehouseTypeNav',
		pageList:[3,6,9,12],
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"warehouseId",title:"仓库号",align:"center",width:100,checkbox:true},
		            	{field:"warehouseName",title:"仓库名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TWMenuBox").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 仓库类型的查询界面 */
	$("#TWSearchPgae").dialog({
		width:430,
		height:180,
		title:'查询仓库类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				TWSearchPgaeFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TWSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TWSearchPgae input").val("");
			}
		}]
	});
	
	/* 仓库类型的更新界面 */
	$("#TWUpdatePgae").dialog({
		width:430,
		height:180,
		title:'更新仓库类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				twConfirmUpdate();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TWUpdatePgae").dialog('close');
			}
		}]
	});
	
	$("#key2").datagrid({
		width:460,
		height:275,
		title:'器型',
		border:true,
		fitColumns:true,
		url:'warehousePage.json',
		rownumbers:true,
		striped:true,
		idField:"warehouseId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:3,
		pageList:[3,6,9,12],
		toolbar:'#TSarehouseTypeNav',
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"warehouseId",title:"仓库号",align:"center",width:100,checkbox:true},
		            	{field:"warehouseName",title:"器型名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TSMenuBox").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 器型的查询界面 */
	$("#TSSearchPgae").dialog({
		width:430,
		height:180,
		title:'查询器型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				TSSearchPgaeFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TSSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TSSearchPgae input").val("");
			}
		}]
	});
	
	/* 器材的的更新界面 */
	$("#TSUpdatePgae").dialog({
		width:430,
		height:180,
		title:'更新器材界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tsConfirmUpdate();
			}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TSUpdatePgae").dialog('close');
			}
		}]
	});
	
	
	$("#key3").datagrid({
		width:460,
		height:275,
		title:'类别',
		border:true,
		fitColumns:true,
		url:'warehousePage.json',
		rownumbers:true,
		striped:true,
		idField:"warehouseId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:3,
		pageList:[3,6,9,12],
		toolbar:'#TPTarehouseTypeNav',
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"warehouseId",title:"仓库号",align:"center",width:100,checkbox:true},
		            	{field:"warehouseName",title:"类别名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TPTMenuBox").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 类别的查询界面 */
	$("#TPTSearchPgae").dialog({
		width:430,
		height:180,
		title:'查询类别界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				TPTSearchPgaeFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TPTSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TPTSearchPgae input").val("");
			}
		}]
	});
	
	/* 类别的的更新界面 */
	$("#TPTUpdatePgae").dialog({
		width:430,
		height:180,
		title:'更新类别界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tptConfirmUpdate();
			}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TPTUpdatePgae").dialog('close');
			}
		}]
	});
	
	TMInits();					//调用初始化添加输入框
});

/** 仓库类别界面的脚本 */

$("#TWTDeleteBT").linkbutton({					//批量删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		TWRemoveRows();
	}
});

$("#TWTSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#TWSearchPgae").dialog('open');
	}
});

$("#TWTCallbackBt").linkbutton({				//返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


$("#TWDeletMenu").click(function(){							//仓库类型右键删除当前行
	TWremoveWhpChooseRow();
});

$("#TWUpdateMenu").click(function(){						//仓库类型右键更新当前行
	openTWUpdateWin();
});

/* 输入控件初始化 */
function TMInits(){
	$("#whTypeName,#TWUpdateWhTypeName").validatebox({
		 required: true,
		 missingMessage:"请输入仓库类型名称",
	});
	$("#shapeName,#TSUpdateShapeName").validatebox({
		 required: true,
		 missingMessage:"请输入器型名称",
	});
	$("#productTypeName,#TPTUpdateProductTypeName").validatebox({
		 required: true,
		 missingMessage:"请输入类别名称",
	});
}

/* 仓库类别添加  */
$("#TWarehouseTypeAddBt").click(function(){
	if(!$("#whTypeName").validatebox('isValid')){
		$("#whTypeName").focus();
	}else{
		toPrompt('添加仓库类型提示','添加成功');
		$("#key1").datagrid('load');	//刷新当前界面
	}
});

/* 仓库类别的批量删除 */
function TWRemoveRows(){
		var rows=$("#key1").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除仓库类型某某条数据成功");
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#key1").datagrid('load');						//调用该方法刷新当前页
					$("#key1").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

//仓库类型删除当前行的方法
function TWremoveWhpChooseRow(){
		var rows=$("#key1").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除仓库类型某某条数据成功");
					
					$("#key1").datagrid('load');						//调用该方法刷新当前页
					$("#key1").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else if(rows.length>1){
			$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

/* 仓库类型的查询方法 */
function TWSearchPgaeFn(){
	var name=$("#TWSearchWhTypeName").val();
	if(name==""){
		//未输入则查询全部
	}else{
		//根据输入条件查询
	}
	toPrompt("查询提示","查询仓库类别成功");
	$("#TWSearchPgae").dialog('close');
}

/* 仓库类型的打开更新窗口方法 */
function openTWUpdateWin(){
	var rows=$("#key1").datagrid('getSelections');
	if(rows.length==1){
		twGetRowValue(rows);
		$("#TWUpdatePgae").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function twGetRowValue(rows){
	$("#TWUpdateWhTypeName").val(rows[0].warehouseName);
}

/* 点击更新界面确认更新的方法 */
function twConfirmUpdate(){
	if(!$("#TWUpdateWhTypeName").validatebox('isValid')){
		$("#TWUpdateWhTypeName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#key1").datagrid('load');				//刷新当前页面
				$("#TWUpdatePgae").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新仓库类型成功');
			}
		});
	}
}


/** 器型界面的脚本 */
$("#TSDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		TSRemoveRows();
	}
});


$("#TSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#TSSearchPgae").dialog('open');
	}
});

$("#TSCallbackBt").linkbutton({					//返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


$("#TSDeletMenu").click(function(){			    //器型右键删除当前行
	TSremoveWhpChooseRow();
});

$("#TSUpdateMenu").click(function(){			    //器型右键删除当前行
	openTSUpdateWin();
});

/* 器型添加  */
$("#TShapeAddBT").click(function(){
	if(!$("#shapeName").validatebox('isValid')){
		$("#shapeName").focus();
	}else{
		toPrompt('添加器材提示','添加成功');
		$("#key2").datagrid('load');	//刷新当前界面
	}
});

/* 器型的批量删除 */
function TSRemoveRows(){
		var rows=$("#key2").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除器型表某某条数据成功");
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#key2").datagrid('load');						//调用该方法刷新当前页
					$("#key2").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

//器型删除当前行的方法
function TSremoveWhpChooseRow(){
		var rows=$("#key2").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除器型某某条数据成功");
					
					$("#key2").datagrid('load');						//调用该方法刷新当前页
					$("#key2").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else if(rows.length>1){
			$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

/* 器型的查询方法 (未输入自动查询全部信息)*/
function TSSearchPgaeFn(){
	var name=$("#TSSearchshapeName").val();
	if(name!=""){
		//未输入则自动查询全部
	}else{
		//根据输入条件查询
	}
	toPrompt("查询提示","查询器型成功");
	$("#TSSearchPgae").dialog('close');
}

/* 器材的打开更新窗口方法 */
function openTSUpdateWin(){
	var rows=$("#key2").datagrid('getSelections');
	if(rows.length==1){
		tsGetRowValue(rows);
		$("#TSUpdatePgae").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function tsGetRowValue(rows){
	$("#TSUpdateShapeName").val(rows[0].warehouseName);
}

/* 点击更新界面确认更新的方法 */
function tsConfirmUpdate(){
	if(!$("#TSUpdateShapeName").validatebox('isValid')){
		$("#TSUpdateShapeName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#key2").datagrid('load');				//刷新当前页面
				$("#TSUpdatePgae").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新器型成功');
			}
		});
	}
}


/** 类别界面 */
$("#TPTDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		TPTRemoveRows();
	}
});

$("#TPTSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#TPTSearchPgae").dialog('open');
	}
});

$("#TPTCallbackBt").linkbutton({				//返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
})


$("#TPTDeletMenu").click(function(){			    //类别右键删除当前行
	TPTremoveWhpChooseRow();
});

$("#TPTUpdateMenu").click(function(){			    //类别右键更新当前
	openTPTUpdateWin();
});


/* 类别添加  */
$("#TProductTypeAddBT").click(function(){
	if(!$("#productTypeName").validatebox('isValid')){
		$("#productTypeName").focus();
	}else{
		toPrompt('添加类别提示','添加成功');
		$("#key3").datagrid('load');	//刷新当前界面
	}
});


/* 器型的批量删除 */
function TPTRemoveRows(){
		var rows=$("#key3").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除类别表某某条数据成功");
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#key3").datagrid('load');						//调用该方法刷新当前页
					$("#key3").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

//类别删除当前行的方法
function TPTremoveWhpChooseRow(){
	var rows=$("#key3").datagrid('getSelections');
	if(rows.length==1){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除类别某某条数据成功");
				
				$("#key3").datagrid('load');						//调用该方法刷新当前页
				$("#key3").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else if(rows.length>1){
		$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//查询类别的方法没有输入时查询全部
function TPTSearchPgaeFn(){
	var name=$("#TPTSearchProductTypeName").val();
	if(name==""){
		//(未输入)查询全部
	}else{
		//根据条件查询
	}
	toPrompt("查询提示","查询类别成功");
	$("#TPTSearchPgae").dialog('close');
}

/* 仓库类型的打开更新窗口方法 */
function openTPTUpdateWin(){
	var rows=$("#key3").datagrid('getSelections');
	if(rows.length==1){
		tptGetRowValue(rows);
		$("#TPTUpdatePgae").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function tptGetRowValue(rows){
	$("#TPTUpdateProductTypeName").val(rows[0].warehouseName);
}

/* 点击更新界面确认更新的方法 */
function tptConfirmUpdate(){
	if(!$("#TPTUpdateProductTypeName").validatebox('isValid')){
		$("#TPTUpdateProductTypeName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#key3").datagrid('load');				//刷新当前页面
				$("#TPTUpdatePgae").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新类别成功');
			}
		});
	}
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