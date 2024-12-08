import { createApp } from 'vue'
import Ant from 'ant-design-vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(Ant)
app.mount('#app')
