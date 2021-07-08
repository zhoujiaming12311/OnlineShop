<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter=20>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary">添加商品</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 查询参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 商品列表
                goodslist: [],
                // 总数据条数
                total: 55
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            // 根据分页获取对应的商品列表
            async getGoodsList() {
                //   const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
                var res = {
                    goods: [{ goods_id: 926, cat_id: null, goods_name: '海外购-鞋子' }, { goods_id: 927, cat_id: null, goods_name: '海外购-鞋子2' }, { goods_id: 928, cat_id: null, goods_name: '海外购-鞋子3' }, { goods_id: 929, cat_id: null, goods_name: '海外购-鞋子4' }],
                    pagenum: '1',
                    total: 916
                }
                this.goodslist = res
                this.$message.success('获取商品列表成功！')
            }
        }
    }
</script>

<style>

</style>
