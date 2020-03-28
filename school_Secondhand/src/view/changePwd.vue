<template>
	<div class="changePwd">
		<van-form validate-first>
			<van-field
				v-model="phoneNum"
				label="账号"
				placeholder="请输入您的账号"
				:rules="[{ pattern, message: '请输入正确的手机号' }]"
			/>
			
			<van-field
				center
				clearable
				label="验证码"
				placeholder="请输入短信验证码"
				v-model="code"
			>
				<template #button>
					<van-button size="small" type="info" @click="sendCode" v-show="show">发送验证码</van-button>
					<van-button size="small" type="info"  v-show="!show" disabled >{{count}}s</van-button>
				</template>
			</van-field>
			
			<div style="margin: 16px;">
					<van-button round block type="info" native-type="submit">
						修改密码
					</van-button>
			</div>
		</van-form>
	</div>	
</template>

<script>
	import {Form,Field,Button,Toast} from 'vant' 
	export default{
		components:{
			[Form.name] : Form,
			[Field.name] :Field,
			[Button.name] :Button,
			[Toast.name] : Toast
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
		},
		data(){
			return {
				phoneNum:'',
				pattern:/^[1][3,4,5,7,8][0-9]{9}$/  ,//手机号码正则表达式
				show:true,
				count:'',
				timer: null, //定时器
				code:''
			}
		},
		methods:{
			sendCode(){
				if(this.phoneNum.trim() === '' || !this.pattern.exec(this.phoneNum)){
					Toast('请输入正确的账号！')
				}
				else{
					Toast('验证码已发送,请注意查收');
					const TIME_COUNT = 60;
					if(!this.timer) {
						this.count = TIME_COUNT;
						this.show = false;
						this.timer = setInterval(() => {
							if (this.count > 0 && this.count <= TIME_COUNT) {
								this.count--;
							}
							else{
								this.show = true;
								clearInterval(this.timer);
								this.timer = null;
							}
						},1000)
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.changePwd{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: url(../assets/background/修改密码页背景.jpg);
		
		/deep/ .van-cell{
			background-color: transparent;
		}
	}
</style>