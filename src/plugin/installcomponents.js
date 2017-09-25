/**
 * Created by wwj on 2017/3/16.
 */
import {InitStep,LoadBar,FunctionPage,BaseForm} from '../components/lib'
import PacmanLoader  from 'vue-spinner/src/PacmanLoader.vue'
import LoadingBar from 'vue2-loading-bar/build/vue2-loading-bar.min.js'
import Icon from 'vue-awesome/components/Icon.vue'
require('vue-awesome/icons')
Icon.name = "icon"
export default [InitStep,PacmanLoader,LoadingBar,LoadBar,Icon,FunctionPage,BaseForm]
