<template>
    <div class="container">

        <!--当存在店员时展示如下界面-->
        <div v-if="isExist">

            <!--新增顶部-->
            <div class="head">
                <b class="headIcon"></b>
                <i class="headFont">店员管理</i>
                <el-button :plain="true" type="success" @click="add" id="add">添加</el-button>
            </div>
            <!--店员列表-->
            <div class="userContainer" v-for="emp in empList" :key="emp.empId">
                <!--右侧删除和修改以及详情按钮-->
                <div class="btnContainer">
                    <el-button class="bodyIcon" @click="detailEmp(emp)">
                        <i class="detailIcon"></i>
                    </el-button>
                    <el-button class="bodyIcon" type="text"
                        :disabled="emp.empStat=='01'||emp.empStat=='02'" @click="update(emp)">
                        <i class="updateIcon"></i>
                    </el-button>
                    <el-button class="bodyIcon" @click="delEmp(emp)">
                        <i class="deleteIcon"></i>
                    </el-button>
                </div>

                <el-row class="userRow">
                    <el-col :offset="2" :span="3">店员号：</el-col>
                    <el-col :span="19" class="content">
                        {{emp.empId}}
                        <el-button type="text" :disabled="emp.empStat==='01'" @click="reset(emp)" style="font-size:12px;color:rgb(0,156,66);padding:0;margin-left:20px;">密码重置</el-button>
                    </el-col>
                </el-row>
                <el-row class="userRow">
                    <el-col :offset="2" :span="3">登陆手机号：</el-col>
                    <el-col :span="7" class="content">{{emp.phoneNo}}</el-col>
                    <el-col :span="3">姓名：</el-col>
                    <el-col :span="7" class="content">{{emp.empNM}}</el-col>
                </el-row>
                <el-row class="lastUserRow">
                    <el-col :offset="2" :span="3">状态：</el-col>
                    <el-col :span="7" v-if="emp.empStat==='00'" class="content">
                        正常
                        <el-button type="text" @click="changeState('03',emp.empId)"
                                   style="font-size:14px;color:#1094F5;width:46px;height:25px;border:1px solid #1094F5;border-radius:8px;padding:0;margin-left:20px;">停用</el-button>
                    </el-col>
                    <el-col :span="7" v-if="emp.empStat==='01'" class="content">
                        停用
                        <el-button type="text" @click="changeState('02',emp.empId)"
                                   style="font-size:14px;color:#1094F5;width:46px;height:25px;border:1px solid #1094F5;border-radius:8px;padding:0;margin-left:20px;">启用</el-button>
                    </el-col>
                    <el-col :span="7" v-if="emp.empStat==='02'" class="content">
                        冻结
                    </el-col>
                    <!--<el-col :span="3">角色：</el-col>-->
                    <!--<el-col :span="7" class="content">{{emp.roleName}}</el-col>-->
                </el-row>
            </div>
            <!--底部分页栏目-->
            <div id="pagination">
                <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goFirstPage"> <<首页 </el-button>
                <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goPrePage"> <上一页 </el-button>
                <span>&nbsp;&nbsp;第{{currentPage}}页,共{{sum}}页&nbsp;&nbsp;</span>
                <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goNextPage"> 下一页> </el-button>
                <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goLastPage"> 尾页>> </el-button>
            </div>

        </div>

        <!--没有店员时展示如下界面-->
        <div v-if="isNull" class="isnull">
            <div class="nullImage"></div>
            <p style="text-align:center">
                目前暂无店员，可进行
                <el-button type="text" @click="add" class="addEmp">添加</el-button>
            </p>
        </div>

        <!--新增弹出框占坑-->
        <div v-if="addDialogShow" class="userDialog dialog-fade-enter-active">
            <div class="userDialogCon" v-if="addFormShow">
                <el-form
                    :rules="addFormRules"
                    class="addForm"
                    :model="addFormData"
                    ref="addForm"
                    label-width="100px"
                    label-position="left">
                    <el-form-item label="登录手机号："  prop="phoneNo">
                        <el-input placeholder="输入手机号" v-model="addFormData.phoneNo" :disabled="!isRevisability"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名："  prop="empNM">
                        <el-input placeholder="输入姓名" v-model="addFormData.empNM"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆密码："  prop="pass">
                        <el-input placeholder="输入登陆密码" v-model="addFormData.pass" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码："  prop="checkPass">
                        <el-input placeholder="再次输入密码" v-model="addFormData.checkPass" type="password"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="角色：" prop="roleId">-->
                        <!--<el-select-->
                            <!--v-model="addFormData.roleId">-->
                            <!--<el-option-->
                                <!--v-for="item in staticData.roleOptions"-->
                                <!--:label="item.roleName"-->
                                <!--:value="item.roleId"-->
                                <!--:key="item.roleId">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="权限设定：" prop="auth">
                        <el-checkbox-group
                            v-model="addFormData.auth">
                            <el-checkbox v-for="auth in authList" :label="auth.authDesc" :key="auth.authCode"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div class="bottomBtn btnCon">
                    <el-button type="primary" @click="addForm" class="addbtn" style="background-color: #009C42;">提交</el-button>
                    <el-button type="primary" @click="addCancel" class="addbtn" style="margin-left:35px;background-color:#999;">返回</el-button>
                </div>
            </div>

            <!--手机验证 --开始-->
            <div class="addPhoneTest" v-if="addPhoneShow">
                <el-form :model="msgCode" ref="msgCodeForm" label-width="80px" :rules="msgCodeFormRules">
                    <el-form-item
                        label="验证码"
                        prop="code"
                        style="position:relative;"
                        >
                        <el-input placeholder="请输入验证码" v-model="msgCode.code" :maxlength="6">
                            <el-button slot="append" @click="msgCheck" :disabled="isDisabled">{{msgText}}</el-button>
                        </el-input>
                        <span style="position:absolute;left:0;top:32px;color:#ff4949;font-size:12px;">{{errorMsg}}</span>
                    </el-form-item>
                </el-form>
                <div class="PhoneBtn btnCon">
                    <el-button type="primary" @click="addSubmit" class="addbtn" style="background-color: #009C42;">提交</el-button>
                    <el-button type="primary" @click="addReturn" class="addbtn"  style="margin-left:35px;background-color:#999;">返回</el-button>
                </div>
            </div>
            <!--手机验证 结束-->
        </div>

        <!--密码重置弹出框-->
        <div v-if="resetDialogShow" class="userDialog dialog-fade-enter-active">
            <!--填写密码区域 start-->
            <div class="pwdReset">
                <el-form
                    :model="pwdResetForm"
                    label-position="left"
                    :rules="pwdResetFormRules"
                    ref="pwdResetForm"
                    label-width="100px">
                    <el-form-item label="新密码" prop="pwd">
                        <el-input type="password" v-model="pwdResetForm.pwd" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPwd">
                        <el-input type="password" v-model="pwdResetForm.checkPwd" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btnCon">
                    <el-button type="primary" @click="pwdSubmitForm('pwdResetForm')" class="addbtn" style="background-color: #009C42;">提交</el-button>
                    <el-button type="primary" @click="pwdCancle" class="addbtn" style="margin-left:35px;background-color:#999;">返回</el-button>
                </div>
            </div>
            <!--填写密码区域 end-->
        </div>

        <!--修改弹出框占坑-->
        <div v-if="updateDialogShow" class="userDialog dialog-fade-enter-active">
            <div class="updateDialogCon">
                <el-form
                    :rules="updateFormRules"
                    class="addForm"
                    :model="updateFormData"
                    ref="updateForm"
                    label-width="100px"
                    label-position="left">
                    <el-form-item label="店员号："  prop="empId">
                        <el-input v-model="updateFormData.empId" :disabled="true" ></el-input>
                        <!--<span>{{updateFormData.empId}}</span>-->
                    </el-form-item>
                    <el-form-item label="姓名："  prop="empNM">
                        <el-input v-model="updateFormData.empNM"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="角色：" prop="roleId">-->
                        <!--<el-select-->
                            <!--v-model="updateFormData.roleId">-->
                            <!--<el-option-->
                                <!--v-for="item in staticData.roleOptions"-->
                                <!--:label="item.roleName"-->
                                <!--:value="item.roleId"-->
                                <!--:key="item.roleId">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="权限设定：" prop="auth">
                        <el-checkbox-group
                            style="max-height: 80px;overflow-y:scroll;"
                            v-model="updateFormData.auth">
                            <el-checkbox v-for="auth in authList" :label="auth.authDesc" :key="auth.authCode"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div class="btnCon updateBtn">
                    <el-button type="primary" @click="updateSubmit" class="addbtn" style="background-color: #009C42;">提交</el-button>
                    <el-button type="primary" @click="updateCancel" class="addbtn" style="margin-left:35px;background-color:#999;">返回</el-button>
                </div>
            </div>
        </div>

        <!--详情弹出框-->
        <div v-if="detailDialogShow" class="userDialog dialog-fade-enter-active">
            <div class="detailDialogCon">
                <el-row>
                    <el-col :span="4">店员号：</el-col>
                    <el-col :span="20">{{detailData.empId}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">店员姓名：</el-col>
                    <el-col :span="12">{{detailData.empNM}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">店员状态：</el-col>
                    <el-col :span="12">{{detailData.empStat}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">登陆手机号：</el-col>
                    <el-col :span="12">{{detailData.phoneNo}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">用户权限：</el-col>
                    <el-col :span="12">{{detailData.userAuthList}}</el-col>
                </el-row>
                <div class="btnCon">
                    <el-button type="primary" @click="detailCancel" class="addbtn" style="background-color:#009C42;">返回</el-button>
                </div>
            </div>
        </div>

        <!--确认弹出框 开始-->
        <div class="userDialog dialog-fade-enter-active" v-if="messageDialog">
            <div class="isDelete">
                <div class="deleteMsg">确定删除？</div>
                <div class="btnCon">
                    <el-button type="primary" @click="messageDialog=false" class="addbtn" style="background-color: #009C42;">取消</el-button>
                    <el-button type="primary" @click="deleteUser"  class="addbtn" style="margin-left:18px;background-color:#999;">删除</el-button>
                </div>
            </div>
        </div>
        <!--确认弹出框 结束-->

        <!--引入消息弹出框组件-->
        <msg-dialog :isShow="messageShow"  :messageClass="messageClass" :message="message"></msg-dialog>

    </div>
</template>

<style scoped>
    /*容器*/
    .container{
        width:100%;
        position: relative;
        padding:0;
        background-color: rgb(255,255,255);
        min-height:614px;
    }
    /*顶部样式设置*/
    .head{
        padding:20px 30px 20px 20px;
        border-bottom:1px solid #EAF0F4;
    }
    /*顶部字体*/
    .headIcon{
        display:inline-block;
        width:40px;
        height:40px;
        background-image: url('../../../../assets/dianyuan3@2x.png');
        background-size:100% 100%;
        vertical-align: middle;
        margin-right: 15px;
    }
    .headFont{
        font-weight: bold;
        font-size:18px;
        color:#333333;
        font-style:normal;
    }
    /*顶部按钮*/
    #add{
        float: right;
        width:92px;
        height:36px;
        color:#009C42;
        border-color:#009C42;
        border-radius: 8px ;
    }

    /*人员信息*/
    .userContainer{
        width:100%;
        padding-top:30px;
        padding-bottom:20px;
        border-bottom:1px solid #EAF0F4;
        color:#333;
        position:relative;
    }

    .userRow{
        margin-bottom: 15px;
    }

    .lastUserRow{
        margin-bottom:0px;
    }

    .userContainer .content{
        font-size:14px;
        color:rgb(102,102,102);
    }
    /*删除修改按钮*/
    .btnContainer{
        position:absolute;
        right:30px;
        top:10px;
    }
    .bodyIcon{
        cursor: pointer;
        border:none;
        margin:0;
        padding:0;
    }
    .updateIcon{
        display:inline-block;
        width:21px;
        height:21px;
        background-image:url('../../../../assets/modify@2x.png');
        background-size:100% 100%;
    }
    .deleteIcon{
        display:inline-block;
        width:18px;
        height:18px;
        background-image:url('../../../../assets/delete@2x.png');
        background-size:100% 100%;
    }
    .detailIcon{
        display:inline-block;
        width:18px;
        height:18px;
        background-image:url('../../../../assets/detail.png');
        background-size:100% 100%;
    }

    /*新增弹出框*/
    .userDialog{
        /*width:100%;*/
        /*height:100%;*/
        /*position:absolute;*/
        /*top:0;*/
        /*left:0;*/
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.2);
    }

    .userDialogCon{
        position:absolute;
        width:420px;
        /*height:391px;*/
        background-color: #fff;
        top:170px;
        left:40%;
        border-radius: 8px;
    }

    .addForm{
        width:100%;
        padding:30px 30px 0px 30px;
        color:#333333;
        font-size:14px;
        /*height:250px;*/
    }

    .addForm .el-form-item{
        margin-bottom: 20px;
    }

    .userDialog .addbtn{
        width:120px;
        height:34px;
        border-radius:2px;
        font-size:16px;
        color:#fff;
        outline: none;
    }
    .btnCon{
        text-align: center;
    }

    .bottomBtn{
        margin-top:10px;
        margin-bottom:30px;
    }

    /*获取手机验证码界面*/
    .addPhoneTest{
        width:461px;
        padding:40px 53px 38px 22px;
        position: absolute;
        background-color: #fff;
        border-radius: 8px;
        color:#333;
        font-size:14px;
        top:220px;
        left:40%;
    }

    .PhoneBtn{
        margin-top:40px;
    }

    /*密码重置*/
    .pwdReset{
        width:420px;
        padding-bottom:30px;
        position:absolute;
        top:200px;
        left:40%;
        background-color: #fff;
        border-radius: 8px;
        color:#333;
        font-size:16px;
    }
    .pwdReset .el-form{
        padding:33px 42px 10px 42px;
    }

    /*修改弹出框界面*/

    .updateDialogCon{
        position:absolute;
        width:445px;
        background-color: #fff;
        top:170px;
        left:40%;
        border-radius: 8px;
    }
    .updateBtn{
        padding-top:10px;
        padding-bottom:30px;
    }

    .el-button--primary{
        border-color:#fff;
    }

    /*详情弹出框界面*/
    .detailDialogCon{
        width:400px;
        /*height:317px;*/
        border-radius:8px;
        position:absolute;
        top:170px;
        left:40%;
        background-color: #fff;
        color:#333;
        font-size:14px;
        padding:20px 31px 25px 29px;
    }
    .detailDialogCon .el-row{
        margin-bottom: 15px;
    }
    .detailDialogCon .el-row:nth-child(5){
        margin-bottom: 25px;
    }
    .detailDialogCon .el-row .el-col:nth-child(2){
        text-align: right;
        color:#666;
    }
    /*是否删除*/
    .userDialog .isDelete{
        width:325px;
        position: absolute;
        top:250px;
        left:40%;
        background-color: #fff;
        border-radius: 8px;
        padding:30px;
        color:#333;
        font-size:16px;
    }
    .deleteMsg{
        margin-bottom:34px;
        text-align: center;
    }

    /*无店员时显示界面*/
    .isnull{
        font-size:18px;
        color:#333;
        padding-top:60px;
    }
    .nullImage{
        width:265px;
        height:165px;
        background-image: url('../../../../assets/No-Data@3x.png');
        background-size:100% 100%;
        margin:auto;
    }

    /*增加店员样式*/
    .addEmp{
        color:#009C42;
        font-size:18px;
    }

    /*分页样式*/
    #pagination{
        font-size:12px;
        float:right;
        margin-top:15px;
        margin-right:30px;
        margin-bottom:15px;
    }
    #pagination button{
        font-size:12px;
    }

