# 现代清爽蓝主题设计指南

## 项目概述

本项目采用**现代清爽蓝主题**（B 端后台统一风格），目标是统一风格、简单大气、留白充足、层次清晰。

## 🎨 设计系统

### 色彩体系

#### 核心色板
- **主色 (Primary)**: `#1677ff` - 科技蓝
- **深色**: `#0958d9` - 深蓝
- **浅色**: `#4096ff` - 浅蓝

#### 背景色
- **页面背景**: `#f0f2f5`
- **卡片背景**: `#ffffff`
- **次级背景**: `#fafafa`

#### 文字颜色
- **主文字**: `#1f2225`
- **次文字**: `#515a6e`
- **弱文字**: `#999999`

#### 功能色
| 用途 | 颜色 | 十六进制 |
|------|------|----------|
| 成功 | 绿色 | #52c41a |
| 警告 | 橙色 | #faad14 |
| 错误 | 红色 | #ff4d4f |
| 信息 | 蓝色 | #1677ff |

### 阴影系统
- `@shadow-sm`: 细微阴影
- `@shadow-md`: 中等阴影
- `@shadow-lg`: 强阴影
- `@shadow-xl`: 极深阴影

### 圆角系统
- `@radius-sm`: 4px (细节元素)
- `@radius-md`: 8px (基础圆角)
- `@radius-lg`: 12px (卡片)
- `@radius-xl`: 18px (大组件)
- `@radius-pill`: 999px (胶囊按钮)

## ✨ 交互增强

### 过渡时间
- `@transition-duration-fast`: 120ms (快速反应)
- `@transition-duration-base`: 260ms (标准过渡)
- `@transition-duration-slow`: 520ms (缓慢过渡)
- `@transition-timing`: cubic-bezier(0.2, 0.8, 0.2, 1) (缓动函数)

### 组件交互优化

#### 按钮
- 悬停时有视觉反馈
- 平滑的颜色过渡
- 渐变背景效果

#### 表格
- 行悬停效果
- 表头优化
- 平滑的过渡动画

#### 表单输入
- 获焦时的蓝色边框和阴影
- 悬停时的边框提示
- 平滑的边框颜色过渡

#### 卡片
- 悬停时的阴影升级
- 轻微向上的变换效果
- 边框颜色变化

## 📁 项目结构

```
src/
├── styles/
│   ├── theme.less         # 全局主题变量定义
│   ├── reset.less         # 全局重置样式
│   ├── base.less          # 基础组件样式
│   ├── index.less         # Ant Design 定制
│   └── animations.less    # 动画库
├── utils/
│   └── theme.ts           # 主题管理工具
└── ...
```

## 🔧 使用方法

### 在样式中引用主题变量

```less
.my-component {
  background: @surface-1;
  color: @text-primary;
  border: 1px solid @border-color;
  box-shadow: @shadow-md;
  border-radius: @radius-lg;
  transition: all @transition-duration-base @transition-timing;

  &:hover {
    color: @blue-500;
    box-shadow: @shadow-lg;
    transform: translateY(-2px);
  }
}
```

### 修改主题颜色

编辑 `src/styles/theme.less` 文件：

```less
@blue-500: #1677ff;           // 主色
@surface-2: #f0f2f5;          // 页面背景
```

### 调整过渡时间

```less
@transition-duration-base: 300ms;  // 调整过渡速度
```

## 🚀 开发建议

### 1. 保持一致性
- 使用预定义的主题变量而非硬编码颜色
- 使用间距系统（@spacing-*）
- 遵循统一的视觉规范

### 2. 性能优化
- 避免过度使用阴影和渐变
- 优先使用 CSS 变量
- 合理使用 will-change 属性

### 3. 可访问性
- 确保文字对比度符合标准
- 提供键盘导航支持
- 不仅依赖颜色传递信息

## 🔄 主题工具

```typescript
import { initializeTheme, getThemeConfig } from '/@/utils/theme';

// 初始化主题
initializeTheme();

// 获取当前主题配置
const config = getThemeConfig();
```

## 📝 维护指南

### 添加新颜色
1. 在 `theme.less` 中定义新变量
2. 在 `theme.ts` 中添加对应的配置

### 修改组件样式
1. 在 `index.less` 中查找相应的选择器
2. 使用主题变量而非硬编码颜色
3. 添加过渡效果确保平滑交互

## 🎓 示例代码

### 创建现代风格的卡片

```vue
<template>
  <div class="modern-card">
    <div class="card-header">标题</div>
    <div class="card-body">内容</div>
  </div>
</template>

<style scoped lang="less">
@import '/@/styles/theme.less';

.modern-card {
  background: @surface-1;
  border: 1px solid @border-color;
  border-radius: @radius-lg;
  box-shadow: @shadow-md;
  overflow: hidden;
  transition: all @transition-duration-base @transition-timing;

  &:hover {
    box-shadow: @shadow-lg;
    border-color: @blue-500;
    transform: translateY(-2px);
  }

  .card-header {
    background: @surface-3;
    color: @text-primary;
    padding: @spacing-lg;
    border-bottom: 1px solid @border-color;
    font-weight: @font-weight-semibold;
    font-size: @font-size-lg;
  }

  .card-body {
    padding: @spacing-lg;
    color: @text-primary;
  }
}
</style>
```

---

**现代清爽的 B 端后台体验** ✨
