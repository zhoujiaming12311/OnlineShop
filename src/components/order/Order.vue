<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="orderList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_name"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status !== '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                    <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
            <!-- 修改地址的对话框 -->
            <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%"  @close="addressDialogClosed">
                <!-- 添加参数的对话框 -->
                <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                    <el-form-item label="省市区/县" prop="address1">
                        <!-- 级联选择器 -->
                        <el-cascader v-model="addressForm.address1" :options="cityData" :props="cityProps" clearable
                            change-on-select>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 展示物流进度的对话框 -->
            <el-dialog title="物流进度" :visible.sync="progessVisible" width="50%">
                <div class="block">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in progessInfo" :key="index" :timestamp="activity.ftime">
                            {{activity.context}}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 查询对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 3
                },
                // 商品分类的数据列表，默认为空
                orderList: [],
                // 总数据条数
                total: 0,
                addressVisible: false,
                // 添加参数的数据对象
                addressForm: {
                    address1: [],
                    address2: ''
                },
                // 添加表单的验证规则对象
                addressFormRules: {
                    address1: [
                        { required: true, message: '请选择省市区/县', trigger: 'blur' }
                    ],
                    address2: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' }
                    ]
                },
                cityData: [{
                    city_id: 11,
                    city_name: '北京',
                    children: [
                        {
                            city_id: 111,
                            city_name: '朝阳区'
                        },
                        {
                            city_id: 112,
                            city_name: '顺义区'
                        },
                        {
                            city_id: 113,
                            city_name: '东城区'
                        }
                    ]
                }, {
                    city_id: 21,
                    city_name: '哈尔滨',
                    children: [
                        {
                            city_id: 211,
                            city_name: '道里区'
                        },
                        {
                            city_id: 212,
                            city_name: '道外区'
                        },
                        {
                            city_id: 213,
                            city_name: '南岗区'
                        }
                    ]
                }],
                // 级联选择器属性
                cityProps: {
                    // 决定显示属性
                    label: 'city_name',
                    // 决定选中的值
                    value: 'city_id',
                    // 决定哪个属性实现父子节点的嵌套
                    children: 'children'
                },
                // 物流对话框显示/隐藏
                progessVisible: false,
                // 物流对话框信息
                progessInfo: []
            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            getOrderList() {
                var res = {
                    goods: [
                        { order_id: 47, user_id: 133, order_name: 'itcast-59e5702d7983d', order_price: 322, order_pay: 1, is_send: '否', trade_no: '', oerder_fapiao_title: '个人', oerder_fapiao_company: '', order_fapiao_content: '办公用品', consignee_addr: 'a:7:北京海淀305', pay_status: '1', create_time: 15143454877, update_time: 15143454877 },
                        { order_id: 48, user_id: 134, order_name: 'itcast-59e5702d7983d', order_price: 323, order_pay: 1, is_send: '否', trade_no: '', oerder_fapiao_title: '个人', oerder_fapiao_company: '', order_fapiao_content: '办公用品', consignee_addr: 'a:7:北京海淀305', pay_status: '1', create_time: 15143454877, update_time: 15143454877 },
                        { order_id: 49, user_id: 135, order_name: 'itcast-59e5702d7983d', order_price: 324, order_pay: 1, is_send: '否', trade_no: '', oerder_fapiao_title: '个人', oerder_fapiao_company: '', order_fapiao_content: '办公用品', consignee_addr: 'a:7:北京海淀305', pay_status: '1', create_time: 15143454877, update_time: 15143454877 },
                        { order_id: 50, user_id: 136, order_name: 'itcast-59e5702d7983d', order_price: 325, order_pay: 1, is_send: '否', trade_no: '', oerder_fapiao_title: '个人', oerder_fapiao_company: '', order_fapiao_content: '办公用品', consignee_addr: 'a:7:北京海淀305', pay_status: '1', create_time: 15143454877, update_time: 15143454877 }
                    ],
                    pagenum: 1,
                    total: 4
                }
                this.orderList = res.goods.slice((this.queryInfo.pagenum - 1) * (this.queryInfo.pagesize), (this.queryInfo.pagenum) * (this.queryInfo.pagesize))
                this.total = res.total
                this.$message.success('获取商品列表成功！')
            },
            // 监听pagesize改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            // 监听pagenum改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            // 展示修改地址的对话框
            showBox() {
                this.addressVisible = true
            },
            // 添加参数
            addParams() {
                this.$refs.addressFormRef.validate(valid => {
                    if (!valid) return
                    this.addressVisible = false
                })
            },
            // 关闭对话框
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields()
            },
            showProgressBox() {
                this.progessInfo = [{
                    time: '2018-05-10 09:39:00',
                    ftime: '2018-05-10 09:39:00',
                    context: '已签收，感谢您使用顺丰',
                    location: ''
                }, {
                    time: '2017-05-10 08:39:00',
                    ftime: '2017-05-10 08:39:00',
                    context: '已签收，感谢您使用顺丰',
                    location: ''
                }, {
                    time: '2016-05-10 07:39:00',
                    ftime: '2016-05-10 07:39:00',
                    context: '已签收，感谢您使用顺丰',
                    location: ''
                }]
                this.progessVisible = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>
