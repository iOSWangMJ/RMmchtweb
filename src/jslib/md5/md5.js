/**
 * Created by wangmj on 2017/8/29.
 */
import md5 from 'js-md5'

function encrypt(strData) {
    return md5(strData);
}

export {encrypt};
