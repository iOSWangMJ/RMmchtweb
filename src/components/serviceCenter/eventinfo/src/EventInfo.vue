<template>
<function-page :isLoading="mixinShowWatcherLoading">
    <div class="custom_elementui page" slot="content">
        <el-row>
            <el-col :span="8">
                <div class="page-title">
                    事件申报
                </div>
            </el-col>
            <el-col :span="8" :offset='6' class='title-button'><a @click='declareShow =!declareShow'>申报</a></el-col>
        </el-row>

        <div class="page-content">
            <div class="info-body">
                <el-form :model="formData" :inline='true'>
                    <el-row>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="申报日期：" label-width="84px">
                                <el-date-picker style="width:200px;" v-model="formData.date" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset='3'>
                            <el-form-item label="商户状态：" label-width="84px">
                                <el-select v-model="formData.eventStat" clearable placeholder="全部">
                                    <el-option v-for="item in eventStat" :key="item.key" :label="item.value" :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="info-footer">
                    <el-button class="button-background" @click="handleQuery(1)">查询</el-button>
                </div>

                <el-row>
                    <el-col :span="20" :offset='2'>
                        <el-table :data="tableData" v-loading="status.isQuerying">
                            <el-table-column label="申报日期">
                                <template scope="scope">
                                          {{scope.row.eventDate|dateFilter}} {{scope.row.eventTime|timerFilter}}
                                      </template>
                            </el-table-column>
                            <!-- <el-table-column prop="eventId" label="事件编号"></el-table-column> -->
                            <el-table-column prop="eventTitle" position="left" label="事件标题"></el-table-column>
                            <el-table-column prop="eventStat" label="事件状态">
                                <template scope="scope">
                                        <!-- <span :class="{processing:scope.row.eventStat==='01'}"> -->
                                             {{scope.row.eventStat|dictFormat(dict,"eventStat")}}
                                         <!-- </span> -->
                                      </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                     <el-button @click="handleDetail(scope.row.eventId)" type="text" size="small">详情</el-button>
                                 </template>
                            </el-table-column>
                        </el-table>
                        <simple-pagination @currentChange="pageChange" @update:currentPage='val =>currentPage= val' :currentPage.sync='pagination.currentPage' :total="pagination.total"></simple-pagination>
                    </el-col>
                </el-row>

            </div>
        </div>


        <el-dialog custom-class="custom-dialog-eventinfo-declare" top="20%" @close="resetDeclare" :modal-append-to-body="false" :show-close='false' :visible.sync="declareShow">
            <div class="detail-body">
                <el-form :model="declareData" ref='declare' :rules="rules" label-position="left">
                    <el-form-item label="事件标题" prop="eventTitle" label-width="90px">
                        <el-input v-model="declareData.eventTitle" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="事件内容" prop="eventDesc" label-width="90px">
                        <el-input type="textarea" :rows="5" placeholder="200字以内" v-model="declareData.eventDesc">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="图片" style="padding-left:10px;" label-width="80px">

                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-upload class="avatar-upload" action="/upload" :data='uploadData' :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAcatarUpload">
                                    <img v-if="userImgUrl" :src="userImgUrl" class="avatar">
                                    <i v-else class=" avatar-upload-icon el-upload"></i>
                                    <!-- <el-button type=""></el-button> -->
                                </el-upload>
                            </el-col>
                            <el-col>
                                <el-upload class="avatar-upload" action="/upload" :data='uploadData' :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAcatarUpload">
                                    <img v-if="userImgUrl2" :src="userImgUrl2" class="avatar">
                                    <i v-else class=" avatar-upload-icon el-upload"></i>
                                    <!-- <el-button type=""></el-button> -->
                                </el-upload>
                            </el-col>
                            <el-col>
                                <el-upload class="avatar-upload" action="/upload" :data='uploadData' :show-file-list="false" :on-success="handleAvatarSuccess3" :before-upload="beforeAcatarUpload">
                                    <img v-if="userImgUrl1" :src="userImgUrl1" class="avatar">
                                    <i v-else class=" avatar-upload-icon el-upload"></i>
                                    <!-- <el-button type=""></el-button> -->
                                </el-upload>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    </el-form-item label="">
                    <div class="info-footer">
                        <el-button class="button-background" @click='handleSubmit'> 提交 </el-button>
                        <el-button class="button-return" @click='declareShow = false'> 返 回 </el-button>
                    </div>
                    </el-form-item>
                </el-form>
            </div>


            <!-- </el-card> -->
        </el-dialog>


        <el-dialog custom-class="custom-dialog-eventinfo-detail" :modal-append-to-body="false" :show-close='false' :visible.sync="detailShow">
            <!-- <el-card> -->
            <div class="detail-body">
                <el-row>
                    <el-col :span="4">事件标题</el-col>
                    <el-col :span="17" :offset='3' class="descibe"><span>{{detailData.eventTitle}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">申报日期：</el-col>
                    <el-col :span="17" :offset='3' class="descibe"><span>{{detailData.eventDate|dateFilter}} {{detailData.eventTime|timerFilter}} </span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">事件状态：</el-col>
                    <el-col :span="17" :offset='3' class="descibe"><span>{{detailData.eventStat|dictFormat(dict,"eventStat")}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">事件内容：</el-col>
                    <el-col :span="17" :offset='3' class="descibe"><span>{{detailData.eventDesc}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">意见反馈：</el-col>
                    <el-col :span="17" :offset='3' class="descibe"><span>{{detailData.eventFdback}}</span></el-col>
                </el-row>
            </div>
            <div class="info-footer">
                <el-button class="button-background" @click='detailShow = false'> 返 回 </el-button>
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
import {
    format
} from '../../../../jslib/utils/DateUtil.js'

import SimplePagination from '../../../lib/simplepagination'

import logo from '../../../../assets/erweima-@3x.png'

const chlNo = 411; // 商户服务系统

export default {
    name: "EventInfo",
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
        eventStat: dict.eventStat,
        status: {
            isQuerying: false
        },

        pagination: {
            currentPage: 1,
            total: 1,
            pageSize: 10
        },


        //表单查询
        formData: {
            eventStat: '',
            date: ''
        },
        tableData: [],

        declareShow: false,
        declareData: {
            eventTitle: '',
            eventDesc: '',
            picList: []
        },
        uploadData: {
            chlNo: "411",
            fileType: "03"
        },
        rules: {
            eventTitle: [{
                required: true,
                message: '请输入活动名称',
                trigger: 'blur'
            }],
            eventDesc: [{
                    required: true,
                    message: '请输入内容',
                    trigger: 'blur'
                },
                {
                    max: 200,
                    message: '最多输入200个字',
                    trigger: 'blur'
                }

            ]
        },
        userImgUrl: '',
        userImgUrl2: '',
        userImgUrl1: '',

        //详情数据展示
        detailShow: false,
        detailData: {

        }

    }),
    methods: {
        handleQuery(currentPage) {
            if (currentPage) {
                this.pagination.currentPage = currentPage
            }
            console.log(this.formData);
            // this.status.isQuerying = true
            let _this = this
            let data = this.$dataClone(this.formData)

            //dataClone Stringify date error so
            if (data['date']) {
                console.log(data.date);
                let date = format(this.formData.date, 'yyyyMMdd')
                data['eventDate'] = date
            }

            // let queryData = this.$getCommonRequest(this.pagination.currentPage, this.pagination.pageSize, data)
            data.pageNo = this.pagination.currentPage
            data.pageSize = this.pagination.pageSize
            this.$ajaxPromise(requestUrl.query, data, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    console.log(res);
                    this.pagination.total = res.totalCnt
                    this.tableData = res.eventList
                    // _this.status.isQuerying = false
                }
            }).catch((err) => {
                console.error(err);
                _this.status.isQuerying = false

            })
        },

        pageChange(currentPage) {
            this.handleQuery()
        },

        handleDetail(eventId) {

            this.$ajaxPromise(requestUrl.detailQuery, {
                eventId
            }, 'POST', true).then((res) => {
                if (res.respCode === '0000') {
                    this.detailData = res
                    this.detailShow = true
                }
            })

        },

        handleSubmit() {
            this.$refs['declare'].validate((valid) => {
                if (valid) {
                    //处理 事件申请
                    let picList = this.declareData.picList

                    for (var i = 0; i < picList.length; i++) {
                        if (picList[i] == undefined) {
                            picList.splice(i, 1)
                        }
                    }
                    console.log(picList);
                    let　 data = this.declareData

                    this.$ajaxPromise(requestUrl.submit, data, 'POST', true).then((res) => {
                        if (res.respCode === '0000') {
                            this.declareShow = !this.declareShow
                            this.handleQuery()
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false;
                }
            });
        },

        resetDeclare() {
            this.$refs['declare'].resetFields()
            this.declareData = {
                    eventTitle: '',
                    eventDesc: '',
                    picList: []
                },
                this.userImgUrl = ''
            this.userImgUrl2 = ''
            this.userImgUrl1 = ''
        },


        handleRemove(file, fileList) {
            console.info(file, fileList)
        },

        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true
        },

        // TODO: way1 : 很low 建议使用fileupload 其他功能，但布局上会有很大问题
        //       way2 ： 进一步封装组件，v-for 循环
        handleAvatarSuccess1(res, file, fileList) {

            this.userImgUrl = URL.createObjectURL(file.raw)
            console.log(res);
            let data = {
                picId: '',
                position: ''
            }
            data['picId'] = res.fileDataList[0].fileName
            data["position"] = "0"
            this.declareData.picList[0] = data


        },
        handleAvatarSuccess2(res, file, fileList) {
            this.userImgUrl2 = URL.createObjectURL(file.raw)
            let data = {
                picId: '',
                position: ''
            }
            data['picId'] = res.fileDataList[0].fileName
            data["position"] = "1"
            this.declareData.picList[1] = data
        },
        handleAvatarSuccess3(res, file, fileList) {
            this.userImgUrl1 = URL.createObjectURL(file.raw)
            let data = {
                picId: '',
                position: ''
            }
            data['picId'] = res.fileDataList[0].fileName
            data["position"] = "2"
            this.declareData.picList[2] = data

        },
        beforeAcatarUpload(file) {
            // const isLt2M = file.size / 1024 / 1024 < 2;
            let isImg = true

            //验证图片格式
            //   var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase()
            const ext = file.type.substring(file.type.lastIndexOf("/") + 1)
            var arr = new Array(['.jpg', '.bmp', '.jpeg', '.gif', '.png', '.JPG', '.BMP', '.JPEG', '.GIF', '.PNG']);
            var valueStr = arr.toString();
            if (valueStr.indexOf(ext) == -1) {
                isImg = false
            }

            if (!isImg) {
                this.$message.error('只能上传图片!');
            }
            // if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            return isImg ;
            // return true
        }

    },
    mounted() {
        //do something after mounting vue instance
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
    padding-left: 20px;
    height: 100%;
    position: relative;
    font-size: 14px;
    // padding-bottom: 200px;
    padding-top: 20px;
    background: white;
    padding-right: 20px;
    // margin-right: 47px;

    .page-title {
        background: url('../../../../assets/shenbao2@2x.png') no-repeat;
        background-size: 40px 40px;
    }
    .title-button {
        text-align: right;
        // margin-bottom: 20px;
        a {
            display: inline-block;
            text-align: center;
            width: 65px;
            height: 33px;
            border-radius: 8px;
            border: 1px solid #009C42;
            color: #009C42;
            line-height: 33px;
        }
    }
    .page-content {
        padding-bottom: 200px;
        .info-body {
            margin-top: 10px;
            margin-bottom: 10px;
            .el-select {
                width: 200px;
            }
            .info-footer {
                margin: 0 0 60px;

            }
            .el-table {
                .el-button {
                    color: #009C42;
                }
                .processing {
                    color: #1094F5;
                }
            }
        }
    }
    .el-dialog {
        .detail-body {
            .el-form {
                position: relative;
                .el-row {
                    padding: 0;
                }
                .avatar-upload {
                    width: 67px;
                    height: 67px;
                }
                .avatar-upload .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-upload .el-upload:hover {
                    border-color: #20a0ff;
                }
                .avatar-upload-icon {
                    color: #8c939d;
                    width: 67px;
                    height: 67px;
                    text-align: center;
                    background: url('../../../../assets/upload@2x.png') no-repeat;
                    background-size: 100%;
                }
                .avatar {
                    width: 67px;
                    height: 67px;
                    display: block;
                    border: 1px solid #ccc;
                }
                .info-footer {
                    padding-top: 10px;
                }
            }

            .el-row {
                padding-bottom: 15px;
                .descibe {
                    text-align: right;
                    span {
                        color: #666666;
                    }
                }

            }

        }
    }
}
</style>
