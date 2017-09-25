<template>
    <loading-bar
        :on-error-done="errorDone"
        :on-progress-done="progressDone"
        :progress="progress"
        :direction="direction"
        :error="error" >
    </loading-bar>
</template>
<style>

</style>
<script>

    export default{
        name:'LoadBar',
        data(){
            return{

            }
        },
        props: {
            direction: {
                type: String,
                default: 'right'
            },
            error:{
                type: Boolean,
                default: false
            },
            progress:{
                type: Number,
                default: 0,
                required: true,
            }
        },
        methods:{
            errorDone(){

            },
            progressDone(){

            }
        },
    }
</script>
