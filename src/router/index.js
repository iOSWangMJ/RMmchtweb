import Router from 'vue-router'
/**自动生成的常规路由配置*/
import componentsRoute from './componentsRoute'
/**特殊路由配置，手动添加*/
import special from './special'

export default new Router({
    routes: componentsRoute.concat(special)
})





