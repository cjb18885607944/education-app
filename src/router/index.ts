// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { routerConfig } from "./config";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/DeviceManage",
  },
  ...(routerConfig as RouteRecordRaw[]), // 添加类型断言
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
