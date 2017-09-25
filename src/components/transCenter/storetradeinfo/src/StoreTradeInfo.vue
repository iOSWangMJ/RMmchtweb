<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <!-- <h4>商户基本信息</h4> -->
    <div class="custom_elementui page" slot="content">
        <div class="page-title">
            门店交易信息
        </div>
        <div class="page-content">
            <div class="info-body">
                <el-form :model="formData" :inline='true'>
                    <el-row>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="门店商户：" label-width="84px">
                                <el-select v-model="formData.subMchtId" filterable clearable placeholder="全部">
                                    <el-option v-for="item in commerceData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset='1'>
                            <el-form-item label="交易日期：" label-width="84px">
                                <el-date-picker style="width:290px;" v-model="formData.date" type="daterange" placeholder="选择日期范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="交易单号：" label-width="84px">
                                <el-input v-model="formData.orderId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset='1'>
                            <div class="" v-show="advancedShow">
                                <a @click="advancedShow =!advancedShow"><span class ='height-select'>高级选项</span></a>
                            </div>
                            <el-form-item v-show="!advancedShow" label="交易金额：" label-width="84px">
                                <el-input class="moneyInput" v-model="formData.beginAmt" @blur="beginAmt1" placeholder=""><template slot="append">元</template></el-input>

                                <span class="input-link">--</span>
                                <el-input class="moneyInput" v-model="formData.endAmt" @blur="endAmt1" placeholder=""><template slot="append">元</template></el-input>
                            </el-form-item>
                            <div class="errMessage" v-if="errorMsgStart||errorMsgEnd">{{errText}}</div>
                        </el-col>
                    </el-row>

                    <!-- <transition name='fade' enter-active-class='animated fadeInDown'> -->
                    <div class="" v-show="!advancedShow">
                        <el-row>
                            <el-col :span="8" :offset='3'>
                                <el-form-item label="交易状态：" label-width="84px">
                                    <el-select v-model="formData.transStat" filterable clearable placeholder="全部">
                                        <el-option v-for="item in transStatOptions" :key="item.key" :label="item.value" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" :offset='1'>
                                <el-form-item label="交易类型：" label-width="84px">
                                    <el-select v-model="formData.transType" clearable placeholder="全部">
                                        <el-option v-for="item in transTypeOptions" :key="item.key" :label="item.value" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <div style="line-height:40px;">
                                    <a @click="packUp"><span>收起</span></a>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- </transition> -->
                </el-form>
                <div class="info-footer">
                    <el-button class='button-background' @click="handleQuery(1)">查询</el-button>
                </div>
                <el-table border v-loading="status.isQuerying" :data="tableData">
                    <el-table-column label="交易时间" width="150px">
                        <template scope="scope">
                                {{scope.row.transDate|dateFilter}} {{scope.row.transTime|timerFilter}}
                            </template>
                    </el-table-column>
                    <el-table-column label="交易单号" width="180px">
                        <template scope="scope">
                                <el-tooltip  :content="scope.row.orderId" placement="top" >
                                    <div class="">
                                        {{scope.row.orderId | longStringFilter}}
                                    </div>
                                </el-tooltip>
                            </template>
                    </el-table-column>
                    <el-table-column label="门店商号" width="150px">
                        <template scope="scope">
                            {{scope.row.subMchtId}}
                                <!-- <el-tooltip  :content="scope.row.subMchtId" placement="top">
                                    <div class="">
                                        {{scope.row.subMchtId | longStringFilter}}
                                    </div>
                                </el-tooltip> -->
                            </template>

                    </el-table-column>
                    <el-table-column prop="subMchtSimpleName" label="商户简称"></el-table-column>
                    <el-table-column label="交易类型">
                        <template scope="scope">
                                {{scope.row.transType|dictFormat(dict,"transType")}}
                                <!-- {{scope.row.transType}} -->

                            </template>
                    </el-table-column>
                    <el-table-column label="交易状态" :show-overflow-tooltip='true'>
                        <template scope="scope">
                                {{scope.row.transStat|dictFormat(dict,"transStat")}}
                            </template>
                    </el-table-column>
                    <el-table-column label="金额">
                        <template scope="scope">
                                <div class="money-font">
                                    {{scope.row.transCode|transCodeFormat}}
                                    {{scope.row.transAmt}}
                                </div>
                            </template>

                    </el-table-column>
                    <el-table-column label="操作" width="65px">
                        <template scope="scope">
                           <el-button  @click="handleDetail(scope.row.subMchtId,scope.row.orderId)" type="text" size="small">详情</el-button>
                       </template>
                    </el-table-column>
                </el-table>
                <simple-pagination @currentChange="pageChange" @update:currentPage='val =>currentPage= val' :currentPage.sync='pagination.currentPage' :total="pagination.total"></simple-pagination>
            </div>
        </div>



        <el-dialog top="20%" custom-class="custom-dialog-store-trade-detail" :modal-append-to-body="false" :show-close='false' :visible.sync="detailShow">
            <!-- <el-card> -->
            <div class="detail-body">

                <div class="data-info">
                    <el-row>
                        <el-col :span="6">门店商户号</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.subMchtId}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">门店商户简称</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.subMchtSimpleName}}</span></el-col>
                    </el-row>
                    <el-row v-show="transCodeStat">
                        <el-col :span="6">金额</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span class="money">+{{detailData.amt}}</span></el-col>
                    </el-row>
                    <el-row v-show="transCodeStat">
                        <el-col :span="6">消费金额</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span>+{{detailData.transAmt}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">退款金额</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span>-{{detailData.refundAmt?detailData.refundAmt:0}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">交易单号</el-col>
                        <el-col :span="14" :offset='5' class="descibe"><span>{{detailData.orderId}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">支付方式</el-col>
                        <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.payType}}</span></el-col>
                    </el-row>
                </div>

                <div class="orderList">
                    <el-row v-for="order in detailData.orderList" :key="order.orderId">
                        <el-col :span="3">{{order.oprFlag|dictFormat(dict,'transTypeOptions')}}</el-col>
                        <el-col :span="3">{{order.transAmt}}</el-col>
                        <el-col :span="6" class="ellipsis">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" style="font-size:14px;">{{order.orderId}}</div>
                                <a style="color:#333;">{{order.orderId | longStringFilter}}</a>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="5" class="ellipsis">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" style="font-size:14px;">{{order.transStat |dictFormat(dict,'transStat')}}</div>
                                <a style="color:#333;">{{order.transStat |dictFormat(dict,'transStat')}}</a>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="7">{{order.transDate|dateFilter}} {{order.transTime|timerFilter}}</el-col>
                    </el-row>
                </div>
            </div>
            <div class="info-footer">
                <el-button class="button-background" @click='detailShow = false'> 返 回 </el-button>
            </div>

            <!-- </el-card> -->
        </el-dialog>

    </div>
