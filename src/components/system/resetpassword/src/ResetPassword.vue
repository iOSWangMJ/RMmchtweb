<template>
    <el-row style="height: calc(100% - 94px);padding: 50px 0;">
        <el-row class="reset-password-container">
            <div class="reset-title">
                <span class="reset-title-icon"></span>
                修改密码
            </div>
            <el-row class="reset-password-index">
                <base-form
                    ref="modifyForm"
                    :inputs="modifyForm.inputs"
                    :data="modifyForm.data"
                    :vBind="modifyForm.vBind"
                    @blur="handleBaseFormBlur"
                    :staticData = 'staticData'
                >
                    <el-form-item style="margin-top:40px;" slot="other-items">
                        <el-button type="submit" style="margin-right: 25px;" @click="handleClickSubmitPassword" class="public-button-style public-green-bg">提交</el-button>
                        <el-button @click="handleClickBack" class="public-button-style public-gray-bg">返回</el-button>
                    </el-form-item>
                </base-form>
            </el-row>
        </el-row>
        <el-dialog
            @close="handleConfirmReset"
            style="font-size: 18px;text-align: center"
            size="tiny"
            class="reset-error-dialog"
            top="30%"
            :visible.sync="dialogVisible"
            :show-close = false
        >
            <img width="80" src="../../../../assets/Success@2x.png" alt="">
            <p style="margin-top: 20px;font-size: 1.42em;">
                重置密码成功!
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button class="public-button-style public-button public-green-bg" @click="handleConfirmReset">确 定</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>

<style lang="scss">
    $public-green:#009C42;
    $public-gray:#999999;
    $el-button-color:#009C42;
    .reset-error-dialog .el-dialog__footer{
        text-align: center !important;
    }
    .public-button-style.el-button{
        width: 120px;
        height: 34px;
    }
    .reset-password-index .el-input__inner{
        height: 34px;
    }
    .reset-password-index .el-input{
        width: 356px;

    }
    .reset-password-index .el-form-item.is-required .el-form-item__label:before{
        margin-right: 4px !important;
    }
    .reset-password-index .el-form-item__label{
        padding-right: 16px;
    }
    .reset-title-icon{
        display: inline-block;background: #009C42;width: 6px;height: 20px;
        position: relative;
        top: 4px;
    }
    .reset-error-dialog .reset-error-dialog p{
        margin: 0;
    }
    .reset-error-dialog .el-dialog__footer,.reset-error-dialog .el-dialog__header{
        padding: 0;
    }
    .reset-error-dialog .el-dialog__body{
        padding: 36px 0 28px;
    }
    .reset-error-dialog .el-dialog{
        text-align: center;
        border-radius: 10px;
        width: 374px;
    }
    .reset-error-dialog .dialog-footer>.el-button:hover,.dialog-footer>.el-button:focus{
        background: $el-button-color;
    }
    .reset-error-dialog .dialog-footer>.el-button{
        background: $el-button-color;
        margin-bottom: 27px;
    }
    .public-green-bg{
        background:$public-green !important;
    }
    .public-gray-bg{
        background:$public-gray !important;
    }
    .reset-password-index .el-form-item.is-required .el-form-item__label:before{
        margin-right: 11px;
    }
    .reset-title{
        font-size: 1.42em;
        font-weight: bold;
        color: #333;
        margin-top: 40px;
        margin-left: 94px;
        height: 26px;
        line-height: 26px;
    }
    .reset-password-index{
        height: calc(100% - 135px);
        padding-top: 67px;
        margin-left: 50%;
        transform: translate(-50%,0);
    }
    .reset-password-container{
        height: 100%;
        background: white;
        width: 1066px;
        margin-left: 50%;
        transform: translate(-50%,0);
    }
</style>

<script>
    import * as requestUrl from './requestUrl'
    import {mapActions} from 'vuex'
    import modifyForm from './modifyform'
    import {encrypt} from '../../../../jslib/md5/md5'
    export default {
        name: 'resetPassword',
        props:{
          cloneLoginData:{
            type:Object,
            default:{}
          }
        },
        data () {
          return {
              dialogVisible:false,
              modifyForm:modifyForm,
              isSubmit:false,
              staticData:{}
          }
        },
        methods: {
            handleBaseFormBlur(input,val){
                if (input.name === 'confirmUnUsedPwd'){
                    let validateConfirmUnUsedPwd = (rule,value,callback) => {
                        //与新密码校验
                        if (value !== this.$refs.modifyForm.getFormData().unUsedPwd){
                            callback(new Error('两次填写的密码不一致'));
                        } else {
                            callback()
                        }
                    }
                    this.$refs.modifyForm.vBind.rules.confirmUnUsedPwd[2].validator = validateConfirmUnUsedPwd;
                }
                if (input.name === 'unUsedPwd'){
                    let confirmUnUsedPwd = this.$refs.modifyForm.getFormData().confirmUnUsedPwd;
                    if (confirmUnUsedPwd){
                        this.$refs.modifyForm.$refs.confirmUnUsedPwd[0].handleBlur()
                    }
                }
            },
            handleClickBack(){
                this.$emit('setResetPwd',false);
            },
            ...mapActions({
                systemIsLoginSet: 'systemIsLoginSet',
            }),
            handleConfirmReset(){
              this.dialogVisible = false;
              let _this = this;
                this.$emit('logRequestSucHandle',this.cloneLoginData,function(){
                    _this.$emit('setResetPwd',false);
                });
            },
            handleClickSubmitPassword(){
                if (this.$refs.modifyForm.isValidatePass()&&!this.isSubmit){
                  let _this = this;
                  this.isSubmit=true;
                  let formData =  this.$refs.modifyForm.getFormData()
                  let data = {
                      userId:this.cloneLoginData.userId,
                      loginPwd:encrypt(formData.loginPwd).toUpperCase(),
                      unUsedPwd:encrypt(formData.unUsedPwd).toUpperCase(),
                      pwdType:'01'
                  }
                    this.$ajaxPromise(requestUrl.resetPassword,data,"POST",true).then((res)=>{
                            _this.isSubmit=false;
                            this.dialogVisible = true;
                    }).catch((error)=>{
                        this.isSubmit=false;
                    })
                }
            }
        },
        mounted(){
            $(document).scrollTop(0);
        },
        destroyed(){
            $(document).scrollTop(0);
        }
    }

</script>

