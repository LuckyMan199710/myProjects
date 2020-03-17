<template>
	<div class="index">
		<div class="user">
			<img class="logo" src="../assets/logo.png" alt="logo" title="logo">
			<div class="username">
				<span>欢迎登录！</span>
				<van-icon name="manager-o" />
				<span class="name" @click="runToUser">皮卡兵</span>
			</div>
		</div>
		<van-notice-bar text="通知内容" left-icon="volume-o" />
		<van-grid :column-num="3">
			<van-grid-item
				v-for="value in 6"
				:key="value"
				:icon="require('../assets/图4.jpg')"
				text="文字"
			/>
		</van-grid>
	</div>
</template>

<script>
	import {Grid,GridItem,NoticeBar,Icon } from 'vant'
	export default{
		components:{
			[Grid.name]:Grid,
			[GridItem.name]:GridItem,
			[NoticeBar.name]:NoticeBar,
			[Icon.name]:Icon 
		},
		mounted() {
			this.$store.commit('changeTabbarStatusTrue');
			this.$store.commit('changeNavBarStatusFalse');
		},
		methods:{
			runToUser(){
				this.$router.push('/user')
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="less">
	.index{
		.user{
			background-color: rgba(135,206,250,0.2);
			display: flex;
			justify-content:space-between;
			flex-direction: row;
			.logo{
				width: 60px;
				height: 40px;
			}
			.username{
				padding: 10px 5px 0px 0px;
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
</style>
