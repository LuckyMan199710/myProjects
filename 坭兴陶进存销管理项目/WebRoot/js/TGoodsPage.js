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
	$("#disTGPNews").datagrid({
		url:'TGoodsPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"gdsId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
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
		toolbar:'#TGPNewsBox',
		columns : [[
		            	{field:"gdsId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"gdsName",title:"商品名称",align:"center",width:200},
		            	{field:"gdsModel",title:"商品型号",align:"center",width:200,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"gdsSpecification",title:"商品规格",align:"center",width:200,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"gdsUnit",title:"单位名称",align:"center",width:200},
		            	{field:"shape",title:"商品器型",align:"center",width:200,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"pType",title:"商品类别",align:"center",width:200,
		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		            	},
		            	{field:"isManual",title:"是否手工",align:"center",width:120,
		            		formatter : function(val,row){if (val=="0"){return "是"} else {return "否";}},
		            		styler : function(val,row){
		            			if(val=="0"){
		            				return 'color:green;';
		            			}else{
		            				return 'color:red;';
		            			}
		            		}
		            	},
		            	{field:"gdsAttribute",title:"商品属性",align:"center",width:600,
		            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
		            	},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			    			e.preventDefault();
			    			$("#tgsMenu").menu('show',{
			    				left:e.pageX,
			    				top:e.pageY,
			    			});
			    			$(this).datagrid("clearChecked");
			    			$(this).datagrid("clearSelections");
			    			$(this).datagrid('unselectAll');
			    			$(this).datagrid('selectRow',rowIndex);
		    	}
		
	});
	
	/* 查询窗体 */
	$("#tgsSearchBox").dialog({
		width:1020,
		height:189,
		title:'商品信息查询界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				searchTgsFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tgsSearchBox").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#tgsSearchBox input").val("");
			}
		}]
	});
	
	/* 更新窗口 */
	$("#tgsUpdateNewsBox").dialog({
		width:1025,
		height:350,
		title:'商品信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tgsUpdatePageConfirmFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tgsUpdateNewsBox").dialog('close');
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#tgsSeeDetailPage").dialog({
		 width:903,
		 height:285,
		 title:'商品详细信息界面',
		 closed : true,
		 modal : true,
	 });
	
	tgsInits();
});

