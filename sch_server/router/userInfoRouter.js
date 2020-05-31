const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../thirdPartyPlugin/mysql/client.js')
var fs=require('fs');

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./static/user')
	},
	filename:function(req,file,cb){
		let ext = file.originalname.split('.')[1];
		let tmpname = req.session.userId+(parseInt(Math.random()*10000)).toString();
		cb(null,`${tmpname}.${ext}`)
	}
});
var upload = multer({
	storage:storage
})
//保存用户数据
router.post('/savaUserInfo',upload.single('user'),(req,res)=>{
	let {size,mimetype,path} = req.file;
	let types = ['jpg','jpeg','png'];
	let tmpType = mimetype.split('/')[1];
	if(size>500000){
		return res.send({err:-1,msg:'尺寸过大'})
	}
	else if(types.indexOf(tmpType)==-1){
		return res.send({err:-2,msg:'媒体类型错误'})
	}
	else{
		let imgPath = req.file.path;
		let userInfo = JSON.parse(req.body.userInfo);
		db(`insert into user_info(u_id,u_name,u_area,u_headimg,u_sex,u_age,u_birthday,u_phonenum,u_mail,u_qq,u_wechat) 
		values(?, ?,?,?,?,?,?,?,?,?,?)`,[req.session.userId,userInfo.username,userInfo.area,imgPath,userInfo.sex,userInfo.age,userInfo.birthday,userInfo.phoneNum,userInfo.email,userInfo.QQnum,userInfo.wechatnum],(err,data)=>{
			if(err){
				console.log(err)
				console.log(req.session.userId)
				res.json({
					err:-1,
					msg:'存储失败'
				})
			}
			else{
				res.send({
					success:1,
					msg:'存储成功'
				})
			}
		})
	}
})
//更新用户数据
router.post('/updateUserInfo',upload.single('user'),(req,res)=>{
	//判断头像是否有上传
	if(!req.file){
		//直接更新数据
		console.log(req.file)
		let userInfo = JSON.parse(req.body.userInfo);
		db('update user_info set u_name= ?,u_area=?,u_headimg= ?,u_sex= ?,u_age= ?,u_birthday= ?,u_phonenum=?,u_mail= ?,u_qq=?,u_wechat=? where u_id= "'+userInfo.u_Id+'"',
		[userInfo.u_name,userInfo.u_area,userInfo.u_headimg,userInfo.u_sex,userInfo.u_age,userInfo.u_birthday,userInfo.u_phonenum,userInfo.u_mail,userInfo.u_qq,userInfo.u_wechat],(err,data)=>{
			if(data){
				res.json({
					success:1,
					msg:'更新成功'
				})
			}
			else{
				res.json({
					error:-1,
					msg:'更新失败'
				})
			}
		})
	}
	else{
		let {size,mimetype,path} = req.file;
		let types = ['jpg','jpeg','png'];
		let tmpType = mimetype.split('/')[1];
		if(size>500000){
			return res.send({err:-1,msg:'尺寸过大'})
		}
		else if(types.indexOf(tmpType)==-1){
			return res.send({err:-2,msg:'媒体类型错误'})
		}
		else{
			let imgPath = req.file.path;
			let userInfo = JSON.parse(req.body.userInfo);
			/* console.log(userInfo) */
			db('update user_info set u_name= ?,u_area=?,u_headimg= ?,u_sex= ?,u_age= ?,u_birthday= ?,u_phonenum=?,u_mail= ?,u_qq=?,u_wechat=? where u_id= "'+userInfo.u_Id+'"',
			[userInfo.u_name,userInfo.u_area,imgPath,userInfo.u_sex,userInfo.u_age,userInfo.u_birthday,userInfo.u_phonenum,userInfo.u_mail,userInfo.u_qq,userInfo.u_wechat],(err,data)=>{
				if(data){
					res.json({
						success:1,
						msg:'更新成功'
					})
					fs.unlink(userInfo.u_headimg,function(error){
						if(error){
							console.log(error);
							return false;
						}
					})	
				}
				else{
					res.json({
						error:-1,
						msg:'更新失败'
					})
				}
			})
		}
	}
})
//获取用户数据
router.post('/getUserInfo',(req,res) => {
	db('select * from user_info where u_id = "'+req.body.seller_id+'"',(err,data) => {
		if(err){
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			res.json({
				success:1,
				msg:data
			})
		}
	})
})
//清除session
router.get('/logout',(req,res)=> {
	req.session.destroy(function(err) {
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
				msg:'退出成功'
			})
		}
	})
})
//获得用户收藏的信息
router.post('/getAllCollection',(req,res)=>{
	let sql = 'select * from goods_info gi inner join goods_img gim on gi.good_id = gim.good_id INNER JOIN user_collection uc on gi.good_id = uc.good_id where user_id ="'+req.session.userId+'" group by gi.good_id';
	db(sql,(err,data)=>{
		if(err){
			res.json({
				err:-1,
				msg:'未知错误',
			})
		}
		else{
			res.json({
				success:1,
				msg:data
			})
		}
	})
})
//获取用户发布的信息
router.post('/getUserPublish',(req,res)=>{
	db('select * from goods_info gi INNER JOIN goods_img gis where gi.good_id = gis.good_id and gi.seller_id ="'+req.session.userId+'" GROUP BY gi.good_id',(err,data)=>{
		if(err){
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			res.json({
				success:1,
				msg:data
			})
		}
	})
})
//删除用户发布的信息
router.post('/delUserPublish',(req,res)=>{
	let good_id = req.body.good_id;
	db('DELETE goods_img,goods_info FROM goods_info LEFT JOIN goods_img ON goods_info.good_id = goods_img.good_id WHERE  goods_info.good_id ="'+good_id+'"',(err,data)=>{
		if(err){
			console.log(err)
			res.json({
				err:-1,
				msg:'未知错误'
			})
		}
		else{
			db('DELETE from user_collection where good_id = "'+good_id+'"',(err,data)=>{
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
						msg:'删除成功'
					})
				}
			})		
		}
	})
})
module.exports = router