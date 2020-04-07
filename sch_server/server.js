const express = require('express')
const app = express()
//express不能直接解析post请求的请求体，要通过body-parser这个插件才能进行解析
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const session = require('express-session')
var cors = require('cors');
let userRouter = require('./router/userRouter.js')
let indexRouter = require('./router/indexRouter.js')

//cros处理跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",true); //带cookies
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//session配置
app.use(session({
	secret:'keyboard',
	cookie:{maxAge:60 * 1000 * 60 * 24 * 1}, //设置过期时间
	resave:true,
	saveUninitialized: false
}))

app.use(bodyparser.json())
app.use('/user',userRouter)
//对请求主页的进行一个拦截 验证用户是否登录 如果没有登录 则返回相应错误代码让前端进行操作，否则则next进行下面的操作
app.use('/index',(req,res,next)=>{
	if(req.session.isLogin){
			next();
	}
	else{
		res.json({
			code:-1,
			msg:'请重新登录'
		})
	}
},indexRouter)


app.listen(3000,() =>{
	console.log('server start')
})