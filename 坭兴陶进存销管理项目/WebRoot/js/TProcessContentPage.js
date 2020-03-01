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
	$("#tppDisTable").datagrid({
		fitColumns:true,
		url:'TProcessContentPage.json',
		rownumbers:true,
		fit:true,
		striped:true,
		scrollbarSize:12,
		idField:"processTypeId",
		pagination:true,
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
		toolbar:'#tppNavForm',
		columns : [[
		            	{field:"processTypeId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:'processTypePic',title:'图片',align:'center',width:35,
		    				formatter: function(value,row,index){
		    					if (value!=""){
		    						return "<img style='width:24px;height:26px;padding-top:5px;position: relative;' src='"+value+"' onmouseover='tppDisPlayImage(this)' onmouseout='tppCancelDisImg(this)'>";
		    					} else {
		    						return "暂无";
		    					}
		    				},
		            	},
		            	{field:"processTypeKey",title:"加工类型",align:"center",width:120,
		            		formatter: function(value,row,index){
		    					if (value!=""){
		    						return value;
		    					} else {
		    						return "暂无";
		    					}
		    				},
		            	},
		            	{field:"processStyleName",title:"加工风格",align:"center",width:120,
		            		formatter: function(value,row,index){
		    					if (value!=""){
		    						return value;
		    					} else {
		    						return "暂无";
		    					}
		    				},
		            	},
		            	{field:"processTypeName",title:"加工内容",align:"center",width:450},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#tppMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
		
	});
	
	/* 更新加工内容信息界面 */
	$("#tppUpdateBox").dialog({
		width:900,
		height:230,
		title:'加工内容信息更新界面',
		iconCls:'icon-edit',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				tppConfirmUpdateFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tppUpdateBox").dialog('close');
			}
		}]
	});
	
	/* 查询界面 */
	$("#tppSearchBox").dialog({
		width:1020,
		height:180,
		title:'查询加工内容信息界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				tppConfirmSearch();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#tppSearchBox").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#tppSearchBox input").val("");
			}
		}]
	});
	
	tppInitFn();		//调用初始化方法
	
});

