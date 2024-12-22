import { createApp } from 'vue'
import Ant from 'ant-design-vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission/access'
import vLoad from './directives/load'

const app = createApp(App)
app.directive('load', vLoad)
app.use(router)
app.use(store)
app.use(Ant)
app.mount('#app')
