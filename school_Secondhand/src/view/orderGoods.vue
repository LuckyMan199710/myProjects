<!-- 下单界面 -->
<template>
	<div class="orderGoods">
		<van-address-list
			v-model="chosenAddressId"
			:list="list"
			default-tag-text="默认"
			add-button-text ="提交订单"
			@add = "order"
		/>
		<van-card
			num="1"
			:price="goods.price.toFixed(2)"
			:desc="goods.explain"
			:title="goods.title"
			:thumb="goods.thumb[0]"
		>
			<div slot="price-top">
				{{'卖家:'+goods.sellerName}}
			</div>
		</van-card>
	</div>
</template>

<script>
	import {AddressList,Card,Dialog} from 'vant'
	export default{
		components:{
			[AddressList.name] : AddressList,
			[Card.name]:Card,
			[Dialog.name]:Dialog
		},
		created() {
			this.goods = this.$route.params;
		},
		mounted() {
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return {
				chosenAddressId: '1',
				list: [
						{
						id: '1',
						name: '张三',
						tel: '13000000000',
						address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
						}
				],
				goods:null
			}
		},
		methods:{
			order(){
				Dialog.alert({
					title: '信息',
					message: '下单成功！'
				}).then(() => {
					this.$router.push('./user')
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.orderGoods{
		.van-address-list{
			padding-bottom: 0;
		}
	}
	
</style>
