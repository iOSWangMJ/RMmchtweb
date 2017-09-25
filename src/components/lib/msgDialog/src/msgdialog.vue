<template>
    <div class="container dialog-fade-enter-active" v-if="isShow">
        <div class="dialogCon">
            <div :class="messageClass"></div>
            <span>{{message}}</span>
        </div>
    </div>
</template>

<style scoped>
    .container{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.2);
    }
    .dialogCon{
        width:280px;
        height:161px;
        position:absolute;
        top:220px;
        left:40%;
        background-color: #fff;
        border-radius: 8px;
        text-align: center;
        color:#202020;
        font-size:21px;
    }
    .successImage{
        width:60px;
        height:60px;
        margin:auto;
        margin-top:30px;
        margin-bottom:20px;
        background-image:url('../../../../assets/Success@2x.png');
        background-size:100% 100%;
    }
    .errImage{
        width:60px;
        height:60px;
        margin:auto;
        margin-top:30px;
        margin-bottom:20px;
        background-image:url('../../../../assets/error.png');
        background-size:100% 100%;
    }
</style>

<script>
    export default{
        name:"MsgDialog",
        data(){
            return {

            }
        },
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            messageClass:{
                type:String,
                default:'successImage'
            },
            message:{
                type:String,
                default:'操作成功'
            }
        },
        methods:{

        }
    }
</script>
