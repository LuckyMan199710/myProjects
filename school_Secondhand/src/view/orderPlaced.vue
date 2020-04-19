<!-- 已下单页面 -->
<template>
	<div class="orderPlaced">
		<van-card v-for="(goods,index) in orderGoodsList[0]" :key="goods.goodsid"
			:index="index"
			num="1"
			:price="goods.price.toFixed(2)"
			:desc="goods.explain"
			:title="goods.title"
			:thumb="goods.thumb[0]"
		>
			<div slot="footer">
				
				<van-tag type="danger" plain v-show="tagStatus(goods.status)">交易关闭</van-tag>
				<van-button size="small" type="info" round @click="confirmReceipt(this,goods)" v-show="cancelButtonStatus(goods.status)">收货</van-button>
				<van-button size="small" type="info" round @click="cancelOrder(this,goods)" v-show="cancelButtonStatus(goods.status)">取消</van-button>
				<van-tag type="danger" plain v-show="tagStatus(goods.status)">交易成功</van-tag>
			</div>
		</van-card>
				
	</div>
</template>

<script>
	import {Card,Button,Dialog,Tag,Rate,Popup,Toast} from 'vant'
	export default {
		components:{
			[Card.name]:Card,
			[Button.name]:Button,
			[Dialog.name]:Dialog,
			[Tag.name]:Tag,
			[Rate.name]:Rate,
			[Popup.name]:Popup,
			[Toast.name]:Toast
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');this.$store.commit('changeTitleName',this.$route.meta.title);
			this.$store.commit('changeTitleName',this.$route.meta.title);
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
					],
					status:'交易中',
					star:'0'
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
					],
					status:'交易中',
					star:'0'
				}
			])
		},
		data(){
			return{
				orderGoodsList:[],
				show:false,
				value:0,
				obj:null  //临时存放一个对象进行修改
			}
		},
		computed:{
			//根据不同的状态来判断该物品是退货还是确认收货，退货则等待
			cancelButtonStatus(){
				return function(status){
					if(status === '交易中'){
						return true;
					}
					else{
						return false;
					}
				}
			},
			tagStatus(){
				return function(status){
					if(status === '退货中'){
						return true;
					}
					else{
						return false;
					}					
				}
			},
			okButtonStatus(){
				return function(status){
					if(status === '确认收货'){
						return true;
					}
					else{
						return false;
					}
				}
			}
		},
		methods:{
			confirmReceipt(e,goods){
				this.$dialog.confirm({
					message: '确认收货吗？',
					beforeClose:function(action,cancel){
						if (action === 'confirm') {
							setTimeout(()=>{
								goods.status = '确认收货'
								console.log(goods)
								cancel();
							}, 1000);
						} 
						else {
							cancel();
						}
					}
				});
			},
			cancelOrder(e,goods){
				this.$dialog.confirm({
					message: '确认退货吗？',
					beforeClose: function(action, cancel){
						if (action === 'confirm') {
							setTimeout(()=>{
								goods.status = '退货中'
								cancel();
							}, 1000);
						} 
						else {
							cancel();
						}
					}
				});
			},
			ratePopupShow(goods){
				this.show = true;
				this.obj = goods;
			},
			submitRate(){
				this.obj.star = this.value;
				this.value = 0;
				this.show = false;
				//异步操作 后台返回200
				if(this.obj){
					Toast('评价成功')
				}
			}
		}	
	}
</script>

<style lang="less" scoped>
	.orderPlaced{
		.popup{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;	
		}
	}
</style>
