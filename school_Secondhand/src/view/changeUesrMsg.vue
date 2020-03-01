<template>
	<div>
		<van-cell-group>
			<van-cell
				title="我的头像" 
			>
				<van-uploader
					:after-read="getImgVal"
					v-model="fileList" 
					:before-read="beforeRead"
					multiple 
					:max-count="1"/>
			</van-cell>
			<!-- 用户名 -->
			<van-field
				v-model="Person.name"
				label="用户名"
				placeholder="请输入用户名"
				input-align="right"
			></van-field>
			<!-- 年龄 -->
			<van-field
				v-model="Person.age"
				label="年龄"
				placeholder="请输入年龄"
				input-align="right"
				readonly 
			>
			</van-field>
			<!-- 地区 -->
			<van-cell 
				title="地区" 
				is-link 
				:value="returnAddressRes"
				@click = "popupShowBottom"
			/>
			<van-popup
				v-model="popupShow"
				position="bottom"
				round
				:style="{ height: '30%' }"
			>
				<van-area 
					:area-list="areaList" 
					:columns-num="2"
					@cancel = "popupClose"
					@confirm = "getAddressVal"
				/>
			</van-popup>
			<!-- 性别 -->
			<van-cell
				title="性别" 
				is-link 
				:value="getSex"
				@click ="pickerShowBottom"
			/>
			<van-popup
				v-model="pickerShow"
				position="bottom"
				round
				:style="{ height: '30%' }"
			>
				<van-picker show-toolbar :columns="columns" @cancel="pickerClose" @confirm="getSexVal"/>
			</van-popup>
			<!-- 生日 -->
			<van-cell
				title="生日" 
				is-link 
				:value="Person.birthday"
				@click="datePickShowBottom"
			/>
			<van-popup
				v-model="datePicker"
				position="bottom"
				round
				:style="{ height: '30%' }"
			>
				<van-datetime-picker
					v-model="currentDate"
					type="date"
					:min-date = "minDate"
					:max-date = "maxDate"
					@cancel = "datePickClose"
					@confirm = "getDateVal"
				/>
			</van-popup>
			<!-- 手机号码 -->
			<van-field
				v-model="Person.phoneNum"
				label="联系方式"
				placeholder="请输入您的联系方式"
				input-align="right"
			/>
			<!-- 邮箱 -->
			<van-field
				v-model="Person.email"
				label="邮箱"
				placeholder="请输入您的邮箱"
				input-align="right"
			/>
			<!-- 学院 -->
			<van-field
				v-model="Person.college"
				label="学院"
				placeholder="请输入您所在学院"
				input-align="right"
			/>
			<!-- 班级 -->
			<van-field
				v-model="Person.grade"
				label="班级"
				placeholder="请输入您的班级"
				input-align="right"
			/>
			<!-- 住址 -->
			<van-field
				v-model="Person.address"
				label="住址"
				placeholder="请输入您的住址"
				input-align="right"
			/>
			<!-- QQ号 -->
			<van-field
				v-model="Person.QQnum"
				label="QQ号"
				placeholder="请输入您的QQ号"
				input-align="right"
			/>
			<!-- 微信号 -->
			<van-field
				v-model="Person.wechatnum"
				label="微信号"
				placeholder="请输入您微信号"
				input-align="right"
			/>			
		</van-cell-group>
		<van-button
			color="linear-gradient(to right, #4bb0ff, #6149f6)" 
			@click="saveUserInfo"
			block>保存信息
		</van-button>
	</div>
</template>

<script>
	import AeraInfo from "../../common/area.js"
	import {Field,CellGroup,Area,Cell,Popup,Picker,DatetimePicker,Button,Dialog,Uploader,Toast} from 'vant'
	export default{
		components:{
			[Field.name] : Field,
			[CellGroup.name]: CellGroup,
			[Area.name] : Area,
			[Cell.name]:Cell,
			[Popup.name]:Popup,
			[Picker.name]:Picker ,
			[DatetimePicker.name]:DatetimePicker,
			[Button.name]:Button,
			[Dialog.name]:Dialog,
			[Uploader.name]:Uploader,
			[Toast.name]:Toast
		},
		created() {
			this.Person = this.$route.params
			this.areaList = AeraInfo
			console.log(this.$route.params)
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.fileList.push({url:this.Person.img});
		},
		data(){
			return{
				Person : null,
				areaList:[],
				popupShow:false,
				pickerShow:false,
				columns:["男","女"],
				datePicker:false,
				minDate: new Date(1900, 0, 1),
				maxDate: new Date(2020, 1, 1),
				currentDate: new Date(),
				fileList: [
					// Uploader 根据文件后缀来判断是否为图片文件
					// 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
				]
			}
		},
		methods:{
			//控制popup的显示和消失
			popupShowBottom(){
				this.popupShow = true;
			},
			popupClose(){
				this.popupShow = false;
			},
			//获得选中的省和市，如果是直辖市(省和市相同)则只输出一个名称
			getAddressVal(e){
				this.popupShow = false;
				this.Person.province = e[0].name;
				this.Person.city = e[1].name;
			},
			//选择性别
			pickerShowBottom(){
				this.pickerShow = true;
			},
			pickerClose(){
				this.pickerShow = false;
			},
			getSexVal(value, index){
				this.Person.sex = index;
				this.pickerShow = false;
			},
			//选择生日
			datePickShowBottom(){
				this.datePicker = true;
			},
			datePickClose(){
				this.datePicker = false;
			},
			//获取到的值进行格式化成1990/1/1这种类型。
			getDateVal(value){
				this.Person.birthday = (value.getFullYear()+"/"+(value.getMonth()+1)+"/"+value.getDate());
				this.datePicker = false;
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
				this.Person.age = age;
			},
			saveUserInfo(){
				let status = 0; //定义一个状态码 当检测结束之后 根据状态码来决定是否进行请求存数据
				for (let val of Object.values(this.Person) ) {
					if(val === undefined || val === ''){
						Toast("请填写好所有信息！");
						break;
					}
					else{
						status += 1;
					}
				}			
				if(status === Object.values(this.Person).length){
					//异步操作
					setTimeout(()=>{
						Dialog.alert({
							title: '信息',
							message: '保存成功'
						}).then(() => {
							history.go(-1);
						});
					}, 1000);
				}
			},
			getImgVal(file){
				console.log(file)
			},//校验文件是否为图片格式
			beforeRead(file){
				if (file.type !== 'image/jpeg' && file.type !== 'image/png'){
					Toast('只允许上传jpg/png格式的图片！');
						return false;
				}
				return true;
			}
		},
		computed:{
			returnAddressRes(){
				return this.Person.province === this.Person.city ? this.Person.province:this.Person.province +' '+ this.Person.city
			},
			getSex(){
				return this.Person.sex === 0 ?  "男" :  "女"
			}
		}
	}
</script>

<style>
</style>
