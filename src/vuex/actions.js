/**
 * Created by wwj on 2016/10/26.
 * 全局actons
 * 命名规范组件名称简写+动作
 */
import * as types from './mutation-types'

/** global start **/
export const systemIsLoginSet = ({ commit }, isLogin) => {
  commit(types.SYSTEM_IS_LOGIN_SET, {
    isLogin: isLogin
  })
}
export const systemSelectMchtSet = ({ commit }, selectMcht) =>{
    commit(types.SYSTEM_SELECTMCHT_SET,{
        selectMcht:selectMcht
    })
}
export const systemIsSelectMchtSet = ({ commit }, isSelectMcht) =>{
    commit(types.SYSTEM_ISSELECTMCHT_SET,{
        isSelectMcht:isSelectMcht
    })
}
export const systemMenusSet = ({ commit }, menus) => {
    commit(types.SYSTEM_MENU_SET, {
        menus: menus
    })
}
export const systemOpenedMenusSet = ({ commit }, menus) => {
    commit(types.SYSTEM_OPENED_MENU_SET, menus)
}
export const systemUserInfoSet = ({ commit }, userInfo) => {
    commit(types.SYSTEM_USERINFO_SET, userInfo)
}
export const systemIsShowNotice = ({ commit },isShowNotice) => {
    commit(types.SYSTEM_IS_SHOW_NOTICE, isShowNotice)
}
/** global end **/