</function-page>
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dict from './dict.js'
import {
    format
} from '../../../../jslib/utils/DateUtil.js'


import SimplePagination from '../../../lib/simplepagination'

import logo from '../../../../assets/erweima-@3x.png'
export default {
    name: "StoreTradeInfo",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],
    components: {
        SimplePagination
    },
    data: () => ({

        /**静态数据对象*/
        staticData: {},
        staticLoadConfig: staticloadconfig,
        dict: dict,
        status: {
            isQuerying: false
        },
        // select 的商户号 选择
        commerceData: [],
        transTypeOptions: dict.transTypeOptions,
        transStatOptions: dict.transStatOptions,
        // commerceStat:dict.mchtStat,

        pagination: {
            currentPage: 1,
            total: 1,
            pageSize: 10
        },


        formData: {
            subMchtId: '',
            date: '',
            orderId: '',
            transStat: '',
            beginAmt: '',
            endAmt: '',
            transType: ''
        },
        errorMsgStart: '',
        errorMsgEnd: '',
        errText: '',
        advancedShow: true,

        tableData: [],
        detailShow: false,
        detailData: {
            orderList: []
        }

    }),
    computed: {
        transCodeStat() {
            let flagPlus = dict.transCodePlus.find((n) => n == this.detailData.transCode)
            if (flagPlus) {
                return true
            }
            // flagPlus && return "+"
            let flagMinus = dict.transCodeMinus.find((n) => n == this.detailData.transCode)
            // flagMinus && return "-"
            if (flagMinus) {
                return false
            }
            // console.error('dict data has error or miss transCodes ');
            return
        }
    },
    filters: {
        transCodeFormat(val) {
            if (!val) {
                return
            }
            let flagPlus = dict.transCodePlus.find((n) => n === val)
            if (flagPlus) {
                return "+"
            }
            // flagPlus && return "+"
            let flagMinus = dict.transCodeMinus.find((n) => n === val)
            // flagMinus && return "-"
            if (flagMinus) {
                return "-"
            }
            console.error('dict data has error or miss transCodes ', val);
            return
        }
    },
    methods: {
        /*数字大小校验*/
        compare(a, b, c) {
            if (a != '' && b != '') {
                /*转换数字类型*/
                a = Number(a);
                b = Number(b);
                if (a < b) {
                    this.errText = c;
                    return true;
                } else {
                    return false;
                }
            }
        },
        /*判断是否为数字且最多两位小数*/
        testNumber(a, b) {
            let reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
            if(reg.test(a)){
                b="";
                return false;
            }else{
                b="请输入数字格式且最多两位小数";
                return true;
            }
        },
        /*交易金额最小值*/
        beginAmt1() {
            let reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;

            if (this.formData.beginAmt == '' && this.formData.endAmt == '') {
                this.errorMsgStart = false;
                this.errText = "";
                return
            }
            if (this.formData.beginAmt != '') {
                if (reg.test(this.formData.beginAmt)) {
                    this.errorMsgStart = false;
                    if (this.formData.endAmt != '') {
                        this.testNumber(this.formData.endAmt, this.errText);
                    } else {
                        this.errText = "";
                    }
                } else {
                    this.errorMsgStart = true;
                    this.errText = "请输入数字格式且最多两位小数";
                }
            }else{
                this.errorMsgStart=false;
                this.errText="";
            }
            if (this.errText != "请输入数字格式且最多两位小数" && this.formData.endAmt != '' && this.formData.beginAmt != '') {
                this.errorMsgStart = this.compare(this.formData.endAmt, this.formData.beginAmt, "最小金额小于最大金额");
            }
        },
        /*交易金额最大值*/
        endAmt1() {
            let reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
            if (this.formData.endAmt == '' && this.formData.beginAmt == '') {
                this.errorMsgEnd = false;
                this.errText = "";
                return
            }
            if (this.formData.endAmt != '') {
                if (reg.test(this.formData.endAmt)) {
                    this.errorMsgEnd = false;
                    if (this.formData.beginAmt != '') {
                        this.testNumber(this.formData.beginAmt, this.errorMsgStart);
                    } else {
                        this.errText = "";
                    }
                } else {
                    this.errorMsgEnd = true;
                    this.errText = "请输入数字格式且最多两位小数";
                }
            }else{
                this.errorMsgStart=false;
                this.errText="";
            }
            if (this.errText != "请输入数字格式且最多两位小数" && this.formData.endAmt != '' && this.formData.beginAmt != '') {
                this.errorMsgEnd = this.compare(this.formData.endAmt, this.formData.beginAmt, "最大金额大于最小金额");
            }
        },

        handleQuery(currentPage) {
            if (currentPage) {
                this.pagination.currentPage = currentPage
            }
            console.log(this.formData);
            let _this = this
            let data = this.$dataClone(this.formData)
            console.log(data.date);
            if (data.date.length > 0 && this.formData.date[0] && this.formData.date[1]) {
                // delete data.date
                data.startDate = format(this.formData.date[0], 'yyyyMMdd')
                data.endDate = format(this.formData.date[1], 'yyyyMMdd')
            }
            if (data.subMchtId) {
                data['subMchtIdList'] = [data.subMchtId]
            }
            if (data.beginAmt) {
                data.beginAmt = data.beginAmt * 100
            }
            if (data.endAmt) {
                data.endAmt = data.endAmt * 100
            }
            data.pageNo = this.pagination.currentPage
            data.pageSize = this.pagination.pageSize
            // let queryData = this.$getCommonRequest(this.pagination.currentPage, this.pagination.pageSize, data)

            this.$ajaxPromise(requestUrl.query, data, 'POST', true).then((res) => {

                if (res.respCode === '0000') {
                    console.log(res);
                    this.pagination.total = res.totalCnt
                    this.tableData = res.transList
                }
            })
        },

        handleQueryCommerce() {
            this.$ajaxPromise(requestUrl.commercesQuery, {}, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.commerceData = select_commcerce_trants(res.subMchtList)
                    console.log(this.commerceData);
                }
            })
        },
        pageChange(currentPage) {
            console.log(currentPage);
            this.handleQuery()
        },
        packUp() {
            this.formData.transStat = ""
            this.formData.beginAmt = ''
            this.formData.endAmt = ''
            this.formData.transType = ''
            this.advancedShow = !this.advancedShow
            this.errorMsgStart = false
            this.errorMsgEnd = false
            /*错误信息内容*/
            this.errText = ''
        },

        handleDetail(subMchtId, orderId) {
            console.log('----------------', subMchtId);
            this.$ajaxPromise(requestUrl.detail, {
                subMchtId,
                orderId
            }, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    console.log(res);
                    this.detailData = res
                    this.detailShow = true
                }
            })
        }

    },
    created() {
        //do something after creating vue instance
        this.handleQueryCommerce()
        this.handleQuery()
    }
}

