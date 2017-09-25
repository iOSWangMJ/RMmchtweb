/**
 * Created by wwj on 2017/3/9.
 */
import { Loading } from 'element-ui';
import Vue from 'vue'

import mixinStatus from './watcherStatus'


/**
 * 监控组件初始工作是否全部完成，完成才显示组件。
 */
export default {
    data(){
        return {
            mixinShowWatcher:{
                initFinished:false,
                initStatusArray:[],
                percentage:0,
                error:false,
                intervalId:0
            }
        }
    },
    computed:{
        mixinShowWatcherPercentage:function () {
            return this.mixinShowWatcher.percentage
        },
        mixinShowWatcherLoading:function () {
            return  !this.mixinShowWatcher.initFinished
        },
        mixinShowWatcherLoadingError:function () {
            return this.mixinShowWatcher.error
        }
    },
    methods: {
        mixinShowWatchePropertyAdd(property) {
            this.mixinShowWatcher.initStatusArray.push(property)
        },
        mixinShowWatcherCheck () {
            let allFinished = true
            let _this = this
            mixinStatus.forEach(function (stat) {
                if(stat in _this){
                    if(_this[stat] !== true){
                        allFinished = false
                    }
                }
            })
            if(allFinished){
                this.mixinShowWatcher.initFinished = true
                this.mixinShowWatcherProgressStop(true)
            }
        },
        mixinShowWatcherProgressStart (){
            this.mixinShowWatcher.percentage = 0
            var _this = this
            this.mixinShowWatcher.intervalId = window.setInterval(function () {
                _this.mixinShowWatcher.percentage += 1
                if(_this.mixinShowWatcher.percentage == 100){
                    _this.mixinShowWatcherProgressStop(false)
                }
            },Vue.loadTimeOut/100)
        },
        mixinShowWatcherProgressStop (isSuc) {
            clearInterval(this.mixinShowWatcher.intervalId)
            let _this =this
            if(isSuc){
                this.mixinShowWatcher.percentage = 100
            }else{
                this.mixinShowWatcher.error = true
                this.$notify.error({
                    title: '组件加载超时',
                    message: '继续等待或重新打开菜单尝试再次加载,如多次尝试未果请联系管理员'
                });
            }
        }
    },
    created () {
        this.mixinShowWatcherProgressStart()
    }
}


