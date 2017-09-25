<template>
    <div>
        <el-progress :stroke-width="15" :percentage="percentage" status="status"></el-progress>
    </div>


</template>
<style>

</style>
<script>

    export default{
        name:'init-step',
        data(){
            return{

            }
        },
        props: {
            percentage:{
                type: Number,
                default: 0,
                required: true
            },
            status: {
                type: Number,
                default: 0,
                required: true
            }
        }

    }
</script>
