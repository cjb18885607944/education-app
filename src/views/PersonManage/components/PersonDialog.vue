<!-- components/common/PersonDialog.vue -->
<template>
  <el-dialog
    :title="title"
    :model-value="show"
    @close="handleClose"
    :close-on-click-modal="false"
    width="1200px"
    class="person-dialog"
  >
    <template #header>
      <div class="text-[24px] text-text-title">添加人员</div>
    </template>
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      :rules="rules"
      class="w-[620px] mx-auto py-8"
    >
      <el-form-item label="人员姓名" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="学号/工号" prop="number" required>
        <el-input v-model="form.number" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="头像" prop="avatar" required>
        <div
          class="w-[120px] h-[120px] border border-dashed border-[#E5E6E8] rounded flex items-center justify-center cursor-pointer"
          @click="handleUpload"
        >
          <template v-if="!form.avatar">
            <div class="flex flex-col items-center">
              <el-icon class="text-[24px] text-[#C9CDD4]"><Plus /></el-icon>
            </div>
          </template>
          <img v-else :src="form.avatar" class="w-full h-full object-cover" />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3 border-t pt-4">
        <el-button
          type="primary"
          class="!w-[140px]"
          :loading="loading"
          @click="handleSubmit"
        >
          保存
        </el-button>
        <el-button
          class="w-[140px] !bg-btn-secondary !text-white"
          @click="handleClose"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, withDefaults, defineProps, defineEmits } from "vue";
import type { FormInstance } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

interface Props {
  show: boolean;
  title?: string;
  editData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  title: "添加人员",
  editData: () => ({}),
});

const emit = defineEmits(["update:show", "success"]);

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  name: "",
  number: "",
  avatar: "",
});

const rules = {
  name: [{ required: true, message: "请输入人员姓名", trigger: "blur" }],
  number: [{ required: true, message: "请输入学号/工号", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
};

const handleClose = () => {
  emit("update:show", false);
};

const handleUpload = () => {
  // TODO: 实现上传逻辑
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    loading.value = true;
    await formRef.value.validate();
    // TODO: 调用保存接口
    emit("success");
    handleClose();
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 24px;
  border-bottom: 1px solid #e5e6e8;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 24px;
  border-top: 1px solid #e5e6e8;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  line-height: 20px;
  color: rgba(83, 88, 92, 0.8);
}

:deep(.el-input__wrapper) {
  background-color: #fff;
}
</style>
