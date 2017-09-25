/**
 * Created by wwj on 2017/3/9.
 */

/***
 * 对组件对象属性进行校验 预留
 */
export default {
    beforeMount () {

        this._propertyCheck()
    },
    methods : {
        _propertyCheck: function () {
            console.log("_propertyCheck")
        }

    }

}
