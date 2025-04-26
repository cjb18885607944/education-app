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
        :class-name="faceLibraryName"
        :hasBorder="false"
      />
      <!-- 统计结果 -->
      <div class="pt-6">
        <div
          class="h-[98px] relative flex items-center rounded-[4px]"
          style="
            background: linear-gradient(
              180deg,
              rgb(var(--color-primary) / 0.2),
              rgb(var(--color-primary)) 100%
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
            <div class="">{{ statisticsData.totalNum || 0 }}</div>
          </div>
          <div
            class="h-6 flex flex-1 items-center justify-evenly font-bold text-[24px] text-white"
          >
            <div class="">实到人数</div>
            <div class="">{{ statisticsData.actualNum || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="py-6">
        <div class="grid lg:grid-cols-4 gap-x-10">
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">考勤状态</span>
            <el-select
              v-model="queryParams.status"
              placeholder="全部"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="正常" :value="0" />
              <el-option label="缺勤" :value="1" />
            </el-select>
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">人员姓名</span>
            <el-input
              v-model="queryParams.studentName"
              placeholder="请输入人员姓名"
              clearable
              class="!h-[32px]"
            />
          </div>
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">人脸库名称</span>
            <el-date-picker
              v-model="queryParams.attendanceDate"
              type="date"
              placeholder="Pick a day"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
            />
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
      </div>
      <div class="flex-1 bg-bg-main mt-6">
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
        >
          <el-table-column type="index" width="55" label="序号" />
          <el-table-column
            prop="studentName"
            label="人员姓名"
            min-width="200"
          />
          <el-table-column
            prop="faceLibraryName"
            label="人脸库名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column prop="name" label="考勤状态" min-width="200">
            <template #default="{ row }">
              <span :class="row.status === 1 ? 'text-[red]' : ''">{{
                statusLibrary[row.status]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="attendancePic"
            label="考勤图片"
            min-width="200"
          >
            <template #default="{ row }">
              <el-image
                :preview-teleported="true"
                hide-on-click-modal
                style="height: 40px"
                :src="row.attendancePic"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[row.attendancePic]"
                fit="cover"
                v-if="row.attendancePic"
              />
              <span class="text-[red]" v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
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
      :currentData="currentData"
    />
  </MainLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import MainLayout from "@/components/common/MainLayout.vue";
import AppBreadcrumb from "@/components/common/AppBreadcrumb.vue";
import AppPagination from "@/components/common/AppPagination.vue";
import AttendanceDialog from "./components/AttendanceDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { attendanceStatistics } from "@/api";
import moment from "moment";

const router = useRouter();
const route = useRoute();
let faceLibraryName = ref("");
let faceLibraryId = ref("");
const statusLibrary = {
  0: "正常",
  1: "缺勤",
};
onMounted(() => {
  faceLibraryName.value = route.query.name;
  faceLibraryId.value = route.query.id;
  queryParams.value.attendanceDate = moment().format("yyyy-MM-DD");

  handleSearchStatistics();
  handleSearch();
});

const queryParams = ref({
  attendanceDate: "",
  status: "",
  studentName: "",
  pageNo: 1,
  pageSize: 10,
});
const total = ref(0);

// 弹窗控制
const dialogVisible = ref(false);
const currentData = ref({});
// 表格操作
const handleDetail = (row) => {
  currentData.value = row;
  dialogVisible.value = true;
};
let statisticsData = ref({});
let tableData = ref([]);
const handleSearchStatistics = async () => {
  try {
    let params = {
      attendanceDate: queryParams.value.attendanceDate,
    };
    const res = await attendanceStatistics.StuAttSum(params);
    statisticsData.value = res.data;
  } catch (e) {
    console.log(e);
  }
};
const handleSearch = async () => {
  try {
    let params = {
      ...queryParams.value,
      faceLibraryId: faceLibraryId.value,
      faceLibraryName: faceLibraryName.value,
    };
    const res = await attendanceStatistics.stuAttDetail(params);
    tableData.value = res.data?.list;
    total.value = res.data?.total;
  } catch (e) {
    console.log(e);
  }
};
const handleReset = () => {
  queryParams.value = {
    attendanceDate: moment().format("yyyy-MM-DD"),
    status: "",
    studentName: "",
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
</script>
<style scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
</style>
