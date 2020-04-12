<template>
	<div class="index">
		<!-- 用户栏 -->
		<div class="user">
			<img class="logo" src="../assets/logo/logo.png" alt="logo" title="logo">
			<div class="username">
				<span>欢迎登录！</span>
				<van-icon name="manager-o" />
				<span class="name" @click="runToUser">{{user.u_name}}</span>
			</div>
		</div>
		<!-- 公告栏 -->
		<van-notice-bar text="通知内容" left-icon="volume-o" style="margin-top: 10px;"/>
		
		<div class="goodsTitle">
			<van-icon :name="require('../assets/icon/推荐.png')" size="16"/>
			<span>为您推荐</span>
		</div>
		<div class="goods">
			<van-grid :column-num="3">
				<van-grid-item
					v-for="value in 6"
					:key="value"
					:icon="require('../assets/图4.jpg')"
					text="文字"
				/>
			</van-grid>
		</div>
		<!-- 选项栏 -->
		<div class="selectedList">
			<van-grid :column-num="3">
				<van-grid-item
					@click="runToList"
					:icon="require('../assets/icon/cg-随便看看.png')"
					text="随便看看"
				/>
				<van-grid-item
					@click="runToPublish"
					:icon="require('../assets/icon/添加.png')"
					text="发布闲置"
				/>
				<van-grid-item
					:icon="require('../assets/icon/刷新.png')"
					text="换一批"
				/>
			</van-grid>
		</div>
	</div>
</template>

<script>
	import {Grid,GridItem,NoticeBar,Icon,Toast,Dialog } from 'vant'
	export default{
		/* beforeRouteEnter (to, from, next){
			if(from.path === '/login'){
				next((vm)=>{
					vm.$http.get('http://localhost:3000/user/search')
					.then((response) => {
						if(response.data.code === 0){
							Dialog.alert({
								title: '提示',
								message: '你没有填写个人信息，请先填写哦'
							}).then(() => {
								vm.$router.replace('/addUserMsg')
							});
						}
					})
					.catch((err) =>{
						Toast('出错误了，请稍后再试')
						console.log(err)
					})				
				});
			}
			else{
				next();
			}
		}, */ 
		components:{
			[Grid.name]:Grid,
			[GridItem.name]:GridItem,
			[NoticeBar.name]:NoticeBar,
			[Icon.name]:Icon,
			[Toast.name]:Toast,
			[Dialog.name]:Dialog 
		},
		mounted() {
			this.$store.commit('changeTabbarStatusTrue');
			this.$store.commit('changeNavBarStatusFalse');
			this.$store.commit('changeTabbarStatusIndex',0);
			
			this.status = this.$store.dispatch('getUserInfo');
			this.status.then((values)=>{
				if(values === 'isNotLogin'){
					Dialog.alert({
						title: '提示',
						message: '您未登陆！请登陆'
					})
					this.$router.push('/login')
				}
				else if(values === 'noMessage'){
					Dialog.alert({
						title: '提示',
						message: '你没有填写个人信息，请先填写哦'
					}).then(() => {
						this.$router.replace('/addUserMsg')
					});
				}
				else{
					this.user = this.$store.state.User.userInfo[0];
				}
			})
			.catch((err)=>{
				console.log(err)
				Toast('查询失败!,请重试！')
			})
		},
		methods:{
			runToUser(){
				this.$router.push('/user');
			},
			runToList(){
				this.$router.push('/list')
			},
			runToPublish(){
				this.$router.push('/publish')
			}
		},
		data(){
			return{
				status:true,
				user:''
			}
		}
	}
</script>

<style lang="less">
	.index{
		.user{
			background-color: rgba(135,206,250,0.7); 
			display: flex;
			justify-content:space-between;
			flex-direction: row;
			.logo{
				width: 200px;
				height: 50px;
			}
			.username{
				padding: 15px 5px 0px 0px;
				span{
					font-size: 0.75rem;
					letter-spacing:1px;
				}
				.name{
					color: blue;
					&:hover{
						color: white;
					}
				}
			}
		}
		.selectedList{
			margin-top: 20px;
			.van-grid-item__content{
			&:hover{
					background-color: rgba(	220,220,220,0.2);
				}
			}
		}
		.goodsTitle{
			margin:10px 0 5px 0;
			padding-left: 0.625rem;
			background-color: rgba();
			span{
				color: red;
				font-weight: bold;
				
			}
		}
		.goods{
			.van-grid-item__content{
			&:hover{
					background-color: rgba(	220,220,220,0.2);
			}
				.van-grid-item__icon{
					.van-icon__image{
						width: 3em;
						height: 4em;
						object-fit: contain;
					}
				}
			}
		}
	}
</style>
