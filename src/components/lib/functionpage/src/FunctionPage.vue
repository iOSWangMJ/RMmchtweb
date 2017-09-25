<template>
    <div class="function-page-container">
        <div v-if="isLoading">
            <div class="function-loading" v-loading="isLoading" element-loading-text="加载中...">
            </div>
        </div>
        <div v-else >

            <el-row>
                <slot name="header"></slot>
            </el-row>
            <el-row>
                <slot name="content"></slot>
            </el-row>
            <el-row>
                <slot name="footer"></slot>
            </el-row>
            <!-- <Affix ref="affix"  :offset-bottom="15">
                <slot name="fixedFooter"></slot>
            </Affix> -->
            <div>
                <slot name="dialog"></slot>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .function-page-container{
        /*padding-top: 20px;*/
        /*padding-top:20px;*/
    }
    .function-page-fixedfooter{

    }
</style>
<script>
    // import Affix from 'iview/src/components/Affix';

    export default{
        name:"function-page",
        data(){
            return{

            }
        },
        // components:{
        //     'Affix':Affix
        // },
        props: {
            /**是否加载完成
             * 可以显示内容*/
            isLoading: {
                type: Boolean,
                default: false
            }
        },
        mounted (){
            let _this = this
            /**Affix 只响应WINDOW的scroll 手动监听DIV的scroll 调用handleScroll方法*/
            // $("div").scroll(function () {
            //         if(_this.$refs['affix'])
            //         'handleScroll' in  _this.$refs['affix'] ? _this.$refs['affix'].handleScroll() : console.log('NO methods')
            // });

        }
    }


</script>
