<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <!-- 2.为echarts准备一个具备大小（宽高）的Dom -->
                    <div id="main" style="width:600px;height:400px;"></div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    // 1.导入echarts
    import * as echarts from 'echarts'
    // 导入lodash进行对象合并
    import _ from 'lodash'
    export default {
        data() {
            return {
                // 需要合并的对象
                option: {
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    legend: {
                        data: ['销量']
                    },
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                }
            }
        },
        // created：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
        created() {

        },
        // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
        mounted() {
            // 3.基于准备好的dom,初始化echarts的实例
            var myChart = echarts.init(document.getElementById('main'))
            // 4.指定图表的配置项和数据
            var res = {}
            const result = _.merge(res, this.option)
            // 5.展示数据
            myChart.setOption(result)
        },
        methods() {

        }
    }
</script>

<style lang="less" scoped>

</style>
