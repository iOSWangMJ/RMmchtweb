
// TODO: 设置全局fliter,  （关于数据字典 data 来源，1， 后台请求，2 . 前台写死数据）
import Vue from 'vue'

function dictFormat(value,dict,limit){
    if (!value) {
        return '-'
    }
    let data = dict[limit]
    if (data) {
        for (var i = 0; i < data.length; i++) {
            if (value == data[i]['key']) {
                return data[i].value
            }
        }
    } else {
        console.error('dict data error:',limit);
        return value
    }
}

//长字符串处理
function longStringFilter(value,limit){
    if (!value) {
        return
    }
    if (value.length>20) {
        let str =  value.slice(0,12)+'...'+value.slice(value.length-6)
        return str
    }
    return value
}

// 日期处理 yyyyMMdd => yyyy-MM-dd
function  dateFilter(value){
    if (!value) {
        return '-'
    }
    let year = value.substr(0,4)
    let month = value.substr(4,2)
    let date = value.substr(6,2)
    return year +'-' +month +'-'+date
}

//时间过滤  timerFilter  hhMM hh:MM
function timerFilter (value){
    if (!value) {
        return '-'
    }
    let hour = value.substr(0,2)
    let minus = value.substr(2,2)
    return hour +':' +minus
}
Vue.filter('dictFormat',dictFormat)
Vue.filter('dateFilter',dateFilter)
Vue.filter('timerFilter',timerFilter)
Vue.filter('longStringFilter',longStringFilter)
