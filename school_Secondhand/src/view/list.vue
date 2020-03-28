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
				tag="秒杀"
				:key="item"
				num="2"
				price="2.00"
				desc="描述信息"
				title="衣服"
				thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
				origin-price="10.00"
				@click = "runTo()"
			>
				<div slot="tags">
					<van-tag plain type="danger">标签</van-tag>
					<van-tag plain type="danger">标签</van-tag>
				</div>
			</van-card>	
		</van-list>
	</div>
</template>

<script>
	import { List,Card,Tag,Toast} from 'vant';
	export default{
		name:"list",
		created() {
			
		},
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
			id:0,
			loading: false,
			finished: false,
			error:false,
			};
		},
		methods: {
			onLoad() {
			// 异步更新数据
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
					this.list.push(this.list.length + 1);
					}
					// 加载状态结束
					this.loading = false;
					
					if(Math.random()>0.5){
						this.error = true;
					}
					
					// 数据全部加载完成
					if (this.list.length >= 40) {
						this.finished = true;
					}
				}, 500);
			},
			runTo(){
				this.$router.push('/goods');
			},
			onClickLeft() {
				window.history.go(-1);
				
			},
			onClickRight() {
				Toast('按钮');
			}
		}
	}
</script>

<style scoped>
</style>
