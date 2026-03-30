import { createApp } from 'vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission/access'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
