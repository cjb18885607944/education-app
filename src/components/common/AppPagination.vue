<!-- components/common/AppPagination.vue -->
<template>
  <div
    class="flex items-center text-text-content justify-between text-[14px] w-full"
  >
    <!-- 左侧每页条数选择 -->
    <div class="flex items-center text-text-main">
      <div class="mr-5 w-[80px]">共 {{ total }} 条</div>
      <span>每页</span>
      <el-select
        v-model="pageSize"
        class="mx-2 !w-[80px]"
        @change="handleSizeChange"
      >
        <el-option
          v-for="size in pageSizes"
          :key="size"
          :value="size"
          :label="`${size}条`"
        />
      </el-select>
      <span>条</span>
    </div>

    <!-- 右侧分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next,jumper"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineEmits, defineProps } from "vue";

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
  pageSizes?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50],
});

const emit = defineEmits([
  "update:pageSize",
  "update:currentPage",
  "size-change",
  "current-change",
]);

// 双向绑定
const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit("update:pageSize", value),
});

const currentPage = computed({
  get: () => props.currentPage,
  set: (value) => emit("update:currentPage", value),
});

// 事件处理
const handleSizeChange = (value: number) => {
  emit("size-change", value);
};

const handleCurrentChange = (value: number) => {
  emit("current-change", value);
};
</script>

<style scoped>
:deep(.el-pagination) {
  justify-content: flex-end;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--el-color-primary);
}

:deep(.el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-select .el-input) {
  width: 80px;
}

:deep(.el-pagination button) {
  background: transparent;
}
:deep(.el-pager li) {
  background: transparent;
}
</style>
