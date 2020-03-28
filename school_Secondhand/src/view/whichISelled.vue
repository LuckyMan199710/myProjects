<!-- 我卖出的 -->
<template>
	<div class="whichISelled">
			<van-card
				num="1"
				price="2.00"
				desc="描述信息"
				title="商品标题"
				thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
			>
				<div slot="footer">
					<van-tag plain type="danger">买家已退货</van-tag>
				</div>
			</van-card>
	</div>
</template>

<script>
	import {Card,Tag} from 'vant'
	export default{
		components:{
			[Card.name] :Card,
			[Tag.name]:Tag
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse'); //使导航栏消失避免占用空间
			this.$store.commit('changeNavBarStatusTrue'); 
			this.$store.commit('changeTitleName',this.$route.meta.title);
		}
	}
</script>
	
<style>
</style>
