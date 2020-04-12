//处理主页请求
const express = require('express');
let router = express.Router();
const db = require('../thirdPartyPlugin/mysql/client.js')
//查找用户数据
router.post('/getUserInfo',(req,res) => {
		db('select * from user_info where u_id = "' + req.session.userId + '"',(err,data) => {
			if(data.length != 0){
				res.json({
					success:1,
					data:data
				})
			}
			else if(data.length == 0){
				res.json({
					success:0,
					msg:'没有数据'
				})
			}
			else{
				res.json({
					err:-1,
					msg:'查询失败'
				})
			}
		})
}) 

module.exports = router