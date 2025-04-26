<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5 py-8 pb-0">
      <h2
        class="text-[24px] leading-[28px] font-[Microsoft YaHei] font-medium mb-6 text-text-title"
      >
        人脸比对结果统计
      </h2>

      <!-- 搜索表单 -->
      <div class="grid lg:grid-cols-4 gap-x-10">
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">人脸库名称</span>
          <el-input
            v-model="queryParams.faceLibraryName"
            placeholder="请输入人脸库名称"
            clearable
            class="!h-[32px]"
          />
        </div>
        <div class="flex flex-col">
          <span class="mb-1 text-sm text-text-content">考勤日期</span>
          <el-date-picker
            v-model="queryParams.attendanceDate"
            type="date"
            placeholder="Pick a day"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </div>
        <div class="flex flex-col"></div>
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

      <!-- 统计结果 -->
      <div class="pt-6">
        <div class="fz-[18px] text-text-title leading-9 font-bold mb-4">
          学生考勤情况
        </div>
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
            <div class="">人脸库总数</div>
            <div class="">{{ statisticsData.faceLibraryNum || 0 }}</div>
          </div>
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
            prop="faceLibraryName"
            label="人脸库名称"
            min-width="200"
          />
          <el-table-column prop="totalNum" label="应到人数" min-width="200">
          </el-table-column>
          <el-table-column prop="actualNum" label="实到人数" min-width="200">
          </el-table-column>
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
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/common/MainLayout.vue";
import AppPagination from "@/components/common/AppPagination.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { attendanceStatistics } from "@/api";
import moment from "moment";

const router = useRouter();

onMounted(() => {
  queryParams.value.attendanceDate = moment().format("yyyy-MM-DD");
  handleSearch();
});
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
const queryParams = ref({
  attendanceDate: "",
  faceLibraryName: "",
  pageNo: 1,
  pageSize: 10,
});
const total = ref(0);

const tableData = ref([]);
const statisticsData = ref({
  faceLibraryNum: 0,
  totalNum: 0,
  actualNum: 0,
});
// 表格操作
const handleDetail = (row) => {
  router.push({
    path: "/AttendanceDetail",
    query: {
      id: row.faceLibraryId,
      name: row.faceLibraryName,
    },
  });
};
const handleSearchStatistics = async () => {
  try {
    let params = {
      attendanceDate: queryParams.value.attendanceDate,
    };
    const res = await attendanceStatistics.StuAttSum(params);
    statisticsData.value = res.data || {};
  } catch (e) {
    console.log(e);
  }
};
const handleSearch = async () => {
  try {
    handleSearchStatistics();
    const res = await attendanceStatistics.attPage(queryParams.value);
    tableData.value = res.data?.list;
    total.value = res.data?.total;
  } catch (e) {
    console.log(e);
  }
};
// 重置
const handleReset = () => {
  queryParams.value = {
    attendanceDate: moment().format("yyyy-MM-DD"),
    faceLibraryName: "",
    pageNo: 1,
    pageSize: 10,
  };
  handleSearch();
};
// 分页相关
const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val;
  queryParams.value.pageNo = 1;
  handleSearch();
};

const handleCurrentChange = (val: number) => {
  queryParams.value.pageNo = val;
  handleSearch();
};
</script>
<style scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
</style>
