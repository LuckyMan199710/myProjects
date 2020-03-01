$(function(){

	// 左边的下拉列表
	$("#accoudoionBox").accordion({
		height:'auto',
		border:false
	});
		/* 企业模块 */
		$("#navs").tree({
			url:'tree1.json',
			animate:true,
			cascadeCheck:false,
			onlyLeafCheck:true,
			method: "GET",
			border:false,
			dnd:false,
			fit:true,
			onClick : function(node){
				if(node.text){
				if($("#center").tabs('exists',node.text)){
					$("#center").tabs('select',node.text);
				}else{
					if(node.text=="员工管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"employeePage.html",
					});
					}else if(node.text=="企业管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"enterprisePage.html"
					});
					}else if(node.text=="部门管理"){
						$("#center").tabs('add',{
							title : node.text,
							closable:true,
							method: "GET",
							href:"departmentPage.html"
						});
					}else if(node.text=="从业人员"){
						$("#center").tabs('add',{
							title : node.text,
							closable:true,
							method: "GET",
							href:"TCraftsmanPage.html"
						});
					}else if(node.text=="个人信息"){
						$("#center").tabs('add',{
							title : node.text,
							closable:true,
							method: "GET",
							href:"PersonNews.html"
						});
					}else if(node.text=="登录记录"){
						$("#center").tabs('add',{
							title : node.text,
							closable:true,
							method: "GET",
							href:"TLogin.html"
						});
					}
				}
			}
		},
	});
		/* 仓库模块 */
		$("#navs2").tree({
			url:'tree2.json',
			animate:true,
			cascadeCheck:false,
			onlyLeafCheck:true,
			method: "GET",
			border:false,
			dnd:false,
			onClick : function(node){
				//=="企业管理"||node.text=="员工管理"||node.text=="部门管理"||node.text=="仓库信息"||node.text=="仓库管理"||node.text=="材料管理"
				if(node.text){
				if($("#center").tabs('exists',node.text)){
					$("#center").tabs('select',node.text);
				}else if(node.text=="仓库信息"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"warehousePage.html"
				});
			}else if(node.text=="仓库管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"mWarehousePage.html"
				});
			}else if(node.text=="材料管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"MaterialPage.html"
				});
			}else if(node.text=="商品管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"TGoodsPage.html"
				});
			}else if(node.text=="类型管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"TypeManage.html"
				});
			}else if(node.text=="库存管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					mmethod: "GET",
					href:"TStorePage.html"
				});
			}else if(node.text=="盘点仓库"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"InventoryPage.html"
				});
			}else if(node.text=="半成品管理"){
				$("#center").tabs('add',{
					title : node.text,
					closable:true,
					method: "GET",
					href:"TSemifinishedGoods.html"
				});
			}
		}
	}
});
		
		/* 商品模块 */
		$("#navs3").tree({
			url:'tree3.json',
			animate:true,
			cascadeCheck:false,
			onlyLeafCheck:true,
			border:false,
			method: "GET",
			dnd:false,
			onClick : function(node){
				if(node.text){
				if($("#center").tabs('exists',node.text)){
					$("#center").tabs('select',node.text);
				}else if(node.text=="材料入库管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TImportMeaterial.html"
					});
				}else if(node.text=="半成品入库"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TImportSemiGoods.html"
					});
				}else if(node.text=="商品入库管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TImportStuffPage.html"
					});
				}else if(node.text=="加工类型管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"MachiningTypeManage.html"
					});
				}else if(node.text=="加工内容管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TProcessContentPage.html"
					});
				}else if(node.text=="价格系数管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"dictionary.html"
					});
				}else if(node.text=="相关系数管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"quotiety.html"
					});
				}else if(node.text=="材料出库管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TExportMaterialPage.html"
					});
				}else if(node.text=="半成品出库"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TexportSemiGoodsforProcess.html"
					});
				}else if(node.text=="商品出库管理"){
					$("#center").tabs('add',{
						title : node.text,
						closable:true,
						method: "GET",
						href:"TEXportGoods.html"
					});
				}
		}
	}
});
		// 设置中部为选项卡面板
		$("#center").tabs({										
			border:false,
			tools:'#tab-tools',
		});
		// 创建首页
		if($("#center").tabs('exists','首页')){					
			$("#center").tabs('select','首页');
		}else{
		$("#center").tabs('add',{
			title:'首页',
			border:false,
			href:"index.html",
		});
		}
	
		/**
		 * 鼠标移到登录名上的事件
		 * */
		$("#loginBox").hover(
		function () {
				$("#connectImg").show();
				$("#hidderBox,#connectImg").slideDown("600");
			},
			 function () {
				$("#hidderBox").slideUp("1200");
				$("#connectImg").hide();
			}
		);
		
		/**
		 * 点击个人信息事件
		 * 
		 * */
		$("#personNews").click(function(){
			if($("#center").tabs('exists','个人信息')){					//创建首页
				$("#center").tabs('select','个人信息');
			}else{
			$("#center").tabs('add',{
				title : '个人信息',
				closable:true,
				method: "GET",
				href:"PersonNews.html"
			});
			}
		});
		
		/**
		 * 点击退出事件
		 * 
		 * */
		$("#safeQuit").click(function(){
			alert('点击了退出');
		});

		/** 调用初始化组件参数*/
		managerInitFn();
		
		// 自动下载下载订单窗口
		$("#manageAutoLoadMenu").dialog({
		    width: 560,
	        height: 520,
			title:'订单下载',
			closed:true,
			modal: true,
			buttons:[{
				text:'开始下载',
				iconCls:'icon-edit',
				handler:function(){
					$.ajax({
						type:"get",
						url : "TExportGoodsOnline.json",
						dataType : "json",
						success : function(data){
							// 将json对象转为字符串
							var jsonStr = JSON.stringify(data);
							$("#menuTipBox").text(jsonStr);
						}
						
					});
				}
			},{
				text:'取消',
				iconCls:'icon-undo',
				handler:function(){
					$("#manageAutoLoadMenu").dialog('close');
				}
			}]
		});
		
});

	//初始化组件
	function managerInitFn(){
		// 刷新当前界面
		$("#refresh").linkbutton({					   
			plain:true,
			iconCls:'icon-refreshbig',
			onClick : function(){
				var tab = $('#center').tabs('getSelected');
			    // 获得当前选中的tab 的href
			    var url = $(tab.panel('options')).attr('href');
			    // 刷新当前界面
			    tab.panel('refresh', url);
			}
		});
		
		//  打开操作界面
		$("#autoLoadSetting").linkbutton({					   
			plain:true,
			iconCls:'icon-setting',
			onClick : function(){
				$("#handlerBox").toggle('slow')
			}
		});
		
		// 自动下载订单
		$("#autoLoadMenu").linkbutton({					   
			plain:true,
			onClick : function(){
				$("#manageAutoLoadMenu").dialog('open');
			}
		});
		
		// 关闭其他界面
		$("#closeOtherTabs").click(function(){
			// 获得选中的面板
			var pp = $('#center').tabs('getSelected');    
			//获取所有标签
			var tabs = $("#center").tabs("tabs");
			var length = tabs.length;
			//获取选中标签的索引
			var tab = $('#center').tabs('getSelected');
			var index = $('#center').tabs('getTabIndex',tab);
			//关闭选中标签之前的标签
			for(var i=0;i<index;i++){
				$("#center").tabs("close",0);
			}
				
		    //关闭选中标签之后的标签
			for(var i=0;i<length-index-1;i++){
				 $("#center").tabs("close",1);
			}
					
		   ceateFirstPage();
		   $("#center").tabs('select',0);
			
		});
		
		// 关闭所有界面
		$("#closeAllTabs").click(function(){
			var tabss=$('#center').tabs('tabs');
			$.each(tabss, function(i, n){
					$('#center').tabs('close',0);
				});
			ceateFirstPage();
		});
		
		// 自动下载订单配置
		$("#autoLoadMenuSetting").click(function(){
			alert("自动下载订单配置");
		});
		
		// 点击界面的任何一处
		$(this).click(function(){
			$("#handlerBox").hide('slow')
		});
	}
	

	/**
	 * 时钟效果
	 */
	function showTime(){
	    var myDate = new Date();
	    var year = myDate.getFullYear();
	    var month = myDate.getMonth() + 1;
	    var date = myDate.getDate();
	    var dayArray = new Array(7);
	    dayArray[0] = "星期日";
	    dayArray[1] = "星期一";
	    dayArray[2] = "星期二";
	    dayArray[3] = "星期三";
	    dayArray[4] = "星期四";
	    dayArray[5] = "星期五";
	    dayArray[6] = "星期六";
	    var day1 = myDate.getDay();
	    var day = dayArray[day1];
	    var hour = myDate.getHours();
	    var minute = myDate.getMinutes();
	    var second = myDate.getSeconds();
	    var min = checkTime(minute);
	    var sec = checkTime(second);
	    var time1 = "时间 : "+year + "年" + month + "月" + date + "日";
	    var time2 = hour + "：" + min + "：" + sec;
	    $('#time').text(time1+day+"  "+time2);
	    setTimeout("showTime()",1000);
	    }
	    function checkTime(i){
	      if(i<10){
	        i = "0" + i;
	      }
	      return i;
	    }
// 创建首页
function ceateFirstPage(){
		var $tabs=parent.$('#center',parent.document);
		if($("#center").tabs('exists',"首页")){
			$("#center").tabs('select',"首页");
		}else{
			 // 添加回选中的面板
			$tabs.tabs('add',{
				title:'首页',
				border:false,
				href:"index.html",
		})
		}
}