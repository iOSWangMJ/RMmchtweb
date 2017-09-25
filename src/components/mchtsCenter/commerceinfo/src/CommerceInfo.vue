<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <!-- <h4>商户基本信息</h4> -->
    <div class="custom_elementui page" slot="content">
        <!-- 商户基本信息 -->
        <div class="page-title">
            商户信息
        </div>
        <div class="page-content">
            <div class="info-title">商户基本信息</div>
            <div class="info-body">
                <el-row>
                    <el-col :span="3">商户简称：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtSimpleName?commerceData.mchtSimpleName:'-'}}</span></el-col>
                    <el-col :span="3" class="col-qr"><a @click='QRSHow = true'><img :src="commerceData.showUrl+commerceData.qrCode" class="qr-img" alt=""></a></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">商户号：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtId?commerceData.mchtId:'-'}}</span></el-col>
                    <el-col :span="3">商户种类：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtType|dictFormat(dict,'mchtType')}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">所属机构：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtOrgName?commerceData.mchtOrgName:'-'}}</span></el-col>
                    <el-col :span="3">所属地区：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtAreaName?commerceData.mchtAreaName:'-'}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">联系人：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtPersonName?commerceData.mchtPersonName:'-'}}</span></el-col>
                    <el-col :span="3">联系电话：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtPhone?commerceData.mchtPhone:'-'}}</span></el-col>
                </el-row>
            </div>
            <!-- 店长用户信息 -->
            <div class="info-title">我的客户经理</div>
            <div class="info-body">
                <el-row>
                    <el-col :span="3">经理姓名：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtAmrName?commerceData.mchtAmrName:'-'}}</span></el-col>
                    <el-col :span="3">经理工号：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtAmrNo?commerceData.mchtAmrNo:'-'}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">经理电话：</el-col>
                    <el-col :span="7" class="col-border"><span>{{commerceData.mchtAmrPhone?commerceData.mchtAmrPhone:'-'}}</span></el-col>
                </el-row>
            </div>
        </div>
        <el-dialog :show-close="false" :visible.sync="QRSHow" custom-class="custom-dialog-commerce-qr" :modal-append-to-body="false">
            <div style="text-align:center;min-width:200px;margin-bottom:10px;">
                <img style="height:auto;width:200px;" :src="commerceData.showUrl+commerceData.qrCode" alt="">
            </div>
            <div class="info-footer">
                <!-- <el-button @click="QRSHow = false">返 回</el-button> -->
                <!-- <a :href="commerceData.showUrl+commerceData.qrCode" :download="commerceData.qrCode" ><el-button type="danger" class="button-background" @click="QRSHow = false">下载</el-button></a>     -->

                <a class="button-background downloadImg" :href="commerceData.showUrl+commerceData.qrCode" :download="commerceData.mchtSimpleName" target="_blank">下载</a>
                <!-- <el-button type="" class="button-background" @click="downloadImg"><a :href="commerceData.showUrl+commerceData.qrCode" :download="commerceData.mchtSimpleName" target="_blank">下载</a></el-button> -->
                <el-button type="" class="button-return " @click="QRSHow = false">返回</el-button>
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

export default {
    name: "CommerceInfo",
    mixins: [Mixins.AuthMixin, Mixins.StaticDataLoad, Mixins.PropertyInit, Mixins.ShowWatcher],

    data() {
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
                mchtId: '',
                mchtSimpleName: '',
                mchtType: '',
                mchtAreaName: '',
                mchtResonName: '',
                mchtPhone: '',
                brno: '',
                mchtOrgName: '',
                mchtAmrName: '',
                mchtAmrNo: '',
                mchtAmrPhone: '',
                mchtMngNo: '',
                mchtName: '',
                regDate: '',
                mchtEmail: '',
                inStat: '',
                mchtStat: ''
            }
        }
    },
    methods: {
        handleQuery() {
            this.$ajaxPromise(requestUrl.query, {}, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.commerceData = res
                    console.log(res);
                    console.log(this.commerceData.showUrl + this.commerceData.qrCode);
                }
            })
        },
        downloadImg() {
            var img = new Image()
            img.src = this.commerceData.showUrl + this.commerceData.qrCode

            // if (browserIsIe()) { //假如是ie浏览器
            //     DownLoadReportIMG(img.src);
            // } else {
            //     console.log(img);
            //     img.download
            //     $('.down_qr').attr('download', img.src);
            //     $('.down_qr').attr('href', img.src);
            // }
            // window.location=this.commerceData.showUrl+this.commerceData.qrCode
            this.QRSHow = false

        }
    },
    created() {
        //do something after creating vue instance
        this.handleQuery()
    }
}


// function DownLoadReportIMG(imgPathURL) {
//     //如果隐藏IFRAME不存在，则添加
//     if (!document.getElementById("IframeReportImg"))
//         $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="DoSaveAsIMG();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");
//     if (document.all.IframeReportImg.src != imgPathURL) {
//         //加载图片
//         document.all.IframeReportImg.src = imgPathURL;
//     } else {
//         //图片直接另存为
//         DoSaveAsIMG();
//     }
// }
//
// function DoSaveAsIMG() {
//     if (document.all.IframeReportImg.src != "about:blank")
//         window.frames["IframeReportImg"].document.execCommand("SaveAs");
// }
// //判断是否为ie浏览器
// function browserIsIe() {
//     if (!!window.ActiveXObject || "ActiveXObject" in window)
//         return true;
//     else
//         return false;
// }
</script>
<style lang="scss" scoped>
.page {
    background: #eff4f3;
    height: 100%;
    position: relative;
    font-size: 14px;
    // padding-bottom: 200px;
    .page-title {
        background: url('../../../../assets/Merchant2-@2x.png') no-repeat;
        background-size: 40px 40px;
    }

    .page-content {
        background: white;
        padding-bottom: 150px;
        .info-body {
            padding-left: 53px;
            border-bottom: 1px solid #EAF0F4;
            padding-bottom: 20px;
            &:last-child {
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
                .col-qr {
                    padding: 0;
                    .qr-img {
                        width: 24px;
                        height: 24px;
                    }
                }
            }
        }
    }
    .downloadImg{
        display: inline-block;
        width: 120px;
        height: 34px;
        border-radius: 2px;
        line-height: 34px;
    }
}
</style>
