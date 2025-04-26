<!-- MainLayout.vue -->
<template>
  <div class="flex h-screen bg-bg-light relative">
    <!-- 侧边栏 -->
    <aside class="w-[278px] relative z-0 flex-shrink-0">
      <h2 class="pt-6 pb-3.5 px-4 font-bold text-base text-text-title">
        主菜单
      </h2>
      <!-- 菜单列表 -->
      <div class="px-3">
        <div
          v-for="menu in routerConfig"
          :key="menu.path"
          :class="[
            'group flex items-center h-10 rounded mb-2 px-4 cursor-pointer',
            isActive(menu)
              ? 'bg-primary text-menu-active'
              : 'text-secondary hover:bg-primary hover:text-white',
            menu.meta.showNavigate ? '' : 'hidden',
          ]"
          @click="handleMenuClick(menu.path)"
          @mouseenter="hoveredPath = menu.path"
          @mouseleave="hoveredPath = ''"
        >
          <div
            class="relative w-5 h-5 mr-2.5"
            v-html="menuIcons[menu.path]"
          ></div>
          <span class="text-sm">{{ menu.meta.title }}</span>
        </div>
      </div>
    </aside>

    <!-- 渐变背景 -->
    <div class="absolute bottom-0 left-0 w-full h-[473px]">
      <img
        src="@/assets/images/bg_tree.png"
        alt="background"
        class="absolute z-10 bottom-0 left-10 object-cover"
      />
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            180deg,
            rgba(0, 105, 186, 0) 3.817%,
            rgba(0, 105, 186, 0.52) 98.473%
          );
          opacity: 0.24;
        "
      ></div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-6 pl-0 relative z-10 min-w-0">
      <main class="w-full h-full bg-bg-main rounded-md shadow-sm overflow-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { routerConfig } from "@/router/config";
import { ref, computed, onMounted } from "vue";
import { loadSvgContent } from "@/utils";
const hoveredPath = ref("");
const route = useRoute();
const router = useRouter();

const menuIcons = ref<Record<string, string>>({});

onMounted(async () => {
  for (const menu of routerConfig) {
    if (menu.icon) {
      menuIcons.value[menu.path] = await loadSvgContent(
        menu.icon.default || menu.icon
      );
    }
  }
});

// 判断菜单是否激活
const isActive = useMemoize((menu) => {
  return route.meta.breadcrumb.includes(menu.meta.title);
});

function useMemoize<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// 处理菜单点击
const handleMenuClick = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
/* 添加字体 */
@font-face {
  font-family: "Microsoft YaHei";
  src: local("Microsoft YaHei");
}

* {
  font-family: "Microsoft YaHei", sans-serif;
}
</style>
