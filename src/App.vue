<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  const handler = (e) => {
    if (
      e.message ===
      "ResizeObserver loop completed with undelivered notifications."
    ) {
      const resizeObserverError =
        e instanceof Error && e.message.includes("ResizeObserver");
      if (resizeObserverError) {
        e.stopImmediatePropagation();
      }
    }
  };

  window.addEventListener("error", handler);

  onUnmounted(() => {
    window.removeEventListener("error", handler);
  });
});
</script>
<style lang="scss"></style>
