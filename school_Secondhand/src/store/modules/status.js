//这个vuex模块用来管理导航栏什么时候应该消失 什么时候应该出现
export default{
	namespace:true,
	state:{
		tabbarStatus:true,
		navBarStatus:false,
		tabbarInedx:0
	},
	mutations:{
		changeTabbarStatusTrue(state){
			if(state.tabbarStatus === false){
				state.tabbarStatus = true;
			}
		},
		changeTabbarStatusFalse(state){
			if(state.tabbarStatus === true){
				state.tabbarStatus = false;
			}
		},
		changeNavBarStatusTrue(state){
			if(state.navBarStatus === false){
				state.navBarStatus = true;
			}		
		},
		changeNavBarStatusFalse(state){
			if(state.navBarStatus === true){
				state.navBarStatus = false;
			}
		},
		changeTabbarStatusIndex(state,index){
			state.tabbarInedx = index;
		}
	}
}