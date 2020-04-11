//处理主页请求
const express = require('express');
let router = express.Router();

router.get('/test',(req,res) => {
	console.log(req.query.userId)
	res.json({
		msg:'123'
	})
}) 

module.exports = router