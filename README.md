# 家政服务管理系统 - 前端

基于 Vue 3 + Ant Design Vue 的家政服务管理系统前端项目，采用墨色黑金贵族主题设计。

## 技术栈

- Vue 3.2
- Vite 4
- Ant Design Vue 3.2
- TypeScript 4.9
- Pinia (状态管理)
- Vue Router 4
- Axios
- ECharts 6
- LESS

## 主要功能

- 用户管理 (注册、登录、个人中心)
- 家政服务浏览与搜索
- 服务分类与标签
- 在线预约与订单管理
- 地址管理
- 服务收藏与心愿单
- 评论与评分
- 公告通知
- 管理后台 (用户、订单、服务管理)

## 项目结构

```
src/
├── api/                 # API 接口定义
├── assets/              # 静态资源
├── components/          # 可复用组件
├── router/              # 路由配置
├── store/               # Pinia 状态管理
├── styles/              # 全局样式和主题
│   ├── theme.less      # 主题变量
│   ├── animations.less # 动画库
│   └── index.less      # 样式入口
├── utils/               # 工具函数
├── views/               # 页面组件
│   ├── index/          # 前台页面
│   ├── admin/          # 管理后台
│   └── local/          # 本地服务页面
└── App.vue
```

## 快速开始

### 环境要求

- Node.js 14+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
npm run dev
```

访问 http://localhost:8009

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 主题特性

### 现代清爽蓝主题

- 主色调：科技蓝 (#1677ff)
- B 端后台统一风格设计
- 简洁大气、留白充足、层次清晰
- 完整的 Ant Design 浅色主题适配

### 交互增强

- 平滑的过渡动画 (260ms cubic-bezier)
- 卡片悬停阴影效果
- 表单获焦提示
- 统一的视觉反馈

### 主题定制

修改 `src/styles/theme.less` 中的变量即可定制主题：

```less
@blue-500: #1677ff;           // 主色
@surface-2: #f0f2f5;          // 页面背景
@transition-duration-base: 260ms;  // 动画时长
```

## 配置说明

### API 地址配置

修改 `build/constant.ts` 中的 `BASE_URL` 配置后端接口地址。

### 环境变量

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 部署

1. 构建生产版本：
```bash
npm run build
```

2. 将 `dist` 目录部署到 Nginx 或其他静态服务器

3. Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:8009;
    }
}
```

## 浏览器支持

- Chrome (推荐)
- Edge
- Firefox
- Safari

## License

MIT
