<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <!-- <h4>商户基本信息</h4> -->
    <div class="custom_elementui page" slot="content">
        <div class="page-title">
            门店交易统计
        </div>
        <div class="page-content">
            <div class="info-body">
                    <el-form :model="formData" :inline='true'>
                        <el-row >
                            <el-col :span="9" :offset='2'>
                                <el-form-item label="门店商户：" label-width="84px">
                                    <el-select v-model="formData.id" filterable clearable placeholder="全部">
                                        <el-option v-for="item in commerceData" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" :offset='2'>
                                <el-form-item label="日期：" label-width="84px">
                                    <el-date-picker style="width:210px;" v-model="formData.transDate" type="daterange" placeholder="选择日期范围">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="info-footer">
                        <el-button  class="button-background" @click="handleQuery(1)">查询</el-button>
                    </div>

                    <el-row>
                      <el-col :span="22" :offset='1'>
                          <el-table border :data="tableData">
                              <el-table-column  align="center" label="交易日期">
                                  <template scope ="scope">
                                      {{scope.row.transDate | dateFilter}}
                                  </template>
                              </el-table-column>
                              <el-table-column min-width="120px"  align="center" label="门店商户号">
                                  <template scope ="scope">
                                      {{scope.row.subMchtId }}
                                      <!-- <el-tooltip placement="top"  :content="scope.row.subMchtId" >
                                          <div class="">
                                              {{scope.row.subMchtId | longStringFilter}}
                                          </div>
                                      </el-tooltip> -->
                                  </template>
                              </el-table-column>
                              <el-table-column prop="subMchtSimpleName" align="center" label="门店简称"></el-table-column>
                              <el-table-column align="center" label="交易金额">
                                  <template scope="scope">
                                      <span style="color:#E40001">{{scope.row.txnAmt}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column align="center" label="交易笔数">
                                  <template scope="scope">
                                      <span style="color:#0068BB">{{scope.row.txnCount}}</span>
                                  </template>
                              </el-table-column>
                          </el-table>
                          <simple-pagination @currentChange="pageChange" @update:currentPage='val =>currentPage= val' :currentPage.sync='pagination.currentPage' :total="pagination.total"></simple-pagination>
                      </el-col>
                    </el-row>

            </div>
        </div>

    </div>
</function-page>
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dict from './dict.js'
import {format} from '../../../../jslib/utils/DateUtil.js'

import SimplePagination from '../../../lib/simplepagination'

import logo from '../../../../assets/erweima-@3x.png'
export default {
    name: "StoreInfo",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],
    components: {
        SimplePagination
    },
    data: () => ({

        /**静态数据对象*/
        staticData: {},
        staticLoadConfig: staticloadconfig,
        dict: dict,

        // select 的商户号 选择
        commerceData: [],
        commerceStat: dict.mchtStat,

        pagination: {
            currentPage: 1,
            total: 1,
            pageSize: 10
        },


        formData: {
            id: '',
            transDate: '',
            subMchtIdList:[]
        },

        tableData: [],

    }),
    methods: {
        handleQuery(setCurrentPage) {
            if (setCurrentPage) {
                console.log(setCurrentPage);
                this.pagination.currentPage = setCurrentPage
            }
            console.log(this.formData);
            let _this = this
            let data = this.$dataClone(this.formData)
            if (data.transDate.length>0 && this.formData.transDate[0]&&this.formData.transDate[1]) {
                delete data.transDate
                // data.transDate = format(this.formData.transDate,'yyyyMMdd')
                data.startDate = format(this.formData.transDate[0], 'yyyyMMdd')
                data.endDate = format(this.formData.transDate[1], 'yyyyMMdd')
            }
            if (data.id) {
                data.subMchtIdList = [data.id]
            }
            // let queryData = this.$getCommonRequest(this.pagination.currentPage,this.pagination.pageSize,data)
            data.pageNo = this.pagination.currentPage
            data.pageSize = this.pagination.pageSize
            this.$ajaxPromise(requestUrl.query, data, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    console.log('handleQuery-------------->',res);
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

        handleDetail(data) {
            this.detailData = data
            this.detailShow = true

        }

    },
    mounted() {
        //do something after mounting vue instance
               this.handleQueryCommerce()
                this.handleQuery()


    },
    created() {
        //do something after creating vue instance

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
    background: #eff4f7;
    padding-left: 20px;
    height: 100%;
    font-size: 14px;
    padding-bottom:100px;
    padding-top: 20px;
    background: white;
    .page-title {
        background: url('../../../../assets/mendiantongji3@2x.png') no-repeat;
        background-size: 40px 40px;
    }
    .page-content {
        .info-body {
            margin-bottom: 10px;
            padding-right: 20px;
            .form-submit {
                margin: 0 0 34px 0;
            }
            .el-table {
                margin-top: 60px;
                .el-button {
                    color: #009C42;
                }
            }
        }
    }
}
</style>
