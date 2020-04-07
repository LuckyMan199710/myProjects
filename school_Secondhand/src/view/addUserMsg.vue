<template>
	<div class="addUserMsg">
		<van-form>
			<van-field name="uploader" label="头像" input-align="right">
				<template #input>
					<van-uploader v-model="user.headImg" multiple max-count=1 />
				</template>
			</van-field>
			<van-field
				v-model="user.username"
				name="username"
				label="用户名"
				placeholder="用户名"
				input-align="right"
				left-icon="manager-o"
				:rules="[{ required: true, message: '请填写用户名' }]"
			/>
			<!-- 选地区 -->
			<van-field
				readonly
				clickable
				:value="user.area"
				label="地区选择"
				input-align="right"
				placeholder="点击选择省市"
				left-icon="location-o"
				@click="showArea = true"
				:rules="[{ required: true, message: '请填写用户名' }]"
			/>
			<van-popup v-model="showArea" position="bottom">
				<van-area
					:area-list="areaList"
					:columns-num="2"
					@confirm="onSelectArea"
					@cancel="showArea = false"
				/>
			</van-popup>
			<!-- 选择性别 -->
			<van-field
				readonly
				clickable
				name="picker"
				:value="getSex"
				input-align="right"
				left-icon="contact"
				label="性别"
				placeholder="点击选择性别"
				@click="showSexPicker = true"
			/>
			<van-popup v-model="showSexPicker" position="bottom">
				<van-picker
					show-toolbar
					:columns="columns"
					@confirm="onSelectSex"
					@cancel="showSexPicker = false"
				/>
			</van-popup>
			<!-- 保存按钮 -->
			<div style="margin: 16px;">
				<van-button round block type="info" native-type="submit">
					保存信息
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import AeraInfo from "../../common/area.js"
	import {Form,Field,Icon,Button,Uploader,Picker,Popup,Area} from 'vant'
	export default{
		components:{
			[Form.name]:Form,
			[Field.name]:Field,
			[Icon.name]:Icon,
			[Button.name]:Button,
			[Uploader.name]:Uploader,
			[Picker.name]:Picker,
			[Popup.name]:Popup,
			[Area.name]:Area
		},
		created() {
			this.areaList = AeraInfo
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');	
			this.$store.commit('changeTitleName',this.$route.meta.title);
		},
		data(){
			return{
				user:{
					username:'',
					headImg:[],
					area:'',
					sex:0
				},
				areaList: {},
				showArea: false ,//控制选择省市的弹出框
				columns: ['男','女'],
				showSexPicker: false
			}
		},
		methods:{
			onSelectArea(values) {
				if(values[0].name === values[1].name){
					this.user.area = values[0].name
				}
				else{
					this.user.area = values.map(item => item.name).join(' ');
				}		
				this.showArea = false;
			},
			onSelectSex(value,index) {
				this.user.sex = index;
				this.showSexPicker = false;
			}
		},
		computed:{
			getSex(){
				return this.user.sex === 0 ?  "男" :  "女"
			}
		}
	}
</script>

<style>
</style>
