<!-- views/Personnel/PersonList.vue -->
<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- 搜索区域 -->
    <div class="pb-6">
      <div class="grid grid-cols-5 gap-x-4">
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">识别计划名称</span>
          <el-input v-model="queryParams.name" placeholder="请输入" clearable />
        </div>
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">识别计划下发状态</span>
          <el-select v-model="queryParams.status" placeholder="全部" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="下发中" :value="1" />
            <el-option label="已结束" :value="2" />
          </el-select>
        </div>
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">人脸库ID</span>
          <el-input
            v-model="queryParams.faceLibraryId"
            placeholder="请输入"
            clearable
          />
        </div>
        <div class="flex flex-col"></div>
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
        添加
      </button>
      <button
        class="flex items-center text-xs text-text-main hover:text-primary mr-6"
        :class="{
          'opacity-50 cursor-not-allowed': multipleSelection.length <= 0,
        }"
        :disabled="multipleSelection.length <= 0"
        @click="
          () => handleDelete(multipleSelection.map((val) => val.modelDataId))
        "
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_delete.png)] bg-no-repeat bg-center bg-contain"
        />
        删除
      </button>
      <button
        class="flex items-center text-xs text-text-main hover:text-primary mr-6"
        @click="handleSearch"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_refresh.png)] bg-no-repeat bg-center bg-contain"
        />
        刷新
      </button>
      <!-- <button
        class="flex items-center text-xs text-text-main hover:text-primary mr-6"
        @click="handleImport"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_edit.png)] bg-no-repeat bg-center bg-contain"
        />
        批量编辑
      </button> -->
      <button
        class="flex items-center text-xs text-text-main hover:text-primary mr-6"
        :class="{
          'opacity-50 cursor-not-allowed': multipleSelection.length <= 0,
        }"
        :disabled="multipleSelection.length <= 0"
        @click="() => handleResend(multipleSelection)"
      >
        <div
          class="w-[18px] h-[18px] mr-2 bg-[url(@/assets/images/icon_resend.png)] bg-no-repeat bg-center bg-contain"
        />
        批量重发
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
        <el-table-column type="selection" :selectable="selectable" width="55" />
        <el-table-column prop="name" label="识别计划名称" min-width="120" />
        <el-table-column
          prop="equipmentName"
          label="所属设备"
          min-width="150"
        />
        <el-table-column prop="faceLibraryName" label="人脸库" min-width="150">
        </el-table-column>
        <el-table-column prop="successNum" label="人脸下发统计" min-width="220">
          <template #default="{ row }">
            <div class="flex w-full">
              <div class="w-[60px] text-[#7BBFF2]">
                成功：{{ row.successNum || "--" }}
              </div>
              <div
                class="flex-1 ml-10"
                :class="row.failNum > 0 ? 'text-[red]' : ''"
              >
                失败： {{ row.failNum || "--" }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="识别下发状态" min-width="150">
          <template #default="{ row }">
            <span>{{ statusLibrary[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center space-x-4">
              <el-button link type="primary" @click="handleResend([row])"
                >重新下发</el-button
              >
              <el-button link type="primary" @click="handleSearch"
                >刷新</el-button
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
    <div class="h-[52px] flex items-center justify-between border-t border-gap">
      <AppPagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <PlanDialog
      v-model:show="dialogVisible"
      :title="dialogTitle"
      :edit-data="editData"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AppPagination from "@/components/common/AppPagination.vue";
import PlanDialog from "./PlanDialog.vue";
import { recognizePlanApi } from "@/api";
import { arrayToUrlParams } from "@/utils";

onMounted(() => {
  handleSearch();
});
const statusLibrary = {
  0: "未开始",
  1: "下发中",
  2: "已结束",
};
// 查询参数
const queryParams = ref({
  name: "",
  status: "",
  faceLibraryId: "",
  pageNo: 1,
  pageSize: 10,
});
const currentClass = "xxx班级";
// 表格数据
const multipleSelection = ref([]);
const selectable = (row) => ![1].includes(row.id);
const tableData = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const total = ref(0);

// 弹窗控制
const dialogVisible = ref(false);
const dialogTitle = ref("");
const editData = ref({});

// 查询
const handleSearch = async () => {
  // TODO: 加载数据
  try {
    const res = await recognizePlanApi.getList(queryParams.value);
    if (res.code === "0" && res.data.list.length) {
      tableData.value = res.data.list;
      total.value = res.data.total;
    }
  } catch (e) {
    console.log(e);
  }
};

// 重置
const handleReset = () => {
  queryParams.value = {
    name: "",
    status: "",
    faceLibraryId: "",
    pageNo: 1,
    pageSize: 10,
  };
  handleSearch();
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

// 新增
const handleAdd = () => {
  dialogTitle.value = "新增识别计划";
  editData.value = {};
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = "编辑识别计划";
  editData.value = { ...row };
  dialogVisible.value = true;
};

// 删除
const handleDelete = async (item: string[]) => {
  ElMessageBox.confirm("确定要删除该账号吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let params = "";
        params = arrayToUrlParams("idList", item);
        const res = await recognizePlanApi.delete(params);
        if (res.code === "0") {
          ElMessage.success(`删除成功!`);
          handleSearch();
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
// 重新下发
const handleResend = async (row: any[]) => {
  ElMessageBox.confirm("确定要重新下发吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let params = row.map((item) => item.modelDataId);
        const res = await recognizePlanApi.batchDelivery(params);
        if (res.code === "0") {
          ElMessage.success(`下发成功!`);
        }
        handleSearch();
      } catch (e) {
        console.log(e);
      }
    })
    .catch(() => {
      // 处理取消点击
      // ElMessage.info('已取消删除')  // 可选的提示
    });
};

// 弹窗回调
const handleDialogSuccess = () => {
  handleSearch();
};
</script>
