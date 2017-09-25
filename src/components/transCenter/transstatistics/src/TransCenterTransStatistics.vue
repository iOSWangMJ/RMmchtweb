<template>
    <div id="container">
        <!--顶部-->
        <div class="head">
            <b class="headIcon"></b>
            <i class="headFont">交易统计</i>
        </div>

        <!--实时数据图和历史数据图-->
        <div class="echartsContainer">
            <!--实时数据图 -->
            <div class="realStyle">
                <!--title start-->
                <div>
                    <i class="rectangle"></i>
                    <span class="titleFont">实时数据</span>
                </div>
                <!--title end-->

                <!--实时数据图 start-->
                <div id="realTimeChart" class="chart"></div>
                <!--实时数据图 end-->

                <!--底部标识 start-->
                <div class="bottomFlag">
                    <p>
                        <i class="flag" style="background-color:#0E9949;"></i>
                        <span>近24小时</span>
                    </p>
                    <p>
                        <i class="flag" style="background-color:#1667C6;"></i>
                        <span>上24小时</span>
                    </p>
                </div>
                <!--底部标识 end-->
            </div>

            <!--历史数据图-->
            <div class="historyStyle">
                <!--title start-->
                <div>
                    <div style="float:left;">
                        <i class="rectangle"></i>
                        <span class="titleFont">历史数据</span>
                    </div>
                    <div class="optionCon">
                        <span>Timeline:</span>
                        <el-select v-model="selectValue" class="selectStyle" @change="selectChange">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clear"></div>
                </div>
                <!--title end-->

                <!--历史数据图 start-->
                <div id="historyChart" class="chart"></div>
                <!--历史数据图 end-->

                <!--底部标识 start-->
                <div class="bottomFlag">
                    <p>
                        <i class="flag" style="background-color:#0E9949;"></i>
                        <span>笔单价</span>
                    </p>
                    <p>
                        <i class="flag" style="background-color:#1667C6;"></i>
                        <span>日交易金额</span>
                    </p>
                </div>
                <!--底部标识 end-->
            </div>
        </div>
    </div>
</template>

<style scoped>

    #container{
        font-size:16px;
        position: relative;
        width:100%;
        min-height:614px;
    }

    /*顶部样式设置*/
    .head{
        width:100%;
        background-color:transparent;
        padding-bottom:20px;
        /*border-bottom:1px solid #EAF0F4;*/
    }
    /*顶部字体*/
    .headIcon{
        display:inline-block;
        width:40px;
        height:40px;
        background-image: url('../../../../assets/store3-@3x.png');
        background-size:100% 100%;
        vertical-align: middle;
        margin-right: 15px;
    }
    .headFont{
        font-weight:bold;
        font-size:18px;
        color:#333333;
        font-style:normal;
    }

    /*主体部分*/
    .echartsContainer{
        background-color: rgb(255,255,255);
    }

    /*实时数据部分*/
    .realStyle{
        padding-top:20px;
        padding-left:20px;
        /*padding-bottom:18px;*/
        border-bottom:1px solid #EAF0F4;
        position: relative;
    }
    .rectangle{
       display:inline-block;
        width:6px;
        height:20px;
        background-color: #009C42;
        margin-right: 6px;
        vertical-align: bottom;
    }
    .titleFont{
        margin:0;
        font-size:16px;
        color:#333;
        font-weight: bold;
    }

    /*实时数据折线图部分*/
    .chart{
        display: inline-block;
        width:90%;
        height:270px;
        /*margin-top:-30px;*/
    }

    /*文字说明部分*/
    .bottomFlag{
        font-size:12px;
        color:#333;
        float:right;
        position:absolute;
        top:72%;
        left:90%;
    }

    .flag{
        width:16px;
        height:16px;
        display:inline-block;
        vertical-align: middle;
    }

    /*历史数据部分*/

    .historyStyle{
        padding-top:20px;
        padding-left:20px;
        /*padding-bottom:18px;*/
        /*border-bottom:1px solid #EAF0F4;*/
        position: relative;
    }

    /*下拉选择框部分*/
    .optionCon{
        float:right;
        font-size:14px;
        color:#333;
        margin-right:60px;
        z-index:100;
    }
    .optionCon .selectStyle{
        width:88px;
        height:31px;
        border-radius: 100px ;
    }
    /*.optionCon .el-input__inner{*/
        /*width:88px;*/
        /*height:31px;*/
        /*border-radius: 100px ;*/
        /*color:#333;*/
        /*font-size:14px;*/
        /*background-color:rgba(219,216,216,1);*/
    /*}*/
    .clear{
        clear:both;
    }
</style>

