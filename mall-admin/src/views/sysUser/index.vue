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
        :menuWidth="360"
      >
        <template #menu="scope">
          <el-button @click="handleEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="confirmDataItem({ action: 'del', id: scope.row.id })"
            >删除</el-button
          >
          <el-button type="info" @click="assigningRoles(scope.row.id)"
            >分配角色</el-button
          >
        </template>
      </my-data-table>
    </my-query-result>
    <!-- 添加编辑用户 -->
    <my-data-modal
      ref="saveDataModal"
      :title="modalTitle"
      size="md"
      @ok="saveUser('userForm')"
      @reset="resetForm('userForm')"
    >
      <template #body>
        <el-form
          ref="userForm"
          :model="userForm"
          :rules="userRules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="uName">
            <el-input
              placeholder="请输入用户名"
              v-model="userForm.uName"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              placeholder="请输入邮箱"
              v-model="userForm.email"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input
              placeholder="请输入手机"
              v-model="userForm.phone"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" v-if="isPwd">
            <el-input
              placeholder="请输入密码"
              v-model="userForm.pwd"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-data-modal>
    <my-confirm-modal
      ref="confirmModal"
      @confirm="confirmDataItem"
    ></my-confirm-modal>
    <!-- 分配角色 -->
    <my-data-modal ref="rolesDataModal" title="角色" size="md" @ok="saveRoles">
      <template #body>
        <el-tree
          ref="treeRoles"
          :data="treeDataRoles"
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
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index";
import { ElMessage, ElTree, ElForm } from "element-plus";
import {
  MyDataBreadcrumb,
  MyQueryPanel,
  MyQueryResult,
  MyDataTable,
  MyDataModal,
  MyConfirmModal,
} from "../../components";
// 全局属性引用
const { proxy } = getCurrentInstance();

const router = useRouter();

// 面包屑
const crumbData = ref({
  toPath: "/home",
  toPathName: "首页",
  menuParent: "用户管理",
  menuVal: "用户列表",
});

// 查询条件
const queryForm = ref({
  conditions: [
    {
      type: "input",
      label: "名称",
      userName: "",
    },
  ],
});

const searchFilter = ref([]);
const tableTitle = ref("用户列表");
const tableHeaderButtons = ref([
  {
    setEventKey: "company-add",
    type: "primary",
    clickFunc: () => addFun(),
    buttonName: "添加",
  },
  {
    setEventKey: "company-add",
    type: "primary",
    clickFunc: () => confirmDataItem({ action: "exportFun" }),
    buttonName: "导出",
  },
]);

const options = ref([
  { prop: "id", label: "id", minWidth: "100px" },
  { prop: "userName", label: "名称", minWidth: "100px" },
  { prop: "userAlias", label: "邮箱", minWidth: "100px" },
  { prop: "phone", label: "手机", minWidth: "100px" },
  // { prop: "avatar", label: "头像", minWidth: "100px" },
  // { prop: "description", label: "描述", minWidth: "100px" },
  { prop: "isEnabled", label: "是否启用", minWidth: "100px" },
  { prop: "createTime", label: "创建时间", minWidth: "100px" },
  { prop: "updateTime", label: "  修改时间", minWidth: "100px" },
]);

const dataList = ref([]);
const pager = ref({
  total: 10,
  current: 1,
  size: 10,
});

const confirmItem = ref({});
const modalTitle = ref("添加用户");
const userForm = ref({
  uId: "",
  uName: "",
  email: "",
  phone: "",
  pwd: "",
});

const userRules = ref({
  uName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phone: [{ required: true, message: "请输入手机", trigger: "blur" }],
  pwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "长度在至少6个字符", trigger: "blur" },
  ],
});

const isPwd = ref(true);
const treeDataRoles = ref([]);
const treeDataClaims = ref([]);
const userRolesId = ref("");

// Refs
const saveDataModal = ref(null);
const confirmModal = ref(null);
const rolesDataModal = ref(null);
const treeRoles = ref(null);
const userFormRef = ref(null);

// 子组件传值
const queryFilter = (val) => {
  searchFilter.value = val;
  getDataList();
};

