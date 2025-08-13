智能问卷分析系统（Vue + Node.js + Sequelize + 扣子平台 AI）

一个前后端分离的问卷平台，聚焦“游戏化问卷体验 + 动态动画效果 + AI 个性化分析”。

前端采用 Vue3 + Vite + Pinia + Element Plus；后端采用 Node.js + Express + Sequelize + MySQL；
支持接入扣子平台 AI 生成个性化报告，并用 ECharts 呈现统计与分析。

### 功能概述
- 用户端：注册/登录、个人中心（信息/收藏/历史/状态/成就/报告）、问卷浏览与搜索、个性化推荐、动态答题、评分与评论、报告下载
- 后台端：问卷/题目/人员管理，数据统计（完成率/参与人数/答案分布/热门排名）

### 技术栈
- 前端：Vue3、Vite、Pinia、Vue Router、Element Plus、ECharts、Axios
- 动效：CSS3、GSAP、Lottie、SVG
- 后端：Node.js、Express、Sequelize、MySQL、JWT、Axios
- AI 分析：扣子平台 API
- 报告下载：html2canvas + jsPDF

### 目录结构
```
bylw/
  README.md
  frontend/
    package.json
    vite.config.js
    .env.example
    index.html
    src/
      main.js
      App.vue
      router/
        index.js
      stores/
        index.js
      services/
        api.js
      components/
        AnimatedProgress.vue
        GamifiedQuestion.vue
      pages/
        Home.vue
        QuestionnaireList.vue
        QuestionnaireDetail.vue
        Profile.vue
        Achievements.vue
        Reports.vue
  backend/
    package.json
    .env.example
    src/
      server.js
      app.js
      routes/
        health.js
```

当前仓库提供最小可运行骨架：前端（Vite）+ 后端（Express），其余模块以目录占位，便于逐步完善。

### 快速开始
1) 后端启动
```
cd backend
cp .env.example .env  # Windows 请复制后手动改名
npm install
npm run dev           # http://localhost:3000
```

2) 前端启动
```
cd ../frontend
cp .env.example .env  # 如需自定义后端地址
npm install
npm run dev           # http://localhost:5173
```

3) 访问
- 前端：`http://localhost:5173`
- 健康检查接口：`http://localhost:3000/api/health`

### 环境变量
- 前端 `.env`
  - `VITE_API_BASE`：后端 API 基地址，默认 `http://localhost:3000/api`
- 后端 `.env`
  - `PORT`：服务端口（默认 3000）
  - 预留：`KOZI_API_URL`、`KOZI_API_KEY`、`DB_*`（后续扩展 Sequelize + MySQL 时使用）

### 规划与扩展
- 数据库与模型：后续引入 Sequelize 与 MySQL，落地用户、问卷、题目、作答、收藏、成就、报告等模型
- 接口：完善 Auth/Users/Questionnaires/Responses/Analytics/Admin 等路由
- 前端页面：按模块补充业务与动效（液体进度、拖拽排序、翻牌选择、限时挑战等）
- 可视化：ECharts 图表与 html2canvas + jsPDF 报告导出

