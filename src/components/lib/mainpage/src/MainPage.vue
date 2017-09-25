<template>
    <el-row class="bs-container">
        <system-select-merchant v-if="getSystemIsSelectMcht"></system-select-merchant>
        <el-row v-if="!getSystemIsSelectMcht" class="bs-index">
            <div class="bs-main">
                <mcht-menu style="height:100%;overflow-y:auto;overflow-x: hidden;width: 200px;" @clickMenu="clickMenu" ref="mchtMenu"></mcht-menu>
                <div style="height:100%;flex: 1">
                    <div class="content-main">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </el-row>
    </el-row>
</template>

<script>
    import MchtMenu from '../../menu'
    import {mapActions, mapGetters} from 'vuex'
    import SmoothlyMenu from '../../../../jslib/ui/hplus'
    import {LOG_OUT} from '../../../../jslib/context/SystemUrl'
    import {encrypt} from '../../../../jslib/encrypt/aes'
    import config from '../../../../config'
    import {SystemSelectMerchant,SystemNotice} from '../../../system'
//    require('../../../../tools/jquerycookie/jquery.cookie')
    export default {
        name: 'mainPage',
        components: {
            MchtMenu,
            SystemSelectMerchant,
            SystemNotice
        },
        data () {
            let validateNewPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('不能为空'));
                } else if (value == this.passwdChangeform.oldPasswd) {
                    callback(new Error('不能与原密码相同'));
                } else {
                    callback();
                }
            };
            let validateAgainPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passwdChangeform.newPsswd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                //排版功能部分
                isShowMenu: true,
                passwdChangeFormRules:{
                    oldPasswd: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    newPsswd: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { validator: validateNewPass, trigger: 'blur' }
                    ],
                    newPsswdAgain: [
                        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                        { validator: validateAgainPass, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                getSystemIsSelectMcht: 'getSystemIsSelectMcht',
                getSystemOpenedMenus:'getSystemOpenedMenus'
            })
        },
        methods: {
            ...mapActions({
                systemIsLoginSet: 'systemIsLoginSet'
            }),
            clickMenu(menu){
                this.$router.push(menu.path);
            },
            refreshMenu(){
                this.$router.push('/mchtsCenter/userpwd');
                this.$refs.mchtMenu.handleResetActiveMenu();
            }
        },
        mounted: function () {
          //默认打开登录信息页
          this.$router.push(this.getSystemOpenedMenus);
        }
    }

</script>

<style scoped lang="scss">
    $menu-nav-active:#de0000;
    $menu-nav-hover:#e6e6e6;
    .content-main{
        overflow-y: auto;
        background: #ebf1f5;
        box-sizing: border-box;
        padding: 30px;
        height: 100%;
    }
    .bs-main{
        height: 100%;
        display: flex;
        flex-direction: row;
        background: #253238;
    }
    .bs-container .sub-menu{
        text-align: center;
        height: 100%;
        width: 253px;
        background: $menu-nav-hover;
        overflow-y: auto;
    }
    .bs-container .menu-nav{
        height: 70px;
        margin-bottom: 20px;
        background: $menu-nav-hover;
        overflow-x: auto;
    }
    .menu-nav .el-menu-item:not(.is-active):hover{
        background: $menu-nav-hover;
    }
    .menu-nav .el-menu-item{
        width: 200px;
        text-align: center;
        height: 100%;
        line-height: 70px;
    }
    .menu-nav .el-menu-item.is-active,.menu-nav .el-menu-item.is-active:hover{
        color: white;
        background: $menu-nav-active;
    }
    .menu-nav.el-menu--horizontal > .el-menu-item,.menu-nav.el-menu--horizontal > .el-menu-item:hover{
        border: none;
    }
    .bs-index{
        height: 100%;
        width: 100%;
    }
    .bs-container{
        /*overflow-y: auto;*/
        height:calc(100% - 94px);
        background: #ecf0f4;
    }
</style>
