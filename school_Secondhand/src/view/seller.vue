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
					:src="seller.u_headimg"
					@click = "imgPreview"
				/>
			</van-cell>
			<van-cell title="用户名" :value="seller.u_name"/>
			<van-cell title="性别" :value="getSex"/>
			<van-cell title="年龄" :value="seller.u_age"/>
			<van-cell title="生日" :value="seller.u_birthday"/>
			<van-cell title="联系方式" :value="seller.u_phonenum"/>
			<van-cell title="邮箱" :value="seller.u_mail"/>
			<van-cell title="QQ号" :value="seller.u_qq"/>
			<van-cell title="微信号" :value="seller.u_wechat"/>
		</van-cell-group>
	</div>
</template>

<script>
	import { Cell, CellGroup,Image,ImagePreview,Toast} from 'vant';
	export default{
		components:{
			[Cell.name]:Cell,
			[CellGroup.name]:CellGroup,
			[Image.name]:Image,
			[ImagePreview.name]:ImagePreview
		},
		created() {
			this.sellerid = JSON.parse(sessionStorage.getItem('goodsInfo')).seller_id;
			this.$http.post('userInfo/getUserInfo',{seller_id:this.sellerid})
			.then((res)=>{
				this.seller = res.data.msg[0]			
				this.seller.u_headimg = 'http://localhost:3000/'+this.seller.u_headimg
				console.log(this.seller)
			})
			.catch((e)=>{
				console.log(e)
				Toast('获取卖家信息失败,请重试！')
			})
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
			
		},
		data(){
			return{
				sellerid:'',
				seller:{}
			}
		},
		computed:{
			getSex(){
				return this.seller.u_sex === 0 ?  "男" :  "女";
			}
		},
		methods:{
			//图片预览
			imgPreview(){
				ImagePreview([
					this.seller.u_headimg
				]);
			}
		}
	}
</script>

<style>
</style>
