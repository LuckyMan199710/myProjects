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
	//出库列表
	$('#tsfOutBox').datagrid({
		height:542,
		rownumbers:true,
		SingleSelect:false,
		selectOnCheck:true,
		checkOnSelect:true,
		scrollbarSize:12,
		idField:"texgoodsId",
		striped : true,
		showFooter : true,
	    columns:[[
            {field:'texGoodsId',title:'商品编号',width:150,checkbox:true},       
	        {field:'texGoodsName',title:'商品名称',width:150},   
	        {field:'texDecorate',title:'装饰内容',width:150},   
	        {field:'texAppearance',title:'画面内容',width:150},
	        {field:'texCraftsmen',title:'工艺师',width:150},        
	        {field:'texGoodWarehouse',title:'所出仓库',width:150},
	        {field:'texGoodType',title:'商品类别',width:150}
	    ]]
	});
	$('#tsfOutBox1').datagrid({	
		fitColumns:false,
		SingleSelect:false,
		selectOnCheck:true,
		checkOnSelect:true,
		scrollbarSize:12,
		idField:"goodsName",
		striped : true,
		showFooter : true,
	    columns:[[     
	        {field:'goodsName',title:'商品名称',width:150},   
	        {field:'decorate',title:'装饰内容',width:150},   
	        {field:'appearance',title:'画面内容',width:150},
	        {field:'CraftsmanName',title:'工艺师',width:150},        
	        {field:'GoodWarehouse',title:'所出店铺',width:150},
	        {field:'pType',title:'商品类别',width:150}
	    ]]
	});
	/* 显示信息 */
	$("#TexGoodsTable").datagrid({
		fitColumns:false,
		url:'TEXportGoods.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"egId",
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
				return 'background:#e4ebed';   //隔行换色
			}
		},
		toolbar:'#TexgNavsForm',
		columns : [[
		            	{field:"egId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:'qrcode',title:'商品二维码',align:'center',width:100,
		    				formatter: function(value,row,index){
		    					if (value!=""){
		    						return "<img style='width:34px;height:26px;padding-top:5px;position: relative;' src='"+value+"' onmouseover='texDisPlayImage(this)' onmouseout='texCancelDisImg(this)'>";
		    					} 
		    				},
		            	},
		            	{field:"goodsName",title:"商品名称",align:"center",width:220},
		            	{field:"ProcessName",title:"加工内容",align:"center",width:220},
		            	{field:"CraftsmanName",title:"技术人员",align:"center",width:160},
		            	{field:"cost",title:"商品成本",align:"center",width:160},
		            	{field:"price",title:"出售价格",align:"center",width:160},
		            	{field:"spdWarehouseName",title:"所出仓库",align:"center",width:220},
		            	{field:"egOperatorName",title:"经办人",align:"center",width:160},
		            	{field:"productMeno",title:"监制人",align:"center",width:160},
		            	{field:"companyName",title:"仓库名称",align:"center",width:220},
		            	{field:"egExportDate",title:"出库时间",align:"center",width:220},
		            	{field:"exportMeno",title:"出库备注",align:"center",width:220}
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#texgMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	// 出库商品界面
	$("#ExportGoodsBox").dialog({
		 width:650,
		 height:810,
		 title:'商品出库界面',
		 closed:true,
		 modal : true,
		 iconCls : 'icon-search',
		 // 页面打开之后触发的事件--清空页面上次出库的信息
		 onOpen : function(){
			 $("#egOperator").combogrid('setValue','');
			 $("#egOperator").combogrid('setText','');
			 $("#ExprotInputBoxx input").val("");
			 $("#texGoodQrcodeWord").text("");
			 $("#ExportOutSeeDetailPage .inpurCommon").text("");
			 $("#confirmExportGoods").val("确认出库");
		 }
	});
	
	// 查询界面
	$("#TexgSearchBox").dialog({
		 width:730,
		 height:240,
		 title:'商品出库查询界面',
		 closed:true,
		 modal : true,
		 iconCls : 'icon-search',
		 buttons : [
			           {
			        	   text : '查询',
			        	   iconCls : 'icon-ok',
			        	   handler : function (){
			        		   texSearchFn();
			        	   },
			           },
			           {
			        	   text : '取消',
			        	   iconCls : 'icon-undo',
			        	   handler : function(){
			        		   $('#TexgSearchBox').dialog('close');			// 关闭修改窗体
			        	   },
			           },{
			        	   text : '清空',
			        	   iconCls : 'icon-cancel',
			        	   handler : function(){
			        		   $('#TexgSearchBox input').val("");			// 关闭修改窗体
			        	   },
			           }
			          ],
	});
	
	// 更新界面
	$("#TexgUearchBox").dialog({
		title : '商品出库更新界面',
		iconCls : 'icon-edit',
		width : 660,
		height : 758,
		closed : true,
		modal : true,
		buttons : [
		           {
		        	   text : '更新',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		   texConfirmUpdateFn();
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#TexgUearchBox').dialog('close');			// 关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	/* 查看详情界面 */
	 $("#texGoodsDetails").dialog({
		 width:1008,
		 height:578,
		 title:'商品出库详情界面',
		 closed : true,
		 modal : true,
	 });
	
	// 调用控件初始化方法
	TexgInitFn();
});

// 获得当前时间
function getNowTime(){
		var myDate = new Date();
	    var year = myDate.getFullYear();
	    var month = myDate.getMonth() + 1;
	    var date = myDate.getDate();
	    var hour = myDate.getHours();
	    var minute = myDate.getMinutes();
	    var second = myDate.getSeconds();
	    var min = checkTime(minute);
	    var sec = checkTime(second);
	    var time1 = "当前时间 : "+year + "年" + month + "月" + date + "日";
	    var time2 = hour + "：" + min + "：" + sec;
	    function checkTime(i){
	      if(i<10){
	        i = "0" + i;
	      }
	      return i;
	     }
	    return year+"-"+month+"-"+date+" "+hour+":"+min+":"+sec;
}

// 更新界面的ajax请求
function updatePageAjax(){
	$.ajax({
		type:"get",
		url:"TEXportGoods2.json",
		dataType : "json",
		success : function(row){
			if(row!=null&&row!=""){
				 $("#texUpdateGoodName").text(row.goodsName);	
	 			 $("#texUpdateGoodName").attr('title',row.goodsName);
	 			  // 出库数量
	 			  $("#texUpdateGoodCount").text("1 件");
	 			  // 出售价格
	 			  $("#texUpdateGoodPrice").text(row.price+"￥");
	 			  // 商品型号
	 			  $("#texUpdateGoodModel").text(row.gdsModel);
	 			  // 商品规格
	 			  $("#texUpdateGoodSpecification").text(row.gdsSpecification);
	 			  $("#texUpdateGoodSpecification").attr('title',row.gdsSpecification);
	 			  // 商品类别
	 			  $("#texUpdateGoodType").text(row.pType);
	 			  // 商品器型
	 			  $("#texUpdateGoodShape").text(row.shape);
	 			  // 供应商
	 			  $("#texUpdateGoodCompanyName").text(row.companyName);
	 			  $("#texUpdateGoodCompanyName").attr('title',row.companyName);
	 			  // 是否手工
	 			  if(row.isManual==0){
	 				 $("#texUpdateGoodIsManual").text("是");
	 				 $("#texUpdateGoodIsManual").css('color','green');
	 			  }else{
	 				 $("#texUpdateGoodIsManual").text("否");
	 				$("#texUpdateGoodIsManual").css('color','red');
	 			  }
	 			  // 加工内容
	 			  $("#texUpdateGoodProcessContent").text(row.ProcessName);
	 			  // 技术人员
	 			  $("#texUpdateGoodGraftsMan").text(row.CraftsmanName);
	 			  // 所出仓库
	 			  $("#texUpdateGoodWarehouse").text(row.spdWarehouseName);
	 			  $("#texUpdateGoodWarehouse").attr('title',row.spdWarehouseName);
	 			  // 监制人
	 			  $("#texUpdateGoodMonitor").text(row.monitorName);
	 			  // 商品成本
	 			  $("#texUpdateGoodCost").text(row.cost);
	 			  // 商品二维码
	 			  $("#texUpdateGoodQrcodeWord").text("商品二维码");
	 			  $("#texUpdateGoodQrcodeWord").css({color:"#a1cae1",cursor:"pointer"});
	 			 /**
	 				 * 当上传有二维码时鼠标移动到上传位置将图片显示出来
	 				 */
	 				$("#texUpdateGoodQrcodeWord").hover(function(){
	 						$("#UpdateTrueQcodes").attr('src',row.qrcode);
	 						$("#UpdateTrueQcodes").show();
	 				},function(){
	 					$("#UpdateTrueQcodes").hide('1800');
	 				});
	 			  // 出库时间
	 			  $("#texUpdateGoodTime").text(row.egExportDate);
	 			  // 备注
	 			  $("#texUpdateGoodProductMeno").text(row.productMeno);
	 			  $("#texUpdateGoodProductMeno").attr('title',row.productMeno);
	 			  }else{
			    	  $("#ExportUNewsTable .inpurCommon").text("");
			    	  $("#texUpdateGoodQrcodeWord").text("");
			      }
		},
		error:function(data){
			alert("出错了");
		}
	});
}
window.count=0;
// 初始化控件方法
function TexgInitFn(){
	// 商品编号(此处进行商品的信息查询)--出库界面的
	var goodsId = $("#goodsId").val();
	$("#goodsId").keyup(function(){	
		/*if($(this).val()==""){*/
			/*alert(123);*/
//			$("#ExportOutNewsTable .inpurCommon").text("");
//		    $("#texGoodQrcodeWord").text("");
//			return;
		/*}*/
		$.ajax({
			type:"get",
			url:"TEXportGoods2.json",
			dataType : "json",			
			success : function(row){
				if(row!=null&&row!=""){	
					$('#tsfOutBox').datagrid('appendRow',{
						texGoodsId:row.egId,
					    texGoodsName:row.goodsName,
					    texDecorate:row.decorate,
					    texAppearance:row.appearance,
					    texCraftsmen:row.CraftsmanName,
					    texGoodWarehouse:row.GoodWarehouse,
					    texGoodType:row.pType
						});
					var rowId = "#datagrid-row-r1-2-"+count;
					var index = $(rowId).attr("datagrid-row-index");
					count++; 
					/*$('#tsfOutBox').datagrid('checkAll');*/
					$('#tsfOutBox').datagrid('checkRow',index);
				/*	$("#ExportOutSeeDetailPage input").text("");
		 			  // 获得当前时间
		 			  // 商品名称
		 			  $("#texGoodName").text(row.goodsName);	
		 			  $("#texGoodName").attr('title',row.goodsName);
		 			  // 出库数量
		 			  $("#texGoodCount").text("1 件");
		 			  // 出售价格
		 			  $("#texGoodPrice").text(row.price+"￥");
		 			  // 商品型号
		 			  $("#texGoodModel").text(row.gdsModel);
		 			  // 商品规格
		 			  $("#texGoodSpecification").text(row.gdsSpecification);
		 			  // 设置当鼠标移上去提示相应的文字
		 			  $("#texGoodSpecification").attr('title',row.gdsSpecification);
		 			  // 商品类别
		 			  $("#texGoodType").text(row.pType);
		 			  // 商品器型
		 			  $("#texGoodShape").text(row.shape);
		 			  // 供应商
		 			  $("#texGoodCompanyName").text(row.companyName);
		 			  $("#texGoodCompanyName").attr('title',row.companyName);
		 			  // 是否手工
		 			  if(row.isManual==0){
		 				 $("#texGoodIsManual").text("是");
		 				 $("#texGoodIsManual").css('color','green');
		 			  }else{
		 				 $("#texGoodIsManual").text("否");
		 				$("#texGoodIsManual").css('color','red');
		 			  }
		 			  // 加工内容
		 			  $("#texGoodProcessContent").text(row.ProcessName);
		 			  // 技术人员
		 			  $("#texGoodGraftsMan").text(row.CraftsmanName);
		 			  // 所出仓库
		 			  $("#texGoodWarehouse").text(row.spdWarehouseName);
		 			  $("#texGoodWarehouse").attr('title',row.spdWarehouseName);
		 			  // 监制人
		 			  $("#texGoodMonitor").text(row.monitorName);
		 			  // 商品成本
		 			  $("#texGoodCost").text(row.cost+"￥");
		 			  // 商品二维码
		 			  $("#texGoodQrcodeWord").text("商品二维码");
		 			  $("#texGoodQrcodeWord").val("商品二维码");
		 			  $("#texGoodQrcodeWord").css({color:"#a1cae1",cursor:"pointer"});
		 			  // 商品二维码
		 			  $("#TrueQcodes").attr('src',row.qrcode);
		 			 *//**
		 				 * 当上传有二维码时鼠标移动到上传位置将图片显示出来
		 			 *//*
		 			 $("#texGoodQrcodeWord").hover(function(){
		 						$("#TrueQcodes").show();
		 				},function(){
		 					$("#TrueQcodes").hide('1800');
		 				});
		 			 
		 			  // 出库时间
		 			  $("#texGoodTime").text(getNowTime());
		 			  // 备注
		 			  $("#texGoodProductMeno").text(row.productMeno);
		 			  $("#texGoodProductMeno").attr('title',row.productMeno);*/
				}/*else{
					 $("#ExportOutNewsTable .inpurCommon").text("");
	 		    	 $("#texGoodQrcodeWord").text("");
				}*/
/*				 for (var i = 0; i < row.length; i++) {
					 $('#tsfOutBox').datagrid('checkRow', i);
					      //禁用checkbox
					      $(".datagrid-row[datagrid-row-index=" + i + "] input[type='checkbox']")[0].disabled = true;
					  }*/
			}
		});
		/*$("#goodsId").val("");*/
		if($("#goodsId").val()==""){
			alert("222");
		}
	});
	// 商品编号(更新界面的)
	$("#TexgUgoodsId").keyup(function(){
		if($(this).val()==""){
			$("#ExportUNewsTable .inpurCommon").text("");
		    $("#texUpdateGoodQrcodeWord").text("");
			return;
		}
		// 调用更新界面的异步请求
		updatePageAjax();
	});
	
	
	/* 初始化向导按钮 */
	$("#TexgAddBT").linkbutton({					//出库
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			$("#ExportGoodsBox").dialog('open');
		}
	});
	$("#TexgDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			TexdeletTimRowsFn();
		}
	});
	$("#TexgUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			texOpenTsemiDialogFn();
		}
	});
	$("#TexgSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#TexgSearchBox").dialog('open');
		}
	});
	
	$("#TexgOutput").linkbutton({					//导出
		plain:true,
		iconCls:'icon-large-smartart',
		onClick : function(){
			LODOP=getLodop();   
			LODOP.PRINT_INIT(""); 
			LODOP.ADD_PRINT_HTM(100,20,500,80,$(".datagrid-view2").html()); 
			LODOP.SET_SAVE_MODE("Orientation",2); //Excel文件的页面设置：横向打印   1-纵向,2-横向;
			LODOP.SET_SAVE_MODE("PaperSize",9);  //Excel文件的页面设置：纸张大小   9-对应A4
			LODOP.SET_SAVE_MODE("Zoom",90);       //Excel文件的页面设置：缩放比例
			LODOP.SET_SAVE_MODE("CenterHorizontally",true);//Excel文件的页面设置：页面水平居中
			LODOP.SET_SAVE_MODE("CenterVertically",true); //Excel文件的页面设置：页面垂直居中
			LODOP.SET_SAVE_MODE("QUICK_SAVE",true);//快速生成（无表格样式,数据量较大时或许用到） 
			LODOP.SAVE_TO_FILE("新文件名.xls"); 
		}
	});
	
	$("#TexgPrint").linkbutton({					//打印
		plain:true,
		iconCls:'icon-print',
		onClick : function(){
			texNavClickPrintFn(); 
		}
	});
	
	$("#TexgCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	
	// 经办人(出库界面)
	$("#egOperator").combogrid({
		panelWidth:900,
		panelHeight:'168',
	    idField:'egOperatorName',
	    fitColumns:true,    
	    textField:'egOperatorName', 
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    url: "TEXportGoods.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'egOperatorId',title:'账号',align:'center',width:100,sortable:true},
					{field:'egOperatorName',title:'姓名',align:'center',width:100,sortable:true},    
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]],
	   onChange : function(newValue, oldValue){
		   	  // 获取数据表格对象
			  var gtable = $(this).combogrid('grid');	
			  // 获取选择的行
			  var row = gtable.datagrid('getSelected');
		      // 经办人信息
			  if(newValue!=""){
				  // 姓名
				 $("#texEgOperatorName").text(row.egOperatorName);
				 // 部门
				 $("#texEgOperatorDepartment").text(row.department);
				 // 电话
				 $("#texEgOperatorPhone").text(row.empTelphone);
				 // 邮箱
				 $("#texEgOperatorEmail").text(row.empEmail);
				 // 邮政编码
				 $("#texEgOperatorCode").text(row.empPostCode);
				 // 角色
				 $("#texEgOperatorRole").text(row.role);
				 // 地址
				 $("#texEgOperatorAddress").text(row.empAddress);
			}else{
				$("#ExporPersontNewsTable .inpurCommon").text("");
			}
	   }
	});
	
	// 经办人(更新界面)
	$("#TexgUegOperator").combogrid({
		panelWidth:900,
		panelHeight:'168',
	    idField:'egOperatorId',
	    fitColumns:true,    
	    textField:'egOperatorName', 
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    url: "TEXportGoods.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'egOperatorId',title:'账号',align:'center',width:100,sortable:true},
					{field:'egOperatorName',title:'姓名',align:'center',width:100,sortable:true},    
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]],
	   onChange : function(newValue, oldValue){
		   	  // 获取数据表格对象
			  var gtable = $(this).combogrid('grid');	
			  // 获取选择的行
			  var row = gtable.datagrid('getSelected');
		      // 经办人信息
			  // 姓名
			 if(newValue!=""){
			 $("#texEgUpdateOperatorName").text(row.egOperatorName);
			 // 部门
			 $("#texEgUpdateOperatorDepartment").text(row.department);
			 // 电话
			 $("#texEgUpdateOperatorPhone").text(row.empTelphone);
			 // 邮箱
			 $("#texEgUpdateOperatorEmail").text(row.empEmail);
			 // 邮政编码
			 $("#texEgUpdateOperatorCode").text(row.empPostCode);
			 // 角色
			 $("#texEgUpdateOperatorRole").text(row.role);
			 // 地址
			 $("#texEgUpdateOperatorAddress").text(row.empAddress);
			 }else{
					$("#ExportUpdatePersonNewsTable .inpurCommon").text("");
			}
	   }
	});
	
	// 经办人(查询界面)
	$("#TexgSegOperator").combogrid({
		panelWidth:900,
		panelHeight:'168',
	    idField:'egOperatorId',
	    fitColumns:true,    
	    textField:'egOperatorName', 
		pagination : true,//是否分页 
	    pageSize: 3,//每页显示的记录条数，默认为10 
	    pageList: [3,6],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
	    url: "TEXportGoods.json",
	   	nowrap:true, 
	   	scrollbarSize:12,
	    columns:[[    
					{field:'egOperatorId',title:'账号',align:'center',width:100,sortable:true},
					{field:'egOperatorName',title:'姓名',align:'center',width:100,sortable:true},    
					{field:'role',title:'身份',align:'center',width:100},
					{field:'empTelphone',title:'电话',align:'center',width:100},
					{field:'empAddress',title:'地址',align:'center',width:350}, 
		    ]],
	});
	
	// 出库时间,入库时间
	$("#TexgSegExportDateStart,#TexgSegExportDateEnd").datetimebox({
		editable:false,
	});
}

