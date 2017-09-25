<template>
    <el-row style="height:100%;min-height:582px;width: 100%;min-width:1349px;background: #ecf0f4;">
        <el-row v-if="getSystemIsLogin||resetPwd||forgetPwd||getSystemIsShowNotice" class="public-title">
            <el-row class="public-content">
                <el-row style="float: left">
                    <span class="public-title-logo" href="#">
                        <img height="24px" src="./assets/logo@2x.png" alt="">
                    </span>
                </el-row>
                <el-row v-if="getSystemIsLogin&&!getSystemIsSelectMcht" class="img-buttons">
                    <img @click="handleClickNoticeCenter" src="./assets/notice@2x.png" width="22" height="22" alt="">
                    <img src="./assets/help@2x.png" width="22" height="22" alt="">
                    <img @click="handleClickLoginOut" width="20" height="20" src="./assets/SignOut@2x.png" alt="">
                </el-row>
                <el-row v-if="getSystemIsLogin&&!getSystemIsSelectMcht" id="bs-select-row">
                    <div @click="handleClickBsSelect" :style="{cursor: getSystemUserInfo.dataList.length>1?'pointer':'default'}" class="bs-select">
                        <el-row>{{getSystemSelectMcht.mchtId}}&nbsp;&nbsp;</el-row>

                        <el-row class="bussiness-name"> ({{getSystemSelectMcht.mchtSimpleName}}</el-row>
                        <el-row style="margin-right: 10px;">)</el-row>
                        <el-row v-if="getSystemUserInfo.dataList.length>1">
                            <span class="triangle"></span>
                            <!--<img v-if="getSystemUserInfo.dataList.length>1" width="14" src="./assets/down arrow2-@3x.png" alt="">-->
                        </el-row>
                    </div>
                    <div v-show="isShowSelectList" class="bs-select-list">
                        <ul style="padding: 0;margin: 0;">
                            <li @click="handleClickBsSelectList(item)" v-for="(item,index) in getSystemUserInfo.dataList" :key="index">
                                <span>{{item.mchtId}}</span>
                                <span>{{item.mchtName}}</span>
                            </li>
                        </ul>
                    </div>
                </el-row>
            </el-row>
        </el-row>
        <transition name="el-fade-in">
            <system-forget-password @setForgetPwd="setForgetPwd" v-if="forgetPwd">
            </system-forget-password>
        </transition>
        <transition name="el-fade-in">
            <main-page ref="mainPage" v-if="getSystemIsLogin">
            </main-page>
        </transition>
        <transition name="el-fade-in">
            <system-reset-password :cloneLoginData="cloneLoginData" @logRequestSucHandle="logRequestSucHandle" @setResetPwd="setResetPwd" v-if="resetPwd">
            </system-reset-password>
        </transition>
        <keep-alive >
            <router-view v-if="getSystemIsShowNotice"></router-view>
        </keep-alive>
        <el-row v-if="getSystemIsLogin||resetPwd||forgetPwd||getSystemIsShowNotice" class="public-footer">
            <el-col>贵州省农村信用社版权所有</el-col>
        </el-row>
        <el-row v-if="!getSystemIsShowNotice&&!closeLoginIndex&&!getSystemIsLogin && !forgetPwd && !resetPwd" class="ifsp-login-container">
            <div class="index-title">
                <el-row>
                    <span class="index-title-logo" href="#">
                        <img height="24px" src="./assets/logo@2x.png" alt="">
                    </span>
                    <a class="help-center" v-if="!resetPwd" href="#">
                        <img width="19" style="cursor: pointer;" src="./assets/help@2x.png">
                        <span style="margin-left: 10px">{{getSystemIsLogin?'':'帮助中心'}}</span>
                    </a>
                </el-row>
            </div>
            <el-carousel indicator-position="none" class="bg-carousel" arrow="always">
                <el-carousel-item v-for="(item,index) in bannerImg" :key="index">
                    <a :href=item.jumpUrl target="_blank">
                        <img :src=item.showUrl alt="" :style="{minWidth:'1349px',width:'100%'}" height="100%" :width="screenWidth+'px'">
                    </a>
                </el-carousel-item>
            </el-carousel>

            <el-row class="ifsp-login">
                <el-row>
                    <el-col class="user-login-text">
                        用户登录
                    </el-col>
                    <el-col style="height: 1px;border: 1px solid #666666;margin-bottom: 26px;"></el-col>
                    <el-col>
                        <el-form class="login-form" :v-loading="status.loginChecking"  element-loading-text="登录环境检查中..." :model="formData"  ref="loginForm"  :rules="loginFormRules" :label-position="formConfig.labelPosition">
                            <el-form-item  prop="user">
                                <img class="input-icon" src="./assets/user@2x.png" alt="">
                                <el-input :maxlength="11" v-model="formData.user" placeholder="用户名">
                                </el-input>
                            </el-form-item>
                            <el-form-item  prop="passwd">
                                <img class="input-icon" src="./assets/Password@2x.png" alt="">
                                <el-input :maxlength="20" type="password" placeholder="密码" v-model="formData.passwd"></el-input>
                            </el-form-item>
                            <el-form-item prop="validateCode">
                                <img class="input-icon" src="./assets/Verification Code@2x.png" alt="">
                                <el-input :maxlength="4" style="width: 144px;" placeholder="验证码" v-model="formData.validateCode"></el-input>
                                <img @click="handleClickverificationCodeImg" :src="getRandMcoderKey+randMcoderKey" class="verification-code">
                            </el-form-item>
                            <el-form-item>
                                <el-button class="public-button public-green login-button" :loading="status.loginCommitRequesting" @click="onSubmit('loginForm')" >登录</el-button>
                                <button v-show="1 == 2" v-shortkey="['enter']" @shortkey="onSubmit('loginForm')"></button>
                            </el-form-item>
                            <p class="login-forget-password">
                                <span @click="handleClickForgetPwd" class="forget-password">忘记密码</span>
                            </p>
                        </el-form>
                    </el-col>
                </el-row>

            </el-row>
            <el-row class="index-notice">
                <el-col>
                    <img width="27" src="./assets/notice@2x.png" alt="">
                    <span style="margin-left: 22px;">系统公告:</span>
                    <span style="margin:0 58px 0 46px;">今天是{{localeDate}}</span>
                    <span @click="handleClickNoticeCenter" class="more-notice">更多</span>
                    <span @click="handleClickNoticeContent" class="notice-content">
                        {{notice}}
                    </span>
                </el-col>
            </el-row>
            <el-row class="index-footer">
                <el-col>贵州省农村信用社版权所有</el-col>
            </el-row>
        </el-row>
    </el-row>
