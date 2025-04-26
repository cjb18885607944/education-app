<template>
  <el-dialog
    lock-scroll
    align-center
    title="人员详情"
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
          class="border w-4 h-4 border-4 border-[rgb(var(--color-primary))] rounded-full mr-3"
        ></div>
        <div class="text-[18px]">基础信息</div>
      </div>
      <div class="h-[166px] flex px-10 py-[23px]">
        <div class="w-[120px] h-[120px] mr-16 bg-[#C4C4C4] flex-0">
          <el-image
            style="width: 100%; height: 100%"
            :preview-teleported="true"
            hide-on-click-modal
            :src="stuADetailDto.faceUrl"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[stuADetailDto.faceUrl]"
            fit="cover"
          />
        </div>
        <div class="flex flex-1">
          <div class="flex flex-1 text-[14px] items-center w-[30%]">
            <div class="text-text-title mr-16">姓名</div>
            <div class="text-text-[#53585C]">
              {{ stuADetailDto.studentName || "--" }}
            </div>
          </div>
          <div class="flex flex-1 text-[14px] items-center">
            <div class="text-text-title mr-16">学号</div>
            <div class="text-text-[#53585C]">
              {{ stuADetailDto.studentNo || "--" }}
            </div>
          </div>
          <div class="flex flex-1 text-[14px] items-center">
            <div class="text-text-title mr-16">人脸库</div>
            <div class="text-text-[#53585C]">
              {{
                stuADetailDto.faceLibraryName ||
                props.currentData.faceLibraryName ||
                "--"
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex leading-[26px] items-center">
        <div
          class="border w-4 h-4 border-4 border-[rgb(var(--color-primary))] rounded-full mr-3"
        ></div>
        <div class="text-[18px]">考勤日历</div>
      </div>
      <!-- 日历 -->
      <el-calendar ref="calendar" v-model="currentDate">
        <template #header="{ date }">
          <div class="flex justify-center items-center w-full">
            <el-button
              text
              :icon="DArrowLeft"
              @click="handleChangeCurrentDate(-12, 'prev-year')"
            >
            </el-button>
            <el-button
              text
              :icon="ArrowLeft"
              @click="handleChangeCurrentDate(-1, 'prev-month')"
            >
            </el-button>
            <div class="w-[160px] h-full text-center leading-[32px]">
              {{ date }}
            </div>

            <el-button
              text
              :icon="ArrowRight"
              @click="handleChangeCurrentDate(1, 'next-month')"
            >
            </el-button>
            <el-button
              text
              :icon="DArrowRight"
              @click="handleChangeCurrentDate(12, 'next-year')"
            >
            </el-button>
          </div>
        </template>
        <template #date-cell="{ data }">
          <div
            class="flex justify-center items-center h-full"
            :class="[data.isSelected ? 'is-selected' : '']"
            @click="() => handleDateClick(data)"
          >
            <p class="date w-10 h-10 rounded-full leading-[40px] text-center">
              {{ data.day.split("-").slice(2).join() }}日
            </p>
          </div>
        </template>
      </el-calendar>
      <!-- 考勤记录 -->
      <div class="border-t pt-4">
        <div
          class="pl-5 text-[14px] text-text-title leading-[24px] border-l border-l-[rgb(var(--color-primary))] border-l-[2px]"
        >
          {{ moment(currentDate).format("yyyy-MM-DD") }}日考勤记录
          <!-- {{ currentDate }}日考勤记录 -->
        </div>
        <div class="" v-for="item in dateAttList" :key="item">
          <div class="flex mt-4 px-5">
            <div class="w-[72px] h-[72px] bg-[#C4C4C4] flex-0 mr-7">
              <el-image
                style="width: 100%; height: 100%"
                :preview-teleported="true"
                hide-on-click-modal
                :src="item.attendancePic"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[item.attendancePic]"
                fit="cover"
              />
            </div>
            <div
              class="flex-1 flex flex-col justify-between py-1 text-text-title"
            >
              <div class="leading-[26px]" v-if="item.status === 0">
                {{ item.attendanceTime }}
              </div>
              <div class="text-[red]" v-else>缺勤</div>
              <div class="leading-[26px]">
                星期{{ weeks[moment(currentDate).day()] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  withDefaults,
  defineProps,
  defineEmits,
  watch,
  computed,
  nextTick,
} from "vue";
import type {
  FormInstance,
  CalendarDateType,
  CalendarInstance,
} from "element-plus";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  DArrowRight,
  DArrowLeft,
} from "@element-plus/icons-vue";
import { attendanceStatistics } from "@/api";
import moment from "moment";
const currentDate = ref(new Date());

interface Props {
  show: boolean;
  currentData: object;
}
const emit = defineEmits(["update:show"]);
const props = withDefaults(defineProps<Props>(), {
  currentData: () => ({}),
});
const weeks = ["日", "一", "二", "三", "四", "五", "六"];
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // currentDate.value = moment().format("yyyy-MM-DD");
      currentDate.value = new Date();
      queryParams.value = {
        faceLibraryId: props.currentData.faceLibraryId,
        studentNo: props.currentData.studentNo,
        studentId: props.currentData.studentId,
      };
      getMonthAtt();
    } else {
      queryParams.value = {
        faceLibraryId: "",
        studentNo: "",
        studentId: "",
      };
    }
  }
);

const dateAttList = computed(() => {
  if (!currentDate.value) return [];
  return attendanceDayDtoList.value.filter((item) => {
    // let clickDate = new Date(currentDate.value).getTime();
    let clickDate = moment(currentDate.value).startOf("day").valueOf();
    let itemDate = moment(item.dateTime).startOf("day").valueOf();
    return clickDate === itemDate;
  });
});

const queryParams = ref({
  faceLibraryId: "",
  studentNo: "",
  studentId: "",
});

const stuADetailDto = ref({});
const attendanceDayDtoList = ref([]);
const getMonthAtt = async () => {
  try {
    let params = {
      ...queryParams.value,
      mouth: moment(currentDate.value).format("yyyy-MM"),
    };
    const res = await attendanceStatistics.mouthStuAtt(params);
    stuADetailDto.value = res.data?.stuADetailDto;
    attendanceDayDtoList.value = res.data?.attendanceDayDtoList;
  } catch (e) {
    console.log(e);
  }
};

const calendar = ref<CalendarInstance>();
const handleDateClick = (data) => {
  const clickedMonth = moment(data.day).format("yyyy-MM");
  let currentMonth = moment(currentDate.value).format("yyyy-MM");
  // 如果点击的日期是不同月份，需要请求新数据
  if (clickedMonth !== currentMonth) {
    currentDate.value = new Date(data.day);
    getMonthAtt();
  }
};
const handleChangeCurrentDate = (month: number, val: CalendarDateType) => {
  // currentDate.value = new Date(moment(currentDate.value).add(month, "M"));
  // console.log("handleChangeCurrentDate", currentDate.value);
  calendar.value.selectDate(val);
  getMonthAtt();
};

const handleClose = () => {
  emit("update:show", false);
};
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

/* :deep(.el-calendar-day) {
  padding: 0;
} */
</style>
<style scoped>
:deep(.el-dialog__header) {
  padding: 0;
  border: none;
}
:deep(.el-calendar__header) {
  border: none;
}
:deep(.el-calendar-table thead) {
  background-color: #747c83;
}
:deep(.el-calendar-table thead th) {
  color: white;
}
:deep(.el-calendar-day) {
  padding: 0;
}
:deep(.is-today .date) {
  background-color: red;
  color: white;
}
</style>