//首页鼠标移动到图片上执行的方法
function texDisPlayImage(value){
	var imgPath=$(value).attr('src');
	getXandY(value);
	$("#TEXImgBox").css('display','inline-block')
	$("#TexRowImg").attr('src',imgPath);
}

//  鼠标移走时执行的方法
function texCancelDisImg(value){
	$("#TEXImgBox").css('display','none');
}

//  获得当前鼠标的x,y轴的值
function getXandY(l){
     $(l).mousemove(function(e) {
         xx= e.pageX || e.clientX;
         yy = e.pageY || e.clientY;
         $("#TEXImgBox").css('top',yy-242);
         $("#TEXImgBox").css('left',xx-130);
     });
};

// 商品管理的导航栏打印(数据显示-有预览)
function navPrintFn(rows){
	// 商品名称
	$("#disGoodName").text(rows[0].goodsName);
	// 出库数量
	$("#disGoodAmount").text("1 件");
	// 出售价格
	$("#disGoodPrice").text(rows[0].price+"￥");
	// 商品型号
	$("#disGoodModel").text(rows[0].gdsModel);
	// 商品类别
	$("#disGoodType").text(rows[0].pType);
	// 商品器型
	$("#disGoodShape").text(rows[0].shape);
	// 是否手工
	 if(rows[0].isManual=="0"){
		 $("#disGoodIsManual").text("是");
	  }else{
		  $("#disGoodIsManual").text("否");
	  }
	
	// 加工内容
	$("#disGoodProccess").text(rows[0].ProcessName);
	// 技术人员
	$("#disGoodGraftsMan").text(rows[0].CraftsmanName);
	// 供货商
	$("#disGoodCompanyName").text(rows[0].companyName);
	// 所出仓库
	$("#disGoodWarehouse").text(rows[0].spdWarehouseName);
	// 监制人
	$("#disGoodMonitor").text(rows[0].monitorName);
	// 出库时间
	$("#disGoodTime").text(rows[0].egExportDate);
	// 商品备注
	$("#disGoodProductMeno").text(rows[0].productMeno);
	// 商品规格
	$("#disGoodSpecification").text(rows[0].gdsSpecification);
	// 出库备注
	$("#exportGoodMeno").text(rows[0].exportMeno);
	
	// 姓名
	$("#printPersonName").text(rows[0].egOperatorName);
	// 部门
	$("#printDepartment").text(rows[0].department);
	// 电话
	$("#printPhone").text(rows[0].empTelphone);
	// 邮箱
	$("#printEmail").text(rows[0].empEmail);
	// 邮政编号
	$("#printCode").text(rows[0].empPostCode);
	// 角色
	$("#printRole").text(rows[0].role);
	// 地址
	$("#texPrintgOperatorAddress").text(rows[0].empAddress);
}

