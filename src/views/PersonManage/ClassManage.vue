<!-- views/Personnel/PersonList.vue -->
<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5">
      <!-- 面包屑 -->
      <AppBreadcrumb :height="62" :class-name="currentClass" />

      <!-- 搜索区域 -->
      <div class="py-6">
        <div class="grid grid-cols-5 gap-x-4">
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">人员姓名</span>
            <el-input
              v-model="queryParams.name"
              placeholder="请输入"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">是否录入人脸</span>
            <el-select
              v-model="queryParams.hasFace"
              placeholder="全部"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">学号/工号</span>
            <el-input
              v-model="queryParams.number"
              placeholder="请输入"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">账号状态</span>
            <el-select
              v-model="queryParams.status"
              placeholder="不限"
              clearable
            >
              <el-option label="不限" value="" />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </div>
          <div class="flex flex-0 items-center mt-6 justify-end">
            <el-button
              type="primary"
              class="!w-[140px] !h-[32px] !rounded-[2px] !bg-primary"
              @click="handleSearch"
              >查询</el-button
            >
            <el-button
              class="!w-[140px] !h-[32px] !rounded-[2px] !bg-btn-secondary !text-white ml-3"
              @click="handleReset"
              >重置</el-button
            >
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="flex items-center h-11 border-t border-gap">
        <button
          class="flex items-center text-xs text-text-main hover:text-primary mr-6"
          @click="handleAdd"
        >
          <div
            class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_add.png)] bg-no-repeat bg-center bg-contain"
          />
          添加人员
        </button>
        <button
          class="flex items-center text-xs text-text-main hover:text-primary mr-6"
          @click="handleDelete"
        >
          <div
            class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_delete.png)] bg-no-repeat bg-center bg-contain"
          />
          删除
        </button>
        <button
          class="flex items-center text-xs text-text-main hover:text-primary mr-6"
          @click="handleImport"
        >
          <div
            class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_import.png)] bg-no-repeat bg-center bg-contain"
          />
          导入
        </button>
        <button
          class="flex items-center text-xs text-text-main hover:text-primary mr-6"
          @click="handleExport"
        >
          <div
            class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_export.png)] bg-no-repeat bg-center bg-contain"
          />
          导出
        </button>
      </div>

      <!-- 表格 -->
      <div class="flex-1 bg-bg-main">
        <el-table
          :data="tableData"
          :header-cell-style="{
            background: '#747C83',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 'normal',
            height: '40px',
          }"
          :row-style="{ height: '42px' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
            width="55"
          />
          <el-table-column prop="name" label="人员姓名" min-width="120" />
          <el-table-column prop="number" label="学号/工号" min-width="150" />
          <el-table-column label="人脸" min-width="100">
            <template #default="{ row }">
              <span :class="row.hasFace ? 'text-primary' : 'text-red-500'">
                {{ row.hasFace ? "已录入" : "无" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态" min-width="100">
            <template #default="{ row }">
              <span>{{ row.status === "1" ? "启用" : "停用" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center space-x-4">
                <el-button link type="primary" @click="handleDetail(row)"
                  >禁用账号</el-button
                >
                <el-button link type="primary" @click="handleEdit(row)"
                  >编辑</el-button
                >
                <el-button link type="primary" @click="handleDelete(row)"
                  >删除账号</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div
        class="h-[52px] flex items-center justify-between border-t border-gap"
      >
        <AppPagination
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 人员新增/编辑弹窗 -->
      <PersonDialog
        v-model:show="dialogVisible"
        :title="dialogType === 'add' ? '添加人员' : '编辑人员'"
        :edit-data="editData"
        @success="handleDialogSuccess"
      />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MainLayout from "@/components/common/MainLayout.vue";
import AppBreadcrumb from "@/components/common/AppBreadcrumb.vue";
import AppPagination from "@/components/common/AppPagination.vue";
import PersonDialog from "./components/PersonDialog.vue";

// 查询参数
const queryParams = reactive({
  name: "",
  hasFace: "",
  number: "",
  status: "",
  pageNo: 1,
  pageSize: 10,
});
const currentClass = "xxx班级";
// 表格数据
const multipleSelection = ref([]);
const selectable = (row) => ![1].includes(row.id);
const tableData = ref([
  { id: 1, name: "张三", number: "2024011234", hasFace: true, status: "1" },
  { id: 2, name: "李四", number: "2024011235", hasFace: false, status: "1" },
]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const total = ref(800);

// 弹窗控制
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const editData = ref({});

// 查询
const handleSearch = () => {
  queryParams.pageNo = 1;
  // TODO: 加载数据
};

// 重置
const handleReset = () => {
  Object.assign(queryParams, {
    name: "",
    hasFace: "",
    number: "",
    status: "",
    pageNo: 1,
  });
  handleSearch();
};

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  handleSearch();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNo = page;
  handleSearch();
};

// 新增
const handleAdd = () => {
  dialogType.value = "add";
  editData.value = {};
  dialogVisible.value = true;
};

// 导入
const handleImport = () => {
  // TODO: 实现导入逻辑
};
// 导入
const handleExport = () => {
  // TODO: 实现导入逻辑
};

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = "edit";
  editData.value = { ...row };
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定要删除该账号吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage.success("删除成功");
  });
};

// 弹窗回调
const handleDialogSuccess = () => {
  handleSearch();
};
</script>
