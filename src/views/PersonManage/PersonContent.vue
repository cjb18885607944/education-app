<!-- views/Personnel/index.vue -->
<template>
  <MainLayout>
    <div class="flex-1 flex h-full px-5 py-8 pb-0">
      <!-- Tab切换 -->
      <el-tabs v-model="activeTab" class="w-full h-full flex">
        <el-tab-pane
          label="人员管理"
          name="personnel"
          class="flex-1 flex flex-col h-full"
        >
          <PersonManage />
        </el-tab-pane>

        <el-tab-pane
          label="识别计划管理"
          name="plan"
          class="flex-1 flex flex-col h-full"
        >
          <!-- 识别计划管理内容 -->
          <PlanManage />
        </el-tab-pane>
      </el-tabs>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "@/components/common/MainLayout.vue";
import PersonManage from "./components/PersonManage.vue";
import PlanManage from "./components/PlanManage.vue";

// Tab 切换
const activeTab = ref("personnel");
</script>
<style scoped>
:deep(.el-tabs__item) {
  font-size: 24px !important;
  font-weight: bold !important;
  margin-right: 56px !important;
  padding: 0;
  height: 38px !important;
  line-height: 38px !important;
  color: rgba(83, 88, 92, 0.3) !important;
}

:deep(.el-tabs__item.is-active) {
  color: rgba(83, 88, 92, 0.8) !important;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.el-tabs__active-bar, .is-top) {
  display: none;
}

:deep(.el-tabs__header) {
  margin-bottom: 24px;
  border-bottom: none;
}
</style>
