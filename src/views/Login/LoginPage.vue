<template>
  <div
    class="login relative min-h-screen h-full w-full bg-[url(@/assets/images/bg_login.png)] bg-[length:100%_100%] bg-center bg-no-repeat"
  >
    <!-- 背景 -->
    <div class="absolute bottom-0 left-0 w-full h-[254px] z-10">
      <div
        class="absolute inset-0 bg-[url(@/assets/images/bg_login-mask.png)]"
        style=""
      ></div>
    </div>
    <!-- logo -->
    <div class="absolute left-[60px] top-[70px] w-[50%] h-[68px] flex">
      <img src="" alt="logo" class="bg-[#cccccc] w-[68px] h-[68px]" />
      <div class="flex flex-col justify-between ml-9">
        <div class="text-[36px] text-[#505050] font-bold">学生无感考勤平台</div>
        <div class="text-[20px] text-[#b8b8b8]">
          Student seamless attendance platform
        </div>
      </div>
    </div>
    <div
      class="absolute top-[50%] right-[170px] transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-[2px] shadow-2xl w-[520px] p-11 transform transition-all duration-300 hover:shadow-primary/20"
    >
      <!-- 登录表单 -->
      <template v-if="currentView === 'login'">
        <h2
          class="text-[24px] text-[rgba(90,90,90,1)] font-bold mb-6 tracking-wider"
        >
          登录
        </h2>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="loginForm.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="w-full h-12 text-lg font-medium tracking-wider transition-all duration-300 mt-[80px] bg-[#389EAE]"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="flex justify-between mt-4 text-primary">
          <el-button link type="primary" @click="currentView = 'register'">
            注册账号
          </el-button>
          <el-button link type="primary" @click="currentView = 'reset'">
            忘记密码
          </el-button>
        </div>
      </template>

      <!-- 注册表单 -->
      <template v-if="currentView === 'register'">
        <h2 class="text-2xl font-bold text-primary mb-8 text-center">注册</h2>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="registerForm.userName"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="显示名称" prop="userDisplayName">
            <el-input
              v-model="registerForm.userDisplayName"
              placeholder="请输入显示名称"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入手机号">
              <template #append>
                <el-button
                  class="!bg-primary !text-white hover:!bg-primary/90 !border-none w-[120px] h-full rounded-tl-[0px] rounded-bl-[0px]"
                  :disabled="!!timer"
                  @click="handleGetCode('register')"
                >
                  {{ timer ? `${countdown}s` : "获取验证码" }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input
              v-model="registerForm.verificationCode"
              placeholder="请输入验证码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="bg-[#389EAE] w-full hover:!bg-primary/90 !border-none h-12 text-lg font-medium tracking-wider transition-all duration-300 hover:shadow-lg mt-4"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <div class="text-center mt-4">
          <el-button link type="primary" @click="currentView = 'login'">
            返回登录
          </el-button>
        </div>
      </template>

      <!-- 重置密码表单 -->
      <template v-if="currentView === 'reset'">
        <h2 class="text-2xl font-bold text-primary mb-8 text-center">
          重置密码
        </h2>
        <el-form
          ref="resetFormRef"
          :model="resetForm"
          :rules="resetRules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="resetForm.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="resetForm.phone" placeholder="请输入手机号">
              <template #append>
                <el-button
                  class="!bg-primary !text-white hover:!bg-primary/90 !border-none w-[120px] h-full rounded-tl-[0px] rounded-bl-[0px]"
                  :disabled="!!timer"
                  @click="handleGetCode('reset')"
                >
                  {{ timer ? `${countdown}s` : "获取验证码" }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input
              v-model="resetForm.verificationCode"
              placeholder="请输入验证码"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="resetForm.password"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="bg-[#389EAE] w-full hover:!bg-primary/90 !border-none h-12 text-lg font-medium tracking-wider transition-all duration-300 hover:shadow-lg mt-4"
              @click="handleReset"
            >
              重置密码
            </el-button>
          </el-form-item>
        </el-form>
        <div class="text-center mt-4">
          <el-button link type="primary" @click="currentView = 'login'">
            返回登录
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api";

const router = useRouter();
const currentView = ref<"login" | "register" | "reset">("login");

// 倒计时相关
const timer = ref();
const countdown = ref(60);

// 表单ref
const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();
const resetFormRef = ref<FormInstance>();

// 表单数据
const loginForm = reactive({
  userName: "",
  password: "",
});

const registerForm = reactive({
  userName: "",
  userDisplayName: "",
  password: "",
  phone: "",
  verificationCode: "",
  status: 0,
});

const resetForm = reactive({
  userName: "",
  password: "",
  phone: "",
  verificationCode: "",
});

// 验证规则
const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入用户名"));
  } else if (value.length > 20) {
    callback(new Error("用户名不能超过20个字符"));
  } else {
    callback();
  }
};

const validatePhone = (rule: any, value: string, callback: any) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!phoneReg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};

const loginRules = reactive<FormRules>({
  userName: [{ required: true, validator: validateUsername, trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const registerRules = reactive<FormRules>({
  userName: [{ required: true, validator: validateUsername, trigger: "blur" }],
  userDisplayName: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
  ],
});

const resetRules = reactive<FormRules>({
  userName: [{ required: true, validator: validateUsername, trigger: "blur" }],
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
  ],
});

// 获取验证码
const handleGetCode = async (type: "register" | "reset") => {
  const phone = type === "register" ? registerForm.phone : resetForm.phone;
  const formRef =
    type === "register" ? registerFormRef.value : resetFormRef.value;

  try {
    await formRef?.validateField("phone");
    // 调用获取验证码接口
    const res = await loginApi.send({ phone });
    if (res.code === "0") {
      ElMessage.success("验证码已发送");
      // 开始倒计时
      countdown.value = 60;
      timer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(timer.value);
          timer.value = undefined;
        }
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  }
};

// 登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    const res = await loginApi.login(loginForm);
    if (res.code === "0" && res.data) {
      // 设置cookie
      document.cookie = `token=${res.data}`;
      ElMessage.success("登录成功");
      router.push("/AttendanceStatistics");
    }
  } catch (error) {
    console.error(error);
  }
};

// 注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate();
    const res = await loginApi.register(registerForm);
    if (res.code === "0") {
      ElMessage.success("注册成功");
      currentView.value = "login";
    }
  } catch (error) {
    console.error(error);
  }
};

