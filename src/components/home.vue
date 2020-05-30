<template>
    <el-container class="home">
      <el-header>
          <div class="logo">
              <img src="~assets/logo.png">
              <span>后台管理系统</span>
          </div>
          <el-button type="info" @click="handleOut">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'60px':'200px'">
            <div class="toggle-btn" @click="handleToggle">|||</div>
            <el-menu
              class="el-menu-vertical-demo"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              unique-opened 
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              :default-active="isActive">
              <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.authName}}</span>
                </template>
                  <el-menu-item :index="childItem.path + ''" v-for="childItem in item.children" :key="childItem.index" @click="handleActive(childItem.path)">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{childItem.authName}}</span>
                    </template>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view :key="$route.fullPath"></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
    name:"home",
    data(){
        return{
            menuList:[],
            isCollapse:false,
            isActive:window.sessionStorage.getItem('path')
        }
    },
    created(){
        this.getMenuList()
    },
    methods:{
        handleOut(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        handleToggle(){
            this.isCollapse = !this.isCollapse
        },
        async getMenuList(){
            const {data:res} = await this.$axios.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        handleActive(childItemPath){
          window.sessionStorage.setItem('path',childItemPath)
        }
    }
}
</script>

<style lang="scss" scoped>
    .home{
        height:100%;
       .el-header{
            background-color: #373d41;
            color: #fff;
            text-align: center;
            line-height: 60px;
            display: flex;
            justify-content: space-between;
            align-items:center;
            .logo{
                img{
                    width:40px;
                    height:40px;
                    vertical-align:text-bottom;
                }
                span{
                    color:#fff;
                    font-size:20px;
                    margin-left:15px;
                }
            }
        }

      .el-aside {
        background-color: #333744;
        color: #fff;
        text-align: center;
        line-height: 200px;
        .el-menu-item{
            font-size:12px;
            margin-left:10px;
        }
        .toggle-btn{
            background:#4a5064;
            line-height:30px;
            font-size:12px;
            letter-spacing: 2px;
            text-align:center;
            font-weight:bold;
            cursor:pointer;
        }
      }
      .el-main {
        background-color: #eaedf1;
        color: #333;
      }
    }
</style>