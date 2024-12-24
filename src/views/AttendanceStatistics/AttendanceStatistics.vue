<template>
  <MainLayout>
    <div class="flex-1 flex flex-col h-full px-5 py-8 pb-0">
      <h2
        class="text-[24px] leading-[28px] font-[Microsoft YaHei] font-medium mb-6 text-text-title"
      >
        人脸比对结果统计
      </h2>

      <!-- 搜索表单 -->
      <div class="flex justify-between border-b border-b-border-gap pb-6">
        <div class="w-[300px]">
          <div class="flex flex-col">
            <span class="mb-1 text-sm text-text-content">人脸库名称</span>
            <el-input
              v-model="queryParams.queryParams"
              placeholder="请输入人脸库名称"
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
            <div class="">人脸库总数</div>
            <div class="">15</div>
          </div>
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
          <el-table-column prop="name" label="人脸库名称" min-width="200" />
          <el-table-column prop="name" label="应到人数" min-width="200">
          </el-table-column>
          <el-table-column prop="name" label="实到人数" min-width="200">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/common/MainLayout.vue";
import AppPagination from "@/components/common/AppPagination.vue";
import { ElMessage, ElMessageBox } from "element-plus";
const router = useRouter();

const queryParams = {
  faceName: "",
  pageNo: 1,
  pageSize: 10,
};
const total = ref(100);

const tableData = ref([
  { id: 1, name: "设备名称", status: "离线", ip: "192.168.1.2", port: "8000" },
  { id: 2, name: "设备名称", status: "在线", ip: "192.168.1.2", port: "8782" },
]);
// 表格操作
const handleDetail = (row) => {
  ElMessage.success(`查看详情：${row.name}`);
  router.push("/AttendanceDetail");
};
</script>
