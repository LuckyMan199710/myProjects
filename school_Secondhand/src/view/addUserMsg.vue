<template>
	<div class="addUserMsg">
		<van-form @submit="onSubmit">
			<van-field name="uploader" label="头像" input-align="right">
				<template #input>
					<van-uploader v-model="user.headImg" multiple max-count=1 />
				</template>
			</van-field>
			<van-field
				v-model="user.username"
				label="用户名"
				placeholder="用户名"
				input-align="right"
				left-icon="manager-o"
				:rules="[{ required: true, message: '请填写用户名' }]"
				error-message-align="right"
			/>
			<!-- 年龄 -->
			<van-field
				v-model="user.age"
				label="年龄"
				input-align="right"
				left-icon="comment-o"
				readonly
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
				:rules="[{ required: true, message: '请选择地区' }]"
				error-message-align="right"
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
				label="性别"
				input-align="right"
				left-icon="contact"		
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
			<!-- 选择生日 -->
			<van-field
				readonly
				clickable		
				:value="user.birthday"
				label="生日"
				input-align="right"
				left-icon="birthday-cake-o"
				placeholder="点击选择时间"
				@click="showDatePicker = true"
				:rules="[{ required: true, message: '请选择时间' }]"
				error-message-align="right"
			/>
			<van-popup v-model="showDatePicker" position="bottom">
				<van-datetime-picker
					v-model="currentDate"
					type="year-month"
					@confirm="onSelectDate"
					@cancel="showDatePicker = false"
					:min-date = "minDate"
					:max-date = "maxDate"
				/>
			</van-popup>
			<!-- 联系方式 -->
			<van-field
				v-model="user.phoneNum"
				label="联系方式"
				placeholder="联系方式"
				input-align="right"
				left-icon="phone-o"
				:rules="[{ required: true, message: '请填写联系方式' }]"
				error-message-align="right"
			/>
			<!-- 邮箱 -->
			<van-field
				v-model="user.email"
				label="邮箱"
				placeholder="邮箱"
				input-align="right"
				left-icon="envelop-o"
				:rules="[{ required: true, message: '请填写联系邮箱' }]"
				error-message-align="right"
			/>
			<!-- 学院 -->
			<van-field
				v-model="user.collage"
				label="学院"
				placeholder="所在学院"
				input-align="right"
				left-icon="description"
				:rules="[{ required: true, message: '请填写所在学院' }]"
				error-message-align="right"
			/>
			<!-- 班级 -->
			<van-field
				v-model="user.grade"
				label="班级"
				placeholder="所在班级"
				input-align="right"
				left-icon="hotel-o"
				:rules="[{ required: true, message: '请填写所在班级' }]"
				error-message-align="right"
			/>
			<!-- 所在住址 -->
			<van-field
				v-model="user.address"
				label="住址"
				placeholder="住址"
				input-align="right"
				left-icon="wap-home-o"
				:rules="[{ required: true, message: '请填写住址' }]"
				error-message-align="right"
			/>
			<!-- QQ -->
			<van-field
				v-model="user.QQnum"
				label="QQ号"
				placeholder="QQ号"
				input-align="right"
				left-icon="http://pic.51yuansu.com/pic3/cover/00/69/37/58ab18e477752_610.jpg"
				:rules="[{ required: true, message: '请填写QQ号' }]"
				error-message-align="right"
			/>
			<!-- 微信号 -->
			<van-field
				v-model="user.wechatnum"
				label="微信号"
				placeholder="微信号"
				input-align="right"
				left-icon="http://img2.imgtn.bdimg.com/it/u=3838248306,1853307012&fm=26&gp=0.jpg"
				:rules="[{ required: true, message: '请填写微信号' }]"
				error-message-align="right"
			/>
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
	import {Form,Field,Icon,Button,Uploader,Picker,Popup,Area,DatetimePicker} from 'vant'
	export default{
		components:{
			[Form.name]:Form,
			[Field.name]:Field,
			[Icon.name]:Icon,
			[Button.name]:Button,
			[Uploader.name]:Uploader,
			[Picker.name]:Picker,
			[Popup.name]:Popup,
			[Area.name]:Area,
			[DatetimePicker.name]:DatetimePicker
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
					age:'',
					area:'',
					sex:0,
					birthday:'',
					phoneNum:'',
					email:'',
					address:'',
					collage:'',
					grade:'',
					QQnum:'',
					wechatnum:''
				},
				areaList: {},
				showArea: false ,//控制选择省市的弹出框
				columns: ['男','女'],
				showSexPicker: false,
				showDatePicker:false,
				minDate: new Date(1900, 0, 1),
				maxDate: new Date(2020, 1, 1),
				currentDate:new Date()
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
			},
			onSelectDate(value){
				this.user.birthday = (value.getFullYear()+"/"+(value.getMonth()+1)+"/"+value.getDate());
				this.showDatePicker = false;
				this.computedAge(value);
			},
			//根据选择的出生日期来计算出年龄
			computedAge(birthday){
				let nowaday = new Date();
				let age = nowaday.getFullYear()-birthday.getFullYear();
				if(birthday.getMonth()>nowaday.getMonth()){
					age-=1;
				}
				else if(birthday.getMonth() === nowaday.getMonth() && birthday.getDate()>nowaday.getDate()){
					age-=1;
				}
				this.user.age = age;
			},
			onSubmit(){
				console.log(this.user)
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
