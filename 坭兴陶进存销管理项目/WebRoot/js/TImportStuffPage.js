$(function(){
	
	/* 在此处写点击商品入库界面时自动生成的商品二维码图片*/
	$("#qrcode").attr('src','img/a5.jpg');
	

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
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tispDisplayDelIcon(this)' onmouseout='tispDhideDelIcon(this)'><img alt='aa' src='"+(arr[i])+"' class='imgCommonCss' onclick='tispDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tispDelThisImg(this)'></div>";
		$("#tispImgBox").prepend(imgBoxS);
	}
	$('#TSFDisRowsBox').datagrid({
		url : "TImportStuffPage.json",
		fit:true,
		border:false,
		method: "POST",
		pagination:true,
		striped:true,
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		sortName:'igId',
		sortOrder:'asc',
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		showFooter:true,
		rownumbers:true,
		remoteSort:false, // 定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed';   // 隔行换色
			}
		},
		toolbar : '#TSFNavBox',
	
			// fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'igId',title:'序号',align:'center',width:50,checkbox: true,},
			{field:'qrcode',title:'商品二维码',align:'center',width:100,
				formatter: function(value,row,index){
					if (value!=""){
						return "<img style='width:34px;height:26px;padding-top:5px;position: relative;' src='"+value+"' onmouseover='tinportDisPlayImage(this)' onmouseout='timportCancelDisImg(this)'>";
					} 
				},
        	},
        	{field:'gdsName',title:'商品名称',align:'center',width:220}, 
        	{field:'gdsUnit',title:'商品单位',align:'center',width:220},
        	{field:'Craftsman',title:'工艺师',align:'center',width:220},
        	{field:'spdDecorate',title:'装饰内容',align:'center',width:220},
        	{field:'spdAppearance',title:'画面内容',align:'center',width:220},
        	{field:'pType',title:'商品类别',align:'center',width:220},
        	{field:'shape',title:'商品器型',align:'center',width:220},
        	{field:'cpyName',title:'公司名称',align:'center',width:220},
        	/*{field:'processContentName',title:'加工内容',align:'center',width:220,},
        	{field:'processStyleName',title:'加工风格',align:'center',width:180},
        	{field:'processTypeName',title:'加工类型',align:'center',width:180},*/
        	
        	{field:'cost',title:'商品成本',align:'center',width:180},
        	{field:'spending',title:'商品开销',align:'center',width:180}, 
        	{field:'price',title:'出售价格',align:'center',width:180},
        	{field:'warehouseName',title:'所入仓库',align:'center',width:250,sortable:true}, 
        	{field:'importDate',title:'入库时间',align:'center',width:220},
        	{field:'JempName',title:'经办人',align:'center',width:180}, 
        	{field:'MempName',title:'监制人',align:'center',width:180}, 
        	{field:"gdstatus",title:"状态",align:"center",width:120,
					formatter : function(val,row){if (val=="0"){return "正常"} else {return "作废";}},
					styler : function(val,row){
						if(val=="0"){
							return 'color:green;';
						}else{
							return 'color:red;';
						}
					}
				}
				]],
			onRowContextMenu : function(e, rowIndex, rowdata){										// 右键显示出现操作菜单
			 e.preventDefault();
			$("#TSFMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$('#TSFDisRowsBox').datagrid('unselectAll');
			$('#TSFDisRowsBox').datagrid('selectRow',rowIndex);
		}
	});
	
	// 更新界面
	$("#TSFUpdateBox").dialog({
		title : '入库信息更新界面',
		iconCls : 'icon-edit',
		width : 1348,
		height : 505,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '更新',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   confirTSFUpdateFn();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TSFUpdateBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	// 查询窗体
	$("#TSFSearchBox").dialog({
		title : '入库信息查询界面',
		iconCls : 'icon-edit',
		width : 1068,
		height : 320,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '查询',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   searchTSFnews();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-undo',
		        	   handler : function(){
		        		   $('#TSFSearchBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },{
		        	   text : '清空',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TSFSearchBox input').val("");			// 关闭修改窗体
		        	   },
		           }
		          ],
	});
	/*调拨窗体*/
	$("#TSFallocationBox").dialog({
		title : '调拨界面',
		iconCls : 'icon-edit',
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '确定',
		        	   iconCls : 'icon-ok',
		        	   handler : function(){
		        		   toPrompt('提示','调拨成功');
		        		   $('#TSFallocationBox').dialog('close');
		        	   },
		           },{
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TSFallocationBox').dialog('close');			// 关闭修改窗体
		        	   },
		           }
		          ],
	});
	/* 查看详情界面 */
	 $("#tsfSeeDetailPage").dialog({
		 width:1008,
		 height:670,
		 title:'入库详情界面',
		 closed : true,
		 modal : true,
	 });
	
	 // 调用初始化组件方法
	TSFInitsFn();																				// 调用输入控件初始化方法
});

$("#TSFAddBT").linkbutton({						// 添加
	plain:true,
	iconCls:'icon-add',
	onClick:function(){
		addTSFFn();
	}
});
$("#TSFDeleteBT").linkbutton({					// 删除
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		deletTSFRowsFn();
	}
});
$("#TSFUpdateBT").linkbutton({					// 更新
	plain:true,
	iconCls:'icon-edit',
	onClick:function(){
		openTSFDialogFn();
	}
});
$("#TSFSearchBT").linkbutton({					// 查找
	plain:true,
	iconCls:'icon-search',
	onClick:function(){
		$("#TSFSearchBox").dialog('open');
	}
});
$("#TSFallocationBT").linkbutton({					// 调拨
	plain:true,
	iconCls:'icon-redo',
	onClick:function(){
		$('#TSFallocationBox').dialog('open');
	}
});

