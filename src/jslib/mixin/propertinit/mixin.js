/**
 * Created by wwj on 2017/3/9.
 */

/***
 * 组件属性和基础方法初始化设定
 */
export default {
    data(){
        return {
            /**el-tree 默认props*/
            mixinTreeDefaultProps: {
                children: 'children',
                label: 'label'
            },
            /**默认分页组件数据对象*/
            mixinPagination:{
                /**默认每页数量*/
                pageSize: 10,
                /**初始数据量*/
                total:0,
                /**页码*/
                currentPage:1,
                /**可选每页数量*/
                pageSizeList:[10,30,50,100]
            },
        }
    },
    methods :{
        /**分页每页数量变化
         * 如果需要分页变化后立刻调用查询方法，组件中需声明handleQuery方法接受查询调用*/
        mixinPaginationSizeChange(size){
            this.mixinPagination.pageSize = size
            'handleQuery' in this ? this.handleQuery() : ''
        },
        /**分页页码变化
         * 如果需要分页变化后立刻调用查询方法，组件中需声明handleQuery方法接受查询调用*/
        mixinPaginationCurrentChange(currentPage){
            this.mixinPagination.currentPage = currentPage
            'handleQuery' in this ? this.handleQuery() : ''
        },
    }

}