$("#TGPAddBT").linkbutton({					   //添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		addTgsFn();
	}
});
$("#TGPDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		deleteChooseTgsRowsFn();
	}
});
$("#TGPUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		tgsUpdateRowBTFn();
	}
});
$("#TGPSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#tgsSearchBox").dialog('open');
	}
});
$("#TGPClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#TGPInputNewsBox input").val("");
		$("#gdsAttribute").val("");
	}
});
$("#TGPCallbackBt").linkbutton({				 //返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});

/* 初始化输入控件--限制输入条件 */
function tgsInits(){
	//商品名称
	$("#gdsName,#tgsUpdateGdsName").validatebox({
		required : true,
		missingMessage : '请输入商品名称'
	});
	
	//单位名称
	$("#gdsUnit,#tgsUpdateGdsUnit").validatebox({
		required : true,
		missingMessage : '请输入单位名称'
	});
	
	//是否手工
	$("#isManual,#searcheIsManual,#tgsUpdateIsManual").combobox({
		valueField: 'value',
		textField: 'label',
		panelHeight:'auto',
		editable:false,
		data: [{
			label: '手工',
			value: '0'
		},{
			label: '非手工',
			value: '1'
		}]
	});
	
	//商品器型
	$("#shape,#searchShape,#tgsUpdateShape").combogrid({
			panelWidth:315,
			panelHeight:'133',
		    idField:'warehouseId',    
		    textField:'warehouseName', 
		    editable : false,
		    url:'warehousePage.json',
		    columns:[[    
		        {field:'warehouseId',title:'器型编号',width:100,align:"center"},    
		        {field:'warehouseName',title:'器型名称',width:200,align:"center"},    
		    ]]    

	});
	
	//商品类别
	$("#pType,#searchPType,#tgsUpdatePType").combogrid({
			panelWidth:315,
			panelHeight:'133',
		    idField:'warehouseId',    
		    textField:'warehouseName', 
		    editable : false,
		    url:'warehousePage.json',
		    columns:[[    
		        {field:'warehouseId',title:'类别编号',width:100,align:"center"},    
		        {field:'warehouseName',title:'类别名称',width:200,align:"center"},    
		    ]]    

	});
	
}

/* 添加商品方法 */
function addTgsFn(){
	if(!$("#gdsName").validatebox('isValid')){
		$("#gdsName").focus();
	}else if(!$("#gdsUnit").validatebox('isValid')){
		$("#gdsUnit").focus();
	}else if($("#isManual").val()==""){
		toPrompt('添加商品提示','请选择是否手工');
	}else{
		toPrompt('添加商品提示','添加商品成功');
		$("#disTGPNews").datagrid('load');			//重新加载当前页面显示内容
	}
}

//批量删除商品
function deleteChooseTgsRowsFn(){
		var rows=$("#disTGPNews").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除商品数据成功");
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#disTGPNews").datagrid('load');						//调用该方法刷新当前页
					$("#disTGPNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}


//查询方法(为输入的默认查询全部)
function searchTgsFn(){
	var name=$("#searchGdsName").val();
	var unit=$("#searchmgdsUnit").val();
	var isM=$("#searcheIsManual").val();
	var shape=$("#searchShape").val();
	var type=$("#searchPType").val();
	if(name==""&&unit==""&&isM==""&&shape==""&&type==""){			//查询全部
		var isMvalue=$("#searcheIsManual").combobox('getValue');
		var isShape=$("#searchShape").combogrid('getValue');
		var isType=$("#searchPType").combogrid('getValue');
		
	}else{															//根据条件查询
			
	}
	toPrompt('查询商品信息提示','查询成功');
	$("#tgsSearchBox").dialog('close');
}


//更新按钮方法
function tgsUpdateRowBTFn(){
	var rows=$("#disTGPNews").datagrid('getSelections');
	if(rows.length==1){
		tgsUpdateGetValue(rows);
		$("#tgsUpdateNewsBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获取选定行的信息并传到更新界面
function tgsUpdateGetValue(rows){
	//商品名称
	$("#tgsUpdateGdsName").val(rows[0].gdsName);
	
	//单位
	$("#tgsUpdateGdsUnit").val(rows[0].gdsUnit);
	
	//是否手工
	$("#tgsUpdateIsManual").combobox('setValue',rows[0].isManual);
	if(rows[0].isManual=="0"){
		$("#tgsUpdateIsManual").combobox('setText','手工');
	}else{
		$("#tgsUpdateIsManual").combobox('setText','非手工');
	}
	
	//商品模型
	if(rows[0].gdsModel!=""){
		$("#tgsUpdateGdsModel").val(rows[0].gdsModel);
	}
	
	//商品规格
	if(rows[0].gdsSpecification!=""){
		$("#tgsUpdateGdsSpecification").val(rows[0].gdsSpecification);
	}
	
	//商品器型
	if(rows[0].shape!=""){
		$("#tgsUpdateShape").combogrid('setValue',rows[0].shape);
		$("#tgsUpdateShape").combogrid('setText',rows[0].shape);
	}
	
	//商品类别
	if(rows[0].pType!=""){
		$("#tgsUpdatePType").combogrid('setValue',rows[0].pType);
		$("#tgsUpdatePType").combogrid('setText',rows[0].pType);
	}
	
	//商品属性
	if(rows[0].gdsAttribute!=""){
		$("#tgsUpdateGdsAttribute").val(rows[0].gdsAttribute);
	}
	
}


//更新界面确认修改方法
function tgsUpdatePageConfirmFn(){
	if(!$("#tgsUpdateGdsName").validatebox('isValid')){
		$("#tgsUpdateGdsName").focus();
	}else if(!$("#tgsUpdateGdsUnit").validatebox('isValid')){
		$("#tgsUpdateGdsUnit").focus();
	}else if($("#tgsUpdateIsManual").val()==""){
		toPrompt('更新信息提示','请选择商品是否属于手工');
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#distgNews").datagrid('load');				//刷新当前页面
				$("#tgsUpdateNewsBox").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新成功');
			}
		});
	}
}

//查看详情的方法
function tgsDetailNews(){
	var rows=$("#disTGPNews").datagrid('getSelections');
	if(rows.length==1){
		getTgsRowDetailNews(rows);
		$("#tgsSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
}

//获取选中行的详细信息并传送到详细信息界面显示
function getTgsRowDetailNews(rows){
	$("#tgsDisGdsName").text(rows[0].gdsName);
	$("#tgsDisGdsUnit").text(rows[0].gdsUnit);
	
	//商品型号
	if(rows[0].gdsModel==""){
		$("#tgsDisGdsModel").text("暂无");
	}else{
		$("#tgsDisGdsModel").text(rows[0].gdsModel);
	}
	
	//商品器型
	if(rows[0].shape==""){
		$("#tgsDisShape").text("暂无");
	}else{
		$("#tgsDisShape").text(rows[0].shape);
	}
	
	//商品类别
	if(rows[0].pType==""){
		$("#tgsDisPType").text("暂无");
	}else{
		$("#tgsDisPType").text(rows[0].pType);
	}
	
	//商品类别
	if(rows[0].isManual=="0"){
		$("#tgDisIsManual").text("是");
		$("#tgDisIsManual").css({color:'green'});
	}else{
		$("#tgDisIsManual").text("否");
		$("#tgDisIsManual").css({color:'red'});
	}
	

	//商品规格
	if(rows[0].gdsSpecification==""){
		$("#tgsDisGdsSpecification").text("暂无");
	}else{
		$("#tgsDisGdsSpecification").text(rows[0].gdsSpecification);
	}
	
	//商品属性
	if(rows[0].gdsAttribute==""){
		$("#tgsDisGdsAttribute").text("暂无");
	}else{
		$("#tgsDisGdsAttribute").text(rows[0].gdsAttribute);
	}
	
}


/* 右键弹出菜单 */

//更新事件
$("#tgsUpdateMenu").click(function (){			
	tgsUpdateRowBTFn();
});


//删除事件
$("#tgsDeletMenu").click(function (){
	deleteChooseTgsRowsFn();
});

//查看事件
$("#tgsSeeMenu").click(function (){
	tgsDetailNews();
});




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