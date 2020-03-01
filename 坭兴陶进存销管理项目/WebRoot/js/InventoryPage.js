
var p;

$(function(){
	var editCell = undefined; 
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
	$("#ipTable").datagrid({
		fitColumns:true,
		url:'InventoryPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"inventoryId",
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
		toolbar:'#ipNavForm',
		columns : [[
		            	{field:"inventoryId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"whId",title:"仓库ID",align:"center",width:10,hidden:true},
		            	{field:'whIdName',title:'盘点仓库名称',align:'center',width:120},
//		            	{field:"inventoryOperatorName",title:"盘点人",align:"center",width:120,},
//		            	{field:"supervisoryName",title:"监制人",align:"center",width:120,},
		            	{field:"originalAmount",title:"仓库原库存量",align:"center",width:120,editor:'numberbox',},
		            	{field:"inventoryAmount",title:"盘点数量",align:"center",width:120,editor:'numberbox',
		            		styler: function(value,row,index){
									return 'color:#449bce;';
							}

		            	},
		            	{field:"inventoryTime",title:"盘点时间",align:"center",width:120},
		            ]],
		            
		onClickRow : function(index,row){   //左键弹出
			// 根据用户选择的仓库类型显示对应仓库的值
	    	// 仓库ID = row.whId
	    	 $("#InventoryLGoodsNews").dialog('open');
	    	 console.log(row.whId);
	    	 console.log(row);
	    	 console.log(row.warehouseType);
	    	 
	    	 // 初始化材料仓库信息
	    	 if(row.whId=="1"){
	    		 $("#InventoryLGoodsTable").datagrid({
		    		 	fitColumns:false,
		    			url:'MaterialPage.json',
		    			rownumbers:true,
		    			fit:true,
		    			striped:true,
		    			scrollbarSize:12,
		    			idField:"mtlId",
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
		    			toolbar:'#selectInputIII',
		    			columns : [[
//		    			            	{field:"Id",title:"id",align:"center",width:100,checkbox:true},
		    			            	{field:"mtlId",title:"编号",align:"center",width:100},
		    			            	{field:"mtlName",title:"材料名称",align:"center",width:220},
		    			            	{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
		    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true},
		    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true},
		    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum == row.storeSum) {
		    			            				return "正常";
		    			            				} else {
		    			            					return "异常";
		    			            					}
		    			            			},
		    			            		styler : function(val,row){
		    									if(row.countSum == row.storeSum){
		    										return 'color:green;';
		    									}else{
		    										return 'color:red;';
		    									}
		    								}
		    			            	},
		    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120},
		    			            	{field:"mtlSpecification",title:"材料规格",align:"center",width:220,
		    			            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		    			            	},
		    			            	{field:"mtlUnit",title:"单位",align:"center",width:220},
		    			            	{field:"mtlForm",title:"材料组成成分",align:"center",width:450,
		    			            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
		    			            	},
		    			            ]]
		    		});
	    		 // 初始化半成品仓库商品信息
	    	 }else if(row.whId=="2"){
	    		 $("#InventoryLGoodsTable").datagrid({
		    		 	fitColumns:false,
		    		 	url:'TSemifinishedGoods.json',
		    			rownumbers:true,
		    			fit:true,
		    			striped:true,
		    			scrollbarSize:12,
		    			idField:"mtlId",
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
		    			toolbar:'#selectInputIII',
		    			columns : [[
//		    			            {field:"Id",title:"id",align:"center",width:100,checkbox:true},
		    		            	{field:"sgId",title:"编号",align:"center",width:100},
		    		            	{field:"sgName",title:"半成品名称",align:"center",width:220},
		    		            	{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
	    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true},
	    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true},
	    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
	    			            		formatter : function(val,row){
	    			            			if(row.countSum == row.storeSum) {
	    			            				return "正常";
	    			            				} else {
	    			            					return "异常";
	    			            					}
	    			            			},
	    			            		styler : function(val,row){
	    									if(row.countSum == row.storeSum){
	    										return 'color:green;';
	    									}else{
	    										return 'color:red;';
	    									}
	    								}
	    			            	},
	    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120},
		    		            	{field:"sgType",title:"半成品类别",align:"center",width:220},
		    		            	{field:"sgSpecification",title:"半成品规格",align:"center",width:220,
		    		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
		    		            	},
		    		            	{field:"sgUnit",title:"单位",align:"center",width:220},
		    		            	{field:"sgAttribute",title:"半成品的属性",align:"center",width:450,
		    		            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
		    		            	},
		    		            ]]
		    		});
	    		 
	    		 // 初始化成品仓库商品信息
	    	 }else if(row.whId=="3"){
	    		 $("#InventoryLGoodsTable").datagrid({
		    		 	fitColumns:false,
		    		 	url:'TGoodsPage.json',
		    			rownumbers:true,
		    			fit:true,
		    			striped:true,
		    			scrollbarSize:12,
		    			idField:"mtlId",
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
		    			toolbar:'#selectInputIII',
		    			columns : [[
//		    			            {field:"Id",title:"id",align:"center",width:100,checkbox:true},
									{field:"gdsId",title:"编号",align:"center",width:100},
									{field:"gdsName",title:"商品名称",align:"center",width:200},
									{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
	    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true},
	    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true},
	    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
	    			            		formatter : function(val,row){
	    			            			if(row.countSum == row.storeSum) {
	    			            				return "正常";
	    			            				} else {
	    			            					return "异常";
	    			            					}
	    			            			},
	    			            		styler : function(val,row){
	    									if(row.countSum == row.storeSum){
	    										return 'color:green;';
	    									}else{
	    										return 'color:red;';
	    									}
	    								}
	    			            	},
	    			            	{field:"gdsSpecification",title:"规格",align:"center",width:120},
	    			            	{field:"craftsmanId",title:"工艺师",align:"center",width:150},
	    			            	{field:"gdsDecorate",title:"装饰内容",align:"center",width:150},
	    			            	{field:"gdsAppearance",title:"画面内容",align:"center",width:150},
	    			            	{field:"gdsProcessType",title:"加工类别",align:"center",width:150},
	    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120},
									{field:"gdsSpecification",title:"商品规格",align:"center",width:200,
										formatter : function(val,row){if (val){return val} else {return "暂无";}}
									},
									{field:"gdsUnit",title:"单位名称",align:"center",width:200},
									{field:"shape",title:"商品器型",align:"center",width:200,
										formatter : function(val,row){if (val){return val} else {return "暂无";}}
									},
									{field:"pType",title:"商品类别",align:"center",width:200,
										formatter : function(val,row){if (val){return val} else {return "暂无";}}
									}
		    		            ]]
		    		});
	    	 }
	    	$(this).datagrid("clearChecked");
 			$(this).datagrid("clearSelections");
 			$(this).datagrid('unselectAll');
 			$(this).datagrid('selectRow',rowIndex);
	    },
	
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#ipMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	},
		    	
		
	});
	
	/* 更新出库信息界面 */