// 重置密码
const handleReset = async () => {
  if (!resetFormRef.value) return;

  try {
    await resetFormRef.value.validate();
    const { userName, password, verificationCode } = resetForm;
    const res = await loginApi.resetPassword({
      userName,
      password,
      verificationCode,
    });
    if (res) {
      ElMessage.success("密码重置成功");
      currentView.value = "login";
    }
  } catch (error) {
    console.error(error);
  }
};

// 添加全局样式
const style = document.createElement("style");
style.textContent = `
.login .el-input__wrapper {
  background: rgba(0, 224, 232, 0.05) !important;
  border: 1px solid #91BDDF !important;
  box-shadow: none !important;
  padding: 8px 16px !important;
  border-color: rgba(23, 188, 200, 0.07) !important;
}

.login .el-input__wrapper.is-focus {
  border-color: rgba(23, 188, 200, 0.45) !important;
  box-shadow: none !important;
}

.el-form-item{
  margin-bottom:24px;
}

.el-form-item__label {
  font-size: 0.95rem !important;
  color: #64748b !important;
  padding-bottom: 4px !important;
}

.el-button--link {
  font-weight: 500 !important;
}

.login-fade-enter-active,
.login-fade-leave-active {
  transition: opacity 0.3s ease;
}

.login-fade-enter-from,
.login-fade-leave-to {
  opacity: 0;
}
`;
document.head.appendChild(style);

// 重置所有表单数据
const resetAllForms = () => {
  // 重置登录表单
  loginForm.userName = "";
  loginForm.password = "";
  loginFormRef.value?.resetFields();

  // 重置注册表单
  registerForm.userName = "";
  registerForm.userDisplayName = "";
  registerForm.password = "";
  registerForm.phone = "";
  registerForm.verificationCode = "";
  registerForm.status = 0;
  registerFormRef.value?.resetFields();

  // 重置重置密码表单
  resetForm.userName = "";
  resetForm.password = "";
  resetForm.phone = "";
  resetForm.verificationCode = "";
  resetFormRef.value?.resetFields();

  // 清除倒计时
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = undefined;
    countdown.value = 0;
  }
};

// 监听视图切换
watch(currentView, () => {
  resetAllForms();
});

// API接口声明
declare function login(data: {
  userName: string;
  password: string;
}): Promise<{ token: string }>;
declare function register(data: {
  userName: string;
  userDisplayName: string;
  password: string;
  phone: string;
  status: number;
}): Promise<any>;
declare function resetPassword(data: {
  userName: string;
  password: string;
  verificationCode: string;
}): Promise<any>;
declare function getVerificationCode(data: { phone: string }): Promise<any>;
</script>
