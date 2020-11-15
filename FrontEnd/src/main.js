import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueChatScroll from 'vue-chat-scroll'

import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import store from './store/index'
import VueAxios from 'vue-axios';
import axios from 'axios';
import cookies from 'vue-cookies';
import VueSimpleAlert from "vue-simple-alert";

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/element/theme/index.css';
import locale from 'element-ui/lib/locale/lang/vi'
import './../static/custom.css'
// You need a specific loader for CSS files
Vue.use(VueChatScroll)
Vue.use(ElementUI, { locale });
Vue.use (BootstrapVue);
Vue.use(VueAxios,axios);
Vue.use(cookies);

//let server = "https://api.dinolin.ml/"
let server = "https://mualuon.herokuapp.com/"
axios.defaults.baseURL = server+"api/v1/"
Vue.use(VueSimpleAlert)
Vue.config.productionTip = false
axios.defaults.withCredentials = true;

new Vue({
  created: function(){ 
    // this.checkLogin();
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')