<template>
    <div id="container">

        <!--当存在角色时展示如下界面-->
        <div  v-if="!isNull">

            <!--新增顶部-->
            <div id="head">
                <i class="headFont">角色管理</i>
                <el-button type="text" @click="add" id="add">添加</el-button>
            </div>
            <!--角色列表-->
            <div class="userContainer" v-for="emp in roleList" :key="emp.roleId">
                <div class="userRow">
                    <span class="userLabel">角色编号</span>
                    <div class="content" style="width:600px;">
                        {{emp.roleId}}
                        <el-button type="text" @click="detail(emp)" style="padding:0;margin-left:80px;">详情</el-button>
                        <el-button type="text" @click="update(emp)" style="color:#E40001;padding:0;margin-left:22px;">修改</el-button>
                        <el-button type="text" @click="delrole(emp)" style="color:#E40001;padding:0;margin-left:22px;">删除</el-button>
                    </div>
                </div>
                <div class="userRow">
                    <span class="userLabel">角色名称</span>
                    <div class="content">{{emp.roleName}}</div>
                    <span class="userLabel">状态</span>
                    <div class="content" v-if="emp.roleState==='00'">启用
                        <el-button type="text" @click="changeState('03',emp)" style="color:#E40001;padding:0;margin-left:60px;">停用</el-button>
                    </div>
                    <div class="content" v-if="emp.roleState==='99'">停用
                        <el-button type="text" @click="changeState('02',emp)" style="color:#E40001;padding:0;margin-left:60px;">启用</el-button>
                    </div>
                </div>
                <div class="lastUserRow">
                    <span class="userLabel">人员</span>
                    <div class="content">
                        <el-button type="text" @click="empDetail(emp)" style="color:#E40001;">{{emp.sumUser}}人</el-button>
                    </div>
                    <span class="userLabel">描述</span>
                    <div class="content">{{emp.roleDesc}}</div>
                </div>
            </div>
            <!--底部分页栏目-->
            <div class="pagination">
                <el-button type="text" style="color:#1094F5;padding:0;" @click="goFirstPage"> <<首页 </el-button>
                <el-button type="text" style="color:#1094F5;padding:0;" @click="goPrePage"> <上一页 </el-button>
                <span>&nbsp;&nbsp;第{{currentPage}}页,共{{sum}}页&nbsp;&nbsp;</span>
                <el-button type="text" style="color:#1094F5;padding:0;" @click="goNextPage"> 下一页> </el-button>
                <el-button type="text" style="color:#1094F5;padding:0;" @click="goLastPage"> 尾页>> </el-button>
            </div>

        </div>

        <!--没有角色时展示如下界面-->
        <div v-else class="isnull">
            <div class="nullImage"></div>
            <div style="margin-left:290px;">
                目前暂无数据，可进行
                <el-button type="text" @click="add" id="addEmp">添加</el-button>
            </div>
        </div>

        <!--新增/修改弹出框 start-->
        <div v-if="addDialogShow" class="userDialog">
            <div class="userDialogCon" v-if="addFormShow">
                <el-form
                    :rules="addFormRules"
                    class="addForm"
                    :model="addFormData"
                    ref="addForm"
                    label-width="100px"
                    label-position="left">
                    <el-form-item label="角色名称"  prop="roleName">
                        <el-input v-model="addFormData.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述"  prop="roleDesc">
                        <el-input type="textarea" v-model="addFormData.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <!--权限绑定区域 start-->
                <div class="addForm" style="padding-top: 0;margin-bottom:15px;">
                    <span style="padding-left:10px;">菜单绑定</span>
                    <el-tree
                        class="treeMenu"
                        v-loading.body="status.bindedQueryloading"
                        element-loading-text="加载已绑定权限..."
                        :data="staticData.menuTree"
                        show-checkbox
                        node-key="id"
                        ref="authTree"
                        highlight-current
                        @check-change="handleTreeCheckChange"
                        check-strictly
                        :default-checked-keys="defaultKeys"
                        >
                    </el-tree>
                    <!--清除浮动-->
                    <div class="clear"></div>
                </div>
                <p class="errorMesg" v-if="isExit">请绑定菜单权限</p>
                <!--权限绑定区域 end-->
                <div class="bottomBtn">
                    <el-button type="primary" @click="addForm" class="addbtn" style="margin-left: 48px;background-color: #E40001;">提交</el-button>
                    <el-button type="primary" @click="addCancel" class="addbtn" style="margin-left: 28px;background-color: #666;">返回</el-button>
                </div>
            </div>
        </div>
        <!--新增/修改弹出框 end-->

        <!--角色相关连用户展示弹出框 start-->
        <div v-if="empDetailShow" class="userDialog">
            <div class="empDetailCon">
                <!--title-->
                <p class="empTitle">店员信息</p>
                <!--表格展示部分-->
                <el-table
                    :data="tableData"
                    style="width: 100%;font-size:14px;">
                    <el-table-column
                        prop="empNo"
                        label="店员号"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="userNm"
                        label="姓名"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="phoneNo"
                        label="手机号">
                    </el-table-column>
                </el-table>
                <!--控制分页查询部分 start-->
                <div class="pagination">
                    <!--<el-button type="text" style="color:#1094F5;padding:0;" @click="goFirstPage"> <<首页 </el-button>-->
                    <el-button type="text" style="color:#1094F5;padding:0;" @click="empGoFirstPage"> <上一页 </el-button>
                    <span>&nbsp;&nbsp;第{{empCurrentPage}}页,共{{empSum}}页&nbsp;&nbsp;</span>
                    <el-button type="text" style="color:#1094F5;padding:0;" @click="empGoNextPage"> 下一页> </el-button>
                    <!--<el-button type="text" style="color:#1094F5;padding:0;" @click="goLastPage"> 尾页>> </el-button>-->
                </div>
                <!--控制分页查询部分 end-->
                <!--按钮部分-->
                <div style="margin-left:100px;margin-top:15px;">
                    <el-button
                        type="primary"
                        @click="empDetailClose"
                        style="margin-left:15px;width:149px;height:44px;background-color: #E40001;border-radius: 6px;">
                        关闭
                    </el-button>
                </div>
            </div>
        </div>
        <!--角色相关连用户展示弹出框 end-->

        <!--详情弹出框-->
        <div v-if="detailDialogShow" class="userDialog">
            <div class="detailStyle">
                <!--角色详情部分-->
                <div>
                    <el-row>
                        <el-col :span="6">角色编号</el-col>
                        <el-col :span="6">{{roleDetail.roleId}}</el-col>
                        <el-col :span="6">角色名称</el-col>
                        <el-col :span="6">{{roleDetail.roleName}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">状态</el-col>
                        <el-col :span="18" v-if="roleDetail.roleState==='00'">
                            启用
                        </el-col>
                        <el-col :span="18" v-if="roleDetail.roleState==='99'">
                            停用
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">描述</el-col>
                        <el-col :span="18">
                            {{roleDetail.roleDesc}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">菜单</el-col>
                        <el-col :span="18">
                            <el-tree
                                v-loading.body="status.bindedQueryloading"
                                element-loading-text="加载已绑定权限..."
                                :data="detailRoletree"
                                node-key="id"
                                :props="mixinTreeDefaultProps"
                                ref="detailRoletree"
                                check-strictly
                                >
                            </el-tree>
                        </el-col>
                    </el-row>
                </div>
                <hr/>
                <!--角色关联人员查询-->
                <el-table
                    :data="tableData"
                    style="width: 100%;font-size:14px;">
                    <el-table-column
                        prop="empNo"
                        label="店员号"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="userNm"
                        label="姓名"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="phoneNo"
                        label="手机号">
                    </el-table-column>
                    <el-table-column
                        prop="userStat"
                        label="状态"
                        :formatter="formatterState">
                    </el-table-column>
                </el-table>
                <!--控制分页查询部分 start-->
                <div class="pagination">
                    <!--<el-button type="text" style="color:#1094F5;padding:0;" @click="goFirstPage"> <<首页 </el-button>-->
                    <el-button type="text" style="color:#1094F5;padding:0;" @click="empGoFirstPage"> <上一页 </el-button>
                    <span>&nbsp;&nbsp;第{{empCurrentPage}}页,共{{empSum}}页&nbsp;&nbsp;</span>
                    <el-button type="text" style="color:#1094F5;padding:0;" @click="empGoNextPage"> 下一页> </el-button>
                    <!--<el-button type="text" style="color:#1094F5;padding:0;" @click="goLastPage"> 尾页>> </el-button>-->
                </div>
                <!--控制分页查询部分 end-->
                <div class="clear"></div>
                <el-button type="primary" @click="detailDialogClose" class="pwdbtn" style="margin-left: 150px;background-color: #E40001;">返回</el-button>
            </div>
        </div>

        <!--提示信息弹出框 开始-->
        <div class="userDialog" v-if="messageDialog">
            <div class="success" v-if="messageShow">
                <div :class="messageClass"></div>
                <span :class="msg">{{message}}</span>
                <el-button type="primary" v-if="msgBtnShow" @click="msgBtn" style="margin-left:15px;width:149px;height:44px;background-color: #E40001;border-radius: 6px;">返回</el-button>
            </div>
            <div v-if="isDelete" class="isDelete">
                <div class="deleteMsg">确定删除？</div>
                <div>
                    <el-button type="primary" @click="cancleDelete" class="isDeleteBtn" style="background-color: #E40001;">取消</el-button>
                    <el-button type="primary" @click="deleteUser"  class="isDeleteBtn" style="background-color: #666;">删除</el-button>
                </div>
            </div>
        </div>
        <!--信息弹出框 结束-->
    </div>
</template>

<style scoped>
    /*人员详情展示区域样式*/
    .empDetailCon{
        position: absolute;
        width:465px;
        /*min-height:310px;*/
        background-color: #fff;
        border-radius:6px;
        top:161px;
        left:237px;
        padding:21px 28px 20px 28px;
    }
    .empTitle{
        font-size:16px;
        color:#E40001;
    }
    .msg{
        display:block;
        width:287px;
        font-size:18px;
        color:#333;
        line-height:32px;
        margin:auto;
        margin-top:30px;
        margin-bottom:12px;
    }
    .isnull{
        font-size:20px;
        color:#333;
        padding-top:46px;
    }
    .nullImage{
        width:265px;
        height:175px;
        background-image: url('../../../../assets/No-Data@3x.png');
        background-size:100% 100%;
        margin-left:280px
    }
    #addEmp{
        color:#E40001;
        font-size:20px;
    }
    #container{
        font-family: "PingFang SC";
        padding-left: 47px;
        font-size:16px;
        position: relative;
        /*padding-bottom:20px;*/
    }
    #head{
        padding:22px 0;
    }
    .headFont{
        font-size:18px;
        color:#E40001;
        font-style:normal;
    }
    #add{
        float: right;
        color:#0068BB;
        padding:0;
        margin-right: 62px;
    }
    .userRow{
        margin-bottom: 19px;
    }
    .lastUserRow{
        margin-bottom:31px;
    }
    .userContainer{
        width:100%;
        padding-top:27px;
        border-top:3px solid #ddd;
    }
    .userContainer .userLabel{
        display: inline-block;
        width:95px;
        color:#333;
    }
    .userContainer .content{
        font-size:14px;
        display: inline-block;
        width:317px;
        /*min-height:35px;*/
        padding-left:16px;
        /*border:1px solid #ddd;*/
        color:#666;
        vertical-align: middle;
        line-height: 35px;
    }
    .userContainer .textRight{
        display: inline-block;
        width:119px;
        text-align: right;
        padding-right:11px;
    }
    .pagination{
        font-family: MicrosoftYaHei;
        font-size:12px;
        float:right;
        margin-right:53px;
    }
    .pagination button{
        font-family: MicrosoftYaHei;
        font-size:12px;
    }
    .userDialog{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        background-color: rgba(0,0,0,0.2);
    }
    .userDialogCon{
        position:absolute;
        width:464px;
        /*height:391px;*/
        background-color: #fff;
        top:100px;
        left:238px;
        border-radius: 6px;
    }
    .bottomBtn{
        margin-bottom: 15px;
    }
    .addForm{
        width:100%;
        padding:24px 93px 0px 92px;
        color:#333333;
        font-size:14px;
    }
    .addForm .el-form-item{
        margin-bottom: 20px;
    }

    .el-form-item label{
        font-weight: normal;
        margin-bottom: 0;
    }
    .userDialogCon .addbtn{
        width:169px;
        height:49px;
        border-radius:6px;
        color:#fff;
    }
    .addPhoneTest .addbtn{
        width:169px;
        height:49px;
        border-radius:6px;
        color:#fff;
    }
    .detailStyle .pwdbtn{
        width:169px;
        height:49px;
        border-radius:6px;
        color:#fff;
    }
    .el-button--primary{
        border-color:#fff;
    }
    .userDialogCon .el-input__inner{
        height:34px;
    }
    .addPhoneTest{
        width:459px;
        height:189px;
        position: absolute;
        top:191px;
        left:240px;
        background-color: #fff;
        border-radius: 6px;
        padding:29px 40px 34px 38px;
        color:#333;
        font-size:14px;
    }
    .addPhoneTest .el-input-group{
        width:296px;
        height: 41px;
    }
    .addPhoneTest .el-input__inner{
        height:41px;
    }
    .addPhoneTest .el-input-group__append{
        color:#E40001;
    }
    .success{
        width:345px;
        height:161px;
        position:absolute;
        top:203px;
        left:296px;
        background-color: #fff;
        border-radius: 6px;
        text-align: center;
        color:#202020;
        font-size:21px;
    }
    .successImage{
        width:60px;
        height:60px;
        margin:30px 42px 20px 143px;
        background-image:url('../../../../assets/success.png');
        background-size:100% 100%;
    }
    .detailStyle{
        width:600px;
        /*height:231px;*/
        position:absolute;
        top:30px;
        left:260px;
        background-color: #fff;
        border-radius: 6px;
        color:#333;
        font-size:14px;
        padding:20px 30px;
    }
    .detailStyle .el-row{
        margin-bottom: 15px;
    }
    .detailStyle .el-tree{
        border:none;
        margin-top:-5px;
        color: #333;
        font-size: 16px;
        margin-left:-15px;
    }
    .detailRow{
        margin-bottom:15px;
    }
    .userDialog .isDelete{
        width:400px;
        height:160px;
        position: absolute;
        top:191px;
        left:250px;
        background-color: #fff;
        border-radius: 6px;
        padding:29px 40px 34px 38px;
        color:#333;
        font-size:22px;
    }
    .deleteMsg{
        margin-bottom:30px;
    }
    .isDelete .isDeleteBtn{
        width:90px;
        height:40px;
        border-radius:6px;
        color:#fff;
        margin-left:90px;
    }
    .treeMenu{
        width:180px;
        float:right;
        margin-top:-8px;
    }
    .clear{
        clear:both;
    }
    .addForm .el-tree{
        border: none;
    }

    .errorMesg{
        color:#ff4949;
        font-size:12px;
        padding-top:-10px;
        text-align: center;
    }
