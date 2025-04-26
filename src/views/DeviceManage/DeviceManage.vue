<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5 py-8 pb-0">
      <h2
        class="text-[24px] leading-[28px] font-[Microsoft YaHei] font-medium mb-6 text-text-title"
      >
        考勤设备管理
      </h2>

      <!-- 搜索表单 -->
      <div class="mb-6">
        <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-x-4 gap-y-5">
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">设备名称</span>
            <el-input
              v-model="queryParams.name"
              placeholder="请输入设备名称"
              clearable
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">状态</span>
            <el-select
              v-model="queryParams.status"
              placeholder="全部"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="在线" :value="0" />
              <el-option label="离线" :value="1" />
              <el-option label="未检测" :value="2" />
            </el-select>
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">IP地址</span>
            <el-input
              v-model="queryParams.ip"
              placeholder="请输入IP地址"
              clearable
            />
          </div>
          <!-- <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">设备编号</span>
            <el-input
              v-model="queryParams.equipmentId"
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
          </div> -->
          <div class="flex justify-end items-center mt-6">
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
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleImport"
        />
      </div>

      <!-- 表格 -->
      <div class="flex-1 bg-bg-main">
        <el-table
          stripe
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
              <span :class="statusList[row.status].statusColor">
                {{ statusList[row.status]?.statusText || "未知" }}
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
                <el-button
                  link
                  type="primary"
                  @click="handleDelete([row.modelDataId])"
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
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MainLayout from "@/components/common/MainLayout.vue";
import type { QueryParams, DeviceInfo } from "@/types/device";
import { useRouter } from "vue-router";
import AppPagination from "@/components/common/AppPagination.vue";
import { equipmentApi } from "@/api";
import { arrayToUrlParams, downloadFileFromBlob } from "@/utils";
import moment from "moment";
onMounted(() => {
  handleQuery();
});

const router = useRouter();
// 0：在线，1：离线，2：未检测
const statusList = {
  0: {
    statusText: "在线",
    statusColor: "text-red-500",
  },
  1: {
    statusText: "离线",
    statusColor: "text-primary",
  },
  2: {
    statusText: "未检测",
    statusColor: "",
  },
};

// 查询参数
const queryParams = reactive<QueryParams>({
  modelDataId: "",
  name: "",
  ip: "",
  status: "",
  equipmentId: "",
  serialNumber: "",
  pageNo: 1,
  pageSize: 10,
});

// 表格数据
const multipleSelection = ref([]);
const selectable = (row: DeviceInfo) => ![1].includes(row.id);
const tableData = ref<DeviceInfo[]>([]);
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};
// 总数
const total = ref(0);

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
    disabled: multipleSelection.value.length <= 0,
    handler: () =>
      handleDelete(multipleSelection.value.map((val) => val.modelDataId)),
  },
  {
    key: "import",
    text: "导入设备",
    icon: "bg-[url(@/assets/images/icon_import.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_import_disabled.png)]",
    disabled: false,
    handler: () => handleClickImport(),
  },
  {
    key: "export",
    text: "导出设备",
    icon: "bg-[url(@/assets/images/icon_export.png)]",
    disabledIcon: "bg-[url(@/assets/images/icon_export_disabled.png)]",
    disabled: !tableData.value.length, // 无数据时禁用导出
    handler: () => handleExport(),
  },
]);

// 查询
const handleQuery = async () => {
  try {
    // TODO: 调用API
    const res = await equipmentApi.getList(queryParams);
    tableData.value = res.data?.list;
    total.value = res.data?.total;
  } catch (error) {
    console.error("查询失败:", error);
  }
};

// 重置
const handleReset = () => {
  Object.assign(queryParams, {
    modelDataId: "",
    name: "",
    status: "",
    ip: "",
    equipmentId: "",
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

const fileInput = ref<HTMLInputElement | null>(null);
const handleClickImport = () => {
  fileInput.value?.click();
};
const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    let res = await equipmentApi.importEquipments(file);
    if (res.code === "0") {
      ElMessage.success("导入设备成功!");
      handleQuery();
    }
    // 重置 input 的值，这样相同文件可以重复上传
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } catch (e) {
    console.log(e);
    ElMessage.error("导入失败");
  }
};

const handleExport = async () => {
  if (!tableData.value.length) return;
  let res = await equipmentApi.exportEquipments(queryParams);
  downloadFileFromBlob(res);
  ElMessage.success("导出成功!");
};

// 表格操作
const handleDetail = (row: DeviceInfo) => {
  router.push({
    path: "/DeviceManage/add",
    query: {
      type: "detail",
      modelDataId: row.modelDataId,
    },
  });
  ElMessage.success(`查看详情：${row.name}`);
};

const handleEdit = (row: DeviceInfo) => {
  router.push({
    path: "/DeviceManage/add",
    query: {
      type: "edit",
      modelDataId: row.modelDataId,
    },
  });
};

const handleDelete = (item: string[]) => {
  ElMessageBox.confirm("确定要删除该设备吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let params = "";
        params = arrayToUrlParams("idList", item);

        const res = await equipmentApi.delete(params);
        if (res.code === "0") {
          ElMessage.success(`删除成功!`);
          handleQuery();
          multipleSelection.value = [];
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
