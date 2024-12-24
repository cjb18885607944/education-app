<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- 搜索表单 -->
    <div class="flex justify-between mb-6">
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
      <div class="flex mt-6 float-right">
        <el-button
          type="primary"
          class="!border-none !w-[140px] !h-[32px] !rounded-[2px] !bg-primary"
          @click="handleQuery"
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
        @click="handleBatchDelete"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_delete.png)] bg-no-repeat bg-center bg-contain"
        ></div>
        <span>删除人脸库</span>
      </button>
    </div>

    <!-- 卡片列表容器 -->
    <div class="flex-1 bg-bg-main min-h-0 overflow-auto">
      <div class="pb-6">
        <div
          class="grid gap-6"
          style="
            grid-template-columns: repeat(auto-fill, 296px);
            justify-content: space-between;
          "
        >
          <CardItem
            v-for="item in personnelList"
            :key="item.id"
            :title="item.title"
            :count="item.count"
            :selected="selectedIds.includes(item.id)"
            @select="toggleSelect(item.id)"
            @edit="handleEditItem(item)"
            @delete="handleDeleteItem(item)"
          />
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="h-[52px] flex items-center justify-between border-t border-gap">
      <AppPagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import AppPagination from "@/components/common/AppPagination.vue";
import CardItem from "@/components/common/CardItem.vue";

const router = useRouter();

// 查询参数
const queryParams = ref({
  studentId: "",
  pageNo: 1,
  pageSize: 10,
});

// 总数
const total = ref(800);

// 选中项
const selectedIds = ref<number[]>([]);
const hasSelected = computed(() => selectedIds.value.length > 0);

// 模拟数据
const personnelList = ref([
  { id: 1, title: "XXXXXXXX学校三年级一班1", count: 56 },
  { id: 2, title: "XXXXXXXX学校三年级二班2", count: 54 },
  { id: 3, title: "XXXXXXXX学校三年级三班3", count: 52 },
  { id: 3, title: "XXXXXXXX学校三年级三班4", count: 52 },
  { id: 3, title: "XXXXXXXX学校三年级三班5", count: 52 },
  { id: 3, title: "XXXXXXXX学校三年级三班6", count: 52 },
  // ... 更多数据
]);

// 查询
const handleSearch = () => {
  queryParams.value.pageNo = 1;
  // TODO: 加载数据
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
};

// 批量删除
const handleBatchDelete = () => {
  if (!selectedIds.value.length) return;
  ElMessageBox.confirm("确定要删除选中的人脸库吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage.success("删除成功");
    selectedIds.value = [];
  });
};

// 编辑
const handleEditItem = (item: any) => {
  // TODO: 跳转到编辑页面
  router.push("/PersonManage/class");
};

// 删除
const handleDeleteItem = (item: any) => {
  ElMessageBox.confirm("确定要删除该人脸库吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage.success(`删除成功: ${item.title}`);
  });
};

// 分页
const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size;
  handleSearch();
};

const handleCurrentChange = (page: number) => {
  queryParams.value.pageNo = page;
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
