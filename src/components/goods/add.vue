<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" :closable="false" show-icon center></el-alert>
            <!-- 步骤条 -->
            <!-- 通过 activeIndex - 0 转化为数值-->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 通过form表单进行数据的整体验证与提交 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" class="demo-ruleForm"
                label-position="top">
                <!-- tab栏区域 -->
                <!-- 通过 v-model="activeIndex" 与 name 联动，实现步骤条的切换 -->
                <!-- 通过属性绑定before-leave并定义接收函数beforeTabLeave，通过该函数进行tab的切换处理  -->
                <!-- 通过tab-click进行标签页点击时事件绑定，该事件的优先级小于before-leave -->
                <el-tabs v-model="activeIndex" :tab-position="tabPosition" @tab-click="tabClicked" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="">
                            <!-- 级联选择器 -->
                            <el-cascader expand-trigger="hover" v-model="addForm.goods_cat" :options="cateList"
                                :props="cateProps" prop="goods_cat" @change="handleChange" clearable change-on-select>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 多选框组 -->
                            <!-- 通过v-model进行双向绑定，绑定后会根据选中框选中内容进行动态变更 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                              </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>
                        <!-- input输入框 -->
                        <!-- 通过v-model进行双向绑定，绑定后会显示相应的内容并进行动态变更 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>
                        <!-- upload上传组件 -->
                        <!-- action表示图片上传路径 -->
                        <!-- on-preview预览属性，在图片上传后预览时触发对应函数handlePreview -->
                        <!-- on-remove预览删除属性，在图片上传后预览时点击叉号取消时触发对应函数handleRemove -->
                        <!-- list-type组件呈现方式，如文件、图片、拖拽等 -->
                        <!-- headers手动绑定请求头,在请求头中手动绑定token值进行验证 -->
                        <!-- on-success图片上传结果属性，在图片上传成功后触发handleSuccess-->
                        <el-upload :action="uploadUrl" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="preViewImg">
         </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data() {
            return {
                // 步骤条默认选中项
                activeIndex: '0',
                // 侧边栏显示位置
                tabPosition: 'left',
                // 添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    // 商品所属分类数组
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    // 商品详情描述
                    goods_introduce: '',
                    // 商品属性
                    attr: []
                },
                // 商品校验规则
                addFormrules: {
                    goods_name: { required: 'required', message: '请输入商品名称', trigger: 'blur' },
                    godds_price: { required: 'required', message: '请输入商品价格', trigger: 'blur' },
                    godds_weight: { required: 'required', message: '请输入商品重量', trigger: 'blur' },
                    godds_number: { required: 'required', message: '请输入商品数量', trigger: 'blur' },
                    goods_cat: { required: 'required', message: '请选择商品分类', trigger: 'blur' }
                },
                // 商品分类列表
                cateList: [],
                // 级联选择器属性
                cateProps: {
                    // 决定显示属性
                    label: 'cat_name',
                    // 决定选中的值
                    value: 'cat_id',
                    // 决定哪个属性实现父子节点的嵌套
                    children: 'children'
                },
                // 动态参数数据
                manyTableData: [],
                // 静态属性数据
                onlyTableData: [],
                // 上传请求地址
                uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
                // 图片上传请求头对象
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 预览路径地址
                previewPath: '',
                // 对话框是否显示
                previewVisible: false
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                // const { data: res } = await this.$http.get('categories')
                // if (res.meta !== 200) {
                //     this.$message.success('获取数据失败')
                // }
                this.cateList = [{
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
                // this.$message.error('获取数据成功')
            },
            // 级联选择器选中项变化时触发该函数
            handleChange() {
                // 通过级联选中项传递的id值，判断当前是否选中三级分类
                if (this.addForm.goods_cat.length !== 3) {
                    // 非三级分类时清空数组
                    this.addForm.goods_cat = []
                }
            },
            // tab页切换时触发该函数 activeName-即将进入的标签页名称 oldActiveName-即将离开的标签页名称
            beforeTabLeave(activeName, oldActiveName) {
                // 只有当选择商品分类后才可以进行切换
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请选择商品分类')
                    return false
                }
            },
            // 在点击tab页时触发该函数
            tabClicked() {
                // 此时点击的是动态参数的面板
            if (this.activeIndex === '1') {
                    this.manyTableData = [{
                        attr_id: '3877',
                        attr_name: '板式',
                        attr_sel: 0,
                        attr_vals: '4k高清电视 人工智能 55寸银色曲面',
                        attr_write: '测试',
                        cat_id: 1222,
                        delete_time: 22111
                    }, {
                        attr_id: '3878',
                        attr_name: '颜色',
                        attr_sel: 0,
                        attr_vals: '黄色 银色',
                        attr_write: '测试1',
                        cat_id: 1222,
                        delete_time: 22111
                    }]
                    this.manyTableData.forEach(element => {
                        element.attr_vals = element.attr_vals.length === 0 ? []
                        : element.attr_vals.split(' ')
                    })
                } else if (this.activeIndex === '2') {
                    // 静态参数面板
                    this.onlyTableData = [{
                        attr_id: '3977',
                        attr_name: '主体-商品名',
                        attr_sel: 0,
                        attr_vals: 'TCL电视 人工智能 55寸银色曲面',
                        attr_write: '测试',
                        cat_id: 1222,
                        delete_time: 22111
                    }, {
                        attr_id: '3978',
                        attr_name: '颜色',
                        attr_sel: 0,
                        attr_vals: '黄色 银色',
                        attr_write: '测试1',
                        cat_id: 1222,
                        delete_time: 22111
                    }, {
                        attr_id: '3988',
                        attr_name: '系统-智能电视',
                        attr_sel: 0,
                        attr_vals: '人工智能 ',
                        attr_write: '测试1',
                        cat_id: 1222,
                        delete_time: 22111
                    }]
                }
            },
            // 图片预览处理函数
            handlePreview(file) {
                // this.previewPath = file.url.substr(5)
                this.previewPath = ' http://localhost:8888/img/yuxin.4075de8c.png'
                this.previewVisible = true
            },
            // 处理移除图片的操作
            handleRemove(file) {
                // 1.获取将要删除的图片的临时路径
                const filePath = file.response.id
                // 2.从pics数组中通过findIndex函数找到对应图片索引
                const i = this.addForm.pics.findIndex(x => x.pic.id === filePath)
                // 3.调用splice方法，把数组中对应项删除
                this.addForm.pics.splice(i, 1)
            },
            // 监听图片上传成功的事件
            handleSuccess(response) {
                // 1.拼接得到一个图片对象
                const info = { pic: response }
                // 2.将图片信息对象，push到pics数组中(该动作每次添加图片均会执行)
                this.addForm.pics.push(info)
            },
            // 添加商品
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项！')
                    }
                    // 进行深拷贝，防止原始内容改变导致v-model组件报错
                    const form = _.cloneDeep(this.addForm)
                    // 执行添加业务逻辑
                    this.addForm.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
                        this.addForm.attr.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
                        this.addForm.attr.push(newInfo)
                    })
                    // 发起请求添加商品
                    // 商品的名称，必须是唯一的
                    // const { res: data } = await this.$http.post('goods', form)
                    this.$message.success('添加商品成功')
                    this.$router.push('../goods')
                })
            }
        },
        computed: {
            // 通过计算属性cateId，返回3级属性
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-step {
        margin: 15px 0;
    }
    .el-checkbox {
        margin:  0 5px 0 0 !important;
    }
    .preViewImg {
        width: 100%;
    }
    .btnAdd {
        margin-top: 15px;
    }
</style>
