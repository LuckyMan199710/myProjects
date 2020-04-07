const nodemailer = require("nodemailer")
let result;
const config = {
    // 163邮箱 为smtp.163.com
    host: 'smtp.qq.com',//这是qq邮箱
    //端口
    port: 465,
    auth: {
        // 发件人邮箱账号
        user: '1292082437@qq.com', 
        //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
        pass: 'qnrwyloraunubada'  
    }
 }
const transporter = nodemailer.createTransport(config)

//发送验证码的方法
async function send(code,email){
	const mail = {
	   // 发件人 邮箱  '昵称<发件人邮箱>'
	   from: '校园二手交易注册中心<1292082437@qq.com>',
	   // 主题
	   subject: '验证码',
	   // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
	   to: email,
	   // 内容
	   text: `您的验证码是${code}` ,
	   //这里可以添加html标签
	   html: ''
	}
	result = await transporter.sendMail(mail)
	return result;
}

module.exports = send