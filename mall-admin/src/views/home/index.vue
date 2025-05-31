<template>
  <el-container class="index-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img
          src="../../assets/logo.jpeg"
          alt=""
          style="width: 60px; height: 60px"
        />
        <span style="color: '#545c64'">后台管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <el-icon color="#303133">
            <Menu></Menu>
          </el-icon>
        </div>
        <el-menu
          class="el-menu-vertical"
          background-color="#fff"
          text-color="#545c64"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          router
          :default-active="activePath"
        >
          <el-sub-menu
            v-for="menu in menuList"
            :key="menu.parentId"
            :index="menu.parentName"
          >
            <template #title>
              <el-icon>
                <component :is="iconsList[menu.path]" />
              </el-icon>
              <span>{{ menu.parentName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="item in menu.menuSubDataVos"
                :key="item.id"
                :index="item.path"
              >
                <template #title>
                  <el-icon>
                    <component :is="iconsList[item.path]" />
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 内容栏 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/index";
import { Menu, Tools, UserFilled, Avatar, Lock } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const menuList = reactive([]);
const iconsList = {
  system: Tools,
  sysUser: UserFilled,
  sysRole: Avatar,
  sysMenu: Lock,
};
const isCollapse = ref(false);
const activePath = ref("0");

onMounted(() => {
  activePath.value = route.path;
  getMenuList();
});

const getMenuList = async () => {
  try {
    const res = await proxy.$http.get(api.menuInfo);
    console.log(res);

    if (!res.success) {
      router.push("/login");
      return;
    }
    Object.assign(menuList, res.data);
  } catch (error) {
    console.error("获取菜单列表失败:", error);
    router.push("/login");
  }
};

// 登出
const logout = () => {
  localStorage.clear();
  router.push("/login");
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style lang="less" scoped>
.index-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #303133;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #fff;
  // 菜单栏右边有边框
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}

// 退出按钮
.toggle-button {
  background-color: #fff;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 800px;
}
</style>
