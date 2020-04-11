const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../thirdPartyPlugin/mysql/client.js')

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
		values(?, ?, ?)`)
	}
})
module.exports = router