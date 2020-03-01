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
	 * 重写验证座机电话的validatebox
	 */
	
	$.extend($.fn.validatebox.defaults.rules, {    
	    isFixPhone: {    
	        validator: function(value, param){    
	        	var isPhone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
	        		 return isPhone.test(value);
	        },    
	        message: '请输入有效的号码如:012-5201212'   
	    }    
	}); 
	
	/**
	 * linkButton按钮初始化
	 */
	$("#spSearchBt").linkbutton({				//查询按钮
		iconCls: 'icon-search',
		 onClick : function(){
			 alert('点击了查询');
		 }
	});
	$("#spClear").linkbutton({					//清除按钮
		iconCls: 'icon-cancel',
		 onClick : function(){
			 $("input[name='spCreditCode']").val("");
			 $("input[name='spName']").val("");
			 $("#shadowDiv input").val("");
		 }
	});
	$("#spMore").linkbutton({					//更多按钮
		 iconCls: 'icon-reload',
	});
	
	$("#spOutput").linkbutton({					//更多按钮
		 iconCls: 'icon-large-smartart',
		 onClick : function(){
			 alert("点击了导出");
		 }
	});
	
	/**
	 * datagrid显示企业信息
	 */
	$('#sDispalyNews').datagrid({
		url : "enterpriseDemo.json",
		fit:true,
		border:false,
		method: "POST",
		pagination:true,
		striped:true,
		pageSize:10,
		pageList:[10,20,30,40],
		nowrap:false,
		view: myview,
        emptyMsg: '没有查询到相应的记录',
		sortName:'cpyId',
		sortOrder:'asc',
		rownumbers:true,
		remoteSort:false, //定义是否从服务端进行排序
		rowStyler: function(index,row){
			if(index%2!=0){
				return 'background:#e4ebed'   //隔行换色
			}
		},
		toolbar : '#sEnterpriseOutBox',
	
			//fieId的值对应的是字符串传过来的值name
		columns:[[ 
			{field:'cpyId',title:'序号',align:'center',width:50,checkbox: true,},
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
		onRowContextMenu : function(e, rowIndex, rowdata){										//右键显示出现操作菜单
			 e.preventDefault();
			$("#eqSearcheMenu").menu('show',{
				left:e.pageX,
				top:e.pageY,
			});
			$(this).datagrid("clearChecked");
			$(this).datagrid("clearSelections");
			$(this).datagrid('unselectAll');
			$(this).datagrid('selectRow',rowIndex);
		}
	});
	
	/**
	 * 隐藏输入条件文本框
	 */
	$("#shadowDiv").accordion({
		border : false,
		closed : true,
	}).hide();
	
	/**
	 * 更多按钮事件
	 */
	$("#spMore").click(function(){
		$("#shadowDiv").accordion().toggle("2000");
		$("#shadowDiv").accordion('resize');
	});
	spinit();  							//调用限制文本框输入值方法
});

	/**
	 * 限定员工输入文本框的值
	 */

	function spinit(){
		/**
		 * 信用编码
		 */
		$("input[name='spCreditCode']").validatebox({
			 validType:"length[12,18]",
			 missingMessage:"请输入统一社会信用代码"    
		});
		
		/**
		 * 企业名称
		 */
		$("input[name='spName']").validatebox({
			 validType:"length[2,100]",
			 missingMessage:"请输入企业名称"    
		});
		
		/**
		 * 企业电话
		 */
		$("input[name='spTelphone']").validatebox({
			 validType:'isFixPhone[]',
			 missingMessage:"请输入企业电话"   
		});
		
		/**
		 * 开户行
		 */
		$("input[name='spBankOfDeposit']").validatebox({
			 validType:"length[2,100]",
			 missingMessage:"请输入开户行"  
		});
		
		/**
		 * 账号
		 */
		$("input[name='spAccount']").validatebox({
			 validType:"length[12,19]",
			 missingMessage:"请输入账号"  
		});
		
		/**
		 * 业务范围
		 */
		$("input[name='spBusiness']").validatebox({
			 validType:"length[12,100]",
			 missingMessage:"请输入业务范围"  
		});
		
		/**
		 * 注册资本
		 */
		$("input[name='spRegisteredCapital']").numberbox({
			groupSeparator:',',
			prefix:'￥',
			missingMessage:"请输入注册资本" ,
			min:0,
		});
		
		/**
		 * 注册时间
		 */
		$("input[name='spRegisteredTime'],input[name='endspRegisteredTime']").datetimebox({
			editable:false
		});
		
		/**
		 * 法定代表人
		 */
		$("input[name='spLegalRepresentative']").validatebox({
			missingMessage:"请输入法定代表人"  
		});
		
		/**
		 * 联系人电话
		 */
		$("input[name='spContactTehpone']").validatebox({
			 validType:'isRightPhone[11]',
			 missingMessage:"请输入联系人电话" 
		});
		
		/**
		 * 类型
		 */
		$("input[name='spType']").combobox({
			valueField: 'value',
			textField: 'label',
			panelHeight:70,
			editable:false,
			data: [{
				label: '本企业',
				value: '0'
			},{
				label: '供货商',
				value: '1'
			}]
		});
		
		/**
		 * 企业地址
		 */
		$("input[name='spAddress']").validatebox({
			missingMessage:"请输入企业地址",
			validType:'length[1,200]'
		});
		
		
	}
	
	/** 右键进行增删查 */
	
	/**
	 * 打开更新窗口
	 * */
		function searchOpenEnterPriseUpdateBox(){
			 var rows = $("#sDispalyNews").datagrid('getSelections');
			 if(rows.length==1){
				 $("#updateEnterpriseBox").dialog('open');
				 getUpdateRowValue(rows);
			 }else{
				 $.messager.alert('更新提示','修改信息必须或只能选择一行!','warning');
			 }
		}
		
		
		
		/**
		 * 点击右键出现菜单的执行更新的事件
		 */
			$("#eqSupdateEnterprise").click(function(){
				searchOpenEnterPriseUpdateBox();
			});
		
		/**
		 * 点击右键出现菜单执行删除事件
		 */
			$("#eqSdeleteEnterprise").click(function(){
				var rows=$("#sDispalyNews").datagrid('getSelections')
				epRemoveNowRow(rows);

			});
		
		/**
		   * 点击右键出现菜单的查看详情的事件
		 */
		$("#eqSdetailEnterprise").click(function(){
			spWatchEnterpriseNews();
		   });
	
		/**
		 * datagrid中查看企业详细信息的事件,sp--->searchPage
		 */
		function spWatchEnterpriseNews(){
			 var rows = $("#sDispalyNews").datagrid('getSelections');
			if(rows.length==1){
				getEnterpriseText(rows);
				$("#enterpriseDetailNewBox").dialog('open');
			}else if(rows.length==0){
				$.messager.alert('温馨提示','请选择需要查看的企业信息','warning');
			}else if(rows.length>1){
				$.messager.alert('温馨提示','每次只能查看一个企业的信息','warning');
			}
			
		}
	



