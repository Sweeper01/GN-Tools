import 'typeface-roboto'
import '@mdi/font/css/materialdesignicons.css'
import Vue from "vue";
import App from "./App.vue";
import router from './router'
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import GNNames from '@/plugins/gnnames.js'

Vue.config.productionTip = false;

Vue.prototype.$GNNames = GNNames;

new Vue({
  router,
  vuetify,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
