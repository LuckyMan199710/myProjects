<template>
	<div class="register">
		<van-form validate-first @submit="onSubmit">
			<van-field
				v-model="emailNum"
				left-icon="manager-o"
				name="emailNum"
				label="账号"
				placeholder="邮箱"
				:rules="[{ pattern, message: '请输入正确的邮箱' }]"
			/>
			<van-field
				v-model="password"
				type="password"
				name="password"
				label="密码"
				placeholder="密码"
				left-icon="smile-comment-o"
				:rules="[{ required: true, message: '请填写密码' }]"
			/>
			<van-field
				center
				clearable
				label="验证码"
				left-icon="chat-o"
				placeholder="请输入邮箱验证码"
				name="code"
				v-model="code"
			>
				<template #button>
					<van-button size="small" type="info" @click="sendCode" v-show="show" native-type="button">发送验证码</van-button>
					<van-button size="small" type="info"  v-show="!show" disabled >{{count}}s</van-button>
				</template>
			</van-field>
			
			
			<div style="margin: 16px;">
					<van-button round block type="info" native-type="submit">
						注册账号
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
				emailNum:'',
				pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/  ,//邮箱号码正则表达式
				show:true,
				count:'',
				timer: null, //定时器
				code:'', //验证码
				password:''
			}
		},
		methods:{
			sendCode(){
				if(this.emailNum.trim() === '' || !this.pattern.exec(this.emailNum)){
					Toast('请输入正确的账号！')
				}
				else{
					this.$http.get('http://localhost:3000/user/sendCode',{
						params: {
							userName: this.emailNum
						}
					})
					.then((response) => {
						if(response.data.msg === 'success'){
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
						else{
							console.log(response)
							Toast('验证码发送失败！请重试！');
						}					
					})
					.catch((error) => {
						Toast('验证码发送失败！请重试！');
						console.log(error);
					})
				}		
			},
			onSubmit(values){
				if(values.code === ''){
					Toast('请输入验证码!')
				}
				else if(values.password.length<8){
					Toast('密码长度必须大于8位！')
				}
				else{
					this.$http.post('http://localhost:3000/user/register',{
						emailNum:values.emailNum,
						password:values.password,
						code:values.code
					})
					.then((response) => {
						if(response.data.msg === 'userName already exists'){
							Toast('账号已存在！')
						}
						else if(response.data.msg === 'failed to save data!'){
							Toast('注册失败！请重试！')
						}
						else if(response.data.msg === 'error code'){
							Toast('验证码错误！')
						}
						else{
							Toast('注册成功！')
							this.$router.push('/login');
						}
					})
					.catch(() => {
						Toast('注册失败！请重试！')
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.register{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: url(../assets/background/注册页背景.jpg);
		
		/deep/ .van-cell{
			background-color: transparent;
		}
	}
</style>
