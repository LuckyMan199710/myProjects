<template>
	<div class="publish">
		<van-form @submit="publishNotice">
			<van-field
				v-model="notice.noticeTitle"
				type="textarea"
				placeholder="公告标题"
				:rules="[{ required: true, message: '这里不能为空' }]"
				:autosize="{minHeight: 50}"
			/>
			<van-field
				v-model="notice.noticeInfo"
				type="textarea"
				placeholder="公告内容"
				:rules="[{ required: true, message: '这里不能为空' }]"
				:autosize="{minHeight: 200}"
			/>
					
			<van-button round block type="info" native-type="submit" style="margin-top: 50px;"> 
				发布
			</van-button>
		</van-form>
	</div>
</template>

<script>
	import {Form,Field,Button,Dialog} from 'vant' 
	export default{
		components:{
			[Form.name] : Form,
			[Field.name] : Field,
			[Button.name] :Button,
			[Dialog.name]:Dialog
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return{
				notice:{
					noticeTitle:'',
					noticeInfo:'',
				}
			}
		},
		methods:{
			//发布公告
			publishNotice(){
				this.$http.post('notice/savaNotice',{
					notice:this.notice
				})
				.then((response)=>{
					if(response.data.success === 1){
						Dialog.alert({
							message: '发布成功'
						})
						.then(() => {
							this.notice.noticeTitle = '';
							this.notice.noticeInfo = '';
						})
					}
					else{
						Dialog.alert({
							message: '发布失败！请重试！'
						})
						.then(()=>{
							close()
						})
					}
				})
				.catch(()=>{
					Dialog.alert({
						message: '发布失败！请重试！'
					})
					.then(()=>{
						close()
					})
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.publish{
		/deep/ .van-uploader__wrapper{
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			-webkit-flex-wrap: wrap;
			flex-wrap: wrap;
			justify-content: center;
		}
		
		/deep/ .van-number-keyboard {
			position: absolute;
			bottom: -150px;
		}
	}
</style>
