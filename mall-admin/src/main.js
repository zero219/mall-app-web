import { createApp } from 'vue'
import App from './App.vue'

// 路由
import router from './router'

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// ElementPlusIconsVue
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// axios请求
import request from './utils/request'

const app = createApp(App)

app.use(router)

app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$http = request

app.mount('#app')
