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
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tsemiDisplayDelIcon(this)' onmouseout='tsemiDhideDelIcon(this)'><img alt='aa' src='"+(arr[i])+"' class='imgCommonCss' onclick='tsemiDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tsemiDelThisImg(this)'></div>";
		$("#TsemiImgBox").prepend(imgBoxS);
	}
	$('#TsemiDisRowBox').datagrid({
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
		toolbar : '#TsemiNavBox',
	
			// fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'ipsId',title:'序号',align:'center',width:50,checkbox: true,},
        	{field:'ipsIdOfStuffName',title:'半成品名称',align:'center',width:220},      
        	{field:'cpyName',title:'供货商',align:'center',width:250},
        	{field:'ipsAmout',title:'数量',align:'center',width:150},
        	{field:'ipsBrokenAmout',title:'破损数量',align:'center',width:150},
        	{field:'ipsImperfectionAmout',title:'残次品数量',align:'center',width:150},
        	{field:'ipsUnitPrice',title:'单价',align:'center',width:150}, 
        	{field:'processContentName',title:'加工内容',align:'center',width:150},
        	{field:'processStyleName',title:'加工风格',align:'center',width:150},
        	{field:'processTypeName',title:'加工类型',align:'center',width:150},
        	{field:'craftsmanName',title:'技术人员',align:'center',width:150},
        	{field:'warehouseName',title:'仓库名称',align:'center',width:250,sortable:true}, 
        	{field:'importDate',title:'入库时间',align:'center',width:200},
        	{field:'ipsOperatorName',title:'经办人',align:'center',width:150}, 
				]],
			onRowContextMenu : function(e, rowIndex, rowdata){										// 右键显示出现操作菜单
			 e.preventDefault();
			$("#TsemiMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$('#TsemiDisRowBox').datagrid('unselectAll');
			$('#TsemiDisRowBox').datagrid('selectRow',rowIndex);
		}
	});
	
	// 更新界面
	$("#TsemiUpdateBox").dialog({
		title : '入库信息更新界面',
		iconCls : 'icon-edit',
		width : 1068,
		height : 505,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '更新',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   confirTsemiUpdateFn();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TsemiUpdateBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	// 查询窗体
	$("#TsemiSearchBox").dialog({
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
		        		   searchTseminews();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-undo',
		        	   handler : function(){
		        		   $('#TsemiSearchBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },{
		        	   text : '清空',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TsemiSearchBox input').val("");			// 关闭修改窗体
		        	   },
		           }
		          ],
	});
	
	/* 查看详情界面 */
	 $("#TsemiSeeDetailPage").dialog({
		 width:978,
		 height:608,
		 title:'入库详情界面',
		 closed : true,
		 modal : true,
	 });
	
	TsemiFInitsFn();																				// 调用输入控件初始化方法
});

