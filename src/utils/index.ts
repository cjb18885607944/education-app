/**
 * 下载文件流
 * @param data 文件流数据 (Blob 数据)
 * @param fileName 文件名(带后缀)
 */
export const downloadFileFromBlob = (response: any): void => {
  // 从响应头获取文件名
  const contentDisposition = response.headers?.["content-disposition"];
  let fileName = "";

  if (contentDisposition) {
    // 提取并解码文件名
    const matches = /filename=(.+)/.exec(contentDisposition);
    if (matches?.[1]) {
      fileName = decodeURIComponent(matches[1]);
    }
  }

  // 如果没有获取到文件名，使用默认名称
  if (!fileName) {
    fileName = `文件${Date.now()}.xlsx`;
  }

  // 创建a标签用于下载
  const link = document.createElement("a");
  // 创建blob url
  const blob = new Blob([response.data], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
/**
 * 将数组转换为重复参数的URL查询字符串
 * @param paramName - 参数名称
 * @param array - 需要转换的数组
 * @param prefix - URL前缀（可选）
 * @returns 完整的URL查询字符串
 */
export const arrayToUrlParams = (
  paramName: string,
  array: (string | number)[],
  prefix = ""
): string => {
  if (!array || array.length === 0) return "";

  // 构建查询参数
  const queryParams = array
    .map((item) => `${paramName}=${encodeURIComponent(item)}`)
    .join("&");

  // 如果有前缀，添加问号；如果没有，检查前缀末尾是否已有问号
  const questionMark = prefix ? (prefix.includes("?") ? "" : "?") : "?";

  return `${prefix}${questionMark}${queryParams}`;
};

// src/utils/svgLoader.ts
export const loadSvgContent = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text
      .replace(/stroke="#[0-9A-Fa-f]{6}"/g, 'stroke="currentColor"')
      .replace(/stroke-opacity="[^"]*"/g, "")
      .replace(/fill-opacity="[^"]*"/g, "");
  } catch (error) {
    console.error("Failed to load SVG:", error);
    return "";
  }
};
