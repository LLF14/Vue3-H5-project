import { createApp } from 'vue'
import pinia from './stores/index'

import App from './App.vue'
import router from './router'
// 💥💥 全局导入vant样式文件， 注意放在main.scss导入顺序之前
import 'vant/lib/index.css'
import 'virtual:svg-icons-register'
import '@/styles/main.scss'

// 💥💥 修复vant组件没有提示的问题
import {} from 'vant'
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
