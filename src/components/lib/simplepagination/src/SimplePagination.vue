<template>
  <div id="SimplePagination">
    <el-button type="text" style="color:#009C42;padding:0;" @click="currentChange(1)" :disabled="currentPage== 1"> <<首页 </el-button>
    <el-button type="text" style="color:#009C42;padding:0;" @click="currentChange(current-1)" :disabled="currentPage<=1"> <上一页 </el-button>
    <span>&nbsp;&nbsp;第{{current}}页,共{{totalPages}}页&nbsp;&nbsp;</span>
    <el-button type="text" style="color:#009C42;padding:0;" @click="currentChange(current+1)" :disabled="currentPage>=totalPages"> 下一页> </el-button>
    <el-button type="text" style="color:#009C42;padding:0;" @click="currentChange(totalPages)" :disabled="currentPage==totalPages"> 尾页>> </el-button>
  </div>
</template>
<script>
export default {
  name: "SimplePagination",
  data: () => ({
    //   current: this.currentPage
  }),
  props:{
      currentPage:[Number,String],
      total:[Number,String],
      pageSize:{
          type:[Number,String],
          default:10
      }
  },

  computed:{
      current(){

        return  this.currentPage >this.totalPages ? this.totalPages:this.currentPage
    },
    totalPages(){
        return Math.ceil(this.total/this.pageSize)
    }
  },
  watch:{
    currentPage(val){
          this.current
    }
  },
  methods: {
    currentChange(currentPage) {
        this.$emit('update:currentPage',(currentPage))
        this.$emit("currentChange",(currentPage))
    }
  }
}
</script>
<style lang="scss" scoped>
#SimplePagination{
      font-size:12px;
      float:right;
    //   margin-right:20px;
      margin-top: 10px;
      clear: both;
  }
  #SimplePagination button{
      font-size:12px;
  }
</style>
