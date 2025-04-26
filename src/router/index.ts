// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { routerConfig } from "./config";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/DeviceManage",
  },
  ...(routerConfig as RouteRecordRaw[]), // 添加类型断言
];

const router = createRouter({
  history: createWebHashHistory("/attendance/"),
  routes,
});

// 清除认证信息
const clearAuth = () => {
  // 删除token
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// 路由守卫
router.beforeEach((to, from, next) => {
  // 访问登录页时清除认证信息
  if (to.path === "/login") {
    clearAuth();
    next();
    return;
  }
  const token = document.cookie.includes("token"); // 简单判断cookie中是否包含token

  if (!token && to.meta.requiresAuth) {
    // 需要登录认证且没有token，重定向到登录页
    next("/login");
  } else {
    next();
  }
});

export default router;