//	$("#ipUpdateBox").dialog({
//		width:770,
//		height:200,
//		title:'盘点信息更新界面',
//		iconCls:'icon-edit',
//		closed:true,
//		modal: true,
//		buttons:[{
//			text:'更新',
//			iconCls:'icon-edit',
//			handler:function(){
//				ipConfirmUpdateFn();
//			}
//		},{
//			text:'取消',
//			iconCls:'icon-undo',
//			handler:function(){
//				$("#ipUpdateBox").dialog('close');
//			}
//		}]
//	});
//	
	/* 查询出库信息界面 */
	$("#ipSearchForm").dialog({
		width:1030,
		height:258,
		title:'查询盘点信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			handler:function(){

				ipSearchFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#ipSearchForm").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#ipSearchForm input").val("");
			}
		}]
	});
	
	/*盘点查询界面*/
	$("#ipSinventoryGoods").dialog({
		width:880,
		height:600,
		title:'盘点查询信息界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-search',
			onClick:function(){
				
				ipSearchStartFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#ipSinventoryGoods").dialog('close');
			}
		}],
		//页面打开之后清空上次的信息
//		onOpen : function(){
//			 $("#ipSswhId").combogrid('setValue','');
//			 $("#ipSswhId").combogrid('setText','');
//			 $("#ipSinventoryGoods input").val("");
//			 $("#InveSCT").val("确认打印");
//		 },
		onClose : function(){
			$("#ipSswhId").combogrid('setValue','');
			$("#ipSswhId").combogrid('setText','');
			$("#ipSinventoryGoods input").val("");
			$("#InveSCT").val("确认打印");
			$("#SsatrtTable").datagrid("clearChecked");
			$("#SsatrtTable").datagrid("clearSelections");
			$("#SsatrtTable").datagrid('unselectAll');
		}
	});
	
	/* 查看详情界面 */
	 $("#ipDetailNews").dialog({
		 width:903,
		 height:570,
		 title:'详细信息界面',
		 closed : true,
		 modal : true,
	 });
	 
	 /* 仓库信息中盘点的商品信息 */
	 $("#InventoryGoodsNews").dialog({
		 width:1103,
		 iconCls:'icon-search',
		 height:620,
		 title:'仓库商品信息界面',
		 closed : true,
		 modal : true,
		 onClose : function(){
			 $("#InventoryGoodsTable").datagrid("clearChecked");
			 $("#InventoryGoodsTable").datagrid("clearSelections");
			 $("#InventoryGoodsTable").datagrid('unselectAll');
		  }
	 });
	
	 /* 仓库信息中盘点的商品信息 */
	 $("#InventoryLGoodsNews").dialog({
		 width:1103,
		 iconCls:'icon-search',
		 height:620,
		 title:'历史盘点信息界面',
		 closed : true,
		 modal : true,
		 onClose : function(){
			 $("#InventoryLGoodsTable").datagrid("clearChecked");
			 $("#InventoryLGoodsTable").datagrid("clearSelections");
			 $("#InventoryLGoodsTable").datagrid('unselectAll');
		  }
	 });
	 
	// 调用初始化方法
	ipInitFn(editCell);
});



/* 导航栏和输入控件初始化 */
function ipInitFn(a){
	var editCell = undefined; 
	/* 当检索不到数据时提示相应的信息 --在此处再写一个原因,在该方法中无法直接调用到$(function)中的myview */
	var myview2 = $.extend({},$.fn.datagrid.defaults.view,{
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
	$("#ipAddBT").linkbutton({						//添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			ipAddFn();
		}
	});
	$("#ipDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			ipDeleteRowsFn();
		}
	});
