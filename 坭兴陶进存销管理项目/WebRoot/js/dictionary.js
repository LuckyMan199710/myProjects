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
	$("#quoTable").datagrid({
		fitColumns:true,
		url:'dictionary.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"dicNum",
		pagination:true,
		showFooter : true,
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
		toolbar:'#quoForm',
		columns : [[
		            	{field:"dicNum",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:'dicMtlValue',title:'原料',align:'center',width:120,},
		            	{field:"dicEmkValue",title:"制胚",align:"center",width:120,},
		            	{field:"dicCarvingValue",title:"雕刻",align:"center",width:120,},
		            	{field:"dicBurningValue",title:"烧制",align:"center",width:120},
		            	{field:"dicPolishValue",title:"打磨",align:"center",width:120},
		            	{field:"dicPackingValue",title:"包装",align:"center",width:120},
		            	{field:"dicLogisticsValue",title:"物流",align:"center",width:120},
		            	{field:"dicTotalValue",title:"总价",align:"center",width:120}
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#quoRigthClickMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	},
	});
	
	/* 查询界面 */
	$("#quoSearchPage").dialog({
		width:1280,
		height:308,
		title:'查询信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				quoSearchRowFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#quoSearchPage").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#quoSearchPage input").val("");
			}
		}]
	});
	
	/* 更新出库信息界面 */
	$("#quoUpdatePage").dialog({
		width:1108,
		height:240,
		title:'更新信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				quoConfirmUpdateFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#quoUpdatePage").dialog('close');
			}
		}]
	});
	
	// 调用初始化控件方法
	quotietyInitFn();
	
});


/**
 * 初始化控件方法
 * 
 */
