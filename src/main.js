import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import dotenv from 'dotenv'
dotenv.config()
process.version = "v1.1.1";

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
