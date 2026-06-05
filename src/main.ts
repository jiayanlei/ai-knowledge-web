import 'virtual:uno.css'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'

import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
