<template>
	<div class="publish">
		<van-form @submit="publishGoods">
			<van-field
				v-model="goods.goodsTitle"
				type="textarea"
				placeholder="标题"
				:rules="[{ required: true, message: '这里不能为空' }]"
				:autosize="{minHeight: 50}"
			/>
			<van-field
				v-model="goods.goodsInfo"
				type="textarea"
				placeholder="品牌型号,新旧程度,入手渠道,转手原因等"
				:rules="[{ required: true, message: '这里不能为空' }]"
				:autosize="{minHeight: 200}"
			/>
			
			<van-field name="uploader">
				<template #input>
						<van-uploader 
							v-model="fileList"
							:preview-size = '105'
							:max-count="3"
						/>
				</template>
			</van-field>
			
			<van-field
				readonly
				clickable
				:value="formatPrice"
				label="价格"
				placeholder="点击输入价格"
				input-align="right"
				@touchstart.native.stop="show = true"
				left-icon="gold-coin-o"
			/>
			
			<van-number-keyboard
				v-model="goods.value"
				:show="show"
				:maxlength="10"
				close-button-text="完成"
				@blur="show = false"
				extra-key="."
			/>
			
			<van-button round block type="info" native-type="submit" style="margin-top: 50px;"> 
				发布
			</van-button>
		</van-form>
	</div>
</template>

<script>
	import {Uploader,Form,Field,Popup,NumberKeyboard,Button,Dialog} from 'vant' 
	export default{
		components:{
			[Uploader.name] : Uploader,
			[Form.name] : Form,
			[Field.name] : Field,
			[Popup.name] : Popup,
			[NumberKeyboard.name]:NumberKeyboard,
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
				goods:{
					goodsTitle:'',
					goodsInfo:'',
					value:''
				},
				fileList:[],		
				show: false,
				showKeyboard:false
			}
		},
		computed:{
			formatPrice() {
				return '¥' + (this.goods.value);
			}
		},
		methods:{
			//发布商品
			publishGoods(){
				let formdata = new FormData();
				for(let i = 0 ; i<this.fileList.length;i++){
					formdata.append('goods',this.fileList[i].file);
				}
				formdata.append('goodsInfo',JSON.stringify(this.goods));
				this.$http.post('/goodsInfo/saveGoodsInfo',formdata)
				.then((response)=>{
					if(response.data.success === 1){
						Dialog.alert({
							message: '发布成功'
						})
						.then(() => {
							this.$router.push('/home')
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
