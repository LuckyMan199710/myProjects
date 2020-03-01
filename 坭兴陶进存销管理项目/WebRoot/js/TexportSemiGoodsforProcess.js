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
	for (var i = 0; i < 5; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='displayDelIcon(this)' onmouseout='hideDelIcon(this)'><img alt='aa' src='"+arr[i]+"' class='imgCommonCss' onclick='disPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='delThisImg(this)'></div>";
		$("#tsgfImgBox").prepend(imgBoxS);
	}
	
	/* 显示信息 */
	$("#tsgfTable").datagrid({
		fitColumns:false,
		url:'TexportSemiGoodsforProcess.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"esspId",
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
		toolbar:'#tsgfNavForm',
		columns : [[
		            	{field:"esspId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"idOfSemiFinishedGoodsName",title:"名称",align:"center",width:180},
		            	{field:"esspAmout",title:"出库数量",align:"center",width:180},
		            	{field:"esspUnitPrice",title:"出库单价",align:"center",width:180},
		            	{field:"essOperatorName",title:"经办人",align:"center",width:180},
		            	{field:"processName",title:"加工内容",align:"center",width:180},
		            	{field:"processTypeName",title:"加工类型",align:"center",width:180},
		            	{field:"processStyleName",title:"加工风格",align:"center",width:180},
		            	{field:"craftsmanName",title:"技术人员",align:"center",width:180},
		            	{field:"essWarehouseIdName",title:"所出仓库",align:"center",width:220},
		            	{field:"essCompanyIdName",title:"公司名称",align:"center",width:220},
		            	{field:"essExportDate",title:"出库时间",align:"center",width:220},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#essMenu").menu('show',{
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
	$("#essUpdateForm").dialog({
		width:1038,
		height:505,
		title:'出库信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				essIsConfirmUpdate();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#essUpdateForm").dialog('close');
			}
		}]
	});
	
	/* 查询出库信息界面 */
	$("#essSearchForm").dialog({
		width:1030,
		height:308,
		title:'查询出库信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){
				essSearchNewsFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#essSearchForm").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#essSearchForm input").val("");
			}
		}]
	});
	
	/* 查看详情界面 */
	 $("#essSeeDetailPage").dialog({
		 width:1008,
		 height:575,
		 title:'半成品出库界面',
		 closed : true,
		 modal : true,
	 });
	
	tsgfInitFn();			// 调用控件初始化方法
});


