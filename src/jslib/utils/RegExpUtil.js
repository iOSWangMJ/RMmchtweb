/**
 * Created by wwj on 2017/5/4.
 */
/*是否带有小数*/
function    isDecimal(strValue )  {
    var  objRegExp= /^\d+\.\d+$/;
    return  objRegExp.test(strValue);
}

/*校验是否中文名称组成 */
function ischina(str) {
    var reg=/^[\u4E00-\u9FA5]{2,4}$/;   /*定义验证表达式*/
    return reg.test(str);     /*进行验证*/
}


/*校验电话码格式 */
function isTelCode(str) {
    var reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    return reg.test(str);
}

/*校验邮件地址是否合法 */
function isEmail(str) {
    var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}

/*校验登录用户名是否合法（数字和英文） */
function isLoginName(str) {
    var reg=/^[a-zA-Z0-9]+$/;
    return reg.test(str);
}

/*校验登录用户名是否合法（数字和英文以及特殊字符） */
function isPassWord(str) {
    var reg=/^[a-zA-Z0-9~!@#$%^&*]+$/;
    return reg.test(str);
}



function isIP(s) //by zergling
{
    var patrn=/^[0-9.]{1,20}$/;
    if (!patrn.exec(s)) return false
    return true
}
//校验邮政编码
function isPostalCode(s)
{
//var patrn=/^[a-zA-Z0-9]{3,12}$/;
    var patrn=/^[a-zA-Z0-9 ]{3,12}$/;
    if (!patrn.exec(s)) return false
    return true
}

//校验输入是否为数字并且最多两位小数位
function isMoneyNum(value){
    var reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
    return reg.test(value);
}

//baseForm中检验输入是否为数字格式并且最多两位小数位
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入预算总额'));
    } else {
        let reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
        if (!reg.test(value)) {
            callback(new Error('请输入数字且小数位最多只能有两位'));
        }
        callback();
    }
};


export {isDecimal,ischina,isTelCode,isEmail,isLoginName,isPassWord,isIP,isPostalCode,isMoneyNum,validatePass}
