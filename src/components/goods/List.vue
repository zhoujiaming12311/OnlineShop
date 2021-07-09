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

            <!-- table表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="操作" width="140px">
                    <template>
                         <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                         <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                goodsList: [],
                // 总数据条数
                total: 0
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
                    goods: [{ goods_id: 926, cat_id: null, goods_name: '海外购-鞋子1', goods_price: 100, goods_weight: 20 }, { goods_id: 927, cat_id: null, goods_name: '海外购-鞋子2', goods_price: 120, goods_weight: 30 }, { goods_id: 928, cat_id: null, goods_name: '海外购-鞋子3', goods_price: 130, goods_weight: 40 }, { goods_id: 929, cat_id: null, goods_name: '海外购-鞋子4', goods_price: 140, goods_weight: 50 }],
                    pagenum: '1',
                    total: 3
                }
                this.goodsList = res.goods
                this.total = res.goods.total
                this.$message.success('获取商品列表成功！')
            }
        }
    }
</script>

<style>

</style>
