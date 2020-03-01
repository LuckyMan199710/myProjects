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
	 * datagrid显示企业信息
	 */
	$('#TStoreDisTable').datagrid({
		url : "TStorePage.json",
		fit:true,
		fitColumns:true,
		border:false,
		scrollbarSize:12,
		method: "POST",
		pagination:true,
		striped:true,
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		sortName:'storeId',
		sortOrder:'asc',
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		rownumbers:true,
		showFooter : true,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar : '#TStoreOutBox',
	
			//fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'storeId',title:'序号',align:'center',width:50,hidden: true,},
        	{field:'storeTypeName',title:'库存类型',align:'center',width:135,sortable:true},
        	{field:'warehouseName',title:'仓库名称',align:'center',width:220},
        	{field:'idOfStuffName',title:'库存内容名称',align:'center',width:220},      
        	{field:'storeAmout',title:'库存量',align:'center',width:220},
        	{field:'sumAmoutPrice',title:'总价',align:'center',width:220},
        	{field:'updatetDate',title:'更新时间',align:'center',width:200}
				]],
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			e.preventDefault();
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$(this).datagrid('unselectAll');
			$(this).datagrid('selectRow',rowIndex);
		}
	});
	TStoreInit();
});

/**
 * 初始化控件
 * */
function TStoreInit(){
	/**
	 * 隐藏输入条件文本框
	 */
	$("#TSoreShadow").accordion({
		border : false,
		closed : true,
	}).hide();
	
	//查询按钮
	$("#TStoreSeach").linkbutton({				
		 iconCls: 'icon-search',
		 onClick : function(){
			 alert('点击了查询');
		 }
	});
	//清除按钮
	$("#TStoreClear").linkbutton({					
		iconCls: 'icon-cancel',
		 onClick : function(){
			 $("#TSoreShadow input").val("");
			 $("#idOfStuff,#wareHouseId").combogrid('setValue','');
			 $("#idOfStuff,#wareHouseId").combogrid('setText','');
		 }
	});
	//更多按钮
	$("#TStoreMore").linkbutton({					
		 iconCls: 'icon-reload',
		 onClick : function(){
			$("#TSoreShadow").accordion().toggle("2000");
			$("#TSoreShadow").accordion('resize');
		 }
	});
	//导出按钮
	$("#TStoreOutput").linkbutton({					
		 iconCls: 'icon-large-smartart',
		 onClick : function(){
			 alert("点击了导出");
		 }
	});
	
	//导出按钮
	$("#TStoreBack").linkbutton({					
		 iconCls: 'icon-undo',
		 onClick : function(){
				if($("#center").tabs('exists',"首页")){
					$("#center").tabs('select',"首页");
				}
		 }
	});
	
	//设置默认隐藏的文本框
	$("#TSoreShadow").hide();
	
	//库存类型
	$("#storeType").combobox({
		//url:'指向查询数据的地址'(此处的data只是做临时数据,当有url执行的json数据时,可以删除)
		valueField: 'value',
		textField: 'label',
		editable:false,
		panelHeight : 'auto',
		data: [{
			label: '材料入库',
			value: '1'
		},{
			label: '半成品入库',
			value: '2'
		},{
			label: '成品入库',
			value: '3'
		}],
		onChange : function(oldValue,newValue){				//给入仓类型绑定值变换事件来判断入库的是:材料或半成品或成品从而形成相应的编号
			createTStroeId(this,oldValue);
		},
		onLoadSuccess :  function(){						//默认初始化时选择材料入库
			$("#storeType").combobox('setValue','1');
			$("#storeType").combobox('setText','材料入库');
		}
	});
	
	// 所出仓库
	$("#wareHouseId").combogrid({
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
	
	//日期控件初始化
	$('#updatetDateStart,#updatetDateEnd').datetimebox({    
	    showSeconds: true ,
	    editable:false
	});
	
}

//根据选择的类型生成对应的编号
function createTStroeId(user,value){
	var a=$(user).combobox('getData');	//获取combobox列表的所有的值
	$(a).each(function(i){				//循环输出下拉列表中的值
		var l=a[i].value;
		if(l==value){
			chooseTStoreID();
		}
	});
	
}

//根据用户选择的类型查找到相应仓库的信息
function chooseTStoreID(){
	$("#idOfStuff").combogrid({
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
					{field:"mtlName",title:"名称",align:"center",width:200},
					{field:"mtlSpecification",title:"规格",align:"center",width:220,
						formatter : function(val,row){if (val){return val} else {return "暂无";}}
					},
					{field:"mtlUnit",title:"单位",align:"center",width:250},
		    ]],
	});
}
