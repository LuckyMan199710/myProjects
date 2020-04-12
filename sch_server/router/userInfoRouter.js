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
		db(`insert into user_info(u_id,u_name,u_area,u_headimg,u_sex,u_age,u_birthday,u_phonenum,u_mail,u_collage,u_grade,u_address,u_qq,u_wechat) 
		values(?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)`,[req.session.userId,userInfo.username,userInfo.area,imgPath,userInfo.sex,userInfo.age,userInfo.birthday,userInfo.phoneNum,userInfo.email,userInfo.collage,userInfo.grade,userInfo.address,userInfo.QQnum,userInfo.wechatnum],(err,data)=>{
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
		let userInfo = JSON.parse(req.body.userInfo);
		db('update user_info set u_name= ?,u_area=?,u_headimg= ?,u_sex= ?,u_age= ?,u_birthday= ?,u_phonenum=?,u_mail= ?,u_collage=?,u_grade=?,u_address=?,u_qq=?,u_wechat=? where u_id= "'+userInfo.u_Id+'"',
		[userInfo.u_name,userInfo.u_area,userInfo.u_headimg,userInfo.u_sex,userInfo.u_age,userInfo.u_birthday,userInfo.u_phonenum,userInfo.u_mail,userInfo.u_collage,userInfo.u_grade,userInfo.u_address,userInfo.u_qq,userInfo.u_wechat],(err,data)=>{
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
			db('update user_info set u_name= ?,u_area=?,u_headimg= ?,u_sex= ?,u_age= ?,u_birthday= ?,u_phonenum=?,u_mail= ?,u_collage=?,u_grade=?,u_address=?,u_qq=?,u_wechat=? where u_id= "'+userInfo.u_Id+'"',
			[userInfo.u_name,userInfo.u_area,imgPath,userInfo.u_sex,userInfo.u_age,userInfo.u_birthday,userInfo.u_phonenum,userInfo.u_mail,userInfo.u_collage,userInfo.u_grade,userInfo.u_address,userInfo.u_qq,userInfo.u_wechat],(err,data)=>{
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
module.exports = router