</template >

<script>
    const uuidv4 = require('uuid/v4');
    import {MainPage} from './components/lib'
    import {mapActions, mapGetters} from 'vuex'
    import {encrypt} from './jslib/md5/md5'
    import config from './config'
    import * as requestUrl from './jslib/context/SystemUrl'
    import * as RegExpUtil from './jslib/utils/RegExpUtil'
    import {SystemForgetPassword,SystemResetPassword,SystemNotice} from "./components/system"
    export default {
        name: 'app',
        components: {
            SystemForgetPassword,
            MainPage,
            SystemResetPassword,
            SystemNotice
        },
        data () {
            let checkPassWord = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }
                if (value.length<6 || value.length>20){
                    return callback(new Error('密码长度大于6位小于20位'));
                }
                if(!RegExpUtil.isPassWord(value)){
                    return callback(new Error('密码不能包含特殊字符'));
                }
                callback()
            };
            return {
                getRandMcoderKey:'',
                  defaultOpenedMenu:{
                      "menuId":"1021",
                      "menuName":"用户登录信息",
                      "groupFlag":"02",
                      "iconClass":"",
                      "pMenuId":"1020",
                      "path":"/mchtsCenter/userpwd",
                      "compName":"UserPwd",
                      "authList":[],
                      "childrenList":[]
                  },
                isUseRouter:false,
                closeLoginIndex:false,
                isShowNotice:false,
                cloneLoginData:{},
                randMcoderKey:'',
                verificationCodeImg:'',
                bannerImg:[],
                resetPwd:false,
                isShowSelectList:false,
                screenWidth:0,
                screenHeight:0,
                forgetPwd:false,
                notice:'',
                localeDate:'',
                formConfig: {
                    labelPosition: 'left'
                },
                formData: {
                    user: '',
                    passwd: '',
                    validateCode: ''
                },
                loginFormRules:{
                    user: [
                        { required: true, message: '请输入登录用户名', trigger: 'blur' },
                        { pattern:/(^13\d|14[579]|15\d|17[01235678]|18\d)\d{8}$/, message:'请输入正确的手机号' ,trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { validator: checkPassWord, trigger: 'blur' }
                    ],
                    validateCode: [
                        { min: 4, message: '请输入四位验证码', trigger:'blur' },
                        { required: true, message: '请输入四位验证码', trigger:'blur'}
                    ]
                },
                status :{
                    /**初始登录前状态检查状态*/
                    loginChecking : true,
                    /**登录框提交按钮状态*/
                    loginCommitRequesting : false
                }

            }
        },
        watch:{
            isShowSelectList(){
                let _this = this;
                $(document).mouseup(function(e){
                    let _con = $('#bs-select-row');   // 设置目标区域
                    if(!_con.is(e.target) && _con.has(e.target).length === 0){
                        _this.isShowSelectList=false;
                    }
                });
            }
        },
        methods: {
            handleClickNoticeContent(){
                window.open('/#/system/systemnotice?toItem=true');
            },
            handleClickNoticeCenter(){
                window.open('/#/system/systemnotice');
            },
            setResetPwd(boolen){
                this.resetPwd = boolen
            },
            handleClickForgetPwd(){
                this.formData.passwd = '';
                this.formData.user = '';
                this.formData.validateCode = '';
                this.forgetPwd=true;
            },
            setForgetPwd(boolen){
                this.forgetPwd=boolen;
            },
            /*提交*/
            onSubmit(formName) {
                let validateResult = false
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        validateResult = true
                    } else {
                        validateResult =  false;
                    }
                });
                if(!validateResult){
                    return
                }
                let userPwd = encrypt(this.formData.passwd).toUpperCase();
                this.status.loginCommitRequesting = true
                let data = {
                    phoneNo:this.formData.user,
                    userPwd:userPwd,
                    pwdType:'01'
                }
                let _this = this