/* 导航栏和输入控件初始化 */
function tppInitFn(){
	$("#tppAddBT").linkbutton({					   //添加
		plain:true,
		iconCls:'icon-add',
		onClick : function(){
			tppAddRowFn();
		}
	});
	$("#tppDeleteBT").linkbutton({					//删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			tppDeleteRowsFn();
		}
	});
	$("#tppUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			ttpOpenUpdateBoxFn();
		}
	});
	$("#tppSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#tppSearchBox").dialog('open');
		}
	});
	$("#tppClearBT").linkbutton({					//清除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			$("#tppInputPage input").val("");
			$("#tppUploadImgBt").val("上传图片");
		}
	});
	$("#tppCallbackBt").linkbutton({				//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	//内容名称
	$("#processTypeName,#updateProcessTypeName").validatebox({
		required : true,
		missingMessage : '请输入内容名称'
	});
	
	//加工风格
	$("#processStyle,#searchProcessStyle,#updateProcessStyle").combogrid({
		panelHeight:'auto',
	    idField:'TProcessStyleId',
	    fitColumns:true,    
	    textField:'TProcessStyleName',    
	    url:'TProcessStylePage.json', 
	    editable:false,
	   	nowrap:false, 
	   	scrollbarSize:12,
	    columns:[[    
	        {field:'TProcessStyleId',title:'风格编号',width:70,align:'center'},    
	        {field:'TProcessStyleName',title:'风格名称',width:100,align:'center'},
	    ]]    
	});
	
	
	
	
	//加工类型
	$("#processType,#searchProcessType,#updateProcessType").combogrid({
		panelHeight:'auto',
	    idField:'TProcessTypeId',
	    fitColumns:true,    
	    textField:'TProcessTypeName',    
	    url:'TProcessTypePage.json', 
	    editable:false,
	   	nowrap:false, 
	   	scrollbarSize:12,
	    columns:[[    
	        {field:'TProcessTypeId',title:'类型编号',width:70,align:'center'},    
	        {field:'TProcessTypeName',title:'加工名称',width:100,align:'center'},
	    ]]    
	});
	
	
};

// 添加加工内容的方法
function tppAddRowFn(){
	// 判断内容名称是否输入
	if(!$("#processTypeName").validatebox('isValid')){
		$("#processTypeName").focus();
	}else{
		// 清除存储图片的input
		$("#processTypePicBT").val("");
		$("#processTypePicImgPath").val("");
		$("#processTypePic").attr('src','');
		// 刷新当前页面
		$("#tppDisTable").datagrid('load');	
		toPrompt('添加提示','添加信息成功');
	}
}

//删除选中的记录
function tppDeleteRowsFn(){
	var rows=$("#tppDisTable").datagrid('getSelections');
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
				
				
				$("#tppDisTable").datagrid('load');						//调用该方法刷新当前页
				$("#tppDisTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

// 确定查询方法
function tppConfirmSearch(){
	var conttentValue=$("#searchProcessTypeName").val();
	var styleValue=$("#searchProcessStyle").combogrid('getValue');
	var typeValue=$("#searchProcessType").combogrid('getValue');
	toPrompt("查询提示","查询信息成功");
	$("#tppSearchBox").dialog('close');
}

//打开更新窗口方法
function ttpOpenUpdateBoxFn(){
	var rows=$("#tppDisTable").datagrid('getSelections');
	if(rows.length==1){
		ttpGetRowValueFn(rows);								//调用获得选中行的数据的方法
		$("#tppUpdateBox").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

//获得选中需要修改的行的值
function ttpGetRowValueFn(rows){
	$("#updateProcessTypeName").val(rows[0].processTypeName);
	if(rows[0].processStyle!=""){
		$("#updateProcessStyle").combobox('setText',rows[0].processStyle);
		$("#updateProcessStyle").combobox('setText',rows[0].processStyleName);
	}
	if(rows[0].processTyp!=""){
		$("#updateProcessType").combobox('setText',rows[0].processType);
		$("#updateProcessType").combobox('setText',rows[0].processTypeKey);
	}
	if(rows[0].processTypePic!=""){
		$("#updateProcessTypePic").attr('src',rows[0].processTypePic);
		$("#updateProcessTypePic").css('border','0');
	}
}


//点击更新界面中的确定按钮
function tppConfirmUpdateFn(){
	if(!$("#updateProcessTypeName").validatebox('isValid')){
		$("#updateProcessTypeName").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				toPrompt('更新提示','更新信息成功');
				// 刷新当前界面
				$("#tppDisTable").datagrid('load');		
				$("#tppUpdateBox").dialog('close');
			}
		});
	}
}


/* 右键菜单执行的事件 */
$("#tppMUpdateMenu").click(function(){			//更新
	ttpOpenUpdateBoxFn();
});

$("#tppMDeletMenu").click(function(){			//删除
	tppDeleteRowsFn();
});	


//鼠标移动到图片上执行的方法
function tppDisPlayImage(value){
	var imgPath=$(value).attr('src');
	getXandY(value);
	$("#tppImgOutBox").css('display','inline-block')
	$("#tppRowImg").attr('src',imgPath);
}

//  鼠标移走时执行的方法
function tppCancelDisImg(value){
	$("#tppImgOutBox").css('display','none');
}

//  获得当前鼠标的x,y轴的值
function getXandY(l){
     $(l).mousemove(function(e) {
         xx= e.pageX || e.clientX;
         yy = e.pageY || e.clientY;
         $("#tppImgOutBox").css('top',yy-250);
         $("#tppImgOutBox").css('left',xx-130);
     });
};

//添加加工内容界面上传图片
$("#processTypePicBT").click(function(){
	$("#processTypePicBT").val('上传成功');
	// 将返回的地址复制给隐藏的input
	$("#processTypePicImgPath").val('img/a1.jpg');
	// 将图片的值设置给Img的src属性
	$("#processTypePic").attr('src','img/a1.jpg');
});

/**
 * 当上传有二维码时鼠标移动到上传位置将图片显示出来
 */
$("#processTypePicBT").hover(function(){
		if($("#processTypePicImgPath").val()!=""){
			$("#processTypePic").show();
		}
},function(){
		$("#processTypePic").hide('1800');
})


// 更新界面图片上传按钮
$("#tppUpdateImgBt").click(function(){
	alert('点击了更换图片');
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


