# 星座运势查询系统

基于 Vue3 + TypeScript 的单页应用，提供美观的星座运势查询功能。

## 🌟 项目特点

- ✨ **现代化技术栈**: Vue3 + TypeScript + Vite + Element Plus
- 🎨 **精美界面设计**: 渐变背景、毛玻璃效果、流畅动画
- 📱 **响应式布局**: 完美适配桌面端和移动端
- 🌈 **动态背景**: 支持随机背景图片切换
- 🎵 **背景音乐**: 可选的背景音乐播放功能
- 🔄 **状态管理**: 使用 Pinia 进行状态管理
- 🚀 **高性能**: 优化的加载和渲染性能

## 📋 功能清单

### 核心功能
- [x] 12星座选择下拉框
- [x] 今日/明日运势切换
- [x] 综合运势显示（圆形进度条）
- [x] 详细运势展示（爱情、事业、健康、财运）
- [x] 幸运数字和幸运颜色
- [x] 运势总结描述

### 界面功能
- [x] 动态背景图片切换
- [x] 背景音乐播放控制
- [x] 加载动画效果
- [x] 错误处理提示
- [x] 响应式设计

### 技术功能
- [x] TypeScript 类型安全
- [x] API 请求封装
- [x] 模拟数据支持
- [x] 组件化设计
- [x] SCSS 样式管理

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.3+ | 前端框架 |
| TypeScript | 5.0+ | 类型安全 |
| Vite | 5.0+ | 构建工具 |
| Element Plus | 2.4+ | UI组件库 |
| Axios | 1.6+ | HTTP请求 |
| Pinia | 2.1+ | 状态管理 |
| SCSS | 1.69+ | CSS预处理器 |

## 📁 项目结构

```
src/
├── api/                    # API接口层
│   ├── types.ts           # 类型定义
│   └── horoscope.ts       # 运势API
├── components/            # 组件目录
│   ├── StarSelector.vue   # 星座选择器
│   ├── HoroscopeCard.vue  # 运势卡片
│   └── BackgroundChanger.vue # 背景切换器
├── views/                 # 页面目录
│   └── Home.vue          # 主页面
├── store/                 # 状态管理
│   └── horoscope.ts      # 运势状态
├── assets/               # 静态资源
│   ├── styles/          # 样式文件
│   ├── bg/              # 背景图片
│   └── music/           # 音乐文件
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 7.0+ 或 yarn 1.22+

### 安装依赖
```bash
cd horoscope-app
npm install
```

### API配置
项目已经配置了真实的天行数据API密钥：`251b6d9ae33c107e74d5e3d89ebd6ea1`

你也可以在 `src/api/horoscope.ts` 中修改API密钥：
```typescript
export const getHoroscope = async (
  astro: string,
  apiKey: string = '你的API密钥'
)
```

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 查看应用

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 测试API
打开 `test-api.html` 文件可以直接在浏览器中测试API调用。

## 🔧 API 配置

### 天行数据 API
1. 注册账号：https://www.tianapi.com/
2. 获取 API Key
3. 在 `src/store/horoscope.ts` 中配置：
```typescript
const apiKey = ref<string>('YOUR_API_KEY')
```

### API 接口说明
```
接口地址: https://apis.tianapi.com/star/index
请求方式: GET
参数:
  - key: API密钥
  - astro: 星座名称（如"白羊座"）
```

## 🎨 界面预览

### 主要功能
1. **星座选择**: 支持12星座的下拉选择
2. **日期切换**: 今日/明日运势切换
3. **运势展示**: 
   - 综合运势圆形进度条
   - 爱情、事业、健康、财运条形图
   - 幸运数字和颜色
   - 运势总结文字
4. **背景控制**: 随机背景切换和音乐播放

### 样式特色
- 毛玻璃效果卡片
- 渐变色彩搭配
- 流畅的过渡动画
- 响应式布局设计

## 📱 响应式支持

- **桌面端** (≥1200px): 完整功能展示
- **平板端** (768px-1199px): 适配中等屏幕
- **手机端** (<768px): 优化移动体验

## 🔍 浏览器支持

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📝 开发说明

### 添加新星座
在 `src/components/StarSelector.vue` 中的 `constellations` 数组添加新项：
```typescript
{ label: '新星座', value: '新星座', icon: '♈' }
```

### 自定义背景图片
将图片放入 `src/assets/bg/` 目录，并在 `BackgroundChanger.vue` 中更新路径。

### 添加背景音乐
将音乐文件放入 `src/assets/music/` 目录，并在 `BackgroundChanger.vue` 中配置。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 LICENSE 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [天行数据](https://www.tianapi.com/) - API数据提供商
- [Unsplash](https://unsplash.com/) - 背景图片来源

---

**注意**: 这是一个学习项目，请遵守相关API服务的使用条款。