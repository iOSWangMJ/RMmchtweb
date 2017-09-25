/**
 * Created by wwj on 2016/10/26.
 * 全局store 定义公共响应 如全局加载标志位
 */
import * as types from '../mutation-types'

const state = {
    isShowNotice:false,
    /**是否登录 仅登录时可以看到功能页面*/
    isLogin: false,
    /**用户全量有权限菜单*/
    menus:[],
    /**所选商户*/
    selectMcht:{},
    /**登录用户信息*/
    userInfo:{},
    /**是否需要选择商户*/
    isSelectMcht:false,
    /**默认打开的标签*/
    openedMenus:{
        "menuId":"1021",
        "menuName":"用户登录信息",
        "groupFlag":"02",
        "iconClass":"",
        "pMenuId":"1020",
        "path":"/mchtsCenter/userpwd",
        "compName":"UserPwd",
        "authList":[],
        "childrenList":[]
    }
}

const mutations = {
    [types.SYSTEM_SELECTMCHT_SET] (state,{selectMcht}){
        state.selectMcht = selectMcht
    },
    [types.SYSTEM_ISSELECTMCHT_SET] (state,{isSelectMcht}){
        state.isSelectMcht = isSelectMcht
    },
    [types.SYSTEM_IS_LOGIN_SET] (state, {isLogin}) {
        state.isLogin = isLogin
    },
    [types.SYSTEM_MENU_SET] (state, {menus}) {
        state.menus = menus
    },
    [types.SYSTEM_USERINFO_SET] (state, userInfo) {
        state.userInfo = userInfo
    },
    [types.SYSTEM_OPENED_MENU_SET] (state, menus){
        state.openedMenus = menus
    },
    [types.SYSTEM_IS_SHOW_NOTICE] (state, isShowNotice){
        state.isShowNotice = isShowNotice
    }
}

export default {
  state,
  mutations
}
