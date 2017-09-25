<template>
    <el-row class="material-template-container">
        <el-row style="min-height: 548px; background: white;">
            <p class="material-template">
                <img src="../../../../assets/wuliao3@2x.png" width="40" style="margin-right: 15px;" alt="">物料模板</p>
            <div class="template-area">
                <div v-for="(item,index) in materialItems" class="material-item" :key="index">
                    <div class="item-img">
                        <img :src="showUrl+item.mtrPicId" alt="">
                    </div>
                    <a class="download" :href="showUrl+item.mtrPicId" :download="item.mtrList" target="_blank" @click="handleDownload">立即下载</a>
                </div>
            </div>
        </el-row>
    </el-row>
</template>
<style scoped="scoped" lang="scss">
    $public-green:#009C42;
    .material-item{
        margin-left: 70px;
    }
    .download{
        font-size: .85em;
        position: absolute;
        margin: 0;
        bottom: 0;
        height: 15px;
        line-height: 15px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        width: 100%;
        background: rgba(0,0,0,.5);
        color: white;
        text-align: center;
    }
    .item-img>img{
        border-radius: 5px;
        width: 100%;
        height: 133px;
    }
    .material-item{
        position: relative;
        border-radius: 5px;
        width: 89px;
        height: 133px;
        margin-bottom: 60px;
    }
    .template-area{
        flex-wrap: wrap;
        display: flex;
        padding: 0 100px 0 30px;
        margin : 20px 0;
    }
    .material-template-container{
        min-height: 548px;
        width: 100%;
        color: #333;
    }
    .material-template{
        font-size: 1.28em;
        margin-top: 20px;
        padding-left: 20px;
        line-height: 40px;
        height: 40px;
        font-weight: bold;
    }
</style>
<script>
    import * as requestUrl from './requestUrl'
    export default{
        name:'materialTemplate',
        data(){
            return{
              materialItems:[],
                showUrl:''
            }
        },
        methods:{
            handleDownload(){
                console.log('下载文件');
            }
        },
        mounted(){
            this.$ajaxPromise(requestUrl.materialTemplateQuery,{},"POST",true).then((res)=>{
              this.materialItems = res.mtrList;
              this.showUrl = res.showUrl;
            }).catch((error)=>{

            })
        }
    }
</script>
