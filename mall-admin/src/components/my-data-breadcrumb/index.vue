<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: crumbData.toPath }">
      {{ crumbData.toPathName }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>{{ crumbData.menuParent }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ crumbData.menuVal }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { defineProps } from "vue";

/**
 * 组件说明：
 * 全局统一的面包屑组件，展示当前路径导航
 */
const props = defineProps({
  crumbData: {
    type: Object,
    default: () => ({
      toPath: "/home",
      toPathName: "首页",
      menuParent: "",
      menuVal: "",
    }),
  },
});
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
