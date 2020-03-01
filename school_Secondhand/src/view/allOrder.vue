<!-- 全部订单 -->
<template>
	<div class="allOrder">
		<van-swipe-cell :before-close="beforeClose">
			<van-card
				num="2"
				price="2.00"
				desc="描述信息"
				title="商品标题"
				class="goods-card"
				thumb="https://img.yzcdn.cn/vant/cat.jpeg"
			>
				<div slot="tags">
					<van-tag plain type="danger">交易成功</van-tag>
				</div>
			</van-card>
			<van-button
				slot="right"
				square
				text="删除"
				type="danger"
				class="delete-button"
			/>
		</van-swipe-cell>
		
		<van-swipe-cell :before-close="beforeClose">
			<van-card
				num="1"
				price="199.00"
				desc="8成新,前面屏幕坏"
				title="二手iphone6"
				class="goods-card"
				:thumb="imageURL[0]"
			>
				<div slot="tags">
					<van-tag plain type="danger">交易成功</van-tag>
				</div>
			</van-card>
			<van-button
				slot="right"
				square
				text="删除"
				type="danger"
				class="delete-button"
			/>
		</van-swipe-cell>
	</div>
</template>

<script>
	import {SwipeCell,Card,Button,Dialog,Tag} from 'vant'
	export default{
		components:{
			[SwipeCell.name] : SwipeCell,
			[Card.name] : Card,
			[Button.name] : Button,
			[Dialog.name] : Dialog,
			[Tag.name] : Tag
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
		},
		data(){
			return {
				imageURL:[require('../assets/timg.jpg'),
				require('../assets/蛋糕.png')
				]
			}
		},
		methods:{
			beforeClose({ position, instance }){
				switch (position) {
					case 'left':
					case 'cell':
					case 'outside':
						instance.close();
						break;
					case 'right':
					Dialog.confirm({
					message: '确定删除吗？'
					}).then(() => {
						instance.close();
					});
					break;
				}				  
			}
		}
	}
</script>

<style lang="less" scoped>
	.allOrder{
		.goods-card {
			margin:0 ;
			background-color: white;
		}	
		.delete-button {
			height: 100%;
		}
	}
</style>
