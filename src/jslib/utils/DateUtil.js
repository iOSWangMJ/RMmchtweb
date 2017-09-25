export const YYYY_MM_DD = 'yyyy-MM-dd'
export const HH_MM_SS = 'hh:mm:ss'
export const YYYYMMDDHHMMSS = 'yyyyMMddhhmmss'
export function format(date,fmt) {
    var o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
export function strToDate(datatime) {
    let formatedDate = datatime.replace(pattern, '$1/$2/$3 $4:$5:$6');
    return new Date(formatedDate)
}
