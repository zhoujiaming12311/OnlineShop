<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 :data绑定数据源 :selection-type 是否隐藏复选框 :expand-type 是否隐藏展开行 show-index是否显示索引(绑定属性时如果是true则不加:) index-text自定义索引名(不是属性,不加:) :show-row-hover当前行是否高亮-->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
                :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" style="danger" v-if="scope.row.cat_level === 1">1级</el-tag>
                    <el-tag size="mini" style="success" v-else-if="scope.row.cat_level === 2">2级</el-tag>
                    <el-tag size="mini" style="warning" v-else>3级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button tsize="mini" ype="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="10">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 添加分类的表单 :model绑定校验对象 :rules绑定校验规则,该规则专门校验prop指定的的对象属性 prop指定校验属性 v-model通过双向绑定对校验对象实时更新 ref将子组件绑定给父组件，父组件可通过$refs调用子组件的方法 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options 用来指定数据源-->
                    <!-- props用来指定配置对象 -->
                    <!-- v-model用来存储被选中的id项 -->
                    <!-- change选中项发生变化就会立即触发该事件 -->
                    <!-- expand-trigger hover悬浮-->
                    <!-- change-on-select允许选择任意一项 -->
                    <!-- clearable是否支持清空选项 -->
                    <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="parentCateList"
                        :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                // 查询信息
                queryInfo: {
                    type: 3,
                    // 页码（第几页）
                    pagenum: 1,
                    // 每页显示个数
                    pagesize: 5
                },
                // 商品分类的数据列表，默认为空
                cateList: [],
                // 总数据条数
                total: 0,
                // 为table指定列的定义
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'isok'
                }, {
                    label: '排序',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'order'
                }, {
                    label: '操作',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'opt'
                }],
                // 控制分类对话框的显示与隐藏
                addCatedialogVisible: false,
                // 添加分类的表单数据对象
                addCateForm: {
                    // 将要添加的分类的名称
                    cat_name: '',
                    // 父级分类的id
                    cat_pid: 0,
                    // 分类的等级,默认要添加的是1级分类
                    cat_level: 1
                },
                // 添加分类表单的验证规则对象
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                // 父级分类列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    // value 具体选中值的属性 label指定看到的属性 children指定父子嵌套是哪个属性
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中的父级分类ID数组
                selectedKeys: []
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList(item) {
                // 解构赋值相当于给对象中的变量直接赋值，例如：let { baz : foo } = { baz : 'ddd' };执行后相当于给foo 赋值 'ddd'
                // const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
                // // 失败处理
                // if (res.meta.status !== 200) {
                //     return this.$message.error("获取商品分类失败！")
                // }
                // // 成功处理
                // this.cateList = res.data.result
                // this.total =res.data.total
                var res = [{
                    cat_id: 11,
                    cat_name: '大家电1',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 13,
                            cat_name: '电视1',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 16,
                                    cat_name: '曲面电视1',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 21,
                    cat_name: '大家电2',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 23,
                            cat_name: '电视2',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 26,
                                    cat_name: '曲面电视2',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 31,
                    cat_name: '大家电3',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 33,
                            cat_name: '电视3',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 36,
                                    cat_name: '曲面电视3',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 41,
                    cat_name: '大家电4',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 43,
                            cat_name: '电视4',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 46,
                                    cat_name: '曲面电视4',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 51,
                    cat_name: '大家电5',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 53,
                            cat_name: '电视5',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 56,
                                    cat_name: '曲面电视5',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 61,
                    cat_name: '大家电6',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 63,
                            cat_name: '电视6',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 66,
                                    cat_name: '曲面电视6',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 71,
                    cat_name: '大家电7',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 73,
                            cat_name: '电视7',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 76,
                                    cat_name: '曲面电视7',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 81,
                    cat_name: '大家电88',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 83,
                            cat_name: '电视8',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 86,
                                    cat_name: '曲面电视8',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 91,
                    cat_name: '大家电9',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 93,
                            cat_name: '电视9',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 96,
                                    cat_name: '曲面电视9',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    cat_id: 101,
                    cat_name: '大家电10',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 103,
                            cat_name: '电视10',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false,
                            children: [
                                {
                                    cat_id: 106,
                                    cat_name: '曲面电视10',
                                    cat_pid: 3,
                                    cat_level: 3,
                                    cat_deleted: false,
                                    children: [
                                    ]
                                }
                            ]
                        }
                    ]
                }]
                if (item) {
                    res.push(item)
                    console.log(item)
                }
                // 分页时展示当前数据，将数组重新划分
                this.cateList = res.slice((this.queryInfo.pagenum - 1) * (this.queryInfo.pagesize), (this.queryInfo.pagenum) * (this.queryInfo.pagesize))
                // this.total = res.total
            },
            // 监听pagesize改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听pagenum改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 点击按钮，添加分类的对话框
            showAddCateDialog() {
                // 先获取父级分类的数据列表
                this.getParentCateList()
                // 展示出对话框
                this.addCatedialogVisible = true
            },
            // 获取父级分类的数据列表
            async getParentCateList() {
                this.parentCateList = [{
                    cat_id: 11,
                    cat_name: '大家电1',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 13,
                            cat_name: '电视1',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 21,
                    cat_name: '大家电2',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 23,
                            cat_name: '电视2',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 31,
                    cat_name: '大家电3',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 33,
                            cat_name: '电视3',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 41,
                    cat_name: '大家电4',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 43,
                            cat_name: '电视4',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 51,
                    cat_name: '大家电5',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 53,
                            cat_name: '电视5',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 61,
                    cat_name: '大家电6',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 63,
                            cat_name: '电视6',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 71,
                    cat_name: '大家电7',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 73,
                            cat_name: '电视7',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 81,
                    cat_name: '大家电8',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 83,
                            cat_name: '电视8',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 91,
                    cat_name: '大家电9',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 93,
                            cat_name: '电视9',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                },
                {
                    cat_id: 101,
                    cat_name: '大家电10',
                    cat_pid: 0,
                    cat_level: 1,
                    cat_deleted: false,
                    children: [
                        {
                            cat_id: 103,
                            cat_name: '电视10',
                            cat_pid: 1,
                            cat_level: 2,
                            cat_deleted: false
                        }
                    ]
                }]
            },
            // 选择项发生变化触发该函数
            parentCateChange() {
                console.log(this.selectedKeys)
                // 如果selectedKeys 数组中的length 大于0，证明选中了父级分类
                // 反之，就说明没有选中任何父级分类
                if (this.selectedKeys.length > 0) {
                    // 父级分类ID
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    // 为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    // 父级分类ID
                    this.addCateForm.cat_pid = 0
                    // 为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },
            addCate() {
                this.getCateList(this.addCateForm)
                // console.log(this.addCateForm)
                // this.cateList.push(this.addCateForm)
                this.$message.success('添加分类成功')
                // this.getCateList(this.addCateForm)
                this.addCatedialogVisible = false
                console.log(this.cateList)
            },
            // 监听对话框的关闭事件重置表单数据
            addCateDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }

        }
    }
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
