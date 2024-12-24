<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5 py-8 pb-0">
      <h2
        class="leading-[36px] text-[24px] leading-[28px] font-[Microsoft YaHei] font-medium mb-3 text-text-title"
      >
        人脸比对结果统计
      </h2>
      <!-- 面包屑 -->
      <AppBreadcrumb
        :height="20"
        :class-name="currentClass"
        :hasBorder="false"
      />
      <!-- 统计结果 -->
      <div class="pt-6">
        <div
          class="h-[98px] relative flex items-center rounded-[4px]"
          style="
            background: linear-gradient(
              180deg,
              rgb(220, 236, 249),
              rgb(145, 189, 223) 99.237%
            );
          "
        >
          <img
            src="@/assets/images/bg-statistics.png"
            class="absolute inset-0 w-full h-full"
            alt=""
          />
          <div
            class="h-6 flex flex-1 items-center justify-evenly font-bold text-[24px] text-white border-r border-r-[#ffffff]"
          >
            <div class="">应到人数</div>
            <div class="">315</div>
          </div>
          <div
            class="h-6 flex flex-1 items-center justify-evenly font-bold text-[24px] text-white"
          >
            <div class="">实到人数</div>
            <div class="">165</div>
          </div>
        </div>
      </div>
      <div class="py-6">
        <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-x-10">
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
            <span class="mb-1 text-sm text-text-content">人员姓名</span>
            <el-input
              v-model="queryParams.personName"
              placeholder="请输入人员姓名"
              clearable
              class="!h-[32px]"
            />
          </div>
        </div>
      </div>
      <div class="flex-1 bg-bg-main mt-6">
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
        >
          <el-table-column type="index" width="55" label="序号" />
          <el-table-column prop="name" label="人员姓名" min-width="200" />
          <el-table-column prop="name" label="人脸库名称" min-width="200">
          </el-table-column>
          <el-table-column prop="name" label="考勤状态" min-width="200">
            <template #default="{ row }">
              <span
                :class="row.status === '离线' ? 'text-red-500' : 'text-primary'"
              >
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="考勤图片" min-width="200" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center space-x-4">
                <el-button link type="primary" @click="handleDetail(row)"
                  >查看详情</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <AttendanceDialog
      v-model:show="dialogVisible"
      title="人员详情"
      @success="handleDialogSuccess"
    />
  </MainLayout>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "@/components/common/MainLayout.vue";
import AppBreadcrumb from "@/components/common/AppBreadcrumb.vue";
import AppPagination from "@/components/common/AppPagination.vue";
import AttendanceDialog from "./components/AttendanceDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const currentClass = "xxx班级";

const queryParams = {
  status: "",
  personName: "",
  pageNo: 1,
  pageSize: 10,
};
const total = ref(100);

const tableData = ref([
  { id: 1, name: "设备名称", status: "离线", ip: "192.168.1.2", port: "8000" },
  { id: 2, name: "设备名称", status: "在线", ip: "192.168.1.2", port: "8782" },
]);
// 弹窗控制
const dialogVisible = ref(false);
// 表格操作
const handleDetail = (row) => {
  ElMessage.success(`查看详情：${row.name}`);
  dialogVisible.value = true;
};
</script>
