<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--点击首页跳转-->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 栅格布局 -->
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限，共占5列 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限，共占19列  -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" @close="removeRightById(scope.row, item2.id)" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- closable添加删除图标 -->
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)" closable>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 通过pre标签将代码梳理 -->
                            <!-- <pre> -->
                                <!-- 通过scope.row循环出children内容 -->
                                <!-- {{scope.row}} -->
                            <!-- </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisble" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <!-- show-checkbox复选框 node-key节点绑定id  default-expand-all 所有节点默认展开 default-checked-keys 默认选中项 ref="treeRef"添加引用绑定子组件,为了调用该引用子组件内容和绑定函数-->
            <el-tree  :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisble = false">取消</el-button>
                <el-button type="primary" @click="allotRights">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            // 所有角色列表数据
            return {
                roleList: [],
                // 控制分配权限对话框的显示与隐藏
                setRightDialogVisble: false,
                // 所有权限的数据
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    // tree中各层级展示的文本
                    label: 'authName',
                    // children 表示实现父子嵌套时所需要的属性（即tree是按照什么方式进行循环展开的）
                    children: 'children'
                },
                // 默认选中节点的ID值数组
                defKeys: [],
                // 即将分配权限的角色id
                roleId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                // 获取所有角色的列表
                // const { data: res } = await this.$http.get('roles')
                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取列表失败！')
                // }
                // this.roleList = res.data
                this.roleList =
                    [
                        { id: 30, roleName: '主管0', roleDesc: '技术负责人0', children: [{ id: 341, authName: '商品管理0', path: 'goods', children: [{ id: 441, authName: '商品列表0', path: 'goods', children: [{ id: 541, authName: '商品修改0', path: 'goods' }] }] }, { id: 821, authName: '商品管理08', path: 'goods', children: [{ id: 941, authName: '商品列表08', path: 'goods', children: [{ id: 2041, authName: '商品修改08', path: 'goods' }] }, { id: 5941, authName: '商品列表09', path: 'goods', children: [{ id: 5041, authName: '商品修改09', path: 'goods' }] }] }] },
                        { id: 31, roleName: '主管1', roleDesc: '技术负责人1', children: [{ id: 741, authName: '商品管理1', path: 'goods', children: [{ id: 1741, authName: '商品列表1', path: 'goods', children: [{ id: 2741, authName: '商品修改1', path: 'goods' }] }] }] },
                        { id: 32, roleName: '主管2', roleDesc: '技术负责人2', children: [{ id: 841, authName: '商品管理2', path: 'goods', children: [{ id: 1841, authName: '商品列表2', path: 'goods', children: [{ id: 2841, authName: '商品修改2', path: 'goods' }] }] }] }
                    ]
                this.$message.success('获取列表成功')
            },
            // 根据id删除对应的权限
           async removeRightById(role, rightId) {
                // 弹框提示用户是否要删除
                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消删除！')
                }
                // console.log('确认删除')
            //    const { data: res } = await this.$http.delete('roles/${role.id}/rights/${rightId}')
            //    if(res.meta.status !== 200) {
            //        return this.$message.error('删除权限失败！')
            //    }
            //    this.getRolesList()
            //    role.children = res.data
            //    role.children = role
            // 权限删除操作
               for (var i = 0; i < role.children.length; i++) {
                // console.log(role.children[i])
                    if (role.children[i].id === rightId) {
                            role.children[i] = {}
                            break
                        }
                   for (var j = 0; j < role.children[i].children.length; j++) {
                    // console.log(role.children[i].children[j])
                    if (role.children[i].children[j].id === rightId) {
                            console.log(role.children[i].children[j])
                            role.children[i] = {}
                            console.log(role.children[i])
                            break
                        }
                       for (var k = 0; k < role.children[i].children[j].children.length; k++) {
                        if (role.children[i].children[j].children[k].id === rightId) {
                            role.children[i].children[j].children = {}
                            break
                        }
                    }
                   }
               }
               this.$message.error('删除权限成功！')
            },
            // 展示分配权限的对话框
            async showSetRightDialog(role) {
                // const {data : res} = await this.$http.get('rights/tree')
                // if(res.meta.status != 200){
                //     return this.$message.error("获取权限数据失败！")
                // }
                // this.rightsList = res.data
                // 获取到的权限数据保存到data中，根据tree绑定的treeProps属性中的children和label进行拆分展示
                this.rightsList = [
                    { id: 341, authName: '商品管理0', path: 'goods', children: [{ id: 441, authName: '商品列表0', path: 'goods', children: [{ id: 541, authName: '商品修改0', path: 'goods' }] }] }, { id: 821, authName: '商品管理08', path: 'goods', children: [{ id: 941, authName: '商品列表08', path: 'goods', children: [{ id: 2041, authName: '商品修改08', path: 'goods' }] }, { id: 5941, authName: '商品列表09', path: 'goods', children: [{ id: 5041, authName: '商品修改09', path: 'goods' }] }] },
                    { id: 741, authName: '商品管理1', path: 'goods', children: [{ id: 1741, authName: '商品列表1', path: 'goods', children: [{ id: 2741, authName: '商品修改1', path: 'goods' }] }] },
                    { id: 841, authName: '商品管理2', path: 'goods', children: [{ id: 1841, authName: '商品列表2', path: 'goods', children: [{ id: 2841, authName: '商品修改2', path: 'goods' }] }] }
                ]
                // 清空数组,防止数组中累计过多数据
                // this.defKeys = []
                // 获取三级节点的id
                this.getLeafKeys(role, this.defKeys)
                // 显示dialog
                this.setRightDialogVisble = true
            },
            // 通过递归的形式获取角色下所有三级权限的ID,并保存到defKeys数组中
            getLeafKeys(node, arr) {
                // 如果当前node节点不包含children属性，则证明是三级节点
                if (!node.children) {
                    // console.log(node)
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },
            // 监听对话框的关闭事件，清空数组中的数据
            setRightDialogClosed() {
                this.defKeys = []
            },
            async allotRights() {
                // 使用...将两个数组合并成一个数组
                const keys = [
                    // 获取所有选中展开节点
                    ...this.$refs.treeRef.getCheckedKeys(),
                    // 获取所有选中半展开节点
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                console.log(keys)
                // 拼接成字符串发送给后台
                // const idstr = keys.join(',')
                // const {data : res} =  await this.$http.post('roles/${this.roleId}/rights', { rids: idstr })
                // if(res.meta.status != 200) {
                //     return this.$message.error('分配权限失败')
                // }
                this.$message.success('分配权限成功')
                this.getRolesList()
                this.setRightDialogVisble = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    /* 纵向居中对齐 */
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
