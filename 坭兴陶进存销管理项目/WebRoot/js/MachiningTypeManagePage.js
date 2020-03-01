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
	
	// 加工类型
	$("#TProcessType").datagrid({
		width:570,
		height:285,
		title:'加工类型',
		fitColumns:true,
		url:'TProcessTypePage.json',
		rownumbers:true,
		striped:true,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		border:true,
		idField:"TProcessTypeId",
		pagination:true,
		pageSize:4,
		toolbar:'#TMPTypeNav',
		pageList:[4,8,12],
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"TProcessTypeId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"TProcessTypeName",title:"类型名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TMPtypeMenuBox").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 加工类型的查询界面 */
	$("#TMPtypeSearchPgae").dialog({
		width:430,
		height:180,
		title:'查询加工类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				TMPtypeSearchPgaeFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TMPtypeSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TMPtypeSearchPgae input").val("");
			}
		}]
	});
	
	/* 加工类型的更新界面 */
	$("#TMPtypeUpdatePgae").dialog({
		width:430,
		height:180,
		title:'更新加工类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tmpConfirmUpdateType();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TMPtypeUpdatePgae").dialog('close');
			}
		}]
	});
	
	
	
	// 加工风格类型
	$("#TProcessStyle").datagrid({
		width:570,
		height:285,
		title:'加工风格类型',
		border:true,
		fitColumns:true,
		url:'TProcessStylePage.json',
		rownumbers:true,
		striped:true,
		idField:"TProcessStyleId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:4,
		pageList:[4,8,12],
		toolbar:'#TMPprocessNav',
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"TProcessStyleId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"TProcessStyleName",title:"风格名称",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TMPprocessMenuBox").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	/* 加工风格类型的查询界面 */
	$("#TMPprocessSearchPgae").dialog({
		width:430,
		height:180,
		title:'查询加工风格类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				TMPprocessSearchPgaeFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TMPprocessSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TMPprocessSearchPgae input").val("");
			}
		}]
	});
	
	/* 加工风格类型的更新界面 */
	$("#TMPprocessUpdatePgae").dialog({
		width:430,
		height:180,
		title:'更新加工风格类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tmpConfirmUpdateProcess();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TMPprocessUpdatePgae").dialog('close');
			}
		}]
	});
	
	tmpInitFn();	// 调用加工类型初始化的方法
	
	tmpProcessInitFn(); // 调用加工类型风格的初始化方法
});

/* 加工类型的初始化方法 */
function tmpInitFn(){
	// 导航栏的初始化
	$("#TMPDeleteBT").linkbutton({					//批量删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			tmpTypeDeleteFn();
		}
	});

	$("#TMPSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#TMPtypeSearchPgae").dialog('open');
		}
	});

	$("#TMPCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			backFirstPage();
		}
	});
	
	
	//加工类型名称
	$("#TProcessTypeName,#TMPUprocessTypeName").validatebox({
		required : true,
		missingMessage : '请输入加工类型名称'
	});
	
}

//点击添加加工类型时的事件
$("#TMPaddType").click(function(){
	tmpTypeAddFn();
});

// 加工类型的添加方法
function tmpTypeAddFn(){
	if(!$("#TProcessTypeName").validatebox('isValid')){
		$("#TProcessTypeName").focus();
	}else{
		$("#TProcessType").datagrid('load');		// 刷新当前界面
		toPrompt('添加加工类型提示','添加成功');
	}
}

