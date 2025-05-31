<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-data-breadcrumb :crumbData="crumbData"></my-data-breadcrumb>

    <!-- 查询条件 -->
    <my-query-panel
      :queryForm="queryForm"
      @queryFilter="queryFilter"
    ></my-query-panel>

    <!-- 表格列表  -->
    <my-query-result>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </my-query-result>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import api from "../../api/index";
import {
  MyDataBreadcrumb,
  MyQueryPanel,
  MyQueryResult,
  MyDataTable,
  MyDataModal,
  MyConfirmModal,
} from "../../components";
const crumbData = reactive({
  toPath: "/home",
  toPathName: "首页",
  menuParent: "菜单管理",
  menuVal: "菜单列表",
});
const queryForm = reactive({
  conditions: [{ type: "input", label: "正式名称", roleName: "" }],
});

const searchFilter = ref([]);
const tableDatas = [
  {
    id: 1,
    date: "2016-05-02",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles",
    children: [
      {
        id: 31,
        date: "2016-05-01",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        id: 32,
        date: "2016-05-01",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
      },
    ],
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles",
  },
];

const data = async () => {
  try {
    const res = await proxy.$http.get(api.menuInfo);
    Object.assign(tableData, res.data);
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};
</script>
<style scoped></style>