/* 初始化页面控件方法 */
function tsgfInitFn(){
	/* 初始化向导按钮 */
	$("#tsgfAddBT").linkbutton({					//添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			essAddFn();
		}
	});
	$("#tsgfDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			essDelRowFn();
		}
	});
	$("#tsgfUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			openEssUpdateDialog();
		}
	});
	$("#tsgfSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#essSearchForm").dialog('open');
		}
	});
	$("#tsgfClearBT").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#tsgfNavForm input").val("");
		}
	});
	
	$("#tsgfOutput").linkbutton({					//导出
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
		}
	});
	
	$("#tsgfCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	// 半成品名称
	$("#idOfSemiFinishedGoods,#essSidOfSemiFinishedGoods,#essUidOfSemiFinishedGoods").combogrid({
		panelWidth:835,
		panelHeight:'165',
	    idField:'sgId',
	    fitColumns:false,    
	    textField:'sgName',    
	    url:'TSemifinishedGoods.json',
	   	nowrap:true, 
	   	scrollbarSize:12,
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:"sgId",title:"编号",align:"center",width:120},
					{field:"sgName",title:"名称",align:"center",width:200},
					{field:"sgSpecification",title:"规格",align:"center",width:220,
						formatter : function(val,row){if (val){return val} else {return "暂无";}}
					},
					{field:"sgUnit",title:"单位",align:"center",width:250},
		    ]],
	});
	
	//出库数量
	$("#esspAmout,#essUesspAmout").validatebox({
		required : true,
		missingMessage : '请输入出库数量'
	});
	
	//出库单价
	$("#esspUnitPrice,#essUesspUnitPrice").validatebox({
		required : true,
		missingMessage : '请输入出库单价'
	});
	
	//所出仓库
	$("#essWarehouseId,#essSwarehouseId,#essUwarehouseId").combogrid({
		panelWidth:835,
		panelHeight:'165',
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
					{field:"warehouseName",title:"仓库名称",align:"center",width:360},
					{field:"storeAmout",title:"库存量",align:"center",width:260},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]]
	});
	
	//经办人
	$("#essOperator,#essSoperator,#essUoperator").combogrid({
		panelWidth:1235,
		panelHeight:'166',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName',    
	    url: "column.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:'employeeId',title:'账号',align:'center',width:100,sortable:true},
					{field:'empName',title:'姓名',align:'center',width:100},    
					{field:'department',title:'部门',align:'center',width:100},  
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empEmail',title:'邮箱',align:'center',width:100}, 
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	
	//公司名称
	$("#essCompanyId,#essScompanyId,#essUcompanyId").combogrid({
		panelWidth:835,
		panelHeight:'165',
	    idField:'cpyId',
	    fitColumns:true,    
	    textField:'cpyName',    
	    url: 'enterpriseDemo.json',
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"creditCode",title:"唯一编号",align:"center",width:260},
					{field:"cpyName",title:"名称",align:"center",width:260},
					{field:"cpyTelphone",title:"联系电话",align:"center",width:260},
					{field:"cpyAddress",title:"地址",align:"center",width:600},
		    ]]
	});
	

	// 出库时间
	$("#essSexportDateStart,#essSexportDateEnd").datetimebox({
		editable:false,
	});
	
	// 加工内容
	$("#processId,#updateProcessId,#essSProcessId").combogrid({
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
	
	// 技术人员
	$("#craftsmanId,#updateCraftsmanId,#essSCraftsmanId").combogrid({
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
	
}

// 判断添加出库时是否符合条件
function essIsCanAddFn(){
	if($("#idOfSemiFinishedGoods").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择出库的半成品');
		return false;
	}else if($("#essWarehouseId").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择出库的仓库');
		return false;
	}else if(!$("#esspAmout").validatebox('isValid')){
		$("#esspAmout").focus();
		return false;
	}else if(!$("#esspUnitPrice").validatebox('isValid')){
		$("#esspUnitPrice").focus();
		return false;
	}else if($("#essOperator").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择经办人');
		return false;
	}else if($("#essCompanyId").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择公司名称');
		return false;
	}else if($("#processId").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择加工内容');
		return false;
	}else if($("#craftsmanId").combogrid('getValue')==""){
		toPrompt('添加半成品出库提示','请选择技术人员');
		return false;
	}else{
		return true;
	}
}

// 添加半成品出库的方法
function essAddFn(){
	// 判断是否符合添加条件
	var value=essIsCanAddFn(); 
	if(value){
		$.messager.confirm('出库提示','确认将半成品出库？',function(data){
			if(data){
				// 将之前添加的图片在界面移除，便于下次添加
				$("#tsgfImgBox").find(".commonImgBoxCss").remove();
				
				toPrompt('出库消息提示','出库成功');
				$("#tsgfTable").datagrid('load');
			}
		});
	}
}

//删除方法
function essDelRowFn(){
	var rows=$("#tsgfTable").datagrid('getSelections');
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
				
				
				$("#tsgfTable").datagrid('load');							//调用该方法刷新当前页
				$("#tsgfTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

//查询出库信息方法
function essSearchNewsFn(){
	toPrompt('查询信息提示','是否查询成功');
	$("#essSearchForm").dialog('close');
}

//打开更新窗口
function openEssUpdateDialog(){
	var rows=$("#tsgfTable").datagrid('getSelections');
	if(rows.length==1){
		tsemiGetUpdateNews(rows);								//调用获得选中行的数据的方法
		$("#essUpdateForm").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中行的信息并传递到更新界面
function tsemiGetUpdateNews(rows){
	//半成品名称
	$("#essUidOfSemiFinishedGoods").combogrid('setValue',rows[0].idOfSemiFinishedGoods);
	$("#essUidOfSemiFinishedGoods").combogrid('setText',rows[0].idOfSemiFinishedGoodsName);
	
	//出库数量
	$("#essUesspAmout").val(rows[0].esspAmout);
	
	//出库单价
	$("#essUesspUnitPrice").val(rows[0].esspUnitPrice);
	
	//所出仓库
	$("#essUwarehouseId").combogrid('setValue',rows[0].essWarehouseId);
	$("#essUwarehouseId").combogrid('setText',rows[0].essWarehouseIdName);
	
	//经办人
	$("#essUoperator").combogrid('setValue',rows[0].essOperator);
	$("#essUoperator").combogrid('setText',rows[0].essOperatorName);
	
	//公司名称
	$("#essUcompanyId").combogrid('setValue',rows[0].essCompanyId);
	$("#essUcompanyId").combogrid('setText',rows[0].essCompanyIdName);
	
	// 加工内容
	$("#updateProcessId").combogrid('setValue',rows[0].processId);
	$("#updateProcessId").combogrid('setText',rows[0].processName);
	
	// 技术人员
	$("#updateCraftsmanId").combogrid('setValue',rows[0].craftsmanId);
	$("#updateCraftsmanId").combogrid('setText',rows[0].craftsmanName);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#tsgfUpdateImgBox").find(".commonImgBoxCss").remove();
	
	console.log(rows[0].esspPics);
	//图片
	var uImgArr=rows[0].esspPics.split('|');
	// 将读取到的图片传递到更新界面的地址数组中
	updateImgPathBox=uImgArr;
	
	//创建存在的图片数
	for (var i = 0; i < updateImgPathBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='displayDelIcon(this)' onmouseout='hideDelIcon(this)'><img alt='aa' src='"+updateImgPathBox[i]+"' class='imgCommonCss' onclick='updateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='updateDelThisImg(this)'></div>";
		$("#tsgfUpdateImgBox").prepend(imgBoxS);
	}
}

//判断是否符合更新条件方法
function essIsCanUpdateFn(){
	if($("#essUidOfSemiFinishedGoods").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库的半成品名称');
		return false;
	}else if($("#essUwarehouseId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择出库半成品的仓库');
		return false;
	}else if(!$("#essUesspAmout").validatebox('isValid')){
		$("#essUesspAmout").focus();
		return false;
	}else if(!$("#essUesspUnitPrice").validatebox('isValid')){
		$("#essUesspUnitPrice").focus();
		return false;
	}else if($("#essUoperator").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择经办人');
		return false;
	}else if($("#essUcompanyId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择公司名称');
		return false;
	}else if($("#updateProcessId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择加工内容');
		return false;
	}else if($("#updateCraftsmanId").combogrid('getValue')==""){
		toPrompt('添加出库提示','请选择技术人员');
		return false;
	}else{
		return true;
	}
}


//点击确认更新方法
function essIsConfirmUpdate(){
	var value=essIsCanUpdateFn();
	if(value){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新信息提示','是否更新成功');
				$("#essUpdateForm").dialog('close');
			}
		});
		
	}
}

//查看详情界面
function seeEssDetail(){
	var rows=$("#tsgfTable").datagrid('getSelections');
	if(rows.length==1){
		getEssRowNewsFn(rows);
		$("#essSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

//将选中的信息传导详细界面
function getEssRowNewsFn(rows){
	
	//出库半成品名称
	$("#essDetailIdOfSemiFinishedGoods").text(rows[0].idOfSemiFinishedGoodsName);
	
	//出库数量
	$("#essDetailEsspAmout").text(rows[0].esspAmout);
	
	//出库单价
	$("#essDetailEsspUnitPrice").text(rows[0].esspUnitPrice);
	
	//出库的仓库
	$("#essDetailWarehouseId").text(rows[0].essWarehouseIdName);
	
	//经办人
	$("#essDetailOperator").text(rows[0].essOperatorName);
	
	//公司名称
	$("#essDetailCompanyId").text(rows[0].essCompanyIdName);

	//出库时间
	$("#essDetailExportDate").text(rows[0].essExportDate);
	
	// 加工内容
	$("#essDetailAddContent").text(rows[0].processName);
	
	// 加工风格
	$("#essDetailAddStyle").text(rows[0].processStyleName);
	
	// 加工类型
	$("#essDetailAddType").text(rows[0].processTypeName);
	
	// 技术人员
	$("#essDetailTecknologyPerson").text(rows[0].craftsmanName);

	// 将之前添加的图片在界面移除，便于下次添加
	$("#detailImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].esspPics.split('|');
	seeDetailImgPath=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < detialImgBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'><img alt='aa' src='"+detialImgBox[i]+"' class='imgCommonCss' onclick='seeDetailDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='updateDelThisImg(this)'></div>";
		$("#detailImgBox").prepend(imgBoxS);
	}
	
}




/**
 * 添加界面添加图片的方法
 * */

// 定义一个接受返回的图片地址的全局数组变量方便个个方法之间的使用
var imgPathArr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];


/* 添加界面点击添加图片的按钮时的样式 */
$("#essUplaodBt").click(function(){
	// 需要接受上传图片返回的图片地址的数组
	
	// 获得界面上添加了的图片的个数
	var sum=$("#tsgfImgBox").find(".commonImgBoxCss");
	
	
	
	//判断是否添加超过限定个数
	if(sum.length<15){
		for (var i = 0; i < 1; i++) {
			var imgBoxS="<div class='commonImgBoxCss'  onmouseover='displayDelIcon(this)' onmouseout='hideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='disPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='delThisImg(this)'></div>";
			$("#tsgfImgBox").prepend(imgBoxS);
			// 给保存添加界面的图片数组插入当前图片的地址
			imgPathArr.push('img/a1.jpg');
		}
	}else{
		alert('最多能添加15张图片');
	}
});


// 鼠标移上显示删除图片的图标
function displayDelIcon(target){
	$(target).find("img").last().css('display','inline-block');
}


// 鼠标移走隐藏删除图片的图标
function hideDelIcon(target){
	$(target).find("img").last().hide();
}


/**
 * // 添加界面时点击删除图片删除图片
 * @param target
 */
function delThisImg(target){
	// 此处进行删除相应的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<imgPathArr.length;i++){
		if(imgPathArr[i]==path){
			imgIndex=i;
			break;
		}
	}
	
	//删除图片数组中对应的图片
	imgPathArr.splice(imgIndex,1);
	
}


/**
 * 添加界面点击图片时显示正真大小的图片
 * @param target
 */
function disPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<imgPathArr.length;i++){
		if(imgPathArr[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的当图片增加到第二行时防止浏览大图片时出现错位 */
	var sum=$("#tsgfImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tppDisplayBigImg").css('margin-top','-367px');
	}else{
		$("#tppDisplayBigImg").css('margin-top','-258px');
	}
	$("#addNowIndex").text(nowIndex+1);
	$("#addAllCount").text(imgPathArr.length);
	$("#theTureImg").attr('src',imgPath);
	$("#tppDisplayBigImg").fadeIn('600');
}


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#upImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#theTureImg").attr('src');
	//用来接受地址相等时返回的地址
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<imgPathArr.length;i++){
		// 返回当前图片的下标
		if(imgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==imgPathArr.length-1){
		pathIndex=0;
		$("#addNowIndex").text(pathIndex+1);
		$("#theTureImg").attr('src',imgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#addNowIndex").text(pathIndex+1);
		$("#theTureImg").attr('src',imgPathArr[pathIndex]);
	}
	
	// 将地址跟后台返回的全部图片的地址(应该是一个数组类型)进行比较返回对应的下标
	
	// 将下标减一并返回对应的图片地址(需要判断下标是否为零(即第一张)如果为零:方案一:可以将下标设置成图片地址数组的最大值(即循环显示图片))
	// 方案二:不修改该下标(即一直显示第一张的图片)
	
	// 将返回的地址设置为当前图片显示的地址
	//$("#theTureImg").attr('src','返回的地址');
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#nextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#theTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<imgPathArr.length;i++){
		// 返回当前图片的下标
		if(imgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=imgPathArr.length-1;
		$("#addNowIndex").text(pathIndex+1);
		$("#theTureImg").attr('src',imgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#addNowIndex").text(pathIndex+1);
		$("#theTureImg").attr('src',imgPathArr[pathIndex]);
	}
	
	// 将地址跟后台返回的全部图片的地址(应该是一个数组类型)进行比较返回对应的下标
	
	// 将下标加一并返回对应的图片地址(加一之前需判断下标是否已经为最大，若为最大，则方案跟上一页一样)
	
	// 将返回的地址设置为当前图片显示的地址
	// $("#theTureImg").attr('src','返回的地址');
});

/**
 * 添加界面关闭弹出图片的窗体
 */
$("#closeImgDialog").click(function(){
	$("#tppDisplayBigImg").fadeOut('600');
});




/**
 * 更新界面添加图片的方法
 * @param title
 * @param msgs
 */

//定义一个全局变量数组用来存储更新时上传图片返回的数组
var updateImgPathBox=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

$("#essUpdateUplaodBt").click(function(){
	// 需要接受上传图片的个数和对应图片的地址(应该为数组方式)
	var sum=$("#tsgfUpdateImgBox").find(".commonImgBoxCss");
	if(sum.length<15){
	for (var i = 0; i < 1; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='displayDelIcon(this)' onmouseout='hideDelIcon(this)'><img alt='aa' src='img/a"+(i+1)+".jpg' class='imgCommonCss' onclick='updateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='updateDelThisImg(this)'></div>";
		$("#tsgfUpdateImgBox").prepend(imgBoxS);
		updateImgPathBox.push('img/a1.jpg');
	}
	}else{
		alert('最多能添加15张图片');
	}
});


/**
 * 更新界面时点击删除图片方法
 * @param target
 */
function updateDelThisImg(target){
	// 此处进行删除相应的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<updateImgPathBox.length;i++){
		if(updateImgPathBox[i]==path){
			imgIndex=i;
			break;
		}
	}
	
	//删除图片数组中对应的图片
	updateImgPathBox.splice(imgIndex,1);
	
}

/**
 * 更新界面点击图片时显示正真大小的图片
 * @param target
 */
function updateDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<updateImgPathBox.length;i++){
		if(updateImgPathBox[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#tsgfImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tppUpdateDisplayBigImg").css('margin-top','-367px');
	}else{
		$("#tppUpdateDisplayBigImg").css('margin-top','-258px');
	}
	$("#updateNowIndex").text(nowIndex+1);
	$("#updateAllCount").text(updateImgPathBox.length);
	$("#updateTheTureImg").attr('src',imgPath);
	$("#tppUpdateDisplayBigImg").fadeIn('600');
}

/**
 * 更新界面关闭弹出图片的窗体
 */
$("#updateCloseImgDialog").click(function(){
	$("#tppUpdateDisplayBigImg").fadeOut('600');
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#updateUpImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#updateTheTureImg").attr('src');
	//用来接受地址相等时返回的地址的参数
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<updateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(updateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==updateImgPathBox.length-1){
		pathIndex=0;
		$("#updateNowIndex").text(pathIndex+1);
		$("#updateTheTureImg").attr('src',updateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#updateNowIndex").text(pathIndex+1);
		$("#updateTheTureImg").attr('src',updateImgPathBox[pathIndex]);
	}
	
	// 将地址跟后台返回的全部图片的地址(应该是一个数组类型)进行比较返回对应的下标
	
	// 将下标减一并返回对应的图片地址(需要判断下标是否为零(即第一张)如果为零:方案一:可以将下标设置成图片地址数组的最大值(即循环显示图片))
	// 方案二:不修改该下标(即一直显示第一张的图片)
	
	// 将返回的地址设置为当前图片显示的地址
	//$("#theTureImg").attr('src','返回的地址');
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#updateNextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#updateTheTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<updateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(updateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=updateImgPathBox.length-1;
		$("#updateNowIndex").text(pathIndex+1);
		$("#updateTheTureImg").attr('src',updateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#updateNowIndex").text(pathIndex+1); 
		$("#updateTheTureImg").attr('src',updateImgPathBox[pathIndex]);
	}
	
	// 将地址跟后台返回的全部图片的地址(应该是一个数组类型)进行比较返回对应的下标
	
	// 将下标加一并返回对应的图片地址(加一之前需判断下标是否已经为最大，若为最大，则方案跟上一页一样)
	
	// 将返回的地址设置为当前图片显示的地址
	// $("#theTureImg").attr('src','返回的地址');
});





/**
 * 定义一个存放详细界面中存放图片的地址数组(查看详细界面中的图片是无法进行删除添加操作)
 */
var seeDetailImgPath=[];

/**
 * 查看详情界面点击图片时显示正真大小的图片
 * @param target
 */
function seeDetailDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<seeDetailImgPath.length;i++){
		if(seeDetailImgPath[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#tsgfImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tppSeeDetailDisplayBigImg").css('margin-top','-367px');
	}else{
		$("#tppSeeDetailDisplayBigImg").css('margin-top','-258px');
	}
	$("#nowIndex").text(nowIndex+1);
	$("#allCount").text(seeDetailImgPath.length);
	$("#seeDetailTheTureImg").attr('src',imgPath);
	$("#tppSeeDetailDisplayBigImg").fadeIn('600');
}


/**
 * 查看详情界面关闭弹出图片的窗体
 */
$("#seeDetailCloseImgDialog").click(function(){
	$("#tppSeeDetailDisplayBigImg").fadeOut('600');
});

/**
 * 查看详情中上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#seeDetailUpImage").click(function(){
	var imgPath=$("#seeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<seeDetailImgPath.length;i++){
		if(seeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==seeDetailImgPath.length-1){
		pathIndex=0;
		//显示当前页
		$("#nowIndex").text(pathIndex+1);
		$("#seeDetailTheTureImg").attr('src',seeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex++;
		$("#nowIndex").text(pathIndex+1);
		$("#seeDetailTheTureImg").attr('src',seeDetailImgPath[pathIndex]);
	}
	
});

/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#seeDetailNextImage").click(function(){
	var imgPath=$("#seeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<seeDetailImgPath.length;i++){
		if(seeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=seeDetailImgPath.length-1;
		$("#nowIndex").text(pathIndex+1);
		$("#seeDetailTheTureImg").attr('src',seeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex--;
		$("#nowIndex").text(pathIndex+1);
		$("#seeDetailTheTureImg").attr('src',seeDetailImgPath[pathIndex]);
	}
	
});



/* 右键弹出菜单 */

//更新事件
$("#essUpdateMenu").click(function (){			
	openEssUpdateDialog();
});


//删除事件
$("#essDeletMenu").click(function (){
	essDelRowFn();
});

//查看事件
$("#essSeeMenu").click(function (){
	seeEssDetail();
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