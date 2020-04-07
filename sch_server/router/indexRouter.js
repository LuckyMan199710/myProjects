//处理主页请求
const express = require('express');
let router = express.Router();

router.get('/test',(req,res) => {
	/* if(req.session.isLogin){
		res.json({
			code:1
		})
	}
	else{
		res.json({
			code:-1
		})
	} */
	res.json({
		msg:'老八小汉堡'
	})
}) 

module.exports = router