//	$("#ipUpdateBT").linkbutton({					//更新
//		plain:true,
//		iconCls:'icon-edit',
//		onClick : function(){
//			ipOpenUpdateBoxFn();
//		}
//	});
	$("#ipSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#ipSearchForm").dialog('open');		
		}
	});
	$("#ipSearchST").linkbutton({      //盘点查询
		plain:true,
		iconCls:'icon-search',
		onClick:function(){
			$("#ipSinventoryGoods").dialog('open');
		}
	});

         
	
	$("#ipClearBT").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#ipNavForm input").val("");
		}
	});
	$("#ipOutput").linkbutton({						//导出	
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
		}
	});
	$("#ipCallbackBt").linkbutton({					//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	$("#InveSBT").linkbutton({					//仓库商品信息查询
		plain:false,
		iconCls:'icon-search',
		onClick : function(){
			toPrompt("查询提示","查询数据成功");
			$("#InventoryGoodsTable").datagrid('load');	
		}
	});
	
	$("#InveLSBT").linkbutton({					//左键信息查询
		plain:false,
		iconCls:'icon-search',
		onClick : function(){
			toPrompt("查询提示","查询数据成功");
			$("#InventoryLGoodsTable").datagrid('load');	
		}
	});
	
	
	// 完成盘点
	$("#completCount").click(function(){		
		var newss=$("#InventoryGoodsTable").datagrid('getSelections');
		if(newss.length>0){
			$.messager.confirm('盘点提示','确定完成盘点?',function(data){
				if(data){
					toPrompt('系统提示','盘点仓库商品信息完成');
					
					var ss=JSON.stringify(newss);
					alert(ss);
					console.log(ss);
					// 获得所有修改过的数据(返回的是一个数组，数组里面的每一元素是修改了的行的全部数据)
//					 var news=$("#InventoryGoodsTable").datagrid('getChanges');
		    		 console.log(news);
					// 刷新当前界面
					$("#InventoryGoodsTable").datagrid('load');	
					$("#InventoryGoodsNews").dialog('close');
				}
			});
		}else{
			$.messager.alert("温馨提示","请选中需要盘点的列",'warning');
		}
		
	});	
	
	// 查询时仓库的名称
	$("#ipSwhId").combogrid({
		panelWidth:835,
		panelHeight:'165',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
	   	nowrap:true, 
	    mode: 'remote',    
	   	scrollbarSize:12,
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:160},
					{field:"warehouseTypeName",title:"仓库类型",align:"center",width:160},
					{field:"warehouseName",title:"仓库名称",align:"center",width:360},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]],
		    onChange: function (q){ 						// 当在文本框输入值时进行模糊查询
		    },
	});
	
	//添加和更新仓库名称
	$("#whId").combogrid({
		panelWidth:835,
		panelHeight:'165',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
	   	nowrap:true, 
	    mode: 'remote',    
	   	scrollbarSize:12,
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:160},
					{field:"warehouseTypeName",title:"仓库类型",align:"center",width:160},
					{field:"warehouseName",title:"仓库名称",align:"center",width:360},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]],
		    onChange: function (q){ 						// 当在文本框输入值时进行模糊查询
		    },
		    onClickRow : function(index,row){				// 根据用户选择的仓库类型显示对应仓库的值
		    	// 仓库ID = row.warehouseId
		    	 $("#InventoryGoodsNews").dialog('open');
		    	 console.log(row.warehouseType);
		    	 // 初始化材料仓库信息
		    	 if(row.warehouseType=="1"){
		    		 editCell = undefined;
		    		 $("#InventoryGoodsTable").datagrid({
			    		 	fitColumns:false,
			    			url:'MaterialPage.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view: myview2,
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
			    			toolbar:'#selectInputI',
			    			columns : [[
			    			            	{field:"Id",title:"id",align:"center",width:100,checkbox:true},
			    			            	{field:"mtlId",title:"编号",align:"center",width:100},
			    			            	{field:"mtlName",title:"材料名称",align:"center",width:220},
			    			            	{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
			    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true,editor:'numberbox',
			    			            		formatter : function(val,row){
													if(row.countSum == "" || row.countSum ==null){
														row.countSum = row.storeSum;
														return row.countSum;
													}else{
														return row.countSum;
													}
												}
			    			            	},
			    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true,
			    			            		formatter : function(val,row){
			    			            			if(row.countSum!=""){
			    			            				var sum=0;
			    			            				var countSum=parseInt(row.countSum);
			    			            				var storeSum=parseInt(row.storeSum);
			    			            				sum=countSum-storeSum;
			    			            				return sum;
			    			            			}else {
			    			            				return "0";}
			    			            			}
			    			            	},
			    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
			    			            		formatter : function(val,row){
			    			            			if(row.countSum == row.storeSum) {
			    			            				return "正常";
			    			            				} else {
			    			            					return "异常";
			    			            					}
			    			            			},
			    			            		styler : function(val,row){
			    									if(row.countSum == row.storeSum){
			    										return 'color:green;';
			    									}else{
			    										return 'color:red;';
			    									}
			    								}
			    			            	},
			    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120,
			    			            		formatter : function(val,row){
			    			            			if(row.countSum!=""){
			    			            				return '已盘点';
			    			            			}else {
			    			            				return "未盘点";}
			    			            			},
			    			            		styler: function(value,row,index){
			    			            			if(row.countSum!=""){
			    			            				return 'color:green;';
			    			            			}else {
			    			            				return 'color:red;';
			    			            				}
			    			            			}
			    			            	},
			    			            	{field:"mtlSpecification",title:"材料规格",align:"center",width:220,
			    			            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
			    			            	},
			    			            	{field:"mtlUnit",title:"单位",align:"center",width:220},
			    			            	{field:"mtlForm",title:"材料组成成分",align:"center",width:450,
			    			            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
			    			            	},
			    			            ]],
		    			            	onAfterEdit :function (rowIndex, rowData, changes) { 
		    			            		editCell = undefined;
		    			            		// 修改过的行的下标
		    			            		console.log(index);
		    			            		// row就是修改过的行
		    			            		console.log(row);
		    			            		// changes的数据就是修改过的数据
		    			            		console.log(changes);
		    			            		},
		    			            	onDblClickCell:function (rowIndex, field, value) {
		    			            		if(field=="countSum"){
		    			            			if (editCell != undefined) { 
			    			            			$(this).datagrid('endEdit', editCell); 
			    			            		} 
			    			            		if (editCell == undefined) { 
			    			            			$(this).datagrid('beginEdit', rowIndex); 
			    			            			editCell = rowIndex; 
			    			            		} 
		    			            		}
		    			            	},
		    			            	onClickRow:function(rowIndex,rowData){ 
		    			            		if (editCell != undefined) {	
		    			            			$(this).datagrid('endEdit', editCell); 
		    			            		} 
		    			            	},
		    			            	
			    		});
		    		 // 初始化半成品仓库商品信息
		    	 }else if(row.warehouseType=="2"){
		    		 editCell = undefined;
		    		 $("#InventoryGoodsTable").datagrid({
			    		 	fitColumns:false,
			    		 	url:'TSemifinishedGoods.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view: myview2,
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
			    			toolbar:'#selectInputI',
			    			columns : [[
			    			            {field:"Id",title:"id",align:"center",width:100,checkbox:true},
			    		            	{field:"sgId",title:"编号",align:"center",width:100},
			    		            	{field:"sgName",title:"半成品名称",align:"center",width:220},
			    		            	{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
		    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true,editor:'numberbox',
			    		            		formatter : function(val,row){
												if(row.countSum == "" || row.countSum ==null){
													row.countSum = row.storeSum;
													return row.countSum;
												}else{
													return row.countSum;
												}
											}
		    			            	},
		    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum!=""){
		    			            				var sum=0;
		    			            				var countSum=parseInt(row.countSum);
		    			            				var storeSum=parseInt(row.storeSum);
		    			            				sum=countSum-storeSum;
		    			            				return sum;
		    			            			}else {
		    			            				return "0";}
		    			            			}
		    			            	},
		    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum == row.storeSum) {
		    			            				return "正常";
		    			            				} else {
		    			            					return "异常";
		    			            					}
		    			            			},
		    			            		styler : function(val,row){
		    									if(row.countSum == row.storeSum){
		    										return 'color:green;';
		    									}else{
		    										return 'color:red;';
		    									}
		    								}
		    			            	},
		    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum!=""){
		    			            				return '已盘点';
		    			            			}else {
		    			            				return "未盘点";}
		    			            			},
		    			            		styler: function(value,row,index){
			    			            		if(row.countSum!=""){
			    			            			return 'color:green;';
			    			            		}else {
			    			            			return 'color:red;';
			    			            			}
			    			            		}
		    			            					
		    			            	},
			    		            	{field:"sgType",title:"半成品类别",align:"center",width:220},
			    		            	{field:"sgSpecification",title:"半成品规格",align:"center",width:220,
			    		            		formatter : function(val,row){if (val){return val} else {return "暂无";}}
			    		            	},
			    		            	{field:"sgUnit",title:"单位",align:"center",width:220},
			    		            	{field:"sgAttribute",title:"半成品的属性",align:"center",width:450,
			    		            	formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
			    		            	},
			    		            ]],
			    		            onAfterEdit :function (rowIndex, rowData, changes) { 
	    			            		editCell = undefined; 
	    			            		},
	    			            	onDblClickCell:function (rowIndex, field, value) {
	    			            		if(field=="countSum"){
	    			            		if (editCell != undefined) { 
	    			            			$("#InventoryGoodsTable").datagrid('endEdit', editCell); 
	    			            		} 
	    			            		if (editCell == undefined) { 
	    			            			$("#InventoryGoodsTable").datagrid('beginEdit', rowIndex); 
	    			            			editCell = rowIndex; 
	    			            		} 
	    			            		}
	    			            	},
	    			            	onClickRow:function(rowIndex,rowData){ 
	    			            		if (editCell != undefined) {	
	    			            			$("#InventoryGoodsTable").datagrid('endEdit', editCell); 
	    			            		} 
	    			            	}
			    		});
		    		 
		    		 // 初始化成品仓库商品信息
		    	 }else if(row.warehouseType=="3"){
		    		 editCell = undefined;
		    		 $("#InventoryGoodsTable").datagrid({
			    		 	fitColumns:false,
			    		 	url:'TGoodsPage.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view: myview2,
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
			    			toolbar:'#selectInputI',
			    			columns : [[
			    			            {field:"Id",title:"id",align:"center",width:100,checkbox:true},
										{field:"gdsId",title:"编号",align:"center",width:100},
										{field:"gdsName",title:"商品名称",align:"center",width:200},
										{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
		    			            	{field:"countSum",title:"盘点数量",align:"center",width:120,sortable:true,editor:'numberbox',
												formatter : function(val,row){
													if(row.countSum == "" || row.countSum ==null){
														row.countSum = row.storeSum;
														return row.countSum;
													}else{
														return row.countSum;
													}
												}
		    			            	},
		    			            	{field:"profitAndLoss",title:"盘盈盘亏",align:"center",width:120,sortable:true,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum!=""){
		    			            				var sum=0;
		    			            				var countSum=parseInt(row.countSum);
		    			            				var storeSum=parseInt(row.storeSum);
		    			            				sum=countSum-storeSum;
		    			            				return sum;
		    			            			}else {
		    			            				return "0";}
		    			            			}
		    			            	},
		    			            	{field:"dataStaus",title:"数据状态",align:"center",width:120,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum == row.storeSum) {
		    			            				return "正常";
		    			            				} else {
		    			            					return "异常";
		    			            					}
		    			            			},
		    			            		styler : function(val,row){
		    									if(row.countSum == row.storeSum){
		    										return 'color:green;';
		    									}else{
		    										return 'color:red;';
		    									}
		    								}
		    			            	},
		    			            	{field:"gdsSpecification",title:"规格",align:"center",width:120},
		    			            	{field:"craftsmanId",title:"工艺师",align:"center",width:150},
		    			            	{field:"gdsDecorate",title:"装饰内容",align:"center",width:150},
		    			            	{field:"gdsAppearance",title:"画面内容",align:"center",width:150},
		    			            	{field:"gdsProcessType",title:"加工类别",align:"center",width:150},
		    			            	{field:"mtlName4",title:"盘点状态",align:"center",width:120,
		    			            		formatter : function(val,row){
		    			            			if(row.countSum!=""){
		    			            				return '已盘点';
		    			            			}else {
		    			            				return "未盘点";}
		    			            			},
		    			            		styler: function(value,row,index){
			    			            		if(row.countSum!=""){
			    			            			return 'color:green;';
			    			            		}else {
			    			            			return 'color:red;';
			    			            			}
			    			            		}
		    			            					
		    			            	},
//										{field:"gdsModel",title:"商品型号",align:"center",width:200,
//											formatter : function(val,row){if (val){return val} else {return "暂无";}}
//										},
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
//										{field:"isManual",title:"是否手工",align:"center",width:120,
//											formatter : function(val,row){if (val=="0"){return "是"} else {return "否";}},
//											styler : function(val,row){
//												if(val=="0"){
//													return 'color:green;';
//												}else{
//													return 'color:red;';
//												}
//											}
//										},
//										{field:"gdsAttribute",title:"商品属性",align:"center",width:600,
//											formatter : function(val,row){if (val){return '<span title="' + val + '">' + val + '</span>';} else {return "暂无";}}	
//										},
			    		            ]],
			    		            onAfterEdit :function (rowIndex, rowData, changes) { 
	    			            		editCell = undefined; 
	    			            		},
	    			            	onDblClickCell:function (rowIndex, field, value) { 
	    			            		if(field=="countSum"){
	    			            		if (editCell != undefined) { 
	    			            			$(this).datagrid('endEdit', editCell); 
	    			            		} 
	    			            		if (editCell == undefined) { 
	    			            			$(this).datagrid('beginEdit', rowIndex); 
	    			            			editCell = rowIndex; 
	    			            		} 
	    			            		}
	    			            	},
	    			            	onClickRow:function(rowIndex,rowData){ 
	    			            		if (editCell != undefined) {	
	    			            			$(this).datagrid('endEdit', editCell); 
	    			            		} 
	    			            	}
			    		});
		    	 }
		    	
		    }
		  
	});
	
	//盘点查询表格信息
	$("#ipSswhId").combogrid({
		panelWidth:835,
		panelHeight:'165',
	    idField:'warehouseId',
	    fitColumns:true,    
	    textField:'warehouseName',    
	    url: 'warehousePage.json',
	   	nowrap:true, 
	    mode: 'remote',    
	   	scrollbarSize:12,
	   	pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    columns:[[    
					{field:"warehouseId",title:"仓库号",align:"center",width:160},
					{field:"warehouseTypeName",title:"仓库类型",align:"center",width:160},
					{field:"warehouseName",title:"仓库名称",align:"center",width:360},
					{field:"warehouseAddress",title:"仓库地址",align:"center",width:600},
		    ]],
		    onChange: function (q){ 						// 当在文本框输入值时进行模糊查询
		    },
		    onClickRow : function(index,row){				// 根据用户选择的仓库类型显示对应仓库的值
		    	// 仓库ID = row.warehouseId
		    	 $("#ipSinventoryGoods").dialog('open');
		    	 console.log(row.warehouseType);
		    	 p = row.warehouseType;
//		    	 console.log(p);
		    	 // 初始化材料仓库信息
		    	 if(row.warehouseType=="1"){
		    		 editCell = undefined;
		    		 $("#SsatrtTable").datagrid({
			    		 	fitColumns:false,
			    			url:'MaterialPage.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view: myview2,
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
			    			toolbar:'#selectInputII',
			    			columns : [[
			    			            	{field:"Id",title:"Id",align:"center",width:100,checkbox:true},
			    			            	{field:"mtlId",title:"编号",align:"center",width:100},
			    			            	{field:"mtlName",title:"材料名称",align:"center",width:220},
  		    			            	    {field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
  		    			            	    {field:"mtlType",title:"材料类别",align:"center",width:220},
			    			            	{field:"mtlTime",title:"出/入库时间",align:"center",width:220},
			    			            	
			    			            ]]	    			            	
			    		});
		    		 // 初始化半成品仓库商品信息
		    	 }else if(row.warehouseType=="2"){
		    		 editCell = undefined;
		    		 $("#SsatrtTable").datagrid({
			    		 	fitColumns:false,
			    		 	url:'TSemifinishedGoods.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view: myview2,
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
			    			toolbar:'#selectInputII',
			    			columns : [[
			    			            {field:"Id",title:"Id",align:"center",width:100,checkbox:true},
			    		            	{field:"sgId",title:"编号",align:"center",width:100},
			    		            	{field:"sgName",title:"半成品名称",align:"center",width:220},
			    		            	{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
			    		            	{field:"mtlBrokenAmout",title:"破损数量",align:"center",width:120,sortable:true},
			    		            	{field:"mtlImperfectionAmount",title:"残次品数量",align:"center",width:120,sortable:true},
			    		            	{field:"sgType",title:"半成品类别",align:"center",width:220},
			    		            	{field:"sgTime",title:"出/入库时间",align:"center",width:220},
		    			            	]]
			    		});
		    		 
		    		 // 初始化成品仓库商品信息
		    	 }else if(row.warehouseType=="3"){
		    		 editCell = undefined;
		    		 $("#SsatrtTable").datagrid({
			    		 	fitColumns:false,
			    		 	url:'TGoodsPage.json',
			    			rownumbers:true,
			    			fit:true,
			    			striped:true,
			    			scrollbarSize:12,
			    			idField:"mtlId",
			    			view:myview2,
			    			emptyMsg:"没有查询到相应的记录",
			    			pagination:true,
			    			pageSize:10,
			    			pageList:[10,20,30,40,50],
			    			border:false,
			    			remoteSort:false,
			    			rowStyler: function(index,row){
			    				if(index%2!=0){
			    					return 'background:#e4ebed'   //隔行换色
			    				}
			    			},
			    			toolbar:'#selectInputII',
			    			columns : [[
			    			            {field:"Id",title:"Id",align:"center",width:100,checkbox:true},
										{field:"gdsId",title:"编号",align:"center",width:100},
										{field:"gdsName",title:"商品名称",align:"center",width:200},
										{field:"storeSum",title:"库存数量",align:"center",width:120,sortable:true},
										{field:"gdsDecorate",title:"装饰内容",align:"center",width:200},
										{field:"gdsAppearance",title:"画面内容",align:"center",width:200},
										{field:"gdsProcessType",title:"加工类别",align:"center",width:200},
										{field:"gdsType",title:"商品类别",align:"center",width:220},
										{field:"gdsTime",title:"出/入库时间",align:"center",width:220}
										]]

			    		});
		    	 }
		    	
		    }
		  
	});
	
	//盘点时间
	$("#inventoryStartTime,#inventoryEndTime").datetimebox({
		required: true,
		missingMessage:"请选择盘点时间",
		editable:false
	});
	
	//盘点类型
	$("#inventoryType,#SinventoryType").combogrid({
		panelWidth:250,
		panelHeight:'100',
		idField:'typeId',
		fitColumns:true,
		textField:'typeName',
		url:'inventoryType.json',
		nowrap:true,
		singleSelect:true,
		pagination : false,//是否分页 
//		rownumbers:true,//序号
		columns:[[
		         {field:'typeId',title:'id',align:'center',width:50},
		         {field:'typeName',title:'盘点类型',align:'center',width:150}
		         ]]
		
	});
	
	//盘点人
	$("#inventoryOperator,#ipSinventoryOperator").combogrid({
		panelWidth:930,
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
					{field:'empAddress',title:'地址',align:'center',width:250}, 
		    ]]
	});
	
	
	//监盘人
