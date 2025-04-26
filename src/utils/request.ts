// src/utils/request.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { ElLoading, ElMessage } from "element-plus";

const request = axios.create({
  baseURL: "",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

let loadingInstance: any = null;

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const loadingOption = {
      lock: true,
      text:
        config.headers?.["Content-Type"] === "multipart/form-data"
          ? "上传中"
          : "加载中",
    };
    loadingInstance = ElLoading.service(loadingOption);
    return config;
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (loadingInstance) {
      loadingInstance.close();
    }
    if (
      response.data.code !== "0" &&
      response.request.responseType !== "blob"
    ) {
      ElMessage.error(response.data.msg);
    }
    return response.data;
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close();
    }
    console.log("request error", error);
    ElMessage.error("网络错误");

    return Promise.reject(error);
  }
);

// GET 请求
export const get = <T = any>(url: string, params?: any): Promise<T> => {
  return request.get(url, { params });
};

// POST 请求
export const post = <T = any>(
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  return request.post(url, data, config);
};

// 上传文件
export const upload = (url: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default request;
