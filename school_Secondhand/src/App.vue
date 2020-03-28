<template> 
  <div id="app">
	<van-nav-bar
		left-text="返回"
		left-arrow
		@click-left="onClickLeft"
		v-if="getNavbarStatus"
		:title="this.$store.state.Title.titleName"
	/>
    <transition :name="transitionName"> 
		<router-view class="Router"></router-view>
    </transition>
	<van-tabbar v-model="active" v-if = "getTabbarStatus">
		<van-tabbar-item icon="home-o" to="/home">主页</van-tabbar-item>
		<van-tabbar-item icon="search" to="/search">搜索</van-tabbar-item>
		<van-tabbar-item icon="setting-o" to="/user">我</van-tabbar-item>
	</van-tabbar>
  </div>
</template>

<script>
	import {NavBar,Tabbar,TabbarItem} from 'vant';
	export default {
		updated() {
			this.active = this.$store.state.Status.tabbarInedx //在该生命周期改变v-model的值
		},
		components:{
			[NavBar.name]: NavBar,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem
		},
		data() {
          return {
			transitionName: 'slide-right',// 默认动态路由变化为slide-right
			active: this.$store.state.Status.tabbarInedx
        }
	},
		computed:{
			getTabbarStatus(){
				return this.$store.state.Status.tabbarStatus
			},
			getNavbarStatus(){
				return this.$store.state.Status.navBarStatus
			}
		},
		watch: {
			'$route'() {
				let isBack = this.$router.isBack//监听路由变化时的状态为前进还是后退
				if(isBack) {
					this.transitionName = 'slide-right'
				} else {
					this.transitionName = 'slide-left'
					}
			this.$router.isBack = false
			}
		},
		methods:{
			onClickLeft() {
				window.history.go(-1);
			}
		},
	}
</script>

<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}
.Router {
	position: absolute;
	width: 100%;
	transition: all .6s ease;
}
.slide-left-enter,
 .slide-right-leave-active {
	opacity: 0;
	-webkit-transform: translate(100%, 0);
	transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
	opacity: 0;
	-webkit-transform: translate(-100%, 0);
	transform: translate(-100% 0);
}
</style>
