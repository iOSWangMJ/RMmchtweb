/**
 * Created by wwj on 2017/3/7.
 */
import {syncRequest,ajaxPromise} from '../utils/HttpRequestUtil'
import {SYS_RESPONSE_CODE_KEY,SYS_RESPONSE_CODE_SUC,SYS_RESPONSE_CODE_AUTHFAIL} from '../context/RequestContext'
import {LOG_CHECK,LOG_IN,LOG_OUT} from '../context/SystemUrl'
import Vue from 'vue'


function systemError(error,vueObject) {
    if(Vue.isDevelop){
        if(vueObject){
            vueObject.$notify.error({
                title: '系统异常',
                message: error,
                duration: 0
            });
        }else {
            alert("系统异常:"+error)
        }
    }else {
        console.error("登录状态校验异常",error)
    }

}

function loginOut(vueObject) {
    vueObject.$store.dispatch('systemIsLoginSet',false)
}

export function logStatCheck(vueObject) {

    ajaxPromise(LOG_CHECK,{},"get",false).then(function (result) {
        if(result){
            if(!SYS_RESPONSE_CODE_KEY in result){
                systemError("登录状态校验返回对象格式异常",vueObject)
            }
            if(result[SYS_RESPONSE_CODE_KEY] === SYS_RESPONSE_CODE_SUC){
                console.info("登录状态校验成功")
            }else {
                console.info("登录状态校验失败")
                loginOut(vueObject)
            }
        }else{
            systemError("登录状态校验返回为空",vueObject)
        }
    }).catch(function () {
        systemError("登录状态校验通信异常",vueObject)
    })
}


export function syncLogStatCheck(vueObject) {
    let result = syncRequest(LOG_CHECK,{},"get")
    console.log("syncLogStatCheck",result)
    if(result){
        if(!SYS_RESPONSE_CODE_KEY in result){
            systemError("返回对象格式异常",vueObject)
        }
        if(result[SYS_RESPONSE_CODE_KEY] === SYS_RESPONSE_CODE_SUC){
            return true
        }else {
            return false
        }
    }else{
        return null
    }
}
