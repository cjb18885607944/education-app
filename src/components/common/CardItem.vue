<!-- components/common/CardItem.vue -->
<template>
  <div
    class="relative w-[296px] h-[120px] rounded-[4px] cursor-pointer overflow-hidden group shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
  >
    <!-- 渐变背景 -->
    <div
      class="absolute inset-0"
      style="
        background: linear-gradient(
          180deg,
          rgb(220, 236, 249),
          rgb(145, 189, 223) 99.237%
        );
      "
    ></div>

    <!-- 背景图片 -->
    <img
      src="@/assets/images/bg_card.png"
      class="absolute inset-0 w-full h-full object-cover"
      alt=""
    />

    <!-- 勾选图标 -->
    <div class="absolute right-0 top-0 h-[37px] w-[47px] overflow-hidden">
      <div
        class="absolute right-0 top-0 h-[64px] w-[64px] transform translate-x-[28px] translate-y-[-39px] rotate-[38deg] group-hover:bg-primary"
        :class="selected ? 'bg-primary' : 'bg-white'"
      ></div>
      <el-icon
        class="absolute right-1 top-1.5 z-10 transform group-hover:text-white"
        :class="selected || hover ? 'text-white' : 'text-primary'"
      >
        <Check />
      </el-icon>
    </div>

    <!-- 内容 -->
    <div
      class="relative z-10 text-white h-full flex flex-col items-center justify-center"
    >
      <h3 class="text-[14px] font-normal mb-2">{{ title }}</h3>
      <div class="text-[12px] opacity-80">{{ count }}人</div>
    </div>

    <!-- hover时显示的操作栏 -->
    <div
      class="absolute left-0 right-0 bottom-0 h-[28px] bg-[rgba(255,255,255,.12)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
    >
      <div
        class="h-full flex-1 flex items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.1)]"
        @click.stop="handleEdit"
      >
        <img
          src="@/assets/images/icon_card_edit.png"
          class="w-4 h-4 mr-4"
          alt=""
        />
        <span class="text-white text-sm">编辑</span>
      </div>
      <div class="w-[1px] h-3 bg-white opacity-30"></div>
      <div
        class="h-full flex flex-1 items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.1)]"
        @click.stop="handleDelete"
      >
        <img
          src="@/assets/images/icon_card_delete.png"
          class="w-4 h-4 mr-4"
          alt=""
        />
        <span class="text-white text-sm">删除</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from "@element-plus/icons-vue";
import { withDefaults, defineProps, defineEmits } from "vue";
interface Props {
  title: string;
  count: number;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emit = defineEmits(["select", "edit", "delete"]);

const handleSelect = () => {
  emit("select");
};

const handleEdit = () => {
  emit("edit");
};

const handleDelete = () => {
  emit("delete");
};
</script>
