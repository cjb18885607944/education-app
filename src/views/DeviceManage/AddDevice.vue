<!-- views/DeviceManage/AddDevice.vue -->
<template>
  <div class="h-full flex flex-col bg-bg-main relative pb-[72px]">
    <!-- 面包屑 -->
    <div class="px-6">
      <AppBreadcrumb />
    </div>

    <!-- 表单区域 -->
    <div class="flex-1 flex justify-center overflow-auto">
      <div class="w-[620px] py-8">
        <h2 class="text-2xl text-text-title mb-8 font-medium">添加设备</h2>

        <el-form
          ref="formRef"
          :model="formData"
          label-position="top"
          :rules="rules"
        >
          <el-form-item label="设备名称" prop="deviceName" required>
            <el-input
              v-model="formData.deviceName"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="接入协议" prop="protocol" required>
            <el-select
              v-model="formData.protocol"
              placeholder="普通协议"
              class="!w-[620px]"
            >
              <el-option label="普通协议" value="normal" />
            </el-select>
          </el-form-item>

          <el-form-item label="IP地址" prop="ipAddress" required>
            <el-input
              v-model="formData.ipAddress"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="端口号" prop="port" required>
            <el-input
              v-model="formData.port"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="设备编号" prop="deviceNumber" required>
            <el-input
              v-model="formData.deviceNumber"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="登录密码" prop="password" required>
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 固定底部按钮 -->
    <div
      class="h-[72px] border-t border-gap flex items-center justify-center fixed bottom-0 left-0 right-0"
    >
      <el-button
        type="primary"
        class="w-[140px] h-[32px] !bg-primary !rounded-[2px]"
        @click="handleSubmit"
      >
        保存
      </el-button>
      <div class="w-3"></div>
      <el-button
        class="w-[140px] h-[32px] !bg-btn-secondary !text-white !rounded-[2px]"
        @click="handleCancel"
      >
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import AppBreadcrumb from "@/components/common/AppBreadcrumb.vue";

const router = useRouter();
const formRef = ref<FormInstance>();

interface FormData {
  deviceName: string;
  protocol: string;
  ipAddress: string;
  port: string;
  deviceNumber: string;
  password: string;
}

const formData = reactive<FormData>({
  deviceName: "",
  protocol: "",
  ipAddress: "",
  port: "",
  deviceNumber: "",
  password: "",
});

const rules = {
  deviceName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  protocol: [{ required: true, message: "请选择接入协议", trigger: "change" }],
  ipAddress: [
    { required: true, message: "请输入IP地址", trigger: "blur" },
    {
      pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
      message: "请输入正确的IP地址格式",
      trigger: "blur",
    },
  ],
  port: [
    { required: true, message: "请输入端口号", trigger: "blur" },
    { pattern: /^\d+$/, message: "请输入数字", trigger: "blur" },
    { min: 1, max: 65535, message: "端口号范围为1-65535", trigger: "blur" },
  ],
  deviceNumber: [
    { required: true, message: "请输入设备编号", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid, fields) => {
    if (valid) {
      ElMessage.success("添加成功");
      router.push("/DeviceManage");
    } else {
      console.log("验证失败:", fields);
    }
  });
};

const handleCancel = () => {
  router.push("/DeviceManage");
};
</script>

<style scoped>
:deep(.el-form-item__label) {
  padding: 0;
  line-height: 22px !important;
  font-size: 14px;
  color: rgba(83, 88, 92, 0.8);
  margin-bottom: 4px;
}

:deep(.el-form-item.is-required) .el-form-item__label:after {
  content: "*";
  color: var(--el-color-danger);
  margin-right: 4px;
  margin-left: 4px;
}

:deep(.el-form-item.is-required) .el-form-item__label:before {
  display: none;
}

:deep(.el-input__wrapper) {
  height: 32px;
  background-color: #fff;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__error) {
  padding-top: 4px;
}
</style>
