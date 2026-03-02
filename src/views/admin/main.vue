<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      collapsible 
      class="custom-sider"
    >
      <div class="logo-container">
        <img :src="logo" class="header-logo-img" />
        <span class="header-title" v-show="!collapsed">家政管理</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleClick"
        class="custom-menu"
      >
        <a-menu-item key="thing">
          <database-outlined />
          <span>家政管理</span>
        </a-menu-item>
        <a-menu-item key="classification">
          <layout-outlined />
          <span>服务管理</span>
        </a-menu-item>
        <a-menu-item key="tag">
          <tag-outlined />
          <span>标签管理</span>
        </a-menu-item>
        <a-menu-item key="comment">
          <comment-outlined />
          <span>评论管理</span>
        </a-menu-item>
        <a-menu-item key="order">
          <dollar-outlined />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="user">
          <user-outlined />
          <span>用户管理</span>
        </a-menu-item>
        <a-sub-menu>
          <template #icon>
            <folder-outlined />
          </template>
          <template #title>运营管理</template>
          <a-menu-item key="ad">
            <appstore-outlined />
            <span>广告管理</span>
          </a-menu-item>
          <a-menu-item key="notice">
            <appstore-outlined />
            <span>通知公告</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <template #icon>
            <folder-outlined />
          </template>
          <template #title>日志管理</template>
          <a-menu-item key="loginLog">
            <appstore-outlined />
            <span>登录日志</span>
          </a-menu-item>
          <a-menu-item key="opLog">
            <appstore-outlined />
            <span>操作日志</span>
          </a-menu-item>
          <a-menu-item key="errorLog">
            <appstore-outlined />
            <span>错误日志</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="overview">
          <home-outlined />
          <span>统计分析</span>
        </a-menu-item>
        <a-menu-item key="sysInfo">
          <info-circle-outlined />
          <span>系统信息</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="admin-header">
        <div class="header-left">
          <span class="page-title">{{ getPageTitle(route.name) }}</span>
        </div>
        <div class="header-right">
          <a-button type="link" @click="handlePreview">前台预览</a-button>
          <span class="user-info">欢迎您，{{ userStore.admin_user_name }}</span>
          <a class="header-quit" @click="handleLogout">退出</a>
        </div>
      </a-layout-header>
      <a-layout-content class="admin-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import logo from '/@/assets/images/logo.png';

import {
  HomeOutlined,
  AppstoreOutlined,
  FolderOutlined,
  UserOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  TagOutlined,
  PieChartOutlined,
  DollarOutlined,
  LayoutOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue';

import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '/@/store';

const userStore = useUserStore();

const selectedKeys = ref<any[]>([]);
const collapsed = ref<boolean>(JSON.parse(localStorage.getItem('admin_sider_collapsed') || 'false'));

const router = useRouter();
const route = useRoute();

const handleClick = ({ item, key, keyPath }) => {
  console.log('点击路由===>', key);
  router.push({
    name: key,
  });
};

const handlePreview = () => {
  const text = router.resolve({ name: 'index' });
  window.open(text.href, '_blank');
};

const getPageTitle = (name) => {
  const titleMap: Record<string, string> = {
    thing: '家政管理',
    classification: '服务管理',
    tag: '标签管理',
    comment: '评论管理',
    order: '订单管理',
    user: '用户管理',
    ad: '广告管理',
    notice: '通知公告',
    loginLog: '登录日志',
    opLog: '操作日志',
    errorLog: '错误日志',
    overview: '统计分析',
    sysInfo: '系统信息',
  };
  return titleMap[name as string] || '后台管理';
};

onMounted(() => {
  console.log('当前路由===>', route.name);
  selectedKeys.value = [route.name];
});

watch(() => route.name, (newName) => {
  console.log('路由变化===>', newName);
  selectedKeys.value = [newName];
});

watch(collapsed, (val) => {
  localStorage.setItem('admin_sider_collapsed', JSON.stringify(val));
});

const handleLogout = () => {
  userStore.adminLogout().then(() => {
    router.push({ name: 'adminLogin' });
  });
};
</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

#components-layout-demo-custom-trigger {
  height: 100vh;
  background: linear-gradient(135deg, #FFF9E6 0%, #F5F5F5 50%, #FFF3E0 100%);
  display: flex;
  flex-direction: row;
}

#components-layout-demo-custom-trigger > .ant-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-sider {
  background: linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #E8F5E9 100%) !important;
  box-shadow: 4px 0 24px rgba(129, 199, 132, 0.15) !important;
  z-index: 100;
  border-right: 1px solid rgba(129, 199, 132, 0.2) !important;
  flex: 0 0 220px !important;
  max-width: 220px !important;
  min-width: 220px !important;
  width: 220px !important;
  border-radius: 0 24px 24px 0;
  margin: 12px 0;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.custom-sider::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(200, 230, 201, 0.8), transparent);
  pointer-events: none;
  border-radius: 0 0 24px 0;
}

