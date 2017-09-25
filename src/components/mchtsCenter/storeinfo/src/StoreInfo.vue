<template>
<!-- <function-page :isLoading="mixinShowWatcherLoading"> -->
<!-- <h4>商户基本信息</h4> -->
<div class="custom_elementui page" slot="content">
    <div class="" v-show="tableData.length>0" v-cloak>
        <div class="page-title">
            门店信息
        </div>
        <div class="page-content">
            <div class="info-title">商户结算信息</div>
            <div class="info-body">
                <el-form :model="formData" :inline='true'>
                    <el-row>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="门店商户：" label-width="84px">
                                <el-select v-model="formData.id" filterable clearable placeholder="全部">
                                    <el-option v-for="item in commerceData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="商户状态：" label-width="84px">
                                <el-select v-model="formData.mchtStat" clearable placeholder="全部">
                                    <el-option v-for="item in commerceStat" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="form-submit info-footer">
                    <el-button class="button-background" @click="handleQuery(1)">查询</el-button>
                </div>
                <el-row>
                    <el-col :span="20" :offset='2'>
                        <el-table v-loading="status.isQuerying" :data="tableData">
                            <el-table-column prop='mchtId' label="门店商户号">
                                <template scope="scope">
                                    <el-tooltip  :content="scope.row.mchtId" >
                                        <div class="">
                                            {{scope.row.mchtId | longStringFilter}}
                                        </div>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mchtSimpleName" label="门店简称"></el-table-column>
                            <el-table-column prop="mchtAreaName" label="所属区域"></el-table-column>
                            <el-table-column label="商户状态">
                                <template scope="scope">
                                    {{scope.row.mchtStat | dictFormat(dict,'mchtStat')}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="regDate" label="注册日期">
                                <template scope="scope">
                                    {{scope.row.regDate|dateFilter}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                               <el-button class='' @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
                           </template>
                            </el-table-column>
                        </el-table>
                        <simple-pagination @currentChange="pageChange" @update:currentPage='val =>currentPage= val' :currentPage.sync='pagination.currentPage' :total="pagination.total"></simple-pagination>
                    </el-col>
                </el-row>
            </div>
        </div>

        <el-dialog custom-class="custom-dialog-store-detail" top="20%" :modal-append-to-body="false" :show-close='false' :visible.sync="detailShow">
            <div class="detail-body">
                <el-row>
                    <el-col :span="6">门店商户号</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtId}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">门店名称</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtSimpleName}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">所属区域</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtAreaName}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">联系人姓名</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtPersonName}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">联系人电话</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtPhone}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">商户状态</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.mchtStat |dictFormat(dict,'mchtStat')}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">商户日期</el-col>
                    <el-col :span="12" :offset='6' class="descibe"><span>{{detailData.regDate|dateFilter}}</span></el-col>
                </el-row>
            </div>
            <div class="info-footer">
                <el-button class="button-background" @click='detailShow = false'> 返 回 </el-button>
            </div>

            <!-- </el-card> -->
        </el-dialog>
    </div>

    <div class="no-data" v-show="tableData.length ==0" v-cloak>
        <img :src="noDataListImg" alt="">
        <div class="describe">
            <span>目前暂无门店</span>
        </div>
    </div>
</div>
<!-- </function-page> -->
</template>
<script>
import * as Mixins from '../../../../jslib/mixin'
import staticloadconfig from './staticloadconfig.json'
import * as requestUrl from './requestUrl'
import * as dict from './dict.js'

import SimplePagination from '../../../lib/simplepagination'

import noDataListImg from '../../../../assets/No-Data@3x.png'
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
        noDataListImg: noDataListImg,
        dict: dict,
        status: {
            isQuerying: false
        },
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
            mchtStat: ''
        },

        tableData: [{}],
        detailShow: false,
        detailData: {
            mchtSimpleName: "",
            mchtId: "",
            mchtAreaName: "",
            mchtResonName: "",
            mchtPhone: "",
            brno: "",
            brname: "",
            mchtAmrName: "",
            mchtAmrNo: "",
            mchtAmrPhone: "",
            mchtMngNo: "",
            mchtName: "",
            regDate: "",
            mchtEmail: "",
            inStat: "",
            mchtStat: ""
        }

    }),
    methods: {
        handleQuery(currentPage) {
            if (currentPage) {
                this.pagination.currentPage = currentPage
            }
            let _this = this
            // this.status.isQuerying = true
            let data = this.$dataClone(this.formData)
            if (data.id) {
                data.sonMchtIdList = [data.id]
            }
            data.pageNo = this.pagination.currentPage
            data.pageSize = this.pagination.pageSize
            // let queryData = this.$getCommonRequest(this.pagination.currentPage, this.pagination.pageSize, data)
            this.$ajaxPromise(requestUrl.query, data, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.pagination.total = res.totalCnt
                    console.log(res);
                    this.tableData = res.dataList
                    // this.status.isQuerying = false
                }
            })
        },

        handleQueryCommerce() {
            this.$ajaxPromise(requestUrl.commercesQuery, {}, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.commerceData = select_commcerce_trants(res.subMchtList)
                    console.log(this.commerceData);
                }
            }).catch((res) => {
                this.isQuerying = false;
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
    created() {
        //do something after creating vue instance
        this.handleQuery()
        this.handleQueryCommerce()
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
    height: 100%;
    position: relative;
    font-size: 14px;
    [v-cloak] {
        display: none;
    }

    // background: white;
    .page-title {
        background: url('../../../../assets/store3-@2x.png') no-repeat;
        background-size: 40px 40px;
    }
    .page-content {
        background: white;
        padding-bottom: 100px;
        .info-title {
            margin-bottom: 10px;
        }
        .info-body {
            margin-bottom: 10px;
            padding-right: 20px;
            .el-select {}
            .form-submit {
                margin: 0 0 34px;
            }
            .el-table {
                .el-button {
                    color: #009C42;
                }
            }
        }
    }

    .el-dialog {
        .detail-title {
            color: red;
            font-size: 18px;
        }
        .detail-body {
            .el-row {
                padding: 5px 16px;
                .descibe {
                    text-align: right;
                    span {
                        color: #808080;
                    }
                }

            }
        }

    }
    .no-data {
        background: white;
        text-align: center;
        padding-top: 48px;
        padding-right: 47px;
        height: 100%;
        padding-bottom: 200px;
        img {
            width: 265px;
            height: 165px;
        }
        .describe {
            padding-top: 47px;
            font-size: 18px;
        }
    }

}
</style>
