<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="logo">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                  <el-input prefix-icon="el-icon-user" v-model="loginForm.username" ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
     data () {
        return {
            // 这是登录表单的数据绑定数据对象
            loginForm: {
                // 数据对象的属性
                username: 'admin',
                password: '123'
            },
            // 登录表单验证规则
            loginFormRules: {
                // 用户名
                username: [
                    { required: 'required', message: '用户名输入错误', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在3到10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: 'required', message: '密码输入错误', trigger: 'blur' },
                    { min: 8, max: 10, message: '密码长度在8到10个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm () {
            // console.log(this)
            this.$refs.loginFormRef.resetFields()
        },
        // 点击登录按钮，通过validate添加预验证
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                // valid为表单验证的结果,结果false失败拒绝发送请求
                if (valid) {
                    // 通过数据对象loginForm进行数据发送
                    // 通过await对返回值为promise对象的数据转化成js对象
                    // 解构赋值语法是一种 Javascript 表达式。通过解构赋值, 可以将属性/值从对象/数组中取出,赋值给其他变量。
                    // 结构的基本形式为结构相同，从左到右依次赋值
                    // const { data: res } = await this.$http.post('login', this.loginForm)
                    // if (res.meta.status !== 200) return this.$message.error('登录失败')
                    this.$message.success('登录成功')
                    // console.log(res)
                    // 将登录成功之后的token，保存到客户端的sessionStorage中
                    // 项目中除了登录以外的其他接口，必须在登录之后再去访问
                    // token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                    // window.sessionStorage.setItem('token', res.data.token)
                    window.sessionStorage.setItem('token', this.loginForm)
                    // 通过编程式导航跳转到后台主页，路由地址是/home
                    this.$router.push('/home')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
 .login_container {
    background-color: #2b4b6b;
    height: 100%;
}
/* translate是以元素自身的width和height的长度为定位的，而absolute是以父元素的为依据 */
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width:130px;
        height: 130px;
        border:1px solid  #eeeeee;
        border-radius:50%;
        padding:10px;
        box-shadow:0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform:translate(-50%,-50%);
        background-color:#fff;
        img{
            width: 100%;
            height: 100%;
            border-radius:50%;
            background-color:#eeeeee;
        }
    }
}
/* 1.content-box(标准盒模型)
Chrome浏览器box-sizing默认是content-box，content-box就是元素的width和height决定了元素的宽高，这意味着元素的border和padding等不能算在元素的width和height中 ，padding和border的改变不能改变width和height的值。

2.border-box（怪异盒子）
border-box就是用元素内容和padding和border一起决定width和height，啥意思，就是width和元素的内容以及padding和border相互制约。下面用几句话简洁解释一下。

width和height改变，paddign和border不改变时，元素内容的宽高会发生相应的改变，改变的值就是width和height改变的值。
paddign和border改变，width和height不改变时，元素内容的宽高会发生相应的改变，改变的值就是width和height改变的值。
元素内容的宽高等于：元素的宽高 - （ border + padding ） 结论：1、box-sizing: content-box | border-box | inherit
2、他们的主要区别其实就是 width 包不包含 border 和 padding
3、box-sizing 默认值是 content-box，即默认是标准盒子模型
也就是说如果出现了由于padding的改变导致组件超长错位，此时通过border-box可以再不改变padding的大小的情况下增加/缩小width/height的的大小
*/

.login_form{
    width: 100%;
    padding:0 20px;
    position: absolute;
    bottom: 0;
    box-sizing:border-box;
}

/* 弹性盒模型 */
.btns{
    display: flex;
    justify-content:flex-end;
}

</style>
