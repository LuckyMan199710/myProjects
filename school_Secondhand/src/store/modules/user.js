//当登录成功进入主页时,读取用户的所有数据并放在该vuex模块中,可以减少请求,减轻服务器压力
import axios from 'axios'
export default{
	namespace:true,
	state:{
		userInfo:null   //用来存放用户信息的对象
	},
	mutations:{
		saveUserInfo(state,obj){
			state.userInfo = obj;
			console.log(state.userInfo)
		}
	},
	actions:{
		getUserInfo(context){
			return new Promise((resolve,reject)=>{
				axios.post('http://localhost:3000/index/getUserInfo')
				.then((response) =>{
					if(response.data.code === -1){
						resolve('isNotLogin')
					}			
					else if(response.data.success === 1){
						context.commit('saveUserInfo',response.data.data)
						resolve('success')
					}
					else if(response.data.success === 0){
						resolve('noMessage')
					}
					else{
						reject()
					}
				})
				.catch(() => {
					reject()
				})
			})
		},
		updateUserInfo(context,param){
			return new Promise((resolve,reject)=>{
				axios.post('http://localhost:3000/userInfo/updateUserInfo',param)
				.then((res)=>{
					if(res.data.success === 1){
						resolve('success');
					}
					else{
						reject();
					}
				})
				.catch(()=>{
					reject();
				})
			})
			
		}
	}
}