//点击导航栏打印事件方法
function texNavClickPrintFn(){
	var rows=$("#TexGoodsTable").datagrid('getSelections');
	if(rows.length==1){
		navPrintFn(rows);
		// 获得商品的二维码的值
		var goodsQcodeValue = rows[0].qrcode;
		printExportMenu(goodsQcodeValue);
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能打印一件商品信息,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你需要打印的商品','warning');
	}
}



// 出库界面打印出库商品信息(有预览)  +++++++++++++++++++++++++++++++++++++++++++++++改了


function printExportMenu(){
	var id = [];
	var names = [];
	var category = [];
	var frame = [];
	var decorate = [];
	var Craftsmen =[];
	var Warehouseissued = [];
	var rows = $('#tsfOutBox').datagrid('getSelections');
	var num = rows.length;
	var buyer = $("#buyer").val();
	var phonenum = $("#phoneNum").val();
	var shopOut = $("#shopOut").val();
	var message =$("#message").val();
	var exportMeno =$("#exportMeno").val();
	var egOperator =$("#egOperator").combogrid('getValue');
	var mydate = new Date();
	var time=mydate.toLocaleString();
     for(var i=0;i<rows.length;i++){
    	 id[i]=rows[i].texGoodsId;	 
    	 names[i]=rows[i].texGoodsName;
    	 category[i]=rows[i].texGoodType;
    	 frame[i]=rows[i].texAppearance;
    	 decorate[i]=rows[i].texDecorate;
    	 Craftsmen[i]=rows[i].texCraftsmen;
    	 Warehouseissued[i]=rows[i].texGoodWarehouse;
     }
        	try{
        		 LODOP=getLodop();  
        		 LODOP.ADD_PRINT_TEXT("3.39mm","74.4mm","77.55mm","9.6mm","钦州坭兴陶出库单");
        		 LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
        			LODOP.SET_PRINT_STYLEA(0,"Bold",1);
        	     LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
        	        LODOP.ADD_PRINT_TEXT("40","50","150","20","买家:"+buyer);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("40","250","300","20","联系方式:"+phonenum);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("40","550","500","20","买家留言:"+message);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","50","300","20","备注:"+exportMeno);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","250","300","20","所出店铺:"+shopOut);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","550","200","20","发货数量:"+num);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","50","120","20","经办人:"+egOperator);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","250","250","20","付款时间:2019-01-01");
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","550","250","20","打印时间:"+time);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        			LODOP.ADD_PRINT_TEXT(150,35,100,20,"商品编号");
        			LODOP.ADD_PRINT_TEXT(150,164,100,20,"商品名称");
        			LODOP.ADD_PRINT_TEXT(150,274,100,20,"商品类别");
        			LODOP.ADD_PRINT_TEXT(150,384,100,20,"画面内容");
        			LODOP.ADD_PRINT_TEXT(150,494,100,20,"装饰内容");
        			LODOP.ADD_PRINT_TEXT(150,597,100,20,"工艺师");
        			LODOP.ADD_PRINT_TEXT(150,675,100,20,"所出仓库");
        			LODOP.ADD_PRINT_LINE(145,29,143,757,0,2);//上
        			LODOP.ADD_PRINT_LINE(176,29,144,29,0,2);//左
        			LODOP.ADD_PRINT_LINE(176,157,144,157,0,2);//左二
        			LODOP.ADD_PRINT_LINE(176,265,144,265,0,2);//左三
        			LODOP.ADD_PRINT_LINE(176,373,144,373,0,2);//左4
        			LODOP.ADD_PRINT_LINE(176,484,144,484,0,2);
        			LODOP.ADD_PRINT_LINE(176,587,143,587,0,2);//左五
        			LODOP.ADD_PRINT_LINE(176,667,143,667,0,2);//左6
        			LODOP.ADD_PRINT_LINE(176,757,143,757,0,2);//左7
        			LODOP.ADD_PRINT_LINE(178,29,176,757,0,2);	
        		  for (var i = 0; i < num; i++) {
        				LODOP.ADD_PRINT_TEXT(181+25*i,35,121,20,id[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,164,81,20,names[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,274,81,20,category[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,384,81,20,frame[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,494,81,20,decorate[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,597,81,20,Craftsmen[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,675,81,20,Warehouseissued[i]);
        				//--格子画线		
        				LODOP.ADD_PRINT_LINE(201+25*i,29,176+25*i,29,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,157,176+25*i,157,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,265,176+25*i,265,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,373,176+25*i,373,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,484,176+25*i,484,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,587,176+25*i,587,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,667,176+25*i,667,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,757,176+25*i,757,0,1);
        				LODOP.ADD_PRINT_LINE(202+25*i,29,201+25*i,757,0,1);	//下	 
        		}
        	       LODOP.PREVIEW();
        			}
        		catch (e) {
        				alert(e.message);
        			}
	}					



// 出库界面打印出库商品信息(无预览)  =======================================================改了
function printExportMenuNotPreview(){
	var id = [];
	var names = [];
	var category = [];
	var frame = [];
	var decorate = [];
	var Craftsmen =[];
	var Warehouseissued = [];
	var rows = $('#tsfOutBox').datagrid('getSelections');
	var num = rows.length;
	var buyer = $("#buyer").val();
	var phonenum = $("#phoneNum").val();
	var shopOut = $("#shopOut").val();
	var message =$("#message").val();
	var exportMeno =$("#exportMeno").val();
	var egOperator =$("#egOperator").combogrid('getValue');
	var mydate = new Date();
	var time=mydate.toLocaleString();
     for(var i=0;i<rows.length;i++){
    	 id[i]=rows[i].texGoodsId;	 
    	 names[i]=rows[i].texGoodsName;
    	 category[i]=rows[i].texGoodType;
    	 frame[i]=rows[i].texAppearance;
    	 decorate[i]=rows[i].texDecorate;
    	 Craftsmen[i]=rows[i].texCraftsmen;
    	 Warehouseissued[i]=rows[i].texGoodWarehouse;
     }
        	try{
        		 LODOP=getLodop();  
        		 LODOP.ADD_PRINT_TEXT("3.39mm","74.4mm","77.55mm","9.6mm","钦州坭兴陶出库单");
        		 LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
        			LODOP.SET_PRINT_STYLEA(0,"Bold",1);
        	     LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
        	        LODOP.ADD_PRINT_TEXT("40","50","150","20","买家:"+buyer);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("40","250","300","20","联系方式:"+phonenum);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("40","550","500","20","买家留言:"+message);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","50","300","20","备注:"+exportMeno);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","250","300","20","所出店铺:"+shopOut);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("70","550","200","20","发货数量:"+num);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","50","120","20","经办人:"+egOperator);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","250","250","20","付款时间:2019-01-01");
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        	        LODOP.ADD_PRINT_TEXT("100","550","250","20","打印时间:"+time);
        	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        			LODOP.ADD_PRINT_TEXT(150,35,100,20,"商品编号");
        			LODOP.ADD_PRINT_TEXT(150,164,100,20,"商品名称");
        			LODOP.ADD_PRINT_TEXT(150,274,100,20,"商品类别");
        			LODOP.ADD_PRINT_TEXT(150,384,100,20,"画面内容");
        			LODOP.ADD_PRINT_TEXT(150,494,100,20,"装饰内容");
        			LODOP.ADD_PRINT_TEXT(150,597,100,20,"工艺师");
        			LODOP.ADD_PRINT_TEXT(150,675,100,20,"所出仓库");
        			LODOP.ADD_PRINT_LINE(145,29,143,757,0,2);//上
        			LODOP.ADD_PRINT_LINE(176,29,144,29,0,2);//左
        			LODOP.ADD_PRINT_LINE(176,157,144,157,0,2);//左二
        			LODOP.ADD_PRINT_LINE(176,265,144,265,0,2);//左三
        			LODOP.ADD_PRINT_LINE(176,373,144,373,0,2);//左4
        			LODOP.ADD_PRINT_LINE(176,484,144,484,0,2);
        			LODOP.ADD_PRINT_LINE(176,587,143,587,0,2);//左五
        			LODOP.ADD_PRINT_LINE(176,667,143,667,0,2);//左6
        			LODOP.ADD_PRINT_LINE(176,757,143,757,0,2);//左7
        			LODOP.ADD_PRINT_LINE(178,29,176,757,0,2);	
        		  for (var i = 0; i < num; i++) {
        				LODOP.ADD_PRINT_TEXT(181+25*i,35,121,20,id[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,164,81,20,names[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,274,81,20,category[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,384,81,20,frame[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,494,81,20,decorate[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,597,81,20,Craftsmen[i]);
        				LODOP.ADD_PRINT_TEXT(181+25*i,675,81,20,Warehouseissued[i]);
        				//--格子画线		
        				LODOP.ADD_PRINT_LINE(201+25*i,29,176+25*i,29,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,157,176+25*i,157,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,265,176+25*i,265,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,373,176+25*i,373,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,484,176+25*i,484,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,587,176+25*i,587,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,667,176+25*i,667,0,1);
        				LODOP.ADD_PRINT_LINE(201+25*i,757,176+25*i,757,0,1);
        				LODOP.ADD_PRINT_LINE(202+25*i,29,201+25*i,757,0,1);	//下	 
        		}
        	       LODOP.PRINT();
        			}
        		catch (e) {
        				alert(e.message);
        			}
}



// 将商品的信息赋值到打印的纸张上
function transferPrintValue(){
		/*$.ajax({
	        url:'ex1.json',
	        type:'get',
	        datatype:'json',
	        success:function(res){
	        console.log(res);
	    //将数据显示在页面上
	     //遍历数据
         for(var i = 0 ;i<res.length;i++){
	      $("#aa").append("<tr>" +
	      		"<td>"+element['name']+"</td><td>"+element['age']+"</td><td>"+element['address']+"</td>" +
	      		"</tr>");
         }
		}
	});*/
}


// 确认出库方法  +++++++++++++++++++++++++++++++++++++++++改了
$("#confirmExportGoods").click(function(){
/*	if($("#goodsId").val()==""||$("#texGoodName").text()==""){
		$("#goodsId").focus();
		toPrompt('添加商品信息提示','请输入出库的商品编号');
	}else*/ 
	if($("#egOperator").combogrid('getValue')==""){
		toPrompt('添加商品信息提示','请选择要出库的经办人');
	}
	else if($("#buyer").val()==""){
		toPrompt('信息提示','请填写买家名字');
	}
	else if($("#phoneNum").val()==""){
		toPrompt('信息提示','请填写买家联系方式');
	}
	else if($("#shopOut").val()==""){
		toPrompt('信息提示','请填写所出店铺');
	}
		else{
		$.messager.confirm('出库提示','确定出库选中的商品?',function(data){
			if(data){
				// 调用同步打印方法（有预览的按钮）
				var isCheckHasPreviewBt = $("#sameTimePrint").prop("checked");
				// 调用同步打印方法（无预览的按钮）
				var isCheckNotPreviewBt = $("#sameTimePrintNoPreview").prop("checked");
				debugger;
				if(isCheckHasPreviewBt){
					// 设置打印信息
					transferPrintValue();
					// 获得商品二维码图片的值
				/*	var qcodeValue = $("#TrueQcodes").attr('src');*/
					// 弹出打印预览窗口
					printExportMenu();
				}
				if(isCheckNotPreviewBt){
					// 设置打印信息
					transferPrintValue();
					// 弹出打印预览窗口
					printExportMenuNotPreview();
				}
				var row=$("#tsfOutBox").datagrid('getSelections');
	        	if(row.length>0){
	        				var id =[];												//用来接收每行的id
	        				for(var i=0;i<row.length;i++){
	        					id.push(row[i].texGoodsId);		           						
	        				}
	        				alert(id.join(','));
				}
				toPrompt('添加商品信息提示','添加商品出库成功');		
				del();
				/*$("#tsfOutBox").datagrid('uncheckAll');*/
				// 将商品的信息清空
/*				$("#ExportOutNewsTable .inpurCommon").text("");
		    	$("#texGoodQrcodeWord").text("");
		    	$("#exportMeno").val("");
				$("#goodsId").val('');*/
				$("#goodsId").focus();
				// 刷新界面信息
				$("#TexGoodsTable").datagrid('load');
			}
		});
	}
});
function del(){
	var rows = $('#tsfOutBox').datagrid("getRows");
	var copyRows = [];
	for ( var j= 0; j < rows.length; j++) {
	copyRows.push(rows[j]);
	}
	for(var i =0;i<copyRows.length;i++){
	var index = $('#tsfOutBox').datagrid('getRowIndex',copyRows[i]);
	$('#tsfOutBox').datagrid('deleteRow',index);
 }
	count=0;
}
//删除选中记录
function TexdeletTimRowsFn(){
	var rows=$("#TexGoodsTable").datagrid('getSelections');
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
				
				
				$("#TexGoodsTable").datagrid('load');						// 调用该方法刷新当前页
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	
	}
}

// 查询商品出库信息界面
function texSearchFn(){
	toPrompt("查询提示","查询信息成功");
	$('#TexgSearchBox').dialog('close')
	// 调用该方法刷新当前页
	$("#TexGoodsTable").datagrid('load');
}

//打开更新窗体方法
function texOpenTsemiDialogFn(){
	var rows=$("#TexGoodsTable").datagrid('getSelections');
	if(rows.length==1){
		texGetTsemiRowsValue(rows);
		$("#TexgUearchBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

// 获得选中行的信息并传递到更新界面放过
function texGetTsemiRowsValue(rows){
	
	// 商品编号
	$("#TexgUgoodsId").val(rows[0].goodsId);
	updatePageAjax();
	
	// 经办人
	$("#TexgUegOperator").combogrid('setValue',rows[0].egOperatorId);
	$("#TexgUegOperator").combogrid('setText',rows[0].egOperatorName);
	
	// 出库备注
	$("#TexUExportMeno").val(rows[0].exportMeno);
}

//确认更新出库信息
function texConfirmUpdateFn(){
	if($("#TexgUgoodsId").val()==""||$("#texUpdateGoodName").text()==""){
		$("#TexgUgoodsId").focus();
		toPrompt('更新提示','请输入更新商品的编号');
	}else if($("#TexgUegOperator").combogrid('getValue')==""){
		toPrompt('更新提示','请选择经办人');
	}else{
		$.messager.confirm('更新提示','确定更新出库商品?',function(data){
			if(data){
				toPrompt('更新提示','更新出库信息成功');
				$("#TexgUearchBox").dialog('close');
				// 调用该方法刷新当前页
				$("#TexgUegOperator").datagrid('load');						
			}
		});
	}
}

// 查看商品详情界面
function texSeeGoodsDetail(){
	var rows=$("#TexGoodsTable").datagrid('getSelections');
	if(rows.length==1){
		temGetGoodsRowNewsFn(rows);
		$("#texGoodsDetails").dialog('open');
	}else if(rows.length==0){
		$.messager.alert('查看详情提示','请选择需要查看的记录','info');
	}else if(rows.length>1){
		$.messager.alert('查看详情提示','每次只能查看一条信息,请勿多选','info');
	}
	
}

// 将选中的信息传导详细界面
function temGetGoodsRowNewsFn(rows){
	  // 商品名称
	  $("#temDetailGoodsName").text(rows[0].goodsName);	
	  $("#temDetailGoodsName").attr('title',rows[0].goodsName);
	  // 出库数量
	  $("#temDetailExprotSum").text("1 件");
	  // 出售价格
	  $("#temDetailSellPrice").text(rows[0].price+"￥");
	  // 商品型号
	  $("#temDetailShape").text(rows[0].gdsModel);
	  // 商品规格
	  $("#temDetailSpecification").text(rows[0].gdsSpecification);
	  $("#temDetailSpecification").attr('title',rows[0].gdsSpecification);
	  // 商品类别
	  $("#temDetailGoodsType").text(rows[0].pType);
	  // 商品器型
	  $("#temDetailModel").text(rows[0].shape);
	  // 供应商
	  $("#temDetailCompany").text(rows[0].companyName);
	  $("#temDetailCompany").attr('title',rows[0].companyName);
	  // 是否手工
	  if(rows[0].isManual==0){
		 $("#temDetailIsManual").text("是");
		 $("#temDetailIsManual").css('color','green');
	  }else{
		 $("#temDetailIsManual").text("否");
		$("#temDetailIsManual").css('color','red');
	  }
	  // 加工内容
	  $("#temDetailContent").text(rows[0].ProcessName);
	  // 技术人员
	  $("#temDetailGraftMan").text(rows[0].CraftsmanName);
	  // 所出仓库
	  $("#temDetailExportWarehouse").text(rows[0].spdWarehouseName);
	  $("#temDetailExportWarehouse").attr('title',rows[0].spdWarehouseName);
	  // 监制人
	  $("#temDetailMonitor").text(rows[0].monitorName);
	  // 商品成本
	  $("#temDetailGoodsCost").text(rows[0].cost+"￥");
	  // 商品二维码
	  $("#texUpdateGoodQrcodeWord").text("商品二维码");
	  $("#texUpdateGoodQrcodeWord").css({color:"#a1cae1",cursor:"pointer"});
	  $("#detailPageqcodeImg").attr('src',rows[0].qrcode);
	  // 出库时间
	  $("#temDetailExportTime").text(rows[0].egExportDate);
	  // 出库备注
	  $("#texSearchExportMeno").text(rows[0].exportMeno);
	  // 商品备注
	  $("#temDetailMeno").text(rows[0].productMeno);
	  $("#temDetailMeno").attr('title',rows[0].productMeno);
	  
	  // 经办人信息
	  $("#temDetailManName").text(rows[0].egOperatorName);
	  // 部门
	  $("#temDetailManDepartment").text(rows[0].department);
	  // 电话
	  $("#temDetailManPhone").text(rows[0].empTelphone);
	  // 邮箱
	  $("#temDetailManEmail").text(rows[0].empEmail);
	  // 邮政编码
	  $("#temDetailManCode").text(rows[0].empPostCode);
	  // 角色
	  $("#temDetailManRole").text(rows[0].role);
	  // 地址
	  $("#temDetailManAddress").text(rows[0].empAddress);
}

/* 鼠标移到商品二维码时效果 */
$("#detailPageqcodeImg").hover(
		  function () {
		    $(this).css({
			    width: "135px",
			    height: "135px",
		    });
		  },
		  function () {
			  $(this).css({
				    width: "119px",
				    height: "119px",
				    top: "88px",
				    right:"53px"
				   });
		  }
);


//更新事件
$("#texgUpdateMenu").click(function (){			
	texOpenTsemiDialogFn();
});


// 删除事件
$("#texgDeletMenu").click(function (){
	TexdeletTimRowsFn();
});

// 查看事件
$("#texgSeeMenu").click(function (){
	texSeeGoodsDetail();
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