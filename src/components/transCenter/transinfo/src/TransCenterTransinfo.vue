<template>
    <div class="container">

        <!--新增顶部-->
        <div class="head">
            <b class="headIcon"></b>
            <i class="headFont">交易信息</i>
        </div>

        <!--顶部搜索表单--开始-->
        <div class="queryForm">
            <el-form ref="headForm" :rules="headFormRules" :model="form" label-width="80px" :label-position="'left'">
                <el-row>
                    <el-col :offset="3" :span="9">
                        <el-form-item label="交易单号：" prop="oddNum">
                            <el-input v-model="form.oddNum" placeholder="请输入交易单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交易日期：" prop="oddDate" class="btnContainer">
                            <el-date-picker type="daterange" v-model="form.oddDate"></el-date-picker>
                            <el-button v-if="!show" type="text"
                                       style="position:absolute;font-size:14px;font-weight:normal;color:#1094F5;top:36px;left:228px;"
                                       @click="advanced">高级选项</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="show">
                    <el-row>
                        <el-col :offset="3" :span="9">
                            <el-form-item label="交易类型："prop="oddType">
                                <el-select v-model="form.oddType" clearable>
                                    <el-option
                                        v-for="item in staticData.oddType"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易金额：" class="btnContainer">
                                <el-input v-model="form.oddBeginAmt" @blur="beginAmt" class="amtStyle">
                                    <template slot="append">元</template>
                                </el-input> —
                                <el-input v-model="form.oddEndAmt" @blur="endAmt" class="amtStyle">
                                    <template slot="append">元</template>
                                </el-input>
                                <el-button type="text"
                                           style="position:absolute;font-size:14px;font-weight:normal;color:#1094F5;top:36px;left:255px;"
                                           @click="close">收起</el-button>
                            </el-form-item>
                            <div class="errMessage" v-if="errorMsgStart||errorMsgEnd">{{errText}}</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :offset="3" :span="9">
                            <el-form-item label="交易状态：" prop="oddState">
                                <el-select v-model="form.oddState" clearable>
                                    <el-option
                                        v-for="item in staticData.oddState"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <!--顶部搜索表单 --结束-->
        <div style="width:100%;text-align:center;margin-bottom:50px;margin-top:10px;">
            <el-button type="primary"  @click="queryBtn" :disabled="isQuery" class="btnCommon" style="background-color:#009C42;">查询</el-button>
        </div>

        <!--搜索结果展示区域 --开始-->
        <div>
            <el-table
                border
                class="tableStyle"
                :data="transTable">
                <el-table-column
                    prop="transDate"
                    label="交易时间"
                    width="193">
                </el-table-column>
                <el-table-column
                    prop="orderId"
                    label="交易单号"
                    width="184">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">{{scope.row.Id}}</div>
                            <div>
                                <el-tag>{{ scope.row.orderId}}</el-tag>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="transType"
                    :show-overflow-tooltip=true
                    label="交易类型"
                    width="136">
                </el-table-column>
                <el-table-column
                    prop="transStat"
                    :show-overflow-tooltip=true
                    label="交易状态"
                    width="136">
                </el-table-column>
                <el-table-column
                    prop="transAmt"
                    :show-overflow-tooltip=true
                    label="金额"
                    style="color:#1094F5;"
                    width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button @click="transDetail(scope.row.Id)" style="font-size:12px;color:#009C42;"type="text">详情</el-button>
                        <el-button @click="doRefund(scope.row.Id,scope.row.transAmt,scope.row.srAmtSum,scope.row.canRefundAmt)" style="font-size:12px;margin-left:5px;" type="text" :disabled="mixinButtonIsDisable('refund')||scope.row.refundFlag==='1'">退款</el-button>
                        <el-button @click="transCancel(scope.row.Id)" style="font-size:12px;margin-left:5px;" type="text" :disabled="mixinButtonIsDisable('revoke')||scope.row.revokeFlag==='1'">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--搜索结果展示区域 --结束-->

        <!--弹出框区域-->
        <div class="transDialog dialog-fade-enter-active" v-if="tansDialogIsShow">
            <!--详情弹出框 开始-->
            <div class="transDetailStyle" v-if="transDetailContainer">
                <!--基本信息-->
                <div class="basicInfo">
                    <el-row v-if="!isRefund">
                        <el-col :span="4">金额：</el-col>
                        <el-col :span="20">+{{detailDate.amt}}</el-col>
                    </el-row>
                    <el-row v-if="!isRefund">
                        <el-col :span="4">消费金额：</el-col>
                        <el-col :span="20">+{{detailDate.transAmt}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">退款金额：</el-col>
                        <el-col :span="20">-{{detailDate.refundAmt}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">交易单号：</el-col>
                        <el-col :span="20">{{detailDate.orderId}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">商户单号：</el-col>
                        <el-col :span="20">{{detailDate.transSsn}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">支付方式：</el-col>
                        <el-col :span="20">{{detailDate.payType}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">店员号：</el-col>
                        <el-col :span="20">{{detailDate.userNo}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">店员姓名：</el-col>
                        <el-col :span="20">{{detailDate.userName}}</el-col>
                    </el-row>
                </div>

                <!--退款或者撤销明细-->
                <div class="transRefund"  v-if="isExistOrderList">
                    <el-row v-for="order in orderList" :key="order.orderId">
                        <el-col :span="2" style="text-align:left;">{{order.oprFlag}}</el-col>
                        <el-col :span="4" style="color:#1094F5;">{{order.oprFlag==='消费'?'+':'-'}}{{order.transAmt}}</el-col>
                        <el-col :span="6">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" style="font-size:12px;">{{order.orderId}}</div>
                                <el-button
                                    style="border:none;padding:0;font-size:14px;color:#333;">{{order.orderId.slice(0,6)+'...'+order.orderId.slice(order.orderId.length-6)}}</el-button>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="6">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" style="width:160px;font-size:12px;">{{order.state}}</div>
                                <el-button
                                    style="border:none;padding:0;font-size:14px;color:#333;">
                                    {{order.transStat}}
                                </el-button>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="6" style="text-align:right;">
                            {{order.transDate+' '+order.transTime.slice(0,2)+':'+order.transTime.slice(2,4)}}
                        </el-col>
                    </el-row>
                </div>
                <div style="width:100%;text-align: center;margin-top:20px;margin-bottom:20px;">
                    <el-button @click="detailDialogClose" type="primary"
                               class="btnCommon" style="background-color:#009C42;">返回</el-button>
                </div>
            </div>
            <!--详情弹出框 结束-->

            <!--退款弹出框 开始-->
            <div class="transRefundStyle" v-if="transRefundContainer">
                <p style="margin-bottom: 20px;">
                    <span class="refundLabel">原交易金额：</span>
                    <span class="refundValue">{{refundForm.originalAmt}} 元</span>
                </p>
                <p style="margin-bottom: 20px;">
                    <span class="refundLabel">累积退货金额：</span>
                    <span class="refundValue">{{refundForm.srAmtSum}} 元</span>
                </p>
                <p style="margin-bottom: 20px;">
                    <span class="refundLabel">可退货金额：</span>
                    <span class="refundValue">{{refundForm.Refundable}} 元</span>
                </p>
                <el-form :rules="refundFormRules" :model="refundForm" ref="refundForm" label-position="left" label-width="80px">
                    <el-form-item
                        label="退款金额"
                        prop="amt">
                        <el-input type="age" placeholder="不得大于可退款金额" v-model.number="refundForm.amt" auto-complete="off">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button @click="refundSubmit" type="primary" class="btnCommon" style="background-color:#009C42;">提交</el-button>
                    <el-button @click="refundCancel" type="primary" class="btnCommon" style="margin-left:14px;background-color:#999;">返回</el-button>
                </div>
            </div>
            <!--退款弹出框 结束-->

            <!--提交退款弹出框开始-->
            <div class="submitRefundStyle" v-if="transSubmitRefundContainer">
                <!--顶部图标部分-->
                <div class="imageContainer">
                    <div :class="msgImageClass"></div>
                    <span>{{respMessage}}</span>
                </div>
                <!--详情展示区域-->
                <div class="refundDetailStyle">
                    <el-row>
                        <el-col :span="12">类型：</el-col>
                        <el-col :span="12">{{submitContent.transType}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">时间：</el-col>
                        <el-col :span="12">{{submitContent.transDate}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">退款金额：</el-col>
                        <el-col :span="12" style="color:#1094F5;">{{submitContent.transAmt}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">交易单号：</el-col>
                        <el-col :span="12">{{submitContent.orderId}}</el-col>
                    </el-row>
                </div>
                <!--底部按钮-->
                <div style="width:100%;text-align:center;margin-bottom:25px;margin-top:10px;">
                    <el-button type="primary" @click="submitClose" class="btnCommon" style="background-color:#009C42;">完成</el-button>
                </div>
            </div>
            <!--提交退款弹出框结束-->

            <!--提示信息弹出框 开始-->
            <div v-if="isCancel" class="isCancel">
                <div class="cancelMsg">是否撤销交易？</div>
                <div style="text-align: center;">
                    <el-button type="primary"  @click="confirm"  class="btnCommon" style="background-color: #009C42;">是</el-button>
                    <el-button type="primary" @click="revoke" class="btnCommon" style="margin-left:18px;background-color:#999;">否</el-button>
                </div>
            </div>
            <!--信息弹出框 结束-->

        </div>

        <!--底部分页栏目-->
        <div id="pagination">
            <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goFirstPage"> <<首页</el-button>
            <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goPrePage"> <上一页 </el-button>
            <span>&nbsp;&nbsp;第{{currentPage}}页,共{{sum}}页&nbsp;&nbsp;</span>
            <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goNextPage"> 下一页></el-button>
            <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goLastPage"> 尾页>></el-button>
        </div>
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
    /*按钮通用样式*/
    .btnCommon{
        width:120px;
        height:34px;
        border-radius:2px;
        font-size:16px;
        color:#fff;
        outline: none;
    }

    /*顶部样式设置*/
    .head{
        padding:20px 30px 20px 21px;
        /*border-bottom:1px solid #EAF0F4;*/
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

    /*顶部搜索框*/
    .queryForm{
        font-size:14px;
        color:#333;
    }

    #container .el-button--primary{
        border:none;
    }

    .btnContainer{
        position:relative;
    }

    .amtStyle{
        width:130px;
    }


    /*表格展示区域*/
    .tableContainer{
        width:100%;
    }
    .tableStyle{
        margin:auto;
        width: 903px;
        color:#666;
        font-size:12px;
    }

    /*分页样式*/
    #pagination{
        width:903px;
        margin:auto;
        text-align: right;
        font-size:12px;
        /*float:right;*/
        margin-top:15px;
        margin-bottom:15px;
    }
    #pagination button{
        font-size:12px;
    }

    .errMessage {
        margin-top: -15px;
        margin-left: 88px;
        color: #ff4949;
        font-size: 12px;
    }

    /*弹出框*/
    .transDialog{
        width:100%;
        height:100%;
        position:fixed;
        top:0;
        left:0;
        background-color: rgba(0,0,0,0.2);
        z-index:1000;
    }

    /*详情*/
    .transDetailStyle{
        width:498px;
        background-color: #fff;
        position:absolute;
        top:110px;
        left:35%;
        border-radius:8px;
        box-sizing: border-box;
        font-size:14px;
        color:#333;
    }
    .basicInfo{
        width:100%;
        padding:24px 20px 0px 20px;
    }

    .basicInfo .el-row:first-child{
        margin-bottom:12px;
    }

    .basicInfo .el-row:first-child .el-col:nth-child(2){
        font-size:18px;
        color:#009C42;
    }

    .transDetailStyle .basicInfo .el-row{
        margin-bottom: 15px;
    }
    .transDetailStyle .basicInfo .el-col-20{
        color:#666;
        text-align: right;
    }
    .transRefund{
        color:#333;
        font-size:14px;
        text-align: center;
        max-height:115px;
        overflow: scroll;
    }
    .transRefund .el-row{
        padding-left:20px;
        padding-right:20px;
        background:rgba(243,243,243,1);
        height: 36px;
        line-height: 36px;
    }

    .transRefund .el-button{
        background: transparent;
    }

    /*退款弹出框*/

    .transRefundStyle{
        width:325px;
        border-radius:8px;
        padding:24px 33px 25px 32px;
        background-color: #fff;
        position:absolute;
        top:180px;
        left:40%;
        box-sizing: border-box;
    }
    .refundLabel{
        display:inline-block;
        width:100px;
        margin-left:10px;
        color:#333;
    }
    .refundValue{
        color:#CA1212;
        font-size:16px;
        font-weight: 600;
    }

    /*提交退款申请弹出框*/

    .submitRefundStyle{
        width:418px;
        border-radius:8px;
        font-size:14px;
        color:#333;
        background-color: #fff;
        position:absolute;
        top:150px;
        left:40%;
    }
    .imageContainer{
        width:100%;
        text-align: center;
        padding-top:20px;
        padding-bottom: 20px;
        border-bottom:1px solid #E5E5E5;
    }
    .msgImageSuc{
        width:68px;
        height:68px;
        background-image: url('../../../../assets/timer.png');
        background-size:100% 100%;
        margin:auto;
        margin-bottom: 15px;
    }
    .msgImageErr{
        width:68px;
        height:68px;
        background-image: url('../../../../assets/error.png');
        background-size:100% 100%;
        margin:auto;
        margin-bottom: 15px;
    }

    .refundDetailStyle{
        padding:20px;
        padding-bottom:0;
    }
    .refundDetailStyle .el-row{
        margin-bottom: 15px;
    }
    .refundDetailStyle .el-row div:last-child{
        text-align: right;
        color:#666;
    }

    .isCancel{
        width:325px;
        position: absolute;
        top:240px;
        left:40%;
        background-color: #fff;
        border-radius: 8px;
        padding:30px;
        padding-top:36px;
        color:#333;
        font-size:16px;
    }
    .cancelMsg{
        text-align: center;
        margin-bottom: 34px;
    }

</style>

<script>
    import * as Mixins from '../../../../jslib/mixin'
    import staticloadconfig from './staticloadconfig.json'
    import * as requestUrl from './requestUrl'
    import * as dict from './dict.js'

    export default{
        name:'TransCenterTransInfo',
        mixins:[Mixins.AuthMixin,Mixins.StaticDataLoad,Mixins.PropertyInit,Mixins.ShowWatcher],
        data(){
            let Number = (rule, value, callback) => {
                let reg=/^(([1-9]\d*)|0)$/;
                if(value!=''){
                    if (!reg.test(value)) {
                        callback(new Error('请输入数字格式'));
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            };
            let compare=(rule,value,callback)=>{
                let reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
                if(value>this.refundForm.Refundable){
                    callback(new Error('退款金额不得大于可退款金额'));
                }else if(!reg.test(value)){
                    callback(new Error('小数位最多两位'));
                }else{
                    callback();
                }
            };
            return {
                /*遮罩层是否显示*/
                tansDialogIsShow:false,
                /*交易详情展示框*/
                transDetailContainer:false,
                /*退款弹出框*/
                transRefundContainer:false,
                transSubmitRefundContainer:false,
                /*是否是退款交易详情,如果是退款交易详情不显示金额和消费金额*/
                isRefund:false,
                /*是否显示撤销交易弹出框*/
                isCancel:false,
                refundForm:{
                    /*订单号*/
                    orderId:'',
                    /*退款金额*/
                    amt:'',
                    /*原金额*/
                    originalAmt:0,
                    /*累计退款金额*/
                    srAmtSum:0,
                    /*可退款金额*/
                    Refundable:0
                },
                /*错误信息是否展示*/
                errorMsgStart:false,
                errorMsgEnd:false,
                /*错误信息内容*/
                errText:'',
                /*表格绑定的数据对象*/
                transTable:[],
                staticLoadConfig: staticloadconfig,
                /*搜索表单绑定对象*/
                form:{
                    oddNum:'',
                    oddDate:'',
                    oddType:'',
                    oddState:'',
                    oddBeginAmt:'',
                    oddEndAmt:''
                },
                show:false,
                /*静态数据对象*/
                staticData:{
                    /*交易类型下拉框*/
                    oddType:dict.transTypeOptions,
                    /*交易状态下拉框*/
                    oddState:dict.transStatOptions,
                    /*查询结果交易类型*/
                    transType:dict.transType,
                    /*查询结果交易状态*/
                    transStat:dict.transStat,
                    /*对应加号的状态*/
                    transCodePlus:dict.transCodePlus,
                    /*对应减号的状态*/
                    transCodeMinus:dict.transCodeMinus
                },
                headFormRules:{
                    oddNum:[
                        { min: 0, max: 32, message: ' 0 - 32 位数字', trigger: 'blur' },
                        {validator:Number , trigger:'blur'}
                    ]
                },
                refundFormRules:{
                    orderId:[
                        { required: true, message: '订单号不能为空',trigger:'blur'}
                    ],
                    amt:[
                        { required: true, message: '金额不能为空'},
                        { type: 'number', message: '金额必须为数字值'},
                        {validator:compare,trigger:'blur'}
                    ]
                },
                /*第几页*/
                currentPage:1,
                /*共几页*/
                sum:1,
                /*每页条数*/
                pageSize:10,
                /*是否正在查询*/
                isQuery:false,
                /*交易详情绑定的函数*/
                detailDate:{},
                /*交易详情里是否存在交易明细*/
                isExistOrderList:true,
                /*退货明细数据对象*/
                orderList:[],
                /*撤销操作与后台交互ID*/
                orderId:'',
                /*退款或者撤销返回页面*/
                submitContent:{
                    transType:'',
                    orderId:'',
                    transAmt:'',
                    transDate:''
                },
                /*退款或者撤销返回消息*/
                respMessage:'',
                msgImageClass:''
            }
        },
    methods:{
            /*交易类型转换*/
            transTypeFormat(a){
                let result="未知";
                this.staticData.transType.forEach(function (opt) {
                    if(opt.value == a){
                        result = opt.label
                    }
                })
                return result
            },
            /*交易状态码转换*/
            transStatFormat(a){
                let result="未知";
                this.staticData.transStat.forEach(function (opt) {
                    if(opt.value == a){
                        result = opt.label
                    }
                })
                return result
            },
            /*交易类型下拉框*/
            typeFormat(a){
                let result='未知';
                this.staticData.oddType.forEach(function(opt){
                    if(opt.value==a){
                        result=opt.label;
                    }
                });
                return result;
            },
            /*正负号判断*/
            sign(a){
                if(this.staticData.transCodePlus.includes(a)){
                    return '+';
                }else{
                    return '-';
                }
            },
            /*日期转换函数*/
            dateFormat(date){
                if(date!=undefined){
                    let year=date.getFullYear();
                    let month=date.getMonth()+1;
                    let day=date.getDate();
                    if(month<10){
                        month='0'+month;
                    }
                    if(day<10){
                        day='0'+day;
                    }
                    year=year.toString();
                    let time=year+month+day;
                    console.log(time,'time');
                    return time;
                }else{
                    return '';
                }
            },
            /*高级选项按钮绑定事件*/
            advanced(){
                this.show=true;
            },
            /*顶部搜索部分，收起按钮绑定事件*/
            close(){
                this.show=false;
                this.form.oddType='';
                this.form.oddState='';
                this.form.oddBeginAmt='';
                this.form.oddEndAmt='';
                /*错误信息是否展示*/
                this.errorMsgStart=false;
                this.errorMsgEnd=false;
                /*错误信息内容*/
                this.errText='';
            },
            /*数字大小校验*/
            compare(a,b,c){
                if(a!=''&&b!=''){
                    /*转换数字类型*/
                    a=Number(a);
                    b=Number(b);
                    if(a<b){
                        this.errText=c;
                        return true;
                    }else{
                        this.errText='';
                        return false;
                    }
                }
            },
            /*判断是否为数字且最多两位小数*/
            testNumber(a,b){
                let reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
                if(reg.test(a)){
                    b="";
                    return false;
                }else{
                    b="请输入数字格式且最多两位小数";
                    return true;
                }
            },
            /*交易金额最小值*/
            beginAmt(){
                let reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
                if(this.form.oddBeginAmt!=''){
                    if(reg.test(this.form.oddBeginAmt)){
                        this.errorMsgStart=false;
                        if(this.form.oddEndAmt!=''){
                            this.errorMsgEnd=this.testNumber(this.form.oddEndAmt,this.errText);
                        }else{
                            this.errText="";
                        }
                    }else{
                        this.errorMsgStart=true;
                        this.errText="请输入数字格式且最多两位小数";
                    }
                }else{
                    this.errorMsgStart=false;
                }
                /*当满足格式要求时，验证大小*/
                if(this.errorMsgEnd==false&&this.errorMsgStart==false&&this.form.oddEndAmt!=''&&this.form.oddBeginAmt!=''){
                    this.errorMsgStart=this.compare(this.form.oddEndAmt,this.form.oddBeginAmt,"最小金额小于最大金额");
                }
                if(this.form.oddBeginAmt==''&&this.form.oddEndAmt==''){
                    this.errorMsgStart=false;
                    this.errText="";
                }
            },
            /*交易金额最大值*/
            endAmt(){
                let reg=/^(([1-9]\d*)|0)(\.\d{1,2})?$/;
                if(this.form.oddEndAmt!=''){
                    if(reg.test(this.form.oddEndAmt)){
                        this.errorMsgEnd=false;
                        if(this.form.oddBeginAmt!=''){
                            this.errorMsgStart=this.testNumber(this.form.oddBeginAmt,this.errorMsgStart);
                        }else{
                            this.errText="";
                        }
                    }else{
                        this.errorMsgEnd=true;
                        this.errText="请输入数字格式且最多两位小数";
                    }
                }else{
                    this.errorMsgEnd=false;
                }
                /*当满足格式要求时，验证大小*/
                if(this.errorMsgEnd==false&&this.errorMsgStart==false&&this.form.oddEndAmt!=''&&this.form.oddBeginAmt!=''){
                    this.errorMsgEnd=this.compare(this.form.oddEndAmt,this.form.oddBeginAmt,"最大金额大于最小金额");
                }
                if(this.form.oddBeginAmt==''&&this.form.oddEndAmt==''){
                    this.errorMsgEnd=false;
                    this.errText="";
                }
            },
            /*补全两位小数*/
            complet(a){
                /*验证是否为整数*/
                let regInt=/^(([1-9]\d*)|0)$/;
                /*验证是否为一位小数*/
                let regDec=/^(([1-9]\d*)|0)(\.\d{1})$/;
                if(regInt.test(a)){
                    a=a+'.00';
                }else if(regDec.test(a)){
                    a=a+'0';
                }
                return a;
            },
            dataList(a,b){
                if(a.length>0){
                    let the=b;
                    a.forEach(function(option){
                        /*日期处理*/
                        option.transDate=option.transDate.slice(0,4)+'-'+option.transDate.slice(4,6)+'-'+option.transDate.slice(6,8);
                        option.transTime=option.transTime.slice(0,2)+':'+option.transTime.slice(2,4);
                        option.transDate=option.transDate+' '+option.transTime;
                        option.Id=option.orderId;
                        /*如果交易单号长度大于20位进行截取展示*/
                        if(option.orderId.length>20){
                            option.orderId=option.orderId.slice(0,12)+'...'+option.orderId.slice(option.orderId.length-6);
                        }
                        /*交易类型转换*/
                        option.transType=the.transTypeFormat(option.transType);
                        /*交易状态转换*/
                        option.transStat=the.transStatFormat(option.transStat);
                        /*金额处理*/
                        /*正负号判断*/
                        option.transAmt=the.sign(option.transCode)+option.transAmt;
                    });
                }
            },
            queryBtn(){
                this.currentPage=1;
                this.query();
            },
            /*查询按钮绑定事件*/
            query(){
                console.log(this.form,'this.form');
                let obj={};
                obj.pageNo=this.currentPage;
                obj.pageSize=this.pageSize;
                if(this.$refs['headForm']){
                    /*非首次跳转*/
                    let _this=this;
                    this.$refs['headForm'].validate((valid)=>{
                        if(valid){
                            /*如果表单验证成功*/
                            if(_this.errorMsgEnd==false&&_this.errorMsgStart==false){
                                /*禁用查询按钮避免重复查询*/
                                _this.isQuery=true;
                                /*并且金额输入也符合验证规则*/
                                obj.startDate=_this.dateFormat(_this.form.oddDate[0]);
                                obj.endDate=_this.dateFormat(_this.form.oddDate[1]);
                                obj.transType=_this.form.oddType;
                                obj.orderId=_this.form.oddNum;
                                obj.transStat=_this.form.oddState;
                                /*为元时补全两位小数位*/
                                /*obj.beginAmt=_this.complet(_this.form.oddBeginAmt);
                                obj.endAmt=_this.complet(_this.form.oddEndAmt);*/
                                if(_this.form.oddBeginAmt!=''){
                                    /*转换为分*/
                                    obj.beginAmt=(_this.form.oddBeginAmt*100).toString();
                                }else{
                                    obj.beginAmt='';
                                }
                                if(_this.form.oddEndAmt!=''){
                                    /*转换为分*/
                                    obj.endAmt=(_this.form.oddEndAmt*100).toString();
                                }else{
                                    obj.endAmt='';
                                }
                                let that=_this;
                                _this.$ajaxPromise(requestUrl.transList,obj,"POST",true).then(function(resp){
                                    console.log(resp,'resp');
                                    /*查询结束，接触禁用查询按钮*/
                                    that.isQuery=false;
                                    if(resp.respCode=="0000"){
                                        console.log("查询成功");
                                        /*清空数据表单*/
                                        /*that.form={
                                            oddNum:'',
                                            oddDate:'',
                                            oddType:'',
                                            oddState:'',
                                            oddBeginAmt:'',
                                            oddEndAmt:''
                                        };*/
                                        that.dataList(resp.transList,that);
                                        that.transTable=resp.transList;
                                        that.sum=Math.ceil(resp.totalCnt/that.pageSize);
                                        if(that.sum==0){
                                           that.sum=1;
                                        }
                                    }
                                }).catch(function(error){
                                    that.isQuery=false;
                                });
                            }
                        }
                    });
                }else{
                    /*首次跳转*/
                    obj.startDate="";
                    obj.endDate="";
                    obj.transType="";
                    obj.orderId="";
                    obj.transStat="";
                    obj.beginAmt="";
                    obj.endAmt="";
                    let _this=this;
                    this.$ajaxPromise(requestUrl.transList,obj,"POST",true).then(function(resp){
                        if(resp.respCode=="0000"){
                            _this.dataList(resp.transList,_this);
                            _this.transTable=resp.transList;
                            _this.sum=Math.ceil(resp.totalCnt/_this.pageSize);
                        }
                    }).catch(function(error){

                    })
                }
            },
            /*详情按钮绑定事件*/
            transDetail(a){
                let _this=this;
                this.$ajaxPromise(requestUrl.transDetail,{orderId:a},"POST",true).then(function(resp){
                    if(resp.respCode=="0000"){
                        /*订单详情获取成功*/
                        _this.tansDialogIsShow=true;
                        _this.transDetailContainer=true;
                        console.log(resp,'详情-resp');
                        _this.detailDate=resp;
                        /*判断是正负交易类型决定展示内容*/
                        if(_this.staticData.transCodePlus.includes(resp.transCode)){
                            /*为正交易时*/
                            _this.isRefund=false;
                        }else{
                            _this.isRefund=true;
                        }
                        let that=_this;
                        /*退款、撤销消费交易明细*/
                        if(resp.orderList.length>0){
                            resp.orderList.forEach(function(option){
                                /*订单状态码转换为汉字*/
                                option.transStat=that.transStatFormat(option.transStat);
                                if(option.transStat.length>4){
                                    option.transStat=option.transStat.slice(0,4)+'...';
                                }
                                option.state=option.transStat;
                                /*交易类型码转换为汉字*/
                                option.oprFlag=that.typeFormat(option.oprFlag);
                            });
                            /*赋值*/
                            _this.orderList=resp.orderList;
                            _this.isExistOrderList=true;
                        }else{
                            _this.orderList=[];
                            _this.isExistOrderList=false;
                        }

                    }else{
                    }
                }).catch(function(error){

                });
            },
            /*详情弹出框关闭按钮*/
            detailDialogClose(){
                this.tansDialogIsShow=false;
                this.transDetailContainer=false;
            },
            /*退款按钮点击*/
            doRefund(a,b,c,d){
                console.log(a,b,c,d);
                /*原订单ID*/
                this.refundForm.orderId=a;
                /*原订单金额*/
                this.refundForm.originalAmt= b.slice(1);
                /*累计退款金额*/
                this.refundForm.srAmtSum=c;
                /*可退款金额*/
                this.refundForm.Refundable=d;
                this.tansDialogIsShow=true;
                this.transRefundContainer=true;
            },
            /*退款提交页面提交按钮*/
            refundSubmit(){
                let _this=this;
                this.$refs['refundForm'].validate((valid)=>{
                    if(valid){
                        /*假如通过了表单验证*/
                        let obj={};
                        obj.origOrderId=_this.refundForm.orderId;
                        /*obj.returnAmt=_this.complet(_this.refundForm.amt);*/
                        /*转换为分*/
                        obj.returnAmt=(_this.refundForm.amt*100).toString();
                        let that=_this;
                        _this.$ajaxPromise(requestUrl.transRefund,obj,"POST",true).then(function(resp){
                            /*重置表单*/
                            that.$refs['refundForm'].resetFields();
                            /*退款填写表单隐藏*/
                            that.transRefundContainer=false;
                            /*提示信息弹出框显示*/
                            if(resp.respCode=="0000"){
                                console.log("退款已受理");
                                that.respMessage="退款已受理";
                                that.msgImageClass="msgImageSuc";
                                that.submitContent.orderId=resp.orderId;
                                that.submitContent.transAmt=resp.transAmt;
                                that.submitContent.transType=that.transTypeFormat(resp.transType);
                                /*日期处理*/
                                resp.transDate=resp.transDate.slice(0,4)+'-'+resp.transDate.slice(4,6)+'-'+resp.transDate.slice(6,8);
                                resp.transTime=resp.transTime.slice(0,2)+':'+resp.transTime.slice(2,4);
                                resp.transDate=resp.transDate+' '+resp.transTime;
                                that.submitContent.transDate=resp.transDate;
                                that.transSubmitRefundContainer=true;
                            }else{
                                console.log("退款失败");
                                that.respMessage="退款失败";
                                that.msgImageClass="msgImageErr";
                                that.submitContent.orderId='无';
                                that.submitContent.transAmt='无';
                                that.submitContent.transType='无';
                                that.submitContent.transDate='无';
                                that.transSubmitRefundContainer=true;
                            }
                            that.query();
                        }).catch(function(error){

                        });
                    }else{
                        /*未通过表单验证则什么也不做*/
                    }
                });
            },
            submitClose(){
                this.transSubmitRefundContainer=false;
                this.tansDialogIsShow=false;
            },
            /*退款提交页面返回按钮*/
            refundCancel(){
                /*对整个表单进行重置，将所有字段值重置为初始值并移除校验结果*/
                this.$refs['refundForm'].resetFields();
                this.tansDialogIsShow=false;
                this.transRefundContainer=false;
            },
            /*撤销按钮*/
            transCancel(a){
               this.tansDialogIsShow=true;
               this.isCancel=true;
               this.orderId=a;
            },
            /*取消撤销交易操作*/
            revoke(){
                this.tansDialogIsShow=false;
                this.isCancel=false;
            },
            /*确定撤销交易*/
            confirm(){
                let _this=this;
                this.$ajaxPromise(requestUrl.transRevoke,{orderId:this.orderId},"POST",true).then(function(resp){
                    _this.isCancel=false;
                    /*提示信息弹出框显示*/
                    console.log(resp,'resp');
                    if(resp.respCode=="0000"){
                        console.log("撤销申请成功");
                        _this.respMessage="撤销已受理";
                        _this.msgImageClass="msgImageSuc";
                        _this.submitContent.orderId=resp.orderId;
                        _this.submitContent.transAmt=resp.transAmt;
                        _this.submitContent.transType=_this.transTypeFormat(resp.transType);
                        /*日期处理*/
                        resp.transDate=resp.transDate.slice(0,4)+'-'+resp.transDate.slice(4,6)+'-'+resp.transDate.slice(6,8);
                        resp.transTime=resp.transTime.slice(0,2)+':'+resp.transTime.slice(2,4);
                        resp.transDate=resp.transDate+' '+resp.transTime;
                        _this.submitContent.transDate=resp.transDate;
                        _this.transSubmitRefundContainer=true;
                    }else{
                        console.log("撤销失败");
                        _this.respMessage="撤销失败";
                        _this.msgImageClass="msgImageErr";
                        _this.submitContent.orderId='无';
                        _this.submitContent.transAmt='无';
                        _this.submitContent.transType='无';
                        _this.submitContent.transDate='无';
                        _this.transSubmitRefundContainer=true;
                    }
                    _this.query();
                }).catch(function(error){

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
            }
        },
        created(){
            this.query();
        }
    }
</script>
