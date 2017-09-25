/**
 * Created by wwj on 2017/2/3.
 */
import $ from 'jquery';
import Vue from 'vue'
import {encrypt,decrypt} from '../encrypt/aes'
import config from '../../config'
import {
    SYS_RESPONSE_CODE_KEY,
    SYS_RESPONSE_MSG_KEY,
    SYS_RESPONSE_CODE_AUTHFAIL,
    SYS_RESPONSE_CODE_SUC,
    _HOST
} from '../context/RequestContext';
import {} from '../response/checkResponse'
const uuidv4 = require('uuid/v4');
import state from '../../vuex/modules/system.js'
export function responseSucCheck(response) {
    if (!SYS_RESPONSE_CODE_KEY in response){
        return false
    }
    if (response[SYS_RESPONSE_CODE_KEY] === SYS_RESPONSE_CODE_SUC) {
        return response
    }else{
        return false
    }
}
function toKeyValue(data,ifEncrypt) {
    let dataStr =''
    for(let property in data){
        if(ifEncrypt){
            dataStr+= property+"="+encrypt(data[property],config.aesKey)
        }else{
            dataStr+= property+"="+data[property]+'&'
        }
    }
    return dataStr
}
function ajaxSucHandler(result, sucHandler, failHandler, vueObject) {
    if (!SYS_RESPONSE_CODE_KEY in result || !SYS_RESPONSE_MSG_KEY in result) {
        if (vueObject) {
            vueObject.$notify.error({
                title: '格式错误',
                message: '系统返回报文格式异常,返回中没有包含返回码或返回信息',
                duration: 3000
            });
        } else {
            alert('系统返回报文格式异常,返回中没有包含返回码或返回信息')
        }
    }
    /**如果没有不是0000 都算错误*/
    if (result[SYS_RESPONSE_CODE_KEY] === SYS_RESPONSE_CODE_SUC||result[SYS_RESPONSE_CODE_KEY]==='6003') {
        sucHandler(result)
    } else {
        vueObject.$notify.error({
            title: '请求处理不成功',
            message: result[SYS_RESPONSE_MSG_KEY],
            duration: 3000
        });
        failHandler(result)
    }
}
function ajaxFailHandler(error, reject,vueObject,systemError) {
    if (vueObject) {
        vueObject.$notify.error({
            title: '系统异常',
            message: '详细请查看浏览器控制台错误输出',
            duration: 3000
        });
    } else {
        alert('系统异常')
    }
    if(reject){
        reject("9999","系统通信错误",error)
    }
}
/*
 * 功能：生成一个GUID码，其中GUID以14个以下的日期时间及18个以上的16进制随机数组成，GUID存在一定的重复概率，但重复概率极低，理论上重复概率为每10ms有1/(16^18)，即16的18次方分之1，重复概率低至可忽略不计
 * 免责声明：此代码为作者学习专用，如在使用者在使用过程中因代码问题造成的损失，与作者没有任何关系
 * 日期：2014年9月4日
 * 作者：wyc
 */
//GenNonDuplicateID()将生成 rfmipbs8ag0kgkcogc 类似的ID
/**
 * ajax请求方法 不推荐使用。推荐使用ajaxPromise方法
 * @param url 地址
 * @param data 数据对象
 * @param sucHandler 成功受理回调函数，接受一个参数，返回对象
 * @param failHandler 失败受理回调函数，接受一个参数，返回对象
 * @param vueObject VUE组件对象，在组件中传入this 如果是组件在通过原型方法访问 不同传入vueObject，直接使用this即可
 */
