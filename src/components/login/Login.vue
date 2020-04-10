<!--
 * @Author: coco
 * @Date: 2020-04-10 11:27:51
 * @LastEditTime: 2020-04-10 17:27:54
 * @LastEditors: coco
 * @Description: 
 * @FilePath: /vue_shop/src/components/login/Login.vue
 * @https://github.com/android-coco
 -->
<template>
  <div class="login-container">
    <div class="login_box">
      <div class="logo">
        <img src="../../assets/logo.png" alt />
      </div>
      <el-form
        label-width="0px"
        class="form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-key"
            type="password"
            v-model="loginForm.password"
            showPassword
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      //登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在6-10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 点击重置按钮，重置表单
    resetLoginForm() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    //登录验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        console.log(res)
        // 1.将登录成功之后的token，保存到客户端的sessionStorage中
        // a.项目中除了登录意外的其他API接口，必须在登录之后才能访问
        // b.token 只应在当前网站打开期间生效，所以将token值保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程时导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .logo {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btn {
  display: flex;
  justify-content: flex-end;
}
.form {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
</style>