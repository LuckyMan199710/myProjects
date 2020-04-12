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
		let tmpname = new Date().getTime();
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
			db('insert into goods_info (good_id,good_title,good_info,good_price,seller_id,seller) values(?,?,?,?,?,?)',[goodsId,goodsInfo.goodsTitle,goodsInfo.goodsInfo,goodsInfo.value,req.session.userId,res],(err,data)=>{
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
		console.log('ok')
	})
	.catch((err)=>{
		console.log(err)
	})
})
module.exports = router