$(function (){
	
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
	$("#distgNews").datagrid({
		fitColumns:true,
		url:'TSemifinishedGoods.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"sgId",
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
		toolbar:'#tgNewsBox',
		columns : [[
		            	{field:"sgId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"sgName",title:"半成品名称",align:"center",width:120},
		            	{field:"sgModel",title:"半成品型号",align:"center",width:120},
		            	{field:"sgSpecification",title:"半成品规格",align:"center",width:120,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"sgUnit",title:"单位",align:"center",width:120},
		            	{field:"sgAttribute",title:"半成品的属性",align:"center",width:400,
		            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
		            	},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			    			e.preventDefault();
			    			$("#tgMenu").menu('show',{
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
	$("#tgSearchPgae").dialog({
		width:680,
		height:180,
		title:'查询半成品信息界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				tgSearchNewsFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tgSearchPgae").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#tgSearchPgae input").val("");
			}
		}]
	});
	
	/* 更新窗口 */
	$("#tgUpdateNewsBox").dialog({
		width:1025,
		height:320,
		title:'半成品信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tgupdatePageConfirmFn();
			}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
				$("#tgUpdateNewsBox").dialog('close');
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#tgSeeDetailPage").dialog({
		 width:904,
		 height:255,
		 title:'半成品详细信息界面',
		 closed : true,
		 modal : true,
	 });
	
	tgInit();					//调用初始化方法
});

$("#tgAddBT").linkbutton({					   //添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		tgAddMeterialsFn();
	}
});
$("#tgDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		tgRemoveRowsFn();
	}
});
$("#tgUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		tgUpdateBTFn();
	}
});
$("#tgSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#tgSearchPgae").dialog('open');
	}
});
$("#tgClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#tgInputNewsBox input").val("");
		$("#sgAttribute").val("");
	}
});
$("#tgCallbackBt").linkbutton({				 //返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});

/* 初始化控件 */
function tgInit(){
	//材料名称
	$("#sgName,#tgUpdateSgName").validatebox({
		required : true,
		missingMessage : '请输入半成品名称'
	});
	
	//单位
	$("#sgUnit,#tgUpdateSgUnit").validatebox({
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
		height:105
	});
}

//添加半成品方法
function tgAddMeterialsFn(){
	if(!$("#sgName").validatebox('isValid')){
		$("#sgName").focus();
	}else if(!$("#sgUnit").validatebox('isValid')){
		$("#sgUnit").focus();
	}else{
		$("#distgNews").datagrid('load');				//刷新当前页面
		toPrompt('添加信息提示','添加成功');
	}
}

//删除方法
function tgRemoveRowsFn(){
	var rows=$("#distgNews").datagrid('getSelections');
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
				
				
				$("#distgNews").datagrid('load');							//调用该方法刷新当前页
				$("#distgNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}


//查询方法(未输入则查询全部)
function tgSearchNewsFn(){
	var name=$("#tgSearchSgName").val();
	var unit=$("#tgSearchsgUnit").val();
	if(name==""&&unit==""){
		//未输入查询条件自动查询全部
	}else{
		//根据输入的条件查询
	}
	toPrompt("查询提示","查询成功");
	$("#tgSearchPgae").dialog('close');
}

//更新按钮方法
function tgUpdateBTFn(){
	var rows=$("#distgNews").datagrid('getSelections');
	if(rows.length==1){
		tgUpdateGetValue(rows);
		$("#tgUpdateNewsBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获取选定行的信息并传到更新界面
function tgUpdateGetValue(rows){
	//名称
	$("#tgUpdateSgName").val(rows[0].sgName);
	
	//单位
	$("#tgUpdateSgUnit").val(rows[0].sgUnit);
	
	//规格
	if(rows[0].sgSpecification!=""){
		$("#tgUpdateSgSpecification").val(rows[0].sgSpecification);
	}
	//属性
	if(rows[0].sgAttribute!=""){
		$("#tgupdateSgAttribute").val(rows[0].sgAttribute);
	}
	//型号
	if(rows[0].sgModel!=""){
		$("#tgUpdateSgModel").val(rows[0].sgModel);
	}
}


//更新界面确认修改方法
function tgupdatePageConfirmFn(){
	if(!$("#tgUpdateSgName").validatebox('isValid')){
		$("#tgUpdateSgName").focus();
	}else if(!$("#tgUpdateSgUnit").validatebox('isValid')){
		$("#tgUpdateSgUnit").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#distgNews").datagrid('load');				//刷新当前页面
				$("#tgUpdateNewsBox").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新成功');
			}
		});
	}
}

//查看详情的方法
function tgDetailNews(){
	var rows=$("#distgNews").datagrid('getSelections');
	if(rows.length==1){
		getTgRowNews(rows);
		$("#tgSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
}

//将选中的行的信息传递到详情信息界面
function getTgRowNews(rows){
	$("#tgDisSgName").text(rows[0].mtlName);
	$("#tgDisSgUnit").text(rows[0].mtlUnit);
	
	if(rows[0].sgSpecification==""){
		$("#tgDisSgSpecification").text("暂无");
	}else{
		$("#tgDisSgSpecification").text(rows[0].sgSpecification);
	}
	
	//材料成分
	if(rows[0].sgAttribute==""){
		$("#tgDisSgAttribute").text("暂无");
	}else{
		$("#tgDisSgAttribute").text(rows[0].sgAttribute);
	}
	
	//半成品型号
	if(rows[0].sgModel==""){
		$("#tgDisSgModel").text("暂无");
	}else{
		$("#tgDisSgModel").text(rows[0].sgModel);
	}
}


/* 右键弹出菜单 */

//更新事件
$("#tgUpdateMenu").click(function (){			
	tgUpdateBTFn();
});


//删除事件
$("#tgDeletMenu").click(function (){
	tgRemoveRowsFn();
});

//查看事件
$("#tgSeeMenu").click(function (){
	tgDetailNews();
});

