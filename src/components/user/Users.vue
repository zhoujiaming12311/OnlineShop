<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- layout栅格布局调整组件大小, col:列  row:行 gutter：格间距 span:格大小-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <!-- 搜索与添加区域 -->
                    <el-input placeholder="请输入内容" v-model=" queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true" width="50%">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <!-- data指定数据源 border加边框线 stripe隔行变色-->
            <el-table :data="userlist" border stripe>
                <!-- label指定标题 prop指定数据项-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button> -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="2"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加用户的对话框 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px"
                    class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editDialogClosed">
                <el-dialog width="50%">
                </el-dialog>
                <!-- 主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 页脚区域 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确定</el-button>
                </div>
            </el-dialog>
            <!-- 分配角色的对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRightDialogVisble" width="50%" @close="setRoleDialogClosed">
               <div>
                   <p>当前的用户：{{userInfo.username}}</p>
                   <p>当前的角色：{{userInfo.role_name}}</p>
                   <!-- 下拉菜单 v-model双向绑定Data,通过data渲染选项 label标签名 value实际值 -->
                   <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option v-for="item in rolesList" :key="item.id" :label="item.role_name" :value="item.id">
                    </el-option>
                   </el-select>
               </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisble = false">取消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            // 通过定义自定义对象,实现自定义校验规则 rules-校验规则 value-校验变量 callback-校验成功时回调函数
            // 验证邮箱的规则
            var checkEmail = (rules, value, callback) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                // 邮箱校验
                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return callback()
                }
                // 非法邮箱,需要通过返回new Error
                callback(new Error('请输入合法的邮箱'))
            }
            // 验证手机号的规则
            var checkMobile = (rules, value, callback) => {
                // 验证手机号的正则表达式
                const regMobile = /^(1[3|4|5|7|8][0-9]{9}$)+/
                // 手机号校验
                if (regMobile.test(value)) {
                    // 合法的手机号
                    return callback()
                }
                // 非法手机号需要通过返回new Error
                callback(new Error('请输入合法的手机号'))
            }
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    // 搜索关键字
                    query: '',
                    // 当前页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                // 控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                // 添加用户表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    username: [
                        { required: 'required', message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '用户名长度在3到10个字符之间', trigger: 'blur' }
                    ],
                    password: [
                        { required: 'required', message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '密码长度在6到15个字符之间', trigger: 'blur' }
                    ],
                    email: [
                        { required: 'required', message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: 'required', message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                // 保存查询到的用户信息对象
                editForm: {},
                // 修改表单的用户规则对象
                editFormRules: {
                    email: [
                        { required: 'required', message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: 'required', message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                // 控制分配角色对话框的显示与隐藏
                setRightDialogVisble: false,
                // 需要被分配角色的用户信息
                userInfo: {},
                // 所有角色的数据列表
                rolesList: [],
                // 已选中的角色ID值
                selectedRoleId: ''
            }
        },
        created() {
            // 组件初始化前获取用户数据，created()在data()之后执行
            this.getUserList()
        },
        methods: {
            // 获取用户数据
            async getUserList() {
                // const { data: res } = await this.$http.get('users', {
                //     params: this.queryInfo
                // })
                // console.log(res)
                // if (res.meta.status !== 200)
                //     return this.$message.error('获取用户列表失败')
                var res = {
                    pagenum: 1,
                    total: 4,
                    users:
                        [
                            { id: 500, role_name: '超级管理员', username: 'admin', mg_state: 'false', email: '2363956378@qq.com', create_time: 1486720211, mobile: '18345188726' },
                            { id: 502, role_name: '测试角色2', username: 'test2', mg_state: 'true', email: '2363956388@qq.com', create_time: 1486720212, mobile: '18345188727' },
                            { id: 503, role_name: '测试角色3', username: 'test3', mg_state: 'true', email: '2363956488@qq.com', create_time: 1486720213, mobile: '18345188728' },
                            { id: 504, role_name: '测试角色4', username: 'test4', mg_state: 'true', email: '2363956588@qq.com', create_time: 1486720214, mobile: '18345188729' }
                        ]
                }
                // 搜索时筛选
                if (this.queryInfo.query !== '') {
                    for (var i = 0; i < res.users.length; i++) {
                        if (res.users[i].username === this.queryInfo.query) {
                            res.users = res.users.slice(i, i + 1)
                            // this.queryInfo.query = ''
                        }
                    }
                }
                // 分页时展示当前数据，将数组重新划分
                this.userlist = res.users.slice((this.queryInfo.pagenum - 1) * (this.queryInfo.pagesize), (this.queryInfo.pagenum) * (this.queryInfo.pagesize))
                this.total = res.total
            },
            // 监听 pagesize 改变的事件
            handleSizeChange(newSize) {
                console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 监听页码值改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            // 监听switch状态的改变
            async userStateChanged(userInfo) {
                // change事件执行时会改变scope.row.mg_state的状态
                console.log(userInfo)
                // 将当前状态储存
                // const {date: res} = await = this.$http.put('users/${userinfo.id}/state/${userinfo.mg_state}')
                // if(res.meta.status !== 200){
                //     userinfo.mg_state = ! userinfo.mg_state ;
                //     return this.$message.error("更细数据状态失败")
                // }
                this.$message.success('更新数据状态成功')
            },
            // 监听添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加新用户
            addUser() {
                // validate预校验函数,该函数通过vaild返回表单对象addFormRef校验结果
                this.$refs.addFormRef.validate(async vaild => {
                    // vaild为true可以发送表单添加用户的请求
                    if (vaild) {
                        // const { data: res } = this.$http.post('users', this.addForm)
                        // if(res.meta.status!==201){
                        //     this.$message.error('添加用户失败!')
                        // }
                        console.log(this.addForm)
                        this.$message.success('添加用户信息成功')
                        // 隐藏添加用户的对话框
                        this.addDialogVisible = false
                        // 重新获取用户列表
                        this.getUserList()
                    }
                })
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                // const {data:res} = this.$http.get('users/' + id)
                // const { data: res } = this.$http.post('users', this.addForm)
                // if(res.meta.status!==200){
                //     this.$message.error('查询用户信息失败!')
                // }
                // this.editForm = res.data
                this.editForm = id
                this.editDialogVisible = true
            },
            // 监听修改对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editUserInfo() {
                // 触发预验证
                this.$refs.editFormRef.validate(async vaild => {
                    if (vaild) {
                        // 发起修改用户信息的数据请求
                        // const {data:res} = await this.$http.put('users/' + this.editForm.id +
                        // { email: this.editForm.email, mobile: this.editForm.mobile })
                        // if(res.meta.status!==200){
                        //     this.$message.error('查询用户信息失败!')
                        // }
                        // 隐藏添加用户的对话框
                        this.editDialogVisible = false
                        // 刷新用户列表
                        this.getUserList()
                        // 提示修改成功
                        this.$message.success('更新用户信息成功')
                    }
                })
            },
            // 这是根据ID删除对应的用户信息
            async removeUserById(id) {
                // 弹框询问用户是否删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                // 如果用户确认删除，则返回值为字符串confirm
                // 如果用户取消删除，则返回值为字符串cancel
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已经取消删除')
                } else {
                    // console.log('确认删除')
                    //    const { data: res } = await this.$http.delete('users/'+id)
                    //    if(res.meta.status !=200){
                    //        return this.$message.error('删除用户失败')
                    //    }
                    this.$message.success('删除用户成功')
                    // 刷新获取用户列表
                    this.getUserList()
                }
            },
            // 展示分配角色的对话框
            async setRole(userInfo) {
                this.userInfo = userInfo
                // 在展示对话框之前获取所有角色列表
                // const { data: res } = await this.$http.get('roles')
                                   //    if(res.meta.status !=200){
                    //        return this.$message.error('获取所有角色列表失败')
                    //    }
            //    this.rolesList = res.data
                this.rolesList = [
                    { id: 500, role_name: '超级管理员', username: 'admin', mg_state: 'false', email: '2363956378@qq.com', create_time: 1486720211, mobile: '18345188726' },
                    { id: 502, role_name: '测试角色2', username: 'test2', mg_state: 'true', email: '2363956388@qq.com', create_time: 1486720212, mobile: '18345188727' },
                    { id: 503, role_name: '测试角色3', username: 'test3', mg_state: 'true', email: '2363956488@qq.com', create_time: 1486720213, mobile: '18345188728' },
                    { id: 504, role_name: '测试角色4', username: 'test4', mg_state: 'true', email: '2363956588@qq.com', create_time: 1486720214, mobile: '18345188729' }
                ]
               console.log(this.rolesList)
            //    this.$message.success('获取所有角色列表成功')
               this.setRightDialogVisble = true
            },
            // 点击按钮分配角色
            async saveRoleInfo() {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择要分配的角色！')
                }
                 // const { data: res } = await this.$http.put('users/${this.userInfo.id}/role',{rid: selectedRoleId})
                // if (res.meta.status !== 200) {
                //     return this.$message.error('更新角色失败！')
                // }
                this.$message.success('更新角色成功')
                this.getUserList()
                this.setRightDialogVisble = false
            },
            // 监听分配对话框的关闭事件
            setRoleDialogClosed() {
                this.selectedRoleId = ''
                this.userInfo = {}
            }
        }
    }
</script>

<style lang="less">
    /* 如果需要覆盖element ui的默认样式需要去掉scoped */
    .el-table {
        .gutter {
            width: 0;
            display: block !important;
        }
    }
</style>
