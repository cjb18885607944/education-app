<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  window.addEventListener("error", (e) => {
    if (
      e.message ===
      "ResizeObserver loop completed with undelivered notifications."
    ) {
      e.stopImmediatePropagation();
    }
  });
});
</script>
<style lang="scss">
:root {
  --el-color-primary: #91bddf;
  --el-button-border-color: #91bddf;
}
:deep(.el-button) {
  height: 32px;
  border: none;
}
</style>
