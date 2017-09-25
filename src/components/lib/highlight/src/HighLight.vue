<template>
    <div>
      <el-row>

          <pre style="margin-top: -10px">
            <slot name="code"></slot>
          </pre>


      </el-row>

    </div>

</template>
<style scoped>

</style>
<script>
  import hi from '../../../../tools/highlight/highlight'
  import hlcss from '../../../../tools/highlight/styles/github.css'
  import $ from 'jquery'

  export default{
    data(){
      return{
        class:'hello vue'
      }
    },
//    props: {
//      /**布局-默认为default*/
//      hClass: {
//        type: String,
//        required: true
//      },
//      code: {
//        type: String,
//        required: true
//      },
//    },
    mounted () {
      hljs.initHighlightingOnLoad()
      $(function () { $('pre code').each(function (i, block) { hljs.highlightBlock(block) }) })
    }
  }

</script>