.custom-sider.ant-layout-sider-collapsed {
  flex: 0 0 80px !important;
  max-width: 80px !important;
  min-width: 80px !important;
  width: 80px !important;
}

/* 隐藏折叠按钮 */
:deep(.ant-layout-sider-trigger) {
  display: none !important;
}

:deep(.custom-sider .ant-layout-sider-children) {
  background: transparent !important;
}

.logo-container {
  height: 72px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.6) !important;
  border-bottom: 1px solid rgba(129, 199, 132, 0.2) !important;
  border-radius: 0 24px 0 0;
  backdrop-filter: blur(10px);

  .header-logo-img {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header-logo-img:hover {
    transform: scale(1.05) rotate(5deg);
  }

  .header-logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header-logo-icon:hover {
    transform: scale(1.05) rotate(5deg);
  }

  .header-logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(129, 199, 132, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header-logo:hover {
    transform: scale(1.05) rotate(5deg);
  }

  .header-title {
    margin-left: 14px;
    color: #2E7D32 !important;
    font-weight: 700;
    font-size: 18px;
    white-space: nowrap;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  }
}

:deep(.ant-menu.ant-menu-dark) {
  background: transparent;
  padding: 12px 0;
}

:deep(.ant-menu-dark .ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 16px;
  width: calc(100% - 32px);
  border-radius: 16px;
  padding-left: 20px !important;
  padding-right: 16px !important;
  display: flex;
  align-items: center;
  color: #2E7D32 !important;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: visible;
  white-space: nowrap;
}

:deep(.ant-menu-dark .ant-menu-item span) {
  display: inline-block;
  white-space: nowrap;
  overflow: visible !important;
  text-overflow: clip !important;
  color: #2E7D32 !important;
}

:deep(.ant-menu-dark .ant-menu-item::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.15), transparent);
  transition: left 0.5s ease;
}

:deep(.ant-menu-dark .ant-menu-item:hover::before) {
  left: 100%;
}

:deep(.ant-menu-dark .ant-menu-item .anticon) {
  font-size: 18px;
  color: #66BB6A;
  margin-right: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-menu-dark .ant-menu-item:hover) {
  color: #1B5E20 !important;
  background: rgba(255, 255, 255, 0.6) !important;
  transform: translateX(4px);
}

:deep(.ant-menu-dark .ant-menu-item:hover span) {
  color: #1B5E20 !important;
}

:deep(.ant-menu-dark .ant-menu-item:hover .anticon) {
  color: #FFA726;
  transform: scale(1.1) rotate(5deg);
}

:deep(.ant-menu-dark .ant-menu-item-selected) {
  color: #2E7D32 !important;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  font-weight: 600;
  border-left: 4px solid #FFA726;
  padding-left: 16px !important;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
  transform: translateX(4px);
}

:deep(.ant-menu-dark .ant-menu-item-selected span) {
  color: #2E7D32 !important;
}

:deep(.ant-menu-dark .ant-menu-item-selected .anticon) {
  color: #FFA726 !important;
  transform: scale(1.15);
}

