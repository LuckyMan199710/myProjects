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
	
	// 初始时话添加和更新显示五张图片
	var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for (var i = 0; i < arr.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='temDisplayDelIcon(this)' onmouseout='temDhideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='temAddDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='temAddDelThisImg(this)'></div>";
		$("#temImgBox").prepend(imgBoxS);
	}
	/* 显示信息 */
	$("#TemTable").datagrid({
		fitColumns:true,
		url:'TExportMaterialPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"eptMaterialId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:10,
		showFooter : true,
		pageList:[10,20,30,40,50],
		border : false,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar:'#TemNavsForm',
		columns : [[
		            	{field:"eptMaterialId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"eptIdOfMaterialName",title:"材料名称",align:"center",width:120},
		            	{field:"eptMaterialAmout",title:"出库数量",align:"center",width:120},
		            	{field:"eptUnitPrice",title:"出库单价",align:"center",width:120},
		            	{field:"eptWarehouseName",title:"所出仓库",align:"center",width:120},
		            	{field:"eptMaterialOperatorName",title:"经办人",align:"center",width:120},
		            	{field:"exportDate",title:"出库时间",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#TemMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 更新出库信息界面 */
	$("#TemUpdateForm").dialog({
		width:1020,
		height:450,
		title:'出库信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				isConfirmUpdate();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TemUpdateForm").dialog('close');
			}
		}]
	});
	
	/* 查询出库信息界面 */
	$("#TemSearchForm").dialog({
		width:1030,
		height:255,
		title:'查询出库信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				temSearchNewsFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#TemSearchForm").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#TemSearchForm input").val("");
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#temSeeDetailPage").dialog({
		 width:1008,
		 height:488,
		 title:'材料出库界面',
		 closed : true,
		 modal : true,
	 });
	
	TemInitFn();
});

/* 初始化页面控件方法 */
function TemInitFn(){
	/* 初始化向导按钮 */
	$("#TemAddBT").linkbutton({					   //添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			TemAddFn();
		}
	});
	$("#TemDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			TemRemoveRowsFn();
		}
	});
	$("#TemUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			openTemUpdateDialog();
		}
	});
	$("#TemSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#TemSearchForm").dialog('open');
		}
	});
	$("#TemClearBT").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#TemNavsForm input").val("");
		}
	});
	
	$("#TemOutput").linkbutton({					//导出
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
		}
	});
	
	$("#TemCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	//材料编号
	$("#eptIdOfMaterial,#temUeptIdOfMaterial,#temSeptIdOfMaterial").combogrid({
		panelWidth:800,
		panelHeight:'135',
	    idField:'mtlId',
	    fitColumns:false,    
	    textField:'mtlName',    
	    url:'MaterialPage.json',
//	    editable:false,
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"mtlId",title:"编号",align:"center",width:120},
					{field:"mtlName",title:"材料名称",align:"center",width:200},
					{field:"mtlSpecification",title:"材料规格",align:"center",width:220,
						formatter : function(val,row){if (val){return val} else {return "暂无";}}
					},
					{field:"mtlUnit",title:"单位",align:"center",width:250},
		    ]],
	});
	
	//出库数量
	$("#eptMaterialAmout,#temUeptMaterialAmout").validatebox({
		required : true,
		missingMessage : '请输入出库数量'
	});
	
	//出库单价
	$("#eptUnitPrice,#temUeptUnitPrice").validatebox({
		required : true,
		missingMessage : '请输入出库单价'
	});
	
	//所出仓库
	$("#eptWarehouseId,#temUeptWarehouseId,#temSeptWarehouseId").combogrid({
		panelWidth:800,
		panelHeight:'150',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:160},
					{field:"warehouseName",title:"仓库名称",align:"center",width:360},
					{field:"storeAmout",title:"库存量",align:"center",width:260},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]]
	});
	
	//经办人
	$("#eptMaterialOperator,#temUeptMaterialOperator,#temSeptMaterialOperator").combogrid({
		panelWidth:1200,
		panelHeight:'150',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName',    
	    url: "column.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'employeeId',title:'账号',align:'center',width:100,sortable:true},
					{field:'empName',title:'姓名',align:'center',width:100,sortable:true},    
					{field:'department',title:'部门',align:'center',width:100,sortable:true},  
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empEmail',title:'邮箱',align:'center',width:100}, 
					{field:'aStatus',title:'状态',align:'center',width:100,
						formatter: function(value,row,index){
							if (value==0){
								return "失效";
							} else {
								return "激活";
							}
						},
						styler: function(value,row,index){
							if (value==0){
								return 'color:red;';
							}else if(value==1){
								return 'color:green;';
							}
						}
					
					}, 
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	
	// 出库时间
	$("#temSexportDateStart,#temSexportDateEnd").datetimebox({
		editable:false,
	});
	
//	//出库图片
//	$("#eptMaterialPics").click(function(){
//		$(this).attr('value','上传成功');
//		toPrompt('上传图片提示','上传图片成功');
//	});
}

//判断是否符合添加出库的条件的方法
function TemIsCanAdd(){
	// 获得添加的图片个数
	var sum=$("#temImgBox").find(".commonImgBoxCss");
	if($("#eptIdOfMaterial").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库的材料名称');
		return false;
	}else if($("#eptWarehouseId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库材料的仓库');
		return false;
	}else if(!$("#eptMaterialAmout").validatebox('isValid')){
		$("#eptMaterialAmout").focus();
		return false;
	}else if(!$("#eptUnitPrice").validatebox('isValid')){
		$("#eptUnitPrice").focus();
		return false;
	}else if($("#eptMaterialOperator").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择经办人');
		return false;
	}else if(sum.length<=0){
		toPrompt('添加出库提示','请选择图片');
		return false;
	}else{
		return true;
	}
}

//添加出库方法
function TemAddFn(){
	var value=TemIsCanAdd();
	if(value){
		$.messager.confirm('出库材料提示','确定出库材料？',function(data){
			if(data){
				// 将之前添加的图片在界面移除，便于下次添加
				$("#temImgBox").find(".commonImgBoxCss").remove();
				$("#TemTable").datagrid('load');				//刷新当前页面
				toPrompt('出库材料提示','出库材料成功');
			}
		});
	}
}

//删除方法
function TemRemoveRowsFn(){
	var rows=$("#TemTable").datagrid('getSelections');
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
				
				
				$("#TemTable").datagrid('load');							//调用该方法刷新当前页
				$("#TemTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//打开更新窗口
function openTemUpdateDialog(){
	var rows=$("#TemTable").datagrid('getSelections');
	if(rows.length==1){
		temGetUpdateNews(rows);								//调用获得选中行的数据的方法
		$("#TemUpdateForm").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中行的信息并传递到更新界面
function temGetUpdateNews(rows){
	//仓库名称
	$("#temUeptIdOfMaterial").combogrid('setValue',rows[0].eptIdOfMaterial);
	$("#temUeptIdOfMaterial").combogrid('setText',rows[0].eptIdOfMaterialName);
	
	//出库数量
	$("#temUeptMaterialAmout").val(rows[0].eptMaterialAmout);
	
	//出库单价
	$("#temUeptUnitPrice").val(rows[0].eptUnitPrice);
	
	//所出仓库
	$("#temUeptWarehouseId").combogrid('setValue',rows[0].eptWarehouseId);
	$("#temUeptWarehouseId").combogrid('setText',rows[0].eptWarehouseName);
	
	//经办人
	$("#temUeptMaterialOperator").combogrid('setValue',rows[0].eptMaterialOperator);
	$("#temUeptMaterialOperator").combogrid('setText',rows[0].eptMaterialOperatorName);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#temUpdateImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var uImgArr=rows[0].eptMaterialPics.split('|');
	// 将读取到的图片传递到更新界面的地址数组中
	temUpdateImgPathBox=uImgArr;
	
	//创建存在的图片数
	for (var i = 0; i < temUpdateImgPathBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='temDisplayDelIcon(this)' onmouseout='temDhideDelIcon(this)'><img alt='aa' src='"+temUpdateImgPathBox[i]+"' class='imgCommonCss' onclick='temUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='temUpdateDelThisImg(this)'></div>";
		$("#temUpdateImgBox").prepend(imgBoxS);
	}
}

//判断是否符合更新条件方法
function TemIsCanUpdateFn(){
	var sum=$("#temUpdateImgBox").find(".commonImgBoxCss");
	if($("#temUeptIdOfMaterial").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库的材料名称');
		return false;
	}else if($("#temUeptWarehouseId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库材料的仓库');
		return false;
	}else if(!$("#temUeptMaterialAmout").validatebox('isValid')){
		$("#temUeptMaterialAmout").focus();
		return false;
	}else if(!$("#temUeptUnitPrice").validatebox('isValid')){
		$("#temUeptUnitPrice").focus();
		return false;
	}else if($("#temUeptMaterialOperator").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择经办人');
		return false;
	}else if(sum.length<=0){
		toPrompt('添加出库提示','请选择图片');
		return false;
	}else{
		return true;
	}
}


//点击确认更新方法
function isConfirmUpdate(){
	var value=TemIsCanUpdateFn();
	if(value){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新仓库信息提示','是否更新成功');
				$("#TemUpdateForm").dialog('close');
			}
		});
		
	}
}


//查询出库信息方法
function temSearchNewsFn(){
	toPrompt('查询信息提示','是否查询成功');
	$("#TemSearchForm").dialog('close');
}

//查看详情界面
function seeTemDetail(){
	var rows=$("#TemTable").datagrid('getSelections');
	if(rows.length==1){
		getTemRowNewsFn(rows);
		$("#temSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

//将选中的信息传导详细界面
function getTemRowNewsFn(rows){
	
	//出库材料名称
	$("#temDeptIdOfMaterial").text(rows[0].eptIdOfMaterialName);
	
	//出库材料数量
	$("#temDeptMaterialAmout").text(rows[0].eptMaterialAmout);
	
	//出库材料单价
	$("#temDeptUnitPrice").text(rows[0].eptUnitPrice);
	
	//材料出库的仓库
	$("#temDeptWarehouseId").text(rows[0].eptWarehouseName);
	
	//经办人
	$("#temDeptMaterialOperator").text(rows[0].eptMaterialOperatorName);
	
	//出库时间
	$("#temDeptExportDate").text(rows[0].exportDate);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#temDetailImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].eptMaterialPics.split('|');
	temSeeDetailImgPath=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < temSeeDetailImgPath.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'><img alt='aa' src='"+temSeeDetailImgPath[i]+"' class='imgCommonCss' onclick='temSeeDetailDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss'></div>";
		$("#temDetailImgBox").prepend(imgBoxS);
	}
}

/**
 * 添加界面添加图片的方法
 * */

// 定义一个接受返回的图片地址的全局数组变量方便个个方法之间的使用
var temAddImgPathArr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

/**
 * 添加图片方法
 */
$("#temUplaodBt").click(function(){
	// 获得界面上添加了的图片的个数(用来判断是否上传个人超过限定)
	var sum=$("#temImgBox").find(".commonImgBoxCss");
	//判断是否添加超过限定个数
	if(sum.length<15){
		for (var i = 0; i < 1; i++) {
			var imgBoxS="<div class='commonImgBoxCss'  onmouseover='temDisplayDelIcon(this)' onmouseout='temDhideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='temAddDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='temAddDelThisImg(this)'></div>";
			$("#temImgBox").prepend(imgBoxS);
			// 给保存添加界面的图片数组插入当前图片的地址
			temAddImgPathArr.push('img/a1.jpg');
		}
	}else{
		alert('最多能添加15张图片');
	}
});


// 鼠标移上显示删除图片的图标
function temDisplayDelIcon(target){
	$(target).find("img").last().css('display','inline-block');
}


// 鼠标移走隐藏删除图片的图标
function temDhideDelIcon(target){
	$(target).find("img").last().hide();
}

/**
 * // 添加界面时点击删除图片
 * @param target
 */
function temAddDelThisImg(target){
	// 此处进行删除相应存在数据库的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<temAddImgPathArr.length;i++){
		if(temAddImgPathArr[i]==path){
			imgIndex=i;
			break;
		}
	}
	//删除图片数组中对应的图片
	temAddImgPathArr.splice(imgIndex,1);
	
}


/**
 * 添加界面点击图片时显示正真大小的图片
 * @param target
 */
function temAddDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<temAddImgPathArr.length;i++){
		if(temAddImgPathArr[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行浏览图片出现的错位 */
	var sum=$("#temImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#temDisplayBigImg").css('margin-top','-358px');
	}else{
		$("#temDisplayBigImg").css('margin-top','-243px');
	}
	$("#temAddNowIndex").text(nowIndex+1);
	$("#temAddAllCount").text(temAddImgPathArr.length);
	$("#temAddtheTureImg").attr('src',imgPath);
	$("#temDisplayBigImg").fadeIn('600');
}


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temAddupImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#temAddtheTureImg").attr('src');
	//用来接受地址相等时返回的地址
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	for(var i=0;i<temAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(temAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==temAddImgPathArr.length-1){
		pathIndex=0;
		$("#temAddNowIndex").text(pathIndex+1);
		$("#temAddtheTureImg").attr('src',temAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#temAddNowIndex").text(pathIndex+1);
		$("#temAddtheTureImg").attr('src',temAddImgPathArr[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temAddnextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#temAddtheTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<temAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(temAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=temAddImgPathArr.length-1;
		$("#temAddNowIndex").text(pathIndex+1);
		$("#temAddtheTureImg").attr('src',temAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#temAddNowIndex").text(pathIndex+1);
		$("#temAddtheTureImg").attr('src',temAddImgPathArr[pathIndex]);
	}
});

/**
 * 添加界面关闭弹出图片的窗体
 */
$("#temCloseImgDialog").click(function(){
	$("#temDisplayBigImg").fadeOut('600');
});



/**
 * 更新界面添加图片的方法
 * @param title
 * @param msgs
 */

//定义一个全局变量数组用来存储更新时上传图片返回的数组
var temUpdateImgPathBox=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

$("#temUpdateUplaodBt").click(function(){
	// 需要接受上传图片的个数和对应图片的地址(应该为数组方式)
	var sum=$("#temUpdateImgBox").find(".commonImgBoxCss");
	if(sum.length<15){
	for (var i = 0; i < 1; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='temDisplayDelIcon(this)' onmouseout='temDhideDelIcon(this)'><img alt='aa' src='img/a"+(i+1)+".jpg' class='imgCommonCss' onclick='temUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='temUpdateDelThisImg(this)'></div>";
		$("#temUpdateImgBox").prepend(imgBoxS);
		temUpdateImgPathBox.push('img/a1.jpg');
	}
	}else{
		alert('最多能添加15张图片');
	}
});


/**
 * 更新界面时点击删除图片方法
 * @param target
 */
function temUpdateDelThisImg(target){
	// 此处进行删除相应在数据库中的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<temUpdateImgPathBox.length;i++){
		if(temUpdateImgPathBox[i]==path){
			imgIndex=i;
			break;
		}
	}
	//删除图片数组中对应的图片
	temUpdateImgPathBox.splice(imgIndex,1);
}

/**
 * 更新界面点击图片时显示正真大小的图片
 * @param target
 */
function temUpdateDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<temUpdateImgPathBox.length;i++){
		if(temUpdateImgPathBox[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#temImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#temUpdateDisplayBigImg").css('margin-top','-358px');
	}else{
		$("#temUpdateDisplayBigImg").css('margin-top','-243px');
	}
	$("#temUpdateNowIndex").text(nowIndex+1);
	$("#temUpdateAllCount").text(temUpdateImgPathBox.length);
	$("#temUpdateTheTureImg").attr('src',imgPath);
	$("#temUpdateDisplayBigImg").fadeIn('600');
}

/**
 * 更新界面关闭弹出图片的窗体
 */
$("#temupdateCloseImgDialog").click(function(){
	$("#temUpdateDisplayBigImg").fadeOut('600');
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temUpdateUpImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#temUpdateTheTureImg").attr('src');
	//用来接受地址相等时返回的地址的参数
	var pathIndex=0;	
	for(var i=0;i<temUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(temUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==temUpdateImgPathBox.length-1){
		pathIndex=0;
		$("#temUpdateNowIndex").text(pathIndex+1);
		$("#temUpdateTheTureImg").attr('src',temUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#temUpdateNowIndex").text(pathIndex+1);
		$("#temUpdateTheTureImg").attr('src',temUpdateImgPathBox[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temUpdateNextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#temUpdateTheTureImg").attr('src');
	
	var pathIndex=0;	
	for(var i=0;i<temUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(temUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=temUpdateImgPathBox.length-1;
		$("#temUpdateNowIndex").text(pathIndex+1);
		$("#temUpdateTheTureImg").attr('src',temUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#temUpdateNowIndex").text(pathIndex+1); 
		$("#temUpdateTheTureImg").attr('src',temUpdateImgPathBox[pathIndex]);
	}
});




/**
 * 定义一个存放详细界面中存放图片的地址数组(查看详细界面中的图片是无法进行删除添加操作)
 */
var temSeeDetailImgPath=[];

/**
 * 查看详情界面点击图片时显示正真大小的图片
 * @param target
 */
function temSeeDetailDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<temSeeDetailImgPath.length;i++){
		if(temSeeDetailImgPath[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#temImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#temSeeDetailDisplayBigImg").css('margin-top','-358px');
	}else{
		$("#temSeeDetailDisplayBigImg").css('margin-top','-243px');
	}
	$("#temDetailnowIndex").text(nowIndex+1);
	$("#temDetailAllCount").text(temSeeDetailImgPath.length);
	$("#temDetailSeeDetailTheTureImg").attr('src',imgPath);
	$("#temSeeDetailDisplayBigImg").fadeIn('600');
}


/**
 * 查看详情界面关闭弹出图片的窗体
 */
$("#temSeeDetailCloseImgDialog").click(function(){
	$("#temSeeDetailDisplayBigImg").fadeOut('600');
});

/**
 * 查看详情中上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temDetailSeeDetailUpImage").click(function(){
	var imgPath=$("#temDetailSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<temSeeDetailImgPath.length;i++){
		if(temSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==temSeeDetailImgPath.length-1){
		pathIndex=0;
		//显示当前页
		$("#temDetailnowIndex").text(pathIndex+1);
		$("#temDetailSeeDetailTheTureImg").attr('src',temSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex++;
		$("#temDetailnowIndex").text(pathIndex+1);
		$("#temDetailSeeDetailTheTureImg").attr('src',seeDetailImgPath[pathIndex]);
	}
	
});

/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#temDetailSeeDetailNextImage").click(function(){
	var imgPath=$("#temDetailSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<temSeeDetailImgPath.length;i++){
		if(temSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=temSeeDetailImgPath.length-1;
		$("#temDetailnowIndex").text(pathIndex+1);
		$("#temDetailSeeDetailTheTureImg").attr('src',temSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex--;
		$("#temDetailnowIndex").text(pathIndex+1);
		$("#temDetailSeeDetailTheTureImg").attr('src',temSeeDetailImgPath[pathIndex]);
	}
	
});




/* 右键弹出菜单 */

//更新事件
$("#TemUpdateMenu").click(function (){			
	openTemUpdateDialog();
});


//删除事件
$("#TemDeletMenu").click(function (){
	TemRemoveRowsFn();
});

//查看事件
$("#TemSeeMenu").click(function (){
	seeTemDetail();
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