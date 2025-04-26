/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // // 主色
        // // primary: "#91BDDF", // 天青蓝调
        // primary: "#35D0D0", // 巍巍青山
        // // 主体内容背景色
        // "bg-main": "#fbfdfd", // 内容背景
        // // 表头色
        // "table-header": "#747C83", // 表格头部背景
        // // 主要正文字体文字颜色
        // "text-main": "#899EAF", // 主要文字
        // // 标题文字颜色
        // "text-title": "rgba(83, 88, 92, 0.8)",
        // // 内容文字颜色
        // "text-content": "rgba(0, 0, 0, 0.6)",
        // // 主菜单选中文字颜色
        // "menu-active": "#FFFFFF", // 白色
        // // 分隔边框颜色
        // "border-gap": "#E2E6E9",
        // // 背景色
        // "bg-light": "#F6FAFD", // 整体背景
        // // 次级按钮
        // "btn-secondary": "#C9D2D9", // 次级按钮
        // // 弱视色
        // "text-weak": "#1B2731", // 54% 弱化文字
        // // 表格一表头复选框
        // "table-checkbox": "#A1A9AF", // 表格复选框
        // // 背景渐变色
        // "gradient-from": "#0069BA", // 渐变起始色，0%
        // "gradient-to": "rgba(0, 105, 186, 0.52)", // 渐变终止色，52%
        // // 卡片背景色
        // "card-bg": "rgba(220, 236, 249, 1)", // 卡片背景 100%
        // "card-light": "rgba(145, 189, 223, 1)", // 卡片浅色 100%

        // 主色调
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "btn-secondary": "rgba(var(--color-btn-secondary))",
        // 背景色系
        "bg-main": "rgb(var(--color-bg-main) / <alpha-value>)",
        "bg-light": "rgb(var(--color-bg-light) / <alpha-value>)",
        "card-bg": "rgb(var(--color-card-bg) / <alpha-value>)",
        "card-light": "rgb(var(--color-card-light) / <alpha-value>)",

        // 文字色系
        "text-main": "rgb(var(--color-text-main) / <alpha-value>)",
        "text-title": "rgb(var(--color-text-title) / <alpha-value>)",
        "text-content": "rgb(var(--color-text-content) / <alpha-value>)",
        "text-weak": "rgb(var(--color-text-weak) / <alpha-value>)",

        // 边框和分割线
        "border-gap": "rgb(var(--color-border-gap) / <alpha-value>)",

        // 表格相关
        "table-header": "rgb(var(--color-table-header) / <alpha-value>)",
        "table-checkbox": "rgb(var(--color-table-checkbox) / <alpha-value>)",

        // 菜单相关
        "menu-active": "rgb(var(--color-menu-active) / <alpha-value>)",

        // 基础颜色
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  plugins: [],
};
