import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login/index.vue' 
import home from '../views/home/index.vue' 
import sysUser from '../views/sysUser/index.vue'
import sysRole from '../views/sysRole/index.vue'
import sysMenu from '../views/sysMenu/index.vue'

const routes = [
  {
    path: '/',          // 根路径
    redirect: '/login', // 自动重定向到 /login
  },
  {
    path: '/login',     // 登录页路径
    name: 'login',
    component: login,   // 使用 Login 组件
  },
  {
    path: '/home',     // 登录页路径
    name: 'home',
    component: home,   // 使用 Login 组件
    children: [
        // { path: '/Welcome', name: 'Welcome', component: Welcome },
        { path: '/sysUser', name: 'sysUser', component: sysUser },
        { path: '/sysRole', name: 'sysRole', component: sysRole },
        { path: '/sysMenu', name: 'sysMenu', component: sysMenu },
        // { path: '/Companies', name: 'Company', component: Company },
        // { path: '/Employees', name: 'Employee', component: Employee },
        // { path: '/Results', name: 'Results', component: Results },
      ],
  },
  // 其他路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router