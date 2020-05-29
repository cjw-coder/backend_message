<template>
    <div class="login">
        <div class="login_container">
            <div class="login_logo">
                <img src="~assets/logo.png" alt="">
            </div>
            <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                    <el-button type="info" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name:"login",
    data(){
        return{
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginRules:{
                username:[
                    {required:true,message:"请输入账号信息",trigger:"blur"},
                    {min:3,max:10,message:"长度在 3 到 10 个字符",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入登录密码",trigger:"blur"},
                    {min:6,max:15,message:"长度在 6 到 15 个字符",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        handleReset(){
            this.$refs.loginFormRef.resetFields()
        },
        handleLogin(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$axios.post('login',this.loginForm)
                if(res.meta.status !== 200) return this.$message.error("输入用户名和密码有误")
                this.$message.success("登录成功")
                window.sessionStorage.setItem("token",res.data.token)
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style scoped>
    .login{
        background:#2b4b6b;
        height:100%;
    }
    .login_container{
        width:450px;
        height:300px;
        background:#fff;
        border-radius:6px;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        box-shadow:10px 10px 0 rgba(0,0,0,0.2);
    }
    .login_logo{
        height:100px;
        width:100px;
        border-radius:100%;
        border:1px solid rgba(0,0,0,0.2);
        overflow: hidden;
        background:rgba(125,125,125,0.2);
        box-shadow:1px 1px 2px 1px rgba(0,0,0,0.1);
        position:absolute;
        left:50%;
        top:-14%;
        transform: translate(-50%);
    }
    img{
        width:100%;
        height:100%;
    }
    .login_form{
        position:absolute;
        width:100%;
        padding:0 40px;
        box-sizing: border-box;
        top:30%;
    }
    .btns{
        float:right;
        padding-right:10px;
    }
</style>