<template>
  <div class="add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
        <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form 
        :model="addForm" 
        :rules="addFormRules" 
        ref="addFormRef" 
        label-width="100px"
        label-position="top">
          <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="handleTabLeave" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                :options="cateList" 
                :props="cateProps" 
                v-model="addForm.goods_cat"
                @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox v-for="(item,index) in item.attr_vals" :label="item" :key="index" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <el-dialog
                title="预览图片"
                :visible.sync="previewDialogVisible"
                width="50%">
                <img :src="previewPath" class="previewImg">
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" @click="handleAddForm">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
    name:"add",
    data(){
        return{
            activeIndex:'0',
            addForm:{
              goods_name:"",
              goods_price:0,
              goods_number:0,
              goods_weigt:0,
              goods_cat:[],
              pics:[],
              goods_introduce:"",
              attrs:[]
            },
            addFormRules:{
              goods_name:[
                {required:true,message:"请输入商品名称",trigger:"blur"}
              ],
              goods_price:[
                {required:true,message:"请输入商品价格",trigger:"blur"}
              ],
              goods_number:[
                {required:true,message:"请输入商品数量",trigger:"blur"}
              ],
              goods_weight:[
                {required:true,message:"请输入商品重量",trigger:"blur"}
              ],
              goods_cat:[
                {required:true,message:"请选择商品分类",trigger:"blur"}
              ]
            },
            cateList:[],
            cateProps:{
              label:"cat_name",
              value:"cat_id",
              children:"children",
              expandTrigger:"hover"
            },
            manyList:[],
            attrVals:[],
            onlyList:[],
            headerObj:{
              Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            previewDialogVisible:false
        }
    },
    created(){
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$axios.get('categories')
        if(res.meta.status !== 200){
          return this.$message.error("获取商品分类失败")
        }
        this.cateList = res.data
      },
      handleChange(){
        if(this.addForm.goods_cat.length !== 3){
          this.addForm.goods_cat = []
        }
      },
      handleTabLeave(newTab,oldTab){
        if(oldTab === "0" && this.addForm.goods_cat.length !== 3 ){
          this.$message.error("请选择分类信息")
          return false
        }
      },
      async handleTabClick(){
        if(this.activeIndex === "1"){
          const {data:res} = await this.$axios.get(`categories/${this.catId}/attributes`,{
            params:{sel:"many"}
          })
          if(res.meta.status !== 200){
            return this.$message.error("获取商品参数列表失败")
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
          })
          this.manyList = res.data
        }
        else if(this.activeIndex === "2"){
          const {data:res} = await this.$axios.get(`categories/${this.catId}/attributes`,{
            params:{sel:"only"}
          })
          if(res.meta.status !== 200){
            return this.$message.error("获取商品属性列表失败")
          }
          this.onlyList = res.data
        }
      },
      handlePreview(file){
        this.previewPath = file.response.data.url
        this.previewDialogVisible = true
      },
      handleRemove(file){
        const filePath = file.response.data.tmp_path
        const index = this.addForm.pics.findIndex(item => {
          item.pic === filePath
        })
        this.addForm.pics.splice(index,1)
      },
      handleSuccess(response){
        const picInfo = {pic:response.data.tmp_path}
        this.addForm.pics.push(picInfo)
      },
      handleAddForm(){
        this.$refs.addFormRef.validate(async valid => {
          if(!valid){
            return this.$message.error("请填写必要的表单项")
          }
          this.manyList.forEach(item => {
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyList.forEach(item => {
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          
          const {data:res} = await this.$axios.post('goods',form)
          if(res.meta.status !== 201){
            return this.$message.error("添加商品失败")
          }
          this.$message.success("添加商品成功")
          this.$router.push('/goods')
        })
      }
    },
    computed:{
      catId(){
        if(this.addForm.goods_cat.length === 3){
            return this.addForm.goods_cat[2]
        }
        return null
      }
    }
}
</script>

<style scoped>
  .el-checkbox{
    margin:0 10px 0 0 !important;
  }
  .previewImg{
    width:100%;
  }
  .el-button{
    margin:16px 0;
  }
</style>
