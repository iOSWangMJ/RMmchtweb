/**
 * Created by wwj on 2017/3/8.
 * 应用查询，所有全局API调用添加到此文件的安装方法(install)中
 * 注意！不得在除此之外的地方对VUE原型进行修改，赋值
 * plugin目录每一种类的操作需建立对应的文件夹
 * */
import * as prototypeMethods from './prototypeMethods'
// import mixin from './mixin'
import toBeInstallComp from './installcomponents'
import echarts from 'echarts'

const components = [...toBeInstallComp]
const install = function(Vue, config) {

    /**对全局运行模式进行赋值
     * 用途，某些情况根据不同的运行环境处理不同
     * 例如开发模式下的异常提示直接是异常详细打印在终端日志或直接弹框显示
     * 但是生产模式则不能随意打印对象*/
    Vue.isDevelop = false
    Vue.isProduction = false
    Vue.isTest = false
    /**组件加载超时时间全局变量*/
    Vue.loadTimeOut =  'loadTimeOut' in config ? config.loadTimeOut : 5000
    switch (config.mode){
        case 'dev': Vue.isDevelop =true
            break;
        case 'prd':Vue.isProduction =true
            break;
        case 'test':Vue.isTest =true
            break;
        case 'mock':Vue.isMock =true
            break;
        default:alert("请配置运行模式范围内的参数:dev/prd/test")
    }

    //添加实例方法，在组件中使用:this.方法名
    //方法在组件通过this.$x调用时，函数中的this指向当前组件对象
    //http访问
	Vue.prototype.$echarts = echarts
    Vue.prototype.$ajaxPromise = prototypeMethods.ajaxPromise
    Vue.prototype.$urlParams = prototypeMethods.urlParams
    Vue.prototype.$commonErrorNotidy = prototypeMethods.commonErrorNotidy
    Vue.prototype.$getCommonRequest = prototypeMethods.getCommonRequest
    Vue.prototype.$dataClone = prototypeMethods.dataClone
    Vue.prototype.$getUpdateRequest = prototypeMethods.getUpdateRequest
    Vue.prototype.$stringArrayComp = prototypeMethods.stringArrayComp
    //添加全局组件
    components.map(component => {
        Vue.component(component.name, component);
    });

    //全局组件方法注入 注：全局添加后所有组件都将包含合并方法，
    // 故非必要时仅每个组件自行引入所需合并方法
    //Vue.mixin(mixin)

}

export default {install}
