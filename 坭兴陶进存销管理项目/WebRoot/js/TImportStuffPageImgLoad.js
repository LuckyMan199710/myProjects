$(function(){
	
		//加载从数据库中读取到的图片
		getImg();
		
		//初始化轮播图
	    $("#slides,#seeImgsBox").slidesjs({		
	        width: 940,
	        height: 428,
	        play: {
	            active: true,
	            auto: true,
	            interval: 3000,
	            swap: true,
	            effect:'fade',
	            pauseOnHover: true,
	          }
	    });
	      
 });

/**
 * 从数据库中获得图片并添加到div容器中
 * */
function getImg(){
	
	/**
	 * 从数据库中读取出来图片的路径的数组
	 * */
	var a=['img/a1.jpg','img/a2.jpg','img/a3.jpg'];
	
	/**
	 * 向更新界面div容器放入图片
	 * */
	 for(var i=0;i<a.length;i++){
		    $("#slides").append("<img src='"+a[i]+"' onclick='changImg(this)'>");
		}
	/**
	 * 向查看界面中的div放入图片
	 * */
	 for(var i=0;i<a.length;i++){
		    $("#seeImgsBox").append("<img src='"+a[i]+"'>");
		}
}

/**
 * 点击图片进行修改
 * */
function changImg(a){
	alert('点击更换图片'+$(a).attr('src'));
}

