<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/yuxin.png" alt="">
                <span>电商管理系统</span>
            </div>
            <el-button type='info' @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px' ">
                <!-- 按钮条 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <!-- 一级菜单 :index绑定跳转的路径-->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 :index绑定跳转的路径-->
                        <el-menu-item :index="'/'+ subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="savNavState('/' + subItem.path)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            // 左侧菜单数据
            return {
                // 菜单列表
                menulist: [],
                // 是否折叠
                isCollapse: false,
                // 保存被激活的链接地址
                activePath: '',
                // 按钮集合
                iconsObj: {
                    125: 'el-icon-user',
                    111: 'el-icon-setting',
                    112: 'el-icon-goods',
                    113: 'el-icon-s-order',
                    114: 'el-icon-s-platform'
                }
            }
        },
        created() {
            // 通过getMenuList获取所有左侧菜单中的内容
            this.getMenuList()
            // 通过savNavState实现触发被点击过的链接
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                // 清空token值并重定向到login
                window.sessionStorage.clear()
                this.$router.push('login')
            },
            // 获取所有的菜单的数据对象并通过await转化Promise对象，然后通过结构赋值到res中
            async getMenuList() {
                // const { data: res } = await this.$http.get('menus')
                // console.log(res.meta.status)
                // // 失败处理
                // if (res.meta.status !== 200) {
                //     return this.$message.error(res.meta.msg)
                // }
                // // 成功处理
                // this.menulist = res.data
                this.menulist =
                    [
                    { id: 125, order: 1, path: 'users', authName: '用户管理', children: [{ id: 110, authName: '用户列表', order: 1, path: 'users' }] },
                    { id: 111, authName: '权限管理', order: 1, path: 'rights', children: [{ id: 126, authName: '权限列表', order: 1, path: 'rights' }, { id: 131, authName: '角色列表', order: 1, path: 'roles' }] },
                    { id: 112, authName: '商品管理', order: 1, path: 'goods', children: [{ id: 127, authName: '商品列表', order: 1, path: 'goods' }, { id: 130, authName: '分类参数', order: 1, path: 'params' }] },
                    { id: 113, authName: '订单管理', order: 1, path: 'orders', children: [{ id: 128, authName: '订单列表', order: 1, path: 'orders' }] },
                    { id: 114, authName: '统计管理', order: 1, path: 'reports', children: [{ id: 129, authName: '统计列表', order: 1, path: 'reports' }] }
                    ]
            },
            // 点击按钮切换菜单的折叠与展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            // 保存链接的激活状态
            savNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                // 点击时高亮处理
                this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        /* 栅格布局 */
        display: flex;
        /* 水平方向的对齐方式, */
        justify-content: space-between;
        /* 去掉logo左边的空白 */
        padding-left: 0;
        /* 垂直方向的对齐方式 */
        align-items: center;
        color: #fff;
        font-size: 20px;

        /* 对头部中div进行布局设置 */
        div {
            /* 文字垂直对齐 */
            display: flex;
            align-items: center;

            span {
                /* 文字与图片间距 */
                margin-left: 15px;
            }

            img {
                /* 图片的大小 */
                width: 40%;
            }
        }
    }

    .el-aside {
        background-color: #333744;
        .el-menu {
            /* 去掉边框线 */
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }
    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .icon-font{
        font-size: 10px;
    }
</style>
