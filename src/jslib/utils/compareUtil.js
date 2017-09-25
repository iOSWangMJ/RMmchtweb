/**
 * Created by wwj on 2017/5/9.
 */
/**
 * 比较两个字符串数组，内容是否相同（内容顺序无关）
 * @param arrayA
 * @param arrayB
 * @returns {boolean}
 * @constructor
 */
export function stringArrayComp(arrayA,arrayB){
    if (!arrayA)
        throw "比较的第一个数组未定义"
    if (!arrayB){
        throw "比较的第二个数组未定义"
    }


    // compare lengths - can save a lot of time
    if (arrayA.length != arrayB.length)
        return false;

    for (let i = 0, l = arrayA.length; i < l; i++) {
        // Check if we have nested arrays
        if (!arrayB.includes(arrayA[i])) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
