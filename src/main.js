// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 第三方套件
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
//plug-in
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';


// 內建
import App from './App'
import router from './router'
import './bus';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date_format';

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zhTWValidate);

Vue.component('Loading', Loading);  //全域元件
Vue.filter('currency', currencyFilter);  //全域filter
Vue.filter('date', dateFilter);  //全域filter

axios.defaults.withCredentials = true;		// axios 發請求時附帶 cookie

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
	// console.log('to:',to ,'from:',from ,'next:',next);
	if (to.meta.requiresAuth){  //該頁面需要驗證
		const api = `${process.env.API_PATH}/api/user/check`;
		axios.post(api).then((response) => {  //this.$http是在vue檔案下使用，這裡要換成axios
			console.log(response.data);
			if (response.data.success){
				next()
				// next({ path: '/admin' })
			} else {
				next({ path: '/login' })
			}
		})
	} else {
		next(); //該頁面不需要驗證，可直接放行
	}
})
