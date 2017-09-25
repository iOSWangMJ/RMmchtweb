<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <!-- <h4>商户基本信息</h4> -->
    <div class="custom_elementui page" slot="content">
        <!-- <div class="info-title">手续费查询</div> -->
        <div class="info-body">
            <full-calendar class="test-fc" lang="zh" :firstDay="firstDay" :events="fcEvents" @downloadClick='downloadClick' @changeMonth="changeMonth" @dayClick="dayClick">
                <template slot='fc-header-left'>
                    <div class="page-title">
                        账单查询
                    </div>
                </template>

                <template slot="fc-header-right">
                    <div class=""  style="text-align:right;">
                        <el-button size="small" class="button-background" style='margin-right:25px;' @click='monthBillDownload' >月账单下载</el-button>
                    </div>
                </template>
                <!-- <template slot="fc-body-card" scope="p">
                         <p>说明：数字代表手续费/交易金额,单位为元 </p>
              </template> -->
            </full-calendar>
        </div>
        <el-dialog @close="resetPagination" :visible.sync="detailShow" custom-class="custom-dialog-settlment-detail" :modal-append-to-body="false" :show-close='false'>
            <!--
            <div class="title">
                {{detailTitle}}
            </div> -->
            <div>
                <div class="statis-info">
                    <el-row class="describe">
                        <el-col :span="5">{{detailData.totalStlmAmt}}</el-col>
                        <el-col :span="5">{{detailData.totalTransAmt}}</el-col>
                        <el-col :span="4">{{detailData.totalFeeReduct}}</el-col>
                        <el-col :span="5">{{detailData.totalStlmCnt}}</el-col>
                        <el-col :span="5">{{detailData.totalStlmFee}}</el-col>
                    </el-row>
                    <el-row class="item">
                        <el-col :span="5">清算金额</el-col>
                        <el-col :span="5">清算本金</el-col>
                        <el-col :span="4">手续费减免</el-col>
                        <el-col :span="5">交易笔数</el-col>
                        <el-col :span="5">手续费用</el-col>
                    </el-row>

                    <!-- <el-row>
                        <el-col :span="9"><span class="item">清算金额:</span><span class="describe">{{detailData.totalStlmAmt}}</span></el-col>
                        <el-col :span="9"><span class="item">清算本金:</span><span class="describe">{{detailData.totalTransAmt}}</span></el-col>
                        <el-col :span="6"><span class="item">手续费减免:</span><span class="describe">{{detailData.totalFeeReduct}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9"><span class="item">交易笔数:</span><span class="describe">{{detailData.totalStlmCnt}}</span></el-col>
                        <el-col :span="9"><span class="item">手续费用:</span><span class="describe">{{detailData.totalStlmFee}}</span></el-col>
                    </el-row> -->
                </div>
                <el-table :data="tableData" row-class-name="table_row">
                    <el-table-column label="交易时间">
                        <template scope="scope">
                                {{scope.row.transTime|timerFilter}}
                            </template>
                    </el-table-column>
                    <el-table-column min-width="100px" prop="orderId" label="交易单号">
                        <template scope="scope">
                                <el-tooltip  :content="scope.row.orderId" placement="top" >
                                    <div class="">
                                        {{scope.row.orderId|longStringFilter}}
                                    </div>
                                </el-tooltip>
                            </template>
                    </el-table-column>
                    <el-table-column min-width="75px" prop="transType" label="交易类型">
                        <template scope="scope">
                                {{scope.row.transType| dictFormat(dict,'transType')}}
                            </template>
                    </el-table-column>
                    <el-table-column min-width="75px" prop="stlmAmt" label="清算金额"></el-table-column>
                    <el-table-column min-width="75px" prop="transAmt" label="交易本金"></el-table-column>
                    <el-table-column min-width="75px" prop="stlmFee" label="手续费"></el-table-column>
                    <el-table-column min-width="80px" prop="feeReduct" label="手续费减免"></el-table-column>
                </el-table>
                <simple-pagination :pageSize ='pagination.pageSize' @currentChange="pageChange" @update:currentPage='val =>currentPage= val' :currentPage.sync='pagination.currentPage' :total="pagination.total"></simple-pagination>
                <div class="info-footer">
                    <el-button class="button-background" @click='detailShow = false'> 返 回 </el-button>
                </div>

            </div>
        </el-dialog>
    </div>
</function-page>
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dict from './dict.js'

import SimplePagination from '../../../lib/simplepagination'
import FullCalendar from '../../../lib/vue-fullcalendar'
export default {
    name: "Settlement",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],

    components: {
        FullCalendar,
        SimplePagination
    },
    data: () => ({
        //FullCalendar 设置第一列设置周几 0-周日
        firstDay: 0,
        /**静态数据对象*/
        staticData: {},
        staticLoadConfig: staticloadconfig,
        dict: dict,

        detailShow: false,
        detailTitle: '',
        detailData: {
            totalStlmAmt: "",
            totalStlmCnt: "",
            totalTransAmt: "",
            totalStlmFee: "",
            totalFeeReduct: "",
            totalCnt: ""
        },
        selectDay: '',
        selectMonth: '',
        tableData: [],
        pagination: {
            currentPage: 1,
            total: 1,
            pageSize: 2
        },
        urlParams:'',

        fcEvents: []


    }),
    methods: {
        handleQuery(start, end) {
            start = start.replace(/-/g, '')
            end = end.replace(/-/g, '')
            console.log(start, end);
            let data = {
                beginDate: start,
                endDate: end
            }
            this.$ajaxPromise(requestUrl.query, data, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    console.log(res);
                    this.fcEvents = []
                    for (let data of res.stlmList) {
                        let obj = {}
                        obj.date = dateTrans(data.stlmDate)
                        obj.total = data.stlmAmt
                        this.fcEvents.push(obj)
                    }
                    console.log(this.fcEvents);
                    // this.commerceData = res.data

                }
            })
        },
        pageChange(currentPage) {
            console.log(currentPage);
            this.handleTableData(currentPage,this.selectDay)
        },

        handleDetail(pageNo,pageSize, stlmDate) {
            this.$ajaxPromise(requestUrl.detailQuery, {
                pageNo,
                pageSize,
                stlmDate
            }, "POST", true).then((res) => {
                if (res.respCode === '0000') {
                    console.log(res);
                    this.detailData = res
                    this.tableData = res.stlmList
                    this.pagination.total = res.totalCnt
                }
                // this.commerceData = res.data

            })
        },

        handleTableData(pageNo, date) {
            this.$ajaxPromise(requestUrl.tableQuery, {
                pageNo,
                pageSize: this.pagination.pageSize,
                stlmDate: date
            }, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.tableData = res.stlmList
                    this.pagination.total = res.totalCnt
                }
            })
        },


        changeMonth(start, end, current) {
            // console.log('changeMonth', start, end, current)
            this.selectMonth = current.replace(/-/g, '').substr(0, 6)
            this.handleQuery(start, end)
        },

        dayClick(day, jsEvent) {
            let total = day.total
            if (!total || total == '' || total == '0.00') {
                console.log(day);
                return
            }
            this.detailShow = !this.detailShow
            this.selectDay = dateFormat(day.date, 3)
            this.detailTitle = dateFormat(day.date, 1)
            console.log('dayClick', day)
            this.handleDetail(1, this.pagination.pageSize,this.selectDay)
        },

        downloadClick(day, jsEvent) {
            console.log('downloadClick', day);
            let date = dateFormat(day, 3)
            console.log(date);
            let urlParams  =  this.$urlParams({concreteDay:date})
            urlParams= requestUrl.daySettlementDownload+"?"+ urlParams
            window.location.href = urlParams
        },

        monthBillDownload() {
            console.log(this.selectMonth);
            // this.$ajaxPromise(requestUrl.daySettlementDownload, {
            //     stlmMonth: this.selectMonth
            // }, 'GET', true)
            let urlParams  =  this.$urlParams({stlmMonth:this.selectMonth})
            urlParams= requestUrl.monthSettlementDownload+"?"+ urlParams
            window.location.href = urlParams
        },
        // dialog close reset paginantion
        resetPagination() {
            this.pagination = {
                currentPage: 1,
                total: 1
            }

        }

    },
    created() {

    }
}


