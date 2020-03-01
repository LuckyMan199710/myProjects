<template>
	<div class="userMsg">
		<van-panel title="我的信息">      
          <van-image
			class="avatar"
            round
            fit="cover"
            width="50"
            height="50"
            :src="Person.img"
          />
           <div style="display: inline-block; margin-left: 0.625rem;">
             <p class="name">{{Person.name}}</p>
             <p class="address">{{getAddress}}</p>
           </div>
          <van-cell-group>
			<van-cell title="性别"  icon="friends-o"  :value="getSex" />
			<van-cell title="年龄"  icon="comment-o"  :value="Person.age" /> 
			<van-cell title="生日"  icon="birthday-cake-o"  :value="Person.birthday" />
            <van-cell title="联系电话"  icon="phone-o"  :value="Person.phoneNum" />
			<van-cell title="邮箱"  icon="envelop-o"  :value="Person.email" />
			<van-cell title="学院"  icon="description"  :value="Person.college" />
			<van-cell title="班级"  icon="hotel-o"  :value="Person.grade" />
			<van-cell title="住址"  icon="wap-home-o"  :value="Person.address" />
			<van-cell title="QQ"  icon="http://pic.51yuansu.com/pic3/cover/00/69/37/58ab18e477752_610.jpg"  :value="Person.QQnum" />
			<van-cell title="微信"  icon="http://img2.imgtn.bdimg.com/it/u=3838248306,1853307012&fm=26&gp=0.jpg"  :value="Person.wechatnum" />
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
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
		},
		data(){
			return{
				Person:{
					img:"https://img.yzcdn.cn/vant/cat.jpeg",
					name:"皮卡兵",
					province:"广东省",
					city:"广州市",
					sex:0,
					age:22,
					birthday:"1997/10/17",
					phoneNum:"17878125482",
					email:"1292082437@qq.com",
					college:"电子与信息工程学院",
					grade:"物联本163班",
					address:"西4栋107",
					QQnum:"1292082463",
					wechatnum:"1292004645"
				}
				
			}
		},
		computed:{
			getAddress(){
				return this.Person.province + " " + this.Person.city;
			},
			getSex(){
                return this.Person.sex === 0 ?  "男" :  "女"
			}
		},
		methods:{
			runtoChangeUserMsg (){
				this.$router.push({name:'changeUmsg',params:this.Person});
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