// export function ajaxCommonRequest(url, data, sucHandler, failHandler, vueObject) {
//     /**如果是组件在通过原型方法访问 不同传入vueObject，直接使用this即可*/
//     if(!vueObject && '$notify' in this){
//         vueObject = this
//     }
//     $.ajax({
//         type: "POST",
//         dataType: "json",
//         url: _HOST + url,
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         success: function (result) {
//             ajaxSucHandler(result, sucHandler, failHandler, vueObject)
//         },
//         error: function (error) {
//             ajaxFailHandler(error, vueObject)
//         }
//     })
// }
/**
 * Promise版本 推荐
 * 使用方法 ajaxPromise(地址,数据,类型:POST/GET...).then(function(response){成功逻辑}).catch(function(error){失败逻辑})
 * @param url
 * @param data
 * @param respAuto //是否自动解析返回码并提示；只有当返回码是0000时才调用成功处理函数
 * @param additional ajax补充对象
 * @returns {Promise}
 */
function getPublicParam(){
    let vuexState = state.state;
    let obj = {};let date = new Date();
    obj.reqSsn = uuidv4().split('-').join('');
    obj.reqDate = String(date.getFullYear())+(date.getMonth()+1<10?(0+String(date.getMonth()+1)):String(date.getMonth()+1))+String(date.getDate());
    obj.reqTime = String(date.getHours()) + (date.getMinutes()<10?0+String(date.getMinutes()):String(date.getMinutes())) + (date.getSeconds()<10?0+String(date.getSeconds()):String(date.getSeconds()));
    obj.channel = '412';
    //预留 业务代码obj.busCode = ''; 步骤编码obj.stepCode='';
    if(vuexState.selectMcht.mchtId){
        obj.mchtId = vuexState.selectMcht.mchtId;
    }
    if(vuexState.userInfo.userId){
        obj.userId = vuexState.userInfo.userId
    }
    obj.termType = '3';
    obj.clientVersion = '0.0.1';
    //预留uuid obj.termCode = ''
    return obj;
}

// download file no use ajaxpromise  , http method 'GET' reuqest by wwq
export function urlParams(data){
    let publicParam = getPublicParam()
    let request=  JSON.stringify(Object.assign(data,publicParam));
    request = toKeyValue(data)
    return request
}
export function ajaxPromise(url,data,type,respAuto,additional) {
    let _this = this;
    //流水号
    let publicParam = getPublicParam();

    let request ;
    if(type.toString().toUpperCase() === "GET"){
        request=  JSON.stringify(Object.assign(data,publicParam));
        request = toKeyValue(data)
        // url = url+"?"+request
    }else{
        request=  JSON.stringify(Object.assign(data,publicParam));
    }
    if(Vue.isDevelop){
        console.log("ajaxPromise调用",url,data,type,respAuto)
    }
    // console.debug("请求:"+request)
    let promise = new Promise(function (resolve, reject) {
        let config = {
            type: type,
            dataType: "json",
            url: _HOST + url,
            contentType: 'application/json',
            data: request,
            success: function (result) {
                /**如果自动解析返回码，使用统一返回验证办法*/
                if(respAuto){
                    ajaxSucHandler(result,resolve,reject,_this)
                }else{
                    resolve(result)
                }
            },
            error: function (error) {
                console.log("promise ERROR")
                if(respAuto) {
                    ajaxFailHandler(error, reject, _this)
                }else{
                    reject("9999","通信异常",error)
                }
            }
        }
        if(additional){
            config = $.extend(config, additional)
        }
        $.ajax(config)
    })
    return promise;
}
export function commonErrorNotidy(desc,result) {
    let msg = desc
    if(Vue.isDevelop){
        msg += " 错误码:"+result[SYS_RESPONSE_CODE_KEY]+"错误信息:"+result[SYS_RESPONSE_MSG_KEY]
    }
    this.$notify.error({
        title: '返回异常',
        message: msg,
        duration: 3000
    });
}
/**
 * 通用查询对象
 * @param index  //当前分页页码
 * @param pageSize //每页数据量
 * @param query //查询条件
 * @returns {{index: *, pageSize: *, query: *}}
 */
export function getCommonRequest(index,pageSize,query) {
    let exclusiveEmptyQuery = {};
    for(let prop in query){
        if((query[prop] + '').length > 0){
            exclusiveEmptyQuery[prop] = query[prop]
        }
    }
    return {
        index:index,
        pageSize:pageSize,
        query:exclusiveEmptyQuery
    }
}
function isEmptyObject(obj) {
    for (var name in obj){
        return false;//返回false，不为空对象
    }
    return true;//返回true，为空对象
}
/**
 * 获得更新请求对象
 * @param oldObject
 * @param newObject
 * @param id
 * @returns {{oldData: {}, updateTo: {}, id: *}}
 */
export function getUpdateRequest(oldObject,newObject,id) {
    let updateRequest ={
        oldData:{},
        updateTo:{},
        id:id
    }
    for(let param in newObject){
        if(!param in oldObject){
            updateRequest.updateTo[param] = newObject[param]
        }else{
            /**如果属性为数组，原值和更新对象都包含该数组*/
            if(newObject[param] instanceof Array){
                updateRequest.updateTo[param] = newObject[param]
                updateRequest.oldData[param] = oldObject[param]
                /**如果为对象，当对象不同时原值和更新对象赋值*/
            }else if(typeof newObject[param] === 'object'){
                if(!isObjectValueEqual(oldObject[param],newObject[param])){
                    updateRequest.updateTo[param] = newObject[param]
                    updateRequest.oldData[param] = oldObject[param]
                }
                /**其他情况，值不同的时候，赋值 */
            }else if(newObject[param] !== oldObject[param]){
                updateRequest.updateTo[param] = newObject[param]
                updateRequest.oldData[param] = oldObject[param]
            }
        }
    }
    if(isEmptyObject(updateRequest.oldData) || isEmptyObject(updateRequest.updateTo)){
        return false;
    }
    return updateRequest
}
function isObjectValueEqual(a, b) {
    if(typeof a == 'number' && typeof b == 'number'){
        return a == b
    }
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if(Object.prototype.toString(a[propName]) == '[Object Object]'||Object.prototype.toString(b[propName]) == '[Object Object]'){
            isObjectValueEqual(a[propName],b[propName])
        }
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}
