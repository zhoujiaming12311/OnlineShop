<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps"
                        v-model="selectedCateKeys" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBthDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <!-- v-if控制文本框切换显示 v-model绑定输入内容 @keyup监听键盘事件(按键抬起时触发) @blur失去焦点时触发-->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template  slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.cat_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBthDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <!-- v-if控制文本框切换显示 v-model绑定输入内容 @keyup监听键盘事件(按键抬起时触发) @blur失去焦点时触发-->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template  slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.cat_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 商品分类列表
                catelist: [],
                // 级联选择框的配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 级联选择框双向绑定到的数组（自动获取指定的value 如:cat_id）
                selectedCateKeys: [],
                // 被激活的页签名称
                activeName: 'many',
                // 动态参数的数据
                manyTableData: [],
                // 静态属性的数据
                onlyTableData: [],
                // 控制添加对话框的显示与隐藏
                addDialogVisible: false,
                // 添加参数的数据对象
                addForm: {
                    attr_name: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                // 控制修改对话框的显示与隐藏
                editDialogVisible: false,
                // 修改参数的数据对象
                editForm: {
                    attr_name: ''
                },
                // 修改表单的验证规则对象
                editFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                data: []
            }
        },
        async created() {
            // const { data : res} = await this.$http.get('categories')
            // if(res.meta.status !== 200) {
            //     return this.$message.error('获取商品分类失败！')
            // }
            // this.catelist = res.data
            this.catelist =
                [{
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
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
                                    cat_deleted: false
                                }
                            ]
                        }
                    ]
                }]
        },
        methods: {
            // 级联选择框选中项变化，此时会触发该函数
            handleChange: async function () {
                this.getParamsData()
            },
            // Tab页签点击事件的处理函数
            handleTabClick: function () {
                this.getParamsData()
            },
            // 获取参数的列表数据
            getParamsData() {
                // 选中的不是三级分类
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }

                // 证明是选中了三级分类
                // console.log(this.selectedCateKeys)
                // 根据当前所选分类的Id,和当前所处的面板,获取对应的参数
                // const { data: res } = await this.$http.get('categories/${this.cateId}/attributes',
                //     {
                //         params: { sel: this.activeName }
                //     })
                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取参数列表失败')
                // }
                // this.$message.success('获取参数列表成功')
                // 判断数据此时从属的表格（即当时点击的表格）然后赋值
                if (this.activeName === 'many') {
                    // this.manyTableData = res.data
                    if (this.manyTableData.length === 0) {
                        this.manyTableData = [{
                            attr_id: '1',
                            attr_name: 'cpu',
                            cat_id: '22',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: '47寸纯平电视 人工智能 30核HDR 4K超薄曲面'
                        }]
                        this.manyTableData.forEach((element, index) => {
                            // 拆分字符数组
                            this.manyTableData[index].attr_vals = element.attr_vals.split(' ')
                        })
                    }
                    // 进行数据添加
                    if (this.addForm.attr_name) {
                        this.manyTableData.push({
                            attr_id: '1',
                            attr_name: this.addForm.attr_name,
                            cat_id: '99',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: ['27寸纯平电视', '人工智能', '30核HDR', '4K超薄曲面']
                        })
                    }
                    // 给每一个对象都添加单独的属性，保证input修改时数据各自独立。
                    // 但是在实例创建之后添加新的属性到实例上，它不会触发视图更新。
                    // 该现象是在age及name都有get和set方法,但是在sex里面并没有这两个方法。
                    // 因此，设置了sex值后vue并不会自动更新视图；
                    // 所以后续需要调用$set方法将对于属性转化为响应式属性
                    this.manyTableData.forEach((element, index) => {
                            // 控制文本框的显示与隐藏
                            // this.manyTableData[index].inputVisible = false
                            // 文本框中输入的值
                            // this.manyTableData[index].inputValue = ''
                            this.$set(this.manyTableData[index], 'inputVisible', false)
                            this.$set(this.manyTableData[index], 'inputValue', '')
                        })
                } else {
                    if (this.onlyTableData.length === 0) {
                        this.onlyTableData = [{
                            attr_id: '1',
                            attr_name: '主体-商品名称',
                            cat_id: '22',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: '77寸纯平电视 人工智能 30核HDR 4K超薄曲面'
                        }, {
                            attr_id: '1',
                            attr_name: '显示-曲面',
                            cat_id: '33',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: '89寸纯平电视 人工智能 30核HDR 4K超薄曲面'
                        }, {
                            attr_id: '1',
                            attr_name: '系统-智能电视',
                            cat_id: '44',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: '99寸纯平电视 人工智能 30核HDR 4K超薄曲面'
                        }]
                        this.onlyTableData.forEach((element, index) => {
                            this.onlyTableData[index].attr_vals = element.attr_vals.split(' ')
                        })
                    }
                    if (this.addForm.attr_name) {
                        this.onlyTableData.push({
                            attr_id: '1',
                            attr_name: this.addForm.attr_name,
                            cat_id: '99',
                            attr_sel: 'only',
                            attr_write: 'manual',
                            attr_vals: ['27寸纯平电视', '人工智能', '30核HDR', '4K超薄曲面']
                        })
                    }
                    this.onlyTableData.forEach((element, index) => {
                            // 控制文本的显示与隐藏
                            // this.onlyTableData[index].inputVisible = false
                            // 文本框中输入的值
                            // this.onlyTableData[index].inputValue = ''
                            this.$set(this.onlyTableData[index], 'inputVisible', false)
                            this.$set(this.onlyTableData[index], 'inputValue', '')
                        })
                }
            },
            // 监听添加对话框的关闭事件
            addDialogClosed() {
                // 关闭时清空表单内容，保证下一次打开时不残留上次的数据
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加参数
            addParams() {
                // // 调用validate函数触发表单预验证，通过监听valid返回值是否有效，判断当前表单数值是否正确
                // this.$refs.addFormRef.validate(valid => {
                //     if (!valid) {
                //         return
                //     }
                //     //     this.$http.post('categories/${this.cateId}/attributes',{
                //     //         attr_name: this.addForm.attr_name,
                //     //         attr_sel: this.activeName
                //     //     })
                //     // })
                // })
                // if (this.activeName === 'many') {
                //     this.manyTableData.push({
                //         attr_id: '1',
                //         attr_name: this.addForm.attr_name,
                //         cat_id: '99',
                //         attr_sel: 'only',
                //         attr_write: 'manual',
                //         attr_vals: ['27寸纯平电视', '人工智能', '30核HDR', '4K超薄曲面']
                //     })
                // } else {
                //     this.onlyTableData.push({
                //         attr_id: '1',
                //         attr_name: this.addForm.attr_name,
                //         cat_id: '99',
                //         attr_sel: 'only',
                //         attr_write: 'manual',
                //         attr_vals: ['27寸纯平电视', '人工智能', '30核HDR', '4K超薄曲面']
                //     })
                // }
                this.$message.success('添加参数成功')
                this.addDialogVisible = false
                this.getParamsData()
            },
            // 点击按钮,展示修改对话框
            showEditDialog(catId) {
                this.editDialogVisible = true
                // this.editForm.push()
                if (this.activeName === 'many') {
                    this.manyTableData.forEach(element => {
                        if (element.cat_id === catId) {
                            this.editForm.attr_name = element.attr_name
                        }
                    })
                } else {
                    this.onlyTableData.forEach(element => {
                        if (element.cat_id === catId) {
                            this.editForm.attr_name = element.attr_name
                        }
                    })
                }
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 点击按钮修改参数
            async editParams() {
                // 查询档期参数的信息
                // const {data:res} = await this.$http.get('categories/${this.cateId}/attributes/${attr_id}',{
                //     params:{attr_sel:this.activeName}
                // })
                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取参数信息失败')
                // }
                // this.editForm =res.data
                // this.editForm = this.editForm.push(attrId)
                // console.log(this.editForm)
                // console.log(attrId)
                // 规则校验
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    this.editDialogVisible = false
                })
            },
            async removeParams(catId) {
                // 调用confirm提示组件
                const confirmResult = await this.$confirm('此操作将永久删除该参数,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                // 用户取消了删除操作
                if (confirmResult !== 'confirm') {
                    return this.$message.info('用户已取消删除操作')
                }
                if (this.activeName === 'many') {
                    this.manyTableData.forEach((element, index) => {
                        if (element.cat_id === catId) {
                            this.manyTableData.splice(index, 1)
                        }
                    })
                } else {
                    this.onlyTableData.forEach((element, index) => {
                        if (element.cat_id === catId) {
                            this.onlyTableData.splice(index, 1)
                        }
                    })
                }
            },
            // 文本框输入焦点或摁下了Enter键都会触发该函数
            async handleInputConfirm(row) {
                // 仅当输入内容为空时触发
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                }
                // 将输入内容保存到变量中去
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                // 需要发起请求,保存这次操作
                // const { data: res } = await this.$http.put('categories/${this.cateId}/attributes/${row.attr_id}',{
                //     attr_name: row.attr_name,
                //     attr_sel: row.attr_sel,
                //     attr_vals: row.attr_vals.join(' ')
                // })

                // if(res.meta.status !== 200) {
                //     return this.$message.error('修改参数项失败！')
                // }
                this.$message.success('修改参数项成功！')
            },
            // 点击按钮，展示文本输入框
            showInput(row) {
                // 通过传递形参row决定el-input的显示与隐藏（v-if="scope.row.inputVisible"）
                // $nextTick方法的作用，就是当页面上的元素被重新渲染之后，才会执行回调函数中的代码
                // 由于inputVisible属性改变，导致文本框被重新渲染，此时触发函数获得焦点（不然会在渲染前触发，导致渲染后无法获取焦点）
                row.inputVisible = true
                // 让文本框自动获得焦点
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            // 删除对应参数可选项
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
            }
        },
        computed: {
            // 如果按钮需要被禁用则返回true,否则返回false
            isBthDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            // 当前选中的三级分类Id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            // 动态计算标题的文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        }

    }
</script>

<style lang="less" scoped>
    .cat_opt {
        margin: 15px 0;
    }
    .el-tag {
        margin: 10px;
    }
    .input-new-tag {
        width: 120px;
    }
</style>
