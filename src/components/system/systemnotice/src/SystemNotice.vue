<template>
    <el-row style="padding:50px 0;height: calc(100% - 94px);">
        <el-row class="system-notice-container">
            <el-row style="height: 100%" v-if="!isShowNoitceContent">
                <el-row class="system-notice-title">
                    <img src="../../../../assets/Notice2@2x.png" width="30" style="margin-left: 85px" alt="">
                    <span style="margin-left: 12px">系统公告</span>
                </el-row>
                <el-row class="system-notice-content">
                    <div @click="handleClickNoitceItem(item)" class="system-notice-item" :key="index" v-for="(item,index) in noticeItems">
                        <div style="width: 66px;overflow: hidden;height: 22px;">{{item.noticeTitle}}</div>
                        <div class="item-content">{{item.
                            noticeContent}}</div>
                        <div>{{item.effectDateTime.slice(0,4)+'-'+item.effectDateTime.slice(4,6)+'-'+item.effectDateTime.slice(6,8)}}</div>
                    </div>
                </el-row>
                <div id="pagination">
                    <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goFirstPage"> <<首页 </el-button>
                    <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="empGoFirstPage"> <上一页 </el-button>
                    <span>&nbsp;&nbsp;第{{pageNo}}页,共{{Math.ceil(totalCnt/10)}}页&nbsp;&nbsp;</span>
                    <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="empGoNextPage"> 下一页> </el-button>
                    <el-button type="text" style="color:rgb(0,156,66);padding:0;" @click="goLastPage"> 尾页>> </el-button>
                </div>
            </el-row>
            <system-notice-content @backSystemNoitce="backSystemNoitce" :activeItemContent="activeItemContent" v-if="isShowNoitceContent"></system-notice-content>
        </el-row>
    </el-row>
</template>
<script>
    import * as requestUrl from './requestUrl'
    import SystemNoticeContent from './sub/systemnoticecontent'
    export default {
        name: 'systemNotice',
        data (){
            return{
                noticeItems:[],
                totalCnt:1,
                pageNo:1,
                pageSize:10,
                isShowNoitceContent:false,
                activeItemContent:{}
            }
        },
        components:{
          systemNoticeContent:SystemNoticeContent
        },
        mounted(){
          let _this = this;
            this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:this.pageNo,pageSize:this.pageSize},"POST",true).then((res)=>{
              this.totalCnt = res.totalCnt;
              this.noticeItems = res.msgList;
              if (_this.$route.query.toItem ==='true'){
                  _this.handleClickNoitceItem(res.msgList[0]);
              }
            }).catch((error)=>{

            })
        },
        methods:{
            backSystemNoitce(){
              this.isShowNoitceContent = false;
            },
            handleClickNoitceItem(item){
                this.isShowNoitceContent = true;
                this.activeItemContent = item;
            },
            empGoFirstPage(){
                if (this.pageNo > 1){
                    this.pageNo -= 1;
                    this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:this.pageNo,pageSize:this.pageSize},"POST",true).then((res)=>{
                        this.totalCnt = res.totalCnt;
                        this.noticeItems = res.msgList;
                    }).catch((error)=>{

                    })
                }
            },
            empGoNextPage(){
                if (Math.ceil(this.totalCnt/10) > this.pageNo){
                    this.pageNo+= 1;
                    this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:this.pageNo,pageSize:this.pageSize},"POST",true).then((res)=>{
                        this.totalCnt = res.totalCnt;
                        this.noticeItems = res.msgList;
                    }).catch((error)=>{

                    })
                }
            },
            goLastPage(){
                if (Math.ceil(this.totalCnt/10) !== this.pageNo){
                    this.pageNo = Math.ceil(this.totalCnt/10);
                    this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:this.pageNo,pageSize:this.pageSize},"POST",true).then((res)=>{
                        this.totalCnt = res.totalCnt;
                        this.noticeItems = res.msgList;
                    }).catch((error)=>{

                    })
                }
            },
            goFirstPage(){
              if (this.pageNo!=1){
                  this.pageNo = 1;
                  this.$ajaxPromise(requestUrl.noticeQuery,{pageNo:this.pageNo,pageSize:this.pageSize},"POST",true).then((res)=>{
                      this.totalCnt = res.totalCnt;
                      this.noticeItems = res.msgList;
                  }).catch((error)=>{

                  })
              }
            }
        }
    }
</script>
<style lang="scss">
    $public-green:#009C42;
    /*分页样式*/
    #pagination{
        font-size:0.85em;
        float:right;
        margin-top:15px;
        margin-right:30px;
        margin-bottom:15px;
    }
    #pagination button{
        font-size:0.85em;
    }
    .system-notice-content>.system-notice-item>.item-content{
        margin-left: 44px;
        width: 470px;
        margin-right: 130px;
    }
    .item-content{
        /*flex: 1;*/
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .system-notice-item{
        margin-bottom: 21px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
    }
    .system-notice-item:hover{
        color: $public-green;
    }
    .system-notice-content{

        height: calc(100% - 172px);
        overflow-y: auto;
        font-size: 1.14em;
        padding: 30px 130px;
    }
    .system-notice-title{
        height: 72px;
        font-size: 18px;
        color: #333;
        font-weight: bold;
        line-height: 72px;
        border-bottom: 1px solid #d8d8d8;
    }
    .system-notice-container{
        height: 100%;
        width: 1066px;
        margin-left: 50%;
        transform: translate(-50%,0);
        background: white;
    }
</style>
