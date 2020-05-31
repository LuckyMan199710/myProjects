<template>
	<div class="goods">
		<van-swipe class="goods-swipe" :autoplay="3000">
			<van-swipe-item v-for="(thumb,index) in imgList" :key="index">
				<img :src="thumb" fit="cover">
			</van-swipe-item>
		</van-swipe>

		<van-cell-group>
			<van-cell>
				<div class="goods-title">{{ goods.good_title }}</div>
				<div class="goods-price">{{formatPrice}}</div>
			</van-cell>
			<van-cell title="发布时间" :value="formateDate" />
		</van-cell-group>

		<van-cell-group class="goods-cell-group">
			<van-cell value="查看卖家" icon="manager-o" is-link @click="runToSeller">
				<template slot="title">
					<span class="van-cell-text">{{goods.seller}}</span>
				</template>
			</van-cell>
		</van-cell-group>

		<van-cell-group class="goods-cell-group">
			<van-cell title="查看商品详情" is-link @click="runToGoodsInfo" />
		</van-cell-group>

		<van-goods-action>
			<van-goods-action-icon icon="star" :text="text" :color="color" @click="collectGoods" />
			<van-goods-action-button type="info" @click="collectGoods">
				{{btnText}}
			</van-goods-action-button>
		</van-goods-action>
	</div>
</template>

<script>
	import {
		Tag,
		Col,
		Icon,
		Cell,
		CellGroup,
		Swipe,
		Toast,
		SwipeItem,
		GoodsAction,
		GoodsActionIcon,
		GoodsActionButton,
		Sku
	} from 'vant';

	export default {
		components: {
			[Tag.name]: Tag,
			[Col.name]: Col,
			[Icon.name]: Icon,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem,
			[GoodsAction.name]: GoodsAction,
			[GoodsActionIcon.name]: GoodsActionIcon,
			[GoodsActionButton.name]: GoodsActionButton,
			[Sku.name]: Sku,
			[Toast.name]: Toast
		},

		data() {
			return {
				goods: {},
				imgList: [],
				isCollected: false, //判断当前物品是否被收藏
				color: "black", //收藏状态的改变
				text: "",
				btnText:'收藏'
			};
		},
		created() {
			let good_id = this.$route.params.good_id;
			console.log(this.$route.params.good_id)
			if(good_id){
				this.$http.post('goodsInfo/getGoodsInfo',{
					good_id:good_id
				})
				.then((res)=>{
					if(res.data.success === 1){
						this.goods = res.data.goodsInfo[0];
						console.log(this.goods['GROUP_CONCAT(gis.good_img_url)'])
						this.imgList = this.goods['GROUP_CONCAT(gis.good_img_url)'].split(',').map(item => {
							return 'http://localhost:3000/' + item
						});
						this.getCollectionInfo();
					}
					else{
						Toast('获取数据失败！')
					}
				})
				.catch((e)=>{
					console.log(e)
					Toast('获取数据失败!')
				})
			}
			else{
				JSON.parse(sessionStorage.getItem('goodsInfo'))
				this.goods = JSON.parse(sessionStorage.getItem('goodsInfo'));
				this.imgList = this.goods['GROUP_CONCAT(gis.good_img_url)'].split(',').map(item => {
					return 'http://localhost:3000/' + item
				});
				this.getCollectionInfo();
			}
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse'); //使导航栏消失避免占用空间
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName', this.$route.meta.title);
		},
		methods: {
			runToGoodsInfo() {
				this.$router.push({
					name: 'goodsInfo',
					params: this.goods
				})
			},
			runToSeller() {
				this.$router.push({
					name: 'seller',
					params: {
						id: this.goods.sellerId
					}
				});
			},
			runToOrderGoods() {
				this.$router.push({
					name: "orderGoods",
					params: this.goods
				})
			},
			collectGoods() {
				let _this = this;
				_this.isCollected = !_this.isCollected;
				if (_this.isCollected === true) {
					console.log('true')
					_this.$http.post('goodsInfo/collection',{
						good_id:_this.goods.good_id
					})
					.then((res) => {
						if(res.data.success === 1){
							_this.color = "skyblue";
							_this.text = "已收藏";
							_this.btnText = '取消收藏'
							Toast('收藏成功')
							
						}				
					})
					.catch((err)=>{
						console.log(err)
					})
				} 
				else {
					_this.$http.post('goodsInfo/deleteCollection',{
						good_id:_this.goods.good_id
					})
					.then((res)=>{
						if(res.data.success === 1){
							_this.color = "black";
							_this.text = "";
							_this.btnText = '收藏'
							Toast('取消收藏成功')
						}
					})
				}
			},
			getCollectionInfo(){
				//判断该商品是否被该用户收藏
				let _this = this;
				console.log('判断是否收藏')
				_this.$http.post('goodsInfo/getCollectionInfo',{
					good_id:_this.goods.good_id
				})
				.then((res)=>{		
					if(res.data.success === 1){
						_this.isCollected = true;
						_this.color = "skyblue";
						_this.text = "已收藏";
						_this.btnText = '取消收藏'	
					}
					else{
						console.log('否收藏')
						_this.color = "black";
						_this.text = "";
						_this.btnText = '收藏'
						_this.isCollected = false;
					}
				})
				.catch((e)=>{
					console.log(e)
				})
			}
		},
		computed: {
			formatPrice() {
				return '¥' + parseFloat(this.goods.good_price).toFixed(2);
			},
			formateDate() {
				function addDateZero(num) {
					return (num < 10 ? "0" + num : num);
				}
				let d = new Date(this.goods.p_time);
				let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
				return formatdatetime;
			},
		}
	};
</script>

<style lang="less">
	.goods {
		&-swipe {
			img {
				width: 100%;
				height: 350px;
				display: block;
			}
		}

		&-title {
			font-size: 16px;
		}

		&-price {
			color: #f44;
		}

		&-express {
			color: #999;
			font-size: 12px;
			padding: 5px 15px;
		}

		&-cell-group {
			margin: 15px 0;

			.van-cell__value {
				color: #999;
			}
		}

		&-tag {
			margin-left: 5px;
		}
	}
</style>
