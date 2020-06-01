<template>
  <div class="cate">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-button type="primary" class="addCate" @click="showAdd">添加分类</el-button>
        <tree-table 
        :data="cateList" 
        :columns="cateColumns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table">
            <template slot="isOk" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <template slot="showLev" slot-scope="scope">
                <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="warning" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="success" v-else>三级</el-tag>
            </template>
            <template slot="operation" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
        </tree-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="AddCateClose">
        <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules">
            <el-form-item label="分类名称" prop="cat_name"> 
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <el-cascader
                :options="parentCateList" 
                :props="cascaderProps" 
                v-model="selectedKeys"
                @change="parentCateChanged"
                clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addCate">确认</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name:"cate",
    data(){
        return {
            cateList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            cateColumns:[
                {label:"分类名称",prop:"cat_name"},
                {label:"是否有效",type:"template",template:"isOk"},
                {label:"排序",type:"template",template:"showLev"},
                {label:"操作",type:"template",template:"operation"}
            ],
            addCateDialogVisible:false,
            addCateFormRules:{
                cat_name:[
                    {required:true,message:"请输入分类名称",trigger:"blur"},
                    {min:2,max:6,message:"长度在 2 到 6 个字符",trigger:"blur"}
                ]
            },
            parentCateList:[],
            selectedKeys:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:"hover",
                checkStrictly:"true"
            },
            addCateForm:{
                cat_name:"",
                cat_pid:0,
                cat_level:0
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$axios.get('/categories',{
                params:this.queryInfo
            })
            if(res.meta.status !== 200){
                this.$message.error("获取商品分类失败")
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAdd(){
            this.addCateDialogVisible = true
            this.showCateDialog() 
        },
        async showCateDialog(){
            const {data:res} = await this.$axios.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error("获取分类数据失败")       
            }
            this.parentCateList = res.data
            console.log(this.parentCateList)
        },
        parentCateChanged(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length > 0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$axios.post('categories',this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error("添加分类失败")
                }
                this.$message.success("添加分类成功")
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        AddCateClose(){
            this.addCateForm.cat_name = '',
            this.selectedKeys = []
        }
    }
}
</script>

<style lang="scss" scoped>
    .addCate{
       margin-bottom:10px;
   }
   .tree-table{
       margin:10px 0;
   }
</style>