//                this.$ajaxPromise(requestUrl.randMcoderKeyCheck,{randMcoderKey:this.randMcoderKey,imgCode:this.formData.validateCode},"POST",true).then(function (resp) {
//                  console.log(resp);
                  _this.$ajaxPromise(requestUrl.login,data,"POST",true).then(function (res) {
                    console.log(res);
                            if(res.respCode === '0000'){
                                if (res.pwdSetFlg === '00'){
                                    _this.logRequestSucHandle(res);
                                }else{
                                    _this.resetPwd = true;
                                    _this.cloneLoginData = res;
                                }
                                _this.status.loginCommitRequesting = false;
                                _this.formData.passwd = '';
                                _this.formData.user = '';
                                _this.formData.validateCode = '';
                            }
                        }).catch(function (error) {
                            console.log(error);
                            _this.status.loginCommitRequesting = false;
                            _this.formData.user = '';
                            _this.formData.passwd = '';
                            _this.formData.validateCode = '';
                            _this.handleClickverificationCodeImg();
                        })
//                }).catch(function (error) {
//                    _this.status.loginCommitRequesting = false;
//                    _this.formData.user = '';
//                    _this.formData.passwd = '';
//                    _this.formData.validateCode = '';
//                    _this.handleClickverificationCodeImg();
//                })
            },
            logRequestSucHandle(res,callback){
                /**设置登录用户信息*/
                let obj ={
                    userId : res.userId,
                    phoneNo : res.phoneNo,
                    userName : res.userName,
                    userType : res.userType,
                    dataList: res.dataList,
                    userAuthList:res.userAuthList
                };
                this.systemUserInfoSet(obj);
                /**设置是否需要弹出选择商户页面*/
                if (obj.dataList.length > 1){
                    this.systemIsSelectMchtSet(true);
                }else{
                    this.systemSelectMchtSet(res.dataList[0]);
                }
                if (arguments.length > 1){
                    callback();
                }
                this.systemIsLoginSet(true);
            },
            ...mapActions({
                systemIsLoginSet: 'systemIsLoginSet',
                systemIsSelectMchtSet:'systemIsSelectMchtSet',
                systemUserInfoSet:'systemUserInfoSet',
                systemSelectMchtSet:'systemSelectMchtSet'
            }),
            handleClickBsSelect(){
                if (this.getSystemUserInfo.dataList.length > 1){
                    this.isShowSelectList =  !this.isShowSelectList;
                }
            },
            handleClickBsSelectList(mcht){
                let _this = this;
                this.isShowSelectList = false;
                this.systemSelectMchtSet(mcht);
                this.$refs.mainPage.refreshMenu();

            },
            handleClickLoginOut(){
                //退出
                if(this.resetPwd){
                    this.resetPwd=false;
                }
                this.handleClickverificationCodeImg();
                this.systemIsLoginSet(false);
                //清空用户信息
                this.systemUserInfoSet({});
                //清空商户信息
                this.systemSelectMchtSet({});
            },
            handleClickverificationCodeImg(){
                this.randMcoderKey = uuidv4().split('-').join('');
            }
        },
        computed: {
            ...mapGetters({
                getSystemIsLogin: 'getSystemIsLogin',
                getSystemIsSelectMcht:'getSystemIsSelectMcht',
                getSystemSelectMcht:'getSystemSelectMcht',
                getSystemUserInfo:'getSystemUserInfo',
                getSystemIsShowNotice: 'getSystemIsShowNotice'
            })
        },
        mounted(){
          if(!this.getSystemIsShowNotice) {
            this.getRandMcoderKey = requestUrl.getRandMcoderKey;
              let date = new Date();
              let day = '';
              switch(date.getDay()){
                  case 1 : day = '一';break
                  case 2 : day = '二';break
                  case 3 : day = '三';break
                  case 4 : day = '四';break
                  case 5 : day = '五';break
                  case 6 : day = '六';break
                  case 7 : day = '日';break
              }
              this.localeDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate() + ' 周' + day;
              let _this = this;
              this.$ajaxPromise(requestUrl.getBanner,{adPst:'0001'},"POST",true).then(function (res) {
                  res.list.forEach((val)=>{
                      _this.bannerImg.push({
                          showUrl:res.showUrl+val.picId,
                          jumpUrl:val.jumpUrl
                      })
                  })
              }).catch(function (error) {

              })
              this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:1,pageSize:1},"POST",true).then(function(res){
                  _this.notice = res.msgList[0].noticeTitle;
              }).catch(function (error) {

              })

              //获取验证码生成随机数
              this.handleClickverificationCodeImg();
            }
          }
    }


