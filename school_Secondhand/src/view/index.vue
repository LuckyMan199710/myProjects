<template>
	<div>
		<p>这是主页</p>
		<button @click="runtoList">跳转</button>
	</div>
</template>

<script>
	export default{
		mounted() {
			this.$store.commit('changeTabbarStatusTrue');
			this.$store.commit('changeNavBarStatusFalse');
		},
		methods:{
			runtoList(){
				this.$router.push('/list');
			}
		}
	}
</script>

<style>
</style>
