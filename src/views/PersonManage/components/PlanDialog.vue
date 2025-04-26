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
      <el-form-item label="识别计划名称" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="人脸库" prop="faceLibraryId" required>
        <el-select v-model="form.faceLibraryId" placeholder="全部" clearable>
          <el-option
            v-for="item in faceLibrary"
            :key="item.modelDataId"
            :label="item.name"
            :value="item.modelDataId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="识别设备" prop="equipmentId" required>
        <el-select v-model="form.equipmentId" placeholder="全部" clearable>
          <el-option
            v-for="item in deviceList"
            :key="item.modelDataId"
            :label="item.name"
            :value="item.modelDataId"
          />
        </el-select>
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
  withDefaults,
  defineProps,
  defineEmits,
  watch,
  nextTick,
} from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import { equipmentApi, faceLibraryApi, recognizePlanApi } from "@/api";

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
  name: "",
  faceLibraryId: "",
  equipmentId: "",
});

const rules = {
  name: [{ required: true, message: "请输入人员姓名", trigger: "blur" }],
  equipmentId: [{ required: true, message: "请选择人脸库", trigger: "blur" }],
  faceLibraryId: [
    { required: true, message: "请选择识别设备", trigger: "change" },
  ],
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      getFaceLibrary();
      getDeviceList();
      if (props.editData.modelDataId) {
        const { modelDataId, name, faceLibraryId, equipmentId } =
          props.editData;
        form.value = {
          modelDataId,
          name,
          faceLibraryId,
          equipmentId,
        };
      }
      nextTick(() => {
        formRef.value.clearValidate();
      });
    } else {
      form.value = {
        modelDataId: "",
        name: "",
        faceLibraryId: "",
        equipmentId: "",
      };
    }
  }
);
let faceLibrary = ref([]);
let deviceList = ref([]);
const getFaceLibrary = async () => {
  try {
    let params = {
      pageNo: 1,
      pageSize: 1000,
    };
    const res = await faceLibraryApi.getList(params);
    if (res.code === "0" && res.data.list.length) {
      faceLibrary.value = res.data.list;
    }
  } catch (e) {
    console.log(e);
  }
};
const getDeviceList = async () => {
  try {
    let params = {
      name: "",
      ip: "",
      status: "",
      equipmengId: "",
      serialNumber: "",
      pageNo: 1,
      pageSize: 1000,
    };
    const res = await equipmentApi.getList(params);
    if (res.code === "0" && res.data.list.length) {
      deviceList.value = res.data.list;
    }
  } catch (e) {
    console.log(e);
  }
};

const handleClose = () => {
  emit("update:show", false);
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    try {
      const res = await recognizePlanApi.addOrUpdate(form.value);
      if (res.code === "0") {
        ElMessage.success("添加成功!");
        emit("success");
        handleClose();
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
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
