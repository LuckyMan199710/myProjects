import Vue from 'vue';
import App from './App';
import { router } from './router';
import store from './store'
import {Lazyload} from 'vant'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL='http://localhost:3000/';

Vue.prototype.$http = axios;
Vue.use(Lazyload);


new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
