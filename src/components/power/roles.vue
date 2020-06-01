<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" class="addRole">添加角色</el-button>
            <el-table
             :data="roleList"
             style="width: 100%"
             stripe
             border>
               <el-table-column type="expand" width="60">
                    <template slot-scope="scope">
                      <el-row :class="['bdbottom',index==0? 'bdtop': '']" v-for="(item,index) in scope.row.children" :key="item.id">
                          <el-col :span="5">
                              <el-tag closable @close="handleClose(scope.row.id,item.id)">{{item.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span="19">
                                <el-row v-for="(childItem,childIndex) in item.children" :key="childItem.id" :class="[childIndex == 0? '':'bdtop']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="handleClose(scope.row.id,childItem.id)">{{childItem.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(childItem2,childIndex2) in childItem.children" 
                                                :key="childItem2.id" 
                                                :class="[childIndex2 == 0? '':'bdtop']" type="warning" 
                                                closable
                                                @close="handleClose(scope.row.id,childItem2.id)">
                                            {{childItem2.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                          </el-col>
                      </el-row>
                    </template>
               </el-table-column>
               <el-table-column type="index" label="#"></el-table-column>
               <el-table-column prop="roleName"  label="角色名称"  width="180"></el-table-column>
               <el-table-column prop="roleDesc"  label="角色描述"></el-table-column>
               <el-table-column prop="level" label="操作" width="280">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="handleSetRightDialog(scope.row)">分配</el-button>
                </template>
               </el-table-column>
            </el-table>
        </el-card>
         <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="handleSetClose">
             <el-tree 
             :data="setRoleList" 
             :props="treeProps" 
             ref="treeRef"
             show-checkbox
             default-expand-all 
             :default-checked-keys="defaultKeys" 
             node-key="id"></el-tree>
             <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="setRole">确认</el-button>
             </span>
         </el-dialog>
    </div>
</template>

<script>
export default {
    name:"roles",
    data(){
        return{
            roleList:[],
            setRightDialogVisible:false,
            setRoleList:[],
            treeProps:{
                label:'authName',
                childrem:'children'
            },
            defaultKeys:[],
            currentId:''
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        async getRoleList(){
            const {data:res} = await this.$axios.get('/roles')
            if(res.meta.status !== 200){
                this.$message.error("获取角色列表失败")
            }
            this.roleList = res.data
        },
        async handleClose(roleId,id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户权限,是否继续?','提示',{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                return this.$message.info("已取消删除")
            }
            const {data:res} = await this.$axios.delete(`roles/${roleId}/rights/${id}`)
            if(res.meta.status !== 200){
                return this.$message.error('删除权限失败')
            }
            this.getRoleList()
            this.$message.success("删除权限成功")
        },
        async handleSetRightDialog(node){
            this.setRightDialogVisible = true
            const {data:res} = await this.$axios.get('rights/tree')
            if(res.meta.status !== 200){
                return this.$message.error("获取权限列表失败")
            }
            this.setRoleList = res.data
            this.getDefaultKeys(node,this.defaultKeys)
            this.currentId = node.id
            console.log(this.currentId)
        },
        getDefaultKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getDefaultKeys(item,arr)
            })
        },
        handleSetClose(){
            this.defaultKeys = []
        },
        async setRole(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const {data:res} = await this.$axios.post(`roles/${this.currentId}/rights`,{
                rids:idStr
            })
            if(res.meta.status !== 200){
                return this.$message.error("分配权限失败")
            }
            this.getRoleList()
            this.$message.success("分配权限成功")
            this.setRightDialogVisible = false
        }
    }
}
</script>

<style scoped>
   .addRole{
       margin-bottom:10px;
   }
   .el-tag{
       margin:7px;
   }
   .bdtop{
       border-top:1px solid rgb(235, 235, 235)
   }
   .bdbottom{
       border-bottom:1px solid rgb(235,235, 235)
   }
   .el-row{
       display: flex;
       align-items: center;
   }
</style>