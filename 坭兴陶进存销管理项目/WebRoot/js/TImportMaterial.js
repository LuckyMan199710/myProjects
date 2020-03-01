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
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='timDisplayDelIcon(this)' onmouseout='timDhideDelIcon(this)'><img alt='aa' src='"+(arr[i])+"' class='imgCommonCss' onclick='timDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='timDelThisImg(this)'></div>";
		$("#TIAImgBox").prepend(imgBoxS);
	}
	$('#TIpmDisRowBox').datagrid({
		url : "ImportSemigAndMetail.json",
		fit:true,
		border:false,
		method: "POST",
		pagination:true,
		striped:true,
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		sortName:'ipsId',
		sortOrder:'asc',
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		showFooter:true,
		rownumbers:true,
		remoteSort:false, // 定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   // 隔行换色
			}
		},
		toolbar : '#TINavBox',
	
			// fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'ipsId',title:'序号',align:'center',width:50,checkbox: true,},
        	{field:'ipsIdOfStuffName',title:'材料名称',align:'center',width:220},      
        	{field:'cpyName',title:'供货商',align:'center',width:250},
        	{field:'ipsAmout',title:'数量',align:'center',width:150},
        	{field:'ipsBrokenAmout',title:'破损数量',align:'center',width:150},
        	{field:'ipsImperfectionAmout',title:'残次品数量',align:'center',width:150},
        	{field:'ipsUnitPrice',title:'单价',align:'center',width:150}, 
        	{field:'warehouseName',title:'仓库名称',align:'center',width:250,sortable:true}, 
        	{field:'importDate',title:'入库时间',align:'center',width:200},
        	{field:'ipsOperatorName',title:'经办人',align:'center',width:150}, 
				]],
			onRowContextMenu : function(e, rowIndex, rowdata){										// 右键显示出现操作菜单
			 e.preventDefault();
			$("#TimMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$('#TIpmDisRowBox').datagrid('unselectAll');
			$('#TIpmDisRowBox').datagrid('selectRow',rowIndex);
		}
	});
	
	// 更新界面
	$("#TImUpdateBox").dialog({
		title : '入库信息更新界面',
		iconCls : 'icon-edit',
		width : 1068,
		height : 485,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '更新',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   ImmconfirTSFUpdateFn();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TImUpdateBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	// 查询窗体
	$("#TIpmSearchBox").dialog({
		title : '入库信息查询界面',
		iconCls : 'icon-edit',
		width : 1398,
		height : 270,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '查询',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   TimsearchTSFnews();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-undo',
		        	   handler : function(){
		        		   $('#TIpmSearchBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },{
		        	   text : '清空',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TIpmSearchBox input').val("");			// 关闭修改窗体
		        	   },
		           }
		          ],
	});
	
	/* 查看详情界面 */
	 $("#TimMSeeDetailPage").dialog({
		 width:978,
		 height:560,
		 title:'入库详情界面',
		 closed : true,
		 modal : true,
	 });
	
	TimInitsFn();																				// 调用输入控件初始化方法
});

