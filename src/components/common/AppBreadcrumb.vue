<!-- components/common/AppBreadcrumb.vue -->
<template>
  <div
    class="flex items-center bg-transparent"
    :class="hasBorder ? 'border-b border-gap' : ''"
    :style="{ height: props.height + 'px' }"
  >
    <div
      class="w-4 h-4 mr-4 bg-[url(@/assets/images/icon_back.png)] bg-center bg-no-repeat cursor-pointer"
      @click="router.back()"
    ></div>
    <el-breadcrumb separator="/">
      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <el-breadcrumb-item :to="item.path">
          <span
            class="font-bold"
            :class="
              index === breadcrumbItems.length - 1
                ? 'text-[rgba(0,0,0,0.65)]'
                : 'text-[rgba(0,0,0,0.45)]'
            "
          >
            {{ item }}
          </span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Props {
  height?: number;
  className?: string; // 班级名称
  hasBorder?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 70,
  className: "",
  hasBorder: true,
});

const route = useRoute();
const router = useRouter();

const breadcrumbItems = computed(() => {
  const matched = route.matched;
  const result = matched[0].meta?.breadcrumb || [];

  // 如果提供了班级名称，替换最后一项
  if (props.className && result.length > 0) {
    return [...result, props.className];
  }

  return result;
});
</script>
