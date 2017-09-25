/**
 * Created by wwj on 2017/3/2.
 */
function getFailResult(reason) {
  return {
    "result":false,
    "reason":reason ? reason :'验证失败(开发请指定失败原因)'
  }
}
function getSucResult() {
  return {
    "result":true,
    "reason":'验证成功'
  }
}
export {getFailResult ,getSucResult }
