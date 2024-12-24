<template>
  <el-dialog
    lock-scroll
    align-center
    :title="title"
    :model-value="show"
    @close="handleClose"
    :close-on-click-modal="false"
    width="1200px"
    style="height: 80%"
    class="person-dialog"
  >
    <template #header>
      <div class="text-[24px] text-text-title font-bold">人员详情</div>
    </template>

    <div>
      <div class="flex leading-[26px] items-center">
        <div
          class="border w-4 h-4 border-4 border-[rgb(145,189,223)] rounded-full mr-3"
        ></div>
        <div class="text-[18px]">基础信息</div>
      </div>
      <div class="h-[166px] flex px-10 py-[23px]">
        <div class="w-[120px] h-[120px] mr-16 bg-[#C4C4C4] flex-0">
          <img src="" alt="" />
        </div>
        <div class="flex flex-1">
          <div class="flex flex-1 text-[14px] items-center w-[30%]">
            <div class="text-text-title mr-16">姓名</div>
            <div class="text-text-main">张三</div>
          </div>
          <div class="flex flex-1 text-[14px] items-center">
            <div class="text-text-title mr-16">学号</div>
            <div class="text-text-main">1234556</div>
          </div>
          <div class="flex flex-1 text-[14px] items-center">
            <div class="text-text-title mr-16">人脸库</div>
            <div class="text-text-main">三年级一班</div>
          </div>
        </div>
      </div>
      <div class="flex leading-[26px] items-center">
        <div
          class="border w-4 h-4 border-4 border-[rgb(145,189,223)] rounded-full mr-3"
        ></div>
        <div class="text-[18px]">考勤日历</div>
      </div>
      <!-- 日历 -->
      <el-calendar>
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split("-").slice(1).join("-") }}
            {{ data.isSelected ? "✔️" : "" }}
          </p>
        </template>
      </el-calendar>
      <!-- 考勤记录 -->
      <div class="border-t pt-4">
        <div
          class="pl-5 text-[14px] text-text-title leading-[24px] border-l border-l-[#91BDDF] border-l-[2px]"
        >
          21日考勤记录
        </div>
        <div class="" v-for="item in 5" :key="item">
          <div class="flex mt-4 px-5">
            <div class="w-[72px] h-[72px] bg-[#C4C4C4] flex-0 mr-7">
              <img src="" alt="" />
            </div>
            <div
              class="flex-1 flex flex-col justify-between py-1 text-text-title"
            >
              <div class="leading-[26px]">2024-01-01 10:10:10</div>
              <div class="leading-[26px]">星期{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, withDefaults, defineProps, defineEmits } from "vue";
import type { FormInstance } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

interface Props {
  show: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
</script>
<style>
.person-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  margin: 15vh auto 0 !important;
}

.person-dialog .el-dialog__body {
  height: calc(100% - 52px);
  overflow-y: auto;
}
</style>
