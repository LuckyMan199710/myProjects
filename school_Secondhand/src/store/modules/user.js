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
		getUserInfo(context,param){
			axios.get('http://localhost:3000/index/test', {
			params: {
				userId: param
				}
			})
			.then((response) =>{
				context.commit('saveUserInfo',response.data)
			})
			.catch((error) => {
				console.log(error)
			})
		}
	}
}