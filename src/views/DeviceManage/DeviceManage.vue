<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5 py-8 pb-0">
      <h2
        class="text-[24px] leading-[28px] font-[Microsoft YaHei] font-medium mb-6 text-text-title"
      >
        考勤设备管理
      </h2>

      <!-- 搜索表单 -->
      <!-- 搜索表单 -->
      <div class="mb-6">
        <div class="grid lg:grid-cols-5 md:grid-cols-3 gap-x-4 gap-y-5">
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">设备名称</span>
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">状态</span>
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="在线" value="online" />
              <el-option label="离线" value="offline" />
            </el-select>
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">IP地址</span>
            <el-input
              v-model="queryParams.ipAddress"
              placeholder="请输入IP地址"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">设备编号</span>
            <el-input
              v-model="queryParams.deviceNumber"
              placeholder="请输入设备编号"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">设备序列号</span>
            <el-input
              v-model="queryParams.serialNumber"
              placeholder="请输入设备序列号"
              clearable
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
      <div class="flex items-center h-11 border-t border-[#e2e6e9]">
        <button
          v-for="btn in toolbarButtons"
          :key="btn.key"
          class="flex items-center h-full text-text-main mr-6 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="btn.disabled"
          @click="btn.handler"
        >
          <div
            class="w-[18px] h-[18px] mr-2 bg-no-repeat bg-center bg-contain"
            :class="btn.disabled ? btn.disabledIcon : btn.icon"
          ></div>
          <span class="text-[12px]">{{ btn.text }}</span>
        </button>
      </div>

      <!-- 表格 -->
      <div class="flex-1 bg-bg-main">
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{
            background: '#747C83',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 'normal',
            height: '40px',
          }"
          :row-style="{
            height: '42px',
            color: 'rgba(83, 88, 92, 0.8)',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
            width="55"
          />
          <el-table-column prop="name" label="设备名称" min-width="200" />
          <el-table-column label="IP地址及端口号" min-width="200">
            <template #default="{ row }">
              {{ `${row.ip}:${row.port}` }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <span
                :class="row.status === '离线' ? 'text-red-500' : 'text-primary'"
              >
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center space-x-4">
                <el-button link type="primary" @click="handleDetail(row)"
                  >详情</el-button
                >
                <el-button link type="primary" @click="handleEdit(row)"
                  >编辑</el-button
                >
                <el-button link type="primary" @click="handleDelete(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div
        class="flex justify-between items-center h-[52px] border-t border-t-[#E2E6E9]"
      >
        <AppPagination
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MainLayout from "@/components/common/MainLayout.vue";
import type { QueryParams, DeviceInfo } from "@/types/device";
import { useRouter } from "vue-router";
import AppPagination from "@/components/common/AppPagination.vue";
const router = useRouter();
// 加载状态
const loading = ref(false);

// 查询参数
const queryParams = reactive<QueryParams>({
  deviceName: "",
  status: "",
  ipAddress: "",
  deviceNumber: "",
  serialNumber: "",
  pageNo: 1,
  pageSize: 10,
});

// 表格数据
const multipleSelection = ref([]);
const selectable = (row) => ![1].includes(row.id);
const tableData = ref<DeviceInfo[]>([
  { id: 1, name: "设备名称", status: "离线", ip: "192.168.1.2", port: "8000" },
  { id: 2, name: "设备名称", status: "在线", ip: "192.168.1.2", port: "8782" },
]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
// 总数
const total = ref(100);

// 工具栏按钮配置
const toolbarButtons = computed(() => [
  {
    key: "add",
    text: "添加设备",
    icon: "bg-[url(@/assets/images/icon_add.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_add_disabled.png)]",
    disabled: false,
    handler: handleAdd,
  },
  {
    key: "delete",
    text: "删除",
    icon: "bg-[url(@/assets/images/icon_delete.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_delete_disabled.png)]",
    disabled: false,
    handler: handleDelete,
  },
  {
    key: "import",
    text: "导入设备",
    icon: "bg-[url(@/assets/images/icon_import.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_import_disabled.png)]",
    disabled: false,
    handler: handleImport,
  },
  {
    key: "export",
    text: "导出设备",
    icon: "bg-[url(@/assets/images/icon_export.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_export_disabled.png)]",
    disabled: !tableData.value.length, // 无数据时禁用导出
    handler: handleExport,
  },
]);

// 查询
const handleQuery = async () => {
  try {
    loading.value = true;
    // TODO: 调用API
    console.log("查询参数:", queryParams);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟请求
  } catch (error) {
    console.error("查询失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 重置
const handleReset = () => {
  Object.assign(queryParams, {
    deviceName: "",
    status: "",
    ipAddress: "",
    deviceNumber: "",
    serialNumber: "",
    pageNo: 1,
  });
  handleQuery();
};

// 分页相关
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNo = 1;
  handleQuery();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNo = val;
  handleQuery();
};

// 工具栏操作
const handleAdd = () => {
  router.push("/DeviceManage/add");
};

const handleImport = () => {
  ElMessage.success("点击了导入设备");
};

const handleExport = () => {
  if (!tableData.value.length) return;
  ElMessage.success("点击了导出设备");
};

// 表格操作
const handleDetail = (row: DeviceInfo) => {
  ElMessage.success(`查看详情：${row.name}`);
};

const handleEdit = (row: DeviceInfo) => {
  ElMessage.success(`编辑设备：${row.name}`);
};

const handleDelete = (row: DeviceInfo) => {
  ElMessageBox.confirm("确定要删除该设备吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage.success(`删除设备：${row.name}`);
  });
};
</script>

<style scoped>
:deep(.el-table__cell) {
  height: 42px !important;
}

:deep(.el-table__header th) {
  height: 40px !important;
}

:deep(.el-button--text) {
  padding: 0 4px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
}

/* 移除按钮间的边距 */
:deep(.el-button--text + .el-button--text) {
  margin-left: 8px;
}

:deep(.el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-button) {
  height: 32px;
  border: none;
}
:deep(.el-pager li) {
  background: transparent;
}
</style>
