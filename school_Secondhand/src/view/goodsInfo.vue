<template>
	<div class="goodInfo">
		<van-cell-group :title="goods.title">
			<van-cell title="价格" :value="'￥'+goods.price.toFixed(2)" />
		</van-cell-group>
		<van-cell-group title="介绍">
			<van-cell :value="goods.explain" />
		</van-cell-group>
		<img v-for="img in goods.thumb" v-lazy="img" :key='img.index' fit="contain">
	</div>
</template>

<script>
	import{Cell,CellGroup} from 'vant'
	export default{
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup
		},
		data(){
			return{
				goods:null   //用来接受商品卡片传过来的对象
			}
		},
		created() {
			this.goods = this.$route.params;
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
		}
	}
</script>

<style lang="less" scoped>
	.goodInfo{
		.van-cell__value{
			color:red
		}
		.van-cell__value--alone{
			color:black
		}
	}
</style>
