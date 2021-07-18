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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search"  @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
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
                    // 当前页码
                    pagenum: 0,
                    // 每页显示条数
                    pagesize: 0
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
                    goods: [{ goods_id: 926, cat_id: null, goods_name: '海外购-鞋子1', goods_price: 100, goods_weight: 20, add_time: 15143454877 }, { goods_id: 927, cat_id: null, goods_name: '海外购-鞋子2', goods_price: 120, goods_weight: 30, add_time: 15143454977 }, { goods_id: 928, cat_id: null, goods_name: '海外购-鞋子3', goods_price: 130, goods_weight: 40, add_time: 15143454677 }, { goods_id: 929, cat_id: null, goods_name: '海外购-鞋子4', goods_price: 140, goods_weight: 50, add_time: 15143411177 }],
                    pagenum: 1,
                    pagesize: 3,
                    total: 4
                }
                // this.goodsList = res.goods
                // 初始化时处理
                if (this.total === 0) {
                    this.queryInfo.pagenum = res.pagenum
                    this.queryInfo.pagesize = res.pagesize
                }
                // 搜索筛选
                if (this.queryInfo.query !== '') {
                    for (var i = 0; i < res.goods.length; i++) {
                        if (res.goods[i].goods_name === this.queryInfo.query) {
                            this.goodsList = res.goods.slice(i, i + 1)
                        }
                    }
                } else {
                    this.goodsList = res.goods.slice((this.queryInfo.pagenum - 1) * (this.queryInfo.pagesize), (this.queryInfo.pagenum) * (this.queryInfo.pagesize))
                }
                // 删除时筛选
                this.total = res.total
                this.$message.success('获取商品列表成功！')
            },
            // 监听pagesize改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            // 监听pagenum改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            removeById(row) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    for (var i = 0; i < this.goodsList.length; i++) {
                        if (this.goodsList[i].goods_name === row.goods_name) {
                            this.goodsList.splice(i, 1)
                        }
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            goAddpage() {
                // 通过路由对象$router实现跳转
                this.$router.push('./goods/add')
            }
        }
    }
</script>

<style>

</style>
