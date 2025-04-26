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
      <div class="text-[24px] text-text-title">{{ title }}</div>
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

      <el-form-item label="学号/工号" prop="studentNo" required>
        <el-input v-model="form.studentNo" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="头像" prop="facePic">
        <el-upload
          action=""
          :file-list="fileList"
          list-type="picture-card"
          accept="image/*"
          :limit="1"
          :http-request="customUpload"
          :before-upload="beforeUpload"
          :on-exceed="beforeUpload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
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
import { Plus } from "@element-plus/icons-vue";
import type {
  UploadProps,
  UploadUserFile,
  UploadRequestOptions,
} from "element-plus";
import { studentApi } from "@/api";
import { useRoute } from "vue-router";

const route = useRoute();
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

const form = ref({
  modelDataId: "",
  faceLibraryId: "",
  name: "",
  studentNo: "",
  facePic: "",
});

const rules = {
  name: [{ required: true, message: "请输入人员姓名", trigger: "blur" }],
  studentNo: [{ required: true, message: "请输入学号/工号", trigger: "blur" }],
  facePic: [{ required: false, message: "请上传头像", trigger: "change" }],
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // 弹框打开时的逻辑
      form.value.faceLibraryId = route.query.id;
      if (props.editData.modelDataId) {
        form.value = {
          ...props.editData,
          name: props.editData.name,
          studentNo: props.editData.studentNo,
          facePic: props.editData.facePic,
        };
        if (props.editData.facePic) {
          fileList.value = [
            {
              name: props.editData.facePic,
              url: props.editData.facePic,
            },
          ];
        }
      }
      nextTick(() => {
        formRef.value.clearValidate();
      });
    } else {
      // 弹框关闭时的逻辑
      form.value = {
        modelDataId: "",
        faceLibraryId: "",
        name: "",
        studentNo: "",
        facePic: "",
      };
      fileList.value = [];
    }
  }
);

// 上传
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const handleRemove = () => {
  form.value.facePic = "";
  fileList.value = [];
};
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const beforeUpload = (file: File) => {
  if (fileList.value.length >= 1) {
    ElMessage.warning("最多上传1张人脸图片!");
    return false;
  }
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }

  return true;
};
const customUpload = async (options: UploadRequestOptions) => {
  try {
    const res = await studentApi.uploadImage(options.file);
    if (res.code === "0") {
      // 确保传递正确的数据格式给 onSuccess
      options.onSuccess(res.data, options.file);
      ElMessage.success("上传成功");
    } else {
      options.onError(new Error(res.msg || "上传失败"));
      ElMessage.error(res.msg || "上传失败");
    }
  } catch (error) {
    console.error("上传错误:", error);
    options.onError(error as Error);
    ElMessage.error("上传失败");
  }
};
const handleSuccess = (response: any, uploadFile: UploadUserFile) => {
  form.value.facePic = response; // 假设返回的图片地址在 response.data 中
  fileList.value = [
    {
      name: uploadFile.name,
      url: response,
    },
  ];
};

const handleClose = () => {
  emit("update:show", false);
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    try {
      const res = await studentApi.addOrUpdate(form.value);
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
