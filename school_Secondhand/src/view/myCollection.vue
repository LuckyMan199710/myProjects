<!-- 我的收藏 -->
<template>
	<div class="myCollection">
		<van-checkbox-group v-model="selectedGoods" class="Card_group" ref="checkboxGroup" @change=getCheckedTrue>			
			<van-checkbox 
				v-for="goods in Collectedgoods"
				:key ="goods.goodsid"
				:name="goods.goodsid"
				class="Card_group_item" 
				>
				<van-card
					num="1"
					:price="goods.price.toFixed(2)"
					:desc="goods.explain"
					:title="goods.title"
					:thumb="goods.thumb[0]"
				/>
			</van-checkbox>
		</van-checkbox-group>
		<van-submit-bar
			button-text="删除"
			@submit="onDelete"
		>
			<van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
		</van-submit-bar>
	</div>
</template>

<script>
	import {Checkbox,CheckboxGroup,Card,SubmitBar} from 'vant'
	export default{
		components:{
			[Checkbox.name]:Checkbox,
			[CheckboxGroup.name]:CheckboxGroup,
			[Card.name]:Card,
			[SubmitBar.name]:SubmitBar 
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse'); //使导航栏消失避免占用空间
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return {
				selectedGoods:[], //保存选中的商品
				checked:false,
				checkedAll:false,
				Collectedgoods:[
				{ 
					goodsid:1,
					sellerId:101,
					sellerName:"飞翔的鱼",
					title: '苹果6二手',
					price: 999,
					express: '免运费',
					explain:"因为换新手机用不到了所以出了，功能正常，换过屏幕，有意者加vx，可小刀，恶意骚扰者请绕道",
					thumb: [
						require('../assets/timg.jpg'),
						require('../assets/图2.jpg'),
						require('../assets/图3.jpg')
					]
				},
				{
					goodsid:2,
					sellerId:102,
					sellerName:"遁地的牛",
					title: 'iphone x二手',
					price: 1999,
					express: '免运费',
					explain:"面部解锁失效 其他功能正常 要的私聊我vx",
					thumb: [
						require('../assets/图4.jpg'),
						require('../assets/图片5.jpg'),
						require('../assets/图片6.jpg')
					]
				}]				
			}
		},
		methods:{
			onDelete(){
				console.log(this.selectedGoods)
			},
			//全选按钮功能
			checkAll() {			
				this.checkedAll = !this.checkedAll
				console.log(this.checkedAll)
				this.$refs.checkboxGroup.toggleAll(this.checkedAll)
			},
			getCheckedTrue(){
				if(this.selectedGoods.length === this.Collectedgoods.length){
					this.checked = true;
				}
				else{
					this.checked = false;
				}
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
