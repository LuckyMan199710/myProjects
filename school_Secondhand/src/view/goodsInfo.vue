<template>
	<div class="goodInfo">
		<van-cell-group :title="goods.good_title">
			<van-cell title="价格" :value="'￥'+ parseFloat(goods.good_price).toFixed(2)" />
		</van-cell-group>
		<van-cell-group title="介绍">
			<van-cell :value="goods.good_info" />
		</van-cell-group>
		<img v-for="(img,index) in imgList" v-lazy="img" :key='index' fit="fill	">
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
				goods:null,//用来接受商品卡片传过来的对象
				imgList:[]
			}
		},
		created() {
			JSON.parse(sessionStorage.getItem('goodsInfo'))
			this.goods = JSON.parse(sessionStorage.getItem('goodsInfo'));
			this.imgList = this.goods['GROUP_CONCAT(gis.good_img_url)'].split(',').map(item => {
				return 'http://localhost:3000/' + item
			});
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		}
	}
</script>

<style lang="less" scoped>
	.goodInfo{
		img{
			width: 100%;
		}
		.van-cell__value{
			color:red
		}
		.van-cell__value--alone{
			color:black
		}
	}
</style>
