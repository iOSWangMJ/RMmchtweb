/**
 * Created by wwj on 2017/3/10.
 */
import * as SystemContext from '../../context/SystemContext'
import {STATIC_LOAD_PATH} from '../../context/SystemUrl'

export default {
    data(){
        return {
            mixinStaticDataLoadFinished:false
        }
    },
    beforeMount () {

        this._staticLoad()
    },
    methods : {
        _staticLoad: function () {
            let _this = this
            if(SystemContext.STATICLOAD_CFG_NAME in this){
                console.log("待加载静态数据个数"+toDoStaticCount)
                // 成功后调用watcherCheck检查是否全部初始化都完成
                let staticLoadCfg = this[SystemContext.STATICLOAD_CFG_NAME]
                let toDoStaticCount = staticLoadCfg.length
                /**如果配置数量为0 直接设置为完毕*/
                if(toDoStaticCount === 0){
                    _this.mixinStaticDataLoadFinished = true
                    /**调用监控校验方法，检查是否全部初始化工作都完成*/
                    if(_this.mixinShowWatcherCheck){
                        _this.mixinShowWatcherCheck()
                    }
                }

                let sucCount = 0;
                staticLoadCfg.forEach(function (configItem) {
                    let config = configItem
                    _this.$ajaxPromise(STATIC_LOAD_PATH,{id:config.id,type:config.type,param:config.param},"post",true).
                    then(function (response) {
                        // staticLoadCfg.forEach(function (config) {
                        //     if(config[SystemContext.STATICLOAD_ID] == response[SystemContext.STATICLOAD_ID]){
                        //         _this._staticSet(config[SystemContext.STATICLOAD_SET_TO],response[SystemContext.STATICLOAD_DATA])
                        //     }
                        // })
                        _this._staticSet(config[SystemContext.STATICLOAD_SET_TO],response[SystemContext.STATICLOAD_DATA])
                        sucCount++
                        if(sucCount === toDoStaticCount){
                            console.log("静态数据加载完毕")
                            _this.mixinStaticDataLoadFinished = true
                            /**调用监控校验方法，检查是否全部初始化工作都完成*/
                            if(_this.mixinShowWatcherCheck){
                                _this.mixinShowWatcherCheck()
                            }
                        }

                    }).catch(function (error) {
                        _this.$commonErrorNotidy("静态数据获取异常",error)
                        console.error("请求返回失败",STATIC_LOAD_PATH +config[SystemContext.STATICLOAD_ID],error)
                    })
                })

            } else {
                this.$notify.error({
                    title: '系统异常',
                    message: '该功能没有设定静态数据加载配置对象',
                    duration: 0
                });
                // goHome(this)

                // this.$destroy()
            }

        },
        _staticSet(property,data){
            let properties = property.split('.')
            function set(object,index,array,data) {
                if(array.length == index + 1 ){
                    object[array[index]] = data
                    return
                }else{
                    let next = index + 1
                    set(object[array[index]],next,array,data)
                }
            }
            set(this,0,properties,data)
        }
    }
}


