<template>
	<div class="userMsg">
		<van-panel title="我的信息">      
          <van-image
			class="avatar"
            round
            fit="cover"
            width="50"
			:src="getimg"
            height="50"       
          />
           <div style="display: inline-block; margin-left: 0.625rem;">
             <p class="name">{{user.u_name}}</p>
             <p class="address">{{user.u_area}}</p>
           </div>
          <van-cell-group>
			<van-cell title="性别"  icon="friends-o"  :value="getSex" />
			<van-cell title="年龄"  icon="comment-o"  :value="user.u_age" /> 
			<van-cell title="生日"  icon="birthday-cake-o"  :value="user.u_birthday" />
            <van-cell title="联系电话"  icon="phone-o"  :value="user.u_phonenum" />
			<van-cell title="邮箱"  icon="envelop-o"  :value="user.u_mail" />
			<van-cell title="QQ"  icon="http://pic.51yuansu.com/pic3/cover/00/69/37/58ab18e477752_610.jpg"  :value="user.u_qq" />
			<van-cell title="微信"  icon="http://img2.imgtn.bdimg.com/it/u=3838248306,1853307012&fm=26&gp=0.jpg"  :value="user.u_wechat" />
          </van-cell-group>
          <div slot="footer">
			<van-button 
				color="linear-gradient(to right, #4bb0ff, #6149f6)" 
				@click = "runtoChangeUserMsg"
				block>修改信息
			</van-button>
          </div>
		</van-panel>
	</div>
	
</template>

<script>
	import { Image,Panel,Field,CellGroup,Cell,Col,Row,Button} from 'vant';
	export default{
		components:{
			[Image.name]: Image,
			[Panel.name]: Panel,
			[Field.name]: Field,
			[CellGroup.name]: CellGroup,
			[Cell.name]: Cell,
			[Col.name]: Col,
			[Row.name]: Row,
			[Button.name]: Button
		},
		created() {
			this.user = this.$store.state.User.userInfo[0];
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return{
				user:null,
				imgPath:''
			}
		},
		computed:{
			getSex(){
                return this.user.u_sex === 0 ?  "男" :  "女"
			},
			getimg(){
				return 'http://localhost:3000/'+this.$store.state.User.userInfo[0].u_headimg;
				
			}
		},
		methods:{
			runtoChangeUserMsg (){
				this.$router.push('/changeUmsg');
			}
		}		
	}
</script>

<style lang="less">
	.userMsg{
		.avatar{
			margin-left: 1.25rem;
		}
		.name{
			margin: 0.3125rem; 
			color: blue;
		}
		.address{
			margin: 0.3125rem;
			font-size: 12px;
			color:rgba(69, 90, 100, 0.6) ;
		}
	}
</style>