$("#TsemiAddBT").linkbutton({					// 添加
	plain:true,
	iconCls:'icon-add',
	onClick:function(){
		addTsemiFn();
	}
});
$("#TsemiDeleteBT").linkbutton({					// 删除
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		deletTsemiRowsFn();
	}
});
$("#TsemiUpdateBT").linkbutton({					// 更新
	plain:true,
	iconCls:'icon-edit',
	onClick:function(){
		openTsemiDialogFn();
	}
});
$("#TsemiSearchBT").linkbutton({					// 查找
	plain:true,
	iconCls:'icon-search',
	onClick:function(){
		$("#TsemiSearchBox").dialog('open');
	}
});
$("#TsemioutputBT").linkbutton({					// 导出
	plain:true,
	iconCls:'icon-large-smartart',
	onClick:function(){
	}
});
$("#TsemiClearBT").linkbutton({					// 清空
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		$("#TsemiBox input").val("");
	}
});
$("#TsemicallbackBT").linkbutton({				// 返回
	plain:true,
	iconCls:'icon-undo',
	onClick:function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


/* 初始化输入控件 */
function TsemiFInitsFn(){
	
	// 入库内容名称
	$("#ipsIdOfStfGoods,#TsemiSipsIdOfStfGoods,#TsemiUipsIdOfStfGoods").combogrid({
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
	$("#ipsStfGoodsOfCompany,#TsemiSipsStfGoodsOfCompany,#TsemiUipsStfGoodsOfCompany").combogrid({
		panelWidth:1200,
		panelHeight:'180',
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
	$("#ipsStfGoodsAmout,#TsemiUipsStfGoodsAmout").validatebox({
		required : true,
		missingMessage : '请输入入库数量'
	});
	
	// 破损数量
	$("#ipsStfGoodsBrokenAmout,#TsemiUipsStfGoodsBrokenAmout").validatebox({
		required : true,
		missingMessage : '请输入破损数量'
	});
	
	// 残次品数量
	$("#ipsStfGoodslImperfectionAmout,#TsemiUipsStfGoodslImperfectionAmout").validatebox({
		required : true,
		missingMessage : '请输入残次品数量'
	});
	
	// 单价
	$("#ipsStfGoodsUnitPrice,#TsemiUipsStfGoodsUnitPrice").validatebox({
		required : true,
		missingMessage : '请输入单价'
	});
	
	// 所入仓库
	$("#ipsStfGoodsWarehouseId,#TsemiSipsStfGoodsWarehouseId,#TsemiUipsStfGoodsWarehouseId").combogrid({
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
	$("#ipsStfGoodsOperator,#TsemiSipsStfGoodsOperator,#TsemiUipsStfGoodsOperator").combogrid({
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
					{field:'empName',title:'姓名',align:'center',width:100},    
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	
	/* 入库时间 */
	$("#TsemiSipsStfGoodsImportDateStart,#TsemiSipsStfGoodsImportDateEnd").datetimebox({
		editable:false,
	});
	
	// 加工内容
	$("#ipsStfGoodsProcessId,#TsemiSipsStfGoodsProcessId,#TsemiUipsStfGoodsProcessId").combogrid({
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
	$("#ipsStfGoodsCraftsmanId,#TsemiSipsStfGoodsCraftsmanId,#TsemiUipsStfGoodsCraftsmanId").combogrid({
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


/* 添加页面选择图片事件 */
$("#ipsPics").click(function(){			
	$("#ipsPics").attr('value',"上传成功");
	$("#ipsPics").attr('color',"#ff0000");
	toPrompt('上传提示','上传图片成功');// 提示信息
});


// 添加入库时判断是否符合添加条件的方法
function isCanAddTsemi(){
	var sum=$("#TsemiImgBox").find(".commonImgBoxCss");
	if($("#ipsIdOfStfGoods").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择入库的半成品名称');
		return false;
	}else if($("#ipsStfGoodsOfCompany").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择企业(供应商)名称');
		return false;
	}else if(!$("#ipsStfGoodsAmout").validatebox('isValid')){
		$("#ipsStfGoodsAmout").focus();
		return false;
	}else if(!$("#ipsStfGoodsUnitPrice").validatebox('isValid')){
		$("#ipsStfGoodsUnitPrice").focus();
		return false;
	}else if(!$("#ipsStfGoodsBrokenAmout").validatebox('isValid')){
		$("#ipsStfGoodsBrokenAmout").focus();
		return false;
	}else if(parseInt($("#ipsStfGoodsBrokenAmout").val())>parseInt($("#ipsStfGoodsAmout").val())){
		$("#ipsStfGoodsBrokenAmout").focus();
		toPrompt('添加入库提示','破损数量的值不能超过总量的值');
		return false;
	}else if(!$("#ipsStfGoodslImperfectionAmout").validatebox('isValid')){
		$("#ipsStfGoodslImperfectionAmout").focus();
		return false;
	}else if(parseInt($("#ipsStfGoodslImperfectionAmout").val())+parseInt($("#ipsStfGoodsBrokenAmout").val())>parseInt($("#ipsStfGoodsAmout").val())){
		$("#ipsStfGoodslImperfectionAmout").focus();
		toPrompt('添加入库提示','破损数量和残次品数量总和不能超过入库数量');
		return false;
	}else if($("#ipsStfGoodsWarehouseId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择仓库名称');
		return false;
	}else if($("#ipsStfGoodsOperator").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择经办人');
		return false;
	}else if($("#ipsStfGoodsProcessId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择加工内容');
		return false;
	}else if($("#ipsStfGoodsCraftsmanId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择技术人员');
		return false;
	}else if(sum.length<=0){
		toPrompt('添加入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}


// 添加入库方法
function addTsemiFn(){
	var v=isCanAddTsemi();
	if(v){
		// 刷新当前页
		$('#TsemiDisRowBox').datagrid('load');			
		// 将之前添加的图片在界面移除，便于下次添加
		$("#TsemiImgBox").find(".commonImgBoxCss").remove();
		toPrompt('添加入库提示','添加入库成功');
	}
}

// 删除选中记录
function deletTsemiRowsFn(){
	var rows=$("#TsemiDisRowBox").datagrid('getSelections');
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
				
				
				$("#TsemiDisRowBox").datagrid('load');						// 调用该方法刷新当前页
				$("#TsemiDisRowBox").datagrid('unselectAll');					// 删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

// 打开更新窗体方法
function openTsemiDialogFn(){
	var rows=$("#TsemiDisRowBox").datagrid('getSelections');
	if(rows.length==1){
		getTsemiRowsValue(rows);
		$("#TsemiUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

// 获得选中行的信息并传递到更新界面放过
function getTsemiRowsValue(rows){
	
	// 入库内容
	$("#TsemiUipsIdOfStfGoods").combogrid('setValue',rows[0].ipsIdOfStuff);
	$("#TsemiUipsIdOfStfGoods").combogrid('setText',rows[0].ipsIdOfStuffName);
	
	// 企业名称
	$("#TsemiUipsStfGoodsOfCompany").combogrid('setValue',rows[0].ipsIdOfCompany);
	$("#TsemiUipsStfGoodsOfCompany").combogrid('setText',rows[0].cpyName);
	
	// 入库数量
	$("#TsemiUipsStfGoodsAmout").val(rows[0].ipsAmout);
	
	// 破损数量
	$("#TsemiUipsStfGoodsBrokenAmout").val(rows[0].ipsBrokenAmout);
	
	// 残次品数量
	$("#TsemiUipsStfGoodslImperfectionAmout").val(rows[0].ipsImperfectionAmout);
	
	// 单价
	$("#TsemiUipsStfGoodsUnitPrice").val(rows[0].ipsUnitPrice);
	
	// 所入仓库
	$("#TsemiUipsStfGoodsWarehouseId").combogrid('setValue',rows[0].warehouseId);
	$("#TsemiUipsStfGoodsWarehouseId").combogrid('setText',rows[0].warehouseName);
	
	// 经办人
	$("#TsemiUipsStfGoodsOperator").combogrid('setValue',rows[0].ipsOperator);
	$("#TsemiUipsStfGoodsOperator").combogrid('setText',rows[0].ipsOperatorName);
	
	// 加工内容
	$("#TsemiUipsStfGoodsProcessId").combogrid('setValue',rows[0].processContentId);
	$("#TsemiUipsStfGoodsProcessId").combogrid('setText',rows[0].processContentName);
	
	// 技术人员
	$("#TsemiUipsStfGoodsCraftsmanId").combogrid('setValue',rows[0].craftsmanId);
	$("#TsemiUipsStfGoodsCraftsmanId").combogrid('setText',rows[0].craftsmanName);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#TsemiUpdateImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	tsemiUpdateImgPathBox=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < tsemiUpdateImgPathBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tsemiDisplayDelIcon(this)' onmouseout='tsemiDhideDelIcon(this)'><img alt='aa' src='"+(tsemiUpdateImgPathBox[i])+"' class='imgCommonCss' onclick='tsemiUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tsemiUpdateDelThisImg(this)'></div>";
		$("#TsemiUpdateImgBox").prepend(imgBoxS);
	}
}

// 确认更新时判断是否符合条件
function isCanUpdateTsemi(){
	// 上传的图片数
	var sum=$("#TsemiUpdateImgBox").find(".commonImgBoxCss");
	
	if($("#TsemiUipsIdOfStfGoods").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择入库的半成品');
		return false;
	}else if($("#TsemiUipsStfGoodsOfCompany").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择企业(供应商)名称');
		return false;
	}else if(!$("#TsemiUipsStfGoodsUnitPrice").validatebox('isValid')){
		$("#TsemiUipsStfGoodsUnitPrice").focus();
		return false;
	}else if(!$("#TsemiUipsStfGoodsAmout").validatebox('isValid')){
		$("#TsemiUipsStfGoodsAmout").focus();
		return false;
	}else if(!$("#TsemiUipsStfGoodsBrokenAmout").validatebox('isValid')){
		$("#TsemiUipsStfGoodsBrokenAmout").focus();
		return false;
	}else if(parseInt($("#TsemiUipsStfGoodsBrokenAmout").val())>parseInt($("#TsemiUipsStfGoodsAmout").val())){	// 判读破损数量是否超过入库总量
		$("#TsemiUipsStfGoodsBrokenAmout").focus();
		toPrompt('更新提示','破损数量的值不能超过总量的值');
		return false;
	}else if(!$("#TsemiUipsStfGoodslImperfectionAmout").validatebox('isValid')){
		$("#TsemiUipsStfGoodslImperfectionAmout").focus();
		return false;
	}else if(parseInt($("#TsemiUipsStfGoodslImperfectionAmout").val())+parseInt($("#TsemiUipsStfGoodsBrokenAmout").val())>parseInt($("#TsemiUipsStfGoodsAmout").val())){
		$("#TsemiUipsStfGoodslImperfectionAmout").focus();
		toPrompt('更新提示','破损数量和残次品数量总和不能超过入库数量');
		return false;
	}else if($("#TsemiUipsStfGoodsWarehouseId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择仓库名称');
		return false;
	}else if($("#TsemiUipsStfGoodsOperator").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择经办人');
		return false;
	}else if($("#TsemiUipsStfGoodsProcessId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择加工内容');
		return false;
	}else if($("#TsemiUipsStfGoodsCraftsmanId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择技术人员');
		return false;
	}else if(sum.length<=0){
		toPrompt('更新入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}


// 更新界面中的确认修改
function confirTsemiUpdateFn(){
	var l=isCanUpdateTsemi();
	if(l){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$('#TsemiDisRowBox').datagrid('load');			// 刷新当前页
				$("#TsemiUpdateBox").dialog('close');
				toPrompt('更新入库提示','更新入库信息成功');
			}
		});
		
	}
}


// 查询入库信息方法
function searchTseminews(){
	toPrompt('查询入库信息提示','查询信息成功');
	$("#TsemiSearchBox").dialog('close');
}

//查看详情
function seeTsemiDetail(){
	var rows=$("#TsemiDisRowBox").datagrid('getSelections');
	if(rows.length==1){
		getTsemiRowDetailNews(rows);
		$("#TsemiSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

// 将选中的信息传导详细界面
function getTsemiRowDetailNews(rows){
	
	// 入库内容名称
	$("#TsemiSsipsIdOfStfGoods").text(rows[0].ipsIdOfStuffName);
	
	// 企业名称
	$("#TsemiSsipsStfGoodsOfCompany").text(rows[0].cpyName);
	
	// 入库数量
	$("#TsemiSsipsStfGoodsAmout").text(rows[0].ipsAmout);
	
	// 破损数量
	$("#TsemiSsipsStfGoodsBrokenAmout").text(rows[0].ipsBrokenAmout);
	
	// 残次品数量
	$("#TsemiSsipsStfGoodslImperfectionAmout").text(rows[0].ipsImperfectionAmout);
	
	// 单价
	$("#TsemiSsipsStfGoodsUnitPrice").text(rows[0].ipsUnitPrice);
	
	// 所入仓库
	$("#TsemiSsipsStfGoodsWarehouseId").text(rows[0].warehouseName);
	
	// 经办人
	$("#TsemiSsipsStfGoodsOperator").text(rows[0].ipsOperatorName);
	
	// 入库时间
	$("#TsemiSsipsStfGoodsImportDate").text(rows[0].importDate);
	
	// 加工内容
	$("#TsemiSsipsStfGoodsProcessId").text(rows[0].processContentName);
	
	// 技术人员
	$("#TsemiSsipsStfGoodsCraftsmanId").text(rows[0].craftsmanName);
	
	// 加工类型
	$("#TsemiSTypeName").text(rows[0].processTypeName);
	
	// 加工风格
	$("#TsemiSStyleName").text(rows[0].processStyleName);
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#TsemisDetailImgBox").find(".commonImgBoxCss").remove();
	
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	tsemiSeeDetailImgPath=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < tsemiSeeDetailImgPath.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'><img alt='aa' src='"+tsemiSeeDetailImgPath[i]+"' class='imgCommonCss' onclick='tsemiSeeDetailDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' ></div>";
		$("#TsemisDetailImgBox").prepend(imgBoxS);
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
var tsemiAddImgPathArr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

/**
 * 添加图片方法
 */
$("#TsemiUploadBt").click(function(){
	// 获得界面上添加了的图片的个数(用来判断是否上传个人超过限定)
	var sum=$("#TsemiImgBox").find(".commonImgBoxCss");
	
	//判断是否添加超过限定个数
	if(sum.length<15){
		for (var i = 0; i < 1; i++) {
			var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tsemiDisplayDelIcon(this)' onmouseout='tsemiDhideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='tsemiDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tsemiDelThisImg(this)'></div>";
			$("#TsemiImgBox").prepend(imgBoxS);
			// 给保存添加界面的图片数组插入当前图片的地址
			tsemiAddImgPathArr.push('img/a1.jpg');
		}
	}else{
		alert('最多能添加15张图片');
	}
});


// 鼠标移上显示删除图片的图标
function tsemiDisplayDelIcon(target){
	$(target).find("img").last().css('display','inline-block');
}


// 鼠标移走隐藏删除图片的图标
function tsemiDhideDelIcon(target){
	$(target).find("img").last().hide();
}

/**
 * // 添加界面时点击删除图片
 * @param target
 */
function tsemiDelThisImg(target){
	// 此处进行删除相应存在数据库的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<tsemiAddImgPathArr.length;i++){
		if(tsemiAddImgPathArr[i]==path){
			imgIndex=i;
			break;
		}
	}
	
	//删除图片数组中对应的图片
	tsemiAddImgPathArr.splice(imgIndex,1);
	
}


/**
 * 添加界面点击图片时显示正真大小的图片
 * @param target
 */
function tsemiDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tsemiAddImgPathArr.length;i++){
		if(tsemiAddImgPathArr[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的当图片增加到第二行时防止浏览大图片时出现错位 */
	var sum=$("#TsemiImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TsemiADisplayBigImg").css('margin-top','-400px');
	}else{
		$("#TsemiADisplayBigImg").css('margin-top','-282px');
	}
	$("#TsemiAddNowIndex").text(nowIndex+1);
	$("#TsemiAddAllCount").text(tsemiAddImgPathArr.length);
	$("#TsemiAddtheTureImg").attr('src',imgPath);
	$("#TsemiADisplayBigImg").fadeIn('600');
}


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiAddupImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#TsemiAddtheTureImg").attr('src');
	//用来接受地址相等时返回的地址
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tsemiAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(tsemiAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tsemiAddImgPathArr.length-1){
		pathIndex=0;
		$("#TsemiAddNowIndex").text(pathIndex+1);
		$("#TsemiAddtheTureImg").attr('src',tsemiAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#TsemiAddNowIndex").text(pathIndex+1);
		$("#TsemiAddtheTureImg").attr('src',tsemiAddImgPathArr[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiAddnextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#TsemiAddtheTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tsemiAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(tsemiAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tsemiAddImgPathArr.length-1;
		$("#TsemiAddNowIndex").text(pathIndex+1);
		$("#TsemiAddtheTureImg").attr('src',tsemiAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#TsemiAddNowIndex").text(pathIndex+1);
		$("#TsemiAddtheTureImg").attr('src',tsemiAddImgPathArr[pathIndex]);
	}
});

/**
 * 添加界面关闭弹出图片的窗体
 */
$("#TsemiACloseImgDialog").click(function(){
	$("#TsemiADisplayBigImg").fadeOut('600');
});



/**
 * 更新界面添加图片的方法
 * @param title
 * @param msgs
 */

//定义一个全局变量数组用来存储更新时上传图片返回的数组
var tsemiUpdateImgPathBox=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

$("#TsemiUpdateUplaodBt").click(function(){
	// 需要接受上传图片的个数和对应图片的地址(应该为数组方式)
	var sum=$("#TsemiUpdateImgBox").find(".commonImgBoxCss");
	if(sum.length<15){
	for (var i = 0; i < 1; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tsemiDisplayDelIcon(this)' onmouseout='tsemiDhideDelIcon(this)'><img alt='aa' src='img/a"+(i+1)+".jpg' class='imgCommonCss' onclick='tsemiUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tsemiUpdateDelThisImg(this)'></div>";
		$("#TsemiUpdateImgBox").prepend(imgBoxS);
		tsemiUpdateImgPathBox.push('img/a1.jpg');
	}
	}else{
		alert('最多能添加15张图片');
	}
});


/**
 * 更新界面时点击删除图片方法
 * @param target
 */
function tsemiUpdateDelThisImg(target){
	// 此处进行删除相应图片的的数据库路径
	
	var path=$(target).prev().attr('src');
	var imgIndex=-1;
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<tsemiUpdateImgPathBox.length;i++){
		if(tsemiUpdateImgPathBox[i]==path){
			imgIndex=i;
			break;
		}
	}
	//删除图片数组中对应的图片
	tsemiUpdateImgPathBox.splice(imgIndex,1);
	
}

/**
 * 更新界面点击图片时显示正真大小的图片
 * @param target
 */
function tsemiUpdateDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tsemiUpdateImgPathBox.length;i++){
		if(tsemiUpdateImgPathBox[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#TsemiImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TsemiUpdateDisplayBigImg").css('margin-top','-400px');
	}else{
		$("#TsemiUpdateDisplayBigImg").css('margin-top','-282px');
	}
	$("#TsemiUpdateNowIndex").text(nowIndex+1);
	$("#TsemiUpdateAllCount").text(tsemiUpdateImgPathBox.length);
	$("#TsemiUpdateTheTureImg").attr('src',imgPath);
	$("#TsemiUpdateDisplayBigImg").fadeIn('600');
}

/**
 * 更新界面关闭弹出图片的窗体
 */
$("#TsemiUpdateCloseImgDialog").click(function(){
	$("#TsemiUpdateDisplayBigImg").fadeOut('600');
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiUpdateUpImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#TsemiUpdateTheTureImg").attr('src');
	//用来接受地址相等时返回的地址的参数
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tsemiUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(tsemiUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tsemiUpdateImgPathBox.length-1){
		pathIndex=0;
		$("#TsemiUpdateNowIndex").text(pathIndex+1);
		$("#TsemiUpdateTheTureImg").attr('src',tsemiUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#TsemiUpdateNowIndex").text(pathIndex+1);
		$("#TsemiUpdateTheTureImg").attr('src',tsemiUpdateImgPathBox[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiUpdateNextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#TsemiUpdateTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tsemiUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(tsemiUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tsemiUpdateImgPathBox.length-1;
		$("#TsemiUpdateNowIndex").text(pathIndex+1);
		$("#TsemiUpdateTheTureImg").attr('src',tsemiUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#TsemiUpdateNowIndex").text(pathIndex+1); 
		$("#TsemiUpdateTheTureImg").attr('src',tsemiUpdateImgPathBox[pathIndex]);
	}
});



/**
 * 定义一个存放详细界面中存放图片的地址数组(查看详细界面中的图片是无法进行删除添加操作)
 */
var tsemiSeeDetailImgPath=[];

/**
 * 查看详情界面点击图片时显示正真大小的图片
 * @param target
 */
function tsemiSeeDetailDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tsemiSeeDetailImgPath.length;i++){
		if(tsemiSeeDetailImgPath[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#TsemiImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#TsemiSeeDetailDisplayBigImg").css('margin-top','-400px');
	}else{
		$("#TsemiSeeDetailDisplayBigImg").css('margin-top','-282px');
	}
	$("#TsemiSeedetialnowIndex").text(nowIndex+1);
	$("#TsemiSeedetialAllCount").text(tsemiSeeDetailImgPath.length);
	$("#TsemiSeeDetailTheTureImg").attr('src',imgPath);
	$("#TsemiSeeDetailDisplayBigImg").fadeIn('600');
}


/**
 * 查看详情界面关闭弹出图片的窗体
 */
$("#TsemiSeeDetailCloseImgDialog").click(function(){
	$("#TsemiSeeDetailDisplayBigImg").fadeOut('600');
});

/**
 * 查看详情中上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiSeeDetailUpImage").click(function(){
	var imgPath=$("#TsemiSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tsemiSeeDetailImgPath.length;i++){
		if(tsemiSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tsemiSeeDetailImgPath.length-1){
		pathIndex=0;
		//显示当前页
		$("#TsemiSeedetialnowIndex").text(pathIndex+1);
		$("#TsemiSeeDetailTheTureImg").attr('src',tsemiSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex++;
		$("#TsemiSeedetialnowIndex").text(pathIndex+1);
		$("#TsemiSeeDetailTheTureImg").attr('src',tsemiSeeDetailImgPath[pathIndex]);
	}
	
});

/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#TsemiSeeDetailNextImage").click(function(){
	var imgPath=$("#TsemiSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tsemiSeeDetailImgPath.length;i++){
		if(tsemiSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tsemiSeeDetailImgPath.length-1;
		$("#TsemiSeedetialnowIndex").text(pathIndex+1);
		$("#TsemiSeeDetailTheTureImg").attr('src',tsemiSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex--;
		$("#TsemiSeedetialnowIndex").text(pathIndex+1);
		$("#TsemiSeeDetailTheTureImg").attr('src',tsemiSeeDetailImgPath[pathIndex]);
	}
	
});



/* 右键弹出菜单 */

// 更新事件
$("#TsemiUpdateMenu").click(function (){			
	openTsemiDialogFn();
});


// 删除事件
$("#TsemieletMenu").click(function (){
	deletTsemiRowsFn();
});

// 查看事件
$("#TsemiSeeMenu").click(function (){
	seeTsemiDetail();
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
