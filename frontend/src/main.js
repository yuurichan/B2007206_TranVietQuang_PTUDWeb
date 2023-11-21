import './assets/main.css'
import 'bootstrap/js/dist/modal.js'
import 'animate.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification'

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin)
app.use(autoAnimatePlugin)
app.use(router)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
