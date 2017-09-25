<template>
    <el-row class="system-notice-content-container">
        <div style="height: calc(100% - 64px);overflow-y: auto;padding: 0 200px;">
            <p class="notice-title">
                {{activeItemContent.noticeTitle}}
            </p>
            <div class="noitce-content">
                <p>尊敬的商户</p>
                <p class="content-main">
                    {{activeItemContent.noticeContent}}
                </p>
            </div>
            <div class="notice-footer">
                <p>{{activeItemContent.effectDateTime.slice(0,4)+'-'+activeItemContent.effectDateTime.slice(4,6)+'-'+activeItemContent.effectDateTime.slice(6,8)}}</p>
                <p>{{activeItemContent.noticeSign}}</p>
            </div>
        </div>
        <div class="noitce-button">
            <el-button style="margin-right: 40px;" class="public-button public-green" @click="handleClickBack">返回</el-button>
        </div>
    </el-row>
</template>
<script>
    export default {
        name: 'systemNoticeContent',
        props:{
            activeItemContent:{
                type:Object,
                required:true
            }
        },
        data (){
            return{

            }
        },
        mounted(){
            $(document).scrollTop(0);
        },
        methods:{
            handleClickBack(){
                this.$emit('backSystemNoitce');
            }
        }
    }
</script>
<style lang="scss">
    $public-green:#009C42;
    .noitce-button>.public-button{
        height: 34px;;
        width: 120px;
    }
    .noitce-button{

        text-align: center;
        margin-top: 64px;
    }
    .notice-footer{
        margin-top: 29px;
        text-align: right;
        line-height: 42px;
    }
    .content-main{
        word-wrap:break-word;
        margin-left: 80px;
        margin-top: 20px;
        line-height: 42px;
    }
    p{
        margin: 0;
    }
    .noitce-content{
        margin-top: 32px;
    }
    .notice-title{
        font-size: 1.28em;
        text-align: center;
    }
    .system-notice-content-container{
        height: 100%;
        font-size: 1.14em;
        padding: 62px 20px 100px;
    }
</style>
