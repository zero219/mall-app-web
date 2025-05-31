<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-data-breadcrumb :crumbData="crumbData"></my-data-breadcrumb>
    <!-- 查询条件 -->
    <my-query-panel
      :queryForm="queryForm"
      @queryFilter="queryFilter"
    ></my-query-panel>
    <!-- 表格列表 -->
    <my-query-result>
      <my-data-table
        :tableTitle="tableTitle"
        :tableHeaderButtons="tableHeaderButtons"
        :checkbox="true"
        :isIndex="true"
        :options="options"
        :data="dataList"
        :pager="pager"
        :menuWidth="200"
      >
        <template #menu="scope">
          <el-button
            size="mini"
            type="danger"
            @click="confirmDataItem({ action: 'del', id: scope.row.id })"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="assignClaims(scope.row.id)"
            >分配权限</el-button
          >
        </template>
      </my-data-table>
    </my-query-result>
    <!-- 添加角色弹窗 -->
    <my-data-modal
      ref="saveDataModal"
      :title="modalTitle"
      size="sm"
      @ok="saveRole('roleForm')"
      @reset="resetForm('roleForm')"
    >
      <template slot="body">
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="roleRules"
          label-width="80px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input
              placeholder="请输入角色名"
              v-model="roleForm.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="正式名称" prop="normalizedName">
            <el-input
              placeholder="请输入正式名称"
              v-model="roleForm.normalizedName"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-data-modal>
    <!-- 确认弹窗 -->
    <my-confirm-modal
      ref="confirmModal"
      @confirm="confirmDataItem"
    ></my-confirm-modal>
    <!-- 分配权限 -->
    <my-data-modal ref="claimDataModal" title="权限" size="md" @ok="saveClaims">
      <template slot="body">
        <el-tree
          ref="treeClaims"
          :data="treeDataClaims"
          show-checkbox
          default-expand-all
          node-key="id"
        >
        </el-tree>
      </template>
    </my-data-modal>
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

const { proxy } = getCurrentInstance();
// const message = useMessage();

const crumbData = reactive({
  toPath: "/home",
  toPathName: "首页",
  menuParent: "角色管理",
  menuVal: "角色列表",
});

const queryForm = reactive({
  conditions: [{ type: "input", label: "正式名称", roleName: "" }],
});

const searchFilter = ref([]);
const tableTitle = ref("角色列表");

const tableHeaderButtons = [
  {
    setEventKey: "company-add",
    type: "primary",
    clickFunc: () => addFun(),
    buttonName: "添加",
  },
];

const options = [
  { prop: "id", label: "id", minWidth: "100px" },
  { prop: "roleName", label: "角色名称", minWidth: "100px" },
  { prop: "roleCode", label: "角色编码", minWidth: "100px" },
  { prop: "description", label: "描述", minWidth: "100px" },
  { prop: "createTime", label: "创建时间", minWidth: "100px" },
  { prop: "updateTime", label: "更新时间", minWidth: "100px" },
];

const dataList = ref([]);
const pager = reactive({
  total: 10,
  current: 1,
  size: 10,
});

const modalTitle = ref("");
const roleForm = reactive({
  roleName: "",
  normalizedName: "",
});

const roleRules = {
  roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  normalizedName: [
    { required: true, message: "请输入正式名称", trigger: "blur" },
  ],
};

const treeDataClaims = ref([]);
const confirmItem = ref({});
const roleClaimsId = ref(null);

const saveDataModalRef = ref(null);
const confirmModalRef = ref(null);
const claimDataModalRef = ref(null);
const treeClaimsRef = ref(null);

const queryFilter = (val) => {
  searchFilter.value = val;
};

const getDataList = () => {
  dataList.value = [];
  const _params = {
    roleName: searchFilter.value[0]?.roleName || null,
  };
  proxy.$http.get(api.sysRoleFindByPage, { params: _params }).then((res) => {
    console.log(res);

    if (res !== null && res.records.length > 0) {
      dataList.value = res.records;
      pager.value.total = res.records.total;
    }
  });
};

const addFun = () => {
  modalTitle.value = "添加角色";
  saveDataModalRef.value.show();
};

const resetForm = (formEl) => {
  formEl.resetFields();
};

const saveRole = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      const _params = {
        roleName: roleForm.roleName,
        normalizedName: roleForm.normalizedName,
      };
      // proxy.$http.post(api.roles, _params).then((res) => {
      //   if (res.status === 201) {
      //     saveDataModalRef.value.hide();
      //     message.success("操作成功");
      //     getDataList();
      //   }
      // });
    }
  });
};

const confirmDataItem = (item) => {
  const action = item ? item.action : confirmItem.value.action;
  if (item) confirmItem.value = item;
  if (action === "del") delConfirm(confirmModalRef.value, item);
};

const delConfirm = (modal, item) => {
  if (item) {
    modal.modal("删除", "确认删除吗？");
  } else {
    modal.hide();
    // proxy.$http
    //   .delete(api.rolesId.replace("{roleId}", confirmItem.value.id))
    //   .then((res) => {
    //     if (res.status === 204) {
    //       getDataList();
    //       message.success("操作成功");
    //     }
    //   });
  }
};

const getClaimList = () => {
  treeDataClaims.value = [];
  // proxy.$http.get(api.claimsTree).then((res) => {
  //   if (res.status === 200) {
  //     treeDataClaims.value = res.data;
  //   }
  // });
};

const assignClaims = (index) => {
  roleClaimsId.value = index;
  claimDataModalRef.value.show();
  // proxy.$http.get(api.roleClaims.replace("{roleId}", index)).then((res) => {
  //   treeClaimsRef.value.setCheckedNodes(res.data);
  // });
};

const saveClaims = () => {
  const claimsNodes = treeClaimsRef.value.getCheckedNodes(true, false);
  const params = {
    claims: claimsNodes,
  };
  // proxy.$http
  //   .post(api.roleClaims.replace("{roleId}", roleClaimsId.value), params)
  //   .then((res) => {
  //     if (res.status === 201) {
  //       message.success("操作成功");
  //       claimDataModalRef.value.hide();
  //     }
  //   });
};

onMounted(() => {
  getDataList();
  getClaimList();
});
</script>

<style lang="less" scoped></style>
