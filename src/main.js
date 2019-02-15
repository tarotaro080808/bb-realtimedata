import Vue from 'vue'
import App from './App.vue'
import '@babel/polyfill'

new Vue({
  render: h => h(App),
}).$mount('#app')