$("#TSFoutputBT").linkbutton({					// 导出
	plain:true,
	iconCls:'icon-large-smartart',
	onClick:function(){
	}
});
$("#TSFoutinBT").linkbutton({					// 导入
	plain:true,
	iconCls:'icon-large-smartart',
	onClick:function(){
		openTSFoutinDialogFn();
	}
});
$("#TSFClearBT").linkbutton({					// 清空
	plain:true,
	iconCls:'icon-cancel',
	onClick:function(){
		$("#TSFoutBox input").val("");
	}
});
$("#TSFcallbackBT").linkbutton({				// 返回
	plain:true,
	iconCls:'icon-undo',
	onClick:function(){
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	}
});


/* 初始化输入控件 */
function TSFInitsFn(){
	// 商品编号
	/*$("#idOfGoods,#tsfSidOfGoods,#tsfUidOfGoods").combogrid({
 		panelWidth:1000,
 		panelHeight:'190',
 	    idField:'gdsId',
 	    fitColumns:false,    
 	    textField:'gdsName',    
 	    url:'TGoodsPage.json',
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
 	   	nowrap:true, 
 	   	scrollbarSize:12,
 	    columns:[[    
 					{field:"gdsId",title:"编号",align:"center",width:80},
 					{field:"gdsName",title:"商品名称",align:"center",width:200},
 					{field:"gdsUnit",title:"单位名称",align:"center",width:250},
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
 					{field:"gdsAttribute",title:"商品属性",align:"center",width:400,
 					formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
 					},
 		    ]]
 		});*/
	// 装饰内容
	$("#DecorateId,#tsfSDecorateId,#tsfUDecorateId").combogrid({
		panelWidth:500,
		panelHeight:'190',
		idField:'DecorateId',
	    fitColumns:false,    
	    textField:'DecorateName',    
	    url: "Decorate.json",
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	   	columns:[[    
					{field:'DecorateId',title:'编号',align:'center',width:235},
					{field:'DecorateName',title:'装饰内容',align:'center',width:235}     	
		    ]]
	});
	//画面内容
	$("#Appearance,#tsfSAppearance,#tsfUAppearance").combogrid({
		panelWidth:500,
		panelHeight:'190',
		idField:'APRId',
	    fitColumns:false,    
	    textField:'APRName',    
	    url: "Appearance.json",
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	   	columns:[[    
					{field:'APRId',title:'编号',align:'center',width:235},
					{field:'APRName',title:'画面内容',align:'center',width:235}     	
		    ]]
	});
	// 企业编号
	$("#tStoreCompanyId,#tsfScompanyId,#tsfUspdCompanyId").combogrid({
		panelWidth:1200,
		panelHeight:'190',
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
					{field:'cpyId',title:'序号',align:'center',width:100},
					{field:'cpyName',title:'企业名称',align:'center',width:220},      
					{field:'cpyTelphone',title:'企业电话',align:'center',width:120},
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
	
	
	//加工内容编号
	/*$("#ProcessId,#tsfSProcessId,#tsfUProcessId").combogrid({
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
	});*/
	
	// 工艺师
	$("#CraftsmanId,#tsfSCraftsmanId,#tsfUCraftsmanId").combogrid({
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
	
	
	// 成本
	$("#cost,#tsfUcost").combogrid({
		panelWidth:800,
		panelHeight:'170',
	    idField:'dicTotalValue',
	    fitColumns:true,    
	    textField:'dicTotalValue',    
	    url: 'dictionary.json',
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:"dicNum",title:"编号",align:"center",width:100},
					{field:"dicMtlValue",title:"原料",align:"center",width:100},
					{field:"dicEmkValue",title:"制胚",align:"center",width:100},
					{field:"dicCarvingValue",title:"雕刻",align:"center",width:100},
					{field:"dicBurningValue",title:"烧制",align:"center",width:100},
					{field:"dicPolishValue",title:"打磨",align:"center",width:100},
					{field:"dicPackingValue",title:"包装",align:"center",width:100},
					{field:"dicLogisticsValue",title:"物流",align:"center",width:100},
					{field:"dicTotalValue",title:"总值",align:"center",width:100},
		    ]]
	});
	
	
	
	// 所入仓库
	$("#spdWarehouseId,#tsfSspdWarehouseId,#tsfUspdWarehouseId").combogrid({
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
	$("#igOperator,#tsfSigOperator,#tsfUegOperator").combogrid({
		panelWidth:800,
		panelHeight:'170',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName',    
	    url: "column.json",
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
	              	{field:'empId',title:'编号',align:'center',width:100,sortable:true}, 
					{field:'empName',title:'姓名',align:'center',width:100},    
					{field:'department',title:'部门',align:'center',width:100},  
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	
	// 监制人
	$("#monitor,#tsfUmonitor").combogrid({
		panelWidth:800,
		panelHeight:'170',
	    idField:'employeeId',
	    fitColumns:true,    
	    textField:'empName',    
	    url: "column.json",
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
	              	{field:'empId',title:'编号',align:'center',width:100,sortable:true}, 
					{field:'empName',title:'姓名',align:'center',width:100},    
					{field:'department',title:'部门',align:'center',width:100},  
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]]
	});
	//商品名称
	$("#idOfGoods").validatebox({
		required : true,
		missingMessage : "请输入商品名称"
	});
	// 开销
	$("#spending").validatebox({
		required : true,
		missingMessage : "请输入商品开销"
	});
	//单位名称
	$("#Unit").validatebox({
		required : true,
		missingMessage : "请输入单位名称"
	});
	//商品价格
/*	$("#tgsUpdateGdsPrice").validatebox({
		required : true,
		missingMessage : "请输入商品价格"
	});*/
	// 相关系数
	$("#goodsQuotietyValue,#tsfUQuotietyValue").combogrid({
		panelHeight:'170',
		panelWidth : '490',
	    idField:'quotietyValue',
	    fitColumns:true,    
	    url : "quotiety.json",
	    textField:'craftsmanLabel',    
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	   	nowrap:true, 
	   	scrollbarSize:12,
	   	multiple: true,   	
	    columns:[[    
	  					{field:'quotietyValue',title:'系数',align:'center',width:100,checkbox:true},
	  					{field:'craftsmanLabel',title:'工艺师等级',align:'center',width:50,sortable:true}, 
	  		    ]]
	});
	
	//商品器型
	$("#shape,#tsfSshape,#tsfUshape").combogrid({
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
	$("#pType,#tsfSpType,#tsfUpType").combogrid({
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
	$("#isManual").combobox({
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
	//下拉默认手工
	$("#isManual").combobox('setValue',0);
	/* 入库时间 */
	$("#tsfSIimportDateStart,#tsfSIimportDateEnd").datetimebox({
		editable:false,
	});
	
}
 // 当选择入库类型为成品的时候给入库控件初始化
 function isGoodsInitId(){
 	$("#ipsIdOfStuff,#tsfUIpsIdOfStuff,#tsfSIpsIdOfStuff").combogrid({
 		panelWidth:1200,
 		panelHeight:'150',
 	    idField:'gdsId',
 	    fitColumns:false,    
 	    textField:'gdsName',    
 	    url:'TGoodsPage.json',
 	   	nowrap:true, 
 	   	scrollbarSize:12,
 	    columns:[[    
 					{field:"gdsId",title:"编号",align:"center",width:80},
 					{field:"gdsName",title:"商品名称",align:"center",width:200},
 					{field:"gdsModel",title:"商品型号",align:"center",width:200,
 						formatter : function(val,row){if (val){return val;} else {return "暂无";}}
 					},
 					{field:"gdsSpecification",title:"商品规格",align:"center",width:200,
 						formatter : function(val,row){if (val){return val;} else {return "暂无";}}
 					},
 					{field:"gdsUnit",title:"单位名称",align:"center",width:250},
 					{field:"shape",title:"商品器型",align:"center",width:200,
 						formatter : function(val,row){if (val){return val;} else {return "暂无";}}
 					},
 					{field:"pType",title:"商品类别",align:"center",width:200,
 						formatter : function(val,row){if (val){return val;} else {return "暂无";}}
 					},
 					{field:"isManual",title:"是否手工",align:"center",width:120,
 						formatter : function(val,row){if (val=="0"){return "是";} else {return "否";}},
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
 		    ]]
 		});
 }


// 添加入库时判断是否符合添加条件的方法
function isCanAddTSF(){
	// 获得当前页面上传的图片数量
	var sum=$("#tispImgBox").find(".commonImgBoxCss");
	
	if($("#idOfGoods").val()==""){
		toPrompt('添加入库提示','请选择入库的商品');
		return false;
	}else if($("#tStoreCompanyId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择公司名称');
		return false;
	}else if($("#DecorateId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择装饰内容');
		return false;
	}else if($("#Appearance").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择画面内容');
		return false;
	}
	else if($("#qrcode").attr('src')==""){
		toPrompt('添加入库提示','请生成唯一的商品二维码');
		return false;
	}else if($("#CraftsmanId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择工艺师');
		return false;
	}/*else if($("#cost").combogrid('getValue')==null){
		toPrompt('添加入库提示','请选择成本');
		return false;
	}*/else if($("#spdWarehouseId").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择商品所入仓库');
		return false;
	}else if($("#igOperator").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择出库经办人');
		return false;
	}else if(!$("#spending").validatebox('isValid')){
		$("#spending").focus();
		return false;
	}else if($("#goodsQuotietyValue").combogrid('getValue')==""){
		toPrompt('添加入库提示','请选择商品的相关系数');
		return false;
	}else if($("#cost").combogrid('getValue')==null){
		toPrompt('添加入库提示','请选择成本');
		return false;
	}/*else if(!$("#tgsUpdateGdsPrice").validatebox('isValid')){
		$("#tgsUpdateGdsPrice").focus();
		return false;
	}*/else if(sum.length<=0){
		toPrompt('添加入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}
// 导入界面
function openTSFoutinDialogFn(){
	$("#TSFoutinBox").dialog({
		title:'导入信息界面',
		closed: false,
	    cache: false,
	    modal: true,
	    height:150,
	    top:150,
	    buttons : [
	                {
	                  text:'导入',
	                  iconCls : 'icon-ok',
	                  handler : function (){
	                	  var file=$("input[name='file']").val(); 
	                      var filename=file.replace(/.*(\/|\\)/, ""); 
	                      var fileExt=(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : ''; 
	                      alert(fileExt);
	              		if(fileExt=="xlsx"||fileExt=="xls"){
	              			toPrompt('导入提示','导入成功！');
	              		}
	              		else{
	              			toPrompt('导入提示','请导入正确的表格！');
	              		}
	                  }
	                },
	                {
			        	   text : '取消',
			        	   iconCls : 'icon-undo',
			        	   handler : function(){
			        		   $('#TSFoutinBox').dialog('close');	     // 关闭修改窗体
			        	   },
			           }
	               ]
	});
}
// 添加入库方法
function addTSFFn(){
	$('#TSFoutBox').dialog({
	    title: '入库信息页面',
	    closed: false,
	    cache: false,
	    modal: true,
	    top:20,
	    buttons : [
		           {
		        	   text : '确定',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        			var v=isCanAddTSF();
		        			var cost = $("#cost").combogrid('getValue');	  
		        			var Othercost = $("#Othercost").val();
		        			if(v){
		        				if(cost!=""&&$("#Othercost").val()==""){ 
		        					getcheckboxvalue();
		        				// 计算总价的值 --公式:成本*3*相关系数的值
		        				var goodsQuotietyValue =$("#goodsQuotietyValue").combogrid('getValues');
		        			/*	var correlationNum = [];
		        				correlationNum = goodsQuotietyValue;	*/        				
		        			  // 总价
		        				var totalPrice = parseFloat(cost)*3;
                                for(var i=0;i<goodsQuotietyValue.length;i++){
                                	 totalPrice=totalPrice*parseFloat(goodsQuotietyValue[i]);
		        				}
		        				/*alert(parseFloat(cost)+"*"+"3*"+parseFloat(goodsQuotietyValue));*/
		        				// 将计算出来的值赋值给隐藏域的文本框中
		        				$("#price").val(totalPrice);
		        				
		        				// 刷新当前页
		        				$('#TSFDisRowsBox').datagrid('load');	
		        				
		        				// 将之前添加的图片在界面移除，便于下次添加
		        				$("#tispImgBox").find(".commonImgBoxCss").remove();
		        				
		        				// 此处如果需要写刷新商品二维码图片,防止录入相同的二维码图片
		        				
		        				toPrompt('添加入库提示','添加入库成功');
		        			}
		        				else if(cost==""&&$("#Othercost").val()!=""){    					
		        					var goodsQuotietyValue =$("#goodsQuotietyValue").combogrid('getValues');
				        			/*	var correlationNum = [];
				        				correlationNum = goodsQuotietyValue;	*/        				
				        			  // 总价
				        				var totalPrice = parseFloat(Othercost)*3;
		                                for(var i=0;i<goodsQuotietyValue.length;i++){
		                                	 totalPrice=totalPrice*parseFloat(goodsQuotietyValue[i]);
				        				}
				        				/*alert(parseFloat(cost)+"*"+"3*"+parseFloat(goodsQuotietyValue));*/
				        				// 将计算出来的值赋值给隐藏域的文本框中
				        				$("#price").val(totalPrice);
				        				alert(totalPrice)
				        				
				        				// 刷新当前页
				        				$('#TSFDisRowsBox').datagrid('load');	
				        				
				        				// 将之前添加的图片在界面移除，便于下次添加
				        				$("#tispImgBox").find(".commonImgBoxCss").remove();
				        				
				        				// 此处如果需要写刷新商品二维码图片,防止录入相同的二维码图片
				        				
				        				toPrompt('添加入库提示','添加入库成功');
		        				}
		        				else{
		        					toPrompt('添加入库提示','请添加正确的成本值');
		        				}
		        				/*else if(cost==""){	
		        					getcheckboxvalue();
		        					var inpudId = $("#TSFshowPriceRow").find("input").eq(5);
		        					
		        					var Othercost=inpudId.val();
		        					alert(Othercost);
		        					var pattern_chin = /[^\d.]/g;
		        					var matchResult = Othercost.match(pattern_chin);
		        					if(matchResult==null){
		        					var goodsQuotietyValue =$("#goodsQuotietyValue").combogrid('getValue');
		        					var totalPrice =parseFloat(goodsQuotietyValue)*3*parseFloat(Othercost);
			        				// 将计算出来的值赋值给隐藏域的文本框中
			        				$("#price").val(totalPrice);
			        				
			        				// 刷新当前页
			        				$('#TSFDisRowsBox').datagrid('load');	
			        				
			        				// 将之前添加的图片在界面移除，便于下次添加
			        				$("#tispImgBox").find(".commonImgBoxCss").remove();
			        				
			        				// 此处如果需要写刷新商品二维码图片,防止录入相同的二维码图片
			        				
			        				toPrompt('添加入库提示','添加入库成功');		        				   
		        					alert($("#price").val());
		        					}
		        					else{
		        						toPrompt('错误提示','无法识别成本的数据');
		        					}
		        				}*/
		        		   }	
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-undo',
		        	   handler : function(){
		        		   $('#TSFoutBox').dialog('close');	     // 关闭修改窗体
		        	   },
		           }
		        ]
	});
}
//获得入库多选框的值
function getcheckboxvalue(){
	var array = new Array();
	$.each($('input[name="check"]:checked'),function(i){
		array[i]= "''"+$(this).val()+"''";
	});
	var values=array.join(",");
	alert("你选了："+values);	
}
/*//获得更新多选框的值
function getUpdatecheckboxvalue(){
	var Updatearray = new Array();
	$.each($('input[name="check"]:checked'),function(i){
		Updatearray[i]= "''"+$(this).val()+"''";
	});
	var Updatevalues=Updatearray.join(",");
	alert("你选了："+Updatevalues);	
}*/
// 删除选中记录
function deletTSFRowsFn(){
	var rows=$("#TSFDisRowsBox").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('提示','确定使该商品作废吗?',function(data){
			if(data){
				toPrompt("提示","该商品已经作废！");
				var ids = [];												// 用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									// 将选定的行的id加入到数组中
				}
																			// 获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			// 进行后台数据交互
				
				
				$("#TSFDisRowsBox").datagrid('load');					// 调用该方法刷新当前页
				$("#TSFDisRowsBox").datagrid('unselectAll');					// 删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要作废的商品",'warning');
	}
}
// 打开更新窗体方法
function openTSFDialogFn(){
	var rows=$("#TSFDisRowsBox").datagrid('getSelections');
	if(rows.length==1){
		getTSFRowsValue(rows);
		$("#TSFUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

// 获得选中行的信息并传递到更新界面放过
function getTSFRowsValue(rows){	
	// 商品名称
	$("#tsfUidOfGoods").val(rows[0].gdsId);
	$("#tsfUidOfGoods").val(rows[0].gdsName);
	
	// 公司名称
	$("#tsfUspdCompanyId").combogrid('setValue',rows[0].cpyId);
	$("#tsfUspdCompanyId").combogrid('setText',rows[0].cpyName);
	
	// 加工内容
	/*$("#tsfUProcessId").combogrid('setValue',rows[0].processContentId);
	$("#tsfUProcessId").combogrid('setText',rows[0].processContentName);*/
	
	//装饰内容
	$("#tsfUDecorateId").combogrid('setValue',rows[0].spdDecorateId);
	$("#tsfUDecorateId").combogrid('setText',rows[0].spdDecorate);
	
    //画面内容
	$("#tsfUAppearance").combogrid('setValue',rows[0].spdAppearanceId);
	$("#tsfUAppearance").combogrid('setText',rows[0].spdAppearance);
	
	//商品类别
	$("#tsfUpType").combogrid('setValue',rows[0].pTypeId);
	$("#tsfUpType").combogrid('setText',rows[0].pType);
	
	//商品器型
	$("#tsfUshape").combogrid('setValue',rows[0].shapeId);
	$("#tsfUshape").combogrid('setText',rows[0].shape);
	
	// 工艺师
	$("#tsfUCraftsmanId").combogrid('setValue',rows[0].cfmId);
	$("#tsfUCraftsmanId").combogrid('setText',rows[0].cfmName);
	
	//成型
	if(rows[0].forming=="成型"){
		$("#forming").attr("checked","true");
	}
	//装饰
	if(rows[0].decorate=="装饰"){
		$("#decorate").attr("checked","true");
	}
	//烧制
	if(rows[0].fire=="装饰"){
		$("#fire").attr("checked","true");
	}
	//打磨
	if(rows[0].polish=="打磨"){
		$("#polish").attr("checked","true");
	}
	// 成本
	$("#tsfUcost").combogrid('setValue',rows[0].dicNum);
	$("#tsfUcost").combogrid('setText',rows[0].cost);
	
	
	// 所入仓库
	$("#tsfUspdWarehouseId").combogrid('setValue',rows[0].warehouseId);
	$("#tsfUspdWarehouseId").combogrid('setText',rows[0].warehouseName);
	
	// 经办人
	$("#tsfUegOperator").combogrid('setValue',rows[0].JempId);
	$("#tsfUegOperator").combogrid('setText',rows[0].JempName);
	
	// 监制人
	$("#tsfUmonitor").combogrid('setValue',rows[0].MempId);
	$("#tsfUmonitor").combogrid('setText',rows[0].MempName);
	
	// 开销
	$("#tsfUspending").val(rows[0].spending);
	
	// 相关系数
	$("#tsfUQuotietyValue").combogrid('setValue',rows[0].quotietylId);
	$("#tsfUQuotietyValue").combogrid('setText',rows[0].quotietyValue);
	
	// 备注
	$("#tsfUproductMeno").val(rows[0].productMeno);
	
	// 商品二维码
	$("#updaetQrcode").attr('src',rows[0].qrcode);
	
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#tispUpdateImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	tispUpdateImgPathBox=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < tispUpdateImgPathBox.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tispDisplayDelIcon(this)' onmouseout='tispDhideDelIcon(this)'><img alt='aa' src='"+(tispUpdateImgPathBox[i])+"' class='imgCommonCss' onclick='tispUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tispUpdateDelThisImg(this)'></div>";
		$("#tispUpdateImgBox").prepend(imgBoxS);
	}
}

// 确认更新时判断是否符合条件
function isCanUpdateTSF(){
	// 获得上传的图片数
	var sum=$("#tispUpdateImgBox").find(".commonImgBoxCss");
	if($("#tsfUidOfGoods").val()==""){
		toPrompt('更新入库提示','请选择企业(供应商)名称');
		return false;
	}else if($("#tsfUspdCompanyId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择企业(供应商)名称');
		return false;
	}else if($("#tsfUpType").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择商品类别');
		return false;	
	}
	/*else if($("#tsfUProcessId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择加工内容');
		return false;
	}*/else if($("#tsfUCraftsmanId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择工艺师');
		return false;
	}else if($("#tsfUcost").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择成本');
		return false;
	}/*else if($("#tsfUspdWarehouseId").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择所入仓库');
		return false;
	}*/else if($("#tsfUegOperator").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择经办人');
		return false;
	}else if($("#tsfUspending").val()==""){
		toPrompt('更新入库提示','请输入商品开销');
		return false;
	}else if($("#tsfUQuotietyValue").combogrid('getValue')==""){
		toPrompt('更新入库提示','请选择相关系数');
		return false;
	}else if(sum.length<=0){
		toPrompt('更新入库提示','请选择图片');
		return false;
	}else{
		return true;
	}
	
}


// 更新界面中的确认修改
function confirTSFUpdateFn(){
	var l=isCanUpdateTSF();
	if(l){
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				getcheckboxvalue();
				$('#TSFDisRowsBox').datagrid('load');			// 刷新当前页
				$("#TSFUpdateBox").dialog('close');
				toPrompt('更新入库提示','更新入库信息成功');
			}
		});
		
	}
}


// 查询入库信息方法
function searchTSFnews(){
	toPrompt('查询入库信息提示','查询信息成功');
	$("#TSFSearchBox").dialog('close');
}

//查看详情
function seeTSFDetail(){
	var rows=$("#TSFDisRowsBox").datagrid('getSelections');
	if(rows.length==1){
		getTSFRowDetailNews(rows);
		$("#tsfSeeDetailPage").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

// 将选中的信息传导详细界面
function getTSFRowDetailNews(rows){
	
	// 商品名称
	$("#tsfSeeGoodName").text(rows[0].gdsName);
	
	// 商品型号
	$("#tsfSeeGoodModel").text(rows[0].gdsModel);
	$("#tsfSeeGoodModel").attr('title',rows[0].gdsModel);
	
	// 商品器型
	$("#tsfSeeGoodShape").text(rows[0].shape);
	$("#tsfSeeGoodShape").attr('title',rows[0].shape);
	
	// 商品类别
	$("#tsfSeeGoodPtype").text(rows[0].pType);
	
	// 商品单位
	$("#tsfSeeGoodUnit").text(rows[0].gdsUnit);
	
	// 是否手工
	if(rows[0].isManual=="0"){
		$("#tsfSeeGoodIsManual").text("是");
		$("#tsfSeeGoodIsManual").css('color','green');
	}else if(rows[0].isManual=="1"){
		$("#tsfSeeGoodIsManual").text("否");
		$("#tsfSeeGoodIsManual").css('color','red');
	}
	// 商品规格
	$("#tsfSeeGdsSpecification").text(rows[0].gdsSpecification);
	$("#tsfSeeGdsSpecification").attr('title',rows[0].gdsSpecification);
	
	// 商品属性
	$("#tsfSeeGoodgdsAttribute").text(rows[0].gdsAttribute);
	$("#tsfSeeGoodgdsAttribute").attr('title',rows[0].gdsAttribute);
	
	/**
	 * 入库详细信息
	 * */
	
	// 供货商(公司名称)
	$("#tsfSeeGoodCompany").text(rows[0].cpyName);
	
	// 加工内容
	/*$("#tsfSeeGoodProcessContent").text(rows[0].processContentName);
	$("#tsfSeeGoodProcessContent").attr('title',rows[0].processContentName);
	*/
	
	//装饰内容
	$("#tsfSeeGoodDecorate").text(rows[0].spdDecorate);
	
	// 画面内容
	$("#tsfSeeGoodAppearance").text(rows[0].spdAppearance);
	
	// 商品状态
	if(rows[0].gdstatus=="0"){
		$("#tsfSeeGoodStatus").text("正常");
		$("#tsfSeeGoodStatus").css('color','green');
	}else{
		$("#tsfSeeGoodStatus").text("作废");
		$("#tsfSeeGoodStatus").css('color','red');
	}
		
	// 技术人员
	$("#tsfSeeGoodGraftMan").text(rows[0].cfmName);
	
	// 加工成本
	$("#tsfSeeGoodCost").text(rows[0].cost+"￥");
	
	// 所入仓库
	$("#tsfSeeGoodWarehouse").text(rows[0].warehouseName);
	
	// 经办人
	$("#tsfSeeGoodOperator").text(rows[0].JempName);

	// 监制人
	$("#tsfSeeGoodMonitor").text(rows[0].MempName);
	
	// 入库开销
	$("#tsfSeeGoodSpening").text(rows[0].spending+"￥");

	// 相关系数
	$("#tsfSeeQuotiety").text(rows[0].quotietyValue);
	
	// 商品二维码
	$("#tsfSeeTrueImg").text("商品二维码");
	$("#tsfSeeTrueImg").css({color:'#8cbfdc'});
	$("#tsfSessGoodsImgBox").attr('src',rows[0].qrcode);
	
	// 设置经过图片时的事件
	$("#tsfSeeTrueImg").hover(
			  function () {
				  $("#tsfSessGoodsImgBox").css('border','3px solid #a2c5d8')
				  $("#tsfSessGoodsImgBox").css({width:'145px',height:'150px'});
			  },
			  function () {
				  $("#tsfSessGoodsImgBox").css('border','3px solid #acacac')
				  $("#tsfSessGoodsImgBox").css({width:'141px',height:'146px'});
			  }
			);
	
	// 出售价格
	$("#tsfSeeGoodPrice").text(rows[0].price+"￥");
	
	// 入库时间
	$("#tsfSeeGoodImportTime").text(rows[0].importDate);
	
	// 备注
	$("#tsfSeeGoodMemo").text(rows[0].productMeno);
	$("#tsfSeeGoodMemo").attr('title',rows[0].productMeno);
	
	
	// 将之前添加的图片在界面移除，便于下次添加
	$("#tispDetailImgBox").find(".commonImgBoxCss").remove();
	
	//图片
	var detialImgBox=rows[0].ipsPics.split('|');
	tispSeeDetailImgPath=detialImgBox;
	//创建存在的图片数
	for (var i = 0; i < tispSeeDetailImgPath.length; i++) {
		var imgBoxS="<div class='commonImgBoxCss'><img alt='aa' src='"+tispSeeDetailImgPath[i]+"' class='imgCommonCss' onclick='tispSeeDetailDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' ></div>";
		$("#tispDetailImgBox").prepend(imgBoxS);
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
var tispAddImgPathArr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

/**
 * 添加图片方法
 */
$("#tispUplaodBt").click(function(){
	// 获得界面上添加了的图片的个数(用来判断是否上传个人超过限定)
	var sum=$("#tispImgBox").find(".commonImgBoxCss");
	
	//判断是否添加超过限定个数
	if(sum.length<15){
		for (var i = 0; i < 1; i++) {
			var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tispDisplayDelIcon(this)' onmouseout='tispDhideDelIcon(this)'><img alt='aa' src='img/a"+(1)+".jpg' class='imgCommonCss' onclick='tispDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tispDelThisImg(this)'></div>";
			$("#tispImgBox").prepend(imgBoxS);
			// 给保存添加界面的图片数组插入当前图片的地址
			tispAddImgPathArr.push('img/a1.jpg');
		}
	}else{
		alert('最多能添加15张图片');
	}
});


// 鼠标移上显示删除图片的图标
function tispDisplayDelIcon(target){
	$(target).find("img").last().css('display','inline-block');
}


// 鼠标移走隐藏删除图片的图标
function tispDhideDelIcon(target){
	$(target).find("img").last().hide();
}

/**
 * // 添加界面时点击删除图片
 * @param target
 */
function tispDelThisImg(target){
	// 此处进行删除相应存在数据库的图片路径
	
	// 获得删除的图片的路径
	var path=$(target).prev().attr('src');
	
	// 接受需要删除的图片的下标(-1表示没有)
	var imgIndex=-1;
	
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<tispAddImgPathArr.length;i++){
		if(tispAddImgPathArr[i]==path){
			imgIndex=i;
			break;
		}
	}
	
	//删除图片数组中对应的图片
	tispAddImgPathArr.splice(imgIndex,1);
	
}


/**
 * 添加界面点击图片时显示正真大小的图片
 * @param target
 */
function tispDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tispAddImgPathArr.length;i++){
		if(tispAddImgPathArr[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的当图片增加到第二行时防止浏览大图片时出现错位 */
	var sum=$("#tispImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tispDisplayBigImg").css('margin-top','-430px');
	}else{
		$("#tispDisplayBigImg").css('margin-top','-316px');
	}
	$("#tispAddNowIndex").text(nowIndex+1);
	$("#tispAddAllCount").text(tispAddImgPathArr.length);
	$("#tispAddtheTureImg").attr('src',imgPath);
	$("#tispDisplayBigImg").fadeIn('600');
}


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispAddnextImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#tispAddtheTureImg").attr('src');
	//用来接受地址相等时返回的地址
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tispAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(tispAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tispAddImgPathArr.length-1){
		pathIndex=0;
		$("#tispAddNowIndex").text(pathIndex+1);
		$("#tispAddtheTureImg").attr('src',tispAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#tispAddNowIndex").text(pathIndex+1);
		$("#tispAddtheTureImg").attr('src',tispAddImgPathArr[pathIndex]);
	}
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispAddupImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#tispAddtheTureImg").attr('src');
	
	//如
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tispAddImgPathArr.length;i++){
		// 返回当前图片的下标
		if(tispAddImgPathArr[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tispAddImgPathArr.length-1;
		$("#tispAddNowIndex").text(pathIndex+1);
		$("#tispAddtheTureImg").attr('src',tispAddImgPathArr[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#tispAddNowIndex").text(pathIndex+1);
		$("#tispAddtheTureImg").attr('src',tispAddImgPathArr[pathIndex]);
	}
});

/**
 * 添加界面关闭弹出图片的窗体
 */
$("#tispCloseImgDialog").click(function(){
	$("#tispDisplayBigImg").fadeOut('600');
});



/**
 * 更新界面添加图片的方法
 * @param title
 * @param msgs
 */

//定义一个全局变量数组用来存储更新时上传图片返回的数组
var tispUpdateImgPathBox=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];

$("#tispUpdateUplaodBt").click(function(){
	// 需要接受上传图片的个数和对应图片的地址(应该为数组方式)
	var sum=$("#tispUpdateImgBox").find(".commonImgBoxCss");
	if(sum.length<15){
	for (var i = 0; i < 1; i++) {
		var imgBoxS="<div class='commonImgBoxCss'  onmouseover='tispDisplayDelIcon(this)' onmouseout='tispDhideDelIcon(this)'><img alt='aa' src='img/a"+(i+1)+".jpg' class='imgCommonCss' onclick='tispUpdateDisPlayTureImg(this)'><img  src='img/idel.png' class='spanCss' onclick='tispUpdateDelThisImg(this)'></div>";
		$("#tispUpdateImgBox").prepend(imgBoxS);
		tispUpdateImgPathBox.push('img/a1.jpg');
	}
	}else{
		alert('最多能添加15张图片');
	}
});


/**
 * 更新界面时点击删除图片方法
 * @param target
 */
function tispUpdateDelThisImg(target){
	// 此处进行删除相应图片的的数据库路径
	
	var path=$(target).prev().attr('src');
	var imgIndex=-1;
	// 删除显示在页面的图片
	$(target).parent().remove();
	
	//此处应该将删除的图片的地址在之前返回的图片数组中移除(防止预览时还能看到删除的图片)
	for(var i=0;i<tispUpdateImgPathBox.length;i++){
		if(tispUpdateImgPathBox[i]==path){
			imgIndex=i;
			break;
		}
	}
	//删除图片数组中对应的图片
	tispUpdateImgPathBox.splice(imgIndex,1);
	
}

/**
 * 更新界面点击图片时显示正真大小的图片
 * @param target
 */
function tispUpdateDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tispUpdateImgPathBox.length;i++){
		if(tispUpdateImgPathBox[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#tispImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tispUpdateDisplayBigImg").css('margin-top','-430px');
	}else{
		$("#tispUpdateDisplayBigImg").css('margin-top','-316px');
	}
	$("#tispUpdateNowIndex").text(nowIndex+1);
	$("#tispUpdateAllCount").text(tispUpdateImgPathBox.length);
	$("#tispUpdateTheTureImg").attr('src',imgPath);
	$("#tispUpdateDisplayBigImg").fadeIn('600');
}

/**
 * 更新界面关闭弹出图片的窗体
 */
$("#tispUpdateCloseImgDialog").click(function(){
	$("#tispUpdateDisplayBigImg").fadeOut('600');
});


/**
 * 上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispUpdateUpImage").click(function(){
	// 获得当前显示的图片的地址
	var imgPath=$("#tispUpdateTheTureImg").attr('src');
	//用来接受地址相等时返回的地址的参数
	var pathIndex=0;	
	//如下边的例子arr是返回的图片的地址数组
	//var arr=["img/a1.jpg","img/a2.jpg","img/a3.jpg","img/a4.jpg","img/a5.jpg"];
	for(var i=0;i<tispUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(tispUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tispUpdateImgPathBox.length-1){
		pathIndex=0;
		$("#tispUpdateNowIndex").text(pathIndex+1);
		$("#tispUpdateTheTureImg").attr('src',tispUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex++;
		$("#tispUpdateNowIndex").text(pathIndex+1);
		$("#tispUpdateTheTureImg").attr('src',tispUpdateImgPathBox[pathIndex]);
	}
});


/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispUpdateNextImage").click(function(){
	// 接受返回的 图片下标
	var index =0;
	// 获得当前显示的图片的地址
	var imgPath=$("#tispUpdateTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tispUpdateImgPathBox.length;i++){
		// 返回当前图片的下标
		if(tispUpdateImgPathBox[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tispUpdateImgPathBox.length-1;
		$("#tispUpdateNowIndex").text(pathIndex+1);
		$("#tispUpdateTheTureImg").attr('src',tispUpdateImgPathBox[pathIndex]);
	}else{
		// 否则上一张
		pathIndex--;
		$("#tispUpdateNowIndex").text(pathIndex+1); 
		$("#tispUpdateTheTureImg").attr('src',tispUpdateImgPathBox[pathIndex]);
	}
});



/**
 * 定义一个存放详细界面中存放图片的地址数组(查看详细界面中的图片是无法进行删除添加操作)
 */
var tispSeeDetailImgPath=[];

/**
 * 查看详情界面点击图片时显示正真大小的图片
 * @param target
 */
function tispSeeDetailDisPlayTureImg(target){
	var imgPath=$(target).attr('src');
	var nowIndex=0;
	for(var i=0;i<tispSeeDetailImgPath.length;i++){
		if(tispSeeDetailImgPath[i]==imgPath){
			nowIndex=i;
			break;
		}
	};
	/* 目的防止用户在添加的界面添加图片到第二行而有进行而转到其他更新界面的浏览更新界面中图片大图而出现的错位 */
	var sum=$("#tispImgBox").find(".commonImgBoxCss");
	if(sum.length>=12){
		$("#tispSeeDetailDisplayBigImg").css('margin-top','-430px');
	}else{
		$("#tispSeeDetailDisplayBigImg").css('margin-top','-316px');
	}
	$("#tispSeedetialnowIndex").text(nowIndex+1);
	$("#tispSeedetialAllCount").text(tispSeeDetailImgPath.length);
	$("#tispSeeDetailTheTureImg").attr('src',imgPath);
	$("#tispSeeDetailDisplayBigImg").fadeIn('600');
}


/**
 * 查看详情界面关闭弹出图片的窗体
 */
$("#tispSeeDetailCloseImgDialog").click(function(){
	$("#tispSeeDetailDisplayBigImg").fadeOut('600');
});

/**
 * 查看详情中上一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispSeeDetailUpImage").click(function(){
	var imgPath=$("#tispSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tispSeeDetailImgPath.length;i++){
		if(tispSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==tispSeeDetailImgPath.length-1){
		pathIndex=0;
		//显示当前页
		$("#tispSeedetialnowIndex").text(pathIndex+1);
		$("#tispSeeDetailTheTureImg").attr('src',tispSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex++;
		$("#tispSeedetialnowIndex").text(pathIndex+1);
		$("#tispSeeDetailTheTureImg").attr('src',tispSeeDetailImgPath[pathIndex]);
	}
	
});

/**
 * 下一页方法(因为添加时后面添加的图片显示在前面，所以上下页的方法代码就反过来才有翻页的效果)
 */
$("#tispSeeDetailNextImage").click(function(){
	var imgPath=$("#tispSeeDetailTheTureImg").attr('src');
	var pathIndex=0;	
	for(var i=0;i<tispSeeDetailImgPath.length;i++){
		if(tispSeeDetailImgPath[i]==imgPath){
			pathIndex=i;
			break;
		}
	};
	// 当下标为最大时再点击至为第一张图片
	if(pathIndex==0){
		pathIndex=tispSeeDetailImgPath.length-1;
		$("#tispSeedetialnowIndex").text(pathIndex+1);
		$("#tispSeeDetailTheTureImg").attr('src',tispSeeDetailImgPath[pathIndex]);
	}else{
	// 否则上一张
		pathIndex--;
		$("#tispSeedetialnowIndex").text(pathIndex+1);
		$("#tispSeeDetailTheTureImg").attr('src',tispSeeDetailImgPath[pathIndex]);
	}
	
});

//鼠标移动到图片上执行的方法
function tinportDisPlayImage(value){
	var imgPath=$(value).attr('src');
	getXandY(value);
	$("#TimportPage").css('display','inline-block')
	$("#TimportGoodsRowImg").attr('src',imgPath);
}

//  鼠标移走时执行的方法
function timportCancelDisImg(value){
	$("#TimportPage").css('display','none');
}

//  获得当前鼠标的x,y轴的值
function getXandY(l){
     $(l).mousemove(function(e) {
         xx= e.pageX || e.clientX;
         yy = e.pageY || e.clientY;
         $("#TimportPage").css('top',yy-242);
         $("#TimportPage").css('left',xx-130);
     });
};



/* 右键弹出菜单 */

// 更新事件
$("#TSFUpdateMenu").click(function (){			
	openTSFDialogFn();
});


// 删除事件
$("#TSFDeletMenu").click(function (){
	deletTSFRowsFn();
});

// 查看事件
$("#TSFSeeMenu").click(function (){
	seeTSFDetail();
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
