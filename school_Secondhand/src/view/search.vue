<template>
	<div class="search">
		<van-search
			v-model="value"
			shape="round"
			background="skyblue"
			placeholder="请输入搜索关键词"
			@search = "Search"
		/>
	</div>
</template>

<script>
	import {Search} from 'vant'
	export default{
		components:{
			[Search.name]:Search
		},
		mounted() {
			this.$store.commit('changeTabbarStatusTrue');
			this.$store.commit('changeNavBarStatusFalse');
			this.$store.commit('changeTabbarStatusIndex',1);
		},
		data(){
			return{
				value:""
			}
		},
		methods:{
			Search(){
				this.$router.push({name:'list',params:{key:this.value}});
			}
		}
	}
</script>

<style>
</style>
