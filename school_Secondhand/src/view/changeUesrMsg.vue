<template>
	<div>
		<van-cell-group>
			<van-cell
				title="我的头像" 
			>
				<van-uploader
					v-model="fileList" 
					:before-read="beforeRead"
					:max-count="1"/>
			</van-cell>
			<!-- 用户名 -->
			<van-field
				v-model="user.u_name"
				label="用户名"
				placeholder="请输入用户名"
				input-align="right"
			></van-field>
			<!-- 年龄 -->
			<van-field
				v-model="user.u_age"
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
				:value="user.u_area"
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
					@confirm="onSelectArea"
					@cancel = "popupClose"
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
				@confirm="getSexVal"
			>
				<van-picker show-toolbar :columns="columns" @cancel="pickerClose" @confirm="getSexVal"/>
			</van-popup>
			<!-- 生日 -->
			<van-cell
				title="生日" 
				is-link 
				:value="user.u_birthday"
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
				v-model="user.u_phonenum"
				label="联系方式"
				placeholder="请输入您的联系方式"
				input-align="right"
			/>
			<!-- 邮箱 -->
			<van-field
				v-model="user.u_mail"
				label="邮箱"
				placeholder="请输入您的邮箱"
				input-align="right"
			/>
			<!-- QQ号 -->
			<van-field
				v-model="user.u_qq"
				label="QQ号"
				placeholder="请输入您的QQ号"
				input-align="right"
			/>
			<!-- 微信号 -->
			<van-field
				v-model="user.u_wechat"
				label="微信号"
				placeholder="请输入您微信号"
				input-align="right"
			/>			
		</van-cell-group>
		<van-button
			color="linear-gradient(to right, #4bb0ff, #6149f6)" 
			@click="saveUserInfo"
			block
		>保存信息</van-button>
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
			this.areaList = AeraInfo
			this.user = this.$store.state.User.userInfo[0];
			//反斜杠会被定成转义 全部转成斜杠
			this.imgPath = ('http://localhost:3000/'+this.user.u_headimg).replace(/\\/g,"/");		
			this.fileList.push({ url: this.imgPath})
		},
		mounted() {
			this.$store.commit('changeTabbarStatusFalse');
			this.$store.commit('changeNavBarStatusTrue');
			this.$store.commit('changeTitleName',this.$route.meta.title)
		},
		data(){
			return{
				user : null,
				imgPath:'',
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
			//选择性别
			pickerShowBottom(){
				this.pickerShow = true;
			},
			pickerClose(){
				this.pickerShow = false;
			},
			onSelectArea(values) {
				if(values[0].name === values[1].name){
					this.user.u_area = values[0].name
				}
				else{
					this.user.u_area = values.map(item => item.name).join(' ');
				}		
				this.popupShow = false;
			},
			getSexVal(value, index){
				this.user.u_sex = index;
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
				this.user.u_birthday = (value.getFullYear()+"/"+(value.getMonth()+1)+"/"+value.getDate());
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
				this.user.u_age = age;
			},
			saveUserInfo(){
				let status = 0; //定义一个状态码 当检测结束之后 根据状态码来决定是否进行请求存数据
				for (let val of Object.values(this.user) ) {
					if(val === undefined || val === ''){
						Toast("请填写好所有信息！");
						break;
					}
					else{
						status += 1;
					}
				}			
				if(status === Object.values(this.user).length){
					/* 把所有数据利用formdata的形式进行转化 */
					let formdata = new FormData();
					for(let i = 0 ; i<this.fileList.length;i++){
						formdata.append('user',this.fileList[0].file);
					}
					formdata.append('userInfo',JSON.stringify(this.user));
					/* 分发action 更新state */
					let status = this.$store.dispatch('updateUserInfo',formdata);
					status.then(()=>{
						Dialog.alert({
							message: '保存成功'
						})
						.then(() => {
							this.$store.dispatch('getUserInfo')
							.then(()=>{
								this.$router.replace('/usermsg')
							})
							.catch(()=>{
								Toast('更新数据失败!')
							})
						})
					})
					.catch(()=>{
						Dialog.alert({
							message: '更新失败！请重试！'
						})
					})
				}
			},
			beforeRead(file){
				if (file.type !== 'image/jpeg' && file.type !== 'image/png'){
					Toast('只允许上传jpg/png格式的图片！');
						return false;
				}
				return true;
			}
		},
		computed:{
			getSex(){
				return this.user.u_sex === 0 ?  "男" :  "女"
			}
		}
	}
</script>

<style>
</style>
