<template>
  <div class="user">
	<div class="head">
		<van-image
			round
			width="90px"
			height="90px"
			fit="cover"
			:src=imgPath
			@click="imgPreview"
		>
			<template v-slot:error>加载失败</template>
		</van-image>
		<div class="userInfo">
			<span>{{user.u_name}}</span>
		</div>
	</div>
    <van-row class="user-links" >
      <van-col span="12" @click = "runToCollection">
        <van-icon name="pending-payment" />
        已收藏
      </van-col>
      <van-col span="12">
        <van-icon name="logistics" @click="runToDeliver"/>
        已发布
      </van-col>
    </van-row>

    <!-- <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link to="/allOrder"/>
    </van-cell-group> -->

    <van-cell-group>
      <van-cell icon="manager-o" title="个人信息" to="/usermsg" is-link />
     <!-- <van-cell icon="star-o" title="我的收藏" to="/myCollection" is-link /> -->
      <van-cell icon="close" title="退出登录" @click="out" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup,Image,ImagePreview,Dialog,Toast} from 'vant';
export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
	[Image.name]:Image,
	[ImagePreview.name]:ImagePreview 
  },
  created() {
	this.user = this.$store.state.User.userInfo[0];
	this.imgPath = 'http://localhost:3000/'+this.user.u_headimg;
  },
  mounted() {
    this.$store.commit('changeTabbarStatusTrue');
    this.$store.commit('changeNavBarStatusFalse');
	this.$store.commit('changeTabbarStatusIndex',2);
  },
  data(){
	return{
		user:null,
		imgPath:'' //图片地址
	}
  },
  methods:{
	runToCollection(){
		this.$router.push('./myCollection');
	},
	runToDeliver(){
		this.$router.push('./deliver')
	},
	imgPreview(){
		ImagePreview([
			'http://localhost:3000/'+this.user.u_headimg,
		]);
	},
	//退出登录
	out(){
		Dialog.confirm({
			message: '您确定退出登录吗'
		}).then(() => {
			this.$http.get('userInfo/logout').then((res)=>{
				//成功退出 清除缓存
				if(res.data.success === 1){
					Toast('退出成功')
					sessionStorage.clear();
					this.$router.push('/login')		
				}
			})
		}).catch(() => {
			close();
		});
	}
  }
};
</script>

<style lang="less">
.user {
  .head{
	height: 300px;
	width: 100%;
	background: url(../assets/background/背景.jpg);
	display: flex;
	flex-direction:column;
	justify-content:center;
	align-items:center;
	.userInfo{
		color: black;
		margin-top: 1.25rem;
	}
  }
  &-poster {
    width: 100%;
    height: 53vw;
    display: block;
  }

  &-group {
    margin-bottom: 15px;
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>
