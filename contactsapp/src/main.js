import { createApp } from 'vue'
import App from './App.vue'
import * as atlas from 'azure-maps-control'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(vuetify).mount('#app')
app.config.globalProperties.$atlas = atlas