</style>

<script>
    import * as Mixins from '../../../../jslib/mixin'
    import staticloadconfig from './staticloadconfig.json'
    import * as requestUrl from './requestUrl'
    /*引入md5加密包*/
    import md5 from 'js-md5';

    export default{
        name:'MchtsCenterRoleManage',
        mixins:[Mixins.AuthMixin,Mixins.StaticDataLoad,Mixins.PropertyInit,Mixins.ShowWatcher],
        data(){
            return {
            /*角色详情弹出框是否展示*/
            detailDialogShow:false,
            /*角色绑定的菜单项*/
            detailRoletree:[],
            roleDetail:{},
            /*人员详情弹出框是否展示*/
            empDetailShow:false,
            /*消息弹出框绑定的按钮是否显示*/
            msgBtnShow:false,
            /*角色关联的人员详情数组*/
            tableData:[],
            msg:'',
            roleId:'',
            status:{
                isQuerying:false,
                isBinding:false,
                bindedQueryloading:false
            },
            /*是否绑定菜单权限*/
            isExit:false,
            isNull:false,
            staticLoadConfig: staticloadconfig,
            messageDialog:false,
            messageShow:false,
            message:'',
            messageClass:'',
            addDialogShow:false,
            addFormShow:false,
            isDelete:false,
            /*被删除角色Id*/
            deleteRoleId:'',
            /*第几页*/
            currentPage:1,
            /*共几页*/
            sum:1,
            /*每页条数*/
            pageSize:3,
            /*角色绑定人员详情第几页*/
            empCurrentPage:1,
            /*角色绑定人员详情共几页*/
            empSum:1,
            /*角色绑定人员详情每页条数*/
            empPageSize:3,
            /*角色集合*/
            roleList:[],
            /*新增店员绑定表单*/
            addFormData:{
                roleName:'',
                roleDesc:''
            },
            /*新增角色表单验证规则*/
            addFormRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { max: 20, message: '少于20个字符', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { max: 40, message: '少于40个字符', trigger: 'blur' }
                ]
            },
            staticData:{
                /*角色集合*/
                roleOptions:[],
                /*全量菜单返回结果*/
                menuAuthTree:[],
                /*elementUI组件绑定的菜单集合*/
                menuTree:[]
            },
            /*默认展开的节点集合*/
            /*tempBindedKeys:[],*/
            /*进行修改的角色ID*/
            updateRoleId:'',
            /*默认选中的节点数组*/
            defaultKeys:['5901582f3907640d3ce3fc43','5901582f3907640d3ce3fc44','001'],
             /*需要隐藏的菜单Id以及按钮Id*/
            hiddenKeys:['5901582f3907640d3ce3fc48','014']
        }
        },
        methods:{
            /*取消当前选中节点的子节点*/
            cancle(a){
                if(a.children && a.children.length > 0){
                    let childrenKeys = [];
                    a.children.forEach((x) => childrenKeys.push(x.id));
                    let keys = this.$refs.authTree.getCheckedKeys().filter(x => !childrenKeys.includes(x));
                    this.$refs.authTree.setCheckedKeys(keys);
                }
            },
            /*勾选当前选中节点的父节点*/
            key(a){
                let _this=this;
                let keys = this.$refs.authTree.getCheckedKeys();
                if(!keys.includes(a.parentId)){
                    keys.push(a.parentId);
                    this.$refs.authTree.setCheckedKeys(keys);
                }
            },
            /**树选择变化*/
            handleTreeCheckChange(data,ifChecked,sunChecked){
                /**当选中子节点（按钮权限）时，如果对应菜单没有被选择，则自动进行权限
                 * 既选择一个按钮的权限就默认等同选择了对应菜单
                 * 由于设定了 check-strictly属性，故需要自己处理关联选择*/
                if(data['level'] === 3){
                    if(!ifChecked){
                        return
                    }
                    this.key(data);
                } else if(data['level'] === 2){
                    if(!ifChecked){
                        this.cancle(data);
                        return
                    }
                    this.key(data);
                }else if(data['level'] === 1){
                    if(!ifChecked){
                        this.cancle(data);
                        return
                    }else{
                        if(data.parentId){
                            this.key(data);
                        }
                    }
                }
            },
            /**树过滤节点方法*/
            filterNode(value, data){
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            /*获取tree组件绑定的数组对象中所有的key方法*/
            getKey(tree,key){
                let _this=this;
                tree.forEach(function(option){
                    key.push(option.id);
                    if(option.children&&option.children.length>0){
                        _this.getKey(option.children,key);
                    }
                });
                return key;
            },
            /*处理调用菜单查询接口返回的数据。*/
            treeData(List,a,b,c){
                let data=[];
                for(let i=0;i<List.length;i++) {
                    if(this.hiddenKeys.includes(List[i][a])){
                        /*什么也不做*/
                    }else{
                        let option = {};
                        option.id = List[i][a];
                        option.label = List[i][b];

                        /*必选节点设置按钮设置disabled属性为true*/
                        if(this.defaultKeys.includes(List[i][a])){
                            option.disabled=true;
                        }

                        /*判断是否为按钮级*/
                        if (List[i].menuId != undefined) {
                            option.parentId = List[i][c];
                            if (List[i].groupFlag == "01") {
                                /*菜单组菜单*/
                                option.level = 1;
                            } else {
                                /*功能菜单*/
                                option.level = 2;
                            }
                        } else {
                            option.parentId = c;
                            /*按钮型*/
                            option.level = 3;
                            option.authCode = List[i].authCode;
                        }
                        data.push(option);
                        if (List[i].childrenList) {
                            if (List[i].childrenList.length > 0) {
                                data[data.length-1].children = this.treeData(List[i].childrenList, 'menuId', 'menuName', 'pMenuId');
                            } else {
                                data[data.length-1].children = this.treeData(List[i].authList, 'btAuthId', 'btName', List[i].menuId);
                            }
                        }
                    }
                }
                console.log(data,'data');
                return data;
            },
            /*新增角色按钮*/
            add(){
                this.addDialogShow=true;
                this.addFormShow=true;
                /*处理菜单接口返回的数据，变成elementUI组件需要的格式*/
                this.staticData.menuTree=this.treeData(this.staticData.menuAuthTree,'menuId','menuName','pMenuId');
                console.log(this.staticData.menuTree,'this.staticData.menuTree');
                this.updateRoleId='';
            },
            /*返回按钮*/
            addCancel(){
                console.log(this.$refs.authTree,'this.$refs.authTree');
                console.log('重置新增/修改角色表单');
                /*清空新增角色表单*/
                /*this.$refs['addForm'].resetFields();*/
                this.addFormData.roleName= '';
                this.addFormData.roleDesc= '';
                /*关闭弹出框*/
                this.addDialogShow=false;
                /*关闭提示信息*/
                this.isExit=false;
            },
            /*提交按钮*/
            addForm(){
                let _this=this;
                let nodes = this.$refs.authTree.getCheckedNodes();
                let keys = this.$refs.authTree.getCheckedKeys();
                let menuAuths = []
                let menuAuthsMap = new Map();
                let mapKey ;
                let menuAuth;
                if(nodes && nodes.length > 0){
                    nodes.forEach(function (node) {
                        /**如果是一级（菜单）和二级menuAuthsMap没有对应对象时新增*/
                        if(node.level === 1||node.level === 2){
                            mapKey = node.id
                            if(!menuAuthsMap.has(mapKey)){
                                menuAuthsMap.set(mapKey,{
                                    menuId:mapKey,
                                    btAuthList:[]
//                                    btAuthList:''
                                })
                            }
                            /**如果是三级（菜单按钮）menuAuthsMap没有对应对象时新增
                             * 并且添加至btAuthIdList*/
                        }else if(node.level === 3){
                            mapKey = node.parentId
                            if(!menuAuthsMap.has(mapKey)){
                                menuAuthsMap.set(mapKey,{
                                    menuId:mapKey,
                                    /*btAuthIdList:[node.id]*/
                                    btAuthList:[node.authCode]
//                                    btAuthList:node.authCode
                                })
                            }else{
                                /*menuAuthsMap.get(mapKey).btAuthIdList.push(node.id)*/
                                menuAuthsMap.get(mapKey).btAuthList.push(node.authCode)
//                                if(menuAuthsMap.get(mapKey).btAuthList.length==0){
//                                    menuAuthsMap.get(mapKey).btAuthList=node.authCode;
//                                }else{
//                                    menuAuthsMap.get(mapKey).btAuthList=menuAuthsMap.get(mapKey).btAuthList+','+node.authCode;
//                                }
                            }
                        }
                    })
                    menuAuthsMap.forEach((menuAuth) => menuAuths.push(menuAuth))
                    console.log(menuAuths,'menuAuths');
                    this.$refs["addForm"].validate((valid) => {
                        if (valid) {
                            /*如果通过了表单验证*/
                            let obj={};
                            obj.roleName=_this.addFormData.roleName;
                            obj.roleDesc=_this.addFormData.roleDesc;
                            obj.list=menuAuths;
                            let that=this;
                            if(_this.updateRoleId===''){
                                /*调用角色新增查询接口*/
                                _this.$ajaxPromise(requestUrl.insert,obj,"POST",true).then(function(resp){
                                    console.log(resp,"角色新增接口返回");
                                    if(resp.respCode="0000"){
                                        /*新增成功*/
                                        that.$refs['addForm'].resetFields();
                                        that.addDialogShow=false;
                                        that.addFormShow=false;
                                        /*显示成功消息弹出框*/
                                        that.messageDialog=true;
                                        that.message="添加成功";
                                        that.messageClass="successImage";
                                        that.messageShow=true;
                                        let the=that;
                                        setTimeout(function(){
                                            the.messageDialog=false;
                                        },3000);
                                        /*调用查询按钮更新页面数据*/
                                        that.query();
                                    }
                                });
                            }else{
                                obj.roleId=_this.updateRoleId;
                                /*调用角色修改查询接口*/
                                _this.$ajaxPromise(requestUrl.update,obj,"POST",true).then(function(resp){
                                    console.log(resp,"角色修改接口返回");
                                    if(resp.respCode="0000"){
                                        /*修改成功*/
                                        /*that.$refs['addForm'].resetFields();*/
                                        that.addFormData.roleName= '';
                                        that.addFormData.roleDesc= '';
                                        that.addDialogShow=false;
                                        that.addFormShow=false;
                                        /*显示成功消息弹出框*/
                                        that.messageDialog=true;
                                        that.message="修改成功";
                                        that.messageClass="successImage";
                                        that.messageShow=true;
                                        let the=that;
                                        setTimeout(function(){
                                            the.messageDialog=false;
                                        },3000);
                                        /*调用查询按钮更新页面数据*/
                                        that.query();
                                    }
                                });
                            }

                        } else {
                            return false;
                        }
                    });
                }else{
                    console.log("请绑定菜单权限！");
                    this.isExit=true;
                };
            },
            /*点击详情展示*/
            detail(a){
                console.log('detail');
                this.roleDetail=a;
                this.detailDialogShow=true;
                console.log(this.roleDetail,'roleDetail');
                let _this=this;
                this.$ajaxPromise(requestUrl.menuQuery,{roleId:a.roleId},"POST",true)
                    .then(function(resp){
                        console.log(resp,"角色绑定的菜单返回结果");
                        if(resp.respCode="0000"){
                            console.log("查询角色绑定的菜单信息成功");
                            /*如果查询成功*/
                            _this.detailRoletree=_this.treeData(resp.dataList,'menuId','menuName','pMenuId');
                        }else{
                            console.log("查询角色绑定的菜单信息失败");
                        }
                    }).catch(function(error){

                    });
                this.empDetail(a);
                this.empDetailShow=false;
            },
            /*点击详情弹出页返回按钮*/
            detailDialogClose(){
                this.detailDialogShow=false;
            },
            /*根据后台返回的状态码显示前台表格的文字*/
            formatterState(row,column){
                let result="未知";
                if(row.userStat=="00"){
                    result = "正常";
                    return result;
                }else if(row.userStat=="01"){
                    result = "停用"
                    return result;
                }else if(row.userStat=="02"){
                    result = "冻结"
                    return result;
                }
                return result;
            },
            /*修改按钮绑定函数*/
            update(a){
                console.log(a);
                this.addDialogShow=true;
                this.addFormShow=true;
                /*处理菜单接口返回的数据，变成elementUI组件需要的格式*/
                this.staticData.menuTree=this.treeData(this.staticData.menuAuthTree,'menuId','menuName','pMenuId');
                /*给表单赋值*/
                this.updateRoleId= a.roleId;
                this.addFormData.roleName= a.roleName;
                this.addFormData.roleDesc= a.roleDesc;
                /*调菜单查询接口，查询此角色绑定的菜单*/
                let _this=this;
                this.$ajaxPromise(requestUrl.menuQuery,{roleId:a.roleId},"POST",true)
                    .then(function(resp){
                        console.log(resp,"角色绑定的菜单返回结果");
                        if(resp.respCode="0000"){
                            /*如果查询成功*/
    //                        _this.staticData.menuAuthTree=resp.dataList;
                            let authTree=_this.treeData(resp.dataList,'menuId','menuName','pMenuId');
                            let key=[];
                            _this.getKey(authTree,key);
                            _this.$refs.authTree.setCheckedKeys(key);
                            /*_this.tempBindedKeys=key;*/
                        }
                    }).catch(function(error){
                        console.log("查询角色绑定的菜单信息失败");
                    })

            },
            /*删除按钮绑定函数*/
            delrole(a){
                /*若此角色下人数大于0则不让客户删除*/
                if(a.sumUser>0){
                    this.messageDialog=true;
                    this.msgBtnShow=true;
                    this.msg='msg';
                    this.message="该角色已赋予给店员，无法删除， 若需删除，请先删除该角色下店员";
                    this.messageClass="";
                    this.messageShow=true;
                    let that=this;
                    return;
                }
                console.log(a);
                this.deleteRoleId= a.roleId;
                /*展示确认弹出框*/
                this.messageDialog=true;
                this.isDelete=true;
                this.messageShow=false;
            },
            /*取消删除绑定的函数*/
            cancleDelete(){
                /*关闭确认删除弹出框*/
                this.isDelete=false;
                /*先关闭遮罩层*/
                this.messageDialog=false;
            },
            /*确认删除按钮绑定函数*/
            deleteUser(){
                /*关闭确认删除弹出框*/
                this.isDelete=false;
                /*先关闭遮罩层，避免删除失败的情况，遮罩层一直存在*/
                this.messageDialog=false;
                let obj={};
                obj.roleId=this.deleteRoleId;
                obj.roleFlag="01";
                let _this=this;
                this.$ajaxPromise(requestUrl.deleteUrl,obj,"POST",true).then(function(resp){
                    if(resp.respCode=="0000"){
                        /*角色删除成功*/
                        _this.messageDialog=true;
                        _this.message="角色删除成功";
                        _this.messageClass="successImage";
                        _this.messageShow=true;
                        let that=_this;
                        setTimeout(function(){
                            that.messageDialog=false;
                        },3000)
                        /*调用查询更新页面数据*/
                        _this.query();
                    }else{
                        console.log("角色删除不成功");
                    }
                });
            },
            /*消息弹出框返回按钮*/
            msgBtn(){
                this.messageDialog=false;
                this.msg='';
                this.msgBtnShow=false;
            },
            /*停用启用*/
            changeState(a,b){
                /*判断停用操作时，若此角色下人数大于0则不让客户停用*/
                if(a==='03'){
                    if(b.sumUser>0){
                        this.messageDialog=true;
                        this.msgBtnShow=true;
                        this.msg='msg';
                        this.message="该角色已赋予给店员，无法停用， 若需停用，请先删除该角色下店员";
                        this.messageClass="";
                        this.messageShow=true;
                        let that=this;
                        return;
                    }
                }
                let obj={};
                let _this=this;
                obj.roleFlag=a;
                obj.roleId= b.roleId;
                this.$ajaxPromise(requestUrl.stateChange,obj,"POST",true).then(function(resp){
                    if(resp.respCode=="0000"){
                        /*状态更改成功*/
                        _this.messageDialog=true;
                        _this.message="状态修改成功";
                        _this.messageClass="successImage";
                        _this.messageShow=true;
                        let that=_this;
                        setTimeout(function(){
                            that.messageDialog=false;
                        },3000)
                        /*调用查询更新页面数据*/
                        _this.query();
                    }
                });
            },
            /*查询*/
            query(){
                let queryData={};
                let _this=this;
                queryData.pageNo=this.currentPage;
                queryData.pageSize=this.pageSize;
                /*调用角色查询接口*/
                this.$ajaxPromise(requestUrl.query,queryData,"POST",true).then(function(resp){
                    console.log(resp,'resp');
                    /*判断角色个数是否为0*/
                    if(resp.totalCnt>0){
                        /*角色个数不为0时进行以下操作*/
                        _this.isNull=false;
                        _this.roleList=resp.dataList;
                        _this.sum=Math.ceil(resp.totalCnt/_this.pageSize);
                    }else{
                        _this.isNull=true;
                    }
                });
            },
            /*点击人员个数触发的人员详情展示函数*/
            empDetail(a){
                if(a.sumUser>0){
                    /*展示弹出框*/
                    this.empDetailShow=true;
                    this.roleId= a.roleId;
                    /*初始化当前页面*/
                    this.empCurrentPage=1;
                    this.empQuery();
                }else{
                    console.log("无人员信息展示");
                }
            },
            /*角色相关联人员查询*/
            empQuery(){
                let obj={};
                obj.roleId= this.roleId;
                obj.pageNo=this.empCurrentPage;
                obj.pageSize=this.empPageSize;
                let _this=this;
                console.log(obj,"queryObj");
                this.$ajaxPromise(requestUrl.empQuery,obj,"POST",true).then(function(resp){
                    /*判断人员个数是否为0*/
                    if(resp.totalCnt>0){
                        /*人员个数不为0时进行以下操作*/
                        _this.tableData=resp.dataList;
                        _this.empSum=Math.ceil(resp.totalCnt/_this.empPageSize);
                    }
                });
            },
            /*关闭人员详情弹出框*/
            empDetailClose(){
                /*展示弹出框*/
                this.empDetailShow=false;
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
            /*角色关联的人员详情页，上一页按钮*/
            empGoFirstPage(){
                if(this.empCurrentPage!=1){
                    this.empCurrentPage=this.empCurrentPage-1;
                    this.empQuery();
                }
            },
            /*角色关联的人员详情页，下一页按钮*/
            empGoNextPage(){
                /*当前页码小于总页码*/
                if(this.empCurrentPage<this.empSum){
                    this.empCurrentPage=this.empCurrentPage+1;
                    console.log(this.empCurrentPage,'empCurrentPage');
                    this.empQuery();
                }
            }
        },
        created(){
            this.query();
            /*调取菜单查询接口，获取全量菜单*/
            let _this=this;
            this.$ajaxPromise(requestUrl.menuQuery,{roleId:null},"POST",true)
                .then(function(resp){
                    if(resp.respCode="0000"){
                        console.log(resp,"全量菜单返回结果");
                        _this.staticData.menuAuthTree=resp.dataList;
                    }
                }).catch(function(error){

                })
        }
    }
</script>
