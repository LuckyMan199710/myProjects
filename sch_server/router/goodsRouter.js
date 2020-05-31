const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../thirdPartyPlugin/mysql/client.js')
 //生成唯一id
function guid() {
     return Number(Math.random().toString().substr(2, 2) + Date.now()).toString(30);
}
const storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./static/goods')
	},
	filename:function(req,file,cb){
		let ext = file.originalname.split('.')[1];
		let tmpname = new Date().getTime()+Math.floor(Math.random()*10000);
		cb(null,`${tmpname}.${ext}`)
	}
});
const upload = multer({
	storage:storage
})
//发布闲置 保存商品
router.post('/saveGoodsInfo',upload.any(),(req,res)=>{
	let imgPath=[];
	let goodsId;
	let goodsInfo = JSON.parse(req.body.goodsInfo);
	let status = new Promise((resolve,reject)=>{
		if(req.files){
			for(let i = 0; i<req.files.length;i++){
				imgPath[i] = req.files[i].path;
			}
			resolve();
		}
		else{
			reject();
		}
	})
	status.then(()=>{
		return new Promise((resolve,reject)=>{
			db('select u_name from user_info where u_id= "'+ req.session.userId +'"',(err,data)=>{
				if(data){
					resolve(data[0].u_name);
				}
				else{
					reject();
				}
			})		
		})	
	})
	.then((res)=>{
		goodsId = guid();
		return new Promise((resovle,reject)=>{
			console.log(goodsId)
			db('insert into goods_info (good_id,good_title,good_info,good_price,seller_id,seller,p_time) values(?,?,?,?,?,?,now())',[goodsId,goodsInfo.goodsTitle,goodsInfo.goodsInfo,goodsInfo.value,req.session.userId,res],(err,data)=>{
				if(data){
					resovle();
				}
				else{
					reject();
				}
			})
		})
	})
	.then(()=>{
		return new Promise((resolve,reject)=>{
			for(let i = 0 ;i< imgPath.length;i++){
				db('insert into goods_img (good_img_url,good_id) values(?,?)',[imgPath[i],goodsId],(err,data)=>{
					if(data){
						resolve()
					}
					else{
						reject()
					}
				})
			}
			
		})	
	})
	.then(()=>{
		res.json({
			success:1,
			msg:'保存数据成功'
		})
	})
	.catch((err)=>{
		console.log(err)
		res.json({
			err:-1,
			msg:'数据保存失败'
		})
	})
})
//查询发布的商品信息
router.post('/getGoodsInfo',(req,res)=>{
	/* let select_sql = 'and gi.seller_Id ="'+ req.session.userId+'" ' || ''; */
	if(req.body.param === 'random'){
		db('select *,GROUP_CONCAT(gis.good_img_url) from goods_info gi INNER JOIN goods_img gis where gi.good_id = gis.good_id and seller_id != "'+req.session.userId+'" group by gis.good_id order by rand() limit 6',(err,data)=>{
			if(err){
				console.log(err)
				res.json({
					err:-1,
					msg:'falid'
				})
			}
			else{
				res.json({
					success:1,
					goodsList:data
				})
			}
		})
	}
	//从随便看看跳转，获取所有商品
	else if(!req.body.param && !req.body.good_id){
		db('select *,GROUP_CONCAT(gis.good_img_url) from goods_info gi INNER JOIN goods_img gis where gi.good_id = gis.good_id and seller_id != "'+req.session.userId+'"  group by gis.good_id',(err,data) => {
			if(err){
				console.log(err)
				res.json({
					err:-1,
					msg:'falid'
				})
			}
			else{
				res.json({
					success:1,
					goodsList:data
				})
			}
		})
	}
	else if(req.body.good_id){
		db('select *,GROUP_CONCAT(gis.good_img_url) from goods_info gi INNER JOIN goods_img gis where gi.good_id = gis.good_id and gi.good_id ="'+req.body.good_id+'" and seller_id != "'+req.session.userId+'" GROUP BY gi.good_id',(err,data)=>{
			if(err){
				console.log(err)
				res.json({
					err:-1,
					msg:'falid'
				})
			}
			else{
				res.json({
					success:1,
					goodsInfo:data
				})
			}
		})
	}
	/* 搜索 */
	else{
		console.log(2)
		let select_sql = (req.body.param === 'search') ? 'and gi.good_title like "%'+ req.body.searchInfo+'%" ' : '';
		db('select *,GROUP_CONCAT(gis.good_img_url) from goods_info gi INNER JOIN goods_img gis where gi.good_id = gis.good_id '+select_sql+' group by gis.good_id',(err,data) => {
			if(err){
				console.log(err)
				res.json({
					err:-1,
					msg:'falid'
				})
			}
			else{
				res.json({
					success:1,
					goodsList:data
				})
			}
		})
	}
})

//商品收藏
router.post('/collection',(req,res)=>{
	db('insert into user_collection(good_id,user_id) values(?,?)',[req.body.good_id,req.session.userId],(err,data) => {
		if(err){
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			res.json({
				success:1,
				msg:'收藏成功'
			})
		}
	})
})
//取消收藏
router.post('/deleteCollection',(req,res)=>{
	db('delete from user_collection where good_id ="'+req.body.good_id+'" and user_id ="'+req.session.userId+'"',(err,data) => {
		if(err){
			console.log(err)
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			res.json({
				success:1,
				msg:'取消收藏成功'
			})
		}
	})
})
//判断商品是否被该用户收藏
router.post('/getCollectionInfo',(req,res)=>{
	db('select * from user_collection where good_id ="'+req.body.good_id+'" and user_id ="'+req.session.userId+'"',(err,data) =>{
		if(err){
			console.log(err)
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			if(data.length != 0){
				res.json({
					success:1,
					msg:'已收藏'
				})
			}			
		}
	})
})
module.exports = router