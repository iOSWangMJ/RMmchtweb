<template>
    <iframe :src="src" width="100%" height="100%">

    </iframe >
</template>
<style>

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        props: {
            src: {
                type: String,
                default:''
            },
        },
        mounted(){
            if(this.src.length == 0){
                this.src = this.$route.params.path
            }
        }
    }
</script>