$("#TIpmAddBT").linkbutton({					// 添加
	plain:true,
	iconCls:'icon-add',
	onClick:function(){
		addTimFn();
	}
});
$("#TIpmDeleteBT").linkbutton({					// 删除
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		deletTimRowsFn();
	}
});
$("#TIpmUpdateBT").linkbutton({					// 更新
	plain:true,
	iconCls:'icon-edit',
	onClick:function(){
		openTimDialogFn();
	}
});
$("#TIpmSearchBT").linkbutton({					// 查找
	plain:true,
	iconCls:'icon-search',
	onClick:function(){
		$("#TIpmSearchBox").dialog('open');
	}
});
$("#TIpmoutputBT").linkbutton({					// 导出
	plain:true,
	iconCls:'icon-large-smartart',
	onClick:function(){
	}
});
$("#TIpmClearBT").linkbutton({					// 清空
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		$("#TimOutBox input").val("");
	}
});
$("#TIpmcallbackBT").linkbutton({				// 返回
	plain:true,
	iconCls:'icon-undo',
	onClick:function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


/* 初始化输入控件 */
function TimInitsFn(){
	
	// 入库内容名称
	$("#ipsIdOfMaterial,#TIpmipsIdOfMaterial,#TipmuipsIdOfMaterial").combogrid({
		panelWidth:830,
		panelHeight:'170',
	    idField:'mtlId',
	    fitColumns:false,    
	    textField:'mtlName',    
	    url:'MaterialPage.json',
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"mtlId",title:"编号",align:"center",width:120},
					{field:"mtlName",title:"名称",align:"center",width:200},
					{field:"mtlSpecification",title:"规格",align:"center",width:220,
						formatter : function(val,row){if (val){return val} else {return "暂无";}}
					},
					{field:"mtlUnit",title:"单位",align:"center",width:250},
		    ]],
	});
	
	// 企业编号
	$("#ipsMtlIdOfCompany,#TIpmipsMtlIdOfCompany,#TipmuipsMtlIdOfCompany").combogrid({
		panelWidth:1200,
		panelHeight:'170',
	    idField:'cpyId',
	    fitColumns:false,    
	    textField:'cpyName',    
	    url: "enterpriseDemo.json",
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'cpyId',title:'序号',align:'center',width:50},
					{field:'creditCode',title:'统一社会信用代码',align:'center',width:135,sortable:true},
					{field:'cpyName',title:'企业名称',align:'center',width:220},      
					{field:'cpyTelphone',title:'企业电话',align:'center',width:120},
					{field:'bankOfDeposit',title:'开行户',align:'center',width:120},
					{field:'cpyAccount',title:'账号',align:'center',width:200},
					{field:'business',title:'业务范围',align:'center',width:200},
					{field:'registeredCapital',title:'注册资本',align:'center',width:120}, 
					{field:'registeredTime',title:'注册时间',align:'center',width:150,sortable:true}, 
					{field:'legalRepresentative',title:'法定代表人',align:'center',width:120}, 
					{field:'cpyType',title:'企业类型',align:'center',width:100,
						formatter: function(value,row,index){
						if (value==0){
							return "本企业";
						} else if(value==1) {
							return "供货商";
						}
					}
					}, 
					{field:'cpyAddress',title:'地址',align:'center',width:220}, 
		    ]],
		    
	});
	
	// 入库数量
	$("#ipsMtlAmout,#TipmuipsMtlAmout").validatebox({
		required : true,
		missingMessage : '请输入入库数量'
	});
	
	// 破损数量
	$("#ipsMtlBrokenAmout,#TipmuipsMtlBrokenAmout").validatebox({
		required : true,
		missingMessage : '请输入破损数量'
	});
	
	// 残次品数量
	$("#ipsMtlImperfectionAmout,#TipmuipsMtlImperfectionAmout").validatebox({
		required : true,
		missingMessage : '请输入残次品数量'
	});
	
	// 单价
	$("#ipsMtlUnitPrice,#TipmuipsMtlUnitPrice").validatebox({
		required : true,
		missingMessage : '请输入单价'
	});
	
	// 所入仓库
	$("#mtlWarehouseId,#TIpmmtlWarehouseId,#TipmumtlWarehouseId").combogrid({
		panelWidth:800,
		panelHeight:'170',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:100},
					{field:"warehouseName",title:"仓库名称",align:"center",width:250},
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
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]]
	});
	
	// 经办人
	$("#ipsMtlOperator,#TIpmipsMtlOperator,#TipmuipsMtlOperator").combogrid({
		panelWidth:900,
		panelHeight:'168',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName', 
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    url: "column.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'employeeId',title:'账号',align:'center',width:100,sortable:true},
					{field:'empName',title:'姓名',align:'center',width:100,sortable:true},    
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	
	/* 入库时间 */
	$("#TIpmMaterialImportDateStart,#TIpmMaterialImportDateEnd").datetimebox({
		editable:false,
	});
	
}




// 添加入库时判断是否符合添加条件的方法
function isCanAddTim(){
	var sum=$("#TIAImgBox").find(".commonImgBoxCss");
	if($("#ipsIdOfMaterial").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择入库的材料名称');
		return false;
	}else if($("#ipsMtlIdOfCompany").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择企业(供应商)名称');
		return false;
	}else if(!$("#ipsMtlAmout").validatebox('isValid')){
		$("#ipsMtlAmout").focus();
		return false;
	}else if(!$("#ipsMtlUnitPrice").validatebox('isValid')){
		$("#ipsMtlUnitPrice").focus();
		return false;
	}else if(!$("#ipsMtlBrokenAmout").validatebox('isValid')){
		$("#ipsMtlBrokenAmout").focus();
		return false;
	}else if(parseInt($("#ipsMtlBrokenAmout").val())>parseInt($("#ipsMtlAmout").val())){
		$("#ipsBrokenAmout").focus();
		toPrompt('添加入库提示','破损数量的值不能超过总量的值');
		return false;
	}else if(!$("#ipsMtlImperfectionAmout").validatebox('isValid')){
		$("#ipsMtlImperfectionAmout").focus();
		return false;
	}else if(parseInt($("#ipsMtlImperfectionAmout").val())+parseInt($("#ipsMtlBrokenAmout").val())>parseInt($("#ipsMtlAmout").val())){
		$("#ipsMtlImperfectionAmout").focus();
		toPrompt('添加入库提示','破损数量和残次品数量总和不能超过入库数量');
		return false;
	}else if($("#mtlWarehouseId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择仓库名称');
		return false;
	}else if($("#ipsMtlOperator").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择经办人');
		return false;
	}else if(sum.length<=0){
		toPrompt('添加入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}


// 添加入库方法
function addTimFn(){
	var v=isCanAddTim();
	if(v){
		$('#TIpmDisRowBox').datagrid('load');			// 刷新当前页
		// 将之前添加的图片在界面移除，便于下次添加
		$("#TIAImgBox").find(".commonImgBoxCss").remove();
		toPrompt('添加入库提示','添加入库成功');
	}
}

// 删除选中记录
function deletTimRowsFn(){
	var rows=$("#TIpmDisRowBox").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除某某条数据成功");
				var ids = [];												// 用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									// 将选定的行的id加入到数组中
				}
																			// 获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			// 进行后台数据交互
				
				
				$("#TIpmDisRowBox").datagrid('load');						// 调用该方法刷新当前页
				$("#TIpmDisRowBox").datagrid('unselectAll');					// 删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

// 打开更新窗体方法
function openTimDialogFn(){
	var rows=$("#TIpmDisRowBox").datagrid('getSelections');
	if(rows.length==1){
		getTimRowsValue(rows);
		$("#TImUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

// 获得选中行的信息并传递到更新界面放过
function getTimRowsValue(rows){
	
	// 入库内容
	$("#TipmuipsIdOfMaterial").combogrid('setValue',rows[0].ipsIdOfStuff);
	$("#TipmuipsIdOfMaterial").combogrid('setText',rows[0].ipsIdOfStuffName);
	
	// 企业名称
	$("#TipmuipsMtlIdOfCompany").combogrid('setValue',rows[0].ipsIdOfCompany);
	$("#TipmuipsMtlIdOfCompany").combogrid('setText',rows[0].cpyName);
	
	// 入库数量
	$("#TipmuipsMtlAmout").val(rows[0].ipsAmout);
	
	// 破损数量
	$("#TipmuipsMtlBrokenAmout").val(rows[0].ipsBrokenAmout);
	
	// 残次品数量
	$("#TipmuipsMtlImperfectionAmout").val(rows[0].ipsImperfectionAmout);
	
	// 单价
	$("#TipmuipsMtlUnitPrice").val(rows[0].ipsUnitPrice);
	
	// 所入仓库
	$("#TipmumtlWarehouseId").combogrid('setValue',rows[0].warehouseId);
	$("#TipmumtlWarehouseId").combogrid('setText',rows[0].warehouseName);
	
	// 经办人
	$("#TipmuipsMtlOperator").combogrid('setValue',rows[0].ipsOperator);
	$("#TipmuipsMtlOperator").combogrid('setText',rows[0].ipsOperatorName);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#TiAUpdateImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	timUpdateImgPathBox=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < timUpdateImgPathBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='timDisplayDelIcon(this)' onmouseout='timDhideDelIcon(this)'><img alt='aa' src='"+(timUpdateImgPathBox[i])+"' class='imgCommonCss' onclick='timUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='timUpdateDelThisImg(this)'></div>";
		$("#TiAUpdateImgBox").prepend(imgBoxS);
	}
}

// 确认更新时判断是否符合条件
function isCanUpdateTim(){
	// 上传的图片数
	var sum=$("#TiAUpdateImgBox").find(".commonImgBoxCss");
	if($("#TipmuipsIdOfMaterial").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择需要添加入库的内容');
		return false;
	}else if($("#TipmuipsMtlIdOfCompany").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择企业(供应商)名称');
		return false;
	}else if(!$("#TipmuipsMtlUnitPrice").validatebox('isValid')){
		$("#TipmuipsMtlUnitPrice").focus();
		return false;
	}else if(!$("#TipmuipsMtlAmout").validatebox('isValid')){
		$("#TipmuipsMtlAmout").focus();
		return false;
	}else if(!$("#TipmuipsMtlBrokenAmout").validatebox('isValid')){
		$("#TipmuipsMtlBrokenAmout").focus();
		return false;
	}else if(parseInt($("#TipmuipsMtlBrokenAmout").val())>parseInt($("#TipmuipsMtlAmout").val())){	// 判读破损数量是否超过入库总量
		$("#TipmuipsMtlBrokenAmout").focus();
		toPrompt('更新提示','破损数量的值不能超过总量的值');
		return false;
	}else if(!$("#TipmuipsMtlImperfectionAmout").validatebox('isValid')){
		$("#TipmuipsMtlImperfectionAmout").focus();
		return false;
	}else if(parseInt($("#TipmuipsMtlImperfectionAmout").val())+parseInt($("#TipmuipsMtlBrokenAmout").val())>parseInt($("#TipmuipsMtlAmout").val())){
		$("#TipmuipsMtlImperfectionAmout").focus();
		toPrompt('更新提示','破损数量和残次品数量总和不能超过入库数量');
		return false;
	}else if($("#TipmumtlWarehouseId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择仓库名称');
		return false;
	}else if($("#TipmuipsMtlOperator").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择经办人');
		return false;
	}else if(sum.length<=0){
		toPrompt('更新入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}


// 更新界面中的确认修改
function ImmconfirTSFUpdateFn(){
	var l=isCanUpdateTim();
	if(l){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$('#TIpmDisRowBox').datagrid('load');			// 刷新当前页
				$("#TImUpdateBox").dialog('close');
				toPrompt('更新入库提示','更新入库信息成功');
			}
		});
		
	}
}


// 查询入库信息方法
function TimsearchTSFnews(){
	toPrompt('查询入库信息提示','查询信息成功');
	$("#TIpmSearchBox").dialog('close');
}

//查看详情
function seeTimDetail(){
	var rows=$("#TIpmDisRowBox").datagrid('getSelections');
	if(rows.length==1){
		getTimRowDetailNews(rows);
		$("#TimMSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

// 将选中的信息传导详细界面
function getTimRowDetailNews(rows){
	
	// 入库内容名称
	$("#timSeeIpsIdOfStuff").text(rows[0].ipsIdOfStuffName);
	
	// 企业名称
	$("#timSeeIpsIdOfCompany").text(rows[0].cpyName);
	
	// 入库数量
	$("#timSeeIpsAmout").text(rows[0].ipsAmout);
	
	// 破损数量
	$("#timSeeIpsBrokenAmout").text(rows[0].ipsBrokenAmout);
	
	// 残次品数量
	$("#timSeeIpsImperfectionAmout").text(rows[0].ipsImperfectionAmout);
	
	// 单价
	$("#timSeeIpsUnitPrice").text(rows[0].ipsUnitPrice);
	
	// 所入仓库
	$("#timSeeWarehouseId").text(rows[0].warehouseName);
	
	// 经办人
	$("#timSeeIpsOperator").text(rows[0].ipsOperatorName);
	
	// 入库时间
	$("#timSeeImportDate").text(rows[0].importDate);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#timDetailImgBox").find(".commonImgBoxCss").remove();
	
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	timSeeDetailImgPath=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < timSeeDetailImgPath.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'><img alt='aa' src='"+timSeeDetailImgPath[i]+"' class='imgCommonCss' onclick='timSeeDetailDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' ></div>";
		$("#timDetailImgBox").prepend(imgBoxS);
	}
	
}
// 根据选定内容显示对应的入库信息(筛选)
function TstoreDisContent(){
	var value=$("#initCondition").combobox('getValue');			// 获得下拉列表选中的项对应的值
}


/**
 * 添加界面添加图片的方法
 * */

// 定义一个接受返回的图片地址的全局数组变量方便个个方法之间的使用
var timAddImgPathArr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

/**
 * 添加图片方法
 */
$("#TIUploadBt").click(function(){
	// 获得界面上添加了的图片的个数(用来判断是否上传个人超过限定)
	var sum=$("#TIAImgBox").find(".commonImgBoxCss");
	
	//判断是否添加超过限定个数
	if(sum.length<15){
		for (var i = 0; i < 1; i++) {
			var imgBoxS="<div class='commonImgBoxCss'  onmouseover='timDisplayDelIcon(this)' onmouseout='timDhideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='timDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='timDelThisImg(this)'></div>";
			$("#TIAImgBox").prepend(imgBoxS);
			// 给保存添加界面的图片数组插入当前图片的地址
			timAddImgPathArr.push('img/a1.jpg');
		}
	}else{
		alert('最多能添加15张图片');
	}
});


// 鼠标移上显示删除图片的图标
function timDisplayDelIcon(target){
	$(target).find("img").last().css('display','inline-block');
}


// 鼠标移走隐藏删除图片的图标
function timDhideDelIcon(target){
	$(target).find("img").last().hide();
}

/**
 * // 添加界面时点击删除图片
 * @param target
 */
function timDelThisImg(target){
	// 此处进行删除相应存在数据库的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<timAddImgPathArr.length;i++){
		if(timAddImgPathArr[i]==path){
			imgIndex=i;
			break;
		}
	}
	
	//删除图片数组中对应的图片
	timAddImgPathArr.splice(imgIndex,1);
	
}


/**
 * 添加界面点击图片时显示正真大小的图片
 * @param target
 */
function timDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<timAddImgPathArr.length;i++){
		if(timAddImgPathArr[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的当图片增加到第二行时防止浏览大图片时出现错位 */
	var sum=$("#TIAImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TiADisplayBigImg").css('margin-top','-363px');
	}else{
		$("#TiADisplayBigImg").css('margin-top','-249px');
	}
	$("#TiaAddNowIndex").text(nowIndex+1);
	$("#TiaAddAllCount").text(timAddImgPathArr.length);
	$("#TiaAddtheTureImg").attr('src',imgPath);
	$("#TiADisplayBigImg").fadeIn('600');
}


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiaAddupImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#TiaAddtheTureImg").attr('src');
	//用来接受地址相等时返回的地址
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<timAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(timAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==timAddImgPathArr.length-1){
		pathIndex=0;
		$("#TiaAddNowIndex").text(pathIndex+1);
		$("#TiaAddtheTureImg").attr('src',timAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#TiaAddNowIndex").text(pathIndex+1);
		$("#TiaAddtheTureImg").attr('src',timAddImgPathArr[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiaAddnextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#TiaAddtheTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<timAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(timAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=timAddImgPathArr.length-1;
		$("#TiaAddNowIndex").text(pathIndex+1);
		$("#TiaAddtheTureImg").attr('src',timAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#TiaAddNowIndex").text(pathIndex+1);
		$("#TiaAddtheTureImg").attr('src',timAddImgPathArr[pathIndex]);
	}
});

/**
 * 添加界面关闭弹出图片的窗体
 */
$("#TiACloseImgDialog").click(function(){
	$("#TiADisplayBigImg").fadeOut('600');
});



/**
 * 更新界面添加图片的方法
 * @param title
 * @param msgs
 */

//定义一个全局变量数组用来存储更新时上传图片返回的数组
var timUpdateImgPathBox=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

$("#TiAUpdateUplaodBt").click(function(){
	// 需要接受上传图片的个数和对应图片的地址(应该为数组方式)
	var sum=$("#TiAUpdateImgBox").find(".commonImgBoxCss");
	if(sum.length<15){
	for (var i = 0; i < 1; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='timDisplayDelIcon(this)' onmouseout='timDhideDelIcon(this)'><img alt='aa' src='img/a"+(i+1)+".jpg' class='imgCommonCss' onclick='timUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='timUpdateDelThisImg(this)'></div>";
		$("#TiAUpdateImgBox").prepend(imgBoxS);
		timUpdateImgPathBox.push('img/a1.jpg');
	}
	}else{
		alert('最多能添加15张图片');
	}
});


/**
 * 更新界面时点击删除图片方法
 * @param target
 */
function timUpdateDelThisImg(target){
	// 此处进行删除相应图片的的数据库路径
	
	var path=$(target).prev().attr('src');
	var imgIndex=-1;
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<timUpdateImgPathBox.length;i++){
		if(timUpdateImgPathBox[i]==path){
			imgIndex=i;
			break;
		}
	}
	//删除图片数组中对应的图片
	timUpdateImgPathBox.splice(imgIndex,1);
	
}

/**
 * 更新界面点击图片时显示正真大小的图片
 * @param target
 */
function timUpdateDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<timUpdateImgPathBox.length;i++){
		if(timUpdateImgPathBox[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#TIAImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TiAUpdateDisplayBigImg").css('margin-top','-363px');
	}else{
		$("#TiAUpdateDisplayBigImg").css('margin-top','-249px');
	}
	$("#TiAUpdateNowIndex").text(nowIndex+1);
	$("#TiAUpdateAllCount").text(timUpdateImgPathBox.length);
	$("#TiAUpdateTheTureImg").attr('src',imgPath);
	$("#TiAUpdateDisplayBigImg").fadeIn('600');
}

/**
 * 更新界面关闭弹出图片的窗体
 */
$("#TiAUpdateCloseImgDialog").click(function(){
	$("#TiAUpdateDisplayBigImg").fadeOut('600');
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiAUpdateUpImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#TiAUpdateTheTureImg").attr('src');
	//用来接受地址相等时返回的地址的参数
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<timUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(timUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==timUpdateImgPathBox.length-1){
		pathIndex=0;
		$("#TiAUpdateNowIndex").text(pathIndex+1);
		$("#TiAUpdateTheTureImg").attr('src',timUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#TiAUpdateNowIndex").text(pathIndex+1);
		$("#TiAUpdateTheTureImg").attr('src',timUpdateImgPathBox[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiAUpdateNextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#TiAUpdateTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<timUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(timUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=timUpdateImgPathBox.length-1;
		$("#TiAUpdateNowIndex").text(pathIndex+1);
		$("#TiAUpdateTheTureImg").attr('src',timUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#TiAUpdateNowIndex").text(pathIndex+1); 
		$("#TiAUpdateTheTureImg").attr('src',timUpdateImgPathBox[pathIndex]);
	}
});



/**
 * 定义一个存放详细界面中存放图片的地址数组(查看详细界面中的图片是无法进行删除添加操作)
 */
var timSeeDetailImgPath=[];

/**
 * 查看详情界面点击图片时显示正真大小的图片
 * @param target
 */
function timSeeDetailDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<timSeeDetailImgPath.length;i++){
		if(timSeeDetailImgPath[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#TIAImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TiASeeDetailDisplayBigImg").css('margin-top','-363px');
	}else{
		$("#TiASeeDetailDisplayBigImg").css('margin-top','-249px');
	}
	$("#TiASeedetialnowIndex").text(nowIndex+1);
	$("#TiASeedetialAllCount").text(timSeeDetailImgPath.length);
	$("#TiASeeDetailTheTureImg").attr('src',imgPath);
	$("#TiASeeDetailDisplayBigImg").fadeIn('600');
}


/**
 * 查看详情界面关闭弹出图片的窗体
 */
$("#TiASeeDetailCloseImgDialog").click(function(){
	$("#TiASeeDetailDisplayBigImg").fadeOut('600');
});

/**
 * 查看详情中上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiASeeDetailUpImage").click(function(){
	var imgPath=$("#TiASeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<timSeeDetailImgPath.length;i++){
		if(timSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==timSeeDetailImgPath.length-1){
		pathIndex=0;
		//显示当前页
		$("#TiASeedetialnowIndex").text(pathIndex+1);
		$("#TiASeeDetailTheTureImg").attr('src',timSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex++;
		$("#TiASeedetialnowIndex").text(pathIndex+1);
		$("#TiASeeDetailTheTureImg").attr('src',timSeeDetailImgPath[pathIndex]);
	}
	
});

/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TiASeeDetailNextImage").click(function(){
	var imgPath=$("#TiASeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<timSeeDetailImgPath.length;i++){
		if(timSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=timSeeDetailImgPath.length-1;
		$("#TiASeedetialnowIndex").text(pathIndex+1);
		$("#TiASeeDetailTheTureImg").attr('src',timSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex--;
		$("#TiASeedetialnowIndex").text(pathIndex+1);
		$("#TiASeeDetailTheTureImg").attr('src',timSeeDetailImgPath[pathIndex]);
	}
	
});



/* 右键弹出菜单 */

// 更新事件
$("#TimUpdateMenu").click(function (){			
	openTimDialogFn();
});


// 删除事件
$("#TimDeletMenu").click(function (){
	deletTimRowsFn();
});

// 查看事件
$("#TimSeeMenu").click(function (){
	seeTimDetail();
});



// 提示信息通用的方法
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:105
	});
}