// 查询
const getDataList = async () => {
  dataList.value = [];
  const _params = {
    userName: searchFilter.value[0]?.userName || null,
  };
  const res = await proxy.$http.get(api.sysUserFindByPage, {
    params: _params,
  });
  // console.log(res);

  if (res !== null && res.records.length > 0) {
    dataList.value = res.records;
    pager.value.total = res.records.total;
  }
};

// 弹窗
const confirmDataItem = (item) => {
  const modal = confirmModal.value;
  const action = item ? item.action : confirmItem.value.action;
  if (item) {
    confirmItem.value = item;
  }
  switch (action) {
    case "exportFun":
      exportFunConfirm(modal, item);
      break;
    case "del":
      delConfirm(modal, item);
      break;
    default:
      break;
  }
};

// 添加用户
const addFun = () => {
  modalTitle.value = "添加用户";
  isPwd.value = true;
  saveDataModal.value.show();
  userForm.value.uId = "";
};

// 重置
const resetForm = (formName) => {
  formName.resetFields();
};

// 保存
const saveUser = async (formName) => {
  const _params = {
    userName: userForm.value.uName,
    email: userForm.value.email,
    phoneNum: userForm.value.phone,
  };

  const form = userFormRef.value;
  await form.validate((valid) => {
    if (!valid) return false;

    if (userForm.value.uId === "" || userForm.value.uId === null) {
      // 添加
      _params.passWord = userForm.value.pwd;
      // proxy.$http.post(api.user, _params).then((res) => {
      //   if (res.status === 201) {
      //     saveDataModal.value.hide();
      //     ElMessage.success("操作成功");
      //     getDataList();
      //   }
      // });
    } else {
      // 修改
      _params.userId = userForm.value.uId;
      // proxy.$http.put(api.user, _params).then((res) => {
      //   if (res.status === 201) {
      //     saveDataModal.value.hide();
      //     ElMessage.success("操作成功");
      //     getDataList();
      //   }
      // });
    }
  });
};

// 导出
const exportFunConfirm = (modal, item) => {
  if (item) {
    modal.modal("导出", "确认导出吗？");
  } else {
    modal && modal.hide();
  }
};

// 编辑按钮
const handleEdit = (row, index) => {
  modalTitle.value = "编辑用户";
  isPwd.value = false;
  userForm.value.uId = row.id;
  userForm.value.uName = row.userAlias;
  userForm.value.email = row.email;
  userForm.value.phone = row.phone;
  saveDataModal.value.show();
};

// 删除
const delConfirm = (modal, item) => {
  if (item) {
    modal.modal("删除", "确认删除吗？");
  } else {
    modal && modal.hide();
    // proxy.$http
    //   .delete(api.usersId.replace("{userId}", confirmItem.value.id))
    //   .then((res) => {
    //     if (res.status === 204) {
    //       ElMessage.success("操作成功");
    //       getDataList();
    //     }
    //   });
  }
};

// 加载角色
const getRolesList = () => {
  treeDataRoles.value = [];
  // proxy.$http.get(api.rolesTree).then((res) => {
  //   if (res.status === 200) {
  //     treeDataRoles.value = res.data;
  //   }
  // });
};

// 分配角色
const assigningRoles = (index) => {
  userRolesId.value = index;
  rolesDataModal.value.show();
  // proxy.$http.get(api.usersRoles.replace("{userId}", index)).then((res) => {
  //   if (res.status === 200) {
  //     treeRoles.value.setCheckedNodes(res.data);
  //   }
  // });
};

// 保存角色
const saveRoles = () => {
  const rolesNodes = treeRoles.value.getCheckedNodes(true, false);
  const params = {
    roles: rolesNodes,
  };
  // proxy.$http
  //   .post(api.usersRoles.replace("{userId}", userRolesId.value), params)
  //   .then((res) => {
  //     if (res.status === 201) {
  //       ElMessage.success("操作成功");
  //       rolesDataModal.value.hide();
  //     }
  //   });
};

// 加载权限
const getClaimList = () => {
  treeDataClaims.value = [];
  // proxy.$http.get(api.claimsTree).then((res) => {
  //   if (res.status === 200) {
  //     treeDataClaims.value = res.data;
  //   }
  // });
};

onMounted(() => {
  getDataList();
  getRolesList();
  getClaimList();
});
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