function select_commcerce_trants(list) {
    let options = []
    list.forEach((data) => {
        let option = {}
        option.label = data.subMchtId + '   ' + data.subMchtSimpleName
        option.value = data.subMchtId
        options.push(option)
    })
    return options
}
</script>
<style lang="scss" scoped>
.page {
    // margin: 10px 30px 100px;
    background: #eff4f7;
    padding-left: 20px;
    height: 100%;
    position: relative;
    font-size: 14px;
    // padding-bottom: 200px;
    padding-top: 20px;
    background: white;
    .page-title {
        background: url('../../../../assets/mendianjiaoyi3@2x.png') no-repeat;
        background-size: 40px 40px;
    }
    .page-content {
        padding-bottom: 150px;
        .info-body {
            margin-bottom: 10px;
            padding-right: 20px;
            .el-select {
                width: 200px;
            }
            .el-input {
                width: 200px;
            }
            .moneyInput {
                width: 128px;
            }
            .input-link {
                width: 25px;
                text-align: center;
                display: inline-block;
            }
            .height-select {
                line-height: 40px;
            }
            .el-table {
                margin-top: 50px;
                .el-button {
                    color: #009C42;
                }
            }
        }
    }
    .el-dialog {
        .detail-body {
            .data-info {
                .el-row {
                    padding: 4px;
                    .descibe {
                        text-align: right;
                        span {
                            color: #808080;
                        }
                        .money {
                            color: #1094F5;
                            font-size: 18px;
                        }
                    }

                }
            }
            .orderList {
                margin-top: 15px;
                .el-row {
                    padding: 8px 0;
                    // border-top: 1px solid #ccc;
                    background-color: #F3F3F3;
                    .el-col {
                        padding-left: 15px;
                    }
                }
            }

        }
    }

    .money-font {
        color: #1094F5;
    }

    .errMessage {
        margin-top: -20px;
        margin-left: 88px;
        color: #ff4949;
        font-size: 12px;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
}
</style>
