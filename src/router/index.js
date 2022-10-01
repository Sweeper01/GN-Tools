import Vue from 'vue'
import Router from 'vue-router'
import GnSimulator from '@/views/GnSimulator.vue'
import GnScanAuswertung from '@/views/GnScanAuswertung.vue'

Vue.use(Router)

export default new Router({
    routes: [
      { path: '/', component: GnSimulator },
      { path: '/ScanAuswertung', component: GnScanAuswertung },
    ]
})

