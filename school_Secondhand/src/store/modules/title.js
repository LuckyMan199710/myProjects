//管理页面标题
export default{
	namespace:true,
	state:{
		titleName:''
	},
	mutations:{
		changeTitleName(state,title){
			state.titleName = title;
		}
	}
}