:deep(.ant-menu-dark .ant-menu-item-selected a) {
  color: #2E7D32 !important;
}

:deep(.ant-menu-dark .ant-menu-submenu) {
  margin: 4px 16px;
  width: calc(100% - 32px);
}

:deep(.ant-menu-dark .ant-menu-submenu-title) {
  height: 48px;
  line-height: 48px;
  border-radius: 16px;
  padding-left: 20px !important;
  padding-right: 16px !important;
  color: #2E7D32;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  overflow: visible !important;
}

:deep(.ant-menu-dark .ant-menu-submenu-title span) {
  display: inline-block;
  white-space: nowrap;
  overflow: visible !important;
  text-overflow: clip !important;
}

:deep(.ant-menu-dark .ant-menu-submenu-title .anticon) {
  font-size: 18px;
  color: #66BB6A;
  margin-right: 14px;
}

:deep(.ant-menu-dark .ant-menu-submenu-title:hover) {
  color: #1B5E20 !important;
  background: rgba(255, 255, 255, 0.6) !important;
  transform: translateX(4px);
}

:deep(.ant-menu-dark .ant-menu-submenu-arrow) {
  color: #66BB6A !important;
  transition: all 0.3s ease;
}

:deep(.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow) {
  color: #FFA726 !important;
  transform: rotate(180deg);
}

:deep(.ant-menu-dark .ant-menu-sub) {
  background: rgba(255, 255, 255, 0.5) !important;
  padding: 6px 0;
  border-radius: 12px;
  margin: 4px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: visible !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item) {
  height: 44px;
  line-height: 44px;
  padding-left: 52px !important;
  padding-right: 16px !important;
  margin: 2px 8px;
  width: calc(100% - 16px);
  background: transparent;
  color: #2E7D32 !important;
  font-weight: 500;
  white-space: nowrap;
  overflow: visible !important;
  text-overflow: clip !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item span) {
  display: inline-block;
  white-space: nowrap;
  overflow: visible !important;
  text-overflow: clip !important;
  color: #2E7D32 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item .anticon) {
  color: #66BB6A !important;
  font-size: 16px;
  flex-shrink: 0;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.8) !important;
  color: #1B5E20 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item:hover span) {
  color: #1B5E20 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item:hover .anticon) {
  color: #FFA726 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item-selected) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  color: #2E7D32 !important;
  font-weight: 600;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item-selected span) {
  color: #2E7D32 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item-selected .anticon) {
  color: #FFA726 !important;
}

:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item-selected a) {
  color: #2E7D32 !important;
}

.admin-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  margin: 12px 16px 0 16px;
  height: 72px;
  min-width: 0;
  overflow: visible;
}

.admin-content {
  margin: 0;
  min-height: calc(100vh - 96px);
  padding: 24px 16px;
  background: transparent;
  overflow-y: auto;
}

.header-left {
  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #2E7D32;
    font-family: @font-family-display;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .user-info {
    color: #2E7D32;
    font-size: 14px;
    font-weight: 500;
    padding: 0 20px;
    background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
    border-radius: 12px;
    border: 1px solid #C8E6C9;
    box-shadow: 0 2px 8px rgba(129, 199, 132, 0.15);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    overflow: visible;
    text-overflow: clip;
  }

  .user-info:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(129, 199, 132, 0.25);
  }

  .header-quit {
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-size: 14px;
    font-weight: 500;
    padding: 0 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
    border: none;
    box-shadow: 0 2px 8px rgba(244, 81, 30, 0.25);
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
    display: inline-block;

    &:hover {
      background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
      box-shadow: 0 4px 12px rgba(244, 81, 30, 0.35);
      transform: translateY(-2px);
    }
  }
}

:deep(.header-right .ant-btn-link) {
  color: #ffffff;
  font-weight: 500;
  padding: 0 20px !important;
  height: 40px !important;
  line-height: 40px !important;
  border-radius: 12px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.25);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  display: inline-block !important;
  border: none !important;
}

