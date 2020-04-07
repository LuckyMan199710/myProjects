<template>
	<div class="changePwd" >
		<van-form validate-first @submit="onSubmit">
			<van-field
				v-model="emailNum"
				name="emailNum"
				left-icon="manager-o"
				label="账号"
				placeholder="请输入您的账号"
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
				name="code"
				label="验证码"
				left-icon="chat-o"
				placeholder="请输入邮箱验证码"
				v-model="code"
			>
				<template #button>
					<van-button size="small" type="info" @click="sendCode" v-show="show" native-type="button">发送验证码</van-button>
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
				emailNum:'',
				pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/  ,//邮箱号码正则表达式
				show:true,
				count:'',
				timer: null, //定时器
				code:'',
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
						if(response.data.msg === "success"){
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
							Toast('验证码发送失败！请重试！');
						}
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
					this.$http.post('http://localhost:3000/user/changePwd',{
						emailNum:values.emailNum,
						password:values.password,
						code:values.code
					})
					.then((response)=>{
						if(response.data.msg === "userName not found"){
							Toast('该账号不存在！');
						}
						else if(response.data.msg === "success"){
							Toast('修改密码成功！');
							this.$router.push('/login')
						}
						else if(response.data.msg === 'error code'){
							Toast('验证码错误！')
						}
						else{
							Toast('修改失败！请重试！')
						}
					})
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