function dateFormat(date, type) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month > 9 ? month : '0' + month
    var day = date.getDate()
    day = day > 9 ? day : '0' + day
    let dateString = ''
    switch (type) {
        case 1:
            dateString = year + '年' + month + '月' + day + '日'
            break
        case 2:
            dateString = year + '-' + month + '-' + day
            break
        case 3:
            dateString = year + month + day
    }
    return dateString
}

// 后台时间数据 转换成前端时间对应格式
// 建议使用moment.js
function dateTrans(dateString) {
    var year = dateString.substr(0, 4)
    var month = parseInt(dateString.substr(4, 2))
    var day = parseInt(dateString.substr(6, 2))
    return year + '-' + month + '-' + day
}
</script>
<style lang="scss" scoped>
.page {
    background: #eff4f7;
    height: 100%;
    position: relative;
    font-size: 14px;
    padding-bottom: 50px;
    padding-top: 20px;
    background: white;
    // margin:10px 30px 100px 30px;

    .page-title {
        background: url('../../../../assets/Sign3-@2x.png') no-repeat;
        background-size: 40px 40px;
        padding-bottom: 0;
        margin-left: -40px;
    }
    .info-title {
        color: #E40001;
        font-size: 18px;
        padding: 20px 0;
        border-bottom: 1px solid #ccc;
    }
    .info-body {
        margin-bottom: 10px;
    }
    .el-dialog {
        .title {
            color: #E40001;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .statis-info {
            font-size: 14px;
            // padding-left: 35px;
            .describe {
                border-top: 1px solid #E5E5E5;
                border-bottom: 1px solid #E5E5E5;
                font-size: 18px;
                color: #009C42;
                text-align: center;
                padding: 15px 0;
            }

            .item {
                text-align: center;
                font-size: 12px;
                color: #333333;
                padding: 15px 0;
            }
        }
        .el-table {
            margin-top: 18px;
        }
        .info-footer {
            padding-top: 30px;

        }

        // .table_row {
        //     padding: 5px 0;
        // }
    }
}
</style>
