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
	
	//重写控件进行验证添加的仓库的编号是否已经使用
	$.extend($.fn.validatebox.defaults.rules, {    
	    isWhpExist: {    
	        validator: function(value, param){
	        	if((value.length<3)||(value.length>10)){
	        		$.fn.validatebox.defaults.rules.isWhpExist.message = "输入的编号必须介于3到10为之间";
	        		return false;
	        	}
	        		var result = $.ajax({
	                         url: param[0],								//远程的访问的地址
	                         data: param[1]+"="+value,					//组合name的时行形成如:username:1234
	                         async: false,
	                         type: "post"
	                     }).responseText;
	                     if(result=="false"){
	                     	$.fn.validatebox.defaults.rules.isWhpExist.message = "仓库编号已经存在,请重新输入";
	                     	return false;
	                     }else if(result=="true"){
	                    	 $.fn.validatebox.defaults.rules.isWhpExist.message = "仓库编号可以使用";
	                     	return true;
	                     }
	        },    
	    }    
	}); 
	
	/* 显示数据table */
	$("#diswhNews").datagrid({
		fitColumns:true,
		url:'warehousePage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"warehouseId",
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
		toolbar:'#whpNewsBox',
		columns : [[
		            	{field:"warehouseId",title:"仓库号",align:"center",width:100,checkbox:true},
		            	{field:"warehouseName",title:"仓库名称",align:"center",width:120},
		            	{field:"warehouseType",title:"仓库类型",align:"center",width:120,
		            		formatter : function(value,row,index){
		            			if(value=="1"){
		            				return '材料仓';
		            			}else if(value=="2"){
		            				return '半成品仓';
		            			}else if(value=="3"){
		            				return '成品仓'
		            			}
		            		}
		            	},
		            	{field:"warehouseAddress",title:"仓库地址",align:"center",width:400},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#whpMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
		
	});
	
	/* 右键菜单执行的事件 */
	$("#whpUpdateMenu").click(function(){			//更新
		updateWhpNews();
	});
	
	$("#whpDeletMenu").click(function(){			//删除
		removeWhpChooseRow();
	});	
	
	
	/* 更新仓库信息界面 */
	$("#whpUpdateBox").dialog({
		width:1020,
		height:210,
		title:'仓库信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				confirmUwhpNews();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#whpUpdateBox").dialog('close');
			}
		}]
	});
	
	/* 查询界面 */
	$("#whpSearchPage").dialog({
		width:1020,
		height:180,
		title:'查询仓库信息界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				seeWhpNews();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#whpSearchPage").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#whpSearchPage input").val("");
			}
		}]
	});
	
	wbpInit();									//调用初始化输入控件方法
});

$("#whpAddBT").linkbutton({					   //添加
	plain:true,
	iconCls:'icon-add',
	onClick : function(){
		addWhpRow();
	}
});
$("#whpDeleteBT").linkbutton({					//删除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		deleteWhpChooseRows();
	}
});
$("#whpUpdateBT").linkbutton({					//更新
	plain:true,
	iconCls:'icon-edit',
	onClick : function(){
		updateWhpNews();
	}
});
$("#whpSearchBT").linkbutton({					//查找
	plain:true,
	iconCls:'icon-search',
	onClick : function(){
		$("#whpSearchPage").dialog('open');
	}
});
$("#whpClearBT").linkbutton({					//清除
	plain:true,
	iconCls:'icon-cancel',
	onClick : function(){
		$("#whpNewsBox input").val("");
	}
});
$("#whpCallbackBt").linkbutton({				//返回
	plain:true,
	iconCls:'icon-undo',
	onClick : function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});



/* 初始化输入控件的条件 */
function wbpInit(){
	//仓库编号
	$("input[name='warehouseId'],input[name='updateWarehouseId']").validatebox({
		 required: true,
		 missingMessage:"请输入部门编号",
		 validType : 'isWhpExist["demo","departmentID"]',								//demo表示提交验证的路径,username表示对应的键,值是输入在文本框的值
		 delay:1000,															//delay表示输入文本后多少时间向后台验证是否存在该编号
	});
	
	//仓库名称
	$("input[name='warehouseName'],input[name='updateWarehouseName']").validatebox({
		required : true,
		missingMessage:"请输入仓库名称"
	});
	
	
	//仓库类型
	$("input[name='warehouseType'],input[name='updateWarehouseType'],input[name='searchWarehouseType']").combobox({
		valueField: 'value',
		textField: 'label',
		panelHeight:'auto',
		editable:false,
		required : true,
		missingMessage:"请选择仓库类型",
		data: [
			 {
				label: '材料仓',
				value: '0'
			},{
				label: '半成品仓',
				value: '1'
			},{
				label: '成品仓',
				value: '2'
			}
		]
	});
	
	//仓库地址
	$("input[name='warehouseAddress'],input[name='updateWarehouseAddress']").validatebox({
		required : true,
		missingMessage:"请输入仓库地址"
	});
}

