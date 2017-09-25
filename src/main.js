// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'es6-promise/auto'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from './vuex/store'

import appPlugin from './plugin'
import appConfig from './config'
import App from './App'
import router from './router'
import Element from 'element-ui'
// import 'iview/dist/styles/iview.css'
import './style/theme/index.css'
import './style/system/main.css'
import './style/system/font-family.css'
import  'vue2-loading-bar/src/css/loading-bar.css'
import './style/ui/boostrap/bootstrap.min.css'
import './style/ui/fontawesome/font-awesome.css'
import './style/ui/animate.css'
import './style/ui/style.css'
import './style/ui/custom-element-ui.css'


import './jslib/ui/bootsrap/bootstrap.min'
import './jslib/ui/jqueryui/jquery.metisMenu'
import './jslib/ui/jqueryui/jquery.slimscroll.min'
//import './jslib/ui/jqueryui/layer.min'
import './jslib/ui/hplus'
import './jslib/ui/pace.min'

// var VueWaves = require('vue-waves/dist/vue-waves');
Vue.use(Element)
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(appPlugin,appConfig)
// Vue.use(VueWaves);
Vue.use(require('vue-shortkey'))
require('./jslib/filter/filter.js')

router.beforeEach((to, from, next) => {
    //登录
    if (!store.getters.getSystemIsLogin){
        if (to.name==='SystemNotice'){
            store.commit('SYSTEM_IS_SHOW_NOTICE',true);
            next ();
        }else {
            store.commit('SYSTEM_IS_SHOW_NOTICE',false);
            next ();
        }
    }else{
        if (to.name==='SystemNotice'){
            store.commit('SYSTEM_IS_LOGIN_SET',false);
            store.commit('SYSTEM_IS_SHOW_NOTICE',true);
            next ();
        }else{
            if(to.name){
                next ();
            }
        }

    }

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App }
})
