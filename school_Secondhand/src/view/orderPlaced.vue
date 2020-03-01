<!-- 已下单页面 -->
<template>
	<div class="orderPlaced">
		<van-card v-for="goods in orderGoodsList[0]" :key="goods.goodsid"
			num="1"
			:price="goods.price.toFixed(2)"
			:desc="goods.explain"
			:title="goods.title"
			:thumb="goods.thumb[0]"
		>
			<div slot="footer">
				<van-button size="small" type="info" round @click="confirmReceipt">收货</van-button>
				<van-button size="small" type="info" round @click="cancelOrder">退货</van-button>
			</div>
		</van-card>
	</div>
</template>

<script>
	import {Card,Button,Dialog} from 'vant'
	export default {
		components:{
			[Card.name]:Card,
			[Button.name]:Button,
			[Dialog.name]:Dialog
		},
		created() {
			
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.orderGoodsList.push([
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
				}
			])
		},
		data(){
			return{
				orderGoodsList:[]
			}
		},
		methods:{
			beforeClose(action, cancel) {
				if (action === 'confirm') {
					setTimeout((cancel), 1000);
				} 
				else {
					cancel();
				}
			},
			confirmReceipt(){
				this.$dialog.confirm({
					message: '确认收货吗？',
					beforeClose: this.beforeClose
				});
			},
			cancelOrder(){
				this.$dialog.confirm({
					message: '确认退货吗？',
					beforeClose: this.beforeClose
				});
			}
		}
		
		
	}
</script>

<style>
</style>
