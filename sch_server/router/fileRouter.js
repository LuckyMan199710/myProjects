const express = require('express');
const router = express.Router();
const multer = require('multer');

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./static/user')
	},
	filename:function(req,file,cb){
		let ext = file.originalname.split('.')[1];
		let tmpname = (new Date()).getTime()
		cb(null,`${tmpname}.${ext}`)
	}
});
var upload = multer({
	storage:storage
})

router.post('/upload',upload.single('user'),(req,res)=>{
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
		res.send({err:0,msg:'ok'})
	}
})
module.exports = router