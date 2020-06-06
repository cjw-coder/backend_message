<template>
    <div class="report">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div style="width:1200px;height:500px" ref="main"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash' 
export default {
    name:"report",
      data() {
          return {
            options: {
              title: {
                text: "用户来源"
              },
              tooltip: {
                trigger:'axis',
                axisPointer:{
                  type:'cross',
                  label:{
                    backgroundColor:'#E9EEF3'
                  }
                }
              },
              grid: {
                left:'3%',
                right:'4%',
                bottom:'3%',
                containLabel:true
              },
              xAxis: [
                {
                  boundaryGap:false
                }
              ],
              yAxis: [
                {
                  type:'value'
                }
              ]
            }
        }
    },
    async mounted(){
        const myChart = echarts.init(this.$refs.main)
        const {data:res} = await this.$axios.get('reports/type/1')
         if(res.meta.status !== 200){
             return this.$message.error("获取图表数据失败")
         }
         const result = _.merge(res.data,this.options)
        myChart.setOption(result)
    }
}
</script>

<style scoped>

</style>