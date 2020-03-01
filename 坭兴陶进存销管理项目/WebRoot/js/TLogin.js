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
	
	/**
	 * datagrid显示登录的信息
	 */
	$('#tLoginTable').datagrid({
		url : "TLogin.json",
		fit:true,
		border:false,
		method: "POST",
		pagination:true,
		fitColumns:true,
		striped:true,
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		sortName:'employeeId',
		sortOrder:'asc',
		rownumbers:true,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar : '#tLoginNewsBox',
	
			//fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'employeeId',title:'登录工号',align:'center',width:150,sortable:true},
        	{field:'employeeName',title:'姓名',align:'center',width:150},
        	{field:'loginAddress',title:'IP地址',align:'center',width:150},      
        	{field:'loginTime',title:'登录时间',align:'center',width:150,sortable:true},
        	{field:'updateInfoTime',title:'更新时间',align:'center',width:150,sortable:true},
        	{field:'timeOfLastLogin',title:'最后一次登录时间',align:'center',width:220,sortable:true},
				]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			 e.preventDefault();
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$(this).datagrid('unselectAll');
			$(this).datagrid('selectRow',rowIndex);
		}
	});
	
	
	/**
	 * 隐藏输入条件文本框
	 */
	$("#tLoginShowBox").accordion({
		border : false,
		closed : true,
	}).hide();
	
	/**
	 * 更多按钮事件
	 */
	$("#tLoginMore").click(function(){
		$("#tLoginShowBox").accordion().toggle("2000");
		$("#tLoginShowBox").accordion('resize');
	});
	
	// 调用初始化方法
	tLoginInitFn();
});


/**
 * 初始化组件的方法
 */
function tLoginInitFn(){
	/**
	 * linkButton按钮初始化
	 */
	$("#tLoginSearchBt").linkbutton({				//查询按钮
		iconCls: 'icon-search',
		 onClick : function(){
			 searchTLoginNews();
		 }
	});
	$("#tLoginClear").linkbutton({					//清除按钮
		iconCls: 'icon-cancel',
		 onClick : function(){
			 $("#tLoginNewsBox input").val("");
		 }
	});
	$("#tLoginMore").linkbutton({					//更多按钮
		 iconCls: 'icon-reload',
		 onClick : function(){
			 $("#shadowDiv").accordion().toggle("2000");
			 $("#shadowDiv").accordion('resize');
		 }
	});
	
	$("#tLoginOutput").linkbutton({					//返回按钮
		 iconCls: 'icon-undo',
		 onClick : function(){
			 if($("#center").tabs('exists',"首页")){
					$("#center").tabs('select',"首页");
				}
		 }
	});
	
	// 登录时间
	$("#loginTimeStart,#loginTimeEnd").datetimebox({
		editable:false
	});
	
	// 更新时间
	$("#updateInfoTimeStart,#updateInfoTimeEnd").datetimebox({
		editable:false
	});
}

/**
 * 点击查询的方法
 * */
function searchTLoginNews(){
	toPrompt('查询提示','查询信息成功!');
	$('#tLoginTable').datagrid('load');
}

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