</style>

<script>
    import * as Mixins from '../../../../jslib/mixin'
    import staticloadconfig from './staticloadconfig.json'
    import * as requestUrl from './requestUrl'
    /*引入md5*/
    import {encrypt} from '../../../../jslib/md5/md5'
    import * as dict from './dict.js'
    import MsgDialog from '../../../lib/msgdialog'

    export default{
        name:'MchtsCenterRoleManage',
        mixins:[Mixins.AuthMixin,Mixins.StaticDataLoad,Mixins.PropertyInit,Mixins.ShowWatcher],
        components:{
            MsgDialog
        },
        data(){
            /*店员新增密码规则*/
            let addPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.addFormData.checkPass !== '') {
                        this.$refs.addForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let addPwdCheck= (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addFormData.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            /*重置密码表单-密码规则*/
            let pwdReset = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.pwdResetForm.checkPwd !== '') {
                        this.$refs.pwdResetForm.validateField('checkPwd');
                    }
                    callback();
                }
            };
            let pwdResetCheck= (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdResetForm.pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            let phoneValidate=(rule, value, callback) => {
                /*判断是否符合手机号码格式*/
                /*let reg=/^1[34578]\d{9}$/;*/
                let reg=/^1[3|4|5|7|8][0-9]{9}$/;
                if (!reg.test(value)) {
                    callback(new Error('手机号格式不正确'));
                }else{
                    /*查手机号是否有重复*/
                    /*传给后台的参数*/
                    let obj={};
                    obj.chkAcct=value;
                    this.$ajaxPromise(requestUrl.phoneQuery,obj,"POST",true).then(function(resp){
                        console.log(resp,'手机号查重返回');
                        if(resp.respCode=="0000"){
                            if(resp.isExist=='0'){
                                callback(new Error('手机号已存在，请重新填写'));
                            }else{
                                callback();
                            }
                        }
                    });
                }
            };
            return {
                /*是否显示不存在店员时候的样式，之所有不用v-if切换，避免页面闪跳*/
                isNull:false,
                /*是否显示存在店员样式*/
                isExist:false,
                /*引入静态数据*/
                staticLoadConfig: staticloadconfig,
                messageDialog:false,
                /*消息弹出框是否展示*/
                messageShow:false,
                /*消息弹出框显示的文字内容*/
                message:'',
                /*消息弹出框样式*/
                messageClass:'',
                addDialogShow:false,
                addFormShow:false,
                addPhoneShow:false,
                resetDialogShow:false,
                updateDialogShow:false,
                detailDialogShow:false,
                /*手机号是否可修改*/
                isRevisability:true,
                /*被删除人员Id*/
                deleteEmpId:'',
                /*第几页*/
                currentPage:1,
                /*总共查询出来几条*/
                totalCnt:0,
                /*共几页*/
                sum:1,
                /*每页条数*/
                pageSize:3,
                /*店员集合*/
                empList:[],
                /*按钮权限集合*/
                authList:[],
                /*新增店员绑定表单*/
                addFormData:{
                    empNM:'',
                    phoneNo:'',
                    pass:'',
                    checkPass: '',
//                    roleId:'',
                    auth:[]
                },
                /*新增店员表单验证规则*/
                addFormRules:{
                    empNM:[
                        { required: true, message: '请输入店员姓名', trigger: 'blur' },
                        { max: 20, message: '少于20个字符', trigger: 'blur' }
                    ],
                    phoneNo:[
                        { required: true, message: '请输入登陆手机号', trigger: 'blur' },
                        { validator: phoneValidate, trigger: 'blur' }
                    ],
                    pass:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {
                            pattern: /^[a-zA-Z0-9]{6,20}$/,
                            message: '密码长度6至20位,且不含特殊字符',
                            trigger: 'blur'
                        },
                        { validator: addPwd, trigger: 'blur' }
                    ],
                    checkPass:[
                        { required: true, message: '请再次输入密码', trigger: 'blur' },
                        { validator: addPwdCheck, trigger: 'blur' }
                    ],
                    roleId:[
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ]
                },
                /*修改表单*/
                updateFormData:{
                    empId:'',
                    empNM:'',
                    /*roleId:''*/
                    auth:[]
                },
                /*详情*/
                detailData:{},
                updateFormRules:{
                    empId:[
                        {required : true , message:'店员号必输',trigger:'blur'}
                    ],
                    empNM:[
                        {required : true , message:'请输入店员姓名',trigger:'blur'},
                        { max: 20, message: '少于20个字符', trigger: 'blur' }
                    ],
                    roleId:[
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ]
                },
                /*密码重置*/
                pwdResetForm:{
                    pwd:'',
                    checkPwd:''
                },
                /*密码重置表单验证规则*/
                pwdResetFormRules: {
                    pwd: [
                        {
                            required : true ,
                            message:'请输入新密码',
                            trigger:'blur'
                        },
                        {
                            pattern: /^[a-zA-Z0-9]{6,20}$/,
                            message: '密码长度6至20位,且不含特殊字符',
                            trigger: 'blur'
                        },
                        { validator:pwdReset , trigger: 'blur' }
                    ],
                    checkPwd: [
                        {required : true , message:'请再次输入密码',trigger:'blur'},
                        { validator: pwdResetCheck, trigger: 'blur' }
                    ]
                },
                resetEmpId:'',
                staticData:{
                    /*角色集合*/
                    roleOptions:[],
                    empStatOptions:dict.empStatOptions
                },
                /*获取短信验证码按钮是否禁用*/
                isDisabled:false,
                msgText:'获取短信验证码',
                /*验证码流水号*/
                smsId:'',
                /*验证码输入框绑定函数*/
                msgCode:{
                    code:''
                },
                errorMsg:'',
                /*手机验证码页面表单绑定规则*/
                msgCodeFormRules:{
                    code:[
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min:6 , max: 6, message: '请输入6位字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            /*新增店员按钮*/
            add(){
                this.addDialogShow=true;
                this.addFormShow=true;
                this.addPhoneShow=false;
                this.smsId='';
                this.isRevisability=true;
            },
            /*增加店员基本信息页提交按钮*/
            addForm(){
                let _this=this;
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        /*如果通过了表单验证*/
                        _this.addFormShow=false;
                        _this.addPhoneShow=true;
                    } else {
                        return false;
                    }
                });
            },
            /*增加店员基本信息页返回按钮*/
            addCancel(){
                console.log('重置新增店员表单');
                /*不能用resetFields方法，会有bug,当从获取短信验证码页面返回到基本信息页面再次返回之后无法情况表单*/
                /*this.$refs['addForm'].resetFields();*/
                /*清空表单*/
                this.addFormData={
                    empNM:'',
                    phoneNo:'',
                    pass:'',
                    checkPass: '',
                    /*roleId:'',*/
                    auth:[]
                };
                /*关闭弹出框以及验证码倒计时*/
                this.addDialogShow=false;
                this.errorMsg='';
            },
            /*获取手机验证码*/
            msgCheck(){
                /*点击完获取手机验证码之后，手机号不可修改*/
                this.isRevisability=false;
                let obj={};
                obj.chkAcct=this.addFormData.phoneNo;
                obj.chkChnl="00";
                obj.chkFlag="02";
                let _this=this;
                /*获取验证码接口*/
                this.$ajaxPromise(requestUrl.getMsg,obj,"POST",true).then(function(resp){
                    _this.smsId=resp.smsId;
                    /*定时器*/
                    let wait=60;
                    /*调用倒计时方法*/
                    _this.time(wait);
                    console.log(_this.smsId,"验证码流水号");
                });
            },
            /*60S倒计时方法*/
            time(wait){
                if(wait==0||this.addDialogShow==false){
                    /*解禁获取验证码按钮*/
                    this.isDisabled=false;
                    this.msgText="获取短信验证码";
                    wait=60;
                }else{
                    /*禁用获取验证码按钮*/
                    this.isDisabled=true;
                    this.msgText="重新发送(" +wait + ")";
                    wait--;
                    let _this=this;
                    setTimeout(function() {
                            _this.time(wait)
                        },1000)
                }
            },
            /*按钮权限*/
            isAuth(a){
                let authAll=this.authList;
                authAll.forEach(function(opt){
                    /*初始化*/
                    opt.isAuth='0';
                })
                for(let i=0;i<a.length;i++){
                    authAll.forEach(function(opt){
                        if(opt.authDesc==a[i]){
                           opt.isAuth='1';
                        };
                    });
                }
                return authAll;
            },
            /*手机验证码页提交按钮,调取店员新增接口*/
            addSubmit(){
                let _this=this;
                this.$refs["msgCodeForm"].validate((valid)=>{
                    if(valid){
                        if(_this.smsId!=''){
                            let obj={};
                            obj.chkAcct=_this.addFormData.phoneNo;
                            obj.vrfyCode=_this.msgCode.code;
                            obj.smsId=_this.smsId;
                            obj.chkChnl="00";
                            obj.chkFlag="02";
                            /*验证码校验接口*/
                            let that=_this;
                            _this.$ajaxPromise(requestUrl.checkMsg,obj,"POST",true).then(function(resp){
                                console.log(resp,'短信验证校验接口返回');
                                if(resp.respCode=="0000"){
                                    console.log("短信验证成功")
                                    that.errorMsg="";
                                    /*调店员新增接口*/
                                    let insertData={};
                                    insertData.phnoeNo=that.addFormData.phoneNo;
                                    insertData.empNM=that.addFormData.empNM;
                                    /*进行MD5加密，后与后台交互*/
                                    insertData.pwdInfo=encrypt(that.addFormData.pass).toUpperCase();
                                    /*insertData.roleId=that.addFormData.roleId;*/
                                    insertData.userAuthList=that.isAuth(that.addFormData.auth);
                                    that.$ajaxPromise(requestUrl.insert,insertData,"POST",true).then(function(resp){
                                        let these=that;
                                        /*初始化新增表单*/
                                        these.addFormData=
                                        {
                                            empNM:'',
                                            phoneNo:'',
                                            pass:'',
                                            checkPass: '',
                                            /*roleId:''*/
                                            auth:[]
                                        };
                                        these.$refs['msgCodeForm'].resetFields();
                                        these.addDialogShow=false;
                                        if(resp.respCode==="0000"){
                                            /*店员新增成功*/
                                            console.log("新增成功");
                                            these.message="新增成功";
                                            these.messageClass="successImage";
                                        }else{
                                            /*新增店员失败*/
                                            console.log("新增失败");
                                            these.message="新增失败";
                                            these.messageClass="errImage";
                                        }
                                        /*显示成功消息弹出框*/
                                        these.messageShow=true;
                                        /*关闭弹出框*/
                                        these.closeMsgDialog();
                                        /*调用查询按钮更新页面数据*/
                                        these.query();
                                    });
                                }else{
                                    console.log("短信验证失败");
                                    that.errorMsg="验证失败，请重新填写验证码";
                                }
                            });
                        }else{
                            _this.errorMsg="请先获取手机验证码然后进行提交验证";
                        }
                    }else{
                        _this.errorMsg='';
                        return false;
                    }
                })
            },
            /*手机验证码页返回按钮*/
            addReturn(){
                this.$refs['msgCodeForm'].resetFields();
                this.addPhoneShow=false;
                this.addFormShow=true;
            },
            /*密码重置绑定函数*/
            reset(a){
                console.log(a);
                /*显示重置密码表单*/
                this.resetDialogShow=true;
                this.resetEmpId= a.empId;
            },
            /*取消重置密码*/
            pwdCancle(){
                this.$refs['pwdResetForm'].resetFields();
                this.resetDialogShow=false;
            },
            /*提交重置密码*/
            pwdSubmitForm(formName){
                let _this=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        /*如果通过了表单验证*/
                        let obj={};
                        obj.changeUserId=_this.resetEmpId;
                        /*先进行MD5加密,32位大写*/
                        obj.unUsedPwd=encrypt(_this.pwdResetForm.pwd).toUpperCase();
                        obj.pwdType='01';
                        /*调取密码重置接口*/
                        let that=_this;
                        _this.$ajaxPromise(requestUrl.resetPwd,obj,"POST",true).then(function(resp){
                            that.$refs['pwdResetForm'].resetFields();
                            that.resetDialogShow=false;
                            if(resp.respCode==="0000"){
                                /*密码重置成功*/
                                that.message="密码重置成功";
                                that.messageClass="successImage";
                            }else{
                                /*密码重置失败*/
                                that.message="密码重置失败";
                                that.messageClass="errImage";
                            }
                            that.messageShow=true;
                            /*关闭弹出框*/
                            that.closeMsgDialog();
                        });
                    } else {
                        return false;
                    }
                });
            },
            /*修改按钮绑定函数*/
            update(a){
                let _this=this;
                /*调取店员详情接口获取店员信息*/
                this.$ajaxPromise(requestUrl.empDetail,{empId: a.empId},"POST",true).then(function(resp){
                    console.log(resp,'resp');
                    if(resp.respCode=="0000"){
                        console.log("店员详情查询成功");
                        /*给表单赋值*/
                        _this.updateFormData.empId=resp.empId;
                        _this.updateFormData.empNM=resp.empNM;
                        let auth=[];
                        resp.userAuthList.forEach(function(option){
                            if(option.isAuth=='1'){
                                auth.push(option.authDesc);
                            }
                        });
                        _this.updateFormData.auth=auth;
                        _this.updateDialogShow=true;
                    }else{
                        console.log("店员详情查询失败");
                    }
                });
            },
            /*修改绑定的提交按钮*/
            updateSubmit(){
                let _this=this;
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid){
                        /*加入满足表单验证规则*/
                        /*调用修改接口*/
                        let obj=_this.$dataClone(_this.updateFormData);
                        console.log(obj,"店员修改接口");
                        obj.userAuthList=_this.isAuth(obj.auth);
                        let updateObj={
                            empId:obj.empId,
                            empNM:obj.empNM,
                            userAuthList:obj.userAuthList
                        };
                        let that=_this;
                        _this.$ajaxPromise(requestUrl.update,updateObj,"POST",true).then(function(resp){
                            that.$refs['updateForm'].resetFields();
                            that.updateDialogShow=false;
                            if(resp.respCode==="0000"){
                                /*修改成功*/
                                that.message="修改成功";
                                that.messageClass="successImage";
                            }else{
                                /*修改失败*/
                                that.message="修改失败";
                                that.messageClass="errImage";
                            }
                            that.messageShow=true;
                            /*关闭弹出框*/
                            that.closeMsgDialog();
                            /*调用查询更新页面数据*/
                            that.query();
                        });
                    }else{
                        return false;
                    }
                });
            },
            /*取消修改*/
            updateCancel(){
                this.updateDialogShow=false;
            },
            /*删除按钮绑定函数*/
            delEmp(a){
                console.log(a);
                this.deleteEmpId= a.empId;
                /*展示确认弹出框*/
                this.messageDialog=true;
                this.messageShow=false;
            },
            /*确认删除按钮绑定函数*/
            deleteUser(){
                /*关闭确认删除弹出框*/
                this.messageDialog=false;
                let obj={};
                obj.empId=this.deleteEmpId;
                obj.empStat="01";
                let _this=this;
                this.$ajaxPromise(requestUrl.deleteUrl,obj,"POST",true).then(function(resp){
                    if(resp.respCode=="0000"){
                        /*店员删除成功*/
                        console.log("店员删除成功");
                        _this.message="店员删除成功";
                        _this.messageClass="successImage";
                    }else{
                        console.log("店员删除不成功");
                        _this.message="店员删除失败";
                        _this.messageClass="errImage";
                    }
                    _this.messageShow=true;
                    /*关闭弹出框*/
                    _this.closeMsgDialog();
                    /*如果删除的是当前页的最后一条数据，那么当前页减一，再去查询*/
                    if(_this.currentPage==_this.sum&&_this.totalCnt%_this.pageSize==1){
                        if(_this.currentPage>1){
                            _this.currentPage=_this.currentPage-1;
                        }
                    }
                    /*调用查询更新页面数据*/
                    _this.query();
                });
            },
            empStatFormat(a){
                let result='未知';
                this.staticData.empStatOptions.forEach(function(opt){
                    if(opt.value==a){
                        result=opt.label;
                    }
                });
                return result;
            },
            /*详情按钮*/
            detailEmp(a){
                let _this=this;
                /*调取店员详情接口获取店员详情信息*/
                this.$ajaxPromise(requestUrl.empDetail,{empId: a.empId},"POST",true).then(function(resp){
                    console.log(resp,'resp');
                    if(resp.respCode=="0000"){
                        console.log("店员详情查询成功");
                        /*给表单赋值*/
                        _this.detailData.empId=resp.empId;
                        _this.detailData.empNM=resp.empNM;
                        _this.detailData.empStat=_this.empStatFormat(resp.empStat);
                        _this.detailData.phoneNo=resp.phoneNo;
                        let auth='';
                        resp.userAuthList.forEach(function(option){
                            if(option.isAuth=='1'){
                                if(auth==''){
                                    auth=auth+option.authDesc;
                                }else{
                                    auth=auth+'、'+option.authDesc;
                                }
                            }
                        });
                        if(auth==''){
                            auth='无';
                        }
                        _this.detailData.userAuthList=auth;
                    }else{
                        console.log("店员详情查询失败");
                        let msg="详情获取失败";
                        _this.detailData.empId=msg;
                        _this.detailData.empNM=msg;
                        _this.detailData.empStat=msg;
                        _this.detailData.phoneNo=msg;
                        _this.detailData.userAuthList=msg;
                    }
                    _this.detailDialogShow=true;
                });
            },
            detailCancel(){
                this.detailDialogShow=false;
            },
            /*停用启用*/
            changeState(a,b){
                let obj={};
                let _this=this;
                obj.empStat=a;
                obj.empId=b;
                this.$ajaxPromise(requestUrl.stateChange,obj,"POST",true).then(function(resp){
                    if(resp.respCode=="0000"){
                        /*状态更改成功*/
                        _this.message="状态修改成功";
                        _this.messageClass="successImage";

                    }else{
                        /*状态修改失败*/
                        _this.message="状态修改失败";
                        _this.messageClass="errImage";
                    }
                    /*显示消息弹出框*/
                    _this.messageShow=true;
                    /*关闭弹出框*/
                    _this.closeMsgDialog();
                    /*调用查询更新页面数据*/
                    _this.query();
                });
            },
            /*三秒之后关闭弹出框*/
            closeMsgDialog(){
                let _this=this;
                setTimeout(function(){
                    _this.messageShow=false;
                },2000)
            },
            /*查询*/
            query(){
                let queryData={};
                let _this=this;
                queryData.pageNo=this.currentPage;
                queryData.pageSize=this.pageSize;
                /*调用店员查询接口*/
                this.$ajaxPromise(requestUrl.query,queryData,"POST",true).then(function(resp){
                    console.log(resp,'resp');
                    /*判断店员人数是否为0*/
                    if(resp.totalCnt>0){
                        /*店员人数不为0时进行以下操作*/
                        _this.isNull=false;
                        _this.isExist=true;
                        _this.empList=resp.empList;
                        _this.totalCnt=resp.totalCnt;
                        _this.sum=Math.ceil(resp.totalCnt/_this.pageSize);
                    }else{
                        _this.sum=1;
                        _this.isNull=true;
                        _this.isExist=false;
                    }
                });
            },
            /*去首页*/
            goFirstPage(){
                this.currentPage=1;
                this.query();
            },
            /*上一页*/
            goPrePage(){
                if(this.currentPage!=1){
                    this.currentPage=this.currentPage-1;
                    this.query();
                }
            },
            /*下一页*/
            goNextPage(){
                /*当前页码小于总页码*/
                if(this.currentPage<this.sum){
                    this.currentPage+=1;
                    this.query();
                }
            },
            /*最后一页*/
            goLastPage(){
                this.currentPage=this.sum;
                this.query();
            },
            /*角色查询*/
//            roleQuery(){
//                let _this=this;
//                this.$ajaxPromise(requestUrl.roleQuery,{},"POST",true).then(function(resp){
//                    console.log(resp,'role');
//                    _this.staticData.roleOptions=resp.roleList;
//                });
//            },
            /*系统权限列表查询*/
            sysAuthListQuery(){
                let _this=this;
                this.$ajaxPromise(requestUrl.authListQuery,{},"POST",true).then(function(resp){
                    if(resp.respCode=='0000'){
                        console.log("按钮权限获取成功");
                        _this.authList=resp.sysAuthList;
                    }else{
                       console.log("按钮权限获取失败");
                    }
                });
            }
        },
        created(){
            this.query();
//            this.roleQuery();
            this.sysAuthListQuery();
        }
    }
</script>
