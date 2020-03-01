$(function(){
	initClickFn();
});

/* 企业管理 */
$("#enterClickWord").click(function(){
	$("#enterDisBOX").toggle(200);
	$("#enterClickWord").toggleClass('changeColor');
	$("#enterClickWord").toggleClass('EMTitle').toggleClass('EMTitle2');
});

/* 仓库信息 */
$("#warehouseClickword").click(function(){
	$("#warehouseABox").toggle(200);
	$("#warehouseClickword").toggleClass('changeColor');
	$("#warehouseClickword").toggleClass('WMTtile').toggleClass('WMTtile2');
});

/* 商品信息 */
$("#goodsClickWord").click(function(){
	$("#goodsOutBox").toggle(200);
	$("#goodsClickWord").toggleClass('changeColor');
	$("#goodsClickWord").toggleClass('GMTititle').toggleClass('GMTititle2');
});



function initClickFn(){
	// 企业管理
	$("#enterpriceMBox").click(function(){
		if($("#center").tabs('exists',"企业管理")){
			$("#center").tabs('select',"企业管理");
		}else{
			$("#center").tabs('add',{
				title : "企业管理",
				closable:true,
				method: "GET",
				href:"enterprisePage.html"
			});
		}
	});
	
	// 部门管理
	$("#departmentMBox").click(function(){
		if($("#center").tabs('exists',"部门管理")){
			$("#center").tabs('select',"部门管理");
		}else{
			$("#center").tabs('add',{
				title : "部门管理",
				closable:true,
				method: "GET",
				href:"departmentPage.html"
			});
		}
	});
	
	// 员工管理
	$("#employeeMBox").click(function(){
		if($("#center").tabs('exists',"员工管理")){
			$("#center").tabs('select',"员工管理");
		}else{
			$("#center").tabs('add',{
				title : "员工管理",
				closable:true,
				method: "GET",
				href:"employeePage.html"
			});
		}
	});
	
	// 从业人员管理
	$("#gRaftMan").click(function(){
		if($("#center").tabs('exists',"从业人员管理")){
			$("#center").tabs('select',"从业人员管理");
		}else{
			$("#center").tabs('add',{
				title : "从业人员管理",
				closable:true,
				method: "GET",
				href:"TCraftsmanPage.html"
			});
		}
	});
	
	// 个人信息
	$("#personIndex").click(function(){
		if($("#center").tabs('exists',"个人信息")){
			$("#center").tabs('select',"个人信息");
		}else{
			$("#center").tabs('add',{
				title : "个人信息",
				closable:true,
				method: "GET",
				href:"PersonNews.html"
			});
		}
	});
	
	// 登录记录
	$("#tLoginIndex").click(function(){
		if($("#center").tabs('exists',"登录记录")){
			$("#center").tabs('select',"登录记录");
		}else{
			$("#center").tabs('add',{
				title : "登录记录",
				closable:true,
				method: "GET",
				href:"TLogin.html"
			});
		}
	});
	
	
	// 仓库信息
	$("#warehouseNBox").click(function(){
		if($("#center").tabs('exists',"仓库信息")){
			$("#center").tabs('select',"仓库信息");
		}else{
			$("#center").tabs('add',{
				title : "仓库信息",
				closable:true,
				method: "GET",
				href:"warehousePage.html"
			});
		}
	});
	
	// 仓库管理
	$("#warehouseMBox").click(function(){
		if($("#center").tabs('exists',"仓库管理")){
			$("#center").tabs('select',"仓库管理");
		}else{
			$("#center").tabs('add',{
				title : "仓库管理",
				closable:true,
				method: "GET",
				href:"mWarehousePage.html"
			});
		}
	});
	
	// 材料管理
	$("#metialMBox").click(function(){
		if($("#center").tabs('exists',"材料管理")){
			$("#center").tabs('select',"材料管理");
		}else{
			$("#center").tabs('add',{
				title : "材料管理",
				closable:true,
				method: "GET",
				href:"MaterialPage.html"
			});
		}
	});
	
	// 半成品管理
	$("#semiMBox").click(function(){
		if($("#center").tabs('exists',"半成品管理")){
			$("#center").tabs('select',"半成品管理");
		}else{
			$("#center").tabs('add',{
				title : "半成品管理",
				closable:true,
				method: "GET",
				href:"TSemifinishedGoods.html"
			});
		}
	});
	
	// 商品管理
	$("#goodsMBox").click(function(){
		if($("#center").tabs('exists',"商品管理")){
			$("#center").tabs('select',"商品管理");
		}else{
			$("#center").tabs('add',{
				title : "商品管理",
				closable:true,
				method: "GET",
				href:"TGoodsPage.html"
			});
		}
	});
	
	// 类型管理
	$("#typeMBox").click(function(){
		if($("#center").tabs('exists',"类型管理")){
			$("#center").tabs('select',"类型管理");
		}else{
			$("#center").tabs('add',{
				title : "类型管理",
				closable:true,
				method: "GET",
				href:"TypeManage.html"
			});
		}
	});
	
	// 盘点仓库
	$("#countWarehouse").click(function(){
		if($("#center").tabs('exists',"盘点仓库")){
			$("#center").tabs('select',"盘点仓库");
		}else{
			$("#center").tabs('add',{
				title : "盘点仓库",
				closable:true,
				method: "GET",
				href:"InventoryPage.html"
			});
		}
	});
	
	// 仓存管理
	$("#storeManager").click(function(){
		if($("#center").tabs('exists',"仓存管理")){
			$("#center").tabs('select',"仓存管理");
		}else{
			$("#center").tabs('add',{
				title : "仓存管理",
				closable:true,
				method: "GET",
				href:"TStorePage.html"
			});
		}
	});
	
	
	// 材料入库
	$("#importMetialIndex").click(function(){
		if($("#center").tabs('exists',"材料入库管理")){
			$("#center").tabs('select',"材料入库管理");
		}else{
			$("#center").tabs('add',{
				title : "材料入库管理",
				closable:true,
				method: "GET",
				href:"TImportMeaterial.html"
			});
		}
	});
	
	// 半成品入库
	$("#importSemiGoodIndex").click(function(){
		if($("#center").tabs('exists',"半成品入库")){
			$("#center").tabs('select',"半成品入库");
		}else{
			$("#center").tabs('add',{
				title : "半成品入库",
				closable:true,
				method: "GET",
				href:"TImportSemiGoods.html"
			});
		}
	});
	
	// 材料出库
	$("#exportMetialIndex").click(function(){
		if($("#center").tabs('exists',"材料出库管理")){
			$("#center").tabs('select',"材料出库管理");
		}else{
			$("#center").tabs('add',{
				title : "材料出库管理",
				closable:true,
				method: "GET",
				href:"TExportMaterialPage.html"
			});
		}
	});
	
	// 半成品出库管理
	$("#exportSemiGoodIndex").click(function(){
		if($("#center").tabs('exists',"半成品出库")){
			$("#center").tabs('select',"半成品出库");
		}else{
			$("#center").tabs('add',{
				title : "半成品出库",
				closable:true,
				method: "GET",
				href:"TexportSemiGoodsforProcess.html"
			});
		}
	});
	
	// 加工类型管理
	$("#processTypeIndex").click(function(){
		if($("#center").tabs('exists',"加工类型管理")){
			$("#center").tabs('select',"加工类型管理");
		}else{
			$("#center").tabs('add',{
				title : "加工类型管理",
				closable:true,
				method: "GET",
				href:"MachiningTypeManage.html"
			});
		}
	});
	
	// 加工内容管理
	$("#processContextIndex").click(function(){
		if($("#center").tabs('exists',"加工内容管理")){
			$("#center").tabs('select',"加工内容管理");
		}else{
			$("#center").tabs('add',{
				title : "加工内容管理",
				closable:true,
				method: "GET",
				href:"TProcessContentPage.html"
			});
		}
	});
	
	
	// 价格系数管理
	$("#priceQueityIndex").click(function(){
		if($("#center").tabs('exists',"价格系数管理")){
			$("#center").tabs('select',"价格系数管理");
		}else{
			$("#center").tabs('add',{
				title : "价格系数管理",
				closable:true,
				method: "GET",
				href:"dictionary.html"
			});
		}
	});
	
	
	// 相关系数管理
	$("#relativeQuerityIndex").click(function(){
		if($("#center").tabs('exists',"相关系数管理")){
			$("#center").tabs('select',"相关系数管理");
		}else{
			$("#center").tabs('add',{
				title : "相关系数管理",
				closable:true,
				method: "GET",
				href:"quotiety.html"
			});
		}
	});
	
	// 商品入库管理
	$("#importGoodIndex").click(function(){
		if($("#center").tabs('exists',"商品入库管理")){
			$("#center").tabs('select',"商品入库管理");
		}else{
			$("#center").tabs('add',{
				title : "商品入库管理",
				closable:true,
				method: "GET",
				href:"TImportStuffPage.html"
			});
		}
	});
	
	
	// 商品出库管理
	$("#exportGoodIndex").click(function(){
		if($("#center").tabs('exists',"商品出库管理")){
			$("#center").tabs('select',"商品出库管理");
		}else{
			$("#center").tabs('add',{
				title : "商品出库管理",
				closable:true,
				method: "GET",
				href:"TEXportGoods.html"
			});
		}
	});
	
	
}