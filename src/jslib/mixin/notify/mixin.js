import {mapActions} from 'vuex'
import notifyResponseHanlder from '../../system/notifyHandler'
export default {
    data(){
        return {
            mixinNotify:{
                started:false,
                config:{},
                intervalId:-1
            }
        }
    },
    computed:{

    },
    methods: {
        _setMixinMinitorConfigInit (config) {
           this.mixinNotify.config = config
           console.log(config)
           this._mixinNotifyStart()
        },
        _mixinNotifyStart:function () {
            let _this = this
            if(this.mixinNotify.intervalId != -1){
                window.clearInterval(this.mixinNotify.intervalId)
            }
            let intervalId
            console.log("_mixinNotifyStart")
            if(this.mixinNotify.config.on){
                intervalId = window.setInterval(function () {
                    /**未登录或者登录超时，不进行登录请求*/
                    if(!_this.$store.state.system.isLogin || _this.$store.state.system.isLogTimeOut){
                        return
                    }
                    _this.$ajaxPromise(_this.mixinNotify.config.requestPath,{},"POST",false)
                        .then(function (res) {
                            console.log("收到通知",res)
                            notifyResponseHanlder(res,_this)
                        })
                        .catch(function (error) {
                            console.log("通知请求异常",error)
                        })
                },this.mixinNotify.config.frequency)
                this.mixinNotify.started = true
                this.mixinNotify.intervalId = intervalId
            }

        },
        _mixinNotifyStop:function () {
            if(this.minxNotify.started){
                    window.clearInterval(this.mixinNotify.intervalId)
             }
        },
        ...mapActions({
            systemNotifySet:"systemNotifySet"
        })
    },
    mounted () {

    },
    beforeDestory () {
        console.log("monistornixin beforeDestory")
        this._mixinNotifyStop()
    }
}


