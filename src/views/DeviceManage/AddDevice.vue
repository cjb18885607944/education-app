<!-- views/DeviceManage/AddDevice.vue -->
<template>
  <div class="h-full flex flex-col bg-bg-main relative pb-[72px]">
    <!-- 面包屑 -->
    <div class="px-6">
      <AppBreadcrumb :class-name="currentClass" />
    </div>

    <!-- 表单区域 -->
    <div class="flex-1 flex justify-center overflow-auto">
      <div class="w-[620px] py-8">
        <h2 class="text-2xl text-text-title mb-8 font-medium">
          {{ currentClass }}
        </h2>

        <el-form
          ref="formRef"
          :model="formData"
          label-position="top"
          :rules="rules"
          :disabled="currentClass === '设备详情'"
        >
          <el-form-item label="设备名称" prop="name" required>
            <el-input
              v-model="formData.name"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <!-- <el-form-item label="接入协议" prop="protocol" required>
            <el-select
              v-model="formData.protocol"
              placeholder="普通协议"
              class="!w-[620px]"
            >
              <el-option label="普通协议" value="normal" />
            </el-select>
          </el-form-item> -->

          <el-form-item label="IP地址" prop="ip" required>
            <el-input
              v-model="formData.ip"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="端口号" prop="port" required>
            <el-input
              v-model.number="formData.port"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="设备账号" prop="user" required>
            <el-input
              v-model="formData.user"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="登录密码" prop="password" required>
            <el-input
              v-model="formData.password"
              type="serialNumber"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>
          <!-- <el-form-item label="设备编号" prop="equipmentId" required>
            <el-input
              v-model="formData.equipmentId"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item>

          <el-form-item label="设备序列号" prop="serialNumber" required>
            <el-input
              v-model="formData.serialNumber"
              type="serialNumber"
              placeholder="请输入"
              class="!w-[620px]"
            />
          </el-form-item> -->
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
        :disabled="currentClass === '设备详情'"
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import AppBreadcrumb from "@/components/common/AppBreadcrumb.vue";
import { equipmentApi } from "@/api";

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

interface FormData {
  name: string;
  protocol: string;
  ip: string;
  port: string;
  equipmentId: string;
  user: string;
  password: string;
  serialNumber: string;
  modelDataId?: string;
}

let formData = ref<FormData>({
  modelDataId: "",
  name: "",
  protocol: "",
  ip: "",
  port: "",
  equipmentId: "",
  serialNumber: "",
  user: "",
  password: "",
});

const rules = {
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  protocol: [{ required: true, message: "请选择接入协议", trigger: "change" }],
  ip: [
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
  ],
  equipmentId: [{ required: true, message: "请输入设备编号", trigger: "blur" }],
  serialNumber: [
    { required: true, message: "请输入设备序列号", trigger: "blur" },
  ],
};

onMounted(() => {
  if (route.query.modelDataId) {
    handleQueryDeviceInfo();
  }
});
const handleQueryDeviceInfo = async () => {
  try {
    let params = {
      modelDataId: route.query.modelDataId,
      equipmentId: "",
      name: "",
      ip: "",
      status: "",
      serialNumber: "",
      pageNo: 1,
      pageSize: 1,
    };
    const res = await equipmentApi.getList(params);
    if (res.code === "0" && res.data.list.length) {
      let device = res.data?.list[0] || null;
      // 打印完整的数据结构
      formData.value = device ? { ...device } : {};
    }
  } catch (e) {
    console.log(e);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      let params = {
        ...formData.value,
      };
      const res = await equipmentApi.addOrUpdate(params);
      if (res.code === "0") {
        if (route.query.equipmentId) {
          ElMessage.success("修改成功");
        } else {
          ElMessage.success("添加成功");
        }
        router.push("/DeviceManage");
      }
    } else {
      console.log("验证失败:", fields);
    }
  });
};

const handleCancel = () => {
  router.push("/DeviceManage");
};

const currentClass = computed(() => {
  let result = "";
  const type = route.query.type;
  switch (type) {
    case "edit":
      result = "编辑设备";
      break;
    case "detail":
      result = "设备详情";
      break;
    default:
      result = "添加设备";
  }
  return result;
});
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
