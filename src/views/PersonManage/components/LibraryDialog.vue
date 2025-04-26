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
      <div class="text-[24px] text-text-title">{{ title }}</div>
    </template>
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      :rules="rules"
      class="w-[620px] mx-auto py-8"
    >
      <el-form-item label="人脸库名称" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="阈值" prop="thresholdValue" required>
        <el-input-number
          class="w-full"
          v-model="form.thresholdValue"
          :min="1"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          :rows="3"
          type="textarea"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-3 border-t pt-4">
        <el-button type="primary" class="!w-[140px]" @click="handleSubmit">
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
import {
  ref,
  reactive,
  withDefaults,
  defineProps,
  defineEmits,
  watch,
  nextTick,
} from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { faceLibraryApi } from "@/api";

interface Props {
  show: boolean;
  title: string;
  editData: any;
}
const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: "",
  editData: {},
});
const emit = defineEmits(["update:show", "success"]);
const formRef = ref<FormInstance>();
const form = ref({
  modelDataId: "",
  name: "",
  thresholdValue: 1,
  remark: "",
});
const rules = {
  name: [{ required: true, message: "请输入人脸库名称", trigger: "blur" }],
  thresholdValue: [{ required: true, message: "请输入阈值", trigger: "blur" }],
  remark: [{ required: false, message: "请输入", trigger: "change" }],
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // 弹框打开时的逻辑
      if (props.editData.modelDataId) {
        let { modelDataId, name, thresholdValue, remark } = props.editData;
        form.value = {
          modelDataId,
          name,
          thresholdValue,
          remark,
        };
      }
      nextTick(() => {
        formRef.value.clearValidate();
      });
    } else {
      // 弹框关闭时的逻辑
      form.value = {
        name: "",
        thresholdValue: 1,
        remark: "",
      };
    }
  }
);

const handleClose = () => {
  emit("update:show", false);
};
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    try {
      const res = await faceLibraryApi.addOrUpdate(form.value);
      if (res.code === "0") {
        ElMessage.success("添加成功!");
        success();
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};
const success = () => {
  emit("success");
  handleClose();
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