<script>
    import * as Mixins from '../../../../jslib/mixin'
    import staticloadconfig from './staticloadconfig.json'
    import * as requestUrl from './requestUrl'

    export default{
        name:'TransCenterTransStatistics',
        mixins:[Mixins.AuthMixin,Mixins.StaticDataLoad,Mixins.PropertyInit,Mixins.ShowWatcher],
        data(){
            return {
                timer:null,
                staticLoadConfig: staticloadconfig,
                /*近24小时数据*/
                amt24:[],
                /*上24小时数据*/
                amt48:[],
                /*X轴24小时坐标*/
                time24:[],
                /*历史交易日期*/
                dateHis:[],
                /*交易金额*/
                transAmt:[],
                /*笔单价*/
                price:[],
                options:[
                    {
                        value:"0",
                        label:"7days"
                    },
                    {
                        value:"1",
                        label:"30days"
                    }
                ],
                selectValue:'0'
            }
        },
        methods:{
            /*实时数据获取*/
            realTimeData(){
                let _this=this;
                this.$ajaxPromise(requestUrl.realQuery,{},"POST",true).then(function(resp){
                    if(resp.code="0000"){
                        console.log(resp,"实时数据获取成功");
                        _this.amt24=resp.amt24;
                        _this.amt48=resp.amt48;
                        _this.time24=resp.time24;
                        /*化折线图*/
                        _this.realTimeChart();
                    }else{
                        console.log("实时数据获取失败");
                    }
                });
            },
            /*实时数据折线图勾画*/
            realTimeChart(){
                let myChart=this.$echarts.init(document.getElementById('realTimeChart'));
                let _this=this;
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: _this.time24
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'近24小时',
                            type:'line',
                            itemStyle : {
                                normal : {
                                    color:'#0E9949',
                                    lineStyle:{
                                        color:'#0E9949'
                                    }
                                }
                            },
                            data:_this.amt24
                        },
                        {
                            name:'上24小时',
                            type:'line',
                            itemStyle : {
                                normal : {
                                    color:'#1667C6',
                                    lineStyle:{
                                        color:'#1667C6'
                                    }
                                }
                            },
                            data:_this.amt48
                        }
                    ]
                });
            },
            /*日期格式转换  yyyymmdd转换为yyyy年mm月dd日*/
            dateChange(a){
                let str= a.toString();
                let b='';
                b= str.substring(0,4)+'年';
                if(str[4]=='0'){
                    b=b+str[5]+'月';
                }else{
                    b=b+str.substring(4,6)+'月';
                }
                if(str[6]=='0'){
                    b=b+str[7]+'日';
                }else{
                    b=b+str.substring(6,8)+'日';
                }
                return b;
            },
            /*历史数据获取*/
            historyTimeData(){
                let _this=this;
                this.$ajaxPromise(requestUrl.historyQuery,{dateType:"0"},"POST",true).then(function(resp){
                    if(resp.code="0000"){
                        console.log(resp,"历史数据获取成功");
                        let that=_this;
                        resp.dateHis.forEach(function(val,i,arr){
                            arr[i]=that.dateChange(arr[i]);
                        });
                        _this.dateHis=resp.dateHis;
                        _this.transAmt=resp.transAmt;
                        _this.price=resp.price;
                        /*画折线图*/
                        _this.historyChart();
                    }else{
                        console.log("历史数据获取失败");
                    }
                });
            },
            /*历史数据*/
            historyChart(){
                let myChart=this.$echarts.init(document.getElementById('historyChart'));
                let _this=this;
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: _this.dateHis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'日交易金额',
                            type:'line',
                            itemStyle : {
                                normal : {
                                    color:'#1667C6',
                                    lineStyle:{
                                        color:'#1667C6'
                                    }
                                }
                            },
                            data:_this.transAmt
                        },
                        {
                            name:'笔单价',
                            type:'line',
                            itemStyle : {
                                normal : {
                                    color:'#0E9949',
                                    lineStyle:{
                                        color:'#0E9949'
                                    }
                                }
                            },
                            data:_this.price
                        }
                    ]
                });
            },
            /*计时器*/
            startTime(){
                let today=new Date();
                let h=today.getHours();
                let m=today.getMinutes();
                let s=today.getSeconds();
                // add a zero in front of numbers<10
                m=this.checkTime(m);
                s=this.checkTime(s);
                if(m=="00"&&s=="00"){
                    console.log(h+":"+m+":"+s,'整点');
                    /*当整点的时候，调用实时数据查询接口查询最新数据，更新页面*/
                    this.realTimeData();
                }
                this.timer=setTimeout(this.startTime,1000);
            },
            /*小于10的数字补全零*/
            checkTime(i){
                if (i<10)
                {i="0" + i}
                return i
            },
            /*历史数据下拉框选项切换时触发*/
            selectChange(value){
                console.log(value,'seletValue');
                let _this=this;
                this.$ajaxPromise(requestUrl.historyQuery,{dateType:value},"POST",true).then(function(resp){
                    if(resp.code="0000"){
                        console.log(resp,"历史数据获取成功");
                        _this.dateHis=resp.dateHis;
                        _this.transAmt=resp.transAmt;
                        _this.price=resp.price;
                        /*画折线图*/
                        _this.historyChart();
                    }else{
                        console.log("历史数据获取失败");
                    }
                });
            }
        },
        created(){

        },
        /*待页面dom渲染完成的阶段调用*/
        mounted(){
            this.realTimeData();
            this.historyTimeData();
            this.startTime();
        },
        destroyed(){
            console.log("清除计时器");
            clearTimeout(this.timer);
        }
    }
</script>
