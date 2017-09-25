<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <div id="contract" slot="content" class="custom_elementui page">
        <!-- <transition name='fade' enter-active-class='animated fadeInRight' mode='out-in'> -->
        <!--签约产品的详细信息  -->

        <div class="sign" v-show="isSignDetail" v-cloak>
            <div class="sign-title">
                <img :src="contractData.showUrl+prodpic" alt=""> {{prodData.prodName}}
                <div class="sign-describe">
                    <span>{{prodData.prodDesc}}</span>
                </div>
            </div>

            <div class="sign-detail">
                <div class="info-title">费率信息</div>
                <!-- <el-card> -->
                <el-row v-for="(rate,index) in prodData.dataList" :key="index">
                    <el-row>
                        <el-col :span="3">{{rate.acctTypeCode |dictFormat(dict,'acctTypeCode')}}：</el-col>
                        <el-col :span="14"><span @click='rateDialog(rate.rateId)'>{{rate.rateName}}</span>
                            <!-- <a @click="show">
                                    <img :class='{"img-rotate":isShow}' :src="arrowImg" alt="">
                                </a> -->
                        </el-col>
                        </el-col>
                    </el-row>
                </el-row>
            </div>
            <div class="info-footer sign-footer">
                <el-button  class="button-background" @click='isSignDetail = false'> 返 回 </el-button>
            </div>
        </div>


        <div class="" v-show="!isSignDetail" v-cloak>
            <div class="page-title">
                签约信息
            </div>
            <div class="page-content">
                <div class="info-title">商户结算信息</div>
                <!-- <el-card> -->
                <div class="info-body">
                    <el-row>
                        <el-col :span="3" class="">结算方式：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlType | dictFormat(dict,'setlType')}}</span></el-col>
                        <el-col :span="3">结算标志：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlSymbol|dictFormat(dict,'setlSymbol')}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">结算周期：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlCycle|dictFormat(dict,'setlCycle')}}</span></el-col>
                        <el-col :span="3">结算日：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.specSetlDay ?contractData.specSetlDay:'-'}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">结算行：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlAcctInstitute?contractData.setlAcctInstitute:'-'}}</span></el-col>
                        <el-col :span="3">账户姓名：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlAcctName?contractData.setlAcctName:'-'}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">结算账号：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.setlAcctNo?contractData.setlAcctNo:'-'}}</span></el-col>
                    </el-row>

                </div>
                <!-- </el-card> -->

                <div class="info-title">商户合同信息</div>
                <!-- <el-card> -->
                <div class="info-body">
                    <el-row>
                        <el-col :span="3">生效日期：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.startDate|dateFilter}}</span></el-col>
                        <el-col :span="3">合同期限：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.conTerm|dictFormat(dict,'conTerm')}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">延期标志：</el-col>
                        <el-col :span="7" class="col-border"><span>{{contractData.extendFlag|dictFormat(dict,'extendFlag')}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">签约产品：</el-col>
                    </el-row>
                    <el-row class="sign-product" :gutter="10">
                        <el-col :span="3" :offset='1' v-for="(item,index) in contractData.prodList" :key="index">
                            <a @click='prodDetail(item.prodId,contractData.conId,item.logoFileId)'>
                            <img :src="contractData.showUrl+item.logoFileId" alt="" />
                            <div>{{item.prodName}}</div>
                        </a>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>



<!-- :modal-append-to-body="false" -->
        <el-dialog  v-cloak title="" :visible.sync="rateShow"  custom-class="custom-dialog-contract-sign"  :show-close="false">
            <!-- <div class="rate-table" v-show="isShow"> -->
            <el-table :data="rateData" >
                <el-table-column property="sectionMin" label="分段最小值"></el-table-column>
                <el-table-column property="sectionMax" label="分段最大值"></el-table-column>
                <el-table-column label="收费类型">
                    <template scope="scope">
                                {{scope.row.chargeType |dictFormat(dict,'chargeType')}}
                    </template>
                </el-table-column>
                <el-table-column property="chargeValue" width="80px" label="收费值"></el-table-column>
                <el-table-column property="feeMin" label="最小手续费"></el-table-column>
                <el-table-column property="feeMax" label="最大手续费"></el-table-column>
            </el-table>
            <div class="info-footer">
                <el-button  class="button-background" @click='rateShow = false'> 返 回 </el-button>
            </div>
            <!-- </div> -->
        </el-dialog>
    </div>
    <!-- <el-dialog :visible.sync="isSignDetail" top="30%" custom-class="custom-dialog-contract-sign" @close="dialogClose" :modal-append-to-body="false" :show-close="false">
            <div class="sign-title">
                {{prodData.prodName}}
            </div>
            <div class="sign-detail">
                <div class="sign-describe">
                    <span>{{prodData.prodDesc}}</span>
                </div>
                <sign-temp v-for="(rate,index) in prodData.dataList" ref="index" :key="index" :signData='rate' :url='rateURL'></sign-temp>
                <div class="info-footer">
                    <el-row type="flex" justify="center">
                        <el-col>
                            <el-button type="danger" class="button-background" @click='isSignDetail = false'> 返 回 </el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog> -->
    </div>
</function-page>
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dictContract from './dict.js'

import imgUrl from '../../../../assets/erweima-@3x.png'
import SignTemp from './lib/SignTemp.vue'
export default {
    name: "Contract",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],

    components: {
        SignTemp
    },
    data: () => ({

        prodData: {
            prodName: '',
            prodDesc: '',
            dataList: []
        },
        prodpic:'',

        contractData: {
            showUrl: "",
            mchtId: "",
            conId: "",
            setlType: "",
            setlCycle: "",
            setlSymbol: "",
            specSetlDay: "",
            setlAcctType: "",
            setlAcctInstitute: "",
            setlAcctName: "",
            extendFlag: "",
            setlAcctNo: "",
            mchtAmrPhone: "",
            mchtMngNo: "",
            startDate: "",
            endData: "",
            conTerm: "",
            dataList: []
        },

        /**静态数据对象*/
        staticData: {},
        staticLoadConfig: staticloadconfig,
        dict: dictContract,

        imgUrl: imgUrl,
        isSignDetail: false,
        rateShow: false,
        rateData: [],
        rateURL: requestUrl.rateQuery

    }),
    methods: {
        rateDialog(rateId) {
            this.$ajaxPromise(requestUrl.rateQuery, {rateId}, "POST", true).then((res) => {
                console.log('===============');
                if (res.respCode === "0000") {
                    this.rateData = res.dataList
                    this.rateShow = true
                }
            })
        },

        //签约的信息
        handleQuery() {
            this.$ajaxPromise(requestUrl.query, {}, "POST", true).then((res) => {
                if (res.respCode === "0000") {
                    console.log(res);
                    this.contractData = res
                }
            })
        },

        // 签约产品的详细信息
        prodDetail(prodId, conId,logoFileId) {
            this.$ajaxPromise(requestUrl.prodQuery, {prodId,contId:conId}, "POST", true).then((res) => {
                if (res.respCode === "0000") {
                    this.prodpic = logoFileId
                    this.prodData = res
                    this.isSignDetail = true
                }
            })
        },

        dialogClose() {
            var sign_temp_vues = this.$refs.index
            for (var i = 0; i < sign_temp_vues.length; i++) {
                console.log(sign_temp_vues[i].isShow);
                if (sign_temp_vues[i].isShow) {
                    sign_temp_vues[i].isShow = false
                }

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
    background: #eff4f7;
    height: 100%;
    position: relative;
    font-size: 14px;
    .page-title {
        background: url('../../../../assets/Sign3-@2x.png') no-repeat;
        background-size: 40px 40px;
    }

    .page-content {
        background: white;
        padding-bottom: 17px;
        .info-body {
            padding-left: 53px;
            border-bottom: 1px solid #EAF0F4;
            padding-bottom: 20px;
            &:last-child{
                border-bottom: none;
            }
            .el-row {
                .el-col {
                    padding: 8px 0;
                    color: #333;
                }
                .col-border {
                    color: #666;
                }
            }
        }

        .sign-product {
            .el-col {
                padding: 0 0 30px;
                text-align: center;
                a {
                    height: 60px;
                    display: inline-block;
                    img {
                        height: 35px;
                        width: auto;
                        -webkit-transition: height 0.2s;
                        transition: height 0.2s;
                        &:hover {
                            height: 40px;
                            // background-color: #009c42;
                        }
                    }
                }

                span {
                    margin-left: 10px;
                    font-size: 16px;
                    min-width: 84px;
                }
            }
        }
    }
    .sign {
        background-color: white;
        padding-bottom: 210px;
        .sign-title {
            font-size: 18px;
            font-weight: bold;
            padding: 20px 0 20px 20px;
            border-bottom: 1px #EAF0F4 solid;
            line-height: 40px;
            img {
                width: 40px;
                height: 40px;
                margin-right: 5px;
                // background-color: #009c42;
            }
            .sign-describe {
                padding-left: 50px;
                padding-top: 15px;
                font-size: 16px;
                font-weight: normal;
            }
        }
        .info-title{
            // padding-left: 10px;
        }
        .sign-detail {
            .el-row {
                padding: 5px 0 5px 35px;
                span {
                    color: #009C42;
                    cursor: pointer;
                }
            }
        }
    }
    .sign-footer {
        margin-top: 30px;
    }
}
</style>
