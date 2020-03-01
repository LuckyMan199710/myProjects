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
	
	$("#ratioTable").datagrid({
		fit : true,
		fitColumns:true,
		url:'quotiety.json',
		rownumbers:true,
		striped:true,
		border:false,
		idField:"quotietylId",
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		pagination:true,
		pageSize:3,
		toolbar:'#ratioForm',
		pageList:[3,6,9,12],
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		columns : [[
		            	{field:"quotietylId",title:"编号",align:"center",width:100,checkbox:true},
		            	{field:"quotietyValue",title:"相关系数",align:"center",width:120},
		            ]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
		    			e.preventDefault();
		    			$("#ratioRightMenu").menu('show',{
		    				left:e.pageX,
		    				top:e.pageY,
		    			});
		    			$(this).datagrid("clearChecked");
		    			$(this).datagrid("clearSelections");
		    			$(this).datagrid('unselectAll');
		    			$(this).datagrid('selectRow',rowIndex);
		    	}
	});
	
	/* 更新界面 */
	$("#ratioUpdatePage").dialog({
		width:430,
		height:180,
		title:'更新仓库类型界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'更新',
			iconCls:'icon-edit',
			handler:function(){
				ratioConfirmUpdateFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#ratioUpdatePage").dialog('close');
			}
		}]
	});
	
	/* 查询界面 */
	$("#ratioSearchPage").dialog({
		width:740,
		height:180,
		title:'查询界面',
		iconCls:'icon-search',
		closed:true,
		modal: true,
		buttons:[{
			text:'查询',
			iconCls:'icon-edit',
			handler:function(){
				ratioSearchRowPageFn();
			}
		},{
			text:'取消',
			iconCls:'icon-undo',
			handler:function(){
				$("#ratioSearchPage").dialog('close');
			}
		},{
			text:'清空',
			iconCls:'icon-cancel',
			handler:function(){
				$("#ratioSearchPage input").val("");
			}
		}]
	});
	
	// 调用初始化方法
	ratioInitFn();
	
});

/* 右键事件 */
$("#ratioRighUpdate").click(function(){			   
	ratioUpdatePageFn();
});

$("#ratioRighDelet").click(function(){			    
	ratioDeleteRowFn();
});

/**
 * 初始化控件方法
 * 
 */
function ratioInitFn(){
	/** 仓库类别界面的脚本 */
	$("#ratioDeleteBT").linkbutton({					//批量删除
		plain:true,
		iconCls:'icon-cancel',
		onClick : function(){
			ratioDeleteRowFn();
		}
	});

	$("#ratioSearchBT").linkbutton({					//查找
		plain:true,
		iconCls:'icon-search',
		onClick : function(){
			$("#ratioSearchPage").dialog('open');
		}
	});
	
	$("#ratioUpdateBT").linkbutton({					//更新
		plain:true,
		iconCls:'icon-edit',
		onClick : function(){
			ratioUpdatePageFn();
		}
	});

	$("#ratioBackBT").linkbutton({						//返回
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			if($("#center").tabs('exists',"首页")){
				$("#center").tabs('select',"首页");
			}
		}
	});
	
	// 相关系数
	$("#quotietyValue,#ratioUquotietyValue").validatebox({
		required : true,
		missingMessage :'请输入相关系数'
	});
	
}

// 添加记录的方法
$("#ratioAddBt").click (
		function ratioAddRowFn(){
			if(!$("#quotietyValue").validatebox('isValid')){
				$("#quotietyValue").focus();
			}else{
				// 刷新当前页面
				$("#ratioTable").datagrid('load');				
				toPrompt('添加提示','添加系数成功');
			}
		}
)

// 删除记录的方法
function ratioDeleteRowFn(){
	var rows=$("#ratioTable").datagrid('getSelections');
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
				
				
				$("#ratioTable").datagrid('load');							//调用该方法刷新当前页
				$("#ratioTable").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
			}
		});
		
	}else{
		$.messager.alert("温馨提示","请选中需要删除的列",'warning');
	}
}

/* 仓库类型的打开更新窗口方法 */
function ratioUpdatePageFn(){
	var rows=$("#ratioTable").datagrid('getSelections');
	if(rows.length==1){
		ratioGetChooseRowValue(rows);
		$("#ratioUpdatePage").dialog('open');
	}else if(rows.length>1){
		$.messager.alert('温馨提示','每次只能对一条数据进行修改,请勿多选','info');
	}else if(rows.length==0){
		$.messager.alert('温馨提示','请选择你要修改的数据','warning');
	}
}

/* 将需要更新的行的信息传递到更新界面 */
function ratioGetChooseRowValue(rows){
	$("#ratioUquotietyValue").val(rows[0].quotietyValue);
}

/* 点击更新界面确认更新的方法 */
function ratioConfirmUpdateFn(){
	if(!$("#ratioUquotietyValue").validatebox('isValid')){
		$("#ratioUquotietyValue").focus();
	}else{
		$.messager.confirm('修改提示','确定修改数据？',function(data){
			if(data){
				$("#ratioTable").datagrid('load');				//刷新当前页面
				$("#ratioUpdatePage").dialog('close');			//关闭更新界面
				toPrompt('更新信息提示','更新系数成功');
			}
		});
	}
}

/* 查询方法 */
function ratioSearchRowPageFn(){
	toPrompt("查询提示","查询信息成功");
	$("#ratioSearchPage").dialog('close');
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