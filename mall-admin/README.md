### Vue 3 + Vite

### 清除VS Code缓存
```bash
Ctrl + Shift + P

Developer: Reload Window
```

### 准备工作
- 下载node.js (20.13.1)
- 下载nvm (1.1.12)
- 使用vite创建vue3项目，包含TypeScript(大型项目可以考虑)
- 下载`Vue - Official`,主要是支持vue3

#### nvm切换node.js
```bash
# 查看node
nvm list
# 切换node
nvm use 20.13.1(执行不成功用管理员打开cmd)
```

#### 创建项目
```bash
# 创建项目
npm init vite@latest mall-admin -- --template vue (npm init vite@latest mall-admin -- --template vue-ts)

#下载依赖
npm i

# 安装路由
npm install vue-router@4

# 安装element-plus
npm install element-plus --save

#安装less
npm install less

# 安装 pinia，用来替换（vuex）
npm install pinia

# 安装 axios
npm install axios

# 安装 mitt，用来代替vue2中事件总线
npm install mitt
```

### 注
- setup语法糖在vue3.2版本以上已经支持   
- vue3 需要下载`Vue - Official`插件
