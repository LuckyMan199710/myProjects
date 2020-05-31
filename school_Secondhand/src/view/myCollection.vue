<!-- 我的收藏 -->
<template>
	<div class="myCollection">		
				<van-card
					v-for="(goods,index) in Collectedgoods"
					@click="runToGoods(goods)"
					:key ="index"
					class="Card_group_item"
					num="1"
					:price="goods.good_price.toFixed(2)"
					:desc="goods.good_info"
					:title="goods.good_title"
					:thumb="goods.good_img_url"
				/>
	</div>
</template>

<script>
	import {Checkbox,CheckboxGroup,Card,SubmitBar,Toast} from 'vant'
	export default{
		components:{
			[Checkbox.name]:Checkbox,
			[CheckboxGroup.name]:CheckboxGroup,
			[Card.name]:Card,
			[SubmitBar.name]:SubmitBar 
		},
		created(){
			this.$http.post('userInfo/getAllCollection',{})
			.then((res)=>{
				if(res.data.success === 1){
					this.Collectedgoods = res.data.msg
					for(let i =0; i<this.Collectedgoods.length; i++){
						this.Collectedgoods[i].good_img_url = ' http://localhost:3000/' + this.Collectedgoods[i].good_img_url;
					}
				}
				else{
					Toast('获取数据失败')
				}
			})
			.catch((err) => {
				Toast('获取数据失败')
				console.log(err)
			})
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse'); //使导航栏消失避免占用空间
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return {
				Collectedgoods:[]				
			}
		},
		methods:{
			runToGoods(e){
				this.$router.push({name:'goods',params:{good_id:e.good_id}})
			}
		}
	}
</script>

<style lang="less">
.myCollection{
	.Card_group{
		padding: 10px;
		background-color: #fff;
		
		&_item{
			position: relative;
			background-color: #fafafa;
			
			.van-checkbox__label {
				width: 100%;
				height: auto;
				padding: 0;
				box-sizing: border-box;
			}
			.van-checkbox__icon {
				top: 50%;
				z-index: 1;
				position: absolute;
				margin-top: -10px;
			}
			.van-card__price{
				color: red;
			}
		}
	}
	.van-submit-bar__bar{
		justify-content :space-between
	}
}
	
</style>
