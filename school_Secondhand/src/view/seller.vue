<!-- 查看卖家 -->
<template>
	<div class="seller">
		<van-cell-group>
			<van-cell title="头像" value="内容" >
				<van-image
					width="40px"
					height="40px"
					fit="cover"
					round
					:src="seller.img"
					@click = "imgPreview"
				/>
			</van-cell>
			<van-cell title="用户名" :value="seller.name"/>
			<van-cell title="性别" :value="getSex"/>
			<van-cell title="年龄" :value="seller.age"/>
			<van-cell title="生日" :value="seller.name"/>
			<van-cell title="联系方式" :value="seller.phoneNum"/>
			<van-cell title="邮箱" :value="seller.email"/>
			<van-cell title="QQ号" :value="seller.QQnum"/>
			<van-cell title="微信号" :value="seller.wechatnum"/>
		</van-cell-group>
	</div>
</template>

<script>
	import { Cell, CellGroup,Image,ImagePreview} from 'vant';
	export default{
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Image.name]:Image,
			[ImagePreview.name]:ImagePreview
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return{
				seller : {
					name:"飞翔的鱼",
					img:require('../assets/头像.jpg'),
					sex:1,
					age:30,
					birthday:"1990/01/25",
					phoneNum:"13643015361",
					email:"6256325410@qq.com",
					QQnum:"1292082463",
					wechatnum:"1292004645"
				}
			}
		},
		computed:{
			getSex(){
				return this.seller.sex === 0 ?  "男" :  "女";
			}
		},
		methods:{
			//图片预览
			imgPreview(){
				ImagePreview([
					this.seller.img
				]);
			}
		}
	}
</script>

<style>
</style>
