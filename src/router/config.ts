// src/router/config.ts
import { Monitor, User, DataLine } from "@element-plus/icons-vue";
import { Component } from "vue";

export interface RouteConfig {
  path: string;
  name: string;
  component?: () => Promise<Component>; // 添加可选的 component 属性
  meta: {
    title: string;
    breadcrumb: string[];
    showNavigate: boolean;
  };
  icon?: string;
  activeIcon?: string;
}

export const routerConfig: RouteConfig[] = [
  {
    path: "/DeviceManage",
    name: "DeviceManage",
    component: () => import("@/views/DeviceManage/DeviceManage.vue"),
    meta: {
      title: "设备管理",
      breadcrumb: ["设备管理", "考勤设备管理"],
      showNavigate: true,
    },
    icon: "bg-[url(@/assets/images/icon_device_normal.png)]",
    activeIcon: "bg-[url(@/assets/images/icon_device_active.png)]",
  },
  {
    path: "/DeviceManage/add",
    name: "DeviceAdd",
    component: () => import("@/views/DeviceManage/AddDevice.vue"),
    meta: {
      title: "添加设备",
      breadcrumb: ["设备管理", "添加设备"],
      showNavigate: false,
    },
  },
  {
    path: "/PersonManage",
    name: "PersonManage",
    component: () => import("@/views/PersonManage/PersonContent.vue"),
    meta: {
      title: "人脸库管理",
      breadcrumb: ["人脸库管理"],
      showNavigate: true,
    },
    icon: "bg-[url(@/assets/images/icon_face_normal.png)]",
    activeIcon: "bg-[url(@/assets/images/icon_face_active.png)]",
  },
  {
    path: "/PersonManage/class",
    name: "ClassManage",
    component: () => import("@/views/PersonManage/ClassManage.vue"),
    meta: {
      title: "人员管理",
      breadcrumb: ["人脸库管理", "人员管理"],
      showNavigate: false,
    },
  },
  {
    path: "/AttendanceStatistics",
    name: "AttendanceStatistics",
    component: () =>
      import("@/views/AttendanceStatistics/AttendanceStatistics.vue"),
    meta: {
      title: "考勤结果",
      breadcrumb: ["考勤结果"],
      showNavigate: true,
    },
    icon: "bg-[url(@/assets/images/icon_atten_normal.png)]",
    activeIcon: "bg-[url(@/assets/images/icon_atten_active.png)]",
  },
  {
    path: "/AttendanceDetail",
    name: "AttendanceDetail",
    component: () =>
      import("@/views/AttendanceStatistics/AttendanceDetail.vue"),
    meta: {
      title: "考勤结果",
      breadcrumb: ["考勤结果"],
      showNavigate: false,
    },
  },
];
