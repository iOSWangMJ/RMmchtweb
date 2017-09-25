/**
 * Created by wwj on 2017/4/5.
 */
import CryptoJS from 'crypto-js'


/**
 * AES对称加密
 * @param strData
 * @param encryKey
 */
function encrypt(strData,encryKey) {
    let key = CryptoJS.enc.Utf8.parse(encryKey)
    let iv  = CryptoJS.enc.Utf8.parse(encryKey)
    let srcs = CryptoJS.enc.Utf8.parse(strData)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
/**
 * AES解密
 * @param strData
 * @param decryKey
 * @returns {string|String}
 */
function decrypt(strData,decryKey) {

    let key = CryptoJS.enc.Utf8.parse(decryKey)
    let iv  = CryptoJS.enc.Utf8.parse(decryKey)
    let decryptedData = CryptoJS.AES.decrypt(strData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding:  CryptoJS.pad.Pkcs7
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
}


export {encrypt , decrypt}
