<template>
	<div class="List">
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			:error.sync="error"
			error-text="请求失败，请重新加载"
		>
			<van-card
				v-for="(item) in list"
				:key="item.good_id"
				:price="item.good_price"
				:desc="item.good_info"
				:title="item.good_title"
				:thumb="item.good_img_url"
				@click = "runToGoods($event,item)"
			>
			</van-card>	
		</van-list>
	</div>
</template>

<script>
	import { List,Card,Tag} from 'vant';
	export default{
		name:"list",
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');	
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		components:{
			[List.name]: List,
			[Card.name]: Card,
			[Tag.name]: Tag,			
		},
		data() {
			return {
			list: [],
			loading: false,
			finished: false,
			error:false,
			keybord:'',
			search:''
			};
		},
		methods: {
			onLoad() {
				if(this.$route.params.keyboard){
					sessionStorage.setItem('keybord',this.$route.params.keyboard);
					this.keybord = this.$route.params.keyboard;
					if(this.$route.params.keyboard === 'search'){
						sessionStorage.setItem('searchInfo',this.$route.params.search);
						this.search = this.$route.params.search
					}
				}
				else{
					this.keybord = sessionStorage.getItem('keybord')
					this.search = sessionStorage.getItem('searchInfo')
				}				
				/* if(sessionStorage.getItem()) */						
				console.log(sessionStorage.getItem('keybord'))
				if(this.keybord === 'search'){
					this.$http.post('/goodsInfo/getGoodsInfo',{
						param:'search',
						searchInfo:this.search
					})
					.then((res)=>{
						if(res.data.success === 1){
							for(let i = 0; i<res.data.goodsList.length;i++){
								this.list.push(res.data.goodsList[i])
								this.list[i].good_img_url = 'http://localhost:3000/'+res.data.goodsList[i].good_img_url;
								this.list[i].good_price = (res.data.goodsList[i].good_price).toFixed(2);
							}
							this.loading = false;
							// 数据全部加载完成
							if (this.list.length >= res.data.goodsList.length ) {
								this.finished = true;
							}
							/* this.list = res.data.goodsList*/
						}
					})
					.catch(()=>{
						this.error = true;
					})
				}
				else{
					this.$http.post('/goodsInfo/getGoodsInfo')
					.then((res)=>{
						if(res.data.success === 1){
							for(let i = 0; i<res.data.goodsList.length;i++){
								this.list.push(res.data.goodsList[i])
								this.list[i].good_img_url = 'http://localhost:3000/'+res.data.goodsList[i].good_img_url;
								this.list[i].good_price = (res.data.goodsList[i].good_price).toFixed(2);
							}
							this.loading = false;
							// 数据全部加载完成
							if (this.list.length >= res.data.goodsList.length ) {
								this.finished = true;
							}
							/* this.list = res.data.goodsList*/
						}
					})
					.catch(()=>{
						this.error = true;
					})
				}		
			},
			runToGoods(e,item){
				this.$router.push('/goods');
				sessionStorage.setItem('goodsInfo',JSON.stringify(item))
			}
		}
	}
</script>

<style scoped>
</style>
