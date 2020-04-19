const express = require('express');
const send = require('../thirdPartyPlugin/nodemailer/nodemailer.js')
const db = require('../thirdPartyPlugin/mysql/client.js')
var md5 = require('blueimp-md5');
let router = express.Router();
let codeMap = new Map();

//生成唯一id
function guid() {
     return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
}

//获取邮箱验证码
router.get('/sendCode',(req,res)=>{
		let code = parseInt(Math.random()*10000);
		codeMap.set(req.query.userName,code);
		console.log(code)
		/* let result = send(code,req.query.userName);
		result.then(()=>{
			res.json({
				msg:'success'
			})
		})
		.catch((error) => {
			console.log(error);
			res.json({
				msg:'failed'
			})
		})		 */
})
//注册接口
router.post('/register',(req,res) =>{
	let code = codeMap.get(req.body.emailNum)
	if(req.body.code == ''+code){
		let id = guid();
		let password = md5(req.body.password);
		let username = req.body.emailNum;
		db('select * from user where userName = "' + username + '"',(err,data) => {
			if(data.length != 0){
				res.json({
					msg:'userName already exists'
				})
			}
			else{
				db('insert into user(id,userName,userPwd)values(?, ?, ?)',[id,username,password],(err,data) => {
					if(err){
						res.json({
							msg:'failed to save data!'
						})
					}
					else{
						res.json({
							msg:'success!'						
						})
						codeMap.delete(req.body.emailNum)
					}
				})
			}
		})	
	}
	else{
		res.json({
			msg:'error code'
		})
	}
})

//登陆接口
router.post('/login',(req,res) =>{
	db('select * from user where userName = "' + req.body.userName + '" and userPwd = "'+ md5(req.body.userPwd) +'"',(err,data) =>{
		if(data.length != 0){
			req.session.userId = data[0].id;
			req.session.isLogin = true;
			res.json({
				msg:'success',
			})
		}
		else{
			res.json({
				msg:'falied'
			})
		} 
	})
})

//修改密码接口
router.post('/changePwd',(req,res) => {
	//先查询该账号是否存在
	db('select * from user where userName = "' + req.body.emailNum + '"',(err,data) =>{
		if (data.length === 0) {
			res.json({
				msg:'userName not found'
			})
		}
		else{
			let code = codeMap.get(req.body.emailNum);
			if(req.body.code == ''+code){
				db('UPDATE user SET userPwd = "' +md5(req.body.password)+ '" WHERE userName = "'+ req.body.emailNum +'"' ,(err,data) =>{
					if(err){
						res.json({
							msg:"failed"
						})
					}
					else{
						res.json({
							msg:"success",
						})
						codeMap.delete(req.body.emailNum)
					}
				})
			}
			else{
				res.json({
					msg:'error code'
				})
			} 
		}
	})
})

//查询用户信息
router.get('/search',(req,res)=>{
	db('SELECT * FROM user_info WHERE u_id ="'+ req.session.userId +'"',(err,data)=>{
		if(data.length!= 0){
			res.json({
				code:1,
				msg:'用户已经存在'
			})
		}
		else if(err){
			res.json({
				code:-1,
				msg:'服务器错误'
			})
		}
		else{
			res.json({
				code:0,
				msg:'用户不存在'
			})
		}
	})
})


/* app.listen(3000,() =>{
	console.log('server start')
}) */
module.exports = router