/**
 * Created by wwj on 2017/3/8.
 */
import Vue from 'vue'

const NOTIFIES = "notifies"
const TYPE = "type"
const SUB_TYPE = "subType"
const TITLE = "title"
const TEXT = "text"

const TYPE_TEXT='01'
const TYPE_ACTION='02'
/**导航栏显示文本*/
const SUBTYPE_TEXT_NAVSHOW='01'
/**弹出通知显示*/
const SUBTYPE_TEXT_NOTIFY='02'

const ACTION_TYPE_LOGINOUT = "01"
const ACTION_TYPE_RELOGIN = "02"


function actionHandler(notice,vueObject) {
    /**如果注销，弹出提示并将登陆状态设定为false*/
    if(notice[SUB_TYPE] === ACTION_TYPE_LOGINOUT){
        vueObject.$msgbox({
            title: TITLE in notice ? notice[TITLE]:'注销',
            message: TEXT in notice ?　notice[TEXT]:'强制下线',
            showCancelButton: false,
            confirmButtonText: '确定',
            closeOnPressEscape:false,
            closeOnClickModal:false
        }).then(action => {
            vueObject.$store.dispatch('systemIsLoginSet',false)
        });
    /**如果需要重新登录，将超时状态设定为true，App.vue对应的登录验证框就会弹出*/
    } else if(notice[SUB_TYPE] === ACTION_TYPE_RELOGIN){
        vueObject.$store.dispatch('systemIsLogTimeOutSet',true)
    } else {
        if(Vue.isDevelop){
            vueObject.$notify.error({
                title: '系统异常',
                message: '返回通知子类型未知='+notice[SUB_TYPE],
                duration: 0
            });
        }else{
            console.error( '返回通知子类型未知='+notice[SUB_TYPE])
        }
    }
}

function notifyTtextHandler(notice,vueObject) {
    vueObject.$notify({
        title: notice[TITLE],
        message:  notice[TEXT],
        duration: 0
    });
}

function notifyHanlder(notices,vueObject) {
    let textNotices = []
    notices.forEach(function (notice) {
        switch (notice[TYPE]){
            case TYPE_ACTION:{
                actionHandler(notice,vueObject)
                break
            }
            case TYPE_TEXT:{
                if(notice[SUB_TYPE] === SUBTYPE_TEXT_NAVSHOW){
                    textNotices.push(notice)
                }else if(notice[SUB_TYPE] === SUBTYPE_TEXT_NOTIFY){
                    notifyTtextHandler(notice,vueObject)
                }
                break
            }
        }
    })
    vueObject.systemNotifySet(textNotices)

}
export default function notifyResponseHanlder(response,vueObject){

    if('notices' in response && response.notices.length > 0){
        notifyHanlder(response.notices,vueObject)
    }
}

