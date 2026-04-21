import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {})
app.use(createPinia())

app.mount('#app')
