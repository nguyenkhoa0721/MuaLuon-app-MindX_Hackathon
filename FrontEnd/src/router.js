import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import login from './views/log.vue'
import error from './views/error.vue'
import me from './views/me.vue'
import home from './views/home.vue'
import shop from './views/shop.vue'
import ListChat from './views/ListChat.vue'
import axios from 'axios'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/listchat",
      name: "ListChat",
      component: ListChat
    },
    {
      path: '/login',
      name: 'log',
      component: login
    },
    {
      path: '/me',
      name: 'me',
      component: me,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/home',
      name: 'homee',
      component: home
    },
    {
      path: '/id/:id',
      name: 'id',
      component: shop
    },
    {
      path: '*',
      name: 'error',
      component: error
    },
  ],
})
router.beforeEach((to, from, next) => {
  store.state.server = "https://mualuon.herokuapp.com/"
  // store.state.server = "http://localhost:3000/"
  if (store.state.loginCom == 'auth')
    return next();
  else {
    axios.get(
      '/user/islogged',
      {
        headers: {
          "Content-Type": "application/json", crossDomain: true
        }
      })
      .then(res => {
        if (res.data.fuser) {
          store.state.loginCom = 'auth'
          store.state.user = res.data.fuser.username
          store.state.userid = res.data.fuser.id
          store.state.userInfo = res.data.fuser
          return next()
        }
      })
      .catch(err => {
        store.state.loginCom = 'login'
        if (to.matched.some(record => record.meta.requiresAuth)) {
          return next('/login')
        }
        else return next()
      })
  }
})
export default router