//	$("#supervisory,#ipSsupervisory").combogrid({
//		panelWidth:930,
//		panelHeight:'166',
//	    idField:'employeeId',
//	    fitColumns:true,    
//	    textField:'empName',    
//	    url: "column.json",
//	   	nowrap:true, 
//	   	scrollbarSize:12,
//	   	pagination : true,//是否分页 
//	    pageSize: 3,//每页显示的记录条数，默认为10 
//	    pageList: [3,6],//可以设置每页记录条数的列表
//	    rownumbers:true,//序号 
//	    columns:[[    
//					{field:'employeeId',title:'账号',align:'center',width:100,sortable:true},
//					{field:'empName',title:'姓名',align:'center',width:100},    
//					{field:'department',title:'部门',align:'center',width:100},  
//					{field:'role',title:'身份',align:'center',width:100},
//					{field:'empTelphone',title:'电话',align:'center',width:100},
//					{field:'empAddress',title:'地址',align:'center',width:250}, 
//		    ]]
//	});
	
	//盘点数量
//	$("#inventoryAmount").validatebox({
//		required : true,
//		missingMessage : "请输入盘点数量"
//	});
	
	//查询时入库时间
	$("#inventoryTimeStart,#inventoryTimeEnd,#SinventoryStartTime,#SinventoryEndTime").datetimebox({
		editable:false,
	});
	
	//查询
	$("#InvenStartTime,#InvenEndTime").datetimebox({
		editable:false,
	});
	
};