</script>

<style lang="scss">
    $public-green:#009C42;
    $public-gray:#36474F;
    .triangle{
        display: inline-block;
        border: 7px solid transparent;
        border-top: 7px solid white;
        position: relative;
        top: 7px;
    }
    #bs-select-row{
        color: white;
        font-size: 0.85em;
        margin-right: 30px;
        width: 232px;
        float: right;
    }
    .img-buttons>img{
        margin-right: 30px;
        cursor: pointer;
    }
    .img-buttons{
        margin-right: 30px;
        float: right;
    }
    .public-footer{
        background: $public-gray;
        color: white;
        height: 34px;
        line-height: 34px;
        font-size: .85em;
        text-align: center;
    }
    .public-title-logo{
        margin-left: 25px;
    }
    .public-title{
        background: $public-gray;
        height: 60px;
        line-height: 60px;
    }
    .help-center{
        float: right;
        margin-right: 200px;
        color: white;
    }
    .help-center:hover,.help-center:focus{
        color: $public-green;
    }
    .index-title{
        font-size: 14px;
        height: 60px;
        width: 100%;
        line-height: 60px;
        background: rgba(0,0,0,.46);
        position: absolute;
        top:0;
        z-index: 10;
    }
    .login-form .login-forget-password{
        text-align: right;
        color: white;
        margin: 0;
    }
    .login-form>.el-form-item{
        margin-bottom: 24px;
    }
    .verification-code{
        margin-left: 13px;
        cursor: pointer;
        position: absolute;
        width: 107px;
        height: 34px;
    }
    .login-out:hover{
        color: $public-green;
    }
    .login-out{
        margin-left: 21px;
        cursor: pointer;
    }
    .user-login-text{
        color: white;
        margin-bottom: 15px;
        text-align: center;
        font-size: 1.42em;
    }
    .more-notice{
        float:right;
        color:$public-green;
        cursor: pointer;
    }
    .index-notice .notice-content:hover{
        color: $public-green;
    }
    .index-notice .notice-content{
        cursor: pointer;
        position: absolute;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        max-width: 550px;
    }
    .bs-select-list{
        background: $public-gray;
        max-height: 200px;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        margin-top: -20px;
        z-index: 100;
        border: 1px solid #e8e9e8;
    }
    .bs-select-list ul li:hover{
        background: #0958b4;
        color: white;
    }
    .bs-select-list ul li{
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .bs-select{
        display: flex;
        max-width: 232px;
    }
    .bussiness-name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .bs-forget-password{
        border: 1px solid black;
        height: 800px;
    }
    .input-icon{
        height: 22px;
        width: 20px;
        position: absolute;z-index: 100;left: 15px;top: 7px;
    }
    .forget-password{
        color: white;
        cursor: pointer;
    }
    .forget-password:hover{
        color: #DDDDDD;
    }

    .public-button.el-button{
        border-radius: 2px;
        border: none;
        color: white;
    }
    .login-button.el-button{
        width: 100%;
        height: 34px;
    }
    .public-button.public-green{
        background: $public-green;
    }
    .public-button:hover, .public-button:focus{
        color: white !important;
    }
    .login-form .el-input__inner{
        padding-left: 45px !important;
        height: 34px !important;
    }
    .bg-carousel{
        height:100%;
    }
    .bg-carousel .el-carousel__container{
        height: 100%;
    }
    .bg-carousel .el-carousel__button{
        opacity: 1;
    }
    .bg-carousel .el-carousel__indicator.is-active .el-carousel__button{
        background: $public-green !important;
        width: 14px !important;
        height: 14px !important;
        position: relative;
        top: 2px;
    }
    .bg-carousel .el-carousel__indicator{
        padding-left: 9px;
        padding-right: 9px;
    }
    .bg-carousel .el-carousel__indicators{
        bottom: 53px !important;
    }
    .bg-carousel .el-carousel__button{
        width: 10px!important;
        height: 10px!important;
        border-radius: 50% !important;
    }
    .bg-carousel .el-icon-arrow-right,.el-icon-arrow-left{
        font-size: 36px;
    }
    .bg-carousel .el-carousel__arrow--left{
        left: 83px !important;
    }
    .bg-carousel .el-carousel__arrow--right{
        right: 83px !important;
    }
    .bg-carousel .el-carousel__arrow:hover{
        background-color: transparent !important;
        color: rgba(255, 255, 255, 0.23);
    }
    .el-row.index-notice{
        color: white;
        position: absolute;
        bottom: 40px;
        width: 100%;
        z-index: 100;
        line-height: 43px;
        font-size: 1.14em;
        padding: 0 200px;
        height:43px;
        background:rgba(17,9,8,.59);
    }
    .el-row.index-footer{
        width: 100%;
        z-index: 10;
        background: rgba(0,0,0,.72);
        position: absolute;
        bottom: 0;
        color: white;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-active {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
