//登录界面
<template>
	<div class="login">
		<van-form @submit="onSubmit">
			<van-field
				v-model="username"
				name="username"
				label="账号"
				placeholder="账号"
				left-icon="manager-o"
				:rules="[{ required: true, message: '请填写账号' }]"
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
		<div style="margin: 16px;">
				<van-button round block type="info" native-type="submit">
					登录
				</van-button>
		</div>
		</van-form>
		<div class="other">
			<router-link to="/register">注册账号</router-link>
			<router-link to="/changePwd">修改密码</router-link>
		</div>
		
	</div>	
</template>

<script>
	import {Form,Field,Button,Toast,Icon} from 'vant'
	export default{
		components:{
			[Form.name] : Form,
			[Field.name] : Field,
			[Button.name] : Button,
			[Toast.name] : Toast,
			[Icon.name] :Icon
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusFalse');
		},
		data(){
			return{
				username: '',
				password: ''
			}
		},
		methods:{
			onSubmit(values) {
				//请求后返回的是一个promise对象 this已经被改变了 所以在外层先把vue对象(this)赋值给一个变量
				let that = this; 
				this.$http.post('user/login',{
					userName:values.username,
					userPwd:values.password
				})
				.then(function (response) {
					if(response.data.msg === 'success' ){ //success表示操作成功
						Toast('登陆成功!');
						that.$router.push('/home')
					}
					else{
						Toast('请检查您的账号和密码是否有误！')
					}
				})
				.catch(function (error) {
					console.log(error);
				}); 
			}
		}
	}
</script>

<style lang="less" scoped>
	.login{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: url(../assets/background/登录页背景.jpg);
		
		/deep/ .van-cell{
			background-color: transparent;
		}
		.other{
			font-size: 0.875rem;
			width: 70%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
