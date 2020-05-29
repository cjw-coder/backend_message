<template>
    <div>
        <h3>我是首页</h3>
        <el-button type="info" @click="handleOut">退出</el-button>
    </div>
</template>

<script>
export default {
    name:"home",
    methods:{
        handleOut(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style>

</style>