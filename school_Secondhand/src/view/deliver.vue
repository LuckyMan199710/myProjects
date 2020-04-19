<!-- 查看卖家发货 -->
<template>
	<div class="deliver">
		<van-card
			num="1"
			price="2.00"
			desc="描述信息"
			title="商品标题"
			thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
		>
			<div slot="footer">
				<van-tag plain type="danger">交易中</van-tag>
			</div>
		</van-card>
	</div>
</template>

<script>
	import {Card,Tag} from 'vant'
	export default{
		components:{
			[Card.name] : Card,
			[Tag.name] : Tag
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
			this.$http.post('/goodsInfo/getGoodsInfo')
			.then((res)=>{
				if(res.data.success === 1){
					this.goodsList = res.data.goodsList
					console.log(this.goodsList)
				}
			})
			.catch(()=>{
				
			})
		}
	}
</script>

<style>
</style>
