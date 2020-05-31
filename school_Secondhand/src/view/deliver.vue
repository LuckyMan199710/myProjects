<!-- 查看卖家发货 -->
<template>
	<div class="deliver">
		<van-card
			v-for="(goods,index) in goods"
			:key ="index"
			num="1"
			:price="goods.good_price.toFixed(2)"
			:desc="goods.good_info"
			:title="goods.good_title"
			:thumb="goods.good_img_url"
		>
			<div slot="footer">
				<van-button plain type="danger" size="mini" round @click="underCarriage(goods)">下架</van-button>
			</div>
		</van-card>
	</div>
</template>

<script>
	import {Card,Tag,Button,Toast,Dialog} from 'vant'
	export default{
		components:{
			[Card.name] : Card,
			[Tag.name] : Tag,
			[Button.name] : Button
		},
		created(){
			this.$http.post('userInfo/getUserPublish')
			.then((res)=>{
				if(res.data.success === 1){
					this.goods = res.data.msg;
					for(let i =0; i<this.goods.length; i++){
						this.goods[i].good_img_url = ' http://localhost:3000/' + this.goods[i].good_img_url;
					}
				}
			})
			.catch((e)=>{
				console.log(e)
			})
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return {
				goods:[]
			}
		},
		methods:{
			//下架发布的信息
			underCarriage(e){
				Dialog.confirm({
					message: '您确定删除该信息吗'
				}).then(() => {
					this.$http.post('userInfo/delUserPublish',{good_id:e.good_id})
					.then((res)=>{
						//成功退出 清除缓存
						if(res.data.success === 1){
							Toast('删除成功')
							sessionStorage.clear('goodList');
							this.$router.push('/user')		
						}
					})
				}).catch(() => {
					close();
				});
			}
		}
	}
</script>

<style>
</style>