function quotietyInitFn(){
	$("#quoAddBT").linkbutton({							//添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			quoAddRowFn();
		}
	});
	$("#quoDeleteBT").linkbutton({						//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			quoDeleteRowFn();
		}
	});
	$("#quoUpdateBT").linkbutton({						//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			quoUpdateFn();
		}
	});
	$("#quoSearchBT").linkbutton({						//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#quoSearchPage").dialog('open');
		}
	});
	$("#quoClearBT").linkbutton({						//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#quoForm input").val("");
		}
	});
	$("#quoOutput").linkbutton({						//导出	
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
			
		}
	});
	$("#quoCallbackBt").linkbutton({					//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
}


/**添加价格系数方法
 * 
 */
function quoAddRowFn(){
	
	// 获得总价的值
	var sum=getAddPageTotalPrice();
	
	// 将所有的值设置到隐藏的总价的文本框中
	$("#dicTotalValue").val(sum);
	
	
	// 刷新当前页面
	$("#quoTable").datagrid('load');				
	toPrompt('添加提示','添加价格系数成功');
}

/**
 * 计算添加界面的总价
 * @returns {Number}
 */
function getAddPageTotalPrice(){
	// 存储总价的值
	var sum = 0;
	
	// 原料
	if($("#dicMtlValue").val()!=""){
		sum+=parseFloat($("#dicMtlValue").val());
	}
	// 制胚
	if($("#dicEmkValue").val()!=""){
		sum+=parseFloat($("#dicEmkValue").val());
	}
	// 雕刻
	if($("#dicCarvingValue").val()!=""){
		sum+=parseFloat($("#dicCarvingValue").val());
	}
	// 烧制
	if($("#dicBurningValue").val()!=""){
		sum+=parseFloat($("#dicBurningValue").val());
	}
	// 打磨
	if($("#dicPolishValue").val()!=""){
		sum+=parseFloat($("#dicPolishValue").val());
	}
	// 包装
	if($("#dicPackingValue").val()!=""){
		sum+=parseFloat($("#dicPackingValue").val());
	}
	// 物流
	if($("#dicLogisticsValue").val()!=""){
		sum+=parseFloat($("#dicLogisticsValue").val());
	}
	return sum;
}

/**
 * 删除方法*
 * 
 */
function quoDeleteRowFn(){
	var rows=$("#quoTable").datagrid('getSelections');
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
				
				
				$("#quoTable").datagrid('load');							//调用该方法刷新当前页
				$("#quoTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

/**
 * 查询记录的方法
 * 
 * */
function quoSearchRowFn(){
	// 刷新当前页面
	$("#quoTable").datagrid('load');
	$("#quoSearchPage").dialog('close');
	toPrompt('查询提示','查询信息成功');
}

/**
 * 打开更新窗口方法
 */
function quoUpdateFn(){
	var rows=$("#quoTable").datagrid('getSelections');
	if(rows.length==1){
		quoGetChooseValueFn(rows);								//调用获得选中行的数据的方法
		$("#quoUpdatePage").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/**
 * 获得选中需要修改的行的值
 */
function quoGetChooseValueFn(rows){
	
	// 原料
	if(rows[0].dicMtlValue==""){
		$("#quoUdicMtlValue").val(0);
	}else{
		$("#quoUdicMtlValue").val(rows[0].dicMtlValue);
	}
	// 制胚
	if(rows[0].dicEmkValue==""){
		$("#quoUdicEmkValue").val(0);
	}else{
		$("#quoUdicEmkValue").val(rows[0].dicEmkValue);
	}
	
	// 雕刻
	if(rows[0].dicCarvingValue==""){
		$("#quoUdicCarvingValue").val(0);
	}else{
		$("#quoUdicCarvingValue").val(rows[0].dicCarvingValue);
	}
	
	// 烧制
	if(rows[0].dicBurningValue==""){
		$("#quoUdicBurningValue").val(0);
	}else{
		$("#quoUdicBurningValue").val(rows[0].dicBurningValue);
	}
	
	// 打磨
	if(rows[0].dicPolishValue==""){
		$("#quoUdicPolishValue").val(0);
	}else{
		$("#quoUdicPolishValue").val(rows[0].dicPolishValue);
	}
	
	// 包装
	if(rows[0].dicPackingValue==""){
		$("#quoUdicPackingValue").val(0);
	}else{
		$("#quoUdicPackingValue").val(rows[0].dicPackingValue);
	}
	
	// 包装
	if(rows[0].dicLogisticsValue==""){
		$("#quoUdicLogisticsValue").val(0);
	}else{
		$("#quoUdicLogisticsValue").val(rows[0].dicLogisticsValue);
	}
}

/**
 * 计算更新界面的总价
 * @returns {Number}
 */
function getUpdatePageTotalPrice(){
	// 存储总价的值
	var sum = 0;
	
	// 原料
	if($("#quoUdicMtlValue").val()!=""){
		sum+=parseFloat($("#quoUdicMtlValue").val());
	}
	// 制胚
	if($("#quoUdicEmkValue").val()!=""){
		sum+=parseFloat($("#quoUdicEmkValue").val());
	}
	// 雕刻
	if($("#quoUdicCarvingValue").val()!=""){
		sum+=parseFloat($("#quoUdicCarvingValue").val());
	}
	// 烧制
	if($("#quoUdicBurningValue").val()!=""){
		sum+=parseFloat($("#quoUdicBurningValue").val());
	}
	// 打磨
	if($("#quoUdicPolishValue").val()!=""){
		sum+=parseFloat($("#quoUdicPolishValue").val());
	}
	// 包装
	if($("#quoUdicPackingValue").val()!=""){
		sum+=parseFloat($("#quoUdicPackingValue").val());
	}
	// 物流
	if($("#quoUdicLogisticsValue").val()!=""){
		sum+=parseFloat($("#quoUdicLogisticsValue").val());
	}
	return sum;
}


/**
 * 点击更新界面中的确定按钮
 */
function quoConfirmUpdateFn(){
		var updateSum = 0;
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				// 获得更新界面的总价
				var sum = getUpdatePageTotalPrice();
				
				// 将总价的值设置到存储总价的隐藏框中
				$("#quoUdicTotalValue").val(sum);
				
				toPrompt('更新提示','更新信息成功');
				// 刷新当前界面
				$("#quoTable").datagrid('load');		
				$("#quoUpdatePage").dialog('close');
			}
		});
}

/* 右键弹出菜单 */

//更新事件
$("#quoUpdateMenu").click(function (){			
	quoUpdateFn();
});


//删除事件
$("#quoDeleteMenu").click(function (){
	quoDeleteRowFn();
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
