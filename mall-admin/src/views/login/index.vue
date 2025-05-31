<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/login.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { setInfo } from "../../utils/storage";
import api from "../../api/index";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();

// 表单引用
const loginFormRef = ref(null);

// 登录表单数据
const loginForm = ref({
  userName: "admin",
  passWord: "123456",
});

// 表单验证规则
const loginFormRules = {
  userName: [
    { required: true, message: "请输入登录名称", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  passWord: [
    { required: true, message: "请输入登录密码", trigger: "blur" },
    { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
  ],
};

const router = useRouter();

// 重置表单
const resetLoginForm = () => {
  loginFormRef.value?.resetFields();
};

// 登录方法
const login = async () => {
  try {
    const valid = await loginFormRef.value.validate();
    if (!valid) return;
    const res = await proxy.$http.post(api.login, loginForm.value);
    console.log(res);

    if (!res.success) {
      ElMessage.error("登录失败!");
      return;
    }

    ElMessage.success("登录成功");
    setInfo("token", res.data.accessToken);
    setInfo("refreshToken", res.data.refreshToken);
    router.push("/home");
  } catch (error) {
    console.error("登录出错:", error);
    ElMessage.error("登录过程中出现错误");
  }
};
</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: linear-gradient(
      135deg,
      rgba(24, 144, 255, 0.85),
      rgba(104, 58, 183, 0.85)
    ),
    url("../../assets/login-bg.avif") no-repeat center center/cover;
  backdrop-filter: blur(3px);
  z-index: 1;
}

.login_box {
  width: 470px;
  height: 300px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
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
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中（当有高度时） */
  gap: 12px; /* 按钮间距 */
  margin-top: 20px; /* 与上方元素间距 */
}
</style>
