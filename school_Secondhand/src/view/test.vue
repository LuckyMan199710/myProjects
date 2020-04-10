<template>
	<van-uploader :after-read='onRead' v-model='fileList' multiple :max-count='1'/>
</template>

<script>
	import {Uploader} from 'vant'
	export default{
		components:{
			[Uploader.name]:Uploader
		},
		data(){
			return {
				fileList:[]
			}
		},
		methods:{
			onRead(file){
				console.log(file);
				let formdata = new FormData();
				formdata.append('user',file.file);
				this.$http.post('http://localhost:3000/file/upload',formdata)
				.then((res)=>{
					console.log(res)
				})
				.catch(()=>{
					console.log('上传失败')
				})
			}
		}
	}
</script>

<style>
</style>
