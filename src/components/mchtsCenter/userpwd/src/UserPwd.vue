<template>
<!-- <function-page :isLoading="mixinShowWatcherLoading"> -->
    <div class="custom_elementui page" slot="content">
        <div class="page-title">用户登陆信息</div>
        <div class="page-content">
            <div class="info-body">
                <el-row>
                    <el-col :span="3">登陆手机号：</el-col>
                    <el-col :span="4" class="col-border"><span>{{userInfo.phoneNo?userInfo.phoneNo:'-'}}</span></el-col>
                    <el-col :span="7"><a @click="PWDSHow =!PWDSHow"><span>密码修改</span></a></el-col>
                </el-row>
            </div>
        </div>
        <el-dialog :modal-append-to-body="false" :visible.sync="PWDSHow" @close="resetPwd" :show-close="false" custom-class="custom-dialog-user-pwd">
            <el-form :model="pwd" ref='pwd' :rules='rules' label-position="left" label-width="100px">
                <el-form-item label="原密码" prop="loginPwd">
                    <el-input type="password" v-model="pwd.loginPwd" placeholder="原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="unUsedPwd">
                    <el-input type="password" v-model="pwd.unUsedPwd" placeholder="新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPwd">
                    <el-input type="password" v-model="pwd.confirmPwd" placeholder="确认新密码"></el-input>
                </el-form-item>
            </el-form>
            <div class="info-footer">
                <el-button class="button-background" @click="handFixedPwd">确 定</el-button>
                <el-button @click="PWDSHow = false" class="button-return">返 回</el-button>
            </div>
        </el-dialog>
    </div>
<!-- </function-page> -->
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dict from './dict.js'
import {encrypt} from '../../../../jslib/md5/md5'

import {mapGetters} from 'vuex'

export default {
    name: "UserPwd",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],

    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.pwd.confirmPwd !== '') {
                    this.$refs.pwd.validateField('confirmPwd');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pwd.unUsedPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {


            commerceInfo: {},
            /**静态数据对象*/
            staticData: {},
            staticLoadConfig: staticloadconfig,
            dict: dict,

            QRSHow: false,
            PWDSHow: false,
            commerceData: {
                showUrl: "",
                mchtId: ''
            },
            pwd: {
                loginPwd: '',
                unUsedPwd: '',
                confirmPwd: ''
            },
            rules: {
                loginPwd: [{
                    required: true,
                    message: '请输入原始密码',
                    trigger: 'blur'
                }, {
                    pattern: /^[a-zA-Z0-9]{6,20}$/,
                    message: '密码长度6至20位,且不含特殊字符',
                    trigger: 'blur'
                }],
                unUsedPwd: [{
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePass,
                        trigger: 'blur'
                    }, {
                        pattern: /^[a-zA-Z0-9]{6,20}$/,
                        message: '密码长度6至20位,且不含特殊字符',
                        trigger: 'blur'
                    }


                ],
                confirmPwd: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }, {
                    validator: validatePass2,
                    trigger: 'blur'
                },{
                    pattern: /^[a-zA-Z0-9]{6,20}$/,
                    message: '密码长度6至20位,且不含特殊字符',
                    trigger: 'blur'
                }]
            }
        }

    },
    computed:{
        ...mapGetters({
            userInfo:'getSystemUserInfo'
        })
        // userPhone:mapGetters()
    },
    methods: {
        handleQuery() {
            this.$ajaxPromise(requestUrl.query, {}, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.commerceData = res
                }
            })
        },
        handFixedPwd() {
            this.$refs['pwd'].validate((valid) => {
                if (valid) {
                    //处理 事件申请
                    let data = this.$dataClone(this.pwd)
                    delete data['confirmPwd']
                    data.loginPwd = encrypt(data.loginPwd).toUpperCase()
                    data.unUsedPwd = encrypt(data.unUsedPwd).toUpperCase()
                    data.pwdType = '01'
                    this.$ajaxPromise(requestUrl.sumbitPwd, data, 'POST', true).then((res) => {
                        if (res.respCode === '0000') {
                            this.PWDSHow = !this.PWDSHow
                        }
                    }).catch((error) => {
                        console.error(error);
                    })
                } else {
                    console.log('error submit!!')
                    return false;
                }
            });
        },

        resetPwd() {
            this.$refs['pwd'].resetFields()
            this.pwd = {
                loginPwd: '',
                unUsedPwd: '',
                confirmPwd: ''
            }
        }

    },
    created() {
        //do something after creating vue instance
        this.handleQuery()
    }
}
</script>
<style lang="scss" scoped>
.page {
    background: white;
    padding: 20px 0 400px 20px;
    // padding-top: 20px;
    // padding-left: 20px;
    height: 100%;
    .page-title {
        background: url('../../../../assets/role2-@2x.png') no-repeat;
        background-size: 40px 40px;
        padding-left: 55px;

    }
    .page-content {
        border-top: 1px #EAF0F4 solid;
        .info-body {
            padding-right: 47px;
            margin-top: 10px;
            .el-row {
                padding-left: 55px;
                height: 36px;
                line-height: 36px;
                .el-col {
                    // margin-top: 30px;
                    padding: 10px 0;
                }
                a {
                    display: inline-block;
                    height: 36px;
                    width: 92px;
                    border: 1px solid #009C42;
                    color: #009C42;
                    border-radius: 8px;
                    text-align: center;
                }
                .col-border {
                    padding-top: 9px;
                    padding-bottom: 9px;
                }

            }

        }
    }

    .el-dialog {
        .el-form {
            padding: 0 70px;
        }
    }
}
</style>
