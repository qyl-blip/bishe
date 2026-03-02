# z-index层级修复说明

## 问题分析

用户菜单下拉面板被定位栏遮挡的原因：
- 主导航栏（main-bar-view）和定位栏（location-bar）都使用了`position: relative`
- 定位栏在HTML结构中位于主导航栏之后
- 没有明确的z-index层级，导致后面的元素（定位栏）覆盖了前面元素的子元素（用户菜单）

## 解决方案

建立清晰的z-index层级体系：

```
top-bar-wrapper (z-index: 999)
├── main-bar-view (z-index: 1000)
│   └── user-menu-wrapper (z-index: 10001)
│       └── user-menu-panel (z-index: 10002)
└── location-bar (z-index: 998)
```

### 层级说明

1. **top-bar-wrapper: 999**
   - 整个TopBar组件的基础层级
   - 确保TopBar在页面其他内容之上

2. **main-bar-view: 1000**
   - 主导航栏
   - 比定位栏高2级，确保其子元素能覆盖定位栏

3. **location-bar: 998**
   - 定位城市栏
   - 比主导航栏低，不会遮挡主导航栏的下拉菜单

4. **user-menu-wrapper: 10001**
   - 用户菜单容器
   - 创建新的层叠上下文

5. **user-menu-panel: 10002**
   - 用户菜单下拉面板
   - 最高层级，确保不被任何元素遮挡

## 为什么这样设计？

### 相对层级
- main-bar-view (1000) > location-bar (998)
- 确保主导航栏及其子元素始终在定位栏之上

### 绝对层级
- user-menu-panel使用10002这样的高值
- 即使页面其他地方有高z-index元素，也不会遮挡菜单

### 层叠上下文
- user-menu-wrapper设置z-index创建新的层叠上下文
- 确保user-menu-panel的z-index在正确的上下文中生效

## CSS代码

```css
.top-bar-wrapper {
  z-index: 999;
}

.main-bar-view {
  z-index: 1000;
}

.location-bar {
  z-index: 998;
}

.user-menu-wrapper {
  position: relative;
  z-index: 10001;
}

.user-menu-panel {
  position: absolute;
  z-index: 10002;
}
```

## 测试步骤

1. 重启开发服务器
2. 强制刷新浏览器 (Ctrl+Shift+R)
3. 点击右上角的用户头像
4. 检查"个人设置"和"退出"按钮是否完整显示
5. 确认菜单不被定位栏遮挡

## 预期效果

✅ 点击用户头像后，下拉菜单完整显示
✅ "个人设置"和"退出"按钮都可以正常点击
✅ 菜单不会被定位栏或其他元素遮挡
✅ TopBar和定位栏铺满整个屏幕宽度
✅ 卡片动画正常工作

## 技术要点

### 层叠上下文（Stacking Context）
当元素满足以下条件之一时，会创建新的层叠上下文：
- position不为static，且z-index不为auto
- opacity小于1
- transform不为none
- 等等...

在层叠上下文中，子元素的z-index只在该上下文内有效。

### 为什么需要user-menu-wrapper的z-index？
如果只给user-menu-panel设置z-index，而不给user-menu-wrapper设置，那么user-menu-panel的z-index会在main-bar-view的层叠上下文中计算，可能无法正确覆盖location-bar。

通过给user-menu-wrapper也设置z-index，我们创建了一个新的层叠上下文，确保user-menu-panel能够正确显示在最上层。
