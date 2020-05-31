const express = require('express');
const router = express.Router();
const db = require('../thirdPartyPlugin/mysql/client.js')

router.post('/savaNotice',(req,res) => {
	let notice = req.body.notice;
	let sql = 'insert into notice (title,notice_content,p_id,p_time) values(?,?,?,now())'
	db(sql,[notice.noticeTitle,notice.noticeInfo,req.session.userId],(err,data)=>{
		if(err){
			console.log(err)
			res.json({
				error:-1,
				msg:'未知错误'
			})
		}
		else{
			res.json({
				success:1,
				msg:'发布成功'
			})
		}
	})
})
router.get('/getNotice',(req,res) => {
	db('SELECT * FROM notice ORDER BY notice_id DESC  LIMIT 1',(err,data)=>{
		if(err){
			console.log(err)
			res.json({
				err:-1,
				msg:'获取信息错误'
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
module.exports = router