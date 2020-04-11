import Vue from 'vue'
import Vuex from 'vuex'

import Status from './modules/status'
import Title from './modules/title.js'
import User from './modules/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		Status,
		Title,
		User
	}
})