//增加记录
function addWhpRow(){
	var fBox="#whpNewsBox"
	var r="#warehouseId";
	var a="input[name='warehouseName']";
	var b="input[name='warehouseType']";
	var c="input[name='warehouseAddress']";
	var isCan=isWhpCanAddRow(fBox,r,a,b,c);
	if(isCan){
		toPrompt('添加仓库提示','添加仓库成功');
	}
}



//删除选中的多条记录
function deleteWhpChooseRows(){
	var rows=$("#diswhNews").datagrid('getSelections');
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
				
				
				$("#diswhNews").datagrid('load');						//调用该方法刷新当前页
				$("#diswhNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//删除当前行的方法
function removeWhpChooseRow(){
	/* 删除当前行的方法 */
		var rows=$("#diswhNews").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					toPrompt("删除提示","删除某某条数据成功");
					
					$("#diswhNews").datagrid('load');						//调用该方法刷新当前页
					$("#diswhNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
				}
			});
			
		}else if(rows.length>1){
			$.messager.alert("温馨提示","只能删除当前选中的一行,请勿多选",'warning');
		}else{
			$.messager.alert("温馨提示","请选中需要删除的列",'warning');
		}
}

//更新仓库信息方法
function updateWhpNews(){
	var rows=$("#diswhNews").datagrid('getSelections');
	if(rows.length==1){
		upWhpGetValue(rows);								//调用获得选中行的数据的方法
		$("#whpUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中需要修改的行的值
function upWhpGetValue(rows){
	$("input[name='updateWarehouseId']").val(rows[0].warehouseId);
	$("input[name='updateWarehouseName']").val(rows[0].warehouseName);
	$("#updateWarehouseType").combobox('setValue',rows[0].warehouseType);
	if(rows[0].warehouseType=="0"){
		$("#updateWarehouseType").combobox('setText',"材料仓");
	}else if(rows[0].warehouseType=="1"){
		$("#updateWarehouseType").combobox('setText',"半成品仓");
	}else if(rows[0].warehouseType=="2"){
		$("#updateWarehouseType").combobox('setText',"成品仓");
	}
	$("input[name='updateWarehouseAddress']").val(rows[0].warehouseAddress);
}


//点击更新界面中的确定按钮
function confirmUwhpNews(){
	var fBox="#whpUpdateBox";
	var r="#updateWarehouseId";
	var a="input[name='updateWarehouseName']";
	var b="input[name='updateWarehouseType']";
	var c="input[name='updateWarehouseAddress']";
	var l=isWhpCanAddRow(fBox,r,a,b,c);
	if(l){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新仓库信息提示','是否更新成功');
				$("#whpUpdateBox").dialog('close');
			}
		});
		
	}
}


//查询仓库信息方法(如果什么都不输入的话则自动显示全部的信息)
function seeWhpNews(){
	var dID=$("input[name='searchWarehouseId']").val();
	var dName=$("input[name='searchWarehouseName']").val();
	var dCompany=$("input[name='searchWarehouseType']").val();
	var ba=$("#searchWarehouseType").combobox('getValue');	//获取仓库类型的值--可以传递到数据库
	toPrompt('查询信息提示','是否查询成功');
	$("#whpSearchPage").dialog('close');
}


//添加仓库时判断是否符合添加条件
function isWhpCanAddRow(fBox,r,a,b,c){
	if(!$(fBox).find($(r)).validatebox('isValid')){
		$(fBox).find($(r)).focus();
		return false;
	}else if(!$(fBox).find($(a)).validatebox('isValid')){
		$(fBox).find($(a)).focus();
		return false;
	}else if($(fBox).find($(b)).val()==""){
		toPrompt('添加仓库提示','请选择添加仓库的类型');
		return false;
	}else if(!$(fBox).find($(c)).validatebox('isValid')){
		$(fBox).find($(c)).focus();
		return false;
	}else{
		return true;
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
