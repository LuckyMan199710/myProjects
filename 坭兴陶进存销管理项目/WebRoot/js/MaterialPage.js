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
	$("#dismtpNews").datagrid({
		fitColumns:true,
		url:'MaterialPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		idField:"mtlId",
		pagination:true,
		pageSize:10,
		pageList:[10,20,30,40,50],
		border : false,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar:'#mtpNewsBox',
		columns : [[
		            	{field:"mtlId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"mtlName",title:"材料名称",align:"center",width:120},
		            	{field:"mtlSpecification",title:"材料规格",align:"center",width:120,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"mtlUnit",title:"单位",align:"center",width:120},
		            	{field:"mtlForm",title:"材料组成成分",align:"center",width:400,
		            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
		            	},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			    			e.preventDefault();
			    			$("#mtpMenu").menu('show',{
			    				left:e.pageX,
			    				top:e.pageY,
			    			});
			    			$(this).datagrid("clearChecked");
			    			$(this).datagrid("clearSelections");
			    			$(this).datagrid('unselectAll');
			    			$(this).datagrid('selectRow',rowIndex);
		    	}
		
	});
	
	/* 查询窗口  */
	$("#mtpSearchPgae").dialog({
		width:680,
		height:180,
		title:'查询材料信息界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				mtpSearchNewsFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#mtpSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#mtpSearchPgae input").val("");
			}
		}]
	});
	
	/* 更新窗口 */
	$("#mtpUpdateNewsBox").dialog({
		width:1025,
		height:300,
		title:'材料更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				updatePageConfirmFn();
			}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
				$("#mtpUpdateNewsBox").dialog('close');
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#mtpSeeDetailPage").dialog({
		 width:903,
		 height:225,
		 title:'材料详细信息界面',
		 closed : true,
		 modal : true,
	 });
	
	mtpInit();								   //调用控件初始化方法
	
});

$("#mtpAddBT").linkbutton({					   //添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		mtpAddMeterialsFn();
	}
});
$("#mtpDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		mtpRemoveRowsFn();
	}
});
$("#mtpUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		mtpUpdateBTFn();
	}
});
$("#mtpSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#mtpSearchPgae").dialog('open');
	}
});
$("#mtpClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#mtpInputNewsBox input").val("");
		$("#mtlForm").val("");
	}
});
$("#mtpCallbackBt").linkbutton({				 //返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});

/* 初始化控件 */
function mtpInit(){
	//材料名称
	$("#mtlName,#mtpUpdateMtlName").validatebox({
		required : true,
		missingMessage : '请输入材料名称'
	});
	
	//单文
	$("#mtlUnit,#mtpUpdateMtlUnit").validatebox({
		required : true,
		missingMessage : '请输入单文名称'
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

//添加材料方法
function mtpAddMeterialsFn(){
	if(!$("#mtlName").validatebox('isValid')){
		$("#mtlName").focus();
	}else if(!$("#mtlUnit").validatebox('isValid')){
		$("#mtlUnit").focus();
	}else{
		$("#dismtpNews").datagrid('load');				//刷新当前页面
		toPrompt('添加信息提示','添加成功');
	}
}

//删除多行方法
function mtpRemoveRowsFn(){
	var rows=$("#dismtpNews").datagrid('getSelections');
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
				
				
				$("#dismtpNews").datagrid('load');						//调用该方法刷新当前页
				$("#dismtpNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//删除当前行方法
function mtpRemoveCurrentRowFn(){
		var rows=$("#dismtpNews").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除某某条数据成功");
					
					$("#dismtpNews").datagrid('load');						//调用该方法刷新当前页
					$("#dismtpNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else if(rows.length>1){
			$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}

}


//查询方法(未输入值默认查询全部)
function mtpSearchNewsFn(){
	var name=$("#mtpSearchMtlName").val();
	var unit=$("#mtpSearchMtlUnit").val();
	if(name==""&&unit==""){
		//未输入值默认查询全部
	}
	toPrompt("查询提示","查询成功");
	$("#mtpSearchPgae").dialog('close');
}

//更新按钮方法
function mtpUpdateBTFn(){
	var rows=$("#dismtpNews").datagrid('getSelections');
	if(rows.length==1){
		mtpUpdateGetValue(rows);
		$("#mtpUpdateNewsBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获取选定行的信息并传到更新界面
function mtpUpdateGetValue(rows){
	//名称
	$("#mtpUpdateMtlName").val(rows[0].mtlName);
	
	//单位
	$("#mtpUpdateMtlUnit").val(rows[0].mtlUnit);
	
	//材料规格
	if(rows[0].mtlSpecification!=""){
		$("#mtpUpdateMtlSpecification").val(rows[0].mtlSpecification);
	}
	//材料组成成分
	if(rows[0].mtlForm!=""){
		$("#updateMtlForm").val(rows[0].mtlForm);
	}
}


//更新界面确认修改方法
function updatePageConfirmFn(){
	if(!$("#mtpUpdateMtlName").validatebox('isValid')){
		$("#mtpUpdateMtlName").focus();
	}else if(!$("#mtpUpdateMtlUnit").validatebox('isValid')){
		$("#mtpUpdateMtlUnit").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#dismtpNews").datagrid('load');				//刷新当前页面
				$("#mtpUpdateNewsBox").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新成功');
			}
		});
	}
}

//查看详情的方法
function mtpDetailNews(){
	var rows=$("#dismtpNews").datagrid('getSelections');
	if(rows.length==1){
		getMtpRowNews(rows);
		$("#mtpSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
}

//将选中的行的信息传递到详情信息界面
function getMtpRowNews(rows){
	$("#mtpDisMtlName").text(rows[0].mtlName);
	$("#mtpDisMtlUnit").text(rows[0].mtlUnit);
	
	if(rows[0].mtlSpecification==""){
		$("#mtpDisMtlSpecification").text("暂无");
	}else{
		$("#mtpDisMtlSpecification").text(rows[0].mtlSpecification);
	}
	
	//材料成分
	if(rows[0].mtlForm==""){
		$("#mtpDisMtlForm").text("暂无");
	}else{
		$("#mtpDisMtlForm").text(rows[0].mtlForm);
	}
}


/* 右键弹出菜单 */

//更新事件
$("#mtpUpdateMenu").click(function (){			
	mtpUpdateBTFn();
});


//删除事件
$("#mtpDeletMenu").click(function (){
	mtpRemoveCurrentRowFn();
});

//查看事件
$("#mtpSeeMenu").click(function (){
	mtpDetailNews();
});

