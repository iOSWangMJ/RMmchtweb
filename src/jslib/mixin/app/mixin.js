/**
 * Created by wwj on 2017/4/19.
 */

import {mapActions, mapGetters} from 'vuex'

export default {
    data(){
        return {
            mixinAppTimeOutId:-1
        }
    },
    computed: {
        ...mapGetters({
            getSystemIsLogin:'getSystemIsLogin',
            getSystemIsLogTimeOut: 'getSystemIsLogTimeOut',
            getSystemConfig:'getSystemConfig'
        })
    },
    methods:{
        _mixinAppConfigSet(config){
            this.systemConfigSet(config)
            this._mixinAppTimeOutTiming()

        },
        _mixinAppTimeOutTiming(){
            let config = this.getSystemConfig
            if(config.timeOut === 0){
                return
            }
            if(this.mixinAppTimeOutId !=  -1){
                window.clearInterval(this.mixinAppTimeOutId)
            }
            let _this = this
            this.mixinAppTimeOutId = window.setInterval(function () {
                /**如果已经登录*/
                if(_this.getSystemIsLogin == true){
                    _this.systemIsLogTimeOutSet(true)
                }
            },config.timeOut)
        },
        ...mapActions({
            systemConfigSet:'systemConfigSet',
            systemIsLogTimeOutSet:"systemIsLogTimeOutSet"
        })
    },
    watch: {
        getSystemIsLogTimeOut:function (newValue, oldValue) {
            /**如果从超时设置为未超,既进行过登录验证并且通过
             * 需要重新计算前端超时*/
            if(oldValue === true && newValue == false){
                this._mixinAppTimeOutTiming()
            }
            console.log("监听到getSystemIsLogTimeOut变化",oldValue,newValue)
        }
    }

}