/**
 * 判断是否满足添加盘点记录的方法
 */
function isCanIpAdd(){
	if($("#whId").combogrid('getValue')==""){
		toPrompt('添加提示','请选择盘点的仓库');
		return false;
	}else if($("#inventoryStartTime").val()==""){
		toPrompt('添加提示','请选择盘点时间始');
		return false;
	}else if($("#inventoryEndTime").val()==""){
		toPrompt('添加提示','请选择盘点时间末');
		return false;
	}else if($("#inventoryType").combogrid('getValue')==""){
		toPrompt('添加提示','请选择盘点类型');
		return false;
	}else{
		return true;
	}
}


/**
 * 添加盘点记录方法
 */
function ipAddFn(){
	var value = isCanIpAdd();
	if(value){
		toPrompt('添加信息提示','添加盘点记录成功');
		$("#ipTable").datagrid('load');
	}
}

/**
 * 删除选中的记录
 */
function ipDeleteRowsFn(){
	var rows=$("#ipTable").datagrid('getSelections');
	if(rows.length>0){
		$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
			if(data){
				toPrompt("删除提示","删除数据成功");
				var ids = [];												//用来接收每行的id
				for(var i=0;i<rows.length;i++){
					ids.push(rows[i].id);									//将选定的行的id加入到数组中
				}
																			//获得的数据是一个数组所在转换成用逗号隔开的字符串
				var transID=ids.join(',');
																			//进行后台数据交互
				
				
				$("#ipTable").datagrid('load');							//调用该方法刷新当前页
				$("#ipTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

/**
 * 查询盘点仓库信息方法
 */
function ipSearchFn(){
	
	var params = $('#ipSearchForm').serializeJson();
	 //将json对象,绑定到datagrid上,完成带有条件查询的请求
  $("#ipTable").datagrid('load',params);
  
	toPrompt("查询提示","查询数据成功");
	$("#ipTable").datagrid('load');							//调用该方法刷新当前页
	$("#ipSearchForm").dialog('close');
}

/**
 * 盘点查询仓库信息方法
 */
function ipSearchStartFn(){
	
//	var params = $('#ipSearchStartForm').serializeJson();
//	 //将json对象,绑定到datagrid上,完成带有条件查询的请求
//   $("#SsatrtTable").datagrid('load',params);
	
   alert('aa');
   
	toPrompt("查询提示","查询数据成功");
	$("#SsatrtTable").datagrid('load');							//调用该方法刷新当前页
	$("#ipSearchStartForm").dialog('close');
}

//盘点查询界面打印盘点材料信息(有预览)
function printExportMenu(){
	try {
		LODOP=getLodop();
		var strBodyStyle="<link rel='stylesheet' href='css/InventoryPrintTable.css' type='text/css'>	";
		var strFormHtml2=strBodyStyle+"<body>"+document.getElementById("headDivBox").innerHTML+"</body>";
		var strFormHtml=strBodyStyle+"<body>"+strFormHtml2+document.getElementById("printInventoryTable").innerHTML+"</body>";
		LODOP.PRINT_INIT("盘点信息");	
		LODOP.ADD_PRINT_HTM(35,10,"95%","100%",strFormHtml);
		LODOP.PREVIEW();
	} catch (e) {
		alert(e.message);
	}
}

//盘点查询界面打印盘点材料信息(无预览)
function printExportMenuNotPreview(){
	try {
		LODOP=getLodop();
		var strBodyStyle="<link rel='stylesheet' href='css/InventoryPrintTable.css' type='text/css'>	";
		var strFormHtml2=strBodyStyle+"<body>"+document.getElementById("headDivBox").innerHTML+"</body>";
		var strFormHtml=strBodyStyle+"<body>"+strFormHtml2+document.getElementById("printInventoryTable").innerHTML+"</body>";
		LODOP.PRINT_INIT("盘点信息");	
		LODOP.ADD_PRINT_HTM(35,10,"95%","100%",strFormHtml);
		LODOP.PRINT();
	} catch (e) {
		alert(e.message);
	}
}



//将打印信息赋值到打印的纸张上
function transferPrintValue(){
	$("#PipwhId").text($("#ipSswhId").combogrid('grid').datagrid('getSelected').warehouseName);
	$("#PinventoryType").text($("#SinventoryType").combogrid('grid').datagrid('getSelected').typeName);
	$("#PinventoryStartTime").text($("#SinventoryStartTime").datetimebox('getValue'));
	$("#PinventoryEndTime").text($("#SinventoryEndTime").datetimebox('getValue'));
	//p = row.warehouseType;
	console.log(p);
		if(p == 1){
			$.ajax({
				url:'InventoryPrintMlt.json',
				type:'get',
				datatype:'json',
				success:function(res){
					console.log(res);
					//将数据显示在页面上
					var str1 = "";
					str1 +="<table class='printGoodTable'><thead><tr><th class='printLabelsCss'>材料名称</th><th class='printLabelsCss'>库存数量</th><th class='printLabelsCss'>材料类别</th><th class='printLabelsCss'>出/入库时间</th></tr></thead><tbody>";
					//遍历数据
					$.each(res,function(index,element){
						str1 +="<tr><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['mtlName']
						+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['storeSum']
						+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['mtlType']
						+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['mtlTime']
						+"</td></tr>";
					})
					//遍历完成之后
					str1 +="</tbody></table>";
					//将表格添加到body的div中
					$('#printInventoryTable').append(str1);
					
					// 调用同步打印方法（有预览的按钮）
					var isCheckHasPreviewBt = $("#sameTimePrint").prop("checked");
					// 调用同步打印方法（有预览的按钮）
					var isCheckNotPreviewBt = $("#sameTimePrintNoPreview").prop("checked");
					if(isCheckHasPreviewBt){
						// 弹出打印预览窗口
						printExportMenu();
					}
					if(isCheckNotPreviewBt){
						// 弹出打印不预览窗口
						printExportMenuNotPreview();
					}
				
				}
			})
			
		}else if(p==2){
			$.ajax({
		        url:'InventoryPrintMlt.json',
		        type:'get',
		        datatype:'json',
		        success:function(res){
		        	console.log(res);
		        	//将数据显示在页面上
		        	var str2 = "";
		        	str2 +="<table class='printGoodTable'><thead><tr><th class='printLabelsCss'>半成品名称</th><th class='printLabelsCss'>库存数量</th><th class='printLabelsCss'>半成品类别</th><th class='printLabelsCss'>破损数量</th><th class='printLabelsCss'>残次品数量</th><th class='printLabelsCss'>出/入库时间</th></tr></thead><tbody>";
		        	//遍历数据
		        	$.each(res,function(index,element){
		        	str2 +="<tr><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['sgName']
		        	+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['storeSum']
		        	+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['sgType']
		        	+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['mtlBrokenAmount']
		        	+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['mtlImperfectionAmount']
		        	+"</td><td class='printLabelsCss' style='text-align: center; vertical-align: middle;'>"+element['sgTime']
		        	+"</td></tr>";
		        	})
		        	//遍历完成之后
		        	str2 +="</tbody></table>";
		        	//将表格添加到body中
		        	$('#printInventoryTable').append(str2);
			
		        	// 调用同步打印方法（有预览的按钮）
		        	var isCheckHasPreviewBt = $("#sameTimePrint").prop("checked");
		        	// 调用同步打印方法（有预览的按钮）
		        	var isCheckNotPreviewBt = $("#sameTimePrintNoPreview").prop("checked");
		        	if(isCheckHasPreviewBt){
		        		// 弹出打印预览窗口
		        		printExportMenu();
		        	}
		        	if(isCheckNotPreviewBt){
		        		// 弹出打印不预览窗口
		        		printExportMenuNotPreview();
		        	}
			}
			
		})
	}else{
		$.ajax({
	        url:'InventoryPrintMlt.json',
	        type:'get',
	        datatype:'json',
	        success:function(res){
	        	console.log(res);
	        	//将数据显示在页面上
	        	var str3 = "";
	        	str3 +="<table class='printGoodTable'><thead><tr><th class='printLabelsCss1'>商品名称</th><th class='printLabelsCss1'>库存数量</th><th class='printLabelsCss1'>装饰内容</th><th class='printLabelsCss1'>画面内容</th><th class='printLabelsCss1'>加工类别</th><th class='printLabelsCss1'>商品类别</th><th class='printLabelsCss1'>出/入库时间</th></tr></thead><tbody>";
	        	//遍历数据
	        	$.each(res,function(index,element){
	        		str3 +="<tr><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsName']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['storeSum']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsDecorate']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsAppearance']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsProcessType']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsType']
	        		+"</td><td class='printLabelsCss1' style='text-align: center; vertical-align: middle;'>"+element['gdsTime']
	        		+"</td></tr>";
	        	})
	        	//遍历完成之后
	        	str3 +="</tbody></table>";
	        	//将表格添加到body中
	        	$('#printInventoryTable').append(str3);
	        	
	        	// 调用同步打印方法（有预览的按钮）
				var isCheckHasPreviewBt = $("#sameTimePrint").prop("checked");
				// 调用同步打印方法（有预览的按钮）
				var isCheckNotPreviewBt = $("#sameTimePrintNoPreview").prop("checked");
				if(isCheckHasPreviewBt){
					// 弹出打印预览窗口
					printExportMenu();
				}
				if(isCheckNotPreviewBt){
					// 弹出打印不预览窗口
					printExportMenuNotPreview();
				}
	        }
		})
	
	
	}
		
	
}

/**
 * 盘点查询仓库确认打印方法
 */
$("#InveSCT").click(function(){             
	var rows=$("#SsatrtTable").datagrid('getSelections');
	console.log(rows);
	if(rows.length>0){
		$.messager.confirm('打印提示','确定打印选定的数据?',function(data){
			if(data){
				 var ids =[];
				 for(var i=0;i<rows.length;i++){
					 ids.push(rows[i].id);
				 }
				 console.log(rows.mtlName);
				 console.log(rows);
				 console.log(ids.join(','));
				 
				 var transID = ids.join(',');
				 
				 
//				// 调用同步打印方法（有预览的按钮）
				var isCheckHasPreviewBt = $("#sameTimePrint").prop("checked");
//				// 调用同步打印方法（有预览的按钮）
				var isCheckNotPreviewBt = $("#sameTimePrintNoPreview").prop("checked");
				if(isCheckHasPreviewBt){
					//清除之前的信息
					$("#printInventoryTable").empty();
					// 设置打印信息
					transferPrintValue();
					// 弹出打印预览窗口
//					printExportMenu();
				}
				if(isCheckNotPreviewBt){
					//清除之前的信息
					$("#printInventoryTable").empty();
					// 设置打印信息
					transferPrintValue();
					// 弹出打印不预览窗口
//					printExportMenuNotPreview();
				}
				// 刷新界面信息
				$("#SsatrtTable").datagrid('load');
				$("#SsatrtTable").datagrid('unselectAll');	
			}
		});
	}else{
		$.messager.alert("温馨提示","请选中需要打印的列",'warning');
	}
});   

/**
 * 打开更新窗口方法
 */
//function ipOpenUpdateBoxFn(){
//	var rows=$("#ipTable").datagrid('getSelections');
//	if(rows.length==1){
//		ipGetRowValueFn(rows);								//调用获得选中行的数据的方法
//		$("#ipUpdateBox").dialog('open');
//	}else if(rows.length>1){
//		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
//	}else if(rows.length==0){
//		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
//	}
//}

/**
 * 获得选中需要修改的行的值
 */
//function ipGetRowValueFn(rows){
//	// 盘点仓库名称
//	$("#ipUwhId").combogrid('setValue',rows[0].whId);
//	$("#ipUwhId").combogrid('setText',rows[0].whIdName);
//	
//	// 盘点人
//	$("#ipUinventoryOperator").combogrid('setValue',rows[0].inventoryOperator);
//	$("#ipUinventoryOperator").combogrid('setText',rows[0].inventoryOperatorName);
//	
//	// 监盘人
//	$("#ipUsupervisory").combogrid('setValue',rows[0].supervisory);
//	$("#ipUsupervisory").combogrid('setText',rows[0].supervisoryName);
//	
//	
//	
//}

/**
 * 判断是否符合更新的方法
 */
//function ipIsCandUpdate(){
//	if($("#ipUwhId").combogrid('getValue')==""){
//		toPrompt('添加信息提示','请选择盘点仓库');
//		return false;
//	}else if($("#ipUinventoryOperator").combogrid('getValue')==""){
//		toPrompt('添加信息提示','请选择盘点人');
//		return false;
//	}else if($("#ipUsupervisory").combogrid('getValue')==""){
//		toPrompt('添加信息提示','请选择监盘人');
//		return false;
//	}else{
//		return true;
//	}
//}
/**
 * 点击更新界面中的确定按钮
 */
//function ipConfirmUpdateFn(){
//	var isCanUpdate=ipIsCandUpdate();
//	if(isCanUpdate){
//		$.messager.confirm('修改提示','确定修改数据？',function(data){
//			if(data){
//				toPrompt('更新提示','更新信息成功');
//				// 刷新当前界面
//				$("#ipTable").datagrid('load');		
//				$("#ipUpdateBox").dialog('close');
//			}
//		});
//	}
//}


//查看详情
function ipSeeMWhpDetail(){
	var rows=$("#ipTable").datagrid('getSelections');
	if(rows.length==1){
		ipGetRowDetailNews(rows);
		$("#ipDetailNews").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
}

//将选中的信息传导详细界面
function ipGetRowDetailNews(rows){
	// 仓库信息
	if(rows[0].whIdName!=""){
		$("#ipDisWarehouseName").text(rows[0].whIdName);
	}
	if(rows[0].whType!=""){
		$("#ipDisWarehouseType").text(rows[0].whType);
	}
	if(rows[0].originalAmount!=""){
		$("#ipDismwhSum").text(rows[0].originalAmount);
	}
	if(rows[0].inventoryAmount!=""){
		$("#inventoryAmountDetail").text(rows[0].inventoryAmount);
	}
	if(rows[0].inventoryTime!=""){
		$("#inventoryTimeDetail").text(rows[0].inventoryTime);
	}
	if(rows[0].whAddr!=""){
		$("#ipDisWarehouseAddress").text(rows[0].whAddr);
	}
	
	// 盘点人信息
	if(rows[0].inventoryOperator!=""){
		$("#ipInventoryOperator").text(rows[0].inventoryOperator);
	}
	if(rows[0].inventoryOperatorName!=""){
		$("#ipInventoryOperatorName").text(rows[0].inventoryOperatorName);
	}
	if(rows[0].inventoryOperatorDepart!=""){
		$("#ipInventoryOperatorDepart").text(rows[0].inventoryOperatorDepart);
	}
	if(rows[0].inventoryOperatorPhone!=""){
		$("#ipInventoryOperatorPhone").text(rows[0].inventoryOperatorPhone);
	}
	if(rows[0].inventoryOperatorPostCode!=""){
		$("#ipInventoryOperatorCode").text(rows[0].inventoryOperatorPostCode);
	}
	if(rows[0].inventoryOperatorEmail!=""){
		$("#ipInventoryOperatorEmail").text(rows[0].inventoryOperatorEmail);
	}
	if(rows[0].inventoryOperatorRole!=""){
		$("#ipInventoryOperatorRole").text(rows[0].inventoryOperatorRole);
	}
	if(rows[0].inventoryOperatorAdrr!=""){
		$("#ipInventoryOperatorAddr").text(rows[0].inventoryOperatorAdrr);
	}
	
	// 监制人
	
	if(rows[0].supervisory!=""){
		$("#supervisoryId").text(rows[0].supervisory);
	}
	if(rows[0].supervisoryName!=""){
		$("#supervisoryName").text(rows[0].supervisoryName);
	}
	if(rows[0].supervisoryDepart!=""){
		$("#supervisoryDepart").text(rows[0].supervisoryDepart);
	}
	if(rows[0].supervisoryPhone!=""){
		$("#supervisoryPhone").text(rows[0].supervisoryPhone);
	}
	if(rows[0].supervisoryPostCode!=""){
		$("#supervisoryPostcode").text(rows[0].supervisoryPostCode);
	}
	if(rows[0].supervisoryEmail!=""){
		$("#supervisoryEmail").text(rows[0].supervisoryEmail);
	}
	if(rows[0].supervisoryRole!=""){
		$("#supervisoryRole").text(rows[0].supervisoryRole);
	}
	if(rows[0].supervisoryAdrr!=""){
		$("#supervisoryAddr").text(rows[0].supervisoryAdrr);
	}
	
}





/* 右键菜单执行的事件 */
//$("#ipUpdateMenu").click(function(){			//更新
//	ipOpenUpdateBoxFn();
//});

$("#ipDeletMenu").click(function(){				//删除
	ipDeleteRowsFn();
});	

$("#ipSeeMenu").click(function(){				//查看
	ipSeeMWhpDetail();
});	

/**
 * 提示信息通用的方法
 */
function toPrompt(title,msgs){
	$.messager.show({
		title:title,
		msg:msgs,
		timeout:1500,
		showType:'slide',
		height:105
	});
}


