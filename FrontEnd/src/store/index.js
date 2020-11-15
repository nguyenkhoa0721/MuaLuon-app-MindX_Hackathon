import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import axios from 'axios'
export default new Vuex.Store({
    state: {
        // server:"http://localhost:3000/",
        server: "https://mualuon.herokuapp.com/",
        token: false,
        loginCom: 'login',
        user: '',
        userid: '',
        userInfo: [],
        bill:[],
        billID: "",
        step:0,
        dis: 0,
        noti:"",
        lastNoti:[],
    },
    getters,
    mutations,
    actions
})
