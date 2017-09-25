<template>
    <div style="padding: 50px 0;height: 100%;">
        <el-row  class="select-merchant-container">
            <el-row>
                <el-col class="select-merchant-title" :span="24">请选择商户</el-col>
            </el-row>
            <el-row class="merchant-list">
                <el-col v-for="(item,index) in selectItems" :key="index" class="merchant-item">
                    <el-radio v-model="checkItem" :label="index" style="color: #333">
                        <span class="merchant-number">{{item.mchtId}}</span>
                        <span class="mechant-name">{{item.mchtName}}</span>
                    </el-radio>
                </el-col>
            </el-row>
            <el-row style="padding: 32px 0 112px;">
                <el-col style="text-align: right;" :span="12">
                    <el-button style="margin-right: 17px;" class="public-button public-green-bg" @click="handleClickConfirm">确定</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button @click="handleBackIndex" style="margin-left: 17px;" class="public-button public-gray-bg">返回</el-button>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<style lang="scss">
    $public-green:#009C42;
    $public-gray:#999999;
    .public-button{
        width: 120px;
        height: 34px;
    }
    .merchant-item{
        width: 375px;
        margin-left: 110px;
        margin-bottom: 36px;
    }
    .merchant-checkbox{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .merchant-number{
        margin-right: 10px;
    }
    label{
        font-weight: normal !important;
    }
    .merchant-list .el-radio__input.is-checked .el-radio__inner{
        background: url("../../../../assets/frame2@2x.png");
        border-color: $public-green;
        background-size: 100% 100%;
    }
    .merchant-list .el-radio__inner:hover{
        border-color: $public-green;
    }
    .merchant-list .el-radio__inner::after{
        display: none;
    }
    .merchant-list .el-radio__inner{
        border-radius: 0;
        border-color: #999;
    }
    .merchant-list .el-radio__label{
        padding-left: 15px;
    }
    .merchant-list{
        height: calc(100% - 178px - 68px);
        overflow-y: auto;
        padding-top: 37px;
    }
    .select-merchant-title{
        text-align: center;
        font-size: 1.28em;
        color: #333;
        height: 68px;
        line-height: 68px;
        border-bottom: 1px solid $public-gray;
    }
    .select-merchant-container{
        height: 100%;
        font-size: 1.14em;
        margin-left: 50%;
        transform:translate(-50%,0);
        width: 1066px;
        background: white;
    }
    .public-green-bg{
        background:$public-green !important;
    }
    .public-gray-bg{
        background:$public-gray !important;
    }
</style>

<script>
    import * as requestUrl from './requestUrl'
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: 'selectMerchant',
        data () {
            return{
                checkItem:0,
                selectItems:[]
            }
        },
        methods: {
            ...mapActions({
                systemIsLoginSet: 'systemIsLoginSet',
                systemSelectMchtSet: 'systemSelectMchtSet',
                systemIsSelectMchtSet: 'systemIsSelectMchtSet',
                systemMenusSet:'systemMenusSet',
                systemOpenedMenusSet:'systemOpenedMenusSet',
                systemOpenedMenusIndexSet:'systemOpenedMenusIndexSet',
            }),
            handleBackIndex(){
              this.systemIsLoginSet(false);
            },
            handleClickConfirm(){
              let _this = this;
              let selectItem = this.$dataClone(this.selectItems[this.checkItem]);
              this.systemSelectMchtSet(selectItem);
              this.systemMenusSet();
              this.systemIsSelectMchtSet(false);
            }
        },
        computed:{
            ...mapGetters({
                getSystemUserInfo:'getSystemUserInfo',
            })
        },
        mounted(){
          this.selectItems = this.getSystemUserInfo.dataList;
          $(document).scrollTop(0);
        },
        destroyed(){
          $(document).scrollTop(0);
        }
    }

</script>

