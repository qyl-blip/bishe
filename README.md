### 学习文档

## 🎨 墨色黑金贵族主题 - 重构版本

本项目已完全重构，采用**墨色黑金贵族系统架构**，提供高级交互和平滑过渡效果。

### ✨ 主要特性

- **贵族色彩体系**: 墨色 (#1a1a2e) + 黑金色 (#d4af37) 组合
- **高级动画库**: 10+ 种预定义动画和过渡效果
- **平滑交互**: 所有组件都采用 cubic-bezier 缓动函数
- **完整设计系统**: 128+ 个 LESS 变量支持快速定制
- **Ant Design 定制**: 完全适配的深色贵族主题

### 📋 部署步骤

1. 修改 `src/utils/theme.ts` 中的配置（如需调整颜色）
2. 修改 `build/constant.ts` 中的 BASE_URL
3. `npm run build`
4. 将 dist 部署到 nginx

### 📖 配置解释

| 文件 | 说明 |
|------|------|
| `src/styles/theme.less` | 核心主题变量定义（128+变量） |
| `src/styles/reset.less` | 全局重置样式 |
| `src/styles/base.less` | 基础工具类 |
| `src/styles/index.less` | Ant Design 和组件定制 |
| `src/styles/animations.less` | 动画库和交互增强 |
| `src/utils/theme.ts` | 主题管理工具 |
| `THEME_GUIDE.md` | 详细主题使用指南 |

### 🎯 快速开始

#### 开发
```bash
npm install
npm run dev  # http://localhost:8009
```

#### 构建
```bash
npm run build
npm run preview
```

### 🎨 色彩参考

#### 主色板
- **深墨色** (Primary): `#1a1a2e`
- **黑金色** (Secondary): `#d4af37`
- **深背景** (Background): `#16213e`
- **浅背景** (Light): `#e8eaf6`

#### 功能色
- **成功**: `#52c41a`
- **警告**: `#faad14`
- **错误**: `#f5222d`
- **信息**: `#1890ff`

### 📚 使用指南

详见 `THEME_GUIDE.md` 获取：
- 完整的设计系统说明
- 动画库使用方法
- 组件定制指南
- 最佳实践建议

### ⚡ 交互增强特性

✅ 按钮水波纹效果
✅ 卡片悬停升起
✅ 菜单项平滑过渡
✅ 表单获焦提示
✅ 滚动条黑金渐变
✅ 黑金闪烁发光效果
✅ 平滑的所有过渡（300ms cubic-bezier）

### 📁 项目结构

```
src/
├── styles/               # 设计系统
│   ├── theme.less       # 核心变量
│   ├── animations.less  # 动画库
│   └── ...
├── utils/
│   └── theme.ts         # 主题工具
├── views/               # 页面组件
├── components/          # 可复用组件
├── api/                 # API 接口
└── ...
```

### 🔧 环境变量

详见 `.env.development` 和 `.env.production`

### ❓ 常见问题

**Q: 如何修改主题色？**
A: 编辑 `src/styles/theme.less` 中的 `@primary-color` 和 `@secondary-color`

**Q: 如何调整动画速度？**
A: 修改 `@transition-duration-base` 的值（默认 300ms）

**Q: 滚动条样式不生效？**
A: 确保使用 Chrome/Edge 浏览器，WebKit 浏览器才支持此样式

### 🚀 CDN 资源

```
Ant Design CSS: https://cdn.staticfile.org/ant-design-vue/3.2.20/antd.min.css
ECharts: https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js
```

### 📞 技术栈

- Vue 3.2
- Vite 4
- Ant Design Vue 3.2
- LESS
- TypeScript

### 🎓 学习资源

- [Vue 3 文档](https://v3.vuejs.org/)
- [Ant Design Vue](https://www.antdv.com/)
- [Vite 文档](https://vitejs.dev/)

---

**享受贵族黑金主题的开发体验！** ✨👑
