<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert 
            title="注意：只允许为第三方分类设置相关参数" 
            type="warning" 
            :closable ="false" 
            show-icon></el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader 
                    :options="cateList" 
                    :props="cateProps" 
                    v-model="selectedKeys"
                    @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleChange">
                <el-tab-pane label="动态参数" name="many">
                    <el-button :disabled="isDisabled" type="primary" size="mini" @click="addParamsDialogVisible = true">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button :disabled="isDisabled" type="primary" size="mini" @click="addParamsDialogVisible = true">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
            <el-table 
            :data="currentList"
            border
            stripe
            >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.id" class="attrVals" closable @close="handleDelAttr(index,scope.row)">
                            {{item}}
                        </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleRemove(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog 
        title="添加操作" 
        :visible.sync="addParamsDialogVisible" 
        width="50%"
        @close="addParamsDialogClose">   
            <el-form :rules="addParamsRules" :model="addForm" ref="addFormRef">
                <el-form-item prop="attr_name" :label="titleDialog">
                    <el-input v-model="addForm.attr_name" el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAddParams">确认</el-button>
             </span>
        </el-dialog>
        <el-dialog 
        title="修改操作"
         :visible.sync="editParamsDialogVisible" 
        width="50%"
        @close="editParamsDialogClose">
            <el-form :rules="editParamsRules" :model="editForm" ref="editFormRef">
                <el-form-item prop="attr_name" :label="titleDialog">
                    <el-input v-model="editForm.attr_name" el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleEditParams">确认</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:"params",
    data(){
        return{
            cateList:[],
            selectedKeys:[],
            cateProps:{
                value:"cat_id",
                label:"cat_name",
                children:"children"
            },
            activeName:'many',
            manyList:[],
            onlyList:[],
            addParamsDialogVisible:false,
            addParamsRules:{
                attr_name:[
                    {required:true,message:"请输入分类信息",trigger:"blur"},
                    {min:2,max:6,message:"长度在 2 到 6 个字符",trigger:"blur"}
                ]
            },
            addForm:{
                attr_name:"" 
            },
            editParamsDialogVisible:false,
            editParamsRules:{
                attr_name:[
                    {require:true,message:"请输入修改内容",trigger:"blur"},
                    {min:2,max:6,message:"长度在 2 到 6 个字符",trigger:"blur"}
                ]
            },
            editForm:{
                attr_name:""
            },
            attrId:0,
            attrVals:[]
        }
    },
    created(){
        this.getCateParamsList()
    },
    methods:{
        async getCateParamsList(){
            const {data:res} = await this.$axios.get('/categories')
            if(res.meta.status !== 200){
                this.$message.error("获取分类参数失败")
            }
            this.cateList = res.data
        },
        handleChange(){
            if(this.selectedKeys.length !== 3){
                this.selectedKeys = []
                this.onlyList = []
                this.manyList = []
                return
            }
            this.handleTabClick()
        },
        async handleTabClick(){
            const {data:res} = await this.$axios.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            this.onlyList = []
            this.manyList = []
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals.split(' ')
                item.inputVisible = false
                item.inputValue = ''
                if(item.attr_vals[0] == ''){
                    item.attr_vals = []
                }
            })
            if(this.activeName === "only"){
                this.onlyList = res.data
            }else{
                this.manyList = res.data
            }
        },
        handleAddParams(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$axios.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 201){
                    return this.$message.error("添加参数失败")
                }
                this.$message.success("添加参数成功")
                this.addParamsDialogVisible = false
                this.handleTabClick()
            })
        },
        addParamsDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        editParamsDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
        async handleEdit(attrId){
            this.attrId = attrId
            this.editParamsDialogVisible = true
            const {data:res} = await this.$axios.get(`categories/${this.cateId}/attributes/${attrId}`)
            this.editForm.attr_name = res.data.attr_name
        },
        async handleEditParams(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$axios.put(`categories/${this.cateId}/attributes/${this.attrId}`,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 200){
                    return this.$message.error("添加参数失败")
                }
                this.$message.success("添加参数成功")
                this.editParamsDialogVisible = false
                this.handleTabClick()
            })
        },
        async handleRemove(attr_id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数，是否继续?',
                '提示',
                {
                    confirmButtonText:"确认",
                    cancelButtonText:"取消",
                    type:"warning"
                }
            ).catch(err => err)
            if(confirmResult !== "confirm"){
                return this.$message.info("已取消删除")
            }
            const {data:res} = await this.$axios.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !== 200){
                return this.$message.error("删除参数失败")
            }
            this.handleTabClick()
        },
        showInput(scopeRow){
            scopeRow.inputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        handleInputConfirm(scopeRow){
            if(scopeRow.inputValue.trim().length === 0){
                scopeRow.inputValue = ''
                scopeRow.inputVisible = false
                return 
            }
            scopeRow.attr_vals.push(scopeRow.inputValue.trim())
            scopeRow.inputValue = ''
            scopeRow.inputVisible = false
            this.saveAttrVals(scopeRow)
        },
        async saveAttrVals(scopeRow){
            const {data:res} = await this.$axios.put(`categories/${this.cateId}/attributes/${scopeRow.attr_id}`,{
                attr_name:scopeRow.attr_name,
                attr_sel:scopeRow.attr_sel,
                attr_vals:scopeRow.attr_vals.join(' ')
            })
            if(res.meta.status !== 200){
                return this.$message.error("操作失败")
            }
        },
        handleDelAttr(index,scopeRow){
            scopeRow.attr_vals.splice(index,1)
            this.saveAttrVals(scopeRow)

        }
    },
    computed:{
        isDisabled(){
            if(this.selectedKeys.length !== 3){
                return true
            }
            return false
        },
        cateId(){
            if(this.selectedKeys.length == 3){
                return this.selectedKeys[2]
            }
            return null
        },
        currentList(){
            if(this.activeName == "only"){
                return this.onlyList
            }else{
                return this.manyList
            }
        },
        titleDialog(){
            if(this.activeName === "only"){
                return "静态属性:"
            }else{
                return "动态参数:"
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .cat_opt{
        margin:10px;
    }
    .attrVals{
        margin:10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin: 10px;
        vertical-align: bottom;
    }
</style>