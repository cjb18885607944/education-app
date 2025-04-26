<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- 搜索表单 -->
    <div class="grid lg:grid-cols-2 gap-x-4 gap-y-5 mb-6">
      <div class="w-[300px]">
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">学号/工号</span>
          <el-input
            v-model="queryParams.studentId"
            placeholder="请输入学号/工号"
            clearable
            class="!h-[32px]"
          />
        </div>
      </div>
      <div class="flex justify-end items-center mt-6">
        <el-button
          type="primary"
          class="!border-none !w-[140px] !h-[32px] !rounded-[2px] !bg-primary"
          @click="handleSearch"
        >
          查询
        </el-button>
        <el-button
          class="!border-none !w-[140px] !h-[32px] !rounded-[2px] !bg-btn-secondary !text-white ml-3"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="flex items-center h-11 border-t border-gap">
      <button
        class="flex items-center h-full text-text-main hover:text-primary mr-6 text-xs"
        @click="handleAdd"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_add.png)] bg-no-repeat bg-center bg-contain"
        ></div>
        <span>新增人脸库</span>
      </button>
      <button
        class="flex items-center h-full text-text-main hover:text-primary text-xs"
        :class="{ 'opacity-50 cursor-not-allowed': !hasSelected }"
        @click="handleBatchDelete(selectedIds)"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_delete.png)] bg-no-repeat bg-center bg-contain"
        ></div>
        <span>删除人脸库</span>
      </button>
    </div>

    <!-- 卡片列表容器 -->
    <div class="flex-1 bg-bg-main min-h-0 overflow-auto p-6">
      <div class="grid auto-rows-[120px] gap-6" :class="gridClass">
        <CardItem
          v-for="item in personnelList"
          :key="item.modelDataId"
          :title="item.name"
          :count="item.studentNum"
          :selected="selectedIds.includes(item.modelDataId)"
          @select="toggleSelect(item.modelDataId)"
          @edit="handleEditItem(item)"
          @detail="handleDetailItem(item)"
          @delete="handleBatchDelete([item.modelDataId])"
        />
      </div>
    </div>
    <LibraryDialog
      v-model:show="dialogVisible"
      :title="dialogTitle"
      :editData="currentLibrary"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import AppPagination from "@/components/common/AppPagination.vue";
import CardItem from "@/components/common/CardItem.vue";
import { faceLibraryApi } from "@/api/index";
import LibraryDialog from "./LibraryDialog.vue";
import { arrayToUrlParams } from "@/utils";

const router = useRouter();
// dialog
const dialogVisible = ref(false);
const dialogTitle = ref("");
const currentLibrary = ref({});
onMounted(() => {
  handleSearch();
});
const gridClass = computed(() => {
  return personnelList.value.length < 4
    ? "grid-cols-4" // 少于4个时均分为4列
    : "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"; // 大于等于4个时自适应
});
// 查询参数
const queryParams = ref({
  studentNo: "",
  pageNo: 1,
  pageSize: 1000,
});
// 选中项
const selectedIds = ref<string[]>([]);
const hasSelected = computed(() => selectedIds.value.length > 0);
// 模拟数据
const personnelList = ref([]);
// 查询
const handleSearch = async () => {
  try {
    const res = await faceLibraryApi.getList(queryParams.value);
    if (res.code === "0" && res.data.list.length) {
      personnelList.value = res.data.list;
    }
  } catch (e) {
    console.log(e);
  }
};

// 重置
const handleReset = () => {
  queryParams.value.studentId = "";
  handleSearch();
};

// 选择
const toggleSelect = (id: number) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
};

// 新增
const handleAdd = () => {
  // TODO: 跳转到新增页面
  dialogTitle.value = "新增人脸库";
  currentLibrary.value = {};
  dialogVisible.value = true;
};

// 批量删除
const handleBatchDelete = (item: string[]) => {
  ElMessageBox.confirm("确定要删除选中的人脸库吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let params = "";
        params = arrayToUrlParams("idList", item);
        const res = await faceLibraryApi.delete(params);
        if (res.code === "0") {
          ElMessage.success(`删除成功!`);
          handleSearch();
          selectedIds.value = [];
        }
      } catch (e) {
        console.log(e);
      }
    })
    .catch(() => {
      // 处理取消点击
      // ElMessage.info('已取消删除')  // 可选的提示
    });
};

// 编辑
const handleEditItem = (item: any) => {
  // TODO: 跳转到编辑页面
  dialogTitle.value = "编辑人脸库";
  currentLibrary.value = item;
  dialogVisible.value = true;
};
// 详情
const handleDetailItem = (item: any) => {
  // TODO: 跳转到编辑页面
  router.push({
    path: "/PersonManage/class",
    query: {
      id: item.modelDataId,
      name: item.name,
    },
  });
};

// 弹窗回调
const handleDialogSuccess = () => {
  handleSearch();
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-button) {
  height: 32px;
  border: none;
}

:deep(.el-input__inner) {
  height: 32px;
}
</style>
