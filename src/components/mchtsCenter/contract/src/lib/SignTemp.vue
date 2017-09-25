
/**
 * [id description]
 * @type {String}
    isShow  控制table 的显示
    url  远程访问后台数据的url
 */



<template>
<div id="sign-temp" >
    <el-row>
        <el-col :span="4">{{signData.acctTypeCode |acctTypeCodeFormat}}</el-col>
        <el-col :span="14"><span>{{signData.rateName}}</span><a @click="show"><img :class='{"img-rotate":isShow}' :src="arrowImg" alt=""></a></el-col>

        </el-col>
    </el-row>
    <transition name='fade' enter-active-class='animated fadeInDown'>
        <div class="rate-table" v-show="isShow">
            <el-table :data="rateData" :show-overflow-tooltip='true'>
                <el-table-column property="sectionMin" label="分段最小值"></el-table-column>
                <el-table-column property="sectionMax" label="分段最大值"></el-table-column>
                <el-table-column  label="收费类型">
                    <template scope="scope">
                        {{scope.row.chargeType |chargeTypeFormat}}
                    </template>
                </el-table-column>
                <el-table-column property="chargeValue" width="80px" label="收费值"></el-table-column>
                <el-table-column property="feeMin" label="最小手续费"></el-table-column>
                <el-table-column property="feeMax" label="最大手续费"></el-table-column>

            </el-table>
        </div>
    </transition>
</div>
</template>
<script>

import downArrowImg from '../../../../../assets/down arrow@2x.png'
import {acctTypeCode, chargeType} from '../dict.js'
export default {
    name: "SignTemp",
    data: () => ({
        rateData:[],
        isShow:false,
        isQuerying:false,
        arrowImg:downArrowImg
    }),

    props: {
        signData: Object,
        url: String
    },
    methods: {
      handleQuery() {
        //   TODO

        // this.isQuerying= true
        this.$ajaxPromise(this.url,{},"POST",true).then((res)=>{
            if (res.respCode ==="0000") {
                this.rateData = res.data.dataList
            }
        })
    },
    show(){
        this.isShow = !this.isShow

        if (this.isShow) {
                this.handleQuery()
        }
    }
},
    filters :{
        acctTypeCodeFormat(value){
            if (!value) {
                return '-'
            }
            let   data = acctTypeCode
            if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (value == data[i]['key']) {
                            return data[i].value
                        }
                    }
            }else {
                return value
            }

        },
        chargeTypeFormat(value){
            if (!value) {
                return '-'
            }
            let   data = chargeType
            if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (value == data[i]['key']) {
                            return data[i].value
                        }
                    }
            }else {
                return value
            }

        }
},
created() {
  //do something after creating vue instance

}
}
</script>
<style lang="scss" scoped>
#sign-temp {
    padding-bottom: 10px;
    .el-row{
        padding-bottom: 10px;
        padding-left: 10px;
        a{
            padding-left: 10px;
            img{
            }
        }
    }
    .rate-table{
        padding-bottom: 10px;
    }
}
.img-rotate{
    // transition
    transform:rotate(180deg);
    // animation:imgRotate  2 easy;

}
// @keyframes imgRotate {
//     0 { transform:rotate(0);}
//     100% {transform: rotate(180deg); }
// }


</style>