//删除加工类型中记录的方法
function tmpTypeDeleteFn(){
		var rows=$("#TProcessType").datagrid('getSelections');
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
					
					
					$("#TProcessType").datagrid('load');						//调用该方法刷新当前页
					$("#TProcessType").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

/* 加工类型的查询方法 */
function TMPtypeSearchPgaeFn(){
	var name=$("#TMPSprocessTypeName").val();
	if(name==""){
		//未输入则查询全部
	}else{
		//根据输入条件查询
	}
	toPrompt("查询提示","查询加工类型成功");
	$("#TMPtypeSearchPgae").dialog('close');
}

/* 加工类型的打开更新窗口方法 */
function openTmpTypeUpdateWin(){
	var rows=$("#TProcessType").datagrid('getSelections');
	if(rows.length==1){
		tmpGetTypeRowValue(rows);
		$("#TMPtypeUpdatePgae").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function tmpGetTypeRowValue(rows){
	$("#TMPUprocessTypeName").val(rows[0].TProcessTypeName);
}

/* 点击更新界面确认更新的方法 */
function tmpConfirmUpdateType(){
	if(!$("#TMPUprocessTypeName").validatebox('isValid')){
		$("#TMPUprocessTypeName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#TProcessType").datagrid('load');				//刷新当前页面
				$("#TMPtypeUpdatePgae").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新加工类型成功');
			}
		});
	}
}

$("#TMPtypeDeletMenu").click(function(){						//加工类型右键删除当前行
		tmpTypeDeleteFn();
});

$("#TMPtypeUpdateMenu").click(function(){						//加工类型右键更新当前行
	    openTmpTypeUpdateWin();
});






/* 加工风格类型的初始化方法 */
function tmpProcessInitFn(){
	
	// 导航栏的初始化
	$("#TMPpDeleteBT").linkbutton({					//批量删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			tmpProcessDeletFn();
		}
	});

	$("#TMPpearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#TMPprocessSearchPgae").dialog('open');
		}
	});

	$("#TMPpCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			backFirstPage();
		}
	});
	

	//加工风格类型名称
	$("#TProcessStyleName,#TProcessStyleUpdateName").validatebox({
		required : true,
		missingMessage : '请输入加工风格类型名称'
	});
	
}

//点击添加加工风格类型时的事件
$("#TMPaddProcess").click(function(){
	tmpProcessAddFn();
});

// 加工风格类型的添加方法
function tmpProcessAddFn(){
	if(!$("#TProcessStyleName").validatebox('isValid')){
		$("#TProcessStyleName").focus();
	}else{
		$("#TProcessStyle").datagrid('load');		// 刷新当前界面
		toPrompt('添加加工风格类型提示','添加成功');
	}
}

//删除加工风格中记录的方法
function tmpProcessDeletFn(){
		var rows=$("#TProcessStyle").datagrid('getSelections');
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
					
					
					$("#TProcessStyle").datagrid('load');						//调用该方法刷新当前页
					$("#TProcessStyle").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

/* 加工风格类型的查询方法 */
function TMPprocessSearchPgaeFn(){
	var name=$("#TProcessStyleSearchName").val();
	if(name==""){
		//未输入则查询全部
	}else{
		//根据输入条件查询
	}
	toPrompt("查询提示","查询加工风格类型成功");
	$("#TMPprocessSearchPgae").dialog('close');
}

/* 加工风格类型的打开更新窗口方法 */
function openTmpProcessUpdateWin(){
	var rows=$("#TProcessStyle").datagrid('getSelections');
	if(rows.length==1){
		tmpGetProcessRowValue(rows);
		$("#TMPprocessUpdatePgae").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function tmpGetProcessRowValue(rows){
	$("#TProcessStyleUpdateName").val(rows[0].TProcessStyleName);
}

/* 点击更新界面确认更新的方法 */
function tmpConfirmUpdateProcess(){
	if(!$("#TProcessStyleUpdateName").validatebox('isValid')){
		$("#TProcessStyleUpdateName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#TProcessStyle").datagrid('load');				//刷新当前页面
				$("#TMPprocessUpdatePgae").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新加工类型成功');
			}
		});
	}
}

$("#TMPprocessDeletMenu").click(function(){						//加工风格类型右键删除当前行
	tmpProcessDeletFn();
});

$("#TMPprocessUpdateMenu").click(function(){							//加工风格类型右键更新当前行
	openTmpProcessUpdateWin();
});



//返回首页的方法
function backFirstPage(){
	if($("#center").tabs('exists',"首页")){
		$("#center").tabs('select',"首页");
	}
}

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