:deep(.header-right .ant-btn-link:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-40px) scale(0.95);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

:deep(#components-layout-demo-custom-trigger .ant-layout-content) {
  padding-top: 0 !important;
  background: transparent !important;
}

:deep(.admin-content .page-view) {
  margin-top: 0 !important;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 表格样式优化 */
:deep(.ant-table) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF9E6 100%) !important;
  color: #2E7D32 !important;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #C8E6C9 !important;
  padding: 16px 12px;
}

:deep(.ant-table-tbody > tr) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-table-tbody > tr:hover) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.1);
}

:deep(.ant-table-tbody > tr > td) {
  padding: 14px 12px;
  border-bottom: 1px solid #F1F8E9 !important;
}

:deep(.ant-table-tbody > tr:nth-child(even)) {
  background: rgba(248, 255, 248, 0.5);
}

:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border: none;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35);
}

:deep(.ant-btn-default) {
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-btn-default:hover) {
  border-color: #FFA726;
  color: #FFA726;
  transform: translateY(-2px);
}

:deep(.ant-input) {
  border-radius: 12px;
  border: 2px solid #FFF3E0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(135deg, #ffffff 0%, #FFFEF7 100%);
}

:deep(.ant-input:hover) {
  border-color: #FFE082;
}

:deep(.ant-input:focus) {
  border-color: #FFA726;
  box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.12);
}

:deep(.ant-input-search-button) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border: none;
  border-radius: 0 12px 12px 0;
  transition: all 0.3s ease;
}

:deep(.ant-input-search-button:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
}

:deep(.ant-tag) {
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 500;
  border: none;
}

:deep(.ant-pagination-item) {
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

:deep(.ant-pagination-item:hover) {
  border-color: #FFA726;
  transform: translateY(-2px);
}

:deep(.ant-pagination-item-active) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border-color: transparent;
}

:deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

/* 滚动条样式 */
.admin-content::-webkit-scrollbar {
  width: 8px;
}

.admin-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.admin-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #66BB6A, #FFA726);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.admin-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5CB860, #FF9800);
}

/* 全局覆盖蓝色样式 */
:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  color: #ffffff !important;
}

:deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td),
:deep(.ant-table-tbody > tr > td.ant-table-cell-row-hover) {
  background: transparent !important;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
}

:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background: rgba(255, 249, 230, 0.5) !important;
  border-bottom: 1px solid #F1F8E9 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #66BB6A !important;
  border-color: #66BB6A !important;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #66BB6A !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #66BB6A !important;
}

:deep(.ant-radio-checked .ant-radio-inner::after) {
  background-color: #66BB6A !important;
}

:deep(.ant-switch-checked) {
  background-color: #66BB6A !important;
}

:deep(.ant-slider-track) {
  background-color: #66BB6A !important;
}

:deep(.ant-slider-handle) {
  border-color: #66BB6A !important;
}

:deep(.ant-progress-bg) {
  background-color: #66BB6A !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #66BB6A !important;
}

:deep(.ant-tabs-ink-bar) {
  background: #66BB6A !important;
}

/* 全局滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 8px !important;
  height: 8px !important;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #66BB6A, #FFA726) !important;
  border-radius: 4px !important;
  transition: all 0.3s ease !important;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #5CB860, #FF9800) !important;
}

:deep(*::-webkit-scrollbar-corner) {
  background: transparent !important;
}

/* 表格滚动条 */
:deep(.ant-table-body::-webkit-scrollbar) {
  width: 8px !important;
  height: 8px !important;
}

:deep(.ant-table-body::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #66BB6A, #FFA726) !important;
  border-radius: 4px !important;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #5CB860, #FF9800) !important;
}

/* 页面内容滚动条 */
:deep(.page-view::-webkit-scrollbar) {
  width: 8px !important;
  height: 8px !important;
}

:deep(.page-view::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

:deep(.page-view::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #66BB6A, #FFA726) !important;
  border-radius: 4px !important;
}

:deep(.page-view::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #5CB860, #FF9800) !important;
}
</style>
