<template>
  <div class="users">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleDialogVisible">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="userList"
          border
          stripe
          >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch
              v-model="scope.row.mg_state"
              active-color="#1E90FF"
              inactive-color="#DCDCDC"
              @change="handleChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="handleSetRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
          </el-table-column>
        </el-table>
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
      <el-dialog
          title="添加用户"
          :visible.sync="isDialogVisible"
          width="50%" @close="handleClose">
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddForm">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="编辑用户"
          :visible.sync="editDialogVisible"
          width="50%" @close="handleEditClose">
          <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
            <el-form-item label="用户名">
              <el-input el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditForm">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="分配权限"
          :visible.sync="setRoleDialogVisible"
          width="50%"
          @close="handleCloseSetRole">
          <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
            <div>
              <p>当前用户:{{roleInfo.username}}</p>
              <p>当前角色:{{roleInfo.role_name}}</p>
            </div>
            <el-select v-model="selRoleId" placeholder="--选择角色--">
              <el-option v-for="item in roleList.data" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    name:"users",
    data(){
      var checkEmail = (rule,value,cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error("请输入合法的邮箱"))
      }
      var checkMobile = (rule,value,cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return cb()
        }
        cb(new Error("请输入合法的手机号"))
      }
      return{
        queryInfo:{
          query:"",
          pagenum:1,
          pagesize:2
          },
        userList:[],
        total:0,
        isDialogVisible:false,
        addForm:{},
        addFormRules:{
          username:[
            {required:true,message:"请输入用户名",tigger:"blur"},
            {min:3,max:10,message:"用户名长度在 3 到 10 个字符之间"}
          ],
          password:[
            {required:true,message:"请输入用户密码",tigger:"blur"},
            {min:6,max:15,message:"用户名长度在 6 到 15 个字符之间"}
          ],
          email:[
            {required:true,message:"请输入用户邮箱",tigger:"blur"},
            {validator:checkEmail}
          ],
          mobile:[
            {required:true,message:"请输入手机号码",tigger:"blur"},
            {validator:checkMobile}
          ]
        },
        editDialogVisible:false,
        editForm:{},
        editFormRules:{
          email:[
            {required:true,message:"请输入用户邮箱",tigger:"blur"},
            {validator:checkEmail}
          ],
          mobile:[
            {required:true,message:"请输入手机号码",tigger:"blur"},
            {validator:checkMobile}
          ]
        },
        setRoleDialogVisible:false,
        roleInfo:{},
        roleList:[],
        selRoleId:''
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      async getUserList(){
        const {data:res} = await this.$axios.get('users',{
          params:this.queryInfo
        })
        if(res.meta.status !== 200){
          return this.$message.error("获取用户列表失败")
        }
        this.userList = res.data.users,
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async handleChange(userInfo){
        const {data:res} = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if(res.meta.status !== 200){
          return this.$message.error("更改失败")
        }
        this.$message.success("更改成功")
      },
      handleDialogVisible(){
        this.isDialogVisible = true
      },
      handleClose(){
        this.$refs.addFormRef.resetFields()
      },
      handleAddForm(){
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$axios.post('users',this.addForm)
          if(res.meta.status !== 201){
            return this.$message.error("添加失败")
          }
          this.$message.success("添加成功")
          this.isDialogVisible  = false
        })
      },
      handleEditClose(){
        this.$refs.editFormRef.resetFields()
      },
      async handleEditDialog(id){
        this.editDialogVisible = true
        const {data:res} = await this.$axios.get(`users/${id}`)
        this.editForm = res.data
        this.editDialogVisible = true
      },
      handleEditForm(){
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$axios.put(`users/${this.editForm.id}`,{
            email:this.editForm.email,mobile:this.editForm.mobile
          })
          if(res.meta.status !== 200){
            return this.$message.error("修改失败")
          }
          this.$message.success("修改成功")
          this.editDialogVisible = false
          this.getUserList()
        })
      },
      async open(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        },
        ).catch(err => err)
        if(confirmResult !== "confirm"){
          return this.$message.info("已取消删除")
        }
        console.log(id)
        const {data:res} = await this.$axios.delete(`/users/${id}`)
        if(res.meta.status !== 200){
          return this.$message.error("删除失败")
        }
        this.$message.success("删除成功")
        this.getUserList()
    },
    async handleSetRole(roleInfo){
      this.setRoleDialogVisible = true
      this.roleInfo= roleInfo
      const {data:res} = await this.$axios.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error("获取角色列表失败")
      }
      this.roleList = res
    },
    async saveRoleInfo(){
      if(!this.selRoleId){
        return this.$message.error("请选择要分配的角色")
      }
      console.log(this.roleInfo.id)
      const {data:res} = await this.$axios.put(`users/${this.roleInfo.id}/role`,{
        rid:this.selRoleId
      })
      console.log(res)
      if(res.meta.status !== 200){
        this.$message.error("更新角色失败")
      }
      this.$message.success("更新角色成功")
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    handleCloseSetRole(){
      this.selRoleId = ''
      this.roleInfo = {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>