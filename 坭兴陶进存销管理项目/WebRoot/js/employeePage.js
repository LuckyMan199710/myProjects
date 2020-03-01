$(function() {
	
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
	 * 重写验证手机号码 的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
	    isRightPhone: {    
	        validator: function(value, param){    
	        	 var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
	        	 if(value.length!=11){
	        		 return false;
	        	 }else{
	        		 return myreg.test(value);
	        	 }
	        },    
	        message: '请输入有效的手机号码'   
	    }    
	});  
	
	/**
	 * 重写验证邮政编码的validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {    
	    isRightPostCode: {    
	        validator: function(value, param){    
	        	var isPhone = /^[0-9][0-9]{5}$/;
	        		 return isPhone.test(value);
	        },    
	        message: '请输入有效的邮政编码如:537211'   
	    }    
	}); 
	
	
	//重写控件进行验证添加的用户的账号是否已经使用
	$.extend($.fn.validatebox.defaults.rules, {    
	    isSave: {    
	        validator: function(value, param){
	        	if((value.length<8)||(value.length>20)){
	        		$.fn.validatebox.defaults.rules.isSave.message = "输入的编号必须介于8到20为之间";
	        		return false;
	        	}
	        		var result = $.ajax({
	                         url: param[0],								//远程的访问的地址
	                         data: param[1]+"="+value,					//组合name的时行形成如:username:1234
	                         async: false,
	                         type: "post"
	                     }).responseText;
	                     if(result=="false"){
	                     	$.fn.validatebox.defaults.rules.isSave.message = "该编号已经存在,请重新输入";
	                     	return false;
	                     }else if(result=="true"){
	                     	return true;
	                     }
	        },    
	        message: '输入账号可以使用'   
	    }    
	}); 
	
	
	//查询界面
		$("#search").dialog({
			title : '查询',
			height: 230,
			iconCls: 'icon-search',
			width:570,
			closed : true,
			modal:true,
			buttons:[
				{
					text : '查询',
					iconCls : 'icon-search',
					handler : function(){
						alert('查询成功');
						$("#search").dialog('close');								//查询执行的操作
					}
				},
				{
					text : '取消',
					iconCls : 'icon-undo',
					handler : function(){
						$("#search").dialog('close');
					}
				},{
					text:'清空',
					iconCls:'icon-cancel',
					handler:function(){
						$("#searchOutBox input").val("");
					}
				}
			]
		});
	
	
	
			/**
			 * 设置员工表格属性
			 */
			$("#employeeNews").datagrid({
				url : "column.json",
				fit:true,
				fitColumns:true,
				border:false,
				method: "POST",
				pagination:true,
				striped:true,
				pageSize:10,
				pageList:[10,20,30,40],
				nowrap:false,
				sortName:'employeeId',
				view: myview,
		        emptyMsg: '没有查询到相应的记录',
				sortOrder:'asc',
				scrollbarSize:12,
				rownumbers:true,
				remoteSort:false, //定义是否从服务端进行排序
				rowStyler: function(index,row){
					if(index%2!=0){
						return 'background:#e4ebed'   //隔行换色
					}
				},
				toolbar :'#nav',					//操作控件
			
					//fieId的值对应的是字符串传过来的值name
				columns:[[ 
					{field:'empId',title:'账号',align:'center',width:100,checkbox: true,},
		        	{field:'employeeId',title:'账号',align:'center',width:100,sortable:true},
		        	{field:'empName',title:'姓名',align:'center',width:100,sortable:true},    
		        	{field:'department',title:'部门',align:'center',width:100,sortable:true},  
		        	{field:'role',title:'身份',align:'center',width:100},
		        	{field:'empTelphone',title:'电话',align:'center',width:100},
		        	{field:'empEmail',title:'邮箱',align:'center',width:100}, 
		        	{field:'empPostCode',title:'邮码',align:'center',width:100}, 
		        	{field:'aStatus',title:'状态',align:'center',width:100,
		        		formatter: function(value,row,index){
		    				if (value==0){
		    					return "失效";
		    				} else {
		    					return "激活";
		    				}
		    			},
		    			styler: function(value,row,index){
		    				if (value==0){
		    					return 'color:red;';
		    				}else if(value==1){
		    					return 'color:green;';
		    				}
		    			}

		        	}, 
		        	{field:'empAddress',title:'地址',align:'center',width:150}, 
    					]],
    			onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
    				e.preventDefault();
    				$("#menu").menu('show',{
    					left:e.pageX,
    					top:e.pageY,
    				});
    				$(this).datagrid("clearChecked");
    				$(this).datagrid("clearSelections");
    				$(this).datagrid('unselectAll');
    				$(this).datagrid('selectRow',rowIndex);
    			}
				
			});
		
			
		});
	
		//设置导航按钮的事件
	$("#addEmployee").click(function(){					//添加
		isAdd();
	});
	
	$("#deleteEmployees").click(function(){				//删除
		removeRow();
	});
	
	$("#updateEmployee").click(function(){				//修改				
		openUpdateBox();
	});
	
	$("#searchEmployee").click(function(){				//查询
		$("#search").dialog('open');
	});
	
	$("#clearEmployee").click(function(){				//清除
		$("#emploueeNewsOutBox input").val("");
	});
	
	$("#ecallback").click(function(){					//返回
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}
	});
	
	
	//设置操作按钮的样式
	$("#addEmployee").linkbutton({				//添加员工
		plain:true,
		iconCls:'icon-add'
	});
	$("#deleteEmployees").linkbutton({			//删除员工
		plain:true,
		iconCls:'icon-cancel'
	});
	$("#updateEmployee").linkbutton({			//更新员工
		plain:true,
		iconCls:'icon-edit'
	});
	$("#searchEmployee").linkbutton({			//查询员工
		plain:true,
		iconCls:'icon-search'
	});
	$("#clearEmployee").linkbutton({			  //清除
		plain:true,
		iconCls:'icon-cancel'
	});
	
	$("#ecallback").linkbutton({			     //返回
		plain:true,
		iconCls:'icon-undo'
	});


	//验证是否符合添加条件
	function isAdd(){
		// 获得当前文本框中的值(这个是隐藏起来专门存放至的值的输入框)
		
		if($("input[name='department']").val()==""){
			$.messager.show({
				title:'添加消息',
				msg:'请选择员工部门',
				timeout:1500,
				showType:'slide',
				height:100
			});
		}
		else if(!$("#DIV_toolbar").find($("input[name='employeeId']")).validatebox('isValid')){			//判断是否输入编号
			$("#DIV_toolbar").find($("input[name='employeeId']")).focus();
		}else if(!$("#DIV_toolbar").find($("input[name='empName']")).validatebox('isValid')){  //判断是否输入姓名
			$("#DIV_toolbar").find($("input[name='empName']")).focus();
		}else if($("#DIV_toolbar").find($("input[name='role']")).val()==""){  //判断是否选择身份
			$.messager.show({
				title:'添加消息',
				msg:'请选择用户身份',
				timeout:1500,
				showType:'slide',
				height:105
			});
		}else if(!$("#DIV_toolbar").find($("input[name='empTelphone']")).validatebox('isValid')){ //判断是否输入电话
			$("#DIV_toolbar").find($("input[name='empTelphone']")).focus();
		}else if(!$("#DIV_toolbar").find($("input[name='empEmail']")).validatebox('isValid')){  //判断是否输入邮箱
			$("#DIV_toolbar").find($("input[name='empEmail']")).focus();
		}else if(!$("#DIV_toolbar").find($("input[name='empPostCode']")).validatebox('isValid')){   //判断是否输入邮编
			$("#DIV_toolbar").find($("input[name='empPostCode']")).focus();
		}else if(!$("#DIV_toolbar").find($("input[name='empAddress']")).validatebox('isValid')){	 //判断是否输入地址
			$("#DIV_toolbar").find($("input[name='empAddress']")).focus();
		}else{
			//全部符合条件则进行员工信息添加--在当前页的最后一行添加
			$("#employeeNews").datagrid('appendRow',{});
			$("#emploueeNewsOutBox input").val("");
			$.messager.show({
				title:'添加消息',
				msg:'添加用户成功',
				timeout:1500,
				showType:'slide',
				height:105
			});
		}
	}
	
		
		
	//设置添加员工信息的限制条件	
	
	//编号
	$("input[name='employeeId'],input[name='updateEmployeeId']").validatebox({
		 required: true,
		 missingMessage:"请输入员工编号",
		 validType : 'isSave["demo","username"]',							//demo表示提交验证的路径,username表示对应的键,值是输入在文本框的值
		 delay:1000,															//delay表示输入文本后多少时间向后台验证是否存在该编号
	});
	
	
	//姓名
	$("input[name='empName'],input[name='updateEmployeeName']").validatebox({
		 required: true,
		 validType:"length[5,20]",
		 missingMessage:"请输入员工姓名"    
	});
	
	// 添加界面部门
	$("#department").combotree({
			url : "treelist.json",
			animate : true,
			editable : true,
			panelHeight:186,
			onBeforeSelect:function(node){
				//判断node节点下是不是有childred？ 有：点击的是一个父级菜单		
				if(node.children){
				//先封装成一个tree，然后使用toggle(点击切换)				
				var t = $("#department").combotree('tree');
				t.tree('toggle',node.target);
				t.tree("unselect");
				return;		
			}
		},
	});
	
	// 查询界面部门
	$("#searchDepartment").combotree({
			url : "treelist.json",
			animate : true,
			editable : true,
			panelHeight:186,
			onBeforeSelect:function(node){
				//判断node节点下是不是有childred？ 有：点击的是一个父级菜单		
				if(node.children){
				//先封装成一个tree，然后使用toggle(点击切换)				
				var t = $("#searchDepartment").combotree('tree');
				t.tree('toggle',node.target);
				t.tree("unselect");
				return;		
			}
		},
	});
	
	// 更新界面部门
	$('#updateEmployeeDepartment').combotree({
		url : "treelist.json",
		animate : true,
		editable : true,
		panelHeight:186,
		onBeforeSelect:function(node){
			//判断node节点下是不是有childred？ 有：点击的是一个父级菜单		
			if(node.children){
			//先封装成一个tree，然后使用toggle(点击切换)				
			var t = $("#updateEmployeeDepartment").combotree('tree');
			t.tree('toggle',node.target);
			t.tree("unselect");
			return;		
		}
	},
});

	//身份
	$("input[name='role'],input[name='updateEmployeeIdentity']").combogrid({
		panelWidth:450,  
		panelHeight:200,
	    idField:'id',
	    fitColumns:true,    
	    textField:'name',   
	   	scrollbarSize:12,
		pagination : true,//是否分页 
	    pageSize: 4,//每页显示的记录条数，默认为10 
	    pageList: [4,8],//可以设置每页记录条数的列表
	    rownumbers:true,//序号 
//	    url:'department.json', 
	   	nowrap:false, 
	   	mode:"remote",
	    columns:[[    
	        {field:'id',title:'编号',width:150,align:'center'},    
	        {field:'identity',title:'身份名称',width:200,align:'center'}      
	    ]],  
	    // 该数据是伪数据(当制定url的时候回就可删除了)
		data: [{
			id: '1504405418',
			identity: 'abc'
		},{
			id: '1504405418',
			identity: 'laovan'
		},{
			id: '1504405418',
			identity: 'dongshizhang'
		},{
			id: '1504405418',
			identity: '普通员工'
		}]
	
	});
	
	//状态
		$("input[name='updateEmployeeStatus']").combobox({
			valueField: 'value',
			textField: 'label',
			panelHeight:70,
			editable:false,
			data: [{
				label: '激活',
				value: '1'
			},{
				label: '失效',
				value: '0'
			}]
		
		});
	
	//电话号码
	$("input[name='empTelphone'],input[name='updateEmployeePhone']").validatebox({
		 required: true,
		 validType:'isRightPhone[11]',
		 missingMessage:"请输入员工电话号码"
	});
	
	//邮箱
	$("input[name='empEmail'],input[name='updateEmployeeEmail']").validatebox({
		 required: true,
		 validType:['email','length[5,30]'],
		 missingMessage:"请输入员工邮箱地址"
	});
	
	//邮编
	$("input[name='empPostCode'],input[name='updateEmployeeCode']").validatebox({
		 validType:"isRightPostCode[6]",
		 invalidMessage:"请输入有效的邮政编码如:537211"
	});
	
	//密码
		$("input[name='updateEmployeePW']").validatebox({
			 required: true,
			 validType:[length[5,20]],
			 missingMessage:"请输入员工密码"
		});
	
	
	//地址
	$("input[name='empAddress'],input[name='updateEmployeeAddr']").validatebox({
		 required: true,
		 missingMessage:"请输入员工地址"
	});
	
	

	//更新界面
	$("#updateBox").dialog({
		title : '修改界面',
		closed : true,
		width:1000,
		height: 255,
		modal:true,
		iconCls:'icon-edit',
		buttons : [
		           {
		        	   text : '修改',
		        	   iconCls : 'icon-ok',
		        	   handler : function (){
		        		  var a=isUpdate();										//判断修改是否符合条件
		        		  if(a){
		        			   updateRow(); 
		        		  }
		        	   },
		           },
		           {
		        	   text : '取消',
		        	   iconCls : 'icon-cancel',
		        	   handler : function(){
		        		   $('#updateBox').dialog('close');						//关闭修改窗体
		        	   },
		           },
		          ],
	});
	
	
	
	
	//更新的方法
	function  updateRow(){
			 $.messager.confirm('提示','确认修改?',function(data){
			   if(data){
				   														//获得所有选中的行
				   var rows=$("#employeeNews").datagrid('getSelections');
				   
				   														//获得当前选中行的索引
				   var rowIndex = rows[0].id;
				   
				   														//进行数据交互
				   
				   
				   $("#employeeNews").datagrid('load');					//调用该方法刷新当前页
				   $.messager.show({
					   title : '提示',
					   msg : '用来提示是否修改成功',
					   timeout : '1500',
					   showType:'slide',
					   height : 105,
				   });
				   $('#updateBox').dialog('close');	
			   }
		   });
		
	}
	
	//验证是否符合添加条件
		function isUpdate(){
			if(!$("input[name='updateEmployeeId']").validatebox('isValid')){			//判断是否输入编号
				$("input[name='updateEmployeeId']").focus();
				return false;
			}else if(!$("input[name='updateEmployeePW']").validatebox('isValid')){  //判断是否输入姓名
				$("input[name='updateEmployeePW']").focus();
				return false;
			}else if(!$("input[name='updateEmployeePW']").validatebox('isValid')){  //判断是否输入姓名
				$("input[name='updateEmployeePW']").focus();
				return false;
			}else if($("input[name='updateEmployeeIdentity']").val()==""){  //判断是否选择身份
				$.messager.show({
					title:'添加消息',
					msg:'请选择用户身份',
					timeout:1500,
					showType:'slide',
					height:105
				});
				return false;
			}else if(!$("input[name='updateEmployeePhone']").validatebox('isValid')){ //判断是否输入电话
				$("input[name='updateEmployeePhone']").focus();
				return false;
			}else if(!$("input[name='updateEmployeeEmail']").validatebox('isValid')){  //判断是否输入邮箱
				$("input[name='updateEmployeeEmail']").focus();
				return false;
			}else if(!$("input[name='updateEmployeeCode']").validatebox('isValid')){   //判断是否输入邮编
				$("input[name='updateEmployeeCode']").focus();
				return false;
			}else if($("input[name='updateEmployeeStatus']").val()==""){  //判断是否选择身份
				$.messager.show({
					title:'添加消息',
					msg:'请选择用户身份',
					timeout:1500,
					showType:'slide',
					height:105
				});
				return false;
			}else if(!$("input[name='updateEmployeeAddr']").validatebox('isValid')){	 //判断是否输入地址
				$("input[name='updateEmployeeAddr']").focus();
				return false;
			}else{
				return true;
			}
		}
	
	
	
	
	//打开更新窗口
	function openUpdateBox(){
		 var rows = $("#employeeNews").datagrid('getSelections');
		 if(rows.length==1){
			 $("#updateBox").dialog('open');
			 getUpdateValue();
		 }else{
			 $.messager.alert('更新提示','修改信息必须或只能选择一行!','warning');
		 }
	}
	
	//点击修改时获取当前选定的行的值
	function getUpdateValue(){
		 var rows=$("#employeeNews").datagrid('getSelections');
		 $("input[name='updateEmployeeId']").val(rows[0].employeeId);
		 $("input[name='updateEmployeePW']").val("******");
		 $("input[name='updateEmployeeName']").val(rows[0].empName);
		 $("input[name='updateEmployeePhone']").val(rows[0].empTelphone);
		 $("input[name='updateEmployeeEmail']").val(rows[0].empEmail);
		 $("input[name='updateEmployeeCode']").val(rows[0].empPostCode);
		 $("input[name='updateEmployeeAddr']").val(rows[0].empAddress);
		 $("#updateEmployeeIdentity").combobox('setValue',rows[0].role);
		 $("#updateEmployeeIdentity").combobox('setText',rows[0].role);
		 $("#updateEmployeeStatus").combobox('setValue',rows[0].aStatus);
		 if(rows[0].status=="0"){
			 $("#updateEmployeeStatus").combobox('setText','失效');
		 }else if(rows[0].status=="1"){
			 $("#updateEmployeeStatus").combobox('setText',"激活");
		 }
		 $("#updateEmployeeDepartment").combotree('setValue',rows[0].departmentID);
		 $("#updateEmployeeDepartment").combotree('setText',rows[0].department);

	}
	
	// 点击更新界面密码框则密码清零
	$("input[name='updateEmployeePW']").click(function(){
		$("input[name='updateEmployeePW']").val("");
	});
	
	
	
	
	/**
	 * 删除现在选定的单行
	 */
	function removeNowRow(){
		var rows=$("#employeeNews").datagrid('getSelections');
		if(rows.length==1){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					var rowIndex = rows[0].id;									//获得当前选中行的索引
					
					$("#employeeNews").datagrid('load');						//调用该方法刷新当前页
					$("#employeeNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
					
					$.messager.show({											//根据返回结果执行以下提示
						title : '删除提示',
						msg : '删除是否成功',
						timeout : '1500',
						showType:'slide',
						height : 105,
					});
					
				}
			});
		}else if(rows.length>1){
			$.messager.alert('提示','只能删除当前行,请勿选择多行！','warning');
		}else{
			$.messager.alert('提示','请选择需要删除的数据！','warning');
		}
	}
	
	/**
	 * 删除所有选定的行
	 */
	function removeRow(){
		var rows=$("#employeeNews").datagrid('getSelections');
		if(rows.length>0){
			$.messager.confirm('删除提示','确定删除选定的数据?',function(data){
				if(data){
					var ids = [];												//用来接收每行的id
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);									//将选定的行的id加入到数组中
					}
																				//获得的数据是一个数组所在转换成用逗号隔开的字符串
					var transID=ids.join(',');
																				//进行后台数据交互
					
					
					$("#employeeNews").datagrid('load');						//调用该方法刷新当前页
					$("#employeeNews").datagrid('unselectAll');					//删除完成后取消所有选定,防止有不明问题出现	
					
					$.messager.show({											//根据返回结果执行以下提示
						title : '删除提示',
						msg : '删除是否成功',
						timeout : '1500',
						showType:'slide',
						height : 105,
					});
					
				}
			});
		}else{
			$.messager.alert('提示','请选择需要删除的数据！','warning');
		}
	}
	
	
	/**
	 * 点击右键出现菜单的执行更新的事件
	 */
		$("#updateEmpoyee").click(function(){
			openUpdateBox();
		});
	
	/**
	 * 点击右键出现菜单执行删除事件
	 */
		$("#deleteEmployee").click(function(){
			removeNowRow();
